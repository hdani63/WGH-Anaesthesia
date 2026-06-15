import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';

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

  // Blood Pressure
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [bpResult, setBpResult] = useState(null);

  // Conversions
  const [temperature, setTemperature] = useState('');
  const [tempUnit, setTempUnit] = useState('celsius');
  const [tempResult, setTempResult] = useState(null);

  const [weightConv, setWeightConv] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [weightConvResult, setWeightConvResult] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const calculateBMI = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);

    if (!weight || !height) {
      setBmiResult({ text: 'Please enter weight and height', type: 'warning' });
      return;
    }

    const heightMeters = height / 100;
    const bmi = weight / (heightMeters * heightMeters);

    let category = '';
    let type = 'info';

    if (bmi < 18.5) {
      category = 'Underweight';
      type = 'warning';
    } else if (bmi < 25) {
      category = 'Normal weight';
      type = 'success';
    } else if (bmi < 30) {
      category = 'Overweight';
      type = 'warning';
    } else {
      category = 'Obese';
      type = 'danger';
    }

    setBmiResult({
      text: `BMI: ${bmi.toFixed(1)} kg/m²\nCategory: ${category}\nNormal range: 18.5-24.9 kg/m²`,
      type,
    });
  };

  const calculateBSA = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);

    if (!weight || !height) {
      setBsaResult({ text: 'Please enter weight and height', type: 'warning' });
      return;
    }

    const bsa = Math.sqrt((weight * height) / 3600);
    setBsaResult({
      text: `BSA: ${bsa.toFixed(2)} m²\nMosteller formula: √(weight(kg) × height(cm) / 3600)`,
      type: 'success',
    });
  };

  const calcCalories = () => {
    const weight = parseFloat(patient.weight);
    const height = parseFloat(patient.height);
    const age = parseFloat(patient.age);

    if (!weight || !height || !age) {
      setCalorieResult({ text: 'Please enter weight, height, and age', type: 'warning' });
      return;
    }

    const fact = parseFloat(activityLevel);
    let bmr;
    if (patient.gender === 'male') bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    else bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    const total = bmr * fact;
    setCalorieResult({
      text: `BMR: ${bmr.toFixed(0)} calories/day\nTotal daily calories: ${total.toFixed(0)} calories/day\nHarris-Benedict equation with activity factor`,
      type: 'success',
    });
  };

  const calcFluid = () => {
    const weight = parseFloat(patient.weight);
    if (!weight) {
      setFluidResult({ text: 'Please enter weight', type: 'warning' });
      return;
    }

    let daily;
    let formula = '';

    if (ageGroup === 'pediatric') {
      if (weight <= 10) {
        daily = weight * 100;
        formula = '100 mL/kg for first 10 kg';
      } else if (weight <= 20) {
        daily = 1000 + ((weight - 10) * 50);
        formula = '1000 mL + 50 mL/kg for next 10 kg';
      } else {
        daily = 1500 + ((weight - 20) * 20);
        formula = '1500 mL + 20 mL/kg for each kg >20';
      }
    } else if (ageGroup === 'elderly') {
      daily = weight * 25;
      formula = '25 mL/kg/day (reduced for elderly)';
    } else {
      daily = weight * 30;
      formula = '30 mL/kg/day';
    }

    setFluidResult({
      text: `Daily fluid requirement: ${daily.toFixed(0)} mL/day\nHourly rate: ${(daily / 24).toFixed(1)} mL/hr\n${formula}`,
      type: 'success',
    });
  };

  const assessBloodPressure = () => {
    const sys = parseInt(systolic, 10);
    const dia = parseInt(diastolic, 10);

    if (!sys || !dia) {
      setBpResult({ text: 'Please enter systolic and diastolic BP', type: 'warning' });
      return;
    }

    let category = '';
    let type = 'info';
    let recommendations = '';

    // Severity checked most-severe-first so Hypertensive Crisis is reachable
    // (the web source has these reversed, leaving Crisis unreachable — flagged for fix there).
    if (sys >= 180 || dia >= 120) {
      category = 'Hypertensive Crisis';
      type = 'danger';
      recommendations = 'Immediate medical attention required';
    } else if (sys >= 140 || dia >= 90) {
      category = 'Stage 2 Hypertension';
      type = 'danger';
      recommendations = 'Antihypertensive therapy indicated';
    } else if ((sys >= 130 && sys < 140) || (dia >= 80 && dia < 90)) {
      category = 'Stage 1 Hypertension';
      type = 'warning';
      recommendations = 'Consider antihypertensive therapy';
    } else if (sys < 130 && dia < 80 && sys >= 120) {
      category = 'Elevated';
      type = 'warning';
      recommendations = 'Lifestyle modifications recommended';
    } else {
      category = 'Normal';
      type = 'success';
      recommendations = 'Maintain healthy lifestyle';
    }

    setBpResult({
      text: `BP: ${sys}/${dia} mmHg\nCategory: ${category}\n${recommendations}`,
      type,
    });
  };

  const convertTemperature = () => {
    const temp = parseFloat(temperature);
    if (!temp) {
      setTempResult({ text: 'Please enter temperature', type: 'warning' });
      return;
    }

    let converted;
    let result;
    if (tempUnit === 'celsius') {
      converted = (temp * 9) / 5 + 32;
      result = `${temp}°C = ${converted.toFixed(1)}°F`;
    } else {
      converted = ((temp - 32) * 5) / 9;
      result = `${temp}°F = ${converted.toFixed(1)}°C`;
    }

    setTempResult({ text: result, type: 'success' });
  };

  const convertWeight = () => {
    const w = parseFloat(weightConv);
    if (!w) {
      setWeightConvResult({ text: 'Please enter weight', type: 'warning' });
      return;
    }

    let converted;
    let result;
    if (weightUnit === 'kg') {
      converted = w * 2.20462;
      result = `${w} kg = ${converted.toFixed(1)} lbs`;
    } else {
      converted = w / 2.20462;
      result = `${w} lbs = ${converted.toFixed(1)} kg`;
    }

    setWeightConvResult({ text: result, type: 'success' });
  };

  return (
    <ScreenWrapper title="General Medical Calculators" subtitle="Common medical calculations and clinical assessment tools">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="BMI Calculator" icon="weight" open={activeCard === 'bmi'} onToggle={(nextOpen) => toggleCard('bmi', nextOpen)}>
        <CalcButton title="Calculate BMI" onPress={calculateBMI} />
        {bmiResult && <ResultDisplay result={bmiResult.text} type={bmiResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Body Surface Area (BSA)" icon="ruler" open={activeCard === 'bsa'} onToggle={(nextOpen) => toggleCard('bsa', nextOpen)}>
        <CalcButton title="Calculate BSA" onPress={calculateBSA} />
        {bsaResult && <ResultDisplay result={bsaResult.text} type={bsaResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Daily Fluid Requirements" icon="tint" open={activeCard === 'fluid'} onToggle={(nextOpen) => toggleCard('fluid', nextOpen)}>
        <PickerSelect label="Age Group" options={[
          { value: 'adult', label: 'Adult' }, { value: 'pediatric', label: 'Pediatric' }, { value: 'elderly', label: 'Elderly (>65 years)' },
        ]} selected={ageGroup} onSelect={setAgeGroup} />
        <CalcButton title="Calculate Fluid Needs" onPress={calcFluid} />
        {fluidResult && <ResultDisplay result={fluidResult.text} type={fluidResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Caloric Requirements (Harris-Benedict)" icon="fire" open={activeCard === 'calories'} onToggle={(nextOpen) => toggleCard('calories', nextOpen)}>
        <PickerSelect label="Activity Level" options={[
          { value: '1.2', label: 'Sedentary (little/no exercise)' },
          { value: '1.375', label: 'Lightly active (light exercise 1-3 days/week)' },
          { value: '1.55', label: 'Moderately active (moderate exercise 3-5 days/week)' },
          { value: '1.725', label: 'Very active (hard exercise 6-7 days/week)' },
          { value: '1.9', label: 'Super active (very hard exercise, physical job)' },
        ]} selected={activityLevel} onSelect={setActivityLevel} />
        <CalcButton title="Calculate Caloric Needs" onPress={calcCalories} />
        {calorieResult && <ResultDisplay result={calorieResult.text} type={calorieResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Blood Pressure Assessment" icon="heartbeat" open={activeCard === 'bp'} onToggle={(nextOpen) => toggleCard('bp', nextOpen)}>
        <View style={styles.field}>
          <Text style={styles.label}>Systolic BP (mmHg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="120"
            value={systolic}
            onChangeText={setSystolic}
          />
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Diastolic BP (mmHg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="80"
            value={diastolic}
            onChangeText={setDiastolic}
          />
        </View>
        <CalcButton title="Assess Blood Pressure" onPress={assessBloodPressure} />
        {bpResult && <ResultDisplay result={bpResult.text} type={bpResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Medical Unit Conversions" icon="exchange-alt" open={activeCard === 'conversion'} onToggle={(nextOpen) => toggleCard('conversion', nextOpen)}>
        <Text style={styles.subheading}>Temperature Conversion</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Temperature</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="37"
            value={temperature}
            onChangeText={setTemperature}
          />
        </View>
        <PickerSelect options={[
          { value: 'celsius', label: 'Celsius' }, { value: 'fahrenheit', label: 'Fahrenheit' },
        ]} selected={tempUnit} onSelect={setTempUnit} />
        <CalcButton title="Convert" onPress={convertTemperature} />
        {tempResult && <ResultDisplay result={tempResult.text} type={tempResult.type} />}

        <Text style={[styles.subheading, styles.subheadingSpaced]}>Weight Conversion</Text>
        <View style={styles.field}>
          <Text style={styles.label}>Weight</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="70"
            value={weightConv}
            onChangeText={setWeightConv}
          />
        </View>
        <PickerSelect options={[
          { value: 'kg', label: 'Kilograms' }, { value: 'lbs', label: 'Pounds' },
        ]} selected={weightUnit} onSelect={setWeightUnit} />
        <CalcButton title="Convert" onPress={convertWeight} />
        {weightConvResult && <ResultDisplay result={weightConvResult.text} type={weightConvResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: COLORS.white,
  },
  subheading: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  subheadingSpaced: {
    marginTop: SPACING.md,
  },
});
