import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const TOOLS = [
  { key: 'AnaesthesiaCalculators', icon: 'calculator', title: 'Anaesthesia Calculators', badge: 'Core Tools', highlight: true },
  { key: 'DifficultAirway', icon: 'lungs', title: 'Difficult Airway', badge: 'DAS Guidelines', highlight: true },
  { key: 'ACLS', icon: 'heartbeat', title: 'ACLS Algorithms' },
  { key: 'Emergency', icon: 'ambulance', title: 'Emergency & Crisis' },
  { key: 'DrugDosing', icon: 'capsules', title: 'Drug Dosing' },
  { key: 'AnestheticDrugDosing', icon: 'syringe', title: 'Anaesthetic Drugs', badge: 'Age-Adjusted', highlight: true },
  { key: 'DepartmentalTeaching', icon: 'graduation-cap', title: 'Departmental Teaching' },
  { key: 'NeuraxialAnticoagulation', icon: 'tint', title: 'RA & Anticoag', badge: 'ASRA Guidelines', highlight: true },
  { key: 'DepartmentalProtocols', icon: 'file-medical', title: 'Departmental Protocols', badge: 'WGH', highlight: true },
  { key: 'PerioperativeMedication', icon: 'medkit', title: 'Perioperative Medication', badge: '2024 Guidelines', highlight: true },
  { key: 'ROTEM', icon: 'vial', title: 'ROTEM', badge: 'Protocols', highlight: true },
  { key: 'LabourAnalgesia', icon: 'female', title: 'Labour Analgesia', badge: 'Protocols', highlight: true },
  { key: 'ELibrary', icon: 'book', title: 'E-Library', badge: 'Resources', highlight: true },
  { key: 'ITIVA', icon: 'flask', title: 'iTIVA', badge: 'Simulator', highlight: true },
];

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const { width } = useWindowDimensions();
  const isCompactHeader = width < 768;

  return (
    <LinearGradient
      colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.safeAreaGradient}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <LinearGradient
            colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.header, isCompactHeader && styles.headerCompact]}
          >
          <View style={[styles.headerLeft, isCompactHeader && styles.headerLeftCompact]}>
            <View style={styles.headerIconWrap}>
              <FontAwesome5 name="stethoscope" size={24} color={COLORS.white} />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                WGH Anaesthesia
              </Text>
              <Text style={styles.headerSub} numberOfLines={2}>
                Anaesthesia For Wexford General Hospital
              </Text>
            </View>
          </View>
          <View style={[styles.headerRight, isCompactHeader && styles.headerRightCompact]}>
            <View style={[styles.userBadge, isCompactHeader && styles.userBadgeCompact]}>
              <Text style={styles.userNameText}>{user?.fullName || 'WGH User'}</Text>
              
            </View>
            <TouchableOpacity style={styles.logoutButton} onPress={logout} activeOpacity={0.8}>
              <FontAwesome5 name="sign-out-alt" size={14} color={COLORS.white} />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
          </LinearGradient>

        <View style={styles.gridWrap}>
          <View style={styles.grid}>
          {TOOLS.map(tool => (
            <TouchableOpacity
              key={tool.key}
              style={[styles.card, SHADOW, tool.highlight && styles.cardHighlight]}
              onPress={() => navigation.navigate(tool.key)}
              activeOpacity={0.7}
            >
              <View style={styles.cardIconWrap}>
                <FontAwesome5
                  name={tool.icon}
                  size={22}
                  color={tool.highlight ? COLORS.white : COLORS.medicalBlue}
                />
              </View>
              <Text style={[styles.cardTitle, tool.highlight && styles.cardTitleHighlight]}>
                {tool.title}
              </Text>
              {tool.badge && (
                <Text style={styles.badge}>{tool.badge}</Text>
              )}
            </TouchableOpacity>
          ))}
          {TOOLS.length % 3 !== 0 && Array.from({ length: 3 - (TOOLS.length % 3) }).map((_, i) => (
            <View key={`spacer-${i}`} style={styles.cardSpacer} />
          ))}
          </View>
        </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 WGH Anaesthesia - Wexford General Hospital Anaesthesia Department</Text>
            <Text style={styles.footerMuted}>For medical professional use only</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeAreaGradient: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { paddingBottom: 24 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginBottom: SPACING.md,
  },
  headerCompact: {
    alignItems: 'stretch',
    gap: SPACING.md,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, minWidth: 0 },
  headerLeftCompact: { width: '100%' },
  headerIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  headerTextWrap: { flex: 1, minWidth: 0 },
  headerRight: { alignItems: 'flex-end', marginLeft: SPACING.sm, flexShrink: 0 },
  headerRightCompact: { alignItems: 'flex-start', marginLeft: 0 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2, lineHeight: 18 },
  userBadge: {
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  userBadgeCompact: { alignItems: 'flex-start' },
  userNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  userRoleText: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  logoutText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  gridWrap: { paddingHorizontal: SPACING.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '31%',
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    minHeight: 110,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardHighlight: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  cardIconWrap: { marginBottom: 8 },
  cardTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
    lineHeight: 18,
  },
  cardTitleHighlight: { color: COLORS.white },
  badge: {
    fontSize: 10,
    color: '#ffc107',
    fontWeight: '600',
    marginTop: 4,
  },
  cardSpacer: {
    width: '31%',
    marginBottom: SPACING.md,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    marginTop: SPACING.sm,
    backgroundColor: '#343a40',
  },
  footerText: { fontSize: 12, color: COLORS.white, textAlign: 'center' },
  footerMuted: { fontSize: 11, color: '#6c757d', marginTop: 2 },
});
