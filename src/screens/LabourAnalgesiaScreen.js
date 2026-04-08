import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

function SectionHeader({ icon, title, color = COLORS.primary }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <FontAwesome5 name={icon} size={14} color={color} style={styles.sectionHeaderIcon} />
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

function BulletCard({ title, items, borderColor = COLORS.primary }) {
  return (
    <View style={[styles.bulletCard, { borderLeftColor: borderColor }]}>
      <Text style={styles.bulletCardTitle}>{title}</Text>
      {items.map((item, i) => (
        <Text key={i} style={styles.bulletItem}>• {item}</Text>
      ))}
    </View>
  );
}

function SafetyCard({ title, icon, items, headerBg, headerTextColor, borderColor }) {
  return (
    <View style={[styles.safetyCard, { borderColor }]}>
      <View style={[styles.safetyHeader, { backgroundColor: headerBg }]}>
        <FontAwesome5 name={icon} size={14} color={headerTextColor} style={styles.safetyHeaderIcon} />
        <Text style={[styles.safetyHeaderText, { color: headerTextColor }]}>{title}</Text>
      </View>
      {items.map((item, i) => (
        <Text key={i} style={[styles.safetyItem, i > 0 && styles.safetyItemBorder]}>{item}</Text>
      ))}
    </View>
  );
}

function DataTable({ headers, rows, columnWidths }) {
  const widths = columnWidths || headers.map(() => 150);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
      <View style={styles.tableWrap}>
        <View style={styles.tableHeaderRow}>
          {headers.map((header, i) => (
            <Text key={`${header}-${i}`} style={[styles.tableHeaderCell, { width: widths[i], minWidth: widths[i] }]}>{header}</Text>
          ))}
        </View>
        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.tableDataRow, rowIndex % 2 === 1 && styles.tableDataRowAlt]}>
            {row.map((cell, cellIndex) => (
              <Text key={`cell-${rowIndex}-${cellIndex}`} style={[styles.tableDataCell, { width: widths[cellIndex], minWidth: widths[cellIndex] }]}>{cell}</Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function IconList({ items }) {
  return (
    <View style={styles.iconListCard}>
      {items.map((item, i) => (
        <View key={i} style={[styles.iconRow, i > 0 && styles.iconRowBorder]}>
          <FontAwesome5 name={item.icon} size={13} color={item.color} style={styles.iconRowIcon} />
          <Text style={styles.iconRowText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}

function MiniAccordionItem({ title, icon, color, open, onPress, items }) {
  return (
    <View style={styles.miniAccordionCard}>
      <TouchableOpacity style={styles.miniAccordionHeader} onPress={onPress} activeOpacity={0.8}>
        <View style={styles.miniAccordionTitleRow}>
          <FontAwesome5 name={icon} size={13} color={color} style={styles.miniAccordionIcon} />
          <Text style={styles.miniAccordionTitle}>{title}</Text>
        </View>
        <FontAwesome5 name={open ? 'chevron-up' : 'chevron-down'} size={12} color={COLORS.primary} />
      </TouchableOpacity>
      {open ? (
        <View style={styles.miniAccordionBody}>
          {items.map((item, i) => (
            <Text key={i} style={styles.bulletItem}>{`${i + 1}. ${item}`}</Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}

export default function LabourAnalgesiaScreen() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const twoColumn = width >= 860;
  const [activeCard, setActiveCard] = useState(null);
  const [activeTrouble, setActiveTrouble] = useState(null);

  const toggleCard = (card, nextOpen) => {
    setActiveCard(nextOpen ? card : null);
  };

  const toggleTrouble = (panel) => {
    setActiveTrouble((prev) => (prev === panel ? null : panel));
  };

  return (
    <ScreenWrapper title="Labour Analgesia" subtitle="Obstetric analgesia protocols and safety checklists">
      <CollapsibleCard
        title="Epidural Analgesia"
        icon="syringe"
        open={activeCard === 'epidural'}
        onToggle={(nextOpen) => toggleCard('epidural', nextOpen)}
      >
        <SectionHeader icon="user-md" title="NCHD Responsibilities (1st On-Call)" />
        <IconList
          items={[
            { icon: 'clock', color: '#ffc107', text: 'Attend within 30 minutes of being informed' },
            { icon: 'phone-alt', color: COLORS.info, text: 'If long delay anticipated, coordinate with 2nd on-call' },
            { icon: 'file-signature', color: COLORS.success, text: 'Obtain consent and give explanation' },
            { icon: 'check-circle', color: COLORS.primary, text: 'Establish effective epidural analgesia' },
            { icon: 'prescription-bottle', color: COLORS.textMuted, text: 'Prepare infusion and connect line' },
            { icon: 'stethoscope', color: COLORS.danger, text: 'Respond to midwife concerns and review as needed' },
          ]}
        />

        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <SafetyCard
              title="Seek Advice BEFORE Siting"
              icon="exclamation-triangle"
              headerBg={COLORS.warning}
              headerTextColor={COLORS.dark}
              borderColor={COLORS.warning}
              items={[
                'Obese patient',
                'Previous back problems',
                'Previous epidural/spinal problems',
                'Cardiac/respiratory pathology',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <SafetyCard
              title="Seek Help DURING Procedure"
              icon="phone-alt"
              headerBg={COLORS.danger}
              headerTextColor={COLORS.white}
              borderColor={COLORS.danger}
              items={[
                'Dural tap - inform consultant within 24hrs',
                'Failed after 2 attempts at 2 spaces',
                'Patient becoming distressed',
                'Blood or CSF in catheter',
                'Cardiac/respiratory history',
              ]}
            />
          </View>
        </View>

        <SectionHeader icon="check" title="Indications" color={COLORS.success} />
        <BulletCard
          title="When to Consider"
          borderColor={COLORS.success}
          items={[
            'Maternal request for analgesia',
            'Blood pressure control in hypertensive disorders of pregnancy',
          ]}
        />

        <SectionHeader icon="times" title="Contraindications" color={COLORS.danger} />
        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Absolute"
              borderColor={COLORS.danger}
              items={[
                'Maternal refusal',
                'Prophylactic LMWH within 12 hours',
                'Therapeutic LMWH within 24 hours',
                'Coagulopathy (INR >1.3, APTTR >1.5)',
                'Platelets <70',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Relative"
              borderColor={COLORS.warning}
              items={[
                'Allergy to (levo)bupivacaine or fentanyl',
                'Platelets 80-100 (discuss with consultant)',
                'Trend of falling platelets',
                'Local or systemic sepsis',
                'IUFD - need FBC/coag within 6 hours',
              ]}
            />
          </View>
        </View>

        <SectionHeader icon="file-signature" title="Consent (Verbal, with Midwife)" color={COLORS.info} />
        <View style={styles.infoAlert}>
          <View style={styles.splitRow}>
            <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
              <Text style={styles.bulletItem}>• Failure or incomplete block</Text>
              <Text style={styles.bulletItem}>• Headache</Text>
              <Text style={styles.bulletItem}>• Back pain</Text>
            </View>
            <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
              <Text style={styles.bulletItem}>• Hypotension</Text>
              <Text style={styles.bulletItem}>• Infection</Text>
              <Text style={styles.bulletItem}>• Nerve injury</Text>
            </View>
          </View>
        </View>

        <SectionHeader icon="tasks" title="Pre-Procedure Checklist" />
        <IconList
          items={[
            { icon: 'history', color: COLORS.textMuted, text: 'Focused history and physical examination' },
            { icon: 'vial', color: COLORS.danger, text: 'Platelet count based on history; routine count not needed in healthy low-risk with normal antenatal values' },
            { icon: 'tint', color: COLORS.danger, text: 'Blood type/screen not routine; base on maternal history and hemorrhage risk' },
            { icon: 'prescription-bottle-alt', color: COLORS.primary, text: 'IV cannula and fluids connected' },
            { icon: 'heartbeat', color: COLORS.primary, text: 'Record baseline BP, maternal HR, and fetal HR' },
          ]}
        />

        <SectionHeader icon="first-aid" title="Emergency Drugs (Must Be Available)" color={COLORS.danger} />
        <View style={styles.emergencyDrugBox}>
          {['Phenylephrine', 'Ephedrine', 'Atropine', 'Adrenaline', 'Naloxone'].map((drug, i) => (
            <Text key={i} style={styles.emergencyDrugText}>{drug}</Text>
          ))}
        </View>

        <SectionHeader icon="procedures" title="Insertion Technique" color={COLORS.success} />
        <BulletCard
          title="Core Steps"
          borderColor={COLORS.success}
          items={[
            'Position patient correctly',
            'Aseptic precautions (hat, gloves, facemask, antiseptic)',
            'Site epidural - loss of resistance to saline or air',
            'Leave 3-5cm catheter in epidural space',
          ]}
        />

        <SectionHeader icon="prescription-bottle-alt" title="Drug Doses" />
        <DataTable
          headers={['Stage', 'Drug', 'Dose']}
          columnWidths={[130, 290, 150]}
          rows={[
            ['Test Dose', '0.25% or 0.5% bupi/levobupivacaine', '3 mL'],
            ['Loading Dose', '0.125% bupi/levobupivacaine + fentanyl', '10-15 mL + 50-100 mcg'],
            ['Infusion', '0.1% levobupivacaine + fentanyl 2 mcg/mL', '10 mL/hr (max 15 mL/hr)'],
          ]}
        />

        <SectionHeader icon="wrench" title="Troubleshooting" color={COLORS.warning} />
        <MiniAccordionItem
          title="Inadequate Pain Relief"
          icon="exclamation-circle"
          color={COLORS.warning}
          open={activeTrouble === 'pain'}
          onPress={() => toggleTrouble('pain')}
          items={[
            'Check block height with ethyl chloride spray',
            'If block below umbilicus, give bolus',
            'One-sided block: position unblocked side down, give bolus, consider withdrawing catheter 1-2cm',
            'Inadequate height: bolus 10ml bag mix OR 10ml 0.25% levobupivacaine (2 doses, 5 minutes apart)',
            'Rectal pressure with OP position: top-up 10ml 0.25% levobupivacaine +/- fentanyl in sitting position',
          ]}
        />
        <MiniAccordionItem
          title="High Sensory Block (Above T8/Xiphisternum)"
          icon="arrow-up"
          color={COLORS.danger}
          open={activeTrouble === 'high'}
          onPress={() => toggleTrouble('high')}
          items={[
            'STOP epidural infusion immediately',
            'Check sensory level with ethyl chloride every 15 minutes',
            'Restart infusion only when block has regressed below T10',
          ]}
        />

        <View style={styles.secondaryAlert}>
          <Text style={styles.secondaryAlertTitle}>After Completion - Seek Advice If:</Text>
          <Text style={styles.bulletItem}>• Pain relief remains inadequate after catheter adjustment/top-up</Text>
          <Text style={styles.bulletItem}>• Complications develop (for example profound hypotension)</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard
        title="Remifentanil Analgesia"
        icon="syringe"
        open={activeCard === 'remi'}
        onToggle={(nextOpen) => toggleCard('remi', nextOpen)}
      >
        <View style={styles.primaryAlert}>
          <Text style={styles.primaryAlertTitle}>What is Remifentanil?</Text>
          <Text style={styles.primaryAlertText}>
            A strong, fast-acting opioid painkiller similar to morphine. It acts quickly and wears off quickly,
            can be timed with contractions, and has minimal risk of affecting the baby.
          </Text>
        </View>

        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Benefits"
              borderColor={COLORS.success}
              items={[
                'Effective pain relief for many women',
                'Patient controls their own pain relief',
                'Can still use Gas and Air',
                'Epidural still possible later',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Side Effects"
              borderColor={COLORS.warning}
              items={[
                'Drowsiness/sedation',
                'Nausea and vomiting',
                'Itching',
                'Dizziness',
                'Slowed breathing',
              ]}
            />
          </View>
        </View>

        <SectionHeader icon="check-circle" title="Inclusion Criteria" color={COLORS.success} />
        <BulletCard
          title="Eligible Patients"
          borderColor={COLORS.success}
          items={[
            'Request for pain relief and not suitable for epidural',
            'Failed epidural (multiple attempts or ineffective)',
            'Contraindication to epidural (coagulopathy, spinal abnormalities, site infection, local anaesthetic allergy, specific neurological disorders)',
            'Gestational age >= 37 weeks',
            'Able to understand and operate PCA device',
            'Informed consent obtained',
            'Reassuring CTG at initiation',
            'Stable maternal cardiorespiratory status',
          ]}
        />

        <SectionHeader icon="times-circle" title="Exclusion Criteria" color={COLORS.danger} />
        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Maternal Factors"
              borderColor={COLORS.danger}
              items={[
                'Unable to understand or use PCA device',
                'Allergy to remifentanil or opioids',
                'Severe respiratory disease (SpO2 <95%)',
                'Haemodynamic instability',
                'Severe hepatic or renal impairment',
                'Recent sedatives or opioids',
                'Opioid dependence',
                'Neurological impairment (GCS <15)',
                'Difficult airway or high aspiration risk',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Obstetric/Fetal Factors"
              borderColor={COLORS.danger}
              items={[
                'Non-reassuring fetal status (abnormal CTG)',
                'IUGR or small for gestational age',
                'Imminent urgent delivery',
                'Multiple gestation with anticipated neonatal compromise',
                'Labour not established',
                'No IV access available',
                'No continuous monitoring available',
                'No trained staff for one-to-one care',
              ]}
            />
          </View>
        </View>

        <SectionHeader icon="cogs" title="PCA Settings" />
        <DataTable
          headers={['Setting', 'Value', 'Notes']}
          columnWidths={[150, 150, 220]}
          rows={[
            ['Concentration', '20 mcg/mL', '2mg in 100mL saline'],
            ['Bolus Dose', '20 mcg (start)', 'Titrate up to max 40 mcg if needed'],
            ['Lockout Interval', '2 minutes', 'Do NOT reduce below 2 minutes'],
            ['Background Infusion', 'NONE (0 mL/hr)', 'Not recommended - respiratory depression risk'],
            ['Maximum Dose', '40 mcg/bolus', 'Do not exceed'],
          ]}
        />

        <SectionHeader icon="list-alt" title="Preparation Checklist" color={COLORS.info} />
        <IconList
          items={[
            { icon: 'check', color: COLORS.success, text: 'IV cannula (20G/22G), not at a joint (dose trapping risk)' },
            { icon: 'check', color: COLORS.success, text: 'No flush or fluid line connected' },
            { icon: 'check', color: COLORS.success, text: 'Remifentanil is incompatible with Syntocinon' },
            { icon: 'check', color: COLORS.success, text: 'Baseline bloods if required (FBC/coag profile)' },
            { icon: 'check', color: COLORS.success, text: 'Informed consent documented' },
            { icon: 'check', color: COLORS.success, text: 'Remifentanil prescription completed' },
            { icon: 'check', color: COLORS.success, text: 'Observation chart attached' },
            { icon: 'check', color: COLORS.success, text: 'Pulse oximeter and oxygen available' },
            { icon: 'check', color: COLORS.success, text: 'Naloxone available at bedside' },
            { icon: 'clock', color: COLORS.warning, text: 'Last dose of pethidine was at least 4 hours ago' },
          ]}
        />

        <SectionHeader icon="play" title="Starting PCA" color={COLORS.success} />
        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Essential Steps"
              borderColor={COLORS.success}
              items={[
                'Oxygen 2-5 L/min via nasal prongs',
                'Continuous SpO2 monitoring',
                'Continuous CTG monitoring',
                'Patient must stay in bed',
                'Inform obstetric and paediatric teams',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Critical Safety Rules"
              borderColor={COLORS.danger}
              items={[
                'Only the patient presses the PCA button',
                'Not midwives, partners, or visitors',
                'Press at START of contraction',
                'STOP during active pushing (second stage)',
                'Wait 4 hours after pethidine before starting',
              ]}
            />
          </View>
        </View>

        <View style={styles.warningAlert}>
          <Text style={styles.warningAlertText}>BMI >=40: use with caution. Enhanced monitoring and senior anaesthetic involvement required.</Text>
        </View>

        <SectionHeader icon="clipboard-list" title="Monitoring (Every 15 Minutes)" />
        <DataTable
          headers={['Parameter', 'Record']}
          columnWidths={[170, 350]}
          rows={[
            ['Respiratory Rate', 'Document every 15 minutes'],
            ['Pain Score', '0=None, 1=Mild, 2=Moderate, 3=Severe'],
            ['SpO2 (%)', 'Continuous monitoring'],
            ['AVPU Score', 'A=Awake, V=Voice, P=Pain, U=Unrousable'],
            ['O2/Entonox use', 'Document if used'],
            ['Volume Delivered', 'From PCA pump'],
          ]}
        />

        <SectionHeader icon="users" title="Ongoing Care Requirements" color={COLORS.warning} />
        <BulletCard
          title="At All Times"
          borderColor={COLORS.warning}
          items={[
            'One-to-one midwifery care continuously',
            'Equipment ready: oxygen, suction, resus trolley, naloxone',
            'Observe for respiratory depression, sedation, nausea/vomiting, pruritus',
            'Do not leave woman unattended',
          ]}
        />

        <View style={styles.dangerAlert}>
          <Text style={styles.dangerAlertTitle}>EMERGENCY - STOP PCA Immediately If:</Text>
          <Text style={styles.bulletItem}>• Patient is unresponsive</Text>
          <Text style={styles.bulletItem}>• SpO2 drops / low saturations</Text>
          <Text style={styles.bulletItem}>• Respiratory rate {'<'} 8/min</Text>
          <Text style={styles.dangerAlertAction}>Action: Start resuscitation and call anaesthesiologist.</Text>
        </View>

        <SectionHeader icon="stop-circle" title="Stopping PCA" color={COLORS.textMuted} />
        <BulletCard
          title="Discontinuation"
          borderColor={COLORS.textMuted}
          items={[
            'Discontinue when delivery is imminent or clinically indicated',
            'Cannot be used post-delivery or during suturing',
            'Flush IV cannula after stopping',
            'Continue monitoring for at least 30 minutes after stopping',
            'Monitor newborn according to opioid exposure guidance',
            'Paediatrician should attend delivery',
          ]}
        />

        <SectionHeader icon="file" title="Post-Delivery Documentation" color={COLORS.info} />
        <View style={styles.splitRow}>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Core Details"
              borderColor={COLORS.info}
              items={[
                'Time of delivery',
                'Mode of delivery (NVD/Instrumental/LSCS)',
                'Time PCA stopped',
                'Cannula removed without flush',
              ]}
            />
          </View>
          <View style={[styles.splitCol, !twoColumn && styles.splitColFull]}>
            <BulletCard
              title="Adverse Events & Record"
              borderColor={COLORS.info}
              items={[
                'Adverse events: sedation, dizziness, nausea/vomiting, itching, low RR, low sats',
                'Patient satisfaction score (1-10)',
                'Complete all sections of anaesthetic form',
              ]}
            />
          </View>
        </View>
      </CollapsibleCard>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
  },
  sectionHeaderIcon: { marginRight: 7 },
  sectionHeaderText: { fontSize: 15, fontWeight: '700', color: COLORS.primary },
  bulletCard: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderLeftWidth: 4,
    backgroundColor: '#f8f9fa',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  bulletCardTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  bulletItem: { fontSize: 13, color: COLORS.text, marginBottom: 3, lineHeight: 18 },
  splitRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4 },
  splitCol: { width: '50%', paddingHorizontal: 4 },
  splitColFull: { width: '100%' },
  iconListCard: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  iconRow: { flexDirection: 'row', alignItems: 'flex-start', padding: 12 },
  iconRowBorder: { borderTopWidth: 1, borderTopColor: '#dee2e6' },
  iconRowIcon: { width: 20, marginTop: 2, marginRight: 8 },
  iconRowText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 19 },
  safetyCard: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  safetyHeader: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  safetyHeaderIcon: { marginRight: 7 },
  safetyHeaderText: { fontSize: 14, fontWeight: '700', flex: 1 },
  safetyItem: { fontSize: 13, color: COLORS.text, lineHeight: 18, padding: 10 },
  safetyItemBorder: { borderTopWidth: 1, borderTopColor: '#dee2e6' },
  infoAlert: {
    backgroundColor: '#e8f4fd',
    borderWidth: 1,
    borderColor: '#cfe8ff',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emergencyDrugBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    backgroundColor: '#f8d7da',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#f5c2c7',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  emergencyDrugText: { fontSize: 12, color: COLORS.danger, fontWeight: '700', marginVertical: 3, marginRight: 8 },
  tableScrollContent: { paddingBottom: 2 },
  tableWrap: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, overflow: 'hidden', marginBottom: SPACING.md },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: COLORS.medicalBlue },
  tableHeaderCell: { padding: 8, color: COLORS.white, fontWeight: '700', fontSize: 12, lineHeight: 17 },
  tableDataRow: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: COLORS.border },
  tableDataRowAlt: { backgroundColor: '#f8f9fa' },
  tableDataCell: { padding: 8, fontSize: 12, color: COLORS.text, lineHeight: 17 },
  miniAccordionCard: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  miniAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
  },
  miniAccordionTitleRow: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 8 },
  miniAccordionIcon: { marginRight: 7 },
  miniAccordionTitle: { fontSize: 13, color: COLORS.text, fontWeight: '700', flex: 1 },
  miniAccordionBody: { backgroundColor: COLORS.white, padding: SPACING.sm },
  secondaryAlert: {
    backgroundColor: '#f1f3f5',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: SPACING.sm,
    marginTop: SPACING.xs,
    marginBottom: SPACING.md,
  },
  secondaryAlertTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  primaryAlert: {
    backgroundColor: '#e8f4fd',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.info,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  primaryAlertTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: 4 },
  primaryAlertText: { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  warningAlert: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffe69c',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  warningAlertText: { fontSize: 13, color: '#856404', lineHeight: 18, fontWeight: '600' },
  dangerAlert: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c2c7',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  dangerAlertTitle: { fontSize: 13, fontWeight: '700', color: COLORS.danger, marginBottom: 4 },
  dangerAlertAction: { fontSize: 13, color: COLORS.danger, fontWeight: '700', marginTop: 4 },
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
