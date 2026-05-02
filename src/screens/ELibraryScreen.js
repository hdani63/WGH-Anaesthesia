import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { downloadPdf } from '../utils/pdfUtils';

const TAB_DATA = [
  {
    key: 'primary',
    label: 'MCAI / Primary FRCA',
    color: '#1a3a5c',
    books: [
      {
        title: "Morgan & Mikhail's Clinical Anesthesiology",
        edition: '7th Edition',
        badge: '2022',
        fileName: 'morgan_mikhail_clinical_anesthesiology_7th.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_anesthesiology_7th.pdf'),
      },
      {
        title: 'Oxford Handbook of Anaesthesia',
        edition: '5th Edition',
        badge: 'Oxford',
        fileName: 'oxford_handbook_anesthesia_5th.pdf',
        source: require('../../assets/pdfs/books/oxford_handbook_anesthesia_5th.pdf'),
      },
      {
        title: 'MasterPass: The Primary FRCA Structured Study Guide',
        edition: '2016',
        badge: 'Primary',
        fileName: '2016 MasterPass_The_Primary_FRCA_Structured study guide 2.pdf',
        source: require('../../assets/pdfs/newPdfs/2016_masterpass_the_primary_frca_structured_study_guide_2.pdf'),
      },
      {
        title: 'Fundamentals of Anaesthesia',
        edition: '4th Edition',
        badge: '2016',
        fileName: '@Anesthetic_Books 2016 Fundamentals of Anaesthesia, 4th ed.pdf',
        source: require('../../assets/pdfs/newPdfs/anesthetic_books_2016_fundamentals_of_anesthesia_4th_ed.pdf'),
      },
      {
        title: 'Applied Anatomy for the FRCA',
        edition: 'Exam Text',
        badge: '2021',
        fileName: '@Anesthetic_Books 2021 Applied Anatomy for the FRCA.pdf',
        source: require('../../assets/pdfs/newPdfs/anesthetic_books_2021_applied_anatomy_for_the_frca.pdf'),
      },
      {
        title: 'Wests Respiratory Physiology',
        edition: 'Exam Reference',
        badge: '2016',
        fileName: '@Anesthetic_Books_2016_Wests_Respiratory.pdf',
        source: require('../../assets/pdfs/newPdfs/@Anesthetic_Books_2016_Wests_Respiratory.pdf'),
      },
      {
        title: 'Anatomy for Anesthetists',
        edition: 'Exam Reference',
        badge: 'Anatomy',
        fileName: 'Anatomy for Anesthetists_n.pdf',
        source: require('../../assets/pdfs/newPdfs/anatomy_for_anesthetists_n.pdf'),
      },
      {
        title: 'Get Through Primary FRCA - MTFs',
        edition: '1st Edition',
        badge: 'Primary',
        fileName: 'Get_Through_Primary_FRCA_-_MTFs_1E.pdf',
        source: require('../../assets/pdfs/newPdfs/Get_Through_Primary_FRCA_-_MTFs_1E.pdf'),
      },
      {
        title: 'MCQs for the Primary FRCA',
        edition: 'Question Bank',
        badge: 'Primary',
        fileName: 'MCQs for the Primary FRCA.pdf',
        source: require('../../assets/pdfs/newPdfs/mcqs_for_the_primary_frca.pdf'),
      },
      {
        title: 'Physics in Anaesthesia',
        edition: '2nd Edition',
        badge: '2021',
        fileName: 'MCU 2021 Physics in Anaesthesia, 2nd Edition.pdf',
        source: require('../../assets/pdfs/newPdfs/mcu_2021_physics_in_anesthesia_2nd_edition.pdf'),
      },
      {
        title: 'SBA and MTF MCQs for the Primary FRCA',
        edition: 'Question Bank',
        badge: 'Primary',
        fileName: 'SBA and MTF MCQs for the Primary FRCA_n.pdf',
        source: require('../../assets/pdfs/newPdfs/sba_and_mtf_mcqs_for_the_primary_frca_n.pdf'),
      },
    ],
  },
  {
    key: 'final',
    label: 'FCAI / Final FRCA',
    color: '#1f7a4c',
    books: [
      {
        title: "Morgan & Mikhail's Clinical Cases",
        edition: '1st Edition',
        badge: '2020',
        fileName: 'morgan_mikhail_clinical_cases_1st.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_cases_1st.pdf'),
      },
      {
        title: 'Handbook for Trainees in Anaesthesia and Critical Care',
        edition: 'Trainees',
        badge: 'Training',
        fileName: 'handbook_trainees_anesthesia_critical_care.pdf',
        source: require('../../assets/pdfs/books/handbook_trainees_anesthesia_critical_care.pdf'),
      },
      {
        title: 'Essentials of E',
        edition: 'Exam Text',
        badge: '2019',
        fileName: '@Anesthetic_Books 2019 Essentials of E.pdf',
        source: require('../../assets/pdfs/newPdfs/anesthetic_books_2019_essentials_of_e.pdf'),
      },
      {
        title: 'SBAs for the Final FRCA',
        edition: 'Question Bank',
        badge: '2019',
        fileName: '@Anesthetic_Books 2019 SBAs for the Final FRCA.pdf',
        source: require('../../assets/pdfs/newPdfs/anesthetic_books_2019_sbas_for_the_final_frca.pdf'),
      },
      {
        title: 'Dr Podcast',
        edition: 'Exam Audio Notes',
        badge: '2011',
        fileName: '@Anesthetic_Books_2011_Dr_Podcast.pdf',
        source: require('../../assets/pdfs/newPdfs/@Anesthetic_Books_2011_Dr_Podcast.pdf'),
      },
      {
        title: 'The Final',
        edition: 'Exam Text',
        badge: '2016',
        fileName: '@Anesthetic_Books_2016_The_Final.pdf',
        source: require('../../assets/pdfs/newPdfs/@Anesthetic_Books_2016_The_Final.pdf'),
      },
      {
        title: 'Smith and',
        edition: 'Exam Text',
        badge: '2019',
        fileName: '@Anesthetic_Books_2019_Smith_and.pdf',
        source: require('../../assets/pdfs/newPdfs/@Anesthetic_Books_2019_Smith_and.pdf'),
      },
      {
        title: 'Advanced Training in Anaesthesia',
        edition: 'Exam Reference',
        badge: '2014',
        fileName: 'Advanced_Training_in_Anesthesia_2014.pdf',
        source: require('../../assets/pdfs/newPdfs/Advanced_Training_in_Anesthesia_2014.pdf'),
      },
      {
        title: 'CRQs for the Final FRCA',
        edition: 'Question Bank',
        badge: '2019',
        fileName: 'CRQs for the Final FRCA 2019 (3).pdf',
        source: require('../../assets/pdfs/newPdfs/crqs_for_the_final_frca_2019_3.pdf'),
      },
      {
        title: 'Exam Preparation Tips',
        edition: 'Guide',
        badge: 'Tips',
        fileName: 'Exam preparation tips.pdf',
        source: require('../../assets/pdfs/newPdfs/exam_preparation_tips.pdf'),
      },
      {
        title: 'Final FRCA - 300 SBAs',
        edition: 'Question Bank',
        badge: 'Final',
        fileName: 'Final_FRCA-_300_SBAs.pdf',
        source: require('../../assets/pdfs/newPdfs/Final_FRCA-_300_SBAs.pdf'),
      },
      {
        title: 'MasterPass The Final FRCA SAQs',
        edition: 'Question Bank',
        badge: 'Final',
        fileName: 'Masterpass The final FRCA SAQs.pdf',
        source: require('../../assets/pdfs/newPdfs/masterpass_the_final_frca_saqs.pdf'),
      },
      {
        title: 'Clinical Anaesthesia Viva Book',
        edition: 'Second Edition',
        badge: 'Viva',
        fileName: 'The Clinical Anaesthesia Viva Book Second Edition.pdf',
        source: require('../../assets/pdfs/newPdfs/the_clinical_anesthesia_viva_book_second_edition.pdf'),
      },
      {
        title: 'Anaesthesia Science Viva Book',
        edition: '2nd Edition',
        badge: 'Viva',
        fileName: 'The_Anesthesia_Science_Viva_Book__2nd_Edition (2).pdf',
        source: require('../../assets/pdfs/newPdfs/the_anesthesia_science_viva_book_2nd_edition_2.pdf'),
      },
    ],
  },
];

function BookTile({ book, color }) {
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
    <View style={styles.tile}>
      <TouchableOpacity activeOpacity={0.85} onPress={handleRead} disabled={disabled}>
        <View style={[styles.cover, { borderColor: color }]}> 
          <View style={[styles.coverHead, { backgroundColor: color }]}>
            <FontAwesome5 name="book" size={12} color={COLORS.white} />
            <Text style={styles.coverBadge}>{book.badge}</Text>
          </View>
          <View style={styles.coverBody}>
            <Text style={styles.coverTitle} numberOfLines={4}>{book.title}</Text>
            <Text style={styles.coverEdition} numberOfLines={1}>{book.edition}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.tileActions}>
        <TouchableOpacity
          style={[styles.readBtn, { backgroundColor: color }, disabled && styles.disabledBtn]}
          onPress={handleRead}
          disabled={disabled}
        >
          {openLoading ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.readBtnText}>Read</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.downloadBtn, { borderColor: color }, disabled && styles.disabledBtn]}
          onPress={handleDownload}
          disabled={disabled}
        >
          {downloadLoading ? <ActivityIndicator color={color} size="small" /> : <Text style={[styles.downloadBtnText, { color }]}>Download</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ELibraryScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('primary');

  const currentTab = TAB_DATA.find((tab) => tab.key === activeTab) || TAB_DATA[0];

  return (
    <ScreenWrapper title="E-Library" subtitle="Exam-focused resources">
      <View style={styles.tabRow}>
        {TAB_DATA.map((tab) => {
          const selected = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabBtn,
                selected ? { backgroundColor: tab.color, borderColor: tab.color } : styles.tabBtnIdle,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text style={[styles.tabBtnText, selected ? styles.tabBtnTextActive : styles.tabBtnTextIdle]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.grid}>
        {currentTab.books.map((book) => (
          <BookTile key={book.fileName} book={book} color={currentTab.color} />
        ))}
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabRow: { flexDirection: 'row', marginBottom: SPACING.md },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    borderWidth: 1,
    marginRight: SPACING.xs,
    alignItems: 'center',
  },
  tabBtnIdle: { backgroundColor: '#f3f6fa', borderColor: '#d7dee8' },
  tabBtnText: { fontSize: 12, fontWeight: '700', textAlign: 'center' },
  tabBtnTextActive: { color: COLORS.white },
  tabBtnTextIdle: { color: COLORS.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  tile: { width: '48%', marginBottom: SPACING.md },
  cover: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
    ...SHADOW,
  },
  coverHead: {
    height: 28,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  coverBadge: { color: COLORS.white, fontSize: 10, fontWeight: '700' },
  coverBody: { minHeight: 136, padding: 10, justifyContent: 'space-between' },
  coverTitle: { color: COLORS.text, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  coverEdition: { color: COLORS.textMuted, fontSize: 11, marginTop: 8 },
  tileActions: { flexDirection: 'row', marginTop: 8 },
  readBtn: {
    flex: 1,
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
    marginRight: 6,
  },
  readBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
  downloadBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 7,
    alignItems: 'center',
  },
  downloadBtnText: { fontWeight: '600', fontSize: 12 },
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
