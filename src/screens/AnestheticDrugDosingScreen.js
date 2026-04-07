import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import * as Calc from '../utils/calculators';

function DoseRow({ drug, route, doseRange, unit }) {
  return (
    <View style={styles.row}>
      <View style={styles.drugCol}><Text style={styles.drugName}>{drug}</Text><Text style={styles.routeText}>{route}</Text></View>
      <View style={styles.doseCol}><Text style={styles.doseText}>{doseRange}</Text><Text style={styles.unitText}>{unit}</Text></View>
    </View>
  );
}

function SectionTable({ title, children }) {
  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>{title}</Text></View>
      {children}
    </View>
  );
}

export default function AnestheticDrugDosingScreen() {
  const [weight, setWeight] = useState('70');
  const [age, setAge] = useState('40');
  const [height, setHeight] = useState('170');
  const [ageGroup, setAgeGroup] = useState('adult');

  const doses = useMemo(() => Calc.calculateAnestheticDoses(weight, age, ageGroup), [weight, age, ageGroup]);

  const fmt = (d) => typeof d === 'object' ? `${d.min} – ${d.max}` : d;

  return (
    <ScreenWrapper title="Anaesthetic Drug Dosing" subtitle="Weight & age-adjusted dosing calculator">
      <View style={styles.patientCard}>
        <Text style={styles.cardTitle}>Patient Information</Text>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Weight (kg)</Text>
            <TextInput style={styles.input} keyboardType="decimal-pad" value={weight} onChangeText={setWeight} />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age (years)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />
          </View>
        </View>
        <View style={styles.inputRow}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Height (cm)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} />
          </View>
          <View style={styles.inputGroup}>
            <PickerSelect label="Age Group" options={[
              { value: 'neonate', label: 'Neonate (0-28d)' }, { value: 'infant', label: 'Infant (1-12mo)' },
              { value: 'toddler', label: 'Toddler (1-3yr)' }, { value: 'preschool', label: 'Preschool (3-6yr)' },
              { value: 'school', label: 'School (6-12yr)' }, { value: 'adolescent', label: 'Adolescent (12-18yr)' },
              { value: 'adult', label: 'Adult (18-65yr)' }, { value: 'elderly', label: 'Elderly (>65yr)' },
            ]} selected={ageGroup} onSelect={setAgeGroup} />
          </View>
        </View>
        <Text style={styles.factorText}>Age Factor: {doses.ageFactor} | MAC Factor: {doses.macFactor}</Text>
      </View>

      <CollapsibleCard title="I. Intravenous Anaesthetics" icon="syringe">
        <SectionTable title="Propofol">
          <DoseRow drug="Propofol" route="Induction" doseRange={fmt(doses.iv.propofol.induction)} unit="mg" />
          <DoseRow drug="" route="Maintenance" doseRange={fmt(doses.iv.propofol.maintenance)} unit="mcg/kg/min" />
          <DoseRow drug="" route="Sedation" doseRange={fmt(doses.iv.propofol.sedation)} unit="mcg/kg/min" />
        </SectionTable>
        <SectionTable title="Ketamine">
          <DoseRow drug="Ketamine" route="IV" doseRange={fmt(doses.iv.ketamine.iv)} unit="mg" />
          <DoseRow drug="" route="IM" doseRange={fmt(doses.iv.ketamine.im)} unit="mg" />
          <DoseRow drug="" route="Analgesic" doseRange={fmt(doses.iv.ketamine.analgesic)} unit="mg" />
        </SectionTable>
        <SectionTable title="Other IV Agents">
          <DoseRow drug="Etomidate" route="Induction" doseRange={fmt(doses.iv.etomidate.induction)} unit="mg" />
          <DoseRow drug="Dexmedetomidine" route="Loading" doseRange={doses.iv.dexmedetomidine.load} unit="mcg" />
          <DoseRow drug="" route="Maintenance" doseRange={fmt(doses.iv.dexmedetomidine.maintenance)} unit="mcg/kg/hr" />
          <DoseRow drug="Thiopental" route="Induction" doseRange={fmt(doses.iv.thiopental.induction)} unit="mg" />
          <DoseRow drug="Remimazolam" route="Induction" doseRange={fmt(doses.iv.remimazolam.induction)} unit="mg" />
          <DoseRow drug="" route="Maintenance" doseRange={fmt(doses.iv.remimazolam.maintenance)} unit="mg/min" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="I.B. Inhalational Anaesthetics" icon="wind">
        <SectionTable title="MAC Values (Age-Adjusted)">
          <DoseRow drug="Sevoflurane" route="MAC" doseRange={doses.inhalational.sevoflurane.mac} unit="%" />
          <DoseRow drug="Desflurane" route="MAC" doseRange={doses.inhalational.desflurane.mac} unit="%" />
          <DoseRow drug="Isoflurane" route="MAC" doseRange={doses.inhalational.isoflurane.mac} unit="%" />
          <DoseRow drug="Nitrous Oxide" route="MAC" doseRange="104" unit="%" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="II. Opioid Analgesics" icon="pills">
        <SectionTable title="Fentanyl">
          <DoseRow drug="Fentanyl" route="Bolus" doseRange={fmt(doses.opioids.fentanyl.bolus)} unit="mcg" />
          <DoseRow drug="" route="Infusion" doseRange={fmt(doses.opioids.fentanyl.infusion)} unit="mcg/kg/hr" />
          <DoseRow drug="" route="Epidural" doseRange={fmt(doses.opioids.fentanyl.epidural)} unit="mcg/kg" />
        </SectionTable>
        <SectionTable title="Morphine">
          <DoseRow drug="Morphine" route="IV" doseRange={fmt(doses.opioids.morphine.iv)} unit="mg/kg" />
          <DoseRow drug="" route="Epidural" doseRange={fmt(doses.opioids.morphine.epidural)} unit="mg/kg" />
        </SectionTable>
        <SectionTable title="Other Opioids">
          <DoseRow drug="Sufentanil" route="Bolus" doseRange={fmt(doses.opioids.sufentanil.bolus)} unit="mcg" />
          <DoseRow drug="Remifentanil" route="Bolus" doseRange={fmt(doses.opioids.remifentanil.bolus)} unit="mcg" />
          <DoseRow drug="" route="Infusion" doseRange={fmt(doses.opioids.remifentanil.infusion)} unit="mcg/kg/hr" />
          <DoseRow drug="Hydromorphone" route="IV" doseRange={fmt(doses.opioids.hydromorphone.iv)} unit="mg/kg" />
          <DoseRow drug="Tramadol" route="Dose" doseRange={doses.opioids.tramadol.dose} unit="" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="III. Neuromuscular Blocking Agents" icon="link">
        <SectionTable title="NMB Agents">
          <DoseRow drug="Succinylcholine" route="IV" doseRange={fmt(doses.nmb.succinylcholine.iv)} unit="mg" />
          <DoseRow drug="" route="IM" doseRange={fmt(doses.nmb.succinylcholine.im)} unit="mg" />
          <DoseRow drug="Rocuronium" route="Intubation" doseRange={doses.nmb.rocuronium.intubation} unit="mg" />
          <DoseRow drug="" route="RSI" doseRange={fmt(doses.nmb.rocuronium.rsi)} unit="mg" />
          <DoseRow drug="Vecuronium" route="Intubation" doseRange={doses.nmb.vecuronium.intubation} unit="mg" />
          <DoseRow drug="Cisatracurium" route="Intubation" doseRange={fmt(doses.nmb.cisatracurium.intubation)} unit="mg" />
          <DoseRow drug="Atracurium" route="Intubation" doseRange={doses.nmb.atracurium.intubation} unit="mg" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="IV. Local Anaesthetics" icon="syringe">
        <SectionTable title="Maximum Doses (Fixed)">
          <DoseRow drug="Lidocaine" route="Max Dose" doseRange={doses.local.lidocaine.max} unit="mg" />
          <DoseRow drug="Bupivacaine" route="Max Dose" doseRange={doses.local.bupivacaine.max} unit="mg" />
          <DoseRow drug="Ropivacaine" route="Max Dose" doseRange={doses.local.ropivacaine.max} unit="mg" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="V. Sedatives / Anxiolytics" icon="smile">
        <SectionTable title="Sedatives">
          <DoseRow drug="Midazolam" route="Premed" doseRange={doses.sedatives.midazolam.premed} unit="mg" />
          <DoseRow drug="Lorazepam" route="Premed" doseRange={doses.sedatives.lorazepam.premed} unit="mg" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="VI. Vasopressors & Inotropes" icon="tint">
        <SectionTable title="Vasopressors">
          <DoseRow drug="Phenylephrine" route="Infusion" doseRange={fmt(doses.vasopressors.phenylephrine.infusion)} unit="mcg/min" />
          <DoseRow drug="Norepinephrine" route="Infusion" doseRange={fmt(doses.vasopressors.norepinephrine.infusion)} unit="mcg/min" />
          <DoseRow drug="Epinephrine" route="Infusion" doseRange={fmt(doses.vasopressors.epinephrine.infusion)} unit="mcg/min" />
          <DoseRow drug="Dopamine" route="Infusion" doseRange={fmt(doses.vasopressors.dopamine.infusion)} unit="mcg/min" />
          <DoseRow drug="Dobutamine" route="Infusion" doseRange={fmt(doses.vasopressors.dobutamine.infusion)} unit="mcg/min" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="VII. Emergency / Reversal" icon="exclamation-triangle">
        <SectionTable title="Reversal Agents">
          <DoseRow drug="Sugammadex" route="Routine" doseRange={doses.reversal.sugammadex.routine} unit="mg" />
          <DoseRow drug="" route="Deep Block" doseRange={doses.reversal.sugammadex.deep} unit="mg" />
          <DoseRow drug="" route="Immediate" doseRange={doses.reversal.sugammadex.immediate} unit="mg" />
          <DoseRow drug="Neostigmine" route="Dose" doseRange={doses.reversal.neostigmine.dose} unit="mg" />
          <DoseRow drug="Glycopyrrolate" route="Dose" doseRange={doses.reversal.glycopyrrolate.dose} unit="mg" />
          <DoseRow drug="Atropine" route="Premed" doseRange={doses.reversal.atropine.premed} unit="mg" />
          <DoseRow drug="" route="Bradycardia" doseRange={doses.reversal.atropine.bradycardia} unit="mg" />
          <DoseRow drug="Dantrolene" route="Initial" doseRange={doses.reversal.dantrolene.dose} unit="mg" />
        </SectionTable>
      </CollapsibleCard>

      <CollapsibleCard title="VIII. Antiemetics" icon="dizzy">
        <SectionTable title="Antiemetics">
          <DoseRow drug="Ondansetron" route="Dose" doseRange={doses.antiemetics.ondansetron.dose} unit="mg" />
          <DoseRow drug="Dexamethasone" route="Dose" doseRange={doses.antiemetics.dexamethasone.dose} unit="mg" />
          <DoseRow drug="Metoclopramide" route="Dose" doseRange={doses.antiemetics.metoclopramide.dose} unit="mg" />
        </SectionTable>
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  patientCard: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOW },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: SPACING.sm },
  inputRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.sm },
  inputGroup: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: COLORS.textMuted, marginBottom: 2 },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 8, fontSize: 14, backgroundColor: COLORS.white },
  factorText: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginTop: SPACING.xs, textAlign: 'center' },
  table: { marginBottom: SPACING.md, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  tableHeader: { backgroundColor: COLORS.medicalBlue, padding: SPACING.sm },
  tableHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  row: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border, padding: SPACING.sm, backgroundColor: COLORS.white },
  drugCol: { flex: 1 },
  doseCol: { flex: 1, alignItems: 'flex-end' },
  drugName: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  routeText: { fontSize: 12, color: COLORS.textMuted },
  doseText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  unitText: { fontSize: 11, color: COLORS.textMuted },
});
