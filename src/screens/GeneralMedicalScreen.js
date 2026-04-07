import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function GeneralMedicalScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  const [bmiResult, setBmiResult] = useState(null);
  const [bsaResult, setBsaResult] = useState(null);

  // Fluid
  const [ageGroup, setAgeGroup] = useState('adult');
  const [fluidResult, setFluidResult] = useState(null);

  // Calories
  const [activityLevel, setActivityLevel] = useState('1.2');
  const [calorieResult, setCalorieResult] = useState(null);

  // BP
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bpResult, setBpResult] = useState(null);

  // Temp
  const [tempVal, setTempVal] = useState('');
  const [tempUnit, setTempUnit] = useState('celsius');
  const [tempResult, setTempResult] = useState(null);

  // Weight
  const [weightVal, setWeightVal] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [weightResult, setWeightResult] = useState(null);

  const p = Calc.getPatientValues(patient);

  const calcCalories = () => {
    const fact = parseFloat(activityLevel);
    let bmr;
    if (p.gender === 'male') bmr = 88.362 + (13.397 * p.weight) + (4.799 * p.height) - (5.677 * p.age);
    else bmr = 447.593 + (9.247 * p.weight) + (3.098 * p.height) - (4.330 * p.age);
    const total = bmr * fact;
    setCalorieResult({ text: `BMR: ${bmr.toFixed(0)} kcal/day\nTotal (×${fact}): ${total.toFixed(0)} kcal/day`, type: 'success' });
  };

  const calcFluid = () => {
    let daily;
    if (ageGroup === 'pediatric') {
      if (p.weight <= 10) daily = p.weight * 100;
      else if (p.weight <= 20) daily = 1000 + (p.weight - 10) * 50;
      else daily = 1500 + (p.weight - 20) * 20;
    } else if (ageGroup === 'elderly') {
      daily = p.weight * 25;
    } else {
      daily = p.weight * 30;
    }
    setFluidResult({ text: `Daily requirement: ${daily.toFixed(0)} mL/day\nHourly rate: ${(daily / 24).toFixed(0)} mL/hr`, type: 'success' });
  };

  return (
    <ScreenWrapper title="General Medical" subtitle="BMI, BSA, fluids, conversions and more">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="BMI Calculator" icon="weight">
        <CalcButton title="Calculate BMI" onPress={() => setBmiResult(Calc.calculateBMI(patient.weight, patient.height))} />
        {bmiResult && <ResultDisplay result={bmiResult.text} type={bmiResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Body Surface Area (BSA)" icon="ruler">
        <CalcButton title="Calculate BSA" onPress={() => setBsaResult(Calc.calculateBSA(patient.weight, patient.height, 'mosteller'))} />
        {bsaResult && <ResultDisplay result={bsaResult.text} type={bsaResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Daily Fluid Requirements" icon="tint">
        <PickerSelect label="Age Group" options={[
          { value: 'adult', label: 'Adult' }, { value: 'pediatric', label: 'Pediatric' }, { value: 'elderly', label: 'Elderly (>65)' },
        ]} selected={ageGroup} onSelect={setAgeGroup} />
        <CalcButton title="Calculate Fluids" onPress={calcFluid} />
        {fluidResult && <ResultDisplay result={fluidResult.text} type={fluidResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Caloric Requirements (Harris-Benedict)" icon="fire">
        <PickerSelect label="Activity Level" options={[
          { value: '1.2', label: '1.2 — Sedentary' }, { value: '1.375', label: '1.375 — Lightly active' },
          { value: '1.55', label: '1.55 — Moderately active' }, { value: '1.725', label: '1.725 — Very active' },
          { value: '1.9', label: '1.9 — Super active' },
        ]} selected={activityLevel} onSelect={setActivityLevel} />
        <CalcButton title="Calculate Calories" onPress={calcCalories} />
        {calorieResult && <ResultDisplay result={calorieResult.text} type={calorieResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Blood Pressure Assessment" icon="heartbeat">
        <Text style={styles.label}>Systolic BP (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="120" value={systolic} onChangeText={setSystolic} />
        <Text style={styles.label}>Diastolic BP (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="80" value={diastolic} onChangeText={setDiastolic} />
        <CalcButton title="Assess BP" onPress={() => setBpResult(Calc.assessBloodPressure(systolic, diastolic))} />
        {bpResult && <ResultDisplay result={bpResult.text} type={bpResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Unit Conversions" icon="sync">
        <Text style={styles.sectionTitle}>Temperature</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="37" value={tempVal} onChangeText={setTempVal} />
        <PickerSelect label="Unit" options={[
          { value: 'celsius', label: 'Celsius → Fahrenheit' }, { value: 'fahrenheit', label: 'Fahrenheit → Celsius' },
        ]} selected={tempUnit} onSelect={setTempUnit} />
        <CalcButton title="Convert" onPress={() => setTempResult(Calc.convertTemperature(tempVal, tempUnit))} />
        {tempResult && <ResultDisplay result={tempResult.text} type={tempResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Weight</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={weightVal} onChangeText={setWeightVal} />
        <PickerSelect label="Unit" options={[
          { value: 'kg', label: 'kg → lbs' }, { value: 'lbs', label: 'lbs → kg' },
        ]} selected={weightUnit} onSelect={setWeightUnit} />
        <CalcButton title="Convert" onPress={() => setWeightResult(Calc.convertWeightUnit(weightVal, weightUnit))} />
        {weightResult && <ResultDisplay result={weightResult.text} type={weightResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
});
