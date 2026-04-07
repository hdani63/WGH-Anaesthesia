import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect, CheckboxItem } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function ECMOScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });
  const [ecmoType, setEcmoType] = useState('vv');

  // Initial settings
  const [initResult, setInitResult] = useState(null);

  // Flow Rate
  const [targetCI, setTargetCI] = useState('2.5');
  const [nativeCO, setNativeCO] = useState('20');
  const [flowResult, setFlowResult] = useState(null);

  // Gas Exchange
  const [currentPCO2, setCurrentPCO2] = useState('');
  const [targetPCO2, setTargetPCO2] = useState('40');
  const [currentSweep, setCurrentSweep] = useState('');
  const [gasResult, setGasResult] = useState(null);

  // Anticoagulation
  const [currentACT, setCurrentACT] = useState('');
  const [targetACT, setTargetACT] = useState('180-220');
  const [currentHepRate, setCurrentHepRate] = useState('');
  const [anticoagResult, setAnticoagResult] = useState(null);

  // Circuit
  const [preMembrane, setPreMembrane] = useState('');
  const [postMembrane, setPostMembrane] = useState('');
  const [circuitFlow, setCircuitFlow] = useState('');
  const [rpm, setRpm] = useState('');
  const [circuitResult, setCircuitResult] = useState(null);

  // Weaning
  const [supportLevel, setSupportLevel] = useState('full');
  const [weanCriteria, setWeanCriteria] = useState({
    hemodynamics: false, gasExchange: false, cardiacFunction: false, lungFunction: false,
    neurologicStatus: false, minimalInotropes: false, adequateVentilation: false, coagulationStable: false,
  });
  const [weanResult, setWeanResult] = useState(null);

  const calcAnticoag = () => {
    const act = parseFloat(currentACT);
    const rate = parseFloat(currentHepRate);
    const [tMin, tMax] = targetACT.split('-').map(Number);
    const tMid = (tMin + tMax) / 2;
    let newRate = rate, advice;
    if (act < tMin) {
      const factor = 1.1 + ((tMid - act) / tMid * 0.2);
      newRate = rate * Math.min(factor, 1.5);
      advice = `ACT ${act}s is below target (${targetACT}s)\nIncrease heparin to ${newRate.toFixed(1)} units/kg/hr`;
    } else if (act > tMax) {
      const factor = 0.9 - ((act - tMid) / tMid * 0.2);
      newRate = rate * Math.max(factor, 0.5);
      advice = `ACT ${act}s is above target (${targetACT}s)\nDecrease heparin to ${newRate.toFixed(1)} units/kg/hr`;
    } else {
      advice = `ACT ${act}s is within target range (${targetACT}s)\nMaintain current rate: ${rate} units/kg/hr`;
    }
    setAnticoagResult({ text: `${advice}\nRecheck ACT in 4-6 hours`, type: act >= tMin && act <= tMax ? 'success' : 'warning' });
  };

  const calcCircuit = () => {
    const pre = parseFloat(preMembrane);
    const post = parseFloat(postMembrane);
    const flow = parseFloat(circuitFlow);
    const pumpRPM = parseFloat(rpm);
    const tmp = pre - post;
    let tmpStatus = 'Normal';
    let type = 'success';
    if (tmp > 100) { tmpStatus = 'CRITICAL — Consider circuit change'; type = 'danger'; }
    else if (tmp > 50) { tmpStatus = 'Elevated — Check for clotting'; type = 'warning'; }
    const efficiency = (flow / (pumpRPM * 0.0015)) * 100;
    setCircuitResult({ text: `Transmembrane Pressure: ${tmp.toFixed(0)} mmHg — ${tmpStatus}\nFlow Efficiency: ${efficiency.toFixed(0)}%`, type });
  };

  const calcWeaning = () => {
    const met = Object.values(weanCriteria).filter(Boolean).length;
    const pct = (met / 8) * 100;
    let type, text;
    if (pct >= 90 && supportLevel === 'minimal') { type = 'success'; text = `Weaning Assessment: READY (${met}/8 criteria met)\nConsider trial off ECMO`; }
    else if (pct >= 75 && supportLevel !== 'full') { type = 'warning'; text = `Weaning Assessment: Potentially ready (${met}/8 criteria)\nContinue monitoring and reducing support`; }
    else { type = 'danger'; text = `Weaning Assessment: NOT ready (${met}/8 criteria)\nContinue current ECMO support`; }
    setWeanResult({ text, type });
  };

  return (
    <ScreenWrapper title="ECMO Parameters" subtitle="ECMO management and calculations">
      <View style={styles.disclaimer}>
        <View style={styles.disclaimerRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.disclaimerIcon} />
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerStrong}>ECMO Management: </Text>
            These calculations are for guidance only. Always consult ECMO specialists and follow institutional protocols.
          </Text>
        </View>
      </View>
      <PatientInfoCard patient={patient} setPatient={setPatient} />
      <PickerSelect label="ECMO Type" options={[
        { value: 'vv', label: 'VV-ECMO (Respiratory)' }, { value: 'va', label: 'VA-ECMO (Cardiac)' }, { value: 'vav', label: 'VAV-ECMO (Hybrid)' },
      ]} selected={ecmoType} onSelect={setEcmoType} />

      <CollapsibleCard title="Initial ECMO Settings" icon="cogs">
        <CalcButton title="Calculate Initial Settings" onPress={() => setInitResult(Calc.calculateInitialECMO(patient.weight, patient.height, ecmoType))} />
        {initResult && <ResultDisplay result={initResult.text} type={initResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Flow Rate Calculator" icon="tachometer-alt">
        <Text style={styles.label}>Target Cardiac Index (L/min/m²)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="2.5" value={targetCI} onChangeText={setTargetCI} />
        <Text style={styles.label}>Native Cardiac Output (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="20" value={nativeCO} onChangeText={setNativeCO} />
        <CalcButton title="Calculate Flow" onPress={() => setFlowResult(Calc.calculateECMOFlow(patient.weight, targetCI, nativeCO))} />
        {flowResult && <ResultDisplay result={flowResult.text} type={flowResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Gas Exchange Parameters" icon="wind">
        <Text style={styles.label}>Current PaCO₂ (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="45" value={currentPCO2} onChangeText={setCurrentPCO2} />
        <Text style={styles.label}>Target PaCO₂ (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="40" value={targetPCO2} onChangeText={setTargetPCO2} />
        <Text style={styles.label}>Current Sweep Gas (L/min)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="2" value={currentSweep} onChangeText={setCurrentSweep} />
        <CalcButton title="Calculate" onPress={() => setGasResult(Calc.calculateGasExchange(currentPCO2, targetPCO2, currentSweep))} />
        {gasResult && <ResultDisplay result={gasResult.text} type={gasResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Anticoagulation Management" icon="syringe">
        <Text style={styles.label}>Current ACT (seconds)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="180" value={currentACT} onChangeText={setCurrentACT} />
        <PickerSelect label="Target ACT Range" options={[
          { value: '180-220', label: '180-220s — Standard' }, { value: '160-180', label: '160-180s — Low bleed risk' }, { value: '140-160', label: '140-160s — High bleed risk' },
        ]} selected={targetACT} onSelect={setTargetACT} />
        <Text style={styles.label}>Current Heparin Rate (units/kg/hr)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="20" value={currentHepRate} onChangeText={setCurrentHepRate} />
        <CalcButton title="Adjust Anticoagulation" onPress={calcAnticoag} />
        {anticoagResult && <ResultDisplay result={anticoagResult.text} type={anticoagResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Circuit Monitoring" icon="chart-line">
        <Text style={styles.label}>Pre-Membrane Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="150" value={preMembrane} onChangeText={setPreMembrane} />
        <Text style={styles.label}>Post-Membrane Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="100" value={postMembrane} onChangeText={setPostMembrane} />
        <Text style={styles.label}>Current Flow Rate (L/min)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="4.5" value={circuitFlow} onChangeText={setCircuitFlow} />
        <Text style={styles.label}>RPM</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="3000" value={rpm} onChangeText={setRpm} />
        <CalcButton title="Assess Circuit" onPress={calcCircuit} />
        {circuitResult && <ResultDisplay result={circuitResult.text} type={circuitResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="ECMO Weaning Assessment" icon="chart-line">
        <PickerSelect label="Current Support Level" options={[
          { value: 'full', label: 'Full (>80% CO)' }, { value: 'partial', label: 'Partial (50-80% CO)' }, { value: 'minimal', label: 'Minimal (<50% CO)' },
        ]} selected={supportLevel} onSelect={setSupportLevel} />
        {Object.entries({
          hemodynamics: 'Stable hemodynamics', gasExchange: 'Adequate gas exchange',
          cardiacFunction: 'Improved cardiac function (VA-ECMO)', lungFunction: 'Improved lung function (VV-ECMO)',
          neurologicStatus: 'Stable neurologic status', minimalInotropes: 'Minimal inotropic support',
          adequateVentilation: 'Adequate ventilation settings', coagulationStable: 'Stable coagulation profile',
        }).map(([key, label]) => (
          <CheckboxItem key={key} label={label} checked={weanCriteria[key]} onToggle={() => setWeanCriteria(p => ({ ...p, [key]: !p[key] }))} />
        ))}
        <CalcButton title="Assess Weaning" onPress={calcWeaning} />
        {weanResult && <ResultDisplay result={weanResult.text} type={weanResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  disclaimer: { backgroundColor: '#fff3cd', borderColor: '#ffc107', borderWidth: 1, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md },
  disclaimerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  disclaimerIcon: { marginRight: 8, marginTop: 2 },
  disclaimerText: { color: '#856404', fontSize: 13, lineHeight: 19 },
  disclaimerStrong: { fontWeight: '700', color: '#856404' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
});
