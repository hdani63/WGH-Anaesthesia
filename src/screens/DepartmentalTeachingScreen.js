import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const SHEETS_BASE_URL = 'https://docs.google.com/spreadsheets/d/1vunHVcoOIxHSirSwmybQofc-t81AJsKV25tZR9008q4/edit';
const SHEETS_EMBED_URL = `${SHEETS_BASE_URL}?usp=sharing&widget=true&rm=minimal`;
const SHEETS_DIRECT_URL = `${SHEETS_BASE_URL}?usp=drivesdk`;

async function openExternalUrl(url) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open link', 'Please try again in your browser.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Unable to open link', 'Please try again in your browser.');
  }
}

export default function DepartmentalTeachingScreen() {
  const navigation = useNavigation();

  const handleOpenSchedule = () => {
    openExternalUrl(SHEETS_DIRECT_URL);
  };

  const handleRefresh = () => {
    openExternalUrl(`${SHEETS_EMBED_URL}&t=${Date.now()}`);
  };

  return (
    <ScreenWrapper title="Departmental Teaching Resources" subtitle="Educational materials and training resources for the Anaesthesia Department">
      <View style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceIconWrap}>
            <FontAwesome5 name="graduation-cap" size={20} color={COLORS.white} />
          </View>
          <View style={styles.resourceHeaderTextWrap}>
            <Text style={styles.resourceTitle}>Teaching Schedule</Text>
            <Text style={styles.resourceSubtitle}>Google Sheets schedule with tutorials, topics, and presenters.</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={14} color={COLORS.info} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            The embedded spreadsheet view used in the Flask version is not available directly in this native screen. Use the button below to open the full schedule.
          </Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={14} color={COLORS.white} style={styles.btnIcon} />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleOpenSchedule}>
          <FontAwesome5 name="external-link-alt" size={13} color={COLORS.primary} style={styles.btnIcon} />
          <Text style={styles.outlineBtnText}>Open in New Tab</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoBtn} onPress={handleRefresh}>
          <FontAwesome5 name="sync-alt" size={13} color={COLORS.dark} style={styles.btnIcon} />
          <Text style={styles.infoBtnText}>Refresh</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Opens in your default browser or Google Sheets app.</Text>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Important Note</Text>
        <Text style={styles.footerText}>
          Always verify dates and venues in the live sheet before departmental sessions.
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  resourceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW,
  },
  resourceHeader: {
    backgroundColor: COLORS.medicalBlue,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  resourceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  resourceHeaderTextWrap: { flex: 1 },
  resourceTitle: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  resourceSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 18,
  },
  infoBox: {
    backgroundColor: '#eef7ff',
    borderTopWidth: 1,
    borderTopColor: '#cce4ff',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: { marginTop: 2, marginRight: 8 },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
  },
  actionsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: SPACING.sm,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#17a2b8',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    backgroundColor: '#e8f8fb',
  },
  infoBtnText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: 8,
  },
  hint: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  footerCard: {
    backgroundColor: '#fff8e1',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#f7df97',
    padding: SPACING.md,
    ...SHADOW,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8a6d1d',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#6f5a1b',
    lineHeight: 18,
  },
});
