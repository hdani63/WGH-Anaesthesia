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
  const [hepIndication, setHepIndication] = useState('dvt');
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

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const calculateDripRate = () => {
    const vol = parseFloat(volume);
    const time = parseFloat(infusionTime);
    const df = parseInt(dropFactor, 10);

    if (!vol || !time) {
      setDripResult({ text: 'Please enter volume and time', type: 'warning' });
      return;
    }

    const mlPerHour = vol / time;
    const mlPerMin = mlPerHour / 60;
    const dropsPerMin = mlPerMin * df;

    setDripResult({
      text: `Flow Rate: ${mlPerHour.toFixed(1)} mL/hr\nDrip Rate: ${dropsPerMin.toFixed(0)} gtts/min\nVolume: ${vol} mL over ${time} hours`,
      type: 'success',
    });
  };

  const calculateInsulin = () => {
    const currentBG = parseFloat(glucose);
    const targetBG = parseFloat(targetGlucose);
    const sensitivity = parseFloat(isf);
    const carbsValue = parseFloat(carbs) || 0;
    const carbRatioValue = parseFloat(carbRatio);

    if (!currentBG || !targetBG || !sensitivity) {
      setInsulinResult({ text: 'Please enter required glucose and sensitivity values', type: 'warning' });
      return;
    }

    const correctionDose = Math.max(0, (currentBG - targetBG) / sensitivity);
    const mealDose = carbRatioValue && carbsValue ? carbsValue / carbRatioValue : 0;
    const totalDose = correctionDose + mealDose;

    setInsulinResult({
      text: `Total Insulin: ${totalDose.toFixed(1)} units\nCorrection dose: ${correctionDose.toFixed(1)} units\nMeal dose: ${mealDose.toFixed(1)} units\nCurrent BG: ${currentBG} mg/dL, Target: ${targetBG} mg/dL`,
      type: 'success',
    });
  };

  const calculateHeparin = () => {
    const weight = parseFloat(patient.weight);

    if (!weight) {
      setHepResult({ text: 'Please enter patient weight', type: 'warning' });
      return;
    }

    let bolus = 0;
    let infusion = 0;
    let protocol = '';

    switch (hepIndication) {
      case 'dvt':
        bolus = weight * 80;
        infusion = weight * 18;
        protocol = 'DVT/PE Treatment Protocol';
        break;
      case 'acs':
        bolus = Math.min(weight * 60, 4000);
        infusion = weight * 12;
        protocol = 'ACS Protocol';
        break;
      case 'af':
        bolus = weight * 70;
        infusion = weight * 15;
        protocol = 'Atrial Fibrillation Protocol';
        break;
      case 'prophylaxis':
        bolus = 0;
        infusion = 0;
        protocol = 'Prophylactic dosing: 5000 units SC q8-12h';
        break;
      default:
        protocol = 'DVT/PE Treatment Protocol';
        bolus = weight * 80;
        infusion = weight * 18;
    }

    if (bolus > 0) {
      setHepResult({
        text: `${protocol}\nBolus: ${bolus.toFixed(0)} units IV\nInfusion: ${infusion.toFixed(0)} units/hr\nCheck aPTT in 6 hours, target 1.5-2.5 x control`,
        type: 'success',
      });
      return;
    }

    setHepResult({ text: `${protocol}\n${protocol}`, type: 'success' });
  };

  const calcChemo = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);
    const dosePerM2 = parseFloat(drugDose);
    const reduction = parseFloat(doseReduction) || 0;

    if (!weight || !height || !dosePerM2) {
      setChemoResult({ text: 'Please enter weight, height, and drug dose', type: 'warning' });
      return;
    }

    const bsa = Math.sqrt((weight * height) / 3600);
    let totalDose = dosePerM2 * bsa;
    if (reduction > 0) {
      totalDose *= (1 - reduction / 100);
    }

    const reductionLine = reduction > 0 ? `\nDose Reduction: ${reduction}%` : '';
    setChemoResult({
      text: `BSA: ${bsa.toFixed(2)} m²\nTotal Dose: ${totalDose.toFixed(1)} mg${reductionLine}\nStandard dose: ${dosePerM2} mg/m²`,
      type: 'success',
    });
  };

  const calcPedDose = () => {
    const weight = parseFloat(patient.weight);
    if (!weight) {
      setPedResult({ text: 'Please enter patient weight', type: 'warning' });
      return;
    }

    const doses = {
      acetaminophen: { oral: { min: 10, max: 15, freq: 'q4-6h', maxDaily: 'Max 5 doses/24h' }, iv: { min: 10, max: 15, freq: 'q6h', maxDaily: 'Max 4g/day' } },
      ibuprofen: { oral: { min: 5, max: 10, freq: 'q6-8h', maxDaily: 'Max 40 mg/kg/day' } },
      amoxicillin: { oral: { min: 20, max: 40, freq: 'q8h', maxDaily: 'Max 500 mg/dose' } },
      prednisolone: { oral: { min: 1, max: 2, freq: 'daily or BID', maxDaily: 'Max 60 mg/day' } },
    };
    const drugInfo = doses[pedDrug]?.[pedRoute];

    const capitalize = (value) => value.charAt(0).toUpperCase() + value.slice(1);

    if (!drugInfo) {
      setPedResult({
        text: `${capitalize(pedDrug)} (${pedRoute})\nDose:  \n`,
        type: 'success',
      });
      return;
    }

    const minDose = (weight * drugInfo.min).toFixed(drugInfo.min === 1 || drugInfo.max === 2 ? 1 : 0);
    const maxDose = (weight * drugInfo.max).toFixed(drugInfo.min === 1 || drugInfo.max === 2 ? 1 : 0);

    setPedResult({
      text: `${capitalize(pedDrug)} (${pedRoute})\nDose: ${minDose}-${maxDose} mg ${drugInfo.freq}\n${drugInfo.maxDaily}`,
      type: 'success',
    });
  };

  const calcMcgConv = () => {
    const weight = parseFloat(patient.weight);
    const v = parseFloat(mcgVal);

    if (!weight || !v) {
      setMcgResult({ text: 'Please enter weight and dose', type: 'warning' });
      return;
    }

    const mgPerHr = (v * weight * 60) / 1000;
    setMcgResult({ text: `${v} mcg/kg/min = ${mgPerHr.toFixed(2)} mg/hr\nFor ${weight} kg patient`, type: 'success' });
  };

  const calcUnitsConv = () => {
    const weight = parseFloat(patient.weight);
    const u = parseFloat(unitsVal);
    const c = parseFloat(concentration);

    if (!weight || !u || !c) {
      setUnitsResult({ text: 'Please enter all values', type: 'warning' });
      return;
    }

    const totalUnitsPerHour = u * weight;
    const mlPerHr = totalUnitsPerHour / c;
    setUnitsResult({ text: `${u} units/kg/hr = ${mlPerHr.toFixed(1)} mL/hr\nTotal: ${totalUnitsPerHour.toFixed(0)} units/hr at ${c} units/mL`, type: 'success' });
  };

  return (
    <ScreenWrapper title="Drug Dosing Calculators" subtitle="Common medication dosing calculations and conversions">
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

      <CollapsibleCard title="IV Drip Rate Calculator" icon="tint" open={activeCard === 'drip'} onToggle={(nextOpen) => toggleCard('drip', nextOpen)}>
        <Text style={styles.label}>Volume to Infuse (mL)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="1000" value={volume} onChangeText={setVolume} />
        <Text style={styles.label}>Time Duration (hours)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="8" value={infusionTime} onChangeText={setInfusionTime} />
        <PickerSelect label="Drop Factor (gtts/mL)" options={[
          { value: '10', label: 'Macrodrip - 10 gtts/mL' }, { value: '15', label: 'Macrodrip - 15 gtts/mL' },
          { value: '20', label: 'Macrodrip - 20 gtts/mL' }, { value: '60', label: 'Microdrip - 60 gtts/mL' },
        ]} selected={dropFactor} onSelect={setDropFactor} />
        <CalcButton title="Calculate Drip Rate" onPress={calculateDripRate} />
        {dripResult && <ResultDisplay result={dripResult.text} type={dripResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Insulin Dosing Calculator" icon="syringe" open={activeCard === 'insulin'} onToggle={(nextOpen) => toggleCard('insulin', nextOpen)}>
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
        <CalcButton title="Calculate Insulin Dose" onPress={calculateInsulin} />
        {insulinResult && <ResultDisplay result={insulinResult.text} type={insulinResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Heparin Dosing Protocol" icon="heartbeat" open={activeCard === 'heparin'} onToggle={(nextOpen) => toggleCard('heparin', nextOpen)}>
        <PickerSelect label="Indication" options={[
          { value: 'dvt', label: 'DVT/PE Treatment' }, { value: 'acs', label: 'Acute Coronary Syndrome' },
          { value: 'af', label: 'Atrial Fibrillation' }, { value: 'prophylaxis', label: 'VTE Prophylaxis' },
        ]} selected={hepIndication} onSelect={setHepIndication} />
        <CalcButton title="Calculate Heparin Protocol" onPress={calculateHeparin} />
        {hepResult && <ResultDisplay result={hepResult.text} type={hepResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Chemotherapy BSA Dosing" icon="flask" open={activeCard === 'chemo'} onToggle={(nextOpen) => toggleCard('chemo', nextOpen)}>
        <Text style={styles.label}>Drug Dose (mg/m²)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="100" value={drugDose} onChangeText={setDrugDose} />
        <Text style={styles.label}>Dose Reduction (%)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="0" value={doseReduction} onChangeText={setDoseReduction} />
        <CalcButton title="Calculate Chemotherapy Dose" onPress={calcChemo} />
        {chemoResult && <ResultDisplay result={chemoResult.text} type={chemoResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Pediatric Dosing Calculations" icon="baby" open={activeCard === 'pediatric'} onToggle={(nextOpen) => toggleCard('pediatric', nextOpen)}>
        <PickerSelect label="Drug" options={[
          { value: 'acetaminophen', label: 'Acetaminophen' }, { value: 'ibuprofen', label: 'Ibuprofen' },
          { value: 'amoxicillin', label: 'Amoxicillin' }, { value: 'prednisolone', label: 'Prednisolone' },
        ]} selected={pedDrug} onSelect={setPedDrug} />
        <PickerSelect label="Route" options={[
          { value: 'oral', label: 'Oral' }, { value: 'iv', label: 'Intravenous' }, { value: 'im', label: 'Intramuscular' },
        ]} selected={pedRoute} onSelect={setPedRoute} />
        <CalcButton title="Calculate Pediatric Dose" onPress={calcPedDose} />
        {pedResult && <ResultDisplay result={pedResult.text} type={pedResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Dosing Unit Conversions" icon="exchange-alt" open={activeCard === 'conversion'} onToggle={(nextOpen) => toggleCard('conversion', nextOpen)}>
        <Text style={styles.sectionTitle}>mcg/kg/min to mg/hr</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="5" value={mcgVal} onChangeText={setMcgVal} />
        <CalcButton title="Convert" onPress={calcMcgConv} />
        {mcgResult && <ResultDisplay result={mcgResult.text} type={mcgResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Units/kg to mL/hr</Text>
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
