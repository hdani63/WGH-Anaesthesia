import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const RESOURCE_SECTIONS = [
  {
    id: 'core',
    title: 'Core Anaesthesia Textbooks',
    color: '#1a3a5c',
    icon: 'book',
    items: [
      {
        title: "Morgan & Mikhail's Clinical Anesthesiology",
        edition: '7th Edition',
        badge: '2022',
        editionTone: 'secondary',
        desc: 'Comprehensive clinical anaesthesiology textbook covering basic science, techniques, pharmacology, and subspecialties.',
        fileName: 'morgan_mikhail_clinical_anesthesiology_7th.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_anesthesiology_7th.pdf'),
      },
      {
        title: 'Oxford Handbook of Anaesthesia',
        edition: '5th Edition',
        badge: 'Oxford',
        editionTone: 'secondary',
        desc: 'Comprehensive pocket guide with rapid-reference protocols, practical procedures, and drug dosing.',
        fileName: 'oxford_handbook_anaesthesia_5th.pdf',
        source: require('../../assets/pdfs/books/oxford_handbook_anaesthesia_5th.pdf'),
      },
      {
        title: "Morgan & Mikhail's Clinical Cases",
        edition: '1st Edition',
        badge: '2020',
        editionTone: 'secondary',
        desc: 'Case-based anaesthesia companion covering common and high-yield perioperative scenarios.',
        fileName: 'morgan_mikhail_clinical_cases_1st.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_cases_1st.pdf'),
      },
    ],
  },
  {
    id: 'training',
    title: 'Training Resources',
    color: '#27ae60',
    icon: 'user-graduate',
    items: [
      {
        title: 'Handbook for Trainees in Anaesthesia and Critical Care',
        edition: 'Trainees',
        badge: 'Training',
        editionTone: 'success',
        desc: 'Practical guide for trainees covering competencies, procedures, and critical care essentials.',
        fileName: 'handbook_trainees_anaesthesia_critical_care.pdf',
        source: require('../../assets/pdfs/books/handbook_trainees_anaesthesia_critical_care.pdf'),
      },
    ],
  },
];

function BookCard({ book, categoryColor }) {
  const [loadingAction, setLoadingAction] = useState(null);

  const handleAction = async (type, action) => {
    try {
      setLoadingAction(type);
      await action();
    } catch (error) {
      // PDF utilities handle user-facing errors.
    } finally {
      setLoadingAction(null);
    }
  };

  const openLoading = loadingAction === 'open';
  const downloadLoading = loadingAction === 'download';
  const disabled = Boolean(loadingAction);

  return (
    <View style={[styles.bookCard, { borderLeftColor: categoryColor }]}>
      <View style={[styles.bookIcon, { backgroundColor: categoryColor }]}>
        <FontAwesome5 name="book-open" size={20} color={COLORS.white} />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <View style={styles.metaRow}>
          <Text style={[styles.smallBadge, book.editionTone === 'success' ? styles.successBadge : styles.secondaryBadge]}>{book.edition}</Text>
          <Text style={[styles.smallBadge, { backgroundColor: categoryColor }]}>{book.badge}</Text>
        </View>
        <Text style={styles.bookDesc}>{book.desc}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.openBtn, { backgroundColor: categoryColor }, disabled && styles.disabledBtn]}
            onPress={() => handleAction('open', () => openPdf(book.source, book.fileName, book.title))}
            disabled={disabled}
          >
            {openLoading ? <ActivityIndicator color={COLORS.white} size="small" /> : (
              <View style={styles.buttonContent}>
                <FontAwesome5 name="eye" size={11} color={COLORS.white} style={styles.buttonIcon} />
                <Text style={styles.openBtnText}>Open</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.downloadBtn, { borderColor: categoryColor }, disabled && styles.disabledBtn]}
            onPress={() => handleAction('download', () => downloadPdf(book.source, book.fileName, book.title))}
            disabled={disabled}
          >
            {downloadLoading ? <ActivityIndicator color={categoryColor} size="small" /> : (
              <View style={styles.buttonContent}>
                <FontAwesome5 name="download" size={11} color={categoryColor} style={styles.buttonIcon} />
                <Text style={[styles.downloadBtnText, { color: categoryColor }]}>Download</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ELibraryScreen() {
  const navigation = useNavigation();
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  const toggleResources = (nextOpen) => {
    setResourcesOpen(nextOpen);
    if (!nextOpen) {
      setActiveSection(null);
    }
  };

  const toggleSection = (id, nextOpen) => {
    setActiveSection(nextOpen ? id : null);
  };

  return (
    <ScreenWrapper title="E-Library" subtitle="Curated resources for the WGH Anaesthesia Department">
      <View style={styles.heroCard}>
        <View style={styles.heroIconWrap}>
          <FontAwesome5 name="book-open" size={18} color={COLORS.white} />
        </View>
        <View style={styles.heroTextWrap}>
          <Text style={styles.heroTitle}>Anaesthesia E-Library</Text>
          <Text style={styles.heroSubtitle}>Department resources grouped by topic for fast access.</Text>
        </View>
      </View>

      <CollapsibleCard
        title="Resources"
        icon="book-open"
        iconColor="#1a3a5c"
        open={resourcesOpen}
        onToggle={toggleResources}
      >
        {RESOURCE_SECTIONS.map((section) => (
          <CollapsibleCard
            key={section.id}
            title={section.title}
            icon={section.icon}
            iconColor={section.color}
            open={activeSection === section.id}
            onToggle={(nextOpen) => toggleSection(section.id, nextOpen)}
          >
            {section.items.map((book) => (
              <BookCard key={book.fileName} book={book} categoryColor={section.color} />
            ))}
          </CollapsibleCard>
        ))}
      </CollapsibleCard>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#e8f1fb',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#cfe0f5',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 9,
    backgroundColor: '#1a3a5c',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  heroTextWrap: { flex: 1 },
  heroTitle: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 2 },
  heroSubtitle: { fontSize: 12, color: COLORS.textMuted, lineHeight: 17 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  bookIcon: {
    width: 46,
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  bookInfo: { flex: 1 },
  bookTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 2, lineHeight: 20 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  smallBadge: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 6,
  },
  secondaryBadge: {
    backgroundColor: '#6c757d',
  },
  successBadge: {
    backgroundColor: '#198754',
  },
  bookDesc: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.sm, lineHeight: 17 },
  buttonRow: { flexDirection: 'row', alignItems: 'center' },
  openBtn: {
    borderRadius: 6,
    paddingVertical: 7,
    paddingHorizontal: 16,
    minWidth: 78,
    alignItems: 'center',
    marginRight: 8,
  },
  downloadBtn: {
    borderRadius: 6,
    borderWidth: 1,
    paddingVertical: 7,
    paddingHorizontal: 12,
    minWidth: 92,
    alignItems: 'center',
  },
  disabledBtn: {
    opacity: 0.65,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: { marginRight: 6 },
  openBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
  downloadBtnText: { fontWeight: '600', fontSize: 12 },
  homeBtn: {
    marginTop: SPACING.md,
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
