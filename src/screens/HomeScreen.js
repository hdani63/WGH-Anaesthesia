import React, { useRef, useState } from 'react';
import { Alert, Modal, Pressable, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

const TOOLS = [
  { key: 'AnaesthesiaCalculators', icon: 'calculator', title: 'Anaesthesia Calculators', badge: 'Core Tools', highlight: true },
  { key: 'DifficultAirway', icon: 'lungs', title: 'Difficult Airway', badge: 'DAS Guidelines', highlight: true },
  { key: 'ACLS', icon: 'heartbeat', title: 'ACLS Algorithms' },
  { key: 'Emergency', icon: 'ambulance', title: 'Emergency & Crisis' },
  { key: 'AnaestheticDrugDosing', icon: 'syringe', title: 'Anaesthetic Drugs', badge: 'Age-Adjusted', highlight: true },
  { key: 'DepartmentalTeaching', icon: 'graduation-cap', title: 'Departmental Teaching' },
  { key: 'NeuraxialAnticoagulation', icon: 'tint', title: 'RA & Anticoag', badge: 'ASRA Guidelines', highlight: true },
  { key: 'DepartmentalProtocols', icon: 'file-medical', title: 'Departmental Protocols', badge: 'WGH', highlight: true },
  { key: 'PerioperativeMedication', icon: 'medkit', title: 'Perioperative Medication', badge: '2024 Guidelines', highlight: true },
  { key: 'ROTEM', icon: 'vial', title: 'ROTEM', badge: 'Protocols', highlight: true },
  { key: 'LabourAnalgesia', icon: 'human-pregnant', iconSet: 'MaterialCommunityIcons', title: 'Labour Analgesia', badge: 'Protocols', highlight: true },
  { key: 'ELibrary', icon: 'book', title: 'E-Library', badge: 'Resources', highlight: true },
  { key: 'ITIVA', icon: 'flask', title: 'iTIVA', badge: 'Simulator', highlight: true },
  { key: 'AIEducation', title: 'AI Education', highlight: true },
];

export default function HomeScreen({ navigation }) {
  const { user, logout, deleteAccount, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuButtonRef = useRef(null);
  const { width } = useWindowDimensions();
  const isCompactHeader = width < 768;

  const toggleMenu = () => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      return;
    }

    menuButtonRef.current?.measureInWindow((x, y, buttonWidth, buttonHeight) => {
      setMenuAnchor({
        top: y + buttonHeight + 8,
        right: Math.max(SPACING.md, width - x - buttonWidth),
      });
      setIsMenuOpen(true);
    });
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
  };

  const handleDeleteAccount = () => {
    setIsMenuOpen(false);
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and remove your access to the app.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              Alert.alert('Account Deleted', 'Your account has been deleted.');
            } catch (err) {
              Alert.alert('Unable to Delete Account', err instanceof Error ? err.message : 'Please try again.');
            }
          },
        },
      ]
    );
  };

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
            <TouchableOpacity
              ref={menuButtonRef}
              style={styles.menuButton}
              onPress={toggleMenu}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="dots-vertical" size={28} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          </LinearGradient>

          <Modal
            visible={isMenuOpen}
            transparent
            animationType="none"
            statusBarTranslucent
            onRequestClose={() => setIsMenuOpen(false)}
          >
            <Pressable style={styles.menuOverlay} onPress={() => setIsMenuOpen(false)} />
            <View style={[styles.menuDropdownWrap, menuAnchor]}>
              <View style={styles.menuDropdown}>
                <View style={styles.menuUserRow}>
                  <FontAwesome5 name="user-circle" size={18} color={COLORS.medicalBlue} />
                  <Text style={styles.menuUserText}>{user?.fullName || 'WGH User'}</Text>
                </View>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout} activeOpacity={0.75}>
                  <FontAwesome5 name="sign-out-alt" size={14} color={COLORS.medicalBlue} />
                  <Text style={styles.menuItemText}>Logout</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.75}
                  disabled={isLoading}
                >
                  <FontAwesome5 name="trash-alt" size={14} color={COLORS.danger || '#dc3545'} />
                  <Text style={styles.deleteMenuText}>Delete Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

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
                {tool.key === 'AIEducation' ? (
                  <View style={styles.aiIconWrap}>
                    <View style={styles.aiIconBox}>
                      <Text style={styles.aiIconText}>AI</Text>
                    </View>
                    <Text style={styles.aiSparkleMain}>✦</Text>
                    <Text style={styles.aiSparkleSmall}>✦</Text>
                  </View>
                ) : tool.iconSet === 'MaterialCommunityIcons' ? (
                  <MaterialCommunityIcons
                    name={tool.icon}
                    size={22}
                    color={tool.key === 'LabourAnalgesia' ? COLORS.white : (tool.highlight ? COLORS.white : COLORS.medicalBlue)}
                  />
                ) : (
                  <FontAwesome5
                    name={tool.icon}
                    size={22}
                    color={tool.highlight ? COLORS.white : COLORS.medicalBlue}
                  />
                )}
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
  content: { paddingBottom: 24, position: 'relative' },
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
  headerRight: { alignItems: 'flex-end', marginLeft: SPACING.sm, flexShrink: 0, position: 'relative', zIndex: 10 },
  headerRightCompact: { alignItems: 'flex-end', marginLeft: 0 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2, lineHeight: 18 },
  menuButton: {
    width: 44,
    height: 40,
    borderColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuDropdown: {
    width: 190,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 20,
  },
  menuDropdownWrap: {
    position: 'absolute',
    zIndex: 50,
    elevation: 50,
  },
  menuOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  menuUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.08)',
  },
  menuUserText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  menuItemText: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
  },
  deleteMenuText: {
    color: COLORS.danger || '#dc3545',
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 10,
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
  aiIconWrap: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  aiIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiIconText: { color: COLORS.white, fontSize: 16, fontWeight: '700', lineHeight: 18 },
  aiSparkleMain: { position: 'absolute', top: -1, right: -1, color: COLORS.white, fontSize: 10, lineHeight: 10 },
  aiSparkleSmall: { position: 'absolute', top: -6, right: 5, color: COLORS.white, fontSize: 7, lineHeight: 7 },
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
