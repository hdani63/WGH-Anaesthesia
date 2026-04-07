import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const DAS_DOC = {
  title: 'DAS Unanticipated Difficult Airway Guideline',
  fileName: 'das_unanticipated_guidelines.pdf',
  source: require('../../assets/pdfs/airway/das_unanticipated_guidelines.pdf'),
};

const OBSTETRIC_DOC = {
  title: 'Obstetric GA and Failed Intubation Guideline',
  fileName: 'obstetric_guidelines.pdf',
  source: require('../../assets/pdfs/obstetric/obstetric_guidelines.pdf'),
};

function GuidelineSection({ title, items }) {
  return (
    <View style={styles.guidelineBox}>
      <Text style={styles.guidelineTitle}>{title}</Text>
      {items.map((item, i) => <Text key={i} style={styles.guidelineItem}>• {item}</Text>)}
    </View>
  );
}

function InfoColumns({ columns }) {
  return (
    <View style={styles.columnRow}>
      {columns.map((col, i) => (
        <View key={i} style={styles.column}>
          <Text style={styles.columnTitle}>{col.title}</Text>
          {col.items.map((item, j) => <Text key={j} style={styles.columnItem}>• {item}</Text>)}
        </View>
      ))}
    </View>
  );
}

export default function DifficultAirwayScreen() {
  return (
    <ScreenWrapper title="Difficult Airway Management" subtitle="DAS Guidelines & Algorithms">
      <CollapsibleCard title="DAS Unanticipated Difficult Intubation (2015)">
        <Text style={styles.desc}>Difficult Airway Society guidelines for unanticipated difficult tracheal intubation in adults.</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(DAS_DOC.source, DAS_DOC.fileName, DAS_DOC.title)}>
            <Text style={styles.primaryBtnText}>Open PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(DAS_DOC.source, DAS_DOC.fileName, DAS_DOC.title)}>
            <Text style={styles.outlineBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
        <GuidelineSection title="Key Points" items={[
          'Plan A: Facemask ventilation and tracheal intubation',
          'Plan B: Maintaining oxygenation — Supraglottic Airway Device',
          'Plan C: Facemask ventilation',
          'Plan D: Emergency front of neck access (CICO)',
          'Maximum 3+1 intubation attempts',
          'Declare failed intubation early',
        ]} />
        <Text style={styles.noteText}>Refer to the full DAS PDF for complete algorithms.</Text>
      </CollapsibleCard>

      <CollapsibleCard title="DAS Awake Tracheal Intubation (ATI)">
        <InfoColumns columns={[
          { title: 'OXYGENATE', items: ['Apply HFNO early', 'Titrate 30-70 L/min', 'Continue throughout'] },
          { title: 'TOPICALISE', items: ['Lidocaine 10% spray', '20-30 sprays over 5 min', 'Co-phenylcaine if nasal'] },
          { title: 'SEDATE', items: ['Remifentanil TCI 1.0-3.0 ng/ml', 'Consider midazolam 0.5-1 mg', 'Maintain consciousness'] },
          { title: 'PERFORM', items: ['Patient sitting up', 'Clear secretions', 'Two-point check before induction'] },
        ]} />
      </CollapsibleCard>

      <CollapsibleCard title="DAS ICU Tracheal Intubation">
        <InfoColumns columns={[
          { title: 'Pre-oxygenation', items: ['Position head up', 'Assess airway & cricothyroid', 'Waveform capnograph ready', 'Optimise cardiovascular'] },
          { title: 'Plan A — Laryngoscopy', items: ['Maximum 3 attempts', 'Maintain oxygenation', 'Video/direct +/- bougie', 'Call for help on 1st failure'] },
          { title: 'CICO Emergency', items: ['Declare CICO', 'Use FONA set', 'Scalpel cricothyroidotomy', 'Trained expert only'] },
        ]} />
      </CollapsibleCard>

      <CollapsibleCard title="Cervical Spine Airway Management (2024)">
        <Text style={styles.desc}>Multi-society guidelines (DAS, AoA, BSOA, ICS, NACCS)</Text>
        <GuidelineSection title="Key Recommendations" items={[
          '1. Minimise cervical spine movement during pre-oxygenation',
          '2. Jaw thrust > head tilt + chin lift',
          '3. No specific SAD recommended — use familiar device',
          '4. 2nd-gen SADs preferred over 1st-gen',
          '5. Videolaryngoscopy preferred over direct',
          '6. Regular training in VL with C-spine immobilisation',
          '7. Consider adjuncts for intubation',
          '8. Remove anterior collar during intubation attempts',
          '9. Multidisciplinary planning + human factors',
        ]} />
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>MILS may be ineffective and can worsen intubation success.</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard title="DAS Extubation Guidelines">
        <GuidelineSection title="Low Risk Criteria" items={[
          'Fasted, uncomplicated airway',
          'No risk factors',
          'Standard deep/awake extubation',
        ]} />
        <GuidelineSection title="At Risk Criteria" items={[
          'Oxygenation uncertain',
          'Re-intubation potentially difficult',
          'Awake extubation, advanced techniques',
          'Consider postpone or tracheostomy',
        ]} />
        <GuidelineSection title="4-Step Planning" items={['Plan', 'Prepare', 'Perform', 'Post-care']} />
      </CollapsibleCard>

      <CollapsibleCard title="Obstetric GA & Failed Intubation">
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(OBSTETRIC_DOC.source, OBSTETRIC_DOC.fileName, OBSTETRIC_DOC.title)}>
            <Text style={styles.primaryBtnText}>Open PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(OBSTETRIC_DOC.source, OBSTETRIC_DOC.fileName, OBSTETRIC_DOC.title)}>
            <Text style={styles.outlineBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
        <GuidelineSection title="Algorithm 1: Safe Obstetric GA" items={[
          'Pre-induction planning & team discussion',
          'RSI protocol with cricoid pressure',
          'Max 2 intubation attempts (3rd by experienced colleague)',
          'Capnography verification mandatory',
        ]} />
        <GuidelineSection title="Algorithm 2: Failed Intubation" items={[
          'Declare failure immediately',
          'Call for help',
          '2nd-gen SAD or facemask',
          'Remove cricoid during SAD insertion',
          'Decide: proceed or wake',
        ]} />
        <GuidelineSection title="Algorithm 3: CICO" items={[
          'Declare emergency',
          'Call help, 100% O₂',
          'Exclude laryngospasm, ensure NMB',
          'Front-of-neck procedure',
          'If fails: maternal ALS, perimortem C-section',
        ]} />
        <GuidelineSection title="Obstetric-Specific Considerations" items={[
          'Rapid desaturation risk',
          'Airway oedema (especially in pre-eclampsia)',
          'Enlarged breasts may obstruct',
          'Aspiration risk — RSI mandatory',
          'Smaller ETT: 6.5-7.0 mm',
          'Cricoid pressure controversial',
        ]} />
      </CollapsibleCard>

      <View style={styles.emergencyCard}>
        <View style={styles.emergencyTitleRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color={COLORS.danger} style={styles.emergencyTitleIcon} />
          <Text style={styles.emergencyTitle}>Emergency Contacts</Text>
        </View>
        <Text style={styles.emergencyItem}>• Senior anaesthetist</Text>
        <Text style={styles.emergencyItem}>• ENT surgeon</Text>
        <Text style={styles.emergencyItem}>• ICU consultant</Text>
        <Text style={styles.emergencyItem}>• Theatre coordinator</Text>
        <View style={styles.divider} />
        <View style={styles.emergencyTitleRow}>
          <FontAwesome5 name="toolbox" size={14} color={COLORS.danger} style={styles.emergencyTitleIcon} />
          <Text style={styles.emergencyTitle}>Equipment Check</Text>
        </View>
        <Text style={styles.emergencyItem}>• Video laryngoscope</Text>
        <Text style={styles.emergencyItem}>• Difficult airway trolley</Text>
        <Text style={styles.emergencyItem}>• Emergency cricothyroidotomy kit</Text>
        <Text style={styles.emergencyItem}>• Capnography</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  desc: { fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md, fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  outlineBtn: { borderColor: COLORS.primary, borderWidth: 1, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  outlineBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  guidelineBox: { backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm },
  guidelineTitle: { fontWeight: '700', fontSize: 14, color: COLORS.primary, marginBottom: 4 },
  guidelineItem: { fontSize: 13, color: COLORS.text, marginBottom: 2, paddingLeft: 4 },
  columnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  column: { flex: 1, minWidth: 140, backgroundColor: '#e8f4fd', borderRadius: 6, padding: SPACING.sm },
  columnTitle: { fontWeight: '700', fontSize: 13, color: COLORS.medicalBlue, marginBottom: 4 },
  columnItem: { fontSize: 12, color: COLORS.text, marginBottom: 2 },
  warningBox: { backgroundColor: '#fff3cd', borderRadius: 6, padding: SPACING.sm, marginTop: SPACING.sm },
  warningText: { color: '#856404', fontSize: 13, fontWeight: '600' },
  noteText: { fontSize: 12, color: COLORS.primary, fontStyle: 'italic', marginTop: SPACING.sm },
  emergencyCard: { backgroundColor: '#fef2f2', borderRadius: BORDER_RADIUS, padding: SPACING.md, borderWidth: 1, borderColor: '#fca5a5', marginTop: SPACING.sm },
  emergencyTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xs },
  emergencyTitleIcon: { marginRight: 6 },
  emergencyTitle: { fontSize: 15, fontWeight: '700', color: COLORS.danger, marginBottom: SPACING.xs },
  emergencyItem: { fontSize: 13, color: COLORS.text, marginBottom: 2 },
  divider: { height: 1, backgroundColor: '#fca5a5', marginVertical: SPACING.sm },
});
