import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import * as Calc from '../utils/calculators';

const protocolSteps = {
  mh: [
    '1. Stop all triggering agents (volatile anaesthetics, succinylcholine)',
    '2. Call for help - Get MH cart',
    '3. Hyperventilate with 100% O2 at 10 L/min',
    '4. Give Dantrolene - 2.5 mg/kg IV bolus, repeat q5min PRN',
    '5. Cool patient - Ice packs, cold IV fluids',
    '6. Treat arrhythmias - Avoid calcium channel blockers',
    '7. Monitor - ABG, electrolytes, CK, temperature',
  ],
  last: [
    '1. Stop local anaesthetic injection',
    '2. Call for help - Get lipid emulsion',
    '3. Manage airway and breathing',
    '4. Suppress seizures - Small doses of benzodiazepines/propofol',
    '5. Give 20% Intralipid - Initial bolus 1.5 mL/kg',
    '6. Start infusion - 0.25 mL/kg/min',
    '7. CPR if needed - Continue for extended period',
    '8. Avoid vasopressin, calcium channel blockers, beta-blockers',
  ],
  anaphylaxis: [
    '1. Remove/Stop suspected trigger',
    '2. Call for help - Emergency response',
    '3. Epinephrine IM - Anterolateral thigh (primary treatment)',
    '4. High-flow O2 - 15 L/min',
    '5. IV access - Large bore cannula',
    '6. Fluid resuscitation - Crystalloid 20 mL/kg',
    '7. H1 antagonist - Diphenhydramine 1 mg/kg',
    '8. H2 antagonist - Ranitidine 1 mg/kg',
    '9. Steroid - Methylprednisolone 1 mg/kg',
  ],
};

function ProtocolSteps({ title, steps }) {
  return (
    <View style={styles.protocolBox}>
      <Text style={styles.protocolTitle}>{title}</Text>
      {steps.map((s, i) => <Text key={i} style={styles.protocolStep}>{s}</Text>)}
    </View>
  );
}

export default function EmergencyScreen() {
  const [patientWeight, setPatientWeight] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('male');

  const [mhWeight, setMhWeight] = useState('');
  const [mhResult, setMhResult] = useState(null);

  const [lastWeight, setLastWeight] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const [anaWeight, setAnaWeight] = useState('');
  const [anaAge, setAnaAge] = useState('adult');
  const [anaResult, setAnaResult] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  return (
    <ScreenWrapper title="Emergency & Crisis Management" subtitle="Critical protocols and emergency calculations">
      <View style={styles.alertBox}>
        <View style={styles.alertRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#721c24" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertStrong}>Emergency Use: </Text>
            These calculators are for emergency situations. Always follow your institution's crisis protocols and seek immediate senior support.
          </Text>
        </View>
      </View>

      <View style={styles.patientCard}>
        <View style={styles.patientHeader}>
          <View style={styles.patientHeaderRow}>
            <FontAwesome5 name="user" size={14} color={COLORS.white} style={styles.patientHeaderIcon} />
            <Text style={styles.patientHeaderText}>Patient Information</Text>
          </View>
        </View>
        <View style={styles.patientBody}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="70"
            value={patientWeight}
            onChangeText={setPatientWeight}
          />

          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="45"
            value={patientAge}
            onChangeText={setPatientAge}
          />

          <PickerSelect
            label="Gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            selected={patientGender}
            onSelect={setPatientGender}
          />
        </View>
      </View>

      <CollapsibleCard
        title="Malignant Hyperthermia Protocol"
        icon="fire"
        open={activeCard === 'mh'}
        onToggle={(nextOpen) => toggleCard('mh', nextOpen)}
      >
        <View style={[styles.sectionAlert, styles.sectionAlertDanger]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextDanger]}>
            MALIGNANT HYPERTHERMIA EMERGENCY
          </Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={mhWeight} onChangeText={setMhWeight} />
        <CalcButton title="Calculate Dantrolene Dosing" color={COLORS.danger} onPress={() => setMhResult(Calc.calculateDantrolenes(mhWeight))} />
        {mhResult && <ResultDisplay result={mhResult.text} type={mhResult.type} />}
        <ProtocolSteps title="Immediate Actions:" steps={protocolSteps.mh} />
      </CollapsibleCard>

      <CollapsibleCard
        title="LAST Protocol (Lipid Rescue)"
        icon="syringe"
        open={activeCard === 'last'}
        onToggle={(nextOpen) => toggleCard('last', nextOpen)}
      >
        <View style={[styles.sectionAlert, styles.sectionAlertWarning]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextWarning]}>
            LOCAL ANAESTHETIC SYSTEMIC TOXICITY
          </Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={lastWeight} onChangeText={setLastWeight} />
        <CalcButton title="Calculate Lipid Rescue Dosing" color="#d39e00" onPress={() => setLastResult(Calc.calculateLipidRescue(lastWeight))} />
        {lastResult && <ResultDisplay result={lastResult.text} type={lastResult.type} />}
        <ProtocolSteps title="LAST Treatment Protocol:" steps={protocolSteps.last} />
      </CollapsibleCard>

      <CollapsibleCard
        title="Anaphylaxis Management"
        icon="allergies"
        open={activeCard === 'anaphylaxis'}
        onToggle={(nextOpen) => toggleCard('anaphylaxis', nextOpen)}
      >
        <View style={[styles.sectionAlert, styles.sectionAlertDanger]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextDanger]}>
            ANAPHYLAXIS EMERGENCY
          </Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={anaWeight} onChangeText={setAnaWeight} />
        <PickerSelect label="Age Group" options={[
          { value: 'adult', label: 'Adult (>12 years)' },
          { value: 'child', label: 'Child (6mo - 12yr)' },
          { value: 'infant', label: 'Infant (<6 months)' },
        ]} selected={anaAge} onSelect={setAnaAge} />
        <CalcButton title="Calculate Emergency Doses" color={COLORS.danger} onPress={() => setAnaResult(Calc.calculateAnaphylaxis(anaWeight, anaAge))} />
        {anaResult && <ResultDisplay result={anaResult.text} type={anaResult.type} />}
        <ProtocolSteps title="Anaphylaxis Treatment Protocol:" steps={protocolSteps.anaphylaxis} />
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  alertBox: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', borderWidth: 1, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start' },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertText: { color: '#721c24', fontSize: 13, lineHeight: 19 },
  alertStrong: { fontWeight: '700', color: '#721c24' },
  patientCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.primary,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  patientHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  patientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientHeaderIcon: {
    marginRight: 8,
  },
  patientHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
  patientBody: {
    padding: SPACING.md,
  },
  sectionAlert: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginBottom: SPACING.md,
  },
  sectionAlertDanger: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  sectionAlertWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeeba',
  },
  sectionAlertText: {
    fontSize: 13,
    fontWeight: '700',
  },
  sectionAlertTextDanger: {
    color: '#721c24',
  },
  sectionAlertTextWarning: {
    color: '#856404',
  },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  protocolBox: { backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.md, marginTop: SPACING.md },
  protocolTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: SPACING.sm },
  protocolStep: { fontSize: 13, color: COLORS.text, marginBottom: 4, paddingLeft: 4 },
});
