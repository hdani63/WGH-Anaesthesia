import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

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
  if (t.includes('anaesthetic')) return 'syringe';
  if (t.includes('difficult airway')) return 'lungs';
  if (t.includes('acls')) return 'heartbeat';
  if (t.includes('teaching')) return 'graduation-cap';
  if (t.includes('critical transfer')) return 'ambulance';
  if (t.includes('neuraxial')) return 'tint';
  if (t.includes('departmental protocols')) return 'clipboard-list';
  if (t.includes('perioperative medication')) return 'prescription-bottle-alt';
  if (t.includes('rotem')) return 'vial';
  if (t.includes('labour analgesia')) return 'baby';
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
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {title && (
          <LinearGradient
            colors={headerColor ? [headerColor, headerColor] : [COLORS.headerGradientStart, COLORS.headerGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pageHeader}
          >
            <View style={styles.pageTitleRow}>
              {showBack && canGoBack ? (
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <FontAwesome5 name="chevron-left" size={16} color={COLORS.white} />
                </TouchableOpacity>
              ) : null}
              {iconName ? <FontAwesome5 name={iconName} size={18} color={COLORS.white} style={styles.pageIcon} /> : null}
              <Text style={styles.pageTitle}>{displayTitle}</Text>
            </View>
            {subtitle && <Text style={styles.pageSubtitle}>{subtitle}</Text>}
          </LinearGradient>
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
    padding: SPACING.md,
    paddingBottom: 40,
  },
  pageHeader: {
    backgroundColor: COLORS.medicalBlue,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
  },
  pageTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 4,
  },
  pageIcon: {
    marginRight: 8,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.white,
  },
  pageSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
});
