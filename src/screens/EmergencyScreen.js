import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import * as Calc from '../utils/calculators';

const protocolSteps = {
  mh: [
    '1. Stop all triggering agents',
    '2. Call for help – Get MH cart',
    '3. Hyperventilate with 100% O₂ at 10 L/min',
    '4. Give Dantrolene 2.5 mg/kg IV bolus, repeat q5min PRN',
    '5. Cool patient – Ice packs, cold IV fluids',
    '6. Treat arrhythmias – Avoid calcium channel blockers',
    '7. Monitor – ABG, electrolytes, CK, temperature',
  ],
  last: [
    '1. Stop local anesthetic injection',
    '2. Call for help – Get lipid emulsion',
    '3. Manage airway and breathing',
    '4. Suppress seizures – Benzodiazepines/propofol',
    '5. Give 20% Intralipid – Initial bolus 1.5 mL/kg',
    '6. Start infusion – 0.25 mL/kg/min',
    '7. CPR if needed – Continue for extended period',
    '8. Avoid vasopressin, CCBs, β-blockers',
  ],
  anaphylaxis: [
    '1. Remove/Stop suspected trigger',
    '2. Call for help',
    '3. Epinephrine IM – Anterolateral thigh',
    '4. High-flow O₂ – 15 L/min',
    '5. IV access – Large bore',
    '6. Fluid resuscitation – 20 mL/kg crystalloid',
    '7. H₁ antagonist – Diphenhydramine 1 mg/kg',
    '8. H₂ antagonist – Ranitidine 1 mg/kg',
    '9. Steroid – Methylprednisolone 1 mg/kg',
  ],
};

function ProtocolSteps({ steps }) {
  return (
    <View style={styles.protocolBox}>
      <Text style={styles.protocolTitle}>Protocol Steps:</Text>
      {steps.map((s, i) => <Text key={i} style={styles.protocolStep}>{s}</Text>)}
    </View>
  );
}

export default function EmergencyScreen() {
  const [mhWeight, setMhWeight] = useState('');
  const [mhResult, setMhResult] = useState(null);

  const [lastWeight, setLastWeight] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const [anaWeight, setAnaWeight] = useState('');
  const [anaAge, setAnaAge] = useState('adult');
  const [anaResult, setAnaResult] = useState(null);

  const [rhythm, setRhythm] = useState('');
  const [aclsWeight, setAclsWeight] = useState('');
  const [aclsResult, setAclsResult] = useState(null);

  return (
    <ScreenWrapper title="Emergency & Crisis" subtitle="Emergency protocols and calculations">
      <View style={styles.alertBox}>
        <View style={styles.alertRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#721c24" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertStrong}>Emergency Tools: </Text>
            These calculators are for guidance only. Always follow institutional protocols and clinical judgment in emergency situations.
          </Text>
        </View>
      </View>

      <CollapsibleCard title="Malignant Hyperthermia Protocol" icon="fire">
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={mhWeight} onChangeText={setMhWeight} />
        <CalcButton title="Calculate Dantrolene" onPress={() => setMhResult(Calc.calculateDantrolenes(mhWeight))} />
        {mhResult && <ResultDisplay result={mhResult.text} type={mhResult.type} />}
        <ProtocolSteps steps={protocolSteps.mh} />
      </CollapsibleCard>

      <CollapsibleCard title="LAST Protocol (Lipid Rescue)" icon="syringe">
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={lastWeight} onChangeText={setLastWeight} />
        <CalcButton title="Calculate Lipid Rescue" onPress={() => setLastResult(Calc.calculateLipidRescue(lastWeight))} />
        {lastResult && <ResultDisplay result={lastResult.text} type={lastResult.type} />}
        <ProtocolSteps steps={protocolSteps.last} />
      </CollapsibleCard>

      <CollapsibleCard title="Anaphylaxis Management" icon="allergies">
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={anaWeight} onChangeText={setAnaWeight} />
        <PickerSelect label="Age Group" options={[
          { value: 'adult', label: 'Adult (>12 years)' },
          { value: 'child', label: 'Child (6mo - 12yr)' },
          { value: 'infant', label: 'Infant (<6 months)' },
        ]} selected={anaAge} onSelect={setAnaAge} />
        <CalcButton title="Calculate Doses" onPress={() => setAnaResult(Calc.calculateAnaphylaxis(anaWeight, anaAge))} />
        {anaResult && <ResultDisplay result={anaResult.text} type={anaResult.type} />}
        <ProtocolSteps steps={protocolSteps.anaphylaxis} />
      </CollapsibleCard>

      <CollapsibleCard title="ACLS Algorithms" icon="heartbeat">
        <PickerSelect label="Rhythm" options={[
          { value: 'vf_vt', label: 'VF/VT (Shockable)' },
          { value: 'asystole', label: 'Asystole' },
          { value: 'pea', label: 'PEA' },
          { value: 'bradycardia', label: 'Bradycardia (with pulse)' },
          { value: 'tachycardia', label: 'Tachycardia (with pulse)' },
        ]} selected={rhythm} onSelect={setRhythm} />
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={aclsWeight} onChangeText={setAclsWeight} />
        <CalcButton title="Get Protocol" onPress={() => setAclsResult(Calc.getACLSProtocol(rhythm, aclsWeight))} />
        {aclsResult && <ResultDisplay result={aclsResult.text} type={aclsResult.type} />}
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
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  protocolBox: { backgroundColor: '#f0f4f8', borderRadius: 6, padding: SPACING.md, marginTop: SPACING.md },
  protocolTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: SPACING.sm },
  protocolStep: { fontSize: 13, color: COLORS.text, marginBottom: 4, paddingLeft: 4 },
});
