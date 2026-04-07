import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function DrugDosingScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // Drip Rate
  const [volume, setVolume] = useState('');
  const [infusionTime, setInfusionTime] = useState('');
  const [dropFactor, setDropFactor] = useState('20');
  const [dripResult, setDripResult] = useState(null);

  // Insulin
  const [glucose, setGlucose] = useState('');
  const [targetGlucose, setTargetGlucose] = useState('120');
  const [isf, setIsf] = useState('50');
  const [carbRatio, setCarbRatio] = useState('15');
  const [carbs, setCarbs] = useState('');
  const [insulinResult, setInsulinResult] = useState(null);

  // Heparin
  const [hepIndication, setHepIndication] = useState('dvt_pe');
  const [hepResult, setHepResult] = useState(null);

  // Chemo BSA
  const [drugDose, setDrugDose] = useState('');
  const [doseReduction, setDoseReduction] = useState('0');
  const [chemoResult, setChemoResult] = useState(null);

  // Pediatric
  const [pedDrug, setPedDrug] = useState('acetaminophen');
  const [pedRoute, setPedRoute] = useState('oral');
  const [pedResult, setPedResult] = useState(null);

  // Unit conversions
  const [mcgVal, setMcgVal] = useState('');
  const [mcgResult, setMcgResult] = useState(null);
  const [unitsVal, setUnitsVal] = useState('');
  const [concentration, setConcentration] = useState('100');
  const [unitsResult, setUnitsResult] = useState(null);

  const p = Calc.getPatientValues(patient);

  const calcChemo = () => {
    const bsa = Math.sqrt((p.weight * p.height) / 3600);
    const total = parseFloat(drugDose) * bsa * (1 - parseFloat(doseReduction) / 100);
    setChemoResult({ text: `BSA: ${bsa.toFixed(2)} m²\nDose: ${total.toFixed(1)} mg (after ${doseReduction}% reduction)`, type: 'success' });
  };

  const calcPedDose = () => {
    const doses = {
      acetaminophen: { oral: { min: 10, max: 15, freq: 'q4-6h', maxDaily: 'Max 5 doses/24h' }, iv: { min: 10, max: 15, freq: 'q6h', maxDaily: 'Max 4g/day' } },
      ibuprofen: { oral: { min: 5, max: 10, freq: 'q6-8h', maxDaily: 'Max 40 mg/kg/day' } },
      amoxicillin: { oral: { min: 20, max: 40, freq: 'q8h', maxDaily: 'Max 500 mg/dose' } },
      prednisolone: { oral: { min: 1, max: 2, freq: 'daily or BID', maxDaily: 'Max 60 mg/day' } },
    };
    const drugInfo = doses[pedDrug]?.[pedRoute] || doses[pedDrug]?.oral;
    if (!drugInfo) { setPedResult({ text: 'Route not available for selected drug', type: 'warning' }); return; }
    const minDose = p.weight * drugInfo.min;
    const maxDose = p.weight * drugInfo.max;
    setPedResult({ text: `${pedDrug} (${pedRoute}):\nDose range: ${minDose.toFixed(1)} - ${maxDose.toFixed(1)} mg\nFrequency: ${drugInfo.freq}\n${drugInfo.maxDaily}`, type: 'success' });
  };

  const calcMcgConv = () => {
    const v = parseFloat(mcgVal);
    const mgPerHr = (v * p.weight * 60) / 1000;
    setMcgResult({ text: `${v} mcg/kg/min = ${mgPerHr.toFixed(2)} mg/hr\n(Weight: ${p.weight} kg)`, type: 'success' });
  };

  const calcUnitsConv = () => {
    const u = parseFloat(unitsVal);
    const c = parseFloat(concentration);
    const mlPerHr = (u * p.weight) / c;
    setUnitsResult({ text: `${u} units/kg/hr = ${mlPerHr.toFixed(2)} mL/hr\n(Concentration: ${c} units/mL, Weight: ${p.weight} kg)`, type: 'success' });
  };

  return (
    <ScreenWrapper title="Drug Dosing Calculators" subtitle="IV drip rates, insulin, heparin, and more">
      <View style={styles.disclaimer}>
        <View style={styles.disclaimerRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.disclaimerIcon} />
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerStrong}>Medical Disclaimer: </Text>
            These calculators are for reference only. Always verify dosing with current guidelines and consider individual patient factors.
          </Text>
        </View>
      </View>
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="IV Drip Rate Calculator" icon="tint">
        <Text style={styles.label}>Volume to Infuse (mL)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="1000" value={volume} onChangeText={setVolume} />
        <Text style={styles.label}>Time Duration (hours)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="8" value={infusionTime} onChangeText={setInfusionTime} />
        <PickerSelect label="Drop Factor (gtts/mL)" options={[
          { value: '10', label: '10 — Macrodrip' }, { value: '15', label: '15 — Macrodrip' },
          { value: '20', label: '20 — Macrodrip' }, { value: '60', label: '60 — Microdrip' },
        ]} selected={dropFactor} onSelect={setDropFactor} />
        <CalcButton title="Calculate Drip Rate" onPress={() => setDripResult(Calc.calculateDripRate(volume, infusionTime, dropFactor))} />
        {dripResult && <ResultDisplay result={dripResult.text} type={dripResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Insulin Dosing Calculator" icon="syringe">
        <Text style={styles.label}>Blood Glucose (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="180" value={glucose} onChangeText={setGlucose} />
        <Text style={styles.label}>Target Glucose (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="120" value={targetGlucose} onChangeText={setTargetGlucose} />
        <Text style={styles.label}>Insulin Sensitivity Factor</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="50" value={isf} onChangeText={setIsf} />
        <Text style={styles.label}>Carbohydrate Ratio</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="15" value={carbRatio} onChangeText={setCarbRatio} />
        <Text style={styles.label}>Carbohydrates (grams)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="45" value={carbs} onChangeText={setCarbs} />
        <CalcButton title="Calculate Insulin" onPress={() => setInsulinResult(Calc.calculateInsulin(glucose, targetGlucose, isf, carbRatio, carbs))} />
        {insulinResult && <ResultDisplay result={insulinResult.text} type={insulinResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Heparin Dosing Protocol" icon="heartbeat">
        <PickerSelect label="Indication" options={[
          { value: 'dvt_pe', label: 'DVT/PE Treatment' }, { value: 'acs', label: 'Acute Coronary Syndrome' },
          { value: 'afib', label: 'Atrial Fibrillation' }, { value: 'prophylaxis', label: 'VTE Prophylaxis' },
        ]} selected={hepIndication} onSelect={setHepIndication} />
        <CalcButton title="Calculate Heparin" onPress={() => setHepResult(Calc.calculateHeparin(patient.weight, hepIndication))} />
        {hepResult && <ResultDisplay result={hepResult.text} type={hepResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Chemotherapy BSA Dosing" icon="vial">
        <Text style={styles.label}>Drug Dose (mg/m²)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="100" value={drugDose} onChangeText={setDrugDose} />
        <Text style={styles.label}>Dose Reduction (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={doseReduction} onChangeText={setDoseReduction} />
        <CalcButton title="Calculate Dose" onPress={calcChemo} />
        {chemoResult && <ResultDisplay result={chemoResult.text} type={chemoResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Pediatric Dosing" icon="baby">
        <PickerSelect label="Drug" options={[
          { value: 'acetaminophen', label: 'Acetaminophen' }, { value: 'ibuprofen', label: 'Ibuprofen' },
          { value: 'amoxicillin', label: 'Amoxicillin' }, { value: 'prednisolone', label: 'Prednisolone' },
        ]} selected={pedDrug} onSelect={setPedDrug} />
        <PickerSelect label="Route" options={[
          { value: 'oral', label: 'Oral' }, { value: 'iv', label: 'IV' }, { value: 'im', label: 'IM' },
        ]} selected={pedRoute} onSelect={setPedRoute} />
        <CalcButton title="Calculate Dose" onPress={calcPedDose} />
        {pedResult && <ResultDisplay result={pedResult.text} type={pedResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Dosing Unit Conversions" icon="sync">
        <Text style={styles.sectionTitle}>mcg/kg/min → mg/hr</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="5" value={mcgVal} onChangeText={setMcgVal} />
        <CalcButton title="Convert" onPress={calcMcgConv} />
        {mcgResult && <ResultDisplay result={mcgResult.text} type={mcgResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>units/kg → mL/hr</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="1" value={unitsVal} onChangeText={setUnitsVal} />
        <Text style={styles.label}>Concentration (units/mL)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="100" value={concentration} onChangeText={setConcentration} />
        <CalcButton title="Convert" onPress={calcUnitsConv} />
        {unitsResult && <ResultDisplay result={unitsResult.text} type={unitsResult.type} />}
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
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
});
