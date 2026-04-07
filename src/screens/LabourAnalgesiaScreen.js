import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const MIDWIFE_DOC = {
  title: 'Midwife Monitoring Guide',
  fileName: 'midwife_monitoring_guide.pdf',
  source: require('../../assets/pdfs/obstetric/midwife_monitoring_guide.pdf'),
};

function InfoSection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => (
        <Text key={i} style={styles.sectionItem}>• {item}</Text>
      ))}
    </View>
  );
}

function DataTable({ headers, rows }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {headers.map((h, i) => (
          <Text key={i} style={[styles.tableHeaderText, { flex: i === 0 ? 1.5 : 1 }]}>{h}</Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={[styles.tableRow, i % 2 === 1 && styles.tableRowAlt]}>
          {row.map((cell, j) => (
            <Text key={j} style={[styles.tableCell, { flex: j === 0 ? 1.5 : 1 }]}>{cell}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

function ChecklistItem({ text }) {
  const [checked, setChecked] = useState(false);
  return (
    <Text style={styles.checklistItem} onPress={() => setChecked(!checked)}>
      {checked ? '[x]' : '[ ]'} {text}
    </Text>
  );
}

export default function LabourAnalgesiaScreen() {
  return (
    <ScreenWrapper title="Labour Analgesia" subtitle="Epidural & Remifentanil PCA guidelines">

      {/* EPIDURAL SECTION */}
      <CollapsibleCard title="Epidural Analgesia" defaultOpen>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>NCHD Responsibilities</Text>
          <Text style={styles.alertText}>The anaesthetic NCHD is responsible for siting and managing epidurals. Seek senior help early if experiencing difficulty.</Text>
        </View>

        <InfoSection title="Seek Advice/Help When" items={[
          'Morbid obesity (BMI > 40)',
          'Previous spinal surgery',
          'Severe pre-eclampsia',
          'Thrombocytopenia (Plt < 75)',
          'Coagulopathy or anticoagulant use',
          'Sepsis or local infection',
          'Significant spinal deformity',
        ]} />

        <InfoSection title="Indications" items={[
          'Maternal request during labour',
          'Augmented/induced labour (oxytocin)',
          'Multiple pregnancy',
          'Preterm labour',
          'Pre-eclampsia/hypertensive disorders',
          'Anticipated difficult airway (early epidural placement)',
          'Medical conditions requiring sympathetic stability',
        ]} />

        <InfoSection title="Absolute Contraindications" items={[
          'Patient refusal or inability to consent',
          'Local infection at insertion site',
          'Uncorrected coagulopathy',
          'Raised intracranial pressure',
          'True allergy to local anaesthetics',
          'Severe uncorrected hypovolaemia',
        ]} />

        <InfoSection title="Relative Contraindications" items={[
          'Thrombocytopenia (platelets 50-75 × 10⁹/L)',
          'Prophylactic anticoagulation (time appropriately)',
          'Systemic sepsis without local infection',
          'Anatomical spinal abnormalities',
          'Neurological disease (case-by-case)',
        ]} />

        <InfoSection title="Consent Points" items={[
          'Common: hypotension (10-20%), motor block, shivering, pruritus, urinary retention',
          'Uncommon: PDPH (<1%), incomplete block, epidural blood patch',
          'Rare: epidural abscess/haematoma, nerve injury, high block/total spinal',
          'Document consent in notes',
        ]} />

        <Text style={styles.sectionTitle}>Pre-Procedure Checklist</Text>
        {['Informed consent obtained','IV access established — minimum 16G','Fluid bolus: 500 mL crystalloid co-loading','Monitoring: BP, HR, SpO2, CTG','Check equipment and drugs available','Allergy status confirmed','Platelet count reviewed (within 4 hours if pre-eclampsia)','Anticoagulant timing checked'].map((c, i) => (
          <ChecklistItem key={i} text={c} />
        ))}

        <InfoSection title="Emergency Drugs (Immediately Available)" items={[
          'Ephedrine 30mg syringe (6mg boluses)',
          'Phenylephrine 100mcg/mL syringe',
          'Atropine 0.6mg',
          'Intralipid 20% (if LAST protocol needed)',
          'Adrenaline 1:10,000',
        ]} />

        <InfoSection title="Insertion Technique" items={[
          'Position: sitting or lateral (sitting preferred)',
          'Level: L3/4 or L4/5 interspace',
          'Loss of resistance to saline (preferred) or air',
          'Thread catheter 4-5cm into epidural space',
          'Secure catheter and label clearly',
          'Aspirate before every injection — check for blood/CSF',
        ]} />

        <Text style={styles.sectionTitle}>Drug Doses</Text>
        <DataTable
          headers={['', 'Drug', 'Volume', 'Concentration']}
          rows={[
            ['Test Dose', 'Lidocaine 2%', '3 mL', '+ Adrenaline 1:200,000'],
            ['Loading', 'Levobupivacaine', '15-20 mL', '0.1% + Fentanyl 2mcg/mL'],
            ['Top-up', 'Levobupivacaine', '10-15 mL', '0.1% + Fentanyl 2mcg/mL'],
            ['Infusion', 'Levobupivacaine', '10-15 mL/hr', '0.1% + Fentanyl 2mcg/mL'],
          ]}
        />
        <Text style={styles.note}>Loading dose given in 5mL increments with aspiration between each. Wait 5 minutes before next increment.</Text>

        <InfoSection title="Troubleshooting" items={[
          'Unilateral block → Withdraw catheter 1cm, top up in lateral position',
          'Inadequate analgesia → Check catheter position, consider replacing if 2 top-ups ineffective',
          'Breakthrough pain → Check level, bolus and consider CSE (combined spinal-epidural)',
          'Hypotension → Left lateral tilt, fluid bolus, vasopressor (ephedrine or phenylephrine)',
          'High block → Stop infusion, assess, support airway if needed, call for help',
          'Post-dural puncture headache → Conservative initially, blood patch if persistent',
        ]} />
      </CollapsibleCard>

      {/* REMIFENTANIL PCA SECTION */}
      <CollapsibleCard title="Remifentanil PCA">
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>One-to-One Midwifery Care Required</Text>
          <Text style={styles.alertText}>Remifentanil PCA requires continuous 1:1 midwifery monitoring. SpO2 monitoring is mandatory throughout.</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(MIDWIFE_DOC.source, MIDWIFE_DOC.fileName, MIDWIFE_DOC.title)}>
            <Text style={styles.primaryBtnText}>Open Midwife PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(MIDWIFE_DOC.source, MIDWIFE_DOC.fileName, MIDWIFE_DOC.title)}>
            <Text style={styles.outlineBtnText}>Download</Text>
          </TouchableOpacity>
        </View>

        <InfoSection title="Description" items={[
          'Ultra-short-acting synthetic opioid (t½ = 3-4 min)',
          'Alternative when epidural is contraindicated or refused',
          'Patient-controlled bolus delivery only — NO background infusion',
        ]} />

        <InfoSection title="Benefits" items={[
          'Rapid onset within one contraction',
          'Rapid offset — no neonatal accumulation',
          'Effective analgesia for many patients',
          'No motor block',
        ]} />

        <InfoSection title="Side Effects" items={[
          'Respiratory depression (most significant)',
          'Nausea & vomiting',
          'Sedation / dizziness',
          'Pruritus',
          'Desaturation episodes',
        ]} />

        <InfoSection title="Inclusion Criteria" items={[
          'Active labour with pain requiring intervention',
          'Epidural contraindicated, failed, or refused',
          'Patient able to understand and operate PCA device',
          'Consultant anaesthetist aware and approves',
        ]} />

        <InfoSection title="Exclusion Criteria" items={[
          'Known remifentanil/fentanyl allergy',
          'Chronic opioid use / opioid dependency',
          'Severe respiratory compromise / OSA',
          'Unable to cooperate with PCA / cannot self-administer',
          'No available 1:1 midwifery care',
        ]} />

        <Text style={styles.sectionTitle}>PCA Settings</Text>
        <DataTable
          headers={['Parameter', 'Setting']}
          rows={[
            ['Bolus dose', '20 mcg'],
            ['Lockout interval', '2 minutes'],
            ['Background infusion', 'NONE (0 mcg/hr)'],
            ['Dose limit', '200 mcg/hr (4-hourly limit)'],
            ['Concentration', '20 mcg/mL'],
          ]}
        />

        <Text style={styles.sectionTitle}>Preparation Checklist</Text>
        {[
          'Confirm consultant anaesthetist approval',
          'Confirm 1:1 midwifery care available',
          'Prepare: Remifentanil 1mg in 50mL NaCl 0.9% (20 mcg/mL)',
          'Dedicated IV cannula (do not share with other infusions)',
          'PCA pump programmed and double-checked by 2 staff',
          'SpO2 monitoring applied and alarmed (alarm < 94%)',
          'Supplemental O₂ and suction available at bedside',
          'Naloxone drawn up (400mcg) and immediately available',
          'Bag-valve-mask at bedside',
          'Resuscitation equipment checked',
        ].map((c, i) => (
          <ChecklistItem key={i} text={c} />
        ))}

        <InfoSection title="Starting the PCA" items={[
          'Instruct patient: press button at START of contraction',
          'Advise medication will peak in 30-60 seconds',
          'First 30 minutes: anaesthetist present',
          'Assess pain, sedation, respiratory rate, SpO2 at 5 minutes',
          'If inadequate at 20mcg → consult re: increasing to 30mcg bolus',
        ]} />

        <InfoSection title="Monitoring (Every 15 Minutes)" items={[
          'Respiratory rate (target ≥ 10)',
          'SpO2 (target ≥ 94% — continuous monitoring)',
          'Sedation score (Ramsay or local scale)',
          'Pain score (NRS 0-10)',
          'Nausea/vomiting',
          'Cumulative dose used',
          'CTG assessment',
        ]} />

        <View style={[styles.alertBox, { backgroundColor: '#f8d7da', borderLeftColor: COLORS.danger }]}>
          <Text style={[styles.alertTitle, { color: COLORS.danger }]}>Emergency STOP Criteria</Text>
          <Text style={styles.alertTextDanger}>Immediately STOP PCA and call anaesthetist if:</Text>
          {['Respiratory rate < 8/min', 'SpO2 < 94% not responding to O₂', 'Excessive sedation (unable to rouse)', 'Apnoea (any duration)', 'Patient request to stop'].map((e, i) => (
            <Text key={i} style={styles.alertTextDanger}>• {e}</Text>
          ))}
        </View>

        <InfoSection title="Stopping the PCA" items={[
          'Stop 30 minutes before anticipated delivery (if possible)',
          'Monitor for 30 minutes after discontinuation',
          'Remove dedicated IV cannula line',
          'Document total dose administered',
          'Brief neonatology if delivery within 15 minutes of last bolus',
        ]} />

        <InfoSection title="Post-Delivery Documentation" items={[
          'Total remifentanil administered (mcg)',
          'Duration of PCA use',
          'Any adverse events (desaturation, apnoea)',
          'Interventions required',
          'Neonatal APGAR scores',
          'Complete clinical incident form if adverse events occurred',
        ]} />
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: SPACING.md },
  buttonRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  outlineBtn: { borderColor: COLORS.primary, borderWidth: 1, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  outlineBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue, marginBottom: SPACING.xs, marginTop: SPACING.sm },
  sectionItem: { fontSize: 13, color: COLORS.text, marginBottom: 3, paddingLeft: 4 },
  alertBox: { backgroundColor: '#fff3cd', borderLeftWidth: 4, borderLeftColor: '#ffc107', padding: SPACING.sm, borderRadius: 4, marginBottom: SPACING.md },
  alertTitle: { fontWeight: '700', fontSize: 13, color: '#856404', marginBottom: 4 },
  alertText: { fontSize: 13, color: '#856404' },
  alertTextDanger: { fontSize: 13, color: COLORS.danger, marginBottom: 2 },
  checklistItem: { fontSize: 14, color: COLORS.text, paddingVertical: 6, paddingHorizontal: 4, borderBottomWidth: 0.5, borderBottomColor: COLORS.border },
  table: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.md },
  tableHeader: { flexDirection: 'row', backgroundColor: COLORS.medicalBlue, padding: 8 },
  tableHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 11 },
  tableRow: { flexDirection: 'row', padding: 8, borderTopWidth: 0.5, borderTopColor: COLORS.border },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  tableCell: { fontSize: 12, color: COLORS.text },
  note: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginTop: 4, marginBottom: SPACING.md },
});
