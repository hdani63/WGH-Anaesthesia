import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Modal, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/ScreenWrapper';
import FullScreenWebModal from '../components/common/FullScreenWebModal';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { getLocalPdfUri } from '../utils/pdfUtils';

const algorithms = [
  {
    title: 'Adult Cardiac Arrest Algorithm',
    color: COLORS.danger,
    icon: 'heart-broken',
    description: 'Standard ACLS cardiac arrest algorithm with VF/pVT and Asystole/PEA pathways.',
    fileName: 'acls_cardiac_arrest.pdf',
    source: require('../../assets/pdfs/acls/acls_cardiac_arrest.pdf'),
  },
  {
    title: 'Cardiac Arrest Circular Algorithm',
    color: COLORS.danger,
    icon: 'sync-alt',
    description: 'Circular format of the cardiac arrest algorithm for quick reference.',
    fileName: 'acls_cardiac_arrest_circular.pdf',
    source: require('../../assets/pdfs/acls/acls_cardiac_arrest_circular.pdf'),
  },
  {
    title: 'Adult Bradycardia Algorithm',
    color: COLORS.warning,
    icon: 'tachometer-alt',
    headerTextColor: COLORS.dark,
    description: 'Management of bradycardia with hemodynamic compromise, including atropine and pacing.',
    fileName: 'acls_bradycardia.pdf',
    source: require('../../assets/pdfs/acls/acls_bradycardia.pdf'),
  },
  {
    title: 'Adult Tachycardia with Pulse Algorithm',
    color: COLORS.info,
    icon: 'bolt',
    description: 'Management of tachycardia with pulse, including synchronized cardioversion and medications.',
    fileName: 'acls_tachycardia.pdf',
    source: require('../../assets/pdfs/acls/acls_tachycardia.pdf'),
  },
  {
    title: 'Post-Cardiac Arrest Care Algorithm',
    color: COLORS.success,
    icon: 'user-nurse',
    description: 'ROSC management including targeted temperature management and hemodynamic support.',
    fileName: 'acls_post_cardiac_arrest.pdf',
    source: require('../../assets/pdfs/acls/acls_post_cardiac_arrest.pdf'),
  },
  {
    title: 'Cardiac Arrest in Pregnancy',
    color: '#6f42c1',
    icon: 'baby',
    description: 'In-hospital ACLS for pregnant patients including perimortem cesarean delivery considerations.',
    fileName: 'acls_pregnancy.pdf',
    source: require('../../assets/pdfs/acls/acls_pregnancy.pdf'),
  },
  {
    title: 'Opioid Emergency - Healthcare Providers',
    color: COLORS.dark,
    icon: 'user-md',
    description: 'Opioid-associated emergency management algorithm for healthcare providers with naloxone protocols.',
    fileName: 'acls_opioid_hc_provider.pdf',
    source: require('../../assets/pdfs/acls/acls_opioid_hc_provider.pdf'),
  },
];

const notes = [
  'All algorithms are based on American Heart Association 2020 Guidelines',
  'These are quick reference guides - always follow your institution\'s protocols',
  'Click any algorithm to view the full PDF inside the app',
  'For emergencies, refer to your institution\'s emergency response system',
];

export default function ACLSScreen() {
  const { width } = useWindowDimensions();
  const isTwoColumn = width >= 768;
  const [viewerVisible, setViewerVisible] = useState(false);
  const [viewerUri, setViewerUri] = useState('');
  const [viewerTitle, setViewerTitle] = useState('ACLS Algorithm');
  const [loadingViewer, setLoadingViewer] = useState(false);
  const [viewerKey, setViewerKey] = useState(0);

  const handleOpenAlgorithm = async (algo) => {
    setLoadingViewer(true);
    setViewerTitle(algo.title);
    setViewerKey((previous) => previous + 1);

    try {
      const localUri = await getLocalPdfUri(algo.source, algo.fileName);
      setViewerUri(localUri);
      setViewerVisible(true);
    } catch (error) {
      Alert.alert('Unable to open algorithm', 'Please try again.');
    } finally {
      setLoadingViewer(false);
    }
  };

  return (
    <ScreenWrapper title="ACLS Algorithms" subtitle="American Heart Association ACLS Guidelines & Emergency Protocols">
      <View style={styles.cardsGrid}>
        {algorithms.map((algo, i) => (
          <View key={i} style={[styles.cardWrap, isTwoColumn ? styles.cardWrapTwo : styles.cardWrapOne]}>
            <View style={styles.card}>
              <View style={[styles.cardHeader, { backgroundColor: algo.color }]}>
                <View style={styles.headerRow}>
                  <FontAwesome5 name={algo.icon} size={14} color={algo.headerTextColor || COLORS.white} style={styles.headerIcon} />
                  <Text style={[styles.cardHeaderText, { color: algo.headerTextColor || COLORS.white }]}>{algo.title}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardDesc}>{algo.description}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity style={[styles.openBtn, { backgroundColor: algo.color }]} onPress={() => handleOpenAlgorithm(algo)}>
                    <Text style={styles.openBtnText}>View Algorithm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.notesBox}>
        <Text style={styles.notesTitle}>Important Notes</Text>
        {notes.map((note, i) => <Text key={i} style={styles.noteItem}>• {note}</Text>)}
      </View>

      <FullScreenWebModal
        visible={viewerVisible}
        title={viewerTitle}
        onClose={() => setViewerVisible(false)}
      >
        {loadingViewer ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading algorithm...</Text>
          </View>
        ) : (
          <WebView
            key={viewerKey}
            source={{ uri: viewerUri }}
            style={styles.viewerPdf}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loadingWrap}>
                <ActivityIndicator size="large" color={COLORS.primary} />
              </View>
            )}
            onError={() => Alert.alert('Unable to open algorithm', 'Please try again.')}
            originWhitelist={['*']}
            scalesPageToFit={true}
            scrollEnabled={true}
            javaScriptEnabled={false}
            cacheEnabled={false}
          />
        )}
      </FullScreenWebModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  cardsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  cardWrap: { paddingHorizontal: 6, marginBottom: SPACING.md },
  cardWrapOne: { width: '100%' },
  cardWrapTwo: { width: '50%' },
  card: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, borderWidth: 1, borderColor: COLORS.border, ...SHADOW, overflow: 'hidden' },
  cardHeader: { padding: SPACING.sm },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { marginRight: 8 },
  cardHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  cardBody: { padding: SPACING.md },
  cardDesc: { fontSize: 13, color: COLORS.text, marginBottom: SPACING.sm },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  openBtn: { borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  openBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  notesBox: { backgroundColor: '#e8f4fd', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.sm },
  notesTitle: { fontSize: 15, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: SPACING.sm },
  noteItem: { fontSize: 13, color: COLORS.text, marginBottom: 4 },
  loadingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  viewerPdf: {
    flex: 1,
  },
});
