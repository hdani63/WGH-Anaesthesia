import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect, CheckboxItem } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function ICUCalculatorsScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // APACHE II
  const [temperature, setTemperature] = useState('');
  const [gcs, setGcs] = useState('');
  const [chronicHealth, setChronicHealth] = useState('0');
  const [apacheResult, setApacheResult] = useState(null);

  // SOFA
  const [sofa, setSofa] = useState({ respiratory: '', coagulation: '', liver: '', cardiovascular: '', cns: '', renal: '' });
  const [sofaResult, setSofaResult] = useState(null);

  // RASS
  const [rassLevel, setRassLevel] = useState('');
  const [rassResult, setRassResult] = useState(null);

  // CAM-ICU
  const [cam, setCam] = useState({ acute: '', inattention: '', disorganized: '', altered: '' });
  const [camResult, setCamResult] = useState(null);

  return (
    <ScreenWrapper title="ICU Calculators" subtitle="Critical care assessment tools">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="APACHE II Score" icon="chart-line">
        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="37.0" value={temperature} onChangeText={setTemperature} />
        <PickerSelect label="Glasgow Coma Scale" options={[
          { value: '15', label: '15 - Normal' }, { value: '14', label: '14' }, { value: '13', label: '13' },
          { value: '12', label: '12' }, { value: '11', label: '11' }, { value: '10', label: '10' },
          { value: '9', label: '9' }, { value: '8', label: '8' }, { value: '7', label: '7' },
          { value: '6', label: '6' }, { value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3 - Lowest' },
        ]} selected={gcs} onSelect={setGcs} />
        <PickerSelect label="Chronic Health Points" options={[
          { value: '0', label: '0 - None' }, { value: '2', label: '2 - Elective postop' }, { value: '5', label: '5 - Emergency/organ insufficiency' },
        ]} selected={chronicHealth} onSelect={setChronicHealth} />
        <CalcButton title="Calculate APACHE II" onPress={() => setApacheResult(Calc.calculateAPACHE(temperature, gcs, chronicHealth, patient))} />
        {apacheResult && <ResultDisplay result={apacheResult.text} type={apacheResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="SOFA Score" icon="lungs">
        <PickerSelect label="Respiratory (PaO₂/FiO₂)" options={[
          { value: '0', label: '0 — ≥400' }, { value: '1', label: '1 — 300-399' },
          { value: '2', label: '2 — 200-299' }, { value: '3', label: '3 — 100-199 w/vent' }, { value: '4', label: '4 — <100 w/vent' },
        ]} selected={sofa.respiratory} onSelect={v => setSofa(p => ({ ...p, respiratory: v }))} />
        <PickerSelect label="Coagulation (Platelets ×10³)" options={[
          { value: '0', label: '0 — ≥150' }, { value: '1', label: '1 — 100-149' },
          { value: '2', label: '2 — 50-99' }, { value: '3', label: '3 — 20-49' }, { value: '4', label: '4 — <20' },
        ]} selected={sofa.coagulation} onSelect={v => setSofa(p => ({ ...p, coagulation: v }))} />
        <PickerSelect label="Liver (Bilirubin mg/dL)" options={[
          { value: '0', label: '0 — <1.2' }, { value: '1', label: '1 — 1.2-1.9' },
          { value: '2', label: '2 — 2.0-5.9' }, { value: '3', label: '3 — 6.0-11.9' }, { value: '4', label: '4 — ≥12.0' },
        ]} selected={sofa.liver} onSelect={v => setSofa(p => ({ ...p, liver: v }))} />
        <PickerSelect label="Cardiovascular" options={[
          { value: '0', label: '0 — No hypotension' }, { value: '1', label: '1 — MAP <70' },
          { value: '2', label: '2 — Dop ≤5 or dobutamine' }, { value: '3', label: '3 — Dop >5 or epi/norepi ≤0.1' },
          { value: '4', label: '4 — Dop >15 or epi/norepi >0.1' },
        ]} selected={sofa.cardiovascular} onSelect={v => setSofa(p => ({ ...p, cardiovascular: v }))} />
        <PickerSelect label="CNS (GCS)" options={[
          { value: '0', label: '0 — GCS 15' }, { value: '1', label: '1 — GCS 13-14' },
          { value: '2', label: '2 — GCS 10-12' }, { value: '3', label: '3 — GCS 6-9' }, { value: '4', label: '4 — GCS 3-5' },
        ]} selected={sofa.cns} onSelect={v => setSofa(p => ({ ...p, cns: v }))} />
        <PickerSelect label="Renal (Creatinine/UO)" options={[
          { value: '0', label: '0 — <1.2' }, { value: '1', label: '1 — 1.2-1.9' },
          { value: '2', label: '2 — 2.0-3.4' }, { value: '3', label: '3 — 3.5-4.9 or UO <500' }, { value: '4', label: '4 — ≥5.0 or UO <200' },
        ]} selected={sofa.renal} onSelect={v => setSofa(p => ({ ...p, renal: v }))} />
        <CalcButton title="Calculate SOFA" onPress={() => setSofaResult(Calc.calculateSOFA(sofa))} />
        {sofaResult && <ResultDisplay result={sofaResult.text} type={sofaResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="RASS (Richmond Agitation-Sedation)" icon="bed">
        <PickerSelect label="Level of Consciousness" options={[
          { value: '4', label: '+4 Combative' }, { value: '3', label: '+3 Very Agitated' },
          { value: '2', label: '+2 Agitated' }, { value: '1', label: '+1 Restless' },
          { value: '0', label: '0 Alert & Calm' }, { value: '-1', label: '-1 Drowsy' },
          { value: '-2', label: '-2 Light Sedation' }, { value: '-3', label: '-3 Moderate Sedation' },
          { value: '-4', label: '-4 Deep Sedation' }, { value: '-5', label: '-5 Unarousable' },
        ]} selected={rassLevel} onSelect={setRassLevel} />
        <CalcButton title="Assess RASS" onPress={() => setRassResult(Calc.assessRASS(rassLevel))} />
        {rassResult && <ResultDisplay result={rassResult.text} type={rassResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="CAM-ICU (Delirium Assessment)" icon="brain">
        <PickerSelect label="Feature 1: Acute onset / fluctuating course" options={[
          { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' },
        ]} selected={cam.acute} onSelect={v => setCam(p => ({ ...p, acute: v }))} />
        <PickerSelect label="Feature 2: Inattention" options={[
          { value: 'no', label: 'No (0-2 errors)' }, { value: 'yes', label: 'Yes (>2 errors)' },
        ]} selected={cam.inattention} onSelect={v => setCam(p => ({ ...p, inattention: v }))} />
        <PickerSelect label="Feature 3: Disorganized thinking" options={[
          { value: 'no', label: 'No (0-1 errors)' }, { value: 'yes', label: 'Yes (>1 error)' },
        ]} selected={cam.disorganized} onSelect={v => setCam(p => ({ ...p, disorganized: v }))} />
        <PickerSelect label="Feature 4: Altered consciousness" options={[
          { value: 'no', label: 'No (RASS = 0)' }, { value: 'yes', label: 'Yes (RASS ≠ 0)' },
        ]} selected={cam.altered} onSelect={v => setCam(p => ({ ...p, altered: v }))} />
        <CalcButton title="Assess CAM-ICU" onPress={() => setCamResult(Calc.assessCAM(cam.acute, cam.inattention, cam.disorganized, cam.altered))} />
        {camResult && <ResultDisplay result={camResult.text} type={camResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
});
