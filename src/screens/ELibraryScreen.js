import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const BOOKS = [
  {
    category: 'Core Textbooks',
    color: '#1a3a5c',
    icon: 'book',
    items: [
      {
        title: "Morgan & Mikhail's Clinical Anesthesiology",
        edition: '7th Edition',
        badge: '2022',
        desc: 'Comprehensive clinical anaesthesiology textbook covering basic science, techniques, pharmacology, and subspecialties.',
        fileName: 'morgan_mikhail_clinical_anesthesiology_7th.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_anesthesiology_7th.pdf'),
      },
      {
        title: 'Oxford Handbook of Anaesthesia',
        edition: '5th Edition',
        badge: 'Oxford',
        desc: 'Comprehensive pocket guide with rapid-reference protocols, practical procedures, and drug dosing.',
        fileName: 'oxford_handbook_anaesthesia_5th.pdf',
        source: require('../../assets/pdfs/books/oxford_handbook_anaesthesia_5th.pdf'),
      },
      {
        title: "Morgan & Mikhail's Clinical Cases",
        edition: '1st Edition',
        badge: '2020',
        desc: 'Case-based anaesthesia companion covering common and high-yield perioperative scenarios.',
        fileName: 'morgan_mikhail_clinical_cases_1st.pdf',
        source: require('../../assets/pdfs/books/morgan_mikhail_clinical_cases_1st.pdf'),
      },
    ],
  },
  {
    category: 'Training Resources',
    color: '#27ae60',
    icon: 'user-graduate',
    items: [
      {
        title: 'Handbook for Trainees in Anaesthesia and Critical Care',
        edition: 'Trainees',
        badge: 'Training',
        desc: 'Practical guide for trainees covering competencies, procedures, and critical care essentials.',
        fileName: 'handbook_trainees_anaesthesia_critical_care.pdf',
        source: require('../../assets/pdfs/books/handbook_trainees_anaesthesia_critical_care.pdf'),
      },
    ],
  },
];

function BookCard({ book, categoryColor }) {
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    try {
      setLoading(true);
      await openPdf(book.source, book.fileName, book.title);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadPdf(book.source, book.fileName, book.title);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.bookCard, { borderLeftColor: categoryColor }]}>
      <View style={[styles.bookIcon, { backgroundColor: categoryColor }]}> 
        <FontAwesome5 name="book-open" size={20} color={COLORS.white} />
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{book.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.bookEdition}>{book.edition}</Text>
          <Text style={[styles.smallBadge, { backgroundColor: categoryColor }]}>{book.badge}</Text>
        </View>
        <Text style={styles.bookDesc}>{book.desc}</Text>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.openBtn, { backgroundColor: categoryColor }]} onPress={handleOpen} disabled={loading}>
            {loading ? <ActivityIndicator color={COLORS.white} size="small" /> : <Text style={styles.openBtnText}>Open</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.downloadBtn, { borderColor: categoryColor }]} onPress={handleDownload} disabled={loading}>
            <Text style={[styles.downloadBtnText, { color: categoryColor }]}>Download</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function ELibraryScreen() {
  return (
    <ScreenWrapper title="E-Library" subtitle="Curated resources for the WGH Anaesthesia Department">
      {BOOKS.map((cat, i) => (
        <CollapsibleCard
          key={i}
          title={`${cat.category}`}
          defaultOpen={i === 0}
          rightContent={<FontAwesome5 name={cat.icon} size={16} color={cat.color} />}
        >
          {cat.items.map((book, j) => (
            <BookCard key={j} book={book} categoryColor={cat.color} />
          ))}
        </CollapsibleCard>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
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
  bookTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 2 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  bookEdition: { fontSize: 12, color: COLORS.primary, marginRight: 6 },
  smallBadge: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    overflow: 'hidden',
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
  openBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
  downloadBtnText: { fontWeight: '600', fontSize: 12 },
});
