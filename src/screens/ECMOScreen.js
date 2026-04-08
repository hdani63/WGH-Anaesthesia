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

export default function ECMOScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });
  const [ecmoType, setEcmoType] = useState('vv');

  // Initial settings
  const [initResult, setInitResult] = useState(null);

  // Flow Rate
  const [targetCI, setTargetCI] = useState('');
  const [nativeCO, setNativeCO] = useState('');
  const [flowResult, setFlowResult] = useState(null);

  // Gas Exchange
  const [currentPCO2, setCurrentPCO2] = useState('');
  const [targetPCO2, setTargetPCO2] = useState('');
  const [currentSweep, setCurrentSweep] = useState('');
  const [targetPO2, setTargetPO2] = useState('');
  const [gasResult, setGasResult] = useState(null);

  // Anticoagulation
  const [currentACT, setCurrentACT] = useState('');
  const [targetACT, setTargetACT] = useState('180-220');
  const [currentHepRate, setCurrentHepRate] = useState('');
  const [bleedingRisk, setBleedingRisk] = useState('standard');
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

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const calcInitialSettings = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);

    if (!weight || !height) {
      setInitResult({ text: 'Please enter weight and height', type: 'warning' });
      return;
    }

    const bsa = Math.sqrt((weight * height) / 3600);
    const initialFlow = bsa * 2.5;
    const sweepGas = weight * 0.03;

    let modeText = '';
    if (ecmoType === 'vv') {
      modeText = 'VV-ECMO: Target 60-80% of cardiac output';
    } else if (ecmoType === 'va') {
      modeText = 'VA-ECMO: Target 80-100% of cardiac output';
    }

    const extraModeLine = modeText ? `\n${modeText}` : '';
    setInitResult({
      text: `BSA: ${bsa.toFixed(2)} m2\nInitial Flow Rate: ${initialFlow.toFixed(1)} L/min\nInitial Sweep Gas: ${sweepGas.toFixed(1)} L/min\nFiO2: Start at 1.0 (100%)${extraModeLine}`,
      type: 'success',
    });
  };

  const calcFlowRate = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);
    const ci = parseFloat(targetCI) || 2.5;
    const nativePercent = parseFloat(nativeCO) || 0;

    if (!weight || !height) {
      setFlowResult({ text: 'Please enter weight and height', type: 'warning' });
      return;
    }

    const bsa = Math.sqrt((weight * height) / 3600);
    const totalCO = ci * bsa;
    const nativeContribution = totalCO * (nativePercent / 100);
    const ecmoFlow = totalCO - nativeContribution;

    setFlowResult({
      text: `Target Total CO: ${totalCO.toFixed(1)} L/min\nNative CO: ${nativeContribution.toFixed(1)} L/min (${nativePercent}%)\nRequired ECMO Flow: ${ecmoFlow.toFixed(1)} L/min\nBased on CI of ${ci} L/min/m2 and BSA of ${bsa.toFixed(2)} m2`,
      type: 'success',
    });
  };

  const calcGasExchange = () => {
    const current = parseFloat(currentPCO2);
    const target = parseFloat(targetPCO2);
    const sweep = parseFloat(currentSweep);
    const pO2 = parseFloat(targetPO2);

    if (!current || !target || !sweep) {
      setGasResult({ text: 'Please enter PaCO2 and sweep gas values', type: 'warning' });
      return;
    }

    const newSweep = sweep * (current / target);
    let text = `Recommended Sweep Gas: ${newSweep.toFixed(1)} L/min\nTo achieve PaCO2 of ${target} mmHg from ${current} mmHg`;

    if (pO2) {
      if (pO2 < 80) {
        text += `\nFor PaO2 ${pO2} mmHg: Consider reducing FiO2 to 0.6-0.8`;
      } else if (pO2 > 100) {
        text += `\nFor PaO2 ${pO2} mmHg: May need to increase flow rate or check membrane function`;
      } else {
        text += `\nFor PaO2 ${pO2} mmHg: Current oxygenation settings likely appropriate`;
      }
    }

    setGasResult({ text, type: 'success' });
  };

  const calcAnticoag = () => {
    const weight = parseFloat(patient.weight);
    const act = parseFloat(currentACT);
    const rate = parseFloat(currentHepRate);
    const [tMin, tMax] = targetACT.split('-').map(value => parseInt(value, 10));

    if (!weight || !act || !rate) {
      setAnticoagResult({ text: 'Please enter weight, ACT, and current heparin rate', type: 'warning' });
      return;
    }

    const tMid = (tMin + tMax) / 2;

    let adjustment = 'NO CHANGE needed';
    let newRate = rate;
    let type = 'success';

    if (act < tMin) {
      const increaseFactor = 1.1 + (((tMid - act) / tMid) * 0.2);
      newRate = rate * increaseFactor;
      adjustment = 'INCREASE heparin';
      type = 'warning';
    } else if (act > tMax) {
      const decreaseFactor = 0.9 - (((act - tMid) / tMid) * 0.2);
      newRate = rate * Math.max(decreaseFactor, 0.5);
      adjustment = 'DECREASE heparin';
      type = 'warning';
    }

    const totalRate = newRate * weight;
    setAnticoagResult({
      text: `Current ACT: ${act} seconds\nTarget Range: ${targetACT} seconds\nRecommendation: ${adjustment}\nNew Rate: ${newRate.toFixed(1)} units/kg/hr (${totalRate.toFixed(0)} units/hr)\nRecheck ACT in 4-6 hours after adjustment`,
      type,
    });
  };

  const calcCircuit = () => {
    const pre = parseFloat(preMembrane);
    const post = parseFloat(postMembrane);
    const flow = parseFloat(circuitFlow);
    const pumpRPM = parseFloat(rpm);

    if (!pre || !post || !flow || !pumpRPM) {
      setCircuitResult({ text: 'Please enter all circuit parameters', type: 'warning' });
      return;
    }

    const tmp = pre - post;

    let assessment = 'Normal transmembrane pressure';
    let recommendations = 'Continue current management';
    let type = 'success';

    if (tmp > 100) {
      assessment = 'High transmembrane pressure - membrane dysfunction likely';
      recommendations = 'Consider circuit change';
      type = 'danger';
    } else if (tmp > 50) {
      assessment = 'Elevated transmembrane pressure - monitor closely';
      recommendations = 'Check for clotting, consider anticoagulation optimization';
      type = 'warning';
    }

    const efficiency = (flow / (pumpRPM * 0.0015)) * 100;

    setCircuitResult({
      text: `Transmembrane Pressure: ${tmp.toFixed(0)} mmHg\nAssessment: ${assessment}\nFlow Efficiency: ${efficiency.toFixed(0)}%\n${recommendations}`,
      type,
    });
  };

  const calcWeaning = () => {
    const metCriteria = Object.values(weanCriteria).filter(Boolean).length;
    const totalCriteria = 8;
    const percentage = Math.round((metCriteria / totalCriteria) * 100);

    let readiness = 'Not ready for weaning';
    let recommendations = 'Continue current support, address missing criteria';
    let type = 'danger';

    if (percentage >= 90 && supportLevel === 'minimal') {
      readiness = 'Ready for weaning trial';
      recommendations = 'Consider formal weaning protocol';
      type = 'success';
    } else if (percentage >= 75 && (supportLevel === 'minimal' || supportLevel === 'partial')) {
      readiness = 'Potentially ready for weaning';
      recommendations = 'Optimize unmet criteria, then reassess';
      type = 'warning';
    }

    setWeanResult({
      text: `Weaning Criteria Met: ${metCriteria}/${totalCriteria} (${percentage}%)\nCurrent Support: ${supportLevel}\nAssessment: ${readiness}\n${recommendations}`,
      type,
    });
  };

  return (
    <ScreenWrapper title="ECMO Parameters Calculator" subtitle="Extracorporeal membrane oxygenation calculations and monitoring">
      <View style={styles.disclaimer}>
        <View style={styles.disclaimerRow}>
          <FontAwesome5 name="info-circle" size={14} color="#0c5460" style={styles.disclaimerIcon} />
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerStrong}>ECMO Specialist Use: </Text>
            These calculations are for ECMO specialists and perfusionists. Always follow institutional protocols and consult with ECMO team.
          </Text>
        </View>
      </View>
      <PatientInfoCard patient={patient} setPatient={setPatient} />
      <PickerSelect label="ECMO Type" options={[
        { value: 'vv', label: 'VV-ECMO (Respiratory)' }, { value: 'va', label: 'VA-ECMO (Cardiac)' }, { value: 'vav', label: 'VAV-ECMO (Hybrid)' },
      ]} selected={ecmoType} onSelect={setEcmoType} />

      <CollapsibleCard title="Initial ECMO Settings" icon="cogs" open={activeCard === 'initial'} onToggle={(nextOpen) => toggleCard('initial', nextOpen)}>
        <CalcButton title="Calculate Initial Settings" onPress={calcInitialSettings} />
        {initResult && <ResultDisplay result={initResult.text} type={initResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Flow Rate Calculator" icon="tachometer-alt" open={activeCard === 'flow'} onToggle={(nextOpen) => toggleCard('flow', nextOpen)}>
        <Text style={styles.label}>Target Cardiac Index (L/min/m²)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="2.5" value={targetCI} onChangeText={setTargetCI} />
        <Text style={styles.label}>Native Cardiac Output (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="20" value={nativeCO} onChangeText={setNativeCO} />
        <CalcButton title="Calculate Flow Rate" onPress={calcFlowRate} />
        {flowResult && <ResultDisplay result={flowResult.text} type={flowResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Gas Exchange Parameters" icon="wind" open={activeCard === 'gas'} onToggle={(nextOpen) => toggleCard('gas', nextOpen)}>
        <Text style={styles.label}>Current PaCO2 (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="45" value={currentPCO2} onChangeText={setCurrentPCO2} />
        <Text style={styles.label}>Target PaCO2 (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="40" value={targetPCO2} onChangeText={setTargetPCO2} />
        <Text style={styles.label}>Current Sweep Gas (L/min)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="2" value={currentSweep} onChangeText={setCurrentSweep} />
        <Text style={styles.label}>Target PaO2 (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="80" value={targetPO2} onChangeText={setTargetPO2} />
        <CalcButton title="Calculate Gas Settings" onPress={calcGasExchange} />
        {gasResult && <ResultDisplay result={gasResult.text} type={gasResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Anticoagulation Management" icon="syringe" open={activeCard === 'anticoag'} onToggle={(nextOpen) => toggleCard('anticoag', nextOpen)}>
        <Text style={styles.label}>Current ACT (seconds)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="180" value={currentACT} onChangeText={setCurrentACT} />
        <PickerSelect label="Target ACT Range" options={[
          { value: '180-220', label: '180-220 seconds (Standard)' },
          { value: '160-180', label: '160-180 seconds (Low bleeding risk)' },
          { value: '140-160', label: '140-160 seconds (High bleeding risk)' },
        ]} selected={targetACT} onSelect={setTargetACT} />
        <Text style={styles.label}>Current Heparin Rate (units/kg/hr)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="20" value={currentHepRate} onChangeText={setCurrentHepRate} />
        <PickerSelect label="Bleeding Risk" options={[
          { value: 'standard', label: 'Standard Risk' },
          { value: 'high', label: 'High Risk' },
          { value: 'vhigh', label: 'Very High Risk' },
        ]} selected={bleedingRisk} onSelect={setBleedingRisk} />
        <CalcButton title="Calculate Heparin Adjustment" onPress={calcAnticoag} />
        {anticoagResult && <ResultDisplay result={anticoagResult.text} type={anticoagResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Circuit Monitoring Parameters" icon="chart-line" open={activeCard === 'circuit'} onToggle={(nextOpen) => toggleCard('circuit', nextOpen)}>
        <Text style={styles.label}>Pre-Membrane Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="150" value={preMembrane} onChangeText={setPreMembrane} />
        <Text style={styles.label}>Post-Membrane Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="100" value={postMembrane} onChangeText={setPostMembrane} />
        <Text style={styles.label}>Current Flow Rate (L/min)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="4.5" value={circuitFlow} onChangeText={setCircuitFlow} />
        <Text style={styles.label}>RPM</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="3000" value={rpm} onChangeText={setRpm} />
        <CalcButton title="Assess Circuit Parameters" onPress={calcCircuit} />
        {circuitResult && <ResultDisplay result={circuitResult.text} type={circuitResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="ECMO Weaning Assessment" icon="chart-line" open={activeCard === 'weaning'} onToggle={(nextOpen) => toggleCard('weaning', nextOpen)}>
        <PickerSelect label="Current Support Level" options={[
          { value: 'full', label: 'Full Support (>80% CO)' },
          { value: 'partial', label: 'Partial Support (50-80% CO)' },
          { value: 'minimal', label: 'Minimal Support (<50% CO)' },
        ]} selected={supportLevel} onSelect={setSupportLevel} />
        {Object.entries({
          hemodynamics: 'Stable hemodynamics', gasExchange: 'Adequate gas exchange',
          cardiacFunction: 'Improved cardiac function (VA-ECMO)', lungFunction: 'Improved lung function (VV-ECMO)',
          neurologicStatus: 'Stable neurologic status', minimalInotropes: 'Minimal inotropic support',
          adequateVentilation: 'Adequate ventilation settings', coagulationStable: 'Stable coagulation profile',
        }).map(([key, label]) => (
          <CheckboxItem key={key} label={label} checked={weanCriteria[key]} onToggle={() => setWeanCriteria(p => ({ ...p, [key]: !p[key] }))} />
        ))}
        <CalcButton title="Assess Weaning Readiness" onPress={calcWeaning} />
        {weanResult && <ResultDisplay result={weanResult.text} type={weanResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  disclaimer: { backgroundColor: '#d1ecf1', borderColor: '#bee5eb', borderWidth: 1, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md },
  disclaimerRow: { flexDirection: 'row', alignItems: 'flex-start' },
  disclaimerIcon: { marginRight: 8, marginTop: 2 },
  disclaimerText: { color: '#0c5460', fontSize: 13, lineHeight: 19 },
  disclaimerStrong: { fontWeight: '700', color: '#0c5460' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
});
