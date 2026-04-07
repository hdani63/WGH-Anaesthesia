import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const algorithms = [
  {
    title: 'Adult Cardiac Arrest Algorithm',
    color: COLORS.danger,
    icon: 'heartbeat',
    fileName: 'acls_cardiac_arrest.pdf',
    source: require('../../assets/pdfs/acls/acls_cardiac_arrest.pdf'),
  },
  {
    title: 'Cardiac Arrest Circular Algorithm',
    color: COLORS.danger,
    icon: 'sync-alt',
    fileName: 'acls_cardiac_arrest_circular.pdf',
    source: require('../../assets/pdfs/acls/acls_cardiac_arrest_circular.pdf'),
  },
  {
    title: 'Adult Bradycardia Algorithm',
    color: COLORS.warning,
    icon: 'tachometer-alt',
    fileName: 'acls_bradycardia.pdf',
    source: require('../../assets/pdfs/acls/acls_bradycardia.pdf'),
  },
  {
    title: 'Adult Tachycardia with Pulse Algorithm',
    color: COLORS.info,
    icon: 'bolt',
    fileName: 'acls_tachycardia.pdf',
    source: require('../../assets/pdfs/acls/acls_tachycardia.pdf'),
  },
  {
    title: 'Post-Cardiac Arrest Care Algorithm',
    color: COLORS.success,
    icon: 'user-nurse',
    fileName: 'acls_post_cardiac_arrest.pdf',
    source: require('../../assets/pdfs/acls/acls_post_cardiac_arrest.pdf'),
  },
  {
    title: 'Cardiac Arrest in Pregnancy',
    color: '#6f42c1',
    icon: 'pills',
    fileName: 'acls_pregnancy.pdf',
    source: require('../../assets/pdfs/acls/acls_pregnancy.pdf'),
  },
  {
    title: 'Opioid Emergency — Healthcare Providers',
    color: COLORS.dark,
    icon: 'pills',
    fileName: 'acls_opioid_hc_provider.pdf',
    source: require('../../assets/pdfs/acls/acls_opioid_hc_provider.pdf'),
  },
];

const notes = [
  'Based on AHA 2020 Guidelines',
  'Quick reference guides for emergency situations',
  'Follow institution\'s emergency response system',
  'Always verify with current AHA/ERC guidelines',
];

export default function ACLSScreen() {
  return (
    <ScreenWrapper title="ACLS Algorithms" subtitle="AHA 2020 Advanced Cardiac Life Support">
      {algorithms.map((algo, i) => (
        <View key={i} style={[styles.card, { borderLeftColor: algo.color }]}>
          <View style={[styles.cardHeader, { backgroundColor: algo.color }]}>
            <View style={styles.headerRow}>
              <FontAwesome5 name={algo.icon} size={14} color={COLORS.white} style={styles.headerIcon} />
              <Text style={styles.cardHeaderText}>{algo.title}</Text>
            </View>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.cardDesc}>Reference algorithm card for quick access during emergency situations.</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity style={[styles.openBtn, { backgroundColor: algo.color }]} onPress={() => openPdf(algo.source, algo.fileName, algo.title)}>
                <Text style={styles.openBtnText}>Open PDF</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.downloadBtn, { borderColor: algo.color }]} onPress={() => downloadPdf(algo.source, algo.fileName, algo.title)}>
                <Text style={[styles.downloadBtnText, { color: algo.color }]}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      <View style={styles.notesBox}>
        <Text style={styles.notesTitle}>Important Notes</Text>
        {notes.map((note, i) => <Text key={i} style={styles.noteItem}>• {note}</Text>)}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, marginBottom: SPACING.md, borderLeftWidth: 4, ...SHADOW, overflow: 'hidden' },
  cardHeader: { padding: SPACING.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 8 },
  cardHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  cardBody: { padding: SPACING.md },
  cardDesc: { fontSize: 13, color: COLORS.text, marginBottom: SPACING.sm },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  openBtn: { borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  openBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  downloadBtn: { borderWidth: 1, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  downloadBtnText: { fontSize: 12, fontWeight: '600' },
  notesBox: { backgroundColor: '#e8f4fd', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.sm },
  notesTitle: { fontSize: 15, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: SPACING.sm },
  noteItem: { fontSize: 13, color: COLORS.text, marginBottom: 4 },
});
