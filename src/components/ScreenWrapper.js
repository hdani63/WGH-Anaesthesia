import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const TITLE_ICON_MAP = {
  '📋': 'clipboard-check',
  '🛏': 'bed',
  '🏥': 'hospital',
  '🚨': 'ambulance',
  '🔬': 'user-md',
  '✅': 'clipboard-check',
  '💊': 'pills',
  '🫁': 'lungs',
  '💉': 'syringe',
  '❤️': 'heartbeat',
  '🚑': 'ambulance',
};

function normalizeTitle(title) {
  if (!title) return '';
  let output = title;
  Object.keys(TITLE_ICON_MAP).forEach((key) => {
    if (output.startsWith(key)) {
      output = output.slice(key.length).trim();
    }
  });
  return output;
}

function resolveTitleIcon(title, icon) {
  if (icon) return icon;
  if (!title) return null;

  for (const key of Object.keys(TITLE_ICON_MAP)) {
    if (title.startsWith(key)) return TITLE_ICON_MAP[key];
  }

  const t = title.toLowerCase();
  if (t.includes('preoperative')) return 'clipboard-check';
  if (t.includes('postoperative')) return 'bed';
  if (t.includes('icu')) return 'heartbeat';
  if (t.includes('emergency')) return 'ambulance';
  if (t.includes('specialized')) return 'user-md';
  if (t.includes('quality')) return 'clipboard-check';
  if (t.includes('general medical')) return 'calculator';
  if (t.includes('drug dosing')) return 'pills';
  if (t.includes('ecmo')) return 'lungs';
  if (t.includes('anesthetic')) return 'syringe';
  if (t.includes('difficult airway')) return 'lungs';
  if (t.includes('acls')) return 'heartbeat';
  if (t.includes('teaching')) return 'graduation-cap';
  if (t.includes('critical transfer')) return 'ambulance';
  if (t.includes('neuraxial')) return 'tint';
  if (t.includes('departmental protocols')) return 'clipboard-list';
  if (t.includes('perioperative medication')) return 'prescription-bottle-alt';
  if (t.includes('rotem')) return 'vial';
  if (t.includes('labour analgesia')) return 'human-pregnant';
  if (t.includes('e-library')) return 'book-open';
  return 'stethoscope';
}

export default function ScreenWrapper({ title, subtitle, children, headerColor, icon, showBack = true }) {
  const navigation = useNavigation();
  const canGoBack = navigation?.canGoBack?.() || false;
  const iconName = resolveTitleIcon(title, icon);
  const displayTitle = normalizeTitle(title);

  return (
    <LinearGradient
      colors={headerColor ? [headerColor, headerColor] : [COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.safeAreaGradient}
    >
      <StatusBar barStyle="light-content" backgroundColor={headerColor || COLORS.headerGradientStart} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <LinearGradient
          colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.appHeader}
        >
          <View style={styles.appHeaderLeft}>
            <View style={styles.appHeaderIconWrap}>
              <FontAwesome5 name="stethoscope" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.appHeaderTitle}>WGH Anesthesia</Text>
              <Text style={styles.appHeaderSubtitle}>Anesthesia For Wexford General Hospital</Text>
            </View>
          </View>

          <FontAwesome5 name="hospital" size={38} color="rgba(255,255,255,0.8)" />
        </LinearGradient>

        {title && (
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderTopRow}>
              <View style={styles.pageHeadingWrap}>
                <View style={styles.pageTitleRow}>
                  {iconName ? (
                    iconName === 'human-pregnant' ? (
                      <MaterialCommunityIcons name={iconName} size={18} color={COLORS.medicalBlue} style={styles.pageIcon} />
                    ) : (
                      <FontAwesome5 name={iconName} size={18} color={COLORS.medicalBlue} style={styles.pageIcon} />
                    )
                  ) : null}
                  <Text style={styles.pageTitle}>{displayTitle}</Text>
                </View>
                {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
              </View>

              {showBack && canGoBack ? (
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                  <FontAwesome5 name="arrow-left" size={14} color={COLORS.primary} style={styles.backIcon} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        )}
        {children}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 40,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginHorizontal: -SPACING.md,
    marginBottom: SPACING.md,
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingRight: SPACING.sm,
  },
  appHeaderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  appHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  appHeaderSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginTop: 2,
  },
  pageHeader: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  pageHeaderTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeadingWrap: {
    flex: 1,
    paddingRight: 12,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  backIcon: {
    marginRight: 6,
  },
  backText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  pageIcon: {
    marginRight: 8,
  },
  pageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.medicalBlue,
  },
  pageSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
});
