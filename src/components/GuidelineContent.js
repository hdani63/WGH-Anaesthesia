import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

import { getUhwImage } from '../data/uhwImages';
import { COLORS, SPACING } from '../utils/theme';

// Renders the block tree produced from the UHW guideline HTML
// (see scripts/convert_uhw_guidelines.py). Block shapes:
//   { t:'h', level, runs }        { t:'p', runs }
//   { t:'list', ordered, items }  { t:'table', cols, header?, rows }
//   { t:'alert', variant, blocks, badge? }
//   { t:'img', src, alt }         { t:'hr' }
// Inline runs are { s: text, b?: bold, i?: italic }.

const ALERT_STYLES = {
  danger: { bg: '#f8d7da', border: '#dc3545', fg: '#842029', icon: 'exclamation-circle' },
  warning: { bg: '#fff3cd', border: '#ffc107', fg: '#664d03', icon: 'exclamation-triangle' },
  info: { bg: '#cff4fc', border: '#0dcaf0', fg: '#055160', icon: 'info-circle' },
  success: { bg: '#d1e7dd', border: '#198754', fg: '#0a3622', icon: 'check-circle' },
  primary: { bg: '#cfe2ff', border: '#0d6efd', fg: '#084298', icon: 'info-circle' },
  secondary: { bg: '#e2e3e5', border: '#6c757d', fg: '#41464b', icon: 'info-circle' },
};

// Column sizing for horizontally scrolled tables. Wider tables get narrower
// columns so a 6-column dose table stays legible without endless scrolling.
const COL_WIDTH_BY_COUNT = { 2: 200, 3: 165, 4: 150, 5: 135, 6: 125 };
const colWidth = (cols) => COL_WIDTH_BY_COUNT[cols] || (cols > 6 ? 115 : 220);

function runsToText(runs) {
  return (runs || []).map((r) => r.s).join('');
}

/** Inline runs -> a single <Text> with nested bold/italic spans. */
export function Runs({ runs, style }) {
  if (!runs || !runs.length) return null;
  return (
    <Text style={style}>
      {runs.map((r, i) => (
        <Text
          key={i}
          style={[r.b ? styles.bold : null, r.i ? styles.italic : null]}
        >
          {r.s}
        </Text>
      ))}
    </Text>
  );
}

function Heading({ block }) {
  const level = block.level || 2;
  const style = level <= 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;
  return (
    <View style={level <= 2 ? styles.headingWrapMajor : styles.headingWrapMinor}>
      <Runs runs={block.runs} style={style} />
    </View>
  );
}

function BulletList({ block, depth }) {
  return (
    <View style={styles.list}>
      {block.items.map((item, i) => (
        <View key={i} style={styles.listItem}>
          <Text style={styles.listMarker}>
            {block.ordered ? `${i + 1}.` : '•'}
          </Text>
          <View style={styles.listBody}>
            <Blocks blocks={item} depth={depth + 1} compact />
          </View>
        </View>
      ))}
    </View>
  );
}

function Alert({ block, depth }) {
  const v = ALERT_STYLES[block.variant] || ALERT_STYLES.info;
  return (
    <View style={[styles.alert, { backgroundColor: v.bg, borderLeftColor: v.border }]}>
      <FontAwesome5 name={v.icon} size={13} color={v.fg} style={styles.alertIcon} />
      <View style={styles.alertBody}>
        <Blocks blocks={block.blocks} depth={depth + 1} compact textColor={v.fg} />
        {block.badge ? (
          <View style={[styles.badge, { borderColor: v.border }]}>
            <Text style={[styles.badgeText, { color: v.fg }]}>{block.badge}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

function GuidelineImage({ block }) {
  const [zoom, setZoom] = useState(false);
  const { width, height } = useWindowDimensions();
  const img = getUhwImage(block.src);

  // An unmapped image means the converter emitted a src with no asset behind
  // it — surface that rather than rendering a silent gap.
  if (!img) {
    return (
      <View style={styles.imgMissing}>
        <FontAwesome5 name="image" size={12} color={COLORS.textMuted} />
        <Text style={styles.imgMissingText}>{block.alt || block.src}</Text>
      </View>
    );
  }

  return (
    <>
      <TouchableOpacity activeOpacity={0.85} onPress={() => setZoom(true)}>
        <Image
          source={img.source}
          style={[styles.img, { aspectRatio: img.aspectRatio }]}
          resizeMode="contain"
          accessibilityLabel={block.alt || undefined}
        />
        <View style={styles.imgHintRow}>
          <FontAwesome5 name="search-plus" size={9} color={COLORS.textMuted} />
          <Text style={styles.imgHint}>Tap to enlarge</Text>
        </View>
      </TouchableOpacity>

      <Modal visible={zoom} transparent animationType="fade" onRequestClose={() => setZoom(false)}>
        <View style={styles.zoomBackdrop}>
          <TouchableOpacity style={styles.zoomClose} onPress={() => setZoom(false)}>
            <FontAwesome5 name="times" size={18} color={COLORS.white} />
          </TouchableOpacity>
          <ScrollView
            maximumZoomScale={4}
            minimumZoomScale={1}
            centerContent
            contentContainerStyle={styles.zoomContent}
          >
            <Image
              source={img.source}
              style={{ width: width * 0.95, height: height * 0.8 }}
              resizeMode="contain"
              accessibilityLabel={block.alt || undefined}
            />
          </ScrollView>
        </View>
      </Modal>
    </>
  );
}

function DataTable({ block }) {
  const cols = block.cols || 1;
  const base = colWidth(cols);
  const widths = Array.from({ length: cols }, () => base);
  const total = base * cols;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator
      contentContainerStyle={styles.tableScroll}
    >
      <View style={[styles.table, { width: total }]}>
        {block.header ? (
          <View style={styles.tableHeadRow}>
            {block.header.map((runs, i) => (
              <View key={i} style={[styles.cell, { width: widths[i] }, styles.headCell]}>
                <Runs runs={runs} style={styles.headText} />
              </View>
            ))}
          </View>
        ) : null}

        {block.rows.map((row, ri) => {
          if (row.section) {
            return (
              <View key={ri} style={[styles.sectionRow, { width: total }]}>
                <Blocks blocks={row.section} depth={2} compact textColor={COLORS.dark} dense />
              </View>
            );
          }
          // `spans` appears on short rows; the last cell absorbs leftover width
          // so no cell content is clipped or dropped.
          const spans = row.spans || row.cells.map(() => 1);
          return (
            <View key={ri} style={[styles.tableRow, ri % 2 === 1 && styles.tableRowAlt]}>
              {row.cells.map((cell, ci) => (
                <View key={ci} style={[styles.cell, { width: base * (spans[ci] || 1) }]}>
                  <Blocks blocks={cell} depth={2} compact dense />
                </View>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

/** Renders a list of blocks. */
export function Blocks({ blocks, depth = 0, compact = false, textColor, dense = false }) {
  if (!blocks || !blocks.length) return null;

  return (
    <>
      {blocks.map((b, i) => {
        const key = `${b.t}-${i}`;
        switch (b.t) {
          case 'h':
            return <Heading key={key} block={b} />;
          case 'p': {
            if (!runsToText(b.runs).trim()) return null;
            return (
              <Runs
                key={key}
                runs={b.runs}
                style={[
                  styles.p,
                  compact && styles.pCompact,
                  dense && styles.pDense,
                  textColor ? { color: textColor } : null,
                ]}
              />
            );
          }
          case 'list':
            return <BulletList key={key} block={b} depth={depth} />;
          case 'table':
            return <DataTable key={key} block={b} />;
          case 'alert':
            return <Alert key={key} block={b} depth={depth} />;
          case 'img':
            return <GuidelineImage key={key} block={b} />;
          case 'hr':
            return <View key={key} style={styles.hr} />;
          case 'badge':
            return (
              <View key={key} style={styles.badge}>
                <Runs runs={b.runs} style={styles.badgeText} />
              </View>
            );
          default:
            return null;
        }
      })}
    </>
  );
}

export default function GuidelineContent({ blocks }) {
  return <Blocks blocks={blocks} />;
}

const styles = StyleSheet.create({
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },

  h1: { fontSize: 15, fontWeight: '700', color: COLORS.medicalBlue },
  h2: { fontSize: 14, fontWeight: '700', color: COLORS.medicalBlue },
  h3: { fontSize: 13, fontWeight: '700', color: COLORS.dark },
  headingWrapMajor: { marginTop: SPACING.md, marginBottom: SPACING.xs },
  headingWrapMinor: { marginTop: SPACING.sm, marginBottom: 2 },

  p: { fontSize: 13, lineHeight: 19, color: COLORS.text, marginBottom: SPACING.sm },
  pCompact: { marginBottom: SPACING.xs },
  pDense: { fontSize: 11.5, lineHeight: 16 },

  list: { marginBottom: SPACING.sm },
  listItem: { flexDirection: 'row', marginBottom: SPACING.xs, paddingRight: SPACING.xs },
  listMarker: {
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.primary,
    marginRight: 6,
    minWidth: 14,
    fontWeight: '700',
  },
  listBody: { flex: 1, minWidth: 0 },

  alert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 4,
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertBody: { flex: 1, minWidth: 0 },

  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: COLORS.white,
    marginTop: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '700' },

  img: { width: '100%', borderRadius: 6, backgroundColor: COLORS.white, marginTop: SPACING.xs },
  imgHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 3,
    marginBottom: SPACING.sm,
  },
  imgHint: { fontSize: 10, color: COLORS.textMuted, marginLeft: 4 },
  imgMissing: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    backgroundColor: COLORS.light,
    borderRadius: 6,
    marginBottom: SPACING.sm,
  },
  imgMissingText: { fontSize: 11, color: COLORS.textMuted, marginLeft: 6, flex: 1 },

  zoomBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.92)' },
  zoomContent: { flexGrow: 1, alignItems: 'center', justifyContent: 'center' },
  zoomClose: {
    position: 'absolute',
    top: 44,
    right: 18,
    zIndex: 2,
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  tableScroll: { paddingBottom: SPACING.xs },
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
  },
  tableHeadRow: { flexDirection: 'row', backgroundColor: COLORS.dark },
  headCell: { backgroundColor: COLORS.dark },
  headText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  tableRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'stretch',
  },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  cell: {
    padding: 7,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: COLORS.border,
    minWidth: 0,
  },
  sectionRow: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 7,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
});
