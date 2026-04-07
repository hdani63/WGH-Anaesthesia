import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const MEDICATIONS = [
  // Antiplatelet
  { name: 'Aspirin', cls: 'Antiplatelet', rec: 'Continue (low dose)', stop: 'No need to stop', restart: 'N/A', notes: 'Continue 75-100mg; discuss with cardiology if high dose' },
  { name: 'Clopidogrel (Plavix)', cls: 'Antiplatelet', rec: 'Stop before surgery', stop: '7 days before', restart: '24h post-op', notes: 'Discuss with cardiology if recent stent' },
  { name: 'Prasugrel (Effient)', cls: 'Antiplatelet', rec: 'Stop before surgery', stop: '7 days before', restart: '24h post-op', notes: 'Higher bleeding risk than clopidogrel' },
  { name: 'Ticagrelor (Brilinta)', cls: 'Antiplatelet', rec: 'Stop before surgery', stop: '5 days before', restart: '24h post-op', notes: 'Reversible P2Y12 inhibitor' },
  // Anticoagulant
  { name: 'Warfarin', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '5 days before', restart: 'Evening of surgery', notes: 'Check INR day of surgery; bridge if high risk' },
  { name: 'Apixaban (Eliquis)', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '48-72h before', restart: '48-72h post-op', notes: 'No bridging needed; renal dose adjustment' },
  { name: 'Rivaroxaban (Xarelto)', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '48-72h before', restart: '48-72h post-op', notes: 'No bridging; extend if CrCl <30' },
  { name: 'Dabigatran (Pradaxa)', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '48-96h (renal)', restart: '48-72h post-op', notes: 'Idarucizumab (Praxbind) for reversal' },
  { name: 'Edoxaban', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '48-72h before', restart: '48-72h post-op', notes: 'Similar to rivaroxaban' },
  { name: 'Enoxaparin', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '12-24h before', restart: '12-24h post-op', notes: 'Prophylactic 12h; therapeutic 24h' },
  { name: 'Heparin (UFH)', cls: 'Anticoagulant', rec: 'Stop before surgery', stop: '4-6h before', restart: '1h post-op (prophylactic)', notes: 'Check aPTT; protamine for reversal' },
  // NSAIDs
  { name: 'Ibuprofen', cls: 'NSAID', rec: 'Stop before surgery', stop: '24-48h before', restart: 'When safe', notes: 'Bleeding/renal risk' },
  { name: 'Naproxen', cls: 'NSAID', rec: 'Stop before surgery', stop: '4 days before', restart: 'When safe', notes: 'Longer half-life' },
  { name: 'Diclofenac', cls: 'NSAID', rec: 'Stop before surgery', stop: '24h before', restart: 'When safe', notes: 'CV and GI risk' },
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

export default function PerioperativeMedicationScreen() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return MEDICATIONS;
    const q = search.toLowerCase();
    return MEDICATIONS.filter(m =>
      m.name.toLowerCase().includes(q) || m.cls.toLowerCase().includes(q) || m.rec.toLowerCase().includes(q) || m.notes.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <ScreenWrapper title="Perioperative Medication" subtitle="Evidence-based medication management (2024)">
      <View style={styles.searchBox}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search medications..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search ? (
          <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.countText}>{filtered.length} medication{filtered.length !== 1 ? 's' : ''} found</Text>

      {filtered.map((med, i) => (
        <View key={i} style={styles.medCard}>
          <View style={styles.medHeader}>
            <Text style={styles.medName}>{med.name}</Text>
            <Text style={styles.medClass}>{med.cls}</Text>
          </View>
          <View style={styles.medBody}>
            <View style={styles.medRow}>
              <Text style={styles.medLabel}>Recommendation:</Text>
              <Text style={[styles.medValue, { color: med.rec.includes('Continue') ? COLORS.success : med.rec.includes('Stop') || med.rec.includes('Hold') ? COLORS.danger : COLORS.warning }]}>{med.rec}</Text>
            </View>
            <View style={styles.medRow}>
              <Text style={styles.medLabel}>Stop:</Text>
              <Text style={styles.medValue}>{med.stop}</Text>
            </View>
            <View style={styles.medRow}>
              <Text style={styles.medLabel}>Restart:</Text>
              <Text style={styles.medValue}>{med.restart}</Text>
            </View>
            <Text style={styles.medNotes}>{med.notes}</Text>
          </View>
        </View>
      ))}

      <View style={styles.refBox}>
        <Text style={styles.refTitle}>References</Text>
        {['UpToDate 2024', 'ACC/AHA 2022 Perioperative Guidelines', 'ASA 2022', 'ADA 2024 Standards of Care', 'ACR 2022 (DMARDs/Biologics)', 'SPAQI 2023 (SGLT2i/GLP-1)', 'BJA Education 2023'].map((r, i) => (
          <Text key={i} style={styles.refItem}>• {r}</Text>
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  searchBox: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  searchInput: { flex: 1, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, padding: 12, fontSize: 15, backgroundColor: COLORS.white },
  clearBtn: { position: 'absolute', right: 12, padding: 4 },
  clearText: { fontSize: 18, color: COLORS.textMuted },
  countText: { fontSize: 12, color: COLORS.textMuted, marginBottom: SPACING.md, textAlign: 'right' },
  medCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, marginBottom: SPACING.sm, ...SHADOW, overflow: 'hidden' },
  medHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f0f4f8', padding: SPACING.sm },
  medName: { fontWeight: '700', fontSize: 14, color: COLORS.text, flex: 1 },
  medClass: { fontSize: 11, color: COLORS.white, backgroundColor: COLORS.primary, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, overflow: 'hidden' },
  medBody: { padding: SPACING.sm },
  medRow: { flexDirection: 'row', marginBottom: 2 },
  medLabel: { fontWeight: '600', fontSize: 12, color: COLORS.textMuted, width: 110 },
  medValue: { fontSize: 12, color: COLORS.text, flex: 1 },
  medNotes: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 4 },
  refBox: { backgroundColor: '#e8f4fd', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.md },
  refTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue, marginBottom: SPACING.xs },
  refItem: { fontSize: 11, color: COLORS.text, marginBottom: 2 },
});
