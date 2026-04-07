import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const RAPM_DOC = {
  title: 'RAPM ASRA 5th Edition (2025)',
  fileName: 'rapm_2024_105766_full.pdf',
  source: require('../../assets/pdfs/neuraxial/rapm_2024_105766_full.pdf'),
};

function DataTable({ headers, rows }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {headers.map((h, i) => <Text key={i} style={[styles.headerCell, { minWidth: i === 0 ? 120 : 100 }]}>{h}</Text>)}
        </View>
        {rows.map((row, i) => (
          <View key={i} style={[styles.dataRow, i % 2 === 0 && styles.altRow]}>
            {row.map((cell, j) => <Text key={j} style={[styles.dataCell, { minWidth: j === 0 ? 120 : 100 }]}>{cell}</Text>)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function InfoBox({ title, items, color }) {
  return (
    <View style={[styles.infoBox, { borderLeftColor: color || COLORS.primary }]}>
      <Text style={styles.infoTitle}>{title}</Text>
      {items.map((item, i) => <Text key={i} style={styles.infoItem}>• {item}</Text>)}
    </View>
  );
}

const tabs = ['Overview', 'Heparin', 'DOACs', 'Antiplatelet', 'Warfarin'];

export default function NeuraxialAnticoagulationScreen() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ScreenWrapper title="Neuraxial & Anticoagulation" subtitle="ASRA 5th Edition Guidelines (2025)">
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(RAPM_DOC.source, RAPM_DOC.fileName, RAPM_DOC.title)}>
          <Text style={styles.primaryBtnText}>Open Full Guideline PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(RAPM_DOC.source, RAPM_DOC.fileName, RAPM_DOC.title)}>
          <Text style={styles.outlineBtnText}>Download</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab, i) => (
          <Text key={i} onPress={() => setActiveTab(i)} style={[styles.tab, activeTab === i && styles.tabActive]}>{tab}</Text>
        ))}
      </View>

      {activeTab === 0 && (
        <View>
          <View style={styles.alertBox}>
            <Text style={styles.alertText}>These guidelines follow an antihemorrhagic approach. When in doubt, delay the procedure.</Text>
          </View>
          <InfoBox title="Timing Nomenclature" items={['Low Dose (formerly "prophylactic")', 'High Dose (formerly "therapeutic")']} color={COLORS.info} />
          <InfoBox title="Safety Measures" items={[
            'Document anticoagulant timing before procedure',
            'Use smallest effective needle/catheter',
            'Avoid procedure if coagulopathy suspected',
            'Monitor neurological status post-procedure',
          ]} color={COLORS.success} />
          <InfoBox title="Risk Factors for Bleeding" items={[
            'Patient: Age, female, renal impairment, thrombocytopenia',
            'Procedural: Multiple attempts, traumatic procedure, epidural vs spinal',
            'Medication: Multiple anticoagulants, timing non-adherence',
          ]} color={COLORS.danger} />
        </View>
      )}

      {activeTab === 1 && (
        <View>
          <CollapsibleCard title="Unfractionated Heparin (UFH)">
            <DataTable headers={['Route/Dose', 'Pre-Procedure', 'Post-Procedure', 'Catheter Removal', 'Monitoring']} rows={[
              ['IV Therapeutic', '4-6 hours + normal aPTT', '1 hour after removal', '4-6 hours after last dose', 'aPTT, platelet count'],
              ['SC Low Dose (5000 U BID/TID)', '4-6 hours', '1 hour after removal', '4-6 hours after last dose', 'Platelet count if >4 days'],
              ['SC Higher Dose (7500-10000 U BID)', '12 hours + normal aPTT', '2 hours after removal', '4-6 hours', 'aPTT, anti-Xa'],
              ['SC Very High (>20000 U/day)', '24 hours + normal aPTT', '6 hours after removal', '4-6 hours', 'aPTT mandatory'],
            ]} />
          </CollapsibleCard>
          <CollapsibleCard title="Low Molecular Weight Heparin (LMWH)">
            <DataTable headers={['Indication', 'Pre-Procedure', 'Post-Procedure', 'Catheter Mgmt', 'Special']} rows={[
              ['Low Dose (e.g. 40mg enox)', '12 hours', '4 hours after removal', 'Remove ≥12h after dose', 'Check anti-Xa if renal impairment'],
              ['High Dose (e.g. 1mg/kg enox)', '24 hours', '4 hours after removal', 'Remove ≥24h after dose', 'Delay if CrCl <30'],
              ['Twice Daily Dosing', '24 hours', '4 hours after removal', 'Remove ≥24h after dose', 'Higher risk — consider alternatives'],
            ]} />
            <Text style={styles.noteText}>Note: For CrCl &lt;30 mL/min, extend all time intervals and consider anti-Xa levels</Text>
          </CollapsibleCard>
        </View>
      )}

      {activeTab === 2 && (
        <View>
          <CollapsibleCard title="Direct Oral Anticoagulants">
            <DataTable headers={['Drug', 'Low Dose', 'High Dose', 'Pre-Procedure', 'Post-Procedure', 'Catheter Removal']} rows={[
              ['Rivaroxaban (Xarelto)', '10mg daily', '15-20mg daily', '72 hours', '6h after removal', '6h before restart'],
              ['Apixaban (Eliquis)', '2.5mg BID', '5-10mg BID', '72 hours', '6h after removal', '6h before restart'],
              ['Edoxaban (Lixiana)', 'N/A', '30-60mg daily', '72 hours', '6h after removal', '6h before restart'],
              ['Dabigatran (Pradaxa)', '110-220mg daily', '150mg BID', '48-72h*', '6h after removal', '6h before restart'],
            ]} />
          </CollapsibleCard>
          <InfoBox title="Dabigatran: Renal Adjustment" items={[
            'CrCl >80: 48 hours pre-procedure',
            'CrCl 50-80: 72 hours pre-procedure',
            'CrCl 30-50: 96 hours pre-procedure',
          ]} color={COLORS.warning} />
          <InfoBox title="Drug-Specific Assays" items={[
            'Rivaroxaban/Apixaban: Anti-Xa level (<50 ng/mL acceptable)',
            'Dabigatran: Dilute thrombin time (<30 ng/mL acceptable)',
          ]} color={COLORS.info} />
        </View>
      )}

      {activeTab === 3 && (
        <View>
          <CollapsibleCard title="Antiplatelet Agents">
            <DataTable headers={['Drug Class', 'Examples', 'Pre-Procedure', 'Notes']} rows={[
              ['COX-1 Inhibitors', 'Aspirin, NSAIDs', 'No precautions', 'Safe to continue'],
              ['P2Y12 Inhibitors', 'Clopidogrel, Prasugrel, Ticagrelor', '5-7 days', 'Check platelet function if urgent'],
              ['Ticlopidine', 'Ticlopidine', '10 days', 'Rarely used now'],
              ['GP IIb/IIIa Inhibitors', 'Abciximab, Eptifibatide', 'Return to normal aggregation', 'Usually 24-48 hours'],
              ['Cangrelor', 'Cangrelor', '3 hours', 'Short-acting IV agent'],
            ]} />
          </CollapsibleCard>
        </View>
      )}

      {activeTab === 4 && (
        <View>
          <CollapsibleCard title="Warfarin Management">
            <DataTable headers={['Timing', 'INR Requirement', 'Notes']} rows={[
              ['Pre-procedure', 'INR <1.4-1.5', 'Stop 5 days before'],
              ['Catheter placement', 'INR <1.4-1.5', 'Check on day of procedure'],
              ['Catheter removal', 'INR <1.5', 'Check same day'],
              ['Restart', 'Same day as removal', 'Evening of procedure/removal'],
            ]} />
          </CollapsibleCard>
          <CollapsibleCard title="Bridging Therapy">
            <DataTable headers={['Risk Level', 'Annual Risk', 'Recommendation']} rows={[
              ['High (>10%/yr)', 'Mech valve, recent VTE, severe thrombophilia', 'Bridging Recommended'],
              ['Moderate (5-10%/yr)', 'AF with risk factors, prior VTE', 'Consider Bridging'],
              ['Low (<5%/yr)', 'AF without risk factors, single VTE >12mo', 'No Bridging'],
            ]} />
            <InfoBox title="Bridging Protocol" items={[
              'Day -5: Stop warfarin',
              'Day -3: Start LMWH/UFH',
              'Day -1: Last LMWH dose (24h pre)',
              'Day 0: Procedure — check INR',
              'Post: Restart warfarin + bridge until INR therapeutic',
            ]} color={COLORS.primary} />
          </CollapsibleCard>
          <CollapsibleCard title="Special Situations">
            <DataTable headers={['Situation', 'Approach']} rows={[
              ['Emergency Surgery', 'Vitamin K 2-5mg IV + 4-factor PCC; FFP if PCC unavailable'],
              ['Renal Impairment', 'Extend intervals; prefer UFH over LMWH'],
              ['Pregnancy', 'LMWH preferred; warfarin contraindicated in 1st trimester'],
              ['Active Cancer', 'LMWH preferred; discuss with haematology'],
            ]} />
          </CollapsibleCard>
        </View>
      )}

      <View style={styles.refBox}>
        <Text style={styles.refTitle}>Reference</Text>
        <Text style={styles.refText}>ASRA 5th Edition, 2025 — Regional Anesthesia & Pain Medicine</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  outlineBtn: { borderColor: COLORS.primary, borderWidth: 1, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  outlineBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  tabBar: { flexDirection: 'row', marginBottom: SPACING.md, flexWrap: 'wrap', gap: 4 },
  tab: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 20, backgroundColor: '#e9ecef', fontSize: 12, fontWeight: '600', color: COLORS.text, overflow: 'hidden' },
  tabActive: { backgroundColor: COLORS.primary, color: COLORS.white },
  alertBox: { backgroundColor: '#fff3cd', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.md },
  alertText: { color: '#856404', fontSize: 13, fontWeight: '600' },
  infoBox: { borderLeftWidth: 4, backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.md },
  infoTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 4 },
  infoItem: { fontSize: 13, color: COLORS.text, marginBottom: 2 },
  table: { minWidth: '100%' },
  headerRow: { flexDirection: 'row', backgroundColor: COLORS.medicalBlue },
  headerCell: { padding: 8, color: COLORS.white, fontWeight: '700', fontSize: 11 },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altRow: { backgroundColor: '#f8f9fa' },
  dataCell: { padding: 8, fontSize: 11, color: COLORS.text },
  noteText: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginTop: SPACING.sm, paddingHorizontal: SPACING.xs },
  refBox: { backgroundColor: '#e8f4fd', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.md },
  refTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue, marginBottom: 4 },
  refText: { fontSize: 12, color: COLORS.text },
});
