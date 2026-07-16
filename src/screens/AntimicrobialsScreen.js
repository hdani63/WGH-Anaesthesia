import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

import ScreenWrapper from '../components/ScreenWrapper';
import { UHW_TILES } from '../data/uhwSections';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

const GREEN = '#2e7d32';

function TileIcon({ tile }) {
  const Icon = tile.lib === 'mci' ? MaterialCommunityIcons : FontAwesome5;
  return <Icon name={tile.icon} size={28} color={COLORS.white} />;
}

function Tile({ tile, onPress }) {
  return (
    <View style={styles.tileCol}>
      <TouchableOpacity style={styles.tile} activeOpacity={0.7} onPress={onPress}>
        <View style={[styles.circle, { backgroundColor: tile.color }]}>
          <TileIcon tile={tile} />
        </View>
        <Text style={[styles.tileLabel, { color: tile.color }, tile.bold && styles.tileLabelBold]}>
          {tile.label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function AntimicrobialsScreen() {
  const navigation = useNavigation();
  const [query, setQuery] = useState('');

  const term = query.trim().toLowerCase();
  const tiles = useMemo(
    () => (term ? UHW_TILES.filter((t) => t.label.toLowerCase().includes(term)) : UHW_TILES),
    [term]
  );

  const open = (tile) =>
    navigation.navigate('UHWGuidelines', { sectionId: tile.section, title: tile.label });

  return (
    <ScreenWrapper
      title="Sepsis / Antimicrobial Guidelines"
      subtitle="UHW & SE Hospitals — Antimicrobial Prescribing Guidelines"
      icon="bacteria"
    >
      <View style={styles.alertWarn}>
        <FontAwesome5
          name="exclamation-triangle"
          size={13}
          color="#856404"
          style={styles.alertIcon}
        />
        <Text style={styles.alertWarnText}>
          Always verify doses against current SPC. Adjust for renal function, allergies, cultures
          and local resistance. Consult Microbiology for complex cases.
        </Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchIconBox}>
          <FontAwesome5 name="search" size={12} color={COLORS.white} />
        </View>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search guidelines (e.g. Sepsis, UTI, Respiratory…)"
          placeholderTextColor={COLORS.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          spellCheck={false}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {query ? (
          <TouchableOpacity style={styles.clearBtn} onPress={() => setQuery('')}>
            <FontAwesome5 name="times" size={12} color={GREEN} />
          </TouchableOpacity>
        ) : null}
      </View>

      {term ? (
        <Text style={styles.countText}>
          {tiles.length === 0 ? (
            <Text style={styles.countNone}>
              <FontAwesome5 name="exclamation-circle" size={11} color={COLORS.danger} />{' '}
              No matches found
            </Text>
          ) : (
            <Text style={styles.countSome}>
              <FontAwesome5 name="check-circle" size={11} color={GREEN} />{' '}
              {tiles.length} guideline{tiles.length !== 1 ? 's' : ''} found
            </Text>
          )}
        </Text>
      ) : null}

      <View style={styles.grid}>
        {tiles.map((tile) => (
          <Tile key={`${tile.section}-${tile.label}`} tile={tile} onPress={() => open(tile)} />
        ))}
      </View>

      <TouchableOpacity
        style={styles.viewAllBtn}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('UHWGuidelines', {})}
      >
        <FontAwesome5 name="list-ul" size={12} color={GREEN} />
        <Text style={styles.viewAllText}>Browse all guidelines</Text>
      </TouchableOpacity>

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

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  searchIconBox: {
    backgroundColor: GREEN,
    paddingHorizontal: 12,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 9,
    fontSize: 13,
    color: COLORS.text,
  },
  clearBtn: { paddingHorizontal: 12, paddingVertical: 9 },

  countText: { marginTop: 6, marginLeft: 2, fontSize: 11 },
  countNone: { color: COLORS.danger },
  countSome: { color: GREEN },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    marginHorizontal: -SPACING.xs,
  },
  tileCol: { width: '33.333%', paddingHorizontal: SPACING.xs, marginBottom: SPACING.md },
  tile: { alignItems: 'center' },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 4,
  },
  tileLabel: { fontSize: 11, fontWeight: '600', lineHeight: 14, textAlign: 'center' },
  tileLabelBold: { fontWeight: '800' },

  viewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: GREEN,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 10,
    marginTop: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  viewAllText: { color: GREEN, fontSize: 13, fontWeight: '600', marginLeft: 8 },

  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 6,
    textAlign: 'center',
    flexShrink: 1,
  },
});
