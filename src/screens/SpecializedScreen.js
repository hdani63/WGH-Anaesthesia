import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect, CheckboxItem } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';

export default function SpecializedScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // Pediatric
  const [pedAge, setPedAge] = useState('');
  const [pedWeightResult, setPedWeightResult] = useState(null);
  const [pedVitalsResult, setPedVitalsResult] = useState(null);

  // Obstetric - Bishop
  const [bishop, setBishop] = useState({ dilation: '0', effacement: '0', station: '0' });
  const [bishopResult, setBishopResult] = useState(null);

  // Gestational Age
  const [gestAge, setGestAge] = useState('');
  const [gestResult, setGestResult] = useState(null);

  // Frailty
  const [frailty, setFrailty] = useState('1');
  const [frailtyResult, setFrailtyResult] = useState(null);

  // Fall Risk
  const [falls, setFalls] = useState({ previous: false, gait: false, polypharmacy: false, cognitive: false });
  const [fallResult, setFallResult] = useState(null);

  // CPP
  const [mapNeuro, setMapNeuro] = useState('');
  const [icp, setIcp] = useState('');
  const [cppResult, setCppResult] = useState(null);

  // Cardiac
  const [bsa, setBsa] = useState('');
  const [crossClampTime, setCrossClampTime] = useState('');
  const [cpbResult, setCpbResult] = useState(null);
  const [crossClampResult, setCrossClampResult] = useState(null);

  // GCS
  const [gcsState, setGcsState] = useState({ eye: '4', verbal: '5', motor: '6' });
  const [gcsResult, setGcsResult] = useState(null);

  const [activeCard, setActiveCard] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const calculatePediatricWeight = (age) => {
    const a = parseInt(age, 10);
    if (!a) return { text: 'Please enter age', type: 'warning' };

    const estimatedWeight = (a * 2) + 8;
    return {
      text: `Estimated Weight: ${estimatedWeight} kg\nFormula: (Age × 2) + 8 kg\nAlways verify with actual weight when possible`,
      type: 'success',
    };
  };

  const assessGestationalAge = (weeks) => {
    const w = parseInt(weeks, 10);
    if (!w) return { text: 'Please enter gestational age', type: 'warning' };

    if (w < 28) {
      return {
        text: `${w} weeks: Extremely preterm\nHigh-risk pregnancy, specialized care required`,
        type: 'danger',
      };
    }
    if (w < 32) {
      return {
        text: `${w} weeks: Very preterm\nPreterm delivery risk, monitor closely`,
        type: 'danger',
      };
    }
    if (w < 37) {
      return {
        text: `${w} weeks: Preterm\nConsider steroid administration, prepare for preterm delivery`,
        type: 'warning',
      };
    }
    if (w <= 42) {
      return {
        text: `${w} weeks: Term\nNormal gestational age range`,
        type: 'success',
      };
    }

    return {
      text: `${w} weeks: Post-term\nConsider induction of labor`,
      type: 'warning',
    };
  };

  const calcBishop = () => {
    const total = Object.values(bishop).reduce((s, v) => s + (parseInt(v) || 0), 0);

    if (total >= 8) {
      return {
        text: `Bishop Score: ${total}/9\nFavorable cervix - high success rate for induction\n3-parameter score (dilation, effacement, station). Full 5-parameter score adds consistency & position (max 13).`,
        type: 'success',
      };
    }
    if (total >= 5) {
      return {
        text: `Bishop Score: ${total}/9\nModerately favorable cervix\n3-parameter score (dilation, effacement, station). Full 5-parameter score adds consistency & position (max 13).`,
        type: 'warning',
      };
    }

    return {
      text: `Bishop Score: ${total}/9\nUnfavorable cervix - consider cervical ripening\n3-parameter score (dilation, effacement, station). Full 5-parameter score adds consistency & position (max 13).`,
      type: 'warning',
    };
  };

  const assessFrailtyScale = (val) => {
    const v = parseInt(val);
    if (!v) return { text: 'Please select frailty scale', type: 'warning' };
    let interpretation = '';
    let recommendations = '';
    let type = 'info';

    if (v <= 3) {
      interpretation = 'Not frail';
      recommendations = 'Standard perioperative care';
      type = 'success';
    } else if (v <= 5) {
      interpretation = 'Pre-frail to mildly frail';
      recommendations = 'Enhanced recovery protocols, multidisciplinary care';
      type = 'warning';
    } else if (v <= 7) {
      interpretation = 'Moderately to severely frail';
      recommendations = 'High-risk surgery, consider conservative management';
      type = 'danger';
    } else {
      interpretation = 'Very severely frail or terminally ill';
      recommendations = 'Palliative care approach, avoid elective surgery';
      type = 'danger';
    }

    return {
      text: `Clinical Frailty Scale: ${v}\n${interpretation}\n${recommendations}`,
      type,
    };
  };

  const assessFallRisk = () => {
    const count = Object.values(falls).filter(Boolean).length;
    if (count === 0) return { text: 'Fall Risk Score: 0/4\nLow fall risk\nStandard precautions', type: 'success' };
    if (count <= 2) return { text: `Fall Risk Score: ${count}/4\nModerate fall risk\nFall prevention measures, consider physical therapy`, type: 'warning' };
    return { text: `Fall Risk Score: ${count}/4\nHigh fall risk\nIntensive fall prevention, bed alarm, frequent monitoring`, type: 'danger' };
  };

  const calculateCPB = () => {
    if (!bsa) return { text: 'Please enter BSA', type: 'warning' };
    const b = parseFloat(bsa);
    const flow = b * 2.4;
    const prime = b * 700;
    return {
      text: `CPB Flow Target: ${flow.toFixed(1)} L/min\nEstimated Prime Volume: ${prime.toFixed(0)} mL`,
      type: 'success',
    };
  };

  const assessCrossClamp = () => {
    if (!crossClampTime) return { text: 'Please enter cross-clamp time', type: 'warning' };
    const t = parseFloat(crossClampTime);
    if (t < 60) return { text: `${t} min\nLow risk cross-clamp duration`, type: 'success' };
    if (t <= 120) return { text: `${t} min\nModerate risk - optimize myocardial protection`, type: 'warning' };
    return { text: `${t} min\nHigh risk - prolonged ischemic time`, type: 'danger' };
  };

  const showPediatricVitals = () => {
    const a = parseFloat(patient.age);
    if (!a && a !== 0) return { text: 'Please enter patient age', type: 'warning' };

    if (a < 1) {
      return {
        text: 'Neonate/Infant (0-12 months):\nHR: 100-160 bpm\nRR: 30-60 /min\nSBP: 60-90 mmHg\nDBP: 30-60 mmHg',
        type: 'info',
      };
    }
    if (a < 3) {
      return {
        text: 'Toddler (1-3 years):\nHR: 90-150 bpm\nRR: 24-40 /min\nSBP: 80-110 mmHg\nDBP: 50-80 mmHg',
        type: 'info',
      };
    }
    if (a < 6) {
      return {
        text: 'Preschooler (3-6 years):\nHR: 80-140 bpm\nRR: 22-34 /min\nSBP: 90-110 mmHg\nDBP: 50-80 mmHg',
        type: 'info',
      };
    }
    if (a < 12) {
      return {
        text: 'School Age (6-12 years):\nHR: 70-120 bpm\nRR: 18-30 /min\nSBP: 90-120 mmHg\nDBP: 60-80 mmHg',
        type: 'info',
      };
    }

    return {
      text: 'Adolescent (12+ years):\nHR: 60-100 bpm\nRR: 12-20 /min\nSBP: 100-130 mmHg\nDBP: 60-85 mmHg',
      type: 'info',
    };
  };

  const calculateCPP = () => {
    if (!mapNeuro || !icp) return { text: 'Please enter MAP and ICP values', type: 'warning' };

    const cpp = parseFloat(mapNeuro) - parseFloat(icp);

    if (cpp >= 70) {
      return {
        text: `CPP: ${cpp.toFixed(0)} mmHg\nAdequate cerebral perfusion\nTarget CPP: 60-70 mmHg`,
        type: 'success',
      };
    }
    if (cpp >= 60) {
      return {
        text: `CPP: ${cpp.toFixed(0)} mmHg\nBorderline cerebral perfusion\nTarget CPP: 60-70 mmHg`,
        type: 'warning',
      };
    }

    return {
      text: `CPP: ${cpp.toFixed(0)} mmHg\nInadequate cerebral perfusion - urgent intervention needed\nTarget CPP: 60-70 mmHg`,
      type: 'danger',
    };
  };

  const calculateGCS = () => {
    const eye = parseInt(gcsState.eye, 10) || 0;
    const verbal = parseInt(gcsState.verbal, 10) || 0;
    const motor = parseInt(gcsState.motor, 10) || 0;

    const total = eye + verbal + motor;

    if (total >= 13) {
      return {
        text: `GCS: ${total}/15 (E${eye}V${verbal}M${motor})\nMild brain injury`,
        type: 'success',
      };
    }
    if (total >= 9) {
      return {
        text: `GCS: ${total}/15 (E${eye}V${verbal}M${motor})\nModerate brain injury`,
        type: 'warning',
      };
    }

    return {
      text: `GCS: ${total}/15 (E${eye}V${verbal}M${motor})\nSevere brain injury`,
      type: 'danger',
    };
  };

  return (
    <ScreenWrapper title="Specialized Fields" subtitle="Pediatric, obstetric, and specialized medical assessments">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard
        title="Pediatric Calculations"
        icon="baby"
        open={activeCard === 'pediatric'}
        onToggle={(nextOpen) => toggleCard('pediatric', nextOpen)}
      >
        <Text style={styles.sectionTitle}>Weight Estimation (Age 1-10 years)</Text>
        <Text style={styles.label}>Age (years)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="5" value={pedAge} onChangeText={setPedAge} />
        <CalcButton title="Estimate Weight" onPress={() => setPedWeightResult(calculatePediatricWeight(pedAge))} />
        {pedWeightResult && <ResultDisplay result={pedWeightResult.text} type={pedWeightResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Pediatric Vital Signs Normal Ranges</Text>
        <CalcButton title="Show Normal Ranges" onPress={() => setPedVitalsResult(showPediatricVitals())} />
        {pedVitalsResult && <ResultDisplay result={pedVitalsResult.text} type={pedVitalsResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Obstetric Calculations & Assessments"
        icon="female"
        open={activeCard === 'obstetric'}
        onToggle={(nextOpen) => toggleCard('obstetric', nextOpen)}
      >
        <Text style={styles.sectionTitle}>Gestational Age Assessment</Text>
        <Text style={styles.label}>Weeks of Gestation</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="32" value={gestAge} onChangeText={setGestAge} />
        <CalcButton title="Assess GA Risk" onPress={() => setGestResult(assessGestationalAge(gestAge))} />
        {gestResult && <ResultDisplay result={gestResult.text} type={gestResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Bishop Score (Cervical Assessment)</Text>
        <PickerSelect label="Dilation" options={[
          { value: '0', label: '0 — Closed' }, { value: '1', label: '1 — 1-2 cm' }, { value: '2', label: '2 — 3-4 cm' }, { value: '3', label: '3 — ≥5 cm' },
        ]} selected={bishop.dilation} onSelect={v => setBishop(p => ({ ...p, dilation: v }))} />
        <PickerSelect label="Effacement" options={[
          { value: '0', label: '0 — 0-30%' }, { value: '1', label: '1 — 40-50%' }, { value: '2', label: '2 — 60-70%' }, { value: '3', label: '3 — ≥80%' },
        ]} selected={bishop.effacement} onSelect={v => setBishop(p => ({ ...p, effacement: v }))} />
        <PickerSelect label="Station" options={[
          { value: '0', label: '0 — −3' }, { value: '1', label: '1 — −2' }, { value: '2', label: '2 — -1,0' }, { value: '3', label: '3 — ≥+1' },
        ]} selected={bishop.station} onSelect={v => setBishop(p => ({ ...p, station: v }))} />
        <CalcButton title="Calculate Bishop Score" onPress={() => setBishopResult(calcBishop())} />
        {bishopResult && <ResultDisplay result={bishopResult.text} type={bishopResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Geriatric Assessments"
        icon="user-clock"
        open={activeCard === 'geriatric'}
        onToggle={(nextOpen) => toggleCard('geriatric', nextOpen)}
      >
        <Text style={styles.sectionTitle}>Frailty Assessment (Clinical Frailty Scale)</Text>
        <PickerSelect label="Frailty Scale" options={[
          { value: '1', label: '1 — Very Fit' }, { value: '2', label: '2 — Well' }, { value: '3', label: '3 — Managing Well' },
          { value: '4', label: '4 — Vulnerable' }, { value: '5', label: '5 — Mildly Frail' }, { value: '6', label: '6 — Moderately Frail' },
          { value: '7', label: '7 — Severely Frail' }, { value: '8', label: '8 — Very Severely Frail' }, { value: '9', label: '9 — Terminally Ill' },
        ]} selected={frailty} onSelect={setFrailty} />
        <CalcButton title="Assess Frailty Risk" onPress={() => setFrailtyResult(assessFrailtyScale(frailty))} />
        {frailtyResult && <ResultDisplay result={frailtyResult.text} type={frailtyResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Fall Risk Assessment</Text>
        <CheckboxItem label="Previous falls" checked={falls.previous} onToggle={() => setFalls(p => ({ ...p, previous: !p.previous }))} />
        <CheckboxItem label="Unsteady gait" checked={falls.gait} onToggle={() => setFalls(p => ({ ...p, gait: !p.gait }))} />
        <CheckboxItem label="Polypharmacy (≥5 meds)" checked={falls.polypharmacy} onToggle={() => setFalls(p => ({ ...p, polypharmacy: !p.polypharmacy }))} />
        <CheckboxItem label="Cognitive impairment" checked={falls.cognitive} onToggle={() => setFalls(p => ({ ...p, cognitive: !p.cognitive }))} />
        <CalcButton title="Assess Fall Risk" onPress={() => setFallResult(assessFallRisk())} />
        {fallResult && <ResultDisplay result={fallResult.text} type={fallResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Cardiac Anesthesia Calculations"
        icon="heart"
        open={activeCard === 'cardiac'}
        onToggle={(nextOpen) => toggleCard('cardiac', nextOpen)}
      >
        <Text style={styles.sectionTitle}>Cardiopulmonary Bypass Calculations</Text>
        <Text style={styles.label}>Body Surface Area (m²)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="1.8" value={bsa} onChangeText={setBsa} />
        <CalcButton title="Calculate CPB Parameters" onPress={() => setCpbResult(calculateCPB())} />
        {cpbResult && <ResultDisplay result={cpbResult.text} type={cpbResult.type} />}

        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Aortic Cross-Clamp Time Assessment</Text>
        <Text style={styles.label}>Cross-Clamp Time (minutes)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="90" value={crossClampTime} onChangeText={setCrossClampTime} />
        <CalcButton title="Assess Risk" onPress={() => setCrossClampResult(assessCrossClamp())} />
        {crossClampResult && <ResultDisplay result={crossClampResult.text} type={crossClampResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Neuroanesthesia Calculations"
        icon="brain"
        open={activeCard === 'neuro'}
        onToggle={(nextOpen) => toggleCard('neuro', nextOpen)}
      >
        <Text style={styles.sectionTitle}>Cerebral Perfusion Pressure</Text>
        <Text style={styles.label}>Mean Arterial Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="80" value={mapNeuro} onChangeText={setMapNeuro} />
        <Text style={styles.label}>Intracranial Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="numeric" placeholder="15" value={icp} onChangeText={setIcp} />
        <CalcButton title="Calculate CPP" onPress={() => setCppResult(calculateCPP())} />
        {cppResult && <ResultDisplay result={cppResult.text} type={cppResult.type} />}
        <View style={styles.divider} />
        <Text style={styles.sectionTitle}>Glasgow Coma Scale</Text>
        <PickerSelect label="Eye Opening" options={[
          { value: '4', label: '4 — Spontaneous' }, { value: '3', label: '3 — To speech' }, { value: '2', label: '2 — To pain' }, { value: '1', label: '1 — None' },
        ]} selected={gcsState.eye} onSelect={v => setGcsState(p => ({ ...p, eye: v }))} />
        <PickerSelect label="Verbal Response" options={[
          { value: '5', label: '5 — Oriented' }, { value: '4', label: '4 — Confused' }, { value: '3', label: '3 — Inappropriate' },
          { value: '2', label: '2 — Incomprehensible' }, { value: '1', label: '1 — None' },
        ]} selected={gcsState.verbal} onSelect={v => setGcsState(p => ({ ...p, verbal: v }))} />
        <PickerSelect label="Motor Response" options={[
          { value: '6', label: '6 — Obeys commands' }, { value: '5', label: '5 — Localizes pain' }, { value: '4', label: '4 — Withdraws' },
          { value: '3', label: '3 — Flexion' }, { value: '2', label: '2 — Extension' }, { value: '1', label: '1 — None' },
        ]} selected={gcsState.motor} onSelect={v => setGcsState(p => ({ ...p, motor: v }))} />
        <CalcButton title="Calculate GCS" onPress={() => setGcsResult(calculateGCS())} />
        {gcsResult && <ResultDisplay result={gcsResult.text} type={gcsResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm, marginTop: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.md },
});
