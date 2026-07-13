import React, { useRef, useState } from 'react';
import { Alert, Modal, Pressable, View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

// Home grid mirrors the Replit web app (templates/index_simple.html): the same
// 16 tools, in the same order, with matching titles, badges and per-tile colors.
const BLUE = '#007bff';
const TOOLS = [
  { key: 'Preoperative', icon: 'clipboard-check', title: 'Preoperative Assessment', badge: 'Risk Score Reference', keywords: 'preoperative assessment history examination fasting npo asa classification airway mallampati risk consent thyromental' },
  { key: 'AnaestheticDrugDosing', icon: 'syringe', title: 'Anaesthetic Drugs', badge: 'Dose Reference', bgColor: BLUE, keywords: 'anaesthetic drugs propofol thiopentone ketamine fentanyl morphine atracurium rocuronium suxamethonium atropine ephedrine adrenaline induction muscle relaxant opioid age adjusted' },
  { key: 'ITIVA', icon: 'syringe', title: 'iTIVA', badge: 'Reference Guide', bgColor: '#6f42c1', badgeColor: '#e2cfff', keywords: 'tiva total intravenous anaesthesia propofol infusion tci target controlled infusion marsh schnider pk pharmacokinetics simulator bis' },
  { key: 'DifficultAirway', icon: 'lungs-virus', title: 'Difficult Airway', badge: 'DAS Guidelines', bgColor: BLUE, keywords: 'difficult airway das guidelines intubation failed intubation videolaryngoscopy cico cant intubate oxygenate bougie surgical airway front of neck' },
  { key: 'ACLS', icon: 'heartbeat', title: 'ACLS Algorithms', keywords: 'acls advanced cardiac life support resuscitation cpr cardiac arrest bradycardia tachycardia aha algorithm pea vf vt' },
  { key: 'Emergency', icon: 'ambulance', title: 'Emergency & Crisis', keywords: 'emergency crisis qrh quick reference handbook anaphylaxis malignant hyperthermia local anaesthetic toxicity last bronchospasm cardiac arrest theatre' },
  { key: 'DepartmentalTeaching', icon: 'graduation-cap', title: 'Departmental Teaching', keywords: 'departmental teaching education training case presentation postgraduate registrar tutorial lecture' },
  { key: 'NeuraxialAnticoagulation', icon: 'tint', title: 'Neuraxial & Anticoagulation', badge: 'ASRA Guidelines', bgColor: BLUE, keywords: 'neuraxial anticoagulation spinal epidural asra lmwh doac heparin warfarin rivaroxaban apixaban dabigatran enoxaparin timing stop restart bridging' },
  { key: 'DepartmentalProtocols', icon: 'clipboard-list', title: 'Departmental Protocols', badge: 'WGH', bgColor: BLUE, keywords: 'departmental protocols iv cannulation central line cvc request out of hours wgh switchboard consultant' },
  { key: 'PerioperativeMedication', icon: 'prescription-bottle-alt', title: 'Perioperative Medication', badge: '2024 Guidelines', bgColor: BLUE, keywords: 'perioperative medication management aspirin clopidogrel plavix metformin sglt2 glp1 beta blocker ace inhibitor statin antiplatelet anticoagulant stop restart surgery' },
  { key: 'ROTEM', icon: 'tint', title: 'Massive Transfusion & ROTEM', badge: 'MTP + Protocols', bgColor: '#c62828', badgeColor: '#ffcdd2', keywords: 'rotem thromboelastometry coagulation fibrinogen extem intem fibtem aptem clot formation coagulopathy haemorrhage transfusion massive transfusion protocol mtp pack tranexamic acid obstetric trauma bleed activate bleep 239' },
  { key: 'LabourAnalgesia', icon: 'human-pregnant', iconSet: 'MaterialCommunityIcons', title: 'Labour Analgesia', badge: 'Protocols', bgColor: BLUE, keywords: 'labour analgesia epidural cse combined spinal epidural remifentanil pca obstetric anaesthesia caesarean section top up obstetrics' },
  { key: 'Resources', icon: 'globe', title: 'Guidelines & Resources', badge: 'External Links', bgColor: BLUE, keywords: 'guidelines websites links external hse cai college anaesthesiologists ireland association anaesthetists rcoa das asra nice resuscitation council resources reference' },
  { key: 'AIEducation', title: 'AI Education', gradient: ['#0d6efd', '#6610f2'], keywords: 'ai artificial intelligence education drug interaction medication review airway assessment fasting planning regional anaesthesia case planning dose calculation herbal' },
  { key: 'Antimicrobials', icon: 'bacteria', title: 'Sepsis / Antimicrobial Guidelines', badge: 'WGH Stewardship', bgColor: '#2e7d32', badgeColor: '#a5d6a7', keywords: 'antimicrobials antibiotics microbiology prophylaxis surgical prophylaxis sepsis pneumonia uti urinary tract infection empiric tazocin co-amoxiclav ceftriaxone gentamicin clindamycin vancomycin teicoplanin meropenem start smart then focus cdiff clostridium cellulitis meningitis' },
  { key: 'Regulatory', icon: 'shield-alt', title: 'Regulatory & Safety', badge: 'App Information', bgColor: '#198754', badgeColor: '#b7f5d0', keywords: 'regulatory safety eu mdr compliance intended use disclaimer classification medical device' },
];

export default function HomeScreen({ navigation }) {
  const { user, logout, deleteAccount, isLoading, isGuest } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [search, setSearch] = useState('');
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

  // All tools are accessible to both guests and authenticated users.
  const handleToolPress = (toolKey) => {
    navigation.navigate(toolKey);
  };

  // Filter the tool grid by title or keywords (mirrors the web app's search bar).
  const query = search.trim().toLowerCase();
  const filteredTools = query
    ? TOOLS.filter(
        tool =>
          tool.title.toLowerCase().includes(query) ||
          (tool.keywords || '').toLowerCase().includes(query)
      )
    : TOOLS;

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
                Anaesthesia Companion
              </Text>
              <Text style={styles.headerSub} numberOfLines={2}>
                Anaesthesia Companion App
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
                  <Text style={styles.menuUserText}>
                    {isGuest ? 'Guest' : (user?.fullName || 'User')}
                  </Text>
                </View>

                {isGuest ? (
                  // Guest menu: prompt to sign in or create account
                  <>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => { setIsMenuOpen(false); logout(); }}
                      activeOpacity={0.75}
                    >
                      <FontAwesome5 name="sign-in-alt" size={14} color={COLORS.medicalBlue} />
                      <Text style={styles.menuItemText}>Sign In</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => { setIsMenuOpen(false); logout(); }}
                      activeOpacity={0.75}
                    >
                      <FontAwesome5 name="user-plus" size={14} color={COLORS.medicalBlue} />
                      <Text style={styles.menuItemText}>Create Account</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  // Authenticated menu: logout and delete account
                  <>
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
                  </>
                )}
              </View>
            </View>
          </Modal>

        <View style={styles.searchWrap}>
          <View style={styles.searchBar}>
            <FontAwesome5 name="search" size={14} color={COLORS.textMuted || '#6c757d'} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search tools, drugs, protocols…"
              placeholderTextColor={COLORS.textMuted || '#6c757d'}
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              returnKeyType="search"
              clearButtonMode="while-editing"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')} style={styles.searchClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <FontAwesome5 name="times" size={14} color={COLORS.textMuted || '#6c757d'} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.gridWrap}>
          {filteredTools.length === 0 && (
            <Text style={styles.noResults}>No tools found — try a different term.</Text>
          )}
          <View style={styles.grid}>
          {filteredTools.map(tool => {
            const isColored = !!(tool.bgColor || tool.gradient);
            const iconColor = tool.iconColor || (isColored ? COLORS.white : COLORS.medicalBlue);
            const cardInner = (
              <>
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
                    <MaterialCommunityIcons name={tool.icon} size={22} color={iconColor} />
                  ) : (
                    <FontAwesome5 name={tool.icon} size={22} color={iconColor} />
                  )}
                </View>
                <Text style={[styles.cardTitle, isColored && styles.cardTitleHighlight]}>
                  {tool.title}
                </Text>
                {tool.badge && (
                  <Text style={[styles.badge, tool.badgeColor && { color: tool.badgeColor }]}>
                    {tool.badge}
                  </Text>
                )}
              </>
            );

            if (tool.gradient) {
              return (
                <TouchableOpacity
                  key={tool.key}
                  style={styles.cardTouchable}
                  onPress={() => handleToolPress(tool.key)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={tool.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.card, styles.cardGradient, SHADOW]}
                  >
                    {cardInner}
                  </LinearGradient>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={tool.key}
                style={[
                  styles.card,
                  SHADOW,
                  isColored && { backgroundColor: tool.bgColor, borderColor: tool.bgColor },
                ]}
                onPress={() => handleToolPress(tool.key)}
                activeOpacity={0.7}
              >
                {cardInner}
              </TouchableOpacity>
            );
          })}
          {filteredTools.length % 3 !== 0 && Array.from({ length: 3 - (filteredTools.length % 3) }).map((_, i) => (
            <View key={`spacer-${i}`} style={styles.cardSpacer} />
          ))}
          </View>
        </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2025 Anaesthesia Companion App</Text>
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
  searchWrap: { paddingHorizontal: SPACING.sm, marginBottom: SPACING.md },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: SPACING.md,
    height: 44,
  },
  searchIcon: { marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
    paddingVertical: 0,
  },
  searchClear: { paddingLeft: SPACING.sm },
  noResults: {
    textAlign: 'center',
    color: COLORS.textMuted || '#6c757d',
    fontSize: 13,
    paddingVertical: SPACING.lg,
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
  cardTouchable: {
    width: '31%',
    marginBottom: SPACING.md,
  },
  cardGradient: {
    width: '100%',
    marginBottom: 0,
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
