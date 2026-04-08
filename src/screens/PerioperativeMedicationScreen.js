import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const MEDICATIONS = [
  // Antiplatelet
  { name: 'Aspirin', cls: 'Antiplatelet', rec: 'Hold (unless recent stent/ACS)', stop: '7 days', restart: '24-48h if hemostasis achieved', notes: 'Continue if high cardiac risk; consult cardiology' },
  { name: 'Clopidogrel (Plavix)', cls: 'Antiplatelet', rec: 'Hold', stop: '5 days', restart: '24-48h if hemostasis achieved', notes: 'Continue if high cardiac risk; consult cardiology' },
  { name: 'Prasugrel (Effient)', cls: 'Antiplatelet', rec: 'Stop before surgery', stop: '7 days before', restart: '24h post-op', notes: 'Higher bleeding risk than clopidogrel' },
  { name: 'Ticagrelor (Brilinta)', cls: 'Antiplatelet', rec: 'Stop before surgery', stop: '5 days before', restart: '24h post-op', notes: 'Reversible P2Y12 inhibitor' },
  // Anticoagulant
  { name: 'Warfarin', cls: 'Anticoagulant', rec: 'Hold/bridge if high VTE risk', stop: '5 days', restart: 'When INR <2 and hemostasis achieved', notes: 'Bridge with LMWH for high-risk VTE/valve' },
  { name: 'Apixaban (Eliquis)', cls: 'Anticoagulant', rec: 'Hold', stop: '24-48h', restart: '24-48h if no bleeding', notes: 'Longer for renal impairment' },
  { name: 'Rivaroxaban (Xarelto)', cls: 'Anticoagulant', rec: 'Hold', stop: '24-48h', restart: '24-48h if no bleeding', notes: 'Longer for renal impairment' },
  { name: 'Dabigatran (Pradaxa)', cls: 'Anticoagulant', rec: 'Hold', stop: '24-72h (72h if renal impairment)', restart: '24-48h if no bleeding', notes: 'Renally excreted; idarucizumab reversal' },
  { name: 'Edoxaban', cls: 'Anticoagulant', rec: 'Hold', stop: '24-48h', restart: '24-48h if no bleeding', notes: 'As above for DOACs' },
  { name: 'Enoxaparin', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '12-24h before', restart: '12-24h post-op', notes: 'Prophylactic 12h; therapeutic 24h' },
  { name: 'Heparin (UFH)', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '4-6h before', restart: '12-24h if no bleeding', notes: 'IV infusion typically stopped about 4h pre-op' },
  // NSAIDs
  { name: 'Ibuprofen', cls: 'NSAID', rec: 'Hold', stop: '24h', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Naproxen', cls: 'NSAID', rec: 'Hold', stop: '3 days', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Diclofenac', cls: 'NSAID', rec: 'Hold', stop: '3 days', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Celecoxib (Celebrex)', cls: 'NSAID', rec: 'May continue', stop: 'No need (selective COX-2)', restart: 'N/A', notes: 'Minimal platelet effect' },
  // SSRIs
  { name: 'Sertraline', cls: 'SSRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Low serotonin syndrome risk' },
  { name: 'Fluoxetine', cls: 'SSRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Long half-life; mild platelet inhibition' },
  { name: 'Paroxetine', cls: 'SSRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Discontinuation syndrome risk' },
  { name: 'Citalopram', cls: 'SSRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'QTc monitoring' },
  { name: 'Escitalopram', cls: 'SSRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'QTc monitoring' },
  // SNRI
  { name: 'Venlafaxine', cls: 'SNRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Withdrawal risk if stopped' },
  { name: 'Duloxetine', cls: 'SNRI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Pain modulation benefit' },
  // TCA
  { name: 'Amitriptyline', cls: 'TCA', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Anti-cholinergic effects; ECG' },
  { name: 'Nortriptyline', cls: 'TCA', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Fewer anti-cholinergic effects' },
  // Antipsychotic
  { name: 'Olanzapine', cls: 'Antipsychotic', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Metabolic monitoring' },
  { name: 'Quetiapine', cls: 'Antipsychotic', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Sedation; orthostatic hypotension' },
  { name: 'Haloperidol', cls: 'Antipsychotic', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'QTc prolongation risk' },
  // MAOIs
  { name: 'Phenelzine', cls: 'MAOI', rec: 'Specialist guidance', stop: '2 weeks before (if stopping)', restart: 'Specialist advice', notes: 'Serotonin syndrome with meperidine/tramadol' },
  { name: 'Tranylcypromine', cls: 'MAOI', rec: 'Specialist guidance', stop: '2 weeks before', restart: 'Specialist advice', notes: 'Avoid indirect sympathomimetics' },
  // Lithium
  { name: 'Lithium', cls: 'Mood Stabilizer', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'When tolerating PO', notes: 'Monitor levels; renal function' },
  // Diabetes
  { name: 'Metformin', cls: 'Diabetes', rec: 'Hold perioperatively', stop: '24-48h before', restart: 'When renal function confirmed', notes: 'Lactic acidosis risk with contrast/renal impairment' },
  { name: 'Sulfonylureas', cls: 'Diabetes', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'When eating', notes: 'Hypoglycaemia risk; monitor glucose' },
  { name: 'SGLT2 Inhibitors', cls: 'Diabetes', rec: 'Stop before surgery', stop: '3-4 days before', restart: 'When eating normally', notes: 'Euglycaemic DKA risk — test ketones' },
  { name: 'GLP-1 Agonists', cls: 'Diabetes', rec: 'Hold before surgery', stop: '7 days before (weekly), day before (daily)', restart: 'When tolerating PO', notes: 'Delayed gastric emptying — aspiration risk' },
  // Beta-blockers
  { name: 'Metoprolol', cls: 'Beta-blocker', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Rebound tachycardia if stopped' },
  { name: 'Bisoprolol', cls: 'Beta-blocker', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Cardioprotective perioperatively' },
  { name: 'Atenolol', cls: 'Beta-blocker', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Take with sip of water' },
  { name: 'Propranolol', cls: 'Beta-blocker', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Non-selective; bronchospasm risk' },
  // ACE Inhibitors
  { name: 'Ramipril', cls: 'ACE Inhibitor', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Intraoperative hypotension risk' },
  { name: 'Lisinopril', cls: 'ACE Inhibitor', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Intraoperative hypotension risk' },
  { name: 'Perindopril', cls: 'ACE Inhibitor', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Commonly prescribed in Ireland' },
  { name: 'Enalapril', cls: 'ACE Inhibitor', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Intraoperative hypotension risk' },
  // ARBs
  { name: 'Losartan', cls: 'ARB', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Similar to ACEi guidance' },
  { name: 'Valsartan', cls: 'ARB', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Hypotension risk' },
  { name: 'Irbesartan', cls: 'ARB', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op when stable', notes: 'Hypotension risk' },
  // CCBs
  { name: 'Amlodipine', cls: 'CCB', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Mild peripheral oedema' },
  { name: 'Diltiazem', cls: 'CCB', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Rate control; monitor with beta-blockers' },
  { name: 'Verapamil', cls: 'CCB', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Avoid with beta-blockers (heart block)' },
  // Diuretics
  { name: 'Furosemide', cls: 'Diuretic', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op', notes: 'Electrolyte/volume depletion' },
  { name: 'Spironolactone', cls: 'Diuretic', rec: 'Continue with caution', stop: 'Consider holding', restart: 'When stable', notes: 'Hyperkalaemia risk' },
  { name: 'Bendroflumethiazide', cls: 'Diuretic', rec: 'Hold on surgery day', stop: 'Morning of surgery', restart: 'Post-op', notes: 'Electrolyte monitoring' },
  // Statins
  { name: 'Atorvastatin', cls: 'Statin', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Pleiotropic perioperative benefits' },
  { name: 'Rosuvastatin', cls: 'Statin', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'CV risk reduction' },
  // Thyroid
  { name: 'Levothyroxine', cls: 'Thyroid', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Take morning of surgery' },
  { name: 'Methimazole', cls: 'Thyroid', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Check thyroid function' },
  // Corticosteroids
  { name: 'Prednisone', cls: 'Corticosteroid', rec: 'Continue + stress dose', stop: 'Do not stop', restart: 'N/A', notes: 'Stress dose if >5mg/day for >3 weeks' },
  { name: 'Hydrocortisone', cls: 'Corticosteroid', rec: 'Stress dose cover', stop: 'Do not stop', restart: 'N/A', notes: 'IV hydrocortisone 25-100mg at induction' },
  // Biologics
  { name: 'Adalimumab', cls: 'Biologic', rec: 'Hold before surgery', stop: '14 days before', restart: '14 days post-op', notes: 'Infection risk; wound healing' },
  { name: 'Infliximab', cls: 'Biologic', rec: 'Hold before surgery', stop: 'After scheduled dose', restart: '14 days post-op', notes: 'Schedule surgery between doses' },
  // DMARDs
  { name: 'Methotrexate', cls: 'DMARD', rec: 'Continue (low risk)', stop: 'Do not stop (most cases)', restart: 'N/A', notes: 'ACR 2022: continue for most surgeries' },
  { name: 'Hydroxychloroquine', cls: 'DMARD', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Safe perioperatively' },
  // GI
  { name: 'Omeprazole', cls: 'PPI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Aspiration prophylaxis benefit' },
  { name: 'Pantoprazole', cls: 'PPI', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'IV available if NPO' },
  // Respiratory
  { name: 'Salbutamol', cls: 'Bronchodilator', rec: 'Continue', stop: 'Do not stop', restart: 'N/A', notes: 'Use pre-operatively if needed' },
  // Hormonal
  { name: 'Oral Contraceptives / HRT', cls: 'Hormonal', rec: 'Risk assessment', stop: '4-6 weeks before (major)', restart: '2 weeks post-mobilisation', notes: 'VTE risk; consider thromboprophylaxis' },
  // Herbal
  { name: 'Ginkgo Biloba', cls: 'Herbal', rec: 'Stop before surgery', stop: '7 days before', restart: 'Post-op', notes: 'Bleeding risk' },
  { name: 'Garlic Supplements', cls: 'Herbal', rec: 'Stop before surgery', stop: '7 days before', restart: 'Post-op', notes: 'Antiplatelet effect' },
  { name: 'St John\'s Wort', cls: 'Herbal', rec: 'Stop before surgery', stop: '5 days before', restart: 'Post-op', notes: 'CYP450 interactions — affects drug metabolism' },
  { name: 'Fish Oil / Omega-3', cls: 'Herbal', rec: 'Stop before surgery', stop: '7 days before', restart: 'Post-op', notes: 'Mild antiplatelet effect' },
];

const COLUMN_WIDTHS = [240, 150, 230, 170, 170, 260];
const TABLE_WIDTH = COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);

const SECTION_ORDER = [
  'antithrombotic',
  'nsaid',
  'psychiatric',
  'diabetes',
  'cardio',
  'endocrine',
  'immuno',
  'other',
];

const SECTION_META = {
  antithrombotic: { label: 'ANTITHROMBOTIC MEDICATIONS', color: '#dc3545', icon: 'tint', textColor: COLORS.white },
  nsaid: { label: 'NSAID MEDICATIONS', color: '#6c757d', icon: 'pills', textColor: COLORS.white },
  psychiatric: { label: 'PSYCHIATRIC MEDICATIONS', color: '#17a2b8', icon: 'brain', textColor: COLORS.white },
  diabetes: { label: 'DIABETES MEDICATIONS', color: '#28a745', icon: 'chart-line', textColor: COLORS.white },
  cardio: { label: 'CARDIOVASCULAR MEDICATIONS', color: '#dc3545', icon: 'heart', textColor: COLORS.white },
  endocrine: { label: 'ENDOCRINE MEDICATIONS', color: '#6c757d', icon: 'capsules', textColor: COLORS.white },
  immuno: { label: 'IMMUNOSUPPRESSANTS', color: '#ffc107', icon: 'shield-virus', textColor: COLORS.dark },
  other: { label: 'SUPPLEMENTS & OTHERS', color: '#f8f9fa', icon: 'leaf', textColor: COLORS.dark, borderColor: COLORS.border },
};

const REFERENCE_ITEMS = [
  { text: 'UpToDate: Perioperative medication management', url: 'https://www.uptodate.com/contents/perioperative-medication-management' },
  { text: '2022 ACC/AHA Guideline for Perioperative Cardiovascular Evaluation', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001098' },
  { text: '2022 ASA Practice Advisory for Preanesthesia Evaluation', url: 'https://anesthesiology.pubs.asahq.org/article.aspx?articleid=2774132' },
  { text: '2024 ADA Standards of Care: Perioperative Management', url: 'https://diabetesjournals.org/care/article/47/Supplement_1/S255/153222/15-Management-of-Diabetes-in-Hospitalized' },
  { text: '2022 ACR Guideline for Perioperative Management of Antirheumatic Medication', url: 'https://www.rheumatology.org/guidelines' },
  { text: 'ACCP perioperative antithrombotic guidance' },
  { text: 'SPAQI Perioperative Medication Toolkit (2023)' },
  { text: 'ACOG guidance on perioperative hormonal contraceptives (2024)' },
  { text: 'SAMBA/APSF guidance on GLP-1 agonists and aspiration risk' },
  { text: 'BJA Education: Perioperative medication management (2023)', url: 'https://bjaed.org/article/S2058-5349(23)00098-3/fulltext' },
];

async function openReference(url) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open link', 'Please open this reference in your browser.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Unable to open link', 'Please open this reference in your browser.');
  }
}

function getSectionKey(medication) {
  const cls = medication.cls.toLowerCase();

  if (cls.includes('antiplatelet') || cls.includes('anticoagulant')) return 'antithrombotic';
  if (cls.includes('nsaid')) return 'nsaid';
  if (cls.includes('ssri') || cls.includes('snri') || cls.includes('tca') || cls.includes('antipsychotic') || cls.includes('maoi') || cls.includes('mood stabilizer')) return 'psychiatric';
  if (cls.includes('diabetes')) return 'diabetes';
  if (cls.includes('beta-blocker') || cls.includes('ace inhibitor') || cls.includes('arb') || cls.includes('ccb') || cls.includes('diuretic') || cls.includes('statin')) return 'cardio';
  if (cls.includes('thyroid') || cls.includes('corticosteroid')) return 'endocrine';
  if (cls.includes('biologic') || cls.includes('dmard')) return 'immuno';
  return 'other';
}

export default function PerioperativeMedicationScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MEDICATIONS;
    const q = search.toLowerCase();
    return MEDICATIONS.filter(m =>
      m.name.toLowerCase().includes(q) || m.cls.toLowerCase().includes(q)
    );
  }, [search]);

  const groupedRows = useMemo(() => {
    const grouped = SECTION_ORDER.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

    filtered.forEach((med) => {
      grouped[getSectionKey(med)].push(med);
    });

    const rows = [];
    SECTION_ORDER.forEach((key) => {
      if (!grouped[key].length) return;
      rows.push({ type: 'section', key, meta: SECTION_META[key] });
      grouped[key].forEach((med) => {
        rows.push({ type: 'medication', key: `${key}-${med.name}`, med });
      });
    });

    return rows;
  }, [filtered]);

  const classBadgeStyle = (cls) => {
    const c = cls.toLowerCase();
    if (c.includes('anticoagulant')) return { backgroundColor: COLORS.danger, color: COLORS.white };
    if (c.includes('antiplatelet')) return { backgroundColor: COLORS.warning, color: COLORS.dark };
    if (c.includes('ssri') || c.includes('snri') || c.includes('tca') || c.includes('antipsychotic') || c.includes('mood stabilizer')) return { backgroundColor: COLORS.info, color: COLORS.white };
    if (c.includes('diabetes')) return { backgroundColor: COLORS.success, color: COLORS.white };
    if (c.includes('thyroid') || c.includes('corticosteroid')) return { backgroundColor: COLORS.dark, color: COLORS.white };
    if (c.includes('biologic') || c.includes('dmard')) return { backgroundColor: COLORS.warning, color: COLORS.dark };
    if (c.includes('herbal') || c.includes('hormonal') || c.includes('ppi') || c.includes('bronchodilator')) return { backgroundColor: COLORS.light, color: COLORS.dark };
    return { backgroundColor: COLORS.primary, color: COLORS.white };
  };

  const recStyle = (rec) => {
    if (rec.toLowerCase().includes('continue')) return { color: COLORS.success };
    if (rec.toLowerCase().includes('stop') || rec.toLowerCase().includes('hold')) return { color: COLORS.danger };
    return { color: '#856404' };
  };

  return (
    <ScreenWrapper title="Perioperative Medication Management" subtitle="Comprehensive medication-by-medication perioperative guidelines (2024 Update)">
      <View style={styles.searchCard}>
        <View style={styles.searchInputWrap}>
          <View style={styles.searchIconBox}>
            <FontAwesome5 name="search" size={13} color={COLORS.white} />
          </View>
          <TextInput
            style={styles.searchInput}
            placeholder="Type medication name (e.g., aspirin, metformin, warfarin)..."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.searchMetaRow}>
          <Text style={styles.countText}>{filtered.length} medications found</Text>
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
            <FontAwesome5 name="times" size={11} color={COLORS.textMuted} style={styles.clearIcon} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.noticeBox}>
        <FontAwesome5 name="info-circle" size={14} color={COLORS.info} style={styles.noticeIcon} />
        <View style={styles.noticeContent}>
          <Text style={styles.noticeTitle}>Evidence-Based Guidelines (2024)</Text>
          <Text style={styles.noticeText}>
            Recommendations from major societies including ACC/AHA, ADA, ACR, ASA, ACCP, and ACOG.
          </Text>
          <Text style={styles.noticeSubText}>
            Always individualize care and consult anesthesia, surgery, and relevant specialties for complex cases.
          </Text>
        </View>
      </View>

      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <FontAwesome5 name="table" size={13} color={COLORS.white} style={styles.chartHeaderIcon} />
          <Text style={styles.chartHeaderText}>Comprehensive Perioperative Medication Chart</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
          <View style={styles.tableWrap}>
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[0] }]}>Medication Name (Trade/Generic)</Text>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[1] }]}>Class</Text>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[2] }]}>Perioperative Recommendation</Text>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[3] }]}>When to Stop Before Surgery</Text>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[4] }]}>When to Restart Postop</Text>
              <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[5] }]}>Key Notes</Text>
            </View>

            {groupedRows.map((row, i) => {
              if (row.type === 'section') {
                return (
                  <View
                    key={`section-${row.key}`}
                    style={[
                      styles.sectionBand,
                      {
                        backgroundColor: row.meta.color,
                        borderColor: row.meta.borderColor || row.meta.color,
                        width: TABLE_WIDTH,
                      },
                    ]}
                  >
                    <FontAwesome5 name={row.meta.icon} size={12} color={row.meta.textColor} style={styles.sectionBandIcon} />
                    <Text style={[styles.sectionBandText, { color: row.meta.textColor }]}>{row.meta.label}</Text>
                  </View>
                );
              }

              const med = row.med;
              const badge = classBadgeStyle(med.cls);

              return (
                <View key={row.key} style={[styles.tableDataRow, i % 2 === 1 && styles.tableDataRowAlt]}>
                  <Text style={[styles.tableDataCell, styles.medicationCell, { width: COLUMN_WIDTHS[0] }]}>{med.name}</Text>
                  <View style={[styles.tableDataCell, { width: COLUMN_WIDTHS[1] }]}> 
                    <Text style={[styles.classBadge, { backgroundColor: badge.backgroundColor, color: badge.color }]}>{med.cls}</Text>
                  </View>
                  <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[2] }, recStyle(med.rec)]}>{med.rec}</Text>
                  <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[3] }]}>{med.stop}</Text>
                  <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[4] }]}>{med.restart}</Text>
                  <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[5] }]}>{med.notes}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      {filtered.length === 0 && search.trim() ? (
        <View style={styles.noResultsBox}>
          <FontAwesome5 name="search" size={13} color="#856404" style={styles.noResultsIcon} />
          <View style={styles.noResultsTextWrap}>
            <Text style={styles.noResultsTitle}>No medications found</Text>
            <Text style={styles.noResultsText}>Try a different medication name or clear search to view all entries.</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.updatesCard}>
        <View style={styles.updatesHeader}>
          <FontAwesome5 name="calendar-alt" size={13} color={COLORS.white} style={styles.updatesHeaderIcon} />
          <Text style={styles.updatesHeaderText}>Key Updates (2024) & References (2022-2024)</Text>
        </View>

        <View style={styles.updatesBody}>
          <Text style={styles.updatesTitle}>Key Updates (2024)</Text>
          <Text style={styles.updateItem}>• SGLT2 inhibitors: hold 3 days pre-op (4 days for ertugliflozin) to reduce euglycemic DKA risk.</Text>
          <Text style={styles.updateItem}>• Biologics/DMARDs: most non-biologic DMARDs can continue; biologics often held 1-2 dosing cycles pre-op.</Text>
          <Text style={styles.updateItem}>• GLP-1 agonists: hold day before/day of surgery per local anesthesia protocol due to aspiration risk.</Text>
          <Text style={styles.updateItem}>• Oral contraceptives/HRT: hold around 4 weeks before major high-VTE-risk surgery.</Text>
          <Text style={styles.updateItem}>• ACE inhibitors/ARBs: hold morning of surgery and restart when stable.</Text>
          <Text style={styles.updateItem}>• Antiplatelets: individualize around stent/ACS status; consult cardiology when needed.</Text>

          <Text style={styles.referencesTitle}>References</Text>
          {REFERENCE_ITEMS.map((ref, i) => (
            <View key={`ref-${i}`} style={styles.refItemRow}>
              <Text style={styles.refIndex}>{i + 1}.</Text>
              {ref.url ? (
                <TouchableOpacity style={styles.refLinkTouch} onPress={() => openReference(ref.url)} activeOpacity={0.7}>
                  <Text style={[styles.refItem, styles.refLink]}>{ref.text}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.refItem}>{ref.text}</Text>
              )}
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center' },
  searchIconBox: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  searchMetaRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countText: { fontSize: 12, color: COLORS.textMuted },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
  },
  clearIcon: { marginRight: 5 },
  clearText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

  noticeBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfe8ff',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: { marginRight: 8, marginTop: 2 },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: 2 },
  noticeText: { fontSize: 12, color: COLORS.text, lineHeight: 17, marginBottom: 2 },
  noticeSubText: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },

  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    ...SHADOW,
  },
  chartHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartHeaderIcon: { marginRight: 8 },
  chartHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 14, flex: 1 },

  tableScrollContent: { paddingBottom: 2 },
  tableWrap: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, overflow: 'hidden', backgroundColor: COLORS.white, margin: SPACING.sm },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#212529', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableHeaderCell: { color: COLORS.white, fontWeight: '700', fontSize: 11, paddingVertical: 10, paddingHorizontal: 8, lineHeight: 15 },
  sectionBand: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sectionBandIcon: { marginRight: 6 },
  sectionBandText: { fontWeight: '700', fontSize: 11 },
  tableDataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableDataRowAlt: { backgroundColor: '#f8f9fa' },
  tableDataCell: { fontSize: 11, color: COLORS.text, lineHeight: 16, paddingVertical: 9, paddingHorizontal: 8 },
  medicationCell: { fontWeight: '700' },
  classBadge: { fontSize: 11, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', alignSelf: 'flex-start' },

  noResultsBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe69c',
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noResultsIcon: { marginRight: 8, marginTop: 2 },
  noResultsTextWrap: { flex: 1 },
  noResultsTitle: { fontSize: 13, fontWeight: '700', color: '#856404', marginBottom: 2 },
  noResultsText: { fontSize: 12, color: '#856404', lineHeight: 17 },

  updatesCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    marginTop: SPACING.md,
    overflow: 'hidden',
    ...SHADOW,
  },
  updatesHeader: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatesHeaderIcon: { marginRight: 8 },
  updatesHeaderText: { color: COLORS.white, fontSize: 13, fontWeight: '700', flex: 1 },
  updatesBody: { padding: SPACING.md },
  updatesTitle: { fontSize: 14, color: COLORS.success, fontWeight: '700', marginBottom: SPACING.xs },
  updateItem: { fontSize: 12, color: COLORS.text, lineHeight: 17, marginBottom: 6 },
  referencesTitle: { fontSize: 14, color: COLORS.info, fontWeight: '700', marginTop: SPACING.sm, marginBottom: SPACING.xs },
  refItemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 },
  refIndex: { width: 18, fontSize: 11, color: COLORS.text, lineHeight: 16 },
  refLinkTouch: { flex: 1 },
  refItem: { flex: 1, fontSize: 11, color: COLORS.text, lineHeight: 16 },
  refLink: { color: COLORS.primary, textDecorationLine: 'underline' },

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
