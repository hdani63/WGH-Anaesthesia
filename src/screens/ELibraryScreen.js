import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { downloadPdf } from '../utils/pdfUtils';

// Mirrors the web app's E-Library (templates/e_library.html): a single
// "Resources" library grouped into Core Anaesthesia Textbooks and Training
// Resources. Only the books shipped with the reference are listed here.
const SECTIONS = [
  {
    key: 'core',
    label: 'Core Anaesthesia Textbooks',
    color: '#1a3a5c',
    books: [
      {
        title: "Morgan & Mikhail's Clinical Anesthesiology",
        edition: '7th Edition',
        badge: '2022',
        description:
          'The most comprehensive clinical anaesthesiology textbook, covering basic science, clinical anaesthesia techniques, pharmacology, and management of anaesthetic complications across all subspecialties.',
        fileName: 'morgan_mikhail_clinical_anesthesiology_7th.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_anesthesiology_7th.pdf'),
      },
      {
        title: 'Oxford Handbook of Anaesthesia',
        edition: '5th Edition',
        badge: 'Oxford',
        description:
          'Comprehensive pocket guide to anaesthesia covering all major subspecialties including regional, obstetric, paediatric, and cardiac anaesthesia with quick-reference protocols and drug dosing.',
        fileName: 'oxford_handbook_anaesthesia_5th.pdf',
        source: require('../../assets/pdfs/books/oxford_handbook_anaesthesia_5th.pdf'),
      },
      {
        title: "Morgan & Mikhail's Clinical Cases",
        edition: '1st Edition',
        badge: 'Cases',
        description:
          'Case-based companion to the main textbook with clinical scenarios covering the full spectrum of anaesthesia practice. Ideal for exam preparation and consolidating clinical knowledge.',
        fileName: 'morgan_mikhail_clinical_cases_1st.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_cases_1st.pdf'),
      },
    ],
  },
  {
    key: 'training',
    label: 'Training Resources',
    color: '#27ae60',
    books: [
      {
        title: 'Handbook for Trainees in Anaesthesia and Critical Care',
        edition: 'Trainees',
        badge: 'Training',
        description:
          'Practical guide for anaesthesia trainees covering core competencies, common procedures, clinical management, and critical care essentials. A valuable day-to-day reference for those in training.',
        fileName: 'handbook_trainees_anaesthesia_critical_care.pdf',
        source: require('../../assets/pdfs/books/handbook_trainees_anaesthesia_critical_care.pdf'),
      },
    ],
  },
];

function BookCard({ book, color }) {
  const navigation = useNavigation();
  const [loadingAction, setLoadingAction] = useState(null);

  const handleRead = async () => {
    try {
      setLoadingAction('open');
      navigation.navigate('PdfViewerScreen', { source: book.source, title: book.title, fileName: book.fileName });
    } catch {
      Alert.alert('Error', 'Unable to open the PDF reader.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDownload = async () => {
    try {
      setLoadingAction('download');
      await downloadPdf(book.source, book.fileName, book.title);
    } finally {
      setLoadingAction(null);
    }
  };

  const openLoading = loadingAction === 'open';
  const downloadLoading = loadingAction === 'download';
  const disabled = Boolean(loadingAction);

  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardTop}>
        <View style={[styles.iconWrap, { backgroundColor: color }]}>
          <FontAwesome5 name="book-open" size={18} color={COLORS.white} />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{book.title}</Text>
          <Text style={styles.cardEdition}>{book.edition}</Text>
        </View>
      </View>
      <Text style={styles.cardDesc}>{book.description}</Text>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.readBtn, { backgroundColor: color }, disabled && styles.disabledBtn]}
          onPress={handleRead}
          disabled={disabled}
        >
          {openLoading
            ? <ActivityIndicator color={COLORS.white} size="small" />
            : <><FontAwesome5 name="eye" size={12} color={COLORS.white} style={styles.btnIcon} /><Text style={styles.readBtnText}>Open</Text></>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.downloadBtn, { borderColor: color }, disabled && styles.disabledBtn]}
          onPress={handleDownload}
          disabled={disabled}
        >
          {downloadLoading
            ? <ActivityIndicator color={color} size="small" />
            : <><FontAwesome5 name="download" size={12} color={color} style={styles.btnIcon} /><Text style={[styles.downloadBtnText, { color }]}>Download</Text></>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ELibraryScreen() {
  const navigation = useNavigation();

  return (
    <ScreenWrapper title="E-Library" subtitle="Core textbooks & training resources">
      {SECTIONS.map((section) => (
        <View key={section.key} style={styles.section}>
          <View style={styles.sectionHeader}>
            <FontAwesome5
              name={section.key === 'training' ? 'user-graduate' : 'book'}
              size={14}
              color={section.color}
              style={styles.sectionIcon}
            />
            <Text style={[styles.sectionTitle, { color: section.color }]}>{section.label}</Text>
          </View>
          {section.books.map((book) => (
            <BookCard key={book.fileName} book={book} color={section.color} />
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
  section: { marginBottom: SPACING.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  sectionIcon: { marginRight: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '700' },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    borderLeftWidth: 4,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center' },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  cardInfo: { flex: 1 },
  cardTitle: { color: COLORS.text, fontSize: 14, fontWeight: '700', lineHeight: 19 },
  cardEdition: { color: COLORS.textMuted, fontSize: 12, marginTop: 2 },
  cardDesc: { color: COLORS.textMuted, fontSize: 12, lineHeight: 18, marginTop: SPACING.sm },
  cardActions: { flexDirection: 'row', marginTop: SPACING.md },
  btnIcon: { marginRight: 6 },
  readBtn: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  readBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 13 },
  downloadBtn: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: { fontWeight: '600', fontSize: 13 },
  disabledBtn: { opacity: 0.65 },
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
