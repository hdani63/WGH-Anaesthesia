import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

// Replaces the former E-Library (bundled textbooks). Instead of shipping PDFs,
// this screen links out to the key Irish/UK guideline and reference websites.
const SECTIONS = [
  {
    key: 'irish',
    label: 'Irish Health Service & Governance',
    color: '#1a3a5c',
    links: [
      { title: 'HSE — Health Service Executive', desc: 'National health service, models of care and clinical programmes.', url: 'https://www.hse.ie' },
      { title: 'College of Anaesthesiologists of Ireland (CAI)', desc: 'Training, standards and guidelines for Irish anaesthesiology.', url: 'https://www.anaesthesia.ie' },
      { title: 'HPRA — Health Products Regulatory Authority', desc: 'Irish medicines and medical device regulation and safety notices.', url: 'https://www.hpra.ie' },
    ],
  },
  {
    key: 'societies',
    label: 'Anaesthesia Societies & Guidelines',
    color: '#2e7d32',
    links: [
      { title: 'Association of Anaesthetists', desc: 'Guidelines, QRH and safety standards (formerly AAGBI).', url: 'https://www.anaesthetists.org' },
      { title: 'Royal College of Anaesthetists (RCoA)', desc: 'Standards, GPAS and curriculum resources.', url: 'https://www.rcoa.ac.uk' },
      { title: 'Difficult Airway Society (DAS)', desc: 'Airway management guidelines and cognitive aids.', url: 'https://das.uk.com' },
      { title: "Obstetric Anaesthetists' Association (OAA)", desc: 'Obstetric anaesthesia guidelines and resources.', url: 'https://www.oaa-anaes.ac.uk' },
      { title: 'ASRA Pain Medicine', desc: 'Regional anaesthesia and anticoagulation guidelines.', url: 'https://www.asra.com' },
    ],
  },
  {
    key: 'emergency',
    label: 'Emergency & Resuscitation',
    color: '#c62828',
    links: [
      { title: 'Resuscitation Council UK', desc: 'ALS/ACLS algorithms and resuscitation guidelines.', url: 'https://www.resus.org.uk' },
      { title: 'European Resuscitation Council (ERC)', desc: 'European resuscitation guidelines.', url: 'https://www.erc.edu' },
    ],
  },
  {
    key: 'evidence',
    label: 'Evidence & Reference',
    color: '#6f42c1',
    links: [
      { title: 'NICE Guidance', desc: 'National Institute for Health and Care Excellence guidance.', url: 'https://www.nice.org.uk' },
      { title: 'BJA Education', desc: 'Continuing education reviews in anaesthesia and critical care.', url: 'https://bjaed.org' },
    ],
  },
];

async function openLink(url) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open link', 'Please open this address in your browser.');
      return;
    }
    await Linking.openURL(url);
  } catch {
    Alert.alert('Unable to open link', 'Please open this address in your browser.');
  }
}

function LinkCard({ link, color }) {
  return (
    <TouchableOpacity style={[styles.card, { borderLeftColor: color }]} onPress={() => openLink(link.url)} activeOpacity={0.7}>
      <View style={styles.cardTop}>
        <View style={[styles.iconWrap, { backgroundColor: color }]}>
          <FontAwesome5 name="globe" size={16} color={COLORS.white} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{link.title}</Text>
          <Text style={styles.cardDesc}>{link.desc}</Text>
        </View>
        <FontAwesome5 name="external-link-alt" size={13} color={color} style={styles.cardChevron} />
      </View>
    </TouchableOpacity>
  );
}

export default function ResourcesScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper title="Guidelines & Websites" subtitle="Key anaesthesia guideline & reference links">
      <View style={styles.introBox}>
        <FontAwesome5 name="info-circle" size={13} color={COLORS.primary} style={styles.introIcon} />
        <Text style={styles.introText}>
          Tap any item to open the official website in your browser. Links are provided for reference and are maintained by the respective organisations.
        </Text>
      </View>

      {SECTIONS.map((section) => (
        <View key={section.key} style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5 name="link" size={13} color={section.color} style={styles.sectionIcon} />
            <Text style={[styles.sectionTitle, { color: section.color }]}>{section.label}</Text>
          </View>
          {section.links.map((link) => (
            <LinkCard key={link.url} link={link} color={section.color} />
          ))}
        </View>
      ))}

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  introBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#cfe8ff',
  },
  introIcon: { marginRight: 8, marginTop: 2 },
  introText: { flex: 1, fontSize: 12, color: COLORS.text, lineHeight: 18 },
  section: { marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  sectionIcon: { marginRight: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  cardDesc: { color: COLORS.textMuted, fontSize: 12, lineHeight: 17, marginTop: 3 },
  cardChevron: { marginLeft: SPACING.sm },
  homeBtn: {
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOW,
  },
  homeBtnIcon: { marginRight: 8 },
  homeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
