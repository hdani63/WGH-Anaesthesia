import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';

import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import GuidelineContent from '../components/GuidelineContent';
import { UHW_TILES } from '../data/uhwSections';
import GUIDELINES from '../data/uhwGuidelines.json';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

// Content ported from templates/uhw_guidelines.html. Mirrors the web app's two
// modes: deep-linked to one section (a tile tap), or browsing them all.
//
// The accordion headers in the source HTML carry FontAwesome 6 names, so tile
// colours/icons from UHW_TILES are preferred where a tile maps to the section.

const TILE_BY_SECTION = UHW_TILES.reduce((acc, t) => {
  if (!acc[t.section]) acc[t.section] = t;
  return acc;
}, {});

export default function UHWGuidelinesScreen() {
  const route = useRoute();
  const sectionId = route.params?.sectionId;

  const sections = useMemo(
    () => (sectionId ? GUIDELINES.filter((s) => s.id === sectionId) : GUIDELINES),
    [sectionId]
  );

  const single = Boolean(sectionId) && sections.length === 1;
  const tile = sectionId ? TILE_BY_SECTION[sectionId] : null;
  const title = single ? route.params?.title || sections[0].title : 'UHW Antimicrobial Guidelines';

  return (
    <ScreenWrapper
      title={title}
      subtitle="University Hospital Waterford — Antimicrobial Prescribing Guidelines"
      icon={tile && tile.lib !== 'mci' ? tile.icon : 'hospital'}
    >
      <View style={styles.alertWarn}>
        <FontAwesome5
          name="exclamation-triangle"
          size={13}
          color="#856404"
          style={styles.alertIcon}
        />
        <Text style={styles.alertWarnText}>
          Always verify doses against current SPC (medicines.ie). Adjust based on cultures, renal
          function, allergies, and local resistance. Consult Microbiology for complex cases.
        </Text>
      </View>

      {sectionId && !single ? (
        <View style={styles.notFound}>
          <FontAwesome5 name="exclamation-circle" size={13} color={COLORS.danger} />
          <Text style={styles.notFoundText}>
            Guideline section “{sectionId}” was not found. Showing all guidelines instead.
          </Text>
        </View>
      ) : null}

      {single ? (
        <View style={styles.card}>
          <GuidelineContent blocks={sections[0].blocks} />
        </View>
      ) : (
        sections.map((s) => {
          const t = TILE_BY_SECTION[s.id];
          return (
            <CollapsibleCard
              key={s.id}
              title={t ? t.label : s.title}
              icon={t && t.lib !== 'mci' ? t.icon : 'notes-medical'}
              iconColor={t ? t.color : COLORS.medicalBlue}
            >
              <GuidelineContent blocks={s.blocks} />
            </CollapsibleCard>
          );
        })
      )}

      <View style={styles.footerRow}>
        <FontAwesome5 name="hospital" size={11} color={COLORS.textMuted} />
        <Text style={styles.footerText}>
          UHW & SE Hospitals Antimicrobial Prescribing Guidelines — via MEG eGuides
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  alertWarn: {
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertWarnText: { color: '#856404', fontSize: 12, lineHeight: 17, flex: 1 },

  notFound: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8d7da',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  notFoundText: { color: '#842029', fontSize: 12, marginLeft: 8, flex: 1 },

  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    textAlign: 'center',
    flexShrink: 1,
  },
});
