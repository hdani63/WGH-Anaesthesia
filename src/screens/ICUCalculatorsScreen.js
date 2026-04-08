import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';

export default function ICUCalculatorsScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // APACHE II
  const [temperature, setTemperature] = useState('');
    const [map, setMap] = useState('');
    const [heartRate, setHeartRate] = useState('');
    const [respRate, setRespRate] = useState('');
    const [wbc, setWbc] = useState('');
    const [hematocrit, setHematocrit] = useState('');
    const [creatinine, setCreatinine] = useState('');
    const [gcs, setGcs] = useState('15');
  const [apacheResult, setApacheResult] = useState(null);

  // SOFA
    const [sofa, setSofa] = useState({ respiratory: '0', coagulation: '0', liver: '0', cardiovascular: '0', cns: '0', renal: '0' });
  const [sofaResult, setSofaResult] = useState(null);

  // RASS
    const [rassLevel, setRassLevel] = useState('4');
  const [rassResult, setRassResult] = useState(null);

  // CAM-ICU
    const [cam, setCam] = useState({ acute: 'no', inattention: 'no', disorganized: 'no', altered: 'no' });
  const [camResult, setCamResult] = useState(null);

    const [activeCard, setActiveCard] = useState(null);

    const toggleCard = (cardKey, nextOpen) => {
      setActiveCard(nextOpen ? cardKey : null);
    };

    const handleCalculateApache = () => {
      setApacheResult({
        text: 'APACHE II Score: Calculation in progress\nSimplified implementation for demonstration',
        type: 'info',
      });
    };

    const handleCalculateSofa = () => {
      const total =
        (parseInt(sofa.respiratory, 10) || 0) +
        (parseInt(sofa.coagulation, 10) || 0) +
        (parseInt(sofa.liver, 10) || 0) +
        (parseInt(sofa.cardiovascular, 10) || 0) +
        (parseInt(sofa.cns, 10) || 0) +
        (parseInt(sofa.renal, 10) || 0);

      let interpretation = '';
      let type = 'info';

      if (total <= 6) {
        interpretation = 'Low mortality risk (<10%)';
        type = 'success';
      } else if (total <= 9) {
        interpretation = 'Moderate mortality risk (15-20%)';
        type = 'warning';
      } else if (total <= 12) {
        interpretation = 'High mortality risk (40-50%)';
        type = 'warning';
      } else {
        interpretation = 'Very high mortality risk (>80%)';
        type = 'danger';
      }

      setSofaResult({
        text: `SOFA Score: ${total}/24\n${interpretation}\nHigher scores indicate greater organ dysfunction`,
        type,
      });
    };

    const handleAssessRass = () => {
      const level = parseInt(rassLevel, 10);

      let interpretation = '';
      let type = 'info';
      let recommendation = '';

      if (level >= 2) {
        interpretation = 'Agitated';
        type = 'danger';
        recommendation = 'Consider sedation, ensure safety';
      } else if (level >= 0) {
        interpretation = 'Alert to restless';
        type = 'success';
        recommendation = 'Appropriate level for most patients';
      } else if (level >= -2) {
        interpretation = 'Light sedation';
        type = 'success';
        recommendation = 'Target range for most mechanically ventilated patients';
      } else {
        interpretation = 'Deep sedation';
        type = 'warning';
        recommendation = 'Consider reducing sedation if appropriate';
      }

      const signedLevel = level >= 0 ? `+${level}` : `${level}`;
      setRassResult({
        text: `RASS Level: ${signedLevel}\n${interpretation}\n${recommendation}`,
        type,
      });
    };

    const handleAssessCam = () => {
      const acuteOnset = cam.acute === 'yes';
      const inattention = cam.inattention === 'yes';
      const disorganizedThinking = cam.disorganized === 'yes';
      const alteredConsciousness = cam.altered === 'yes';

      const camPositive = acuteOnset && inattention && (disorganizedThinking || alteredConsciousness);

      if (camPositive) {
        setCamResult({
          text: 'CAM-ICU POSITIVE - Delirium present\nInitiate delirium management protocol, investigate causes',
          type: 'danger',
        });
        return;
      }

      setCamResult({
        text: 'CAM-ICU NEGATIVE - No delirium detected\nContinue monitoring, reassess regularly',
        type: 'success',
      });
    };

  return (
      <ScreenWrapper title="ICU-Specific Calculators" subtitle="Critical care assessment tools and organ failure scoring systems">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

        <CollapsibleCard
          title="APACHE II Score"
          icon="chart-line"
          open={activeCard === 'apache'}
          onToggle={(nextOpen) => toggleCard('apache', nextOpen)}
        >
        <Text style={styles.label}>Temperature (°C)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="37.0" value={temperature} onChangeText={setTemperature} />
        <Text style={styles.label}>Mean Arterial Pressure (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="80" value={map} onChangeText={setMap} />
        <Text style={styles.label}>Heart Rate (bpm)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="80" value={heartRate} onChangeText={setHeartRate} />
        <Text style={styles.label}>Respiratory Rate (/min)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="20" value={respRate} onChangeText={setRespRate} />
        <Text style={styles.label}>White Blood Count (×10³/μL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="8" value={wbc} onChangeText={setWbc} />
        <Text style={styles.label}>Hematocrit (%)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="40" value={hematocrit} onChangeText={setHematocrit} />
        <Text style={styles.label}>Creatinine (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="1.0" value={creatinine} onChangeText={setCreatinine} />
        <PickerSelect label="Glasgow Coma Scale" options={[
          { value: '15', label: '15 (Normal)' }, { value: '14', label: '14' }, { value: '13', label: '13' },
          { value: '12', label: '12' }, { value: '11', label: '11' }, { value: '10', label: '10' },
          { value: '9', label: '9' }, { value: '8', label: '8' }, { value: '7', label: '7' },
          { value: '6', label: '6' }, { value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3 (Lowest)' },
        ]} selected={gcs} onSelect={setGcs} />
        <CalcButton title="Calculate APACHE II" onPress={handleCalculateApache} />
        {apacheResult && <ResultDisplay result={apacheResult.text} type={apacheResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="SOFA Score (Sequential Organ Failure Assessment)"
        icon="lungs"
        open={activeCard === 'sofa'}
        onToggle={(nextOpen) => toggleCard('sofa', nextOpen)}
      >
        <PickerSelect label="Respiratory (PaO₂/FiO₂ ratio)" options={[
          { value: '0', label: '≥400 (0 points)' }, { value: '1', label: '300-399 (1 point)' },
          { value: '2', label: '200-299 (2 points)' }, { value: '3', label: '100-199 with ventilation (3 points)' }, { value: '4', label: '<100 with ventilation (4 points)' },
        ]} selected={sofa.respiratory} onSelect={v => setSofa(p => ({ ...p, respiratory: v }))} />
        <PickerSelect label="Coagulation (Platelets ×10³/μL)" options={[
          { value: '0', label: '≥150 (0 points)' }, { value: '1', label: '100-149 (1 point)' },
          { value: '2', label: '50-99 (2 points)' }, { value: '3', label: '20-49 (3 points)' }, { value: '4', label: '<20 (4 points)' },
        ]} selected={sofa.coagulation} onSelect={v => setSofa(p => ({ ...p, coagulation: v }))} />
        <PickerSelect label="Liver (Bilirubin mg/dL)" options={[
          { value: '0', label: '<1.2 (0 points)' }, { value: '1', label: '1.2-1.9 (1 point)' },
          { value: '2', label: '2.0-5.9 (2 points)' }, { value: '3', label: '6.0-11.9 (3 points)' }, { value: '4', label: '≥12.0 (4 points)' },
        ]} selected={sofa.liver} onSelect={v => setSofa(p => ({ ...p, liver: v }))} />
        <PickerSelect label="Cardiovascular" options={[
          { value: '0', label: 'No hypotension (0 points)' }, { value: '1', label: 'MAP <70 mmHg (1 point)' },
          { value: '2', label: 'Dopamine ≤5 or dobutamine (2 points)' }, { value: '3', label: 'Dopamine >5 or epi ≤0.1 or norepi ≤0.1 (3 points)' },
          { value: '4', label: 'Dopamine >15 or epi >0.1 or norepi >0.1 (4 points)' },
        ]} selected={sofa.cardiovascular} onSelect={v => setSofa(p => ({ ...p, cardiovascular: v }))} />
        <PickerSelect label="Central Nervous System (GCS)" options={[
          { value: '0', label: '15 (0 points)' }, { value: '1', label: '13-14 (1 point)' },
          { value: '2', label: '10-12 (2 points)' }, { value: '3', label: '6-9 (3 points)' }, { value: '4', label: '3-5 (4 points)' },
        ]} selected={sofa.cns} onSelect={v => setSofa(p => ({ ...p, cns: v }))} />
        <PickerSelect label="Renal (Creatinine mg/dL or Urine Output)" options={[
          { value: '0', label: '<1.2 (0 points)' }, { value: '1', label: '1.2-1.9 (1 point)' },
          { value: '2', label: '2.0-3.4 (2 points)' }, { value: '3', label: '3.5-4.9 or UO <500mL/day (3 points)' }, { value: '4', label: '≥5.0 or UO <200mL/day (4 points)' },
        ]} selected={sofa.renal} onSelect={v => setSofa(p => ({ ...p, renal: v }))} />
        <CalcButton title="Calculate SOFA" onPress={handleCalculateSofa} />
        {sofaResult && <ResultDisplay result={sofaResult.text} type={sofaResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Richmond Agitation-Sedation Scale (RASS)"
        icon="bed"
        open={activeCard === 'rass'}
        onToggle={(nextOpen) => toggleCard('rass', nextOpen)}
      >
        <PickerSelect label="Patient's Level of Consciousness" options={[
          { value: '4', label: '+4 Combative - Overtly combative, violent' },
          { value: '3', label: '+3 Very Agitated - Pulls or removes tubes, aggressive' },
          { value: '2', label: '+2 Agitated - Frequent non-purposeful movement' },
          { value: '1', label: '+1 Restless - Anxious, apprehensive but not aggressive' },
          { value: '0', label: '0 Alert and Calm' },
          { value: '-1', label: '-1 Drowsy - Not fully alert, sustained awakening to voice' },
          { value: '-2', label: '-2 Light Sedation - Briefly awakens to voice (≥10 seconds)' },
          { value: '-3', label: '-3 Moderate Sedation - Movement to voice (<10 seconds)' },
          { value: '-4', label: '-4 Deep Sedation - No response to voice, movement to touch' },
          { value: '-5', label: '-5 Unarousable - No response to voice or physical stimulation' },
        ]} selected={rassLevel} onSelect={setRassLevel} />
        <CalcButton title="Assess RASS Level" onPress={handleAssessRass} />
        {rassResult && <ResultDisplay result={rassResult.text} type={rassResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="CAM-ICU (Delirium Assessment)"
        icon="brain"
        open={activeCard === 'cam'}
        onToggle={(nextOpen) => toggleCard('cam', nextOpen)}
      >
        <PickerSelect label="Feature 1: Acute onset or fluctuating course" options={[
          { value: 'no', label: 'No' }, { value: 'yes', label: 'Yes' },
        ]} selected={cam.acute} onSelect={v => setCam(p => ({ ...p, acute: v }))} />
        <PickerSelect label="Feature 2: Inattention" options={[
          { value: 'no', label: 'No (0-2 errors on attention screening)' }, { value: 'yes', label: 'Yes (>2 errors on attention screening)' },
        ]} selected={cam.inattention} onSelect={v => setCam(p => ({ ...p, inattention: v }))} />
        <PickerSelect label="Feature 3: Disorganized thinking" options={[
          { value: 'no', label: 'No (0-1 errors on thinking assessment)' }, { value: 'yes', label: 'Yes (>1 error on thinking assessment)' },
        ]} selected={cam.disorganized} onSelect={v => setCam(p => ({ ...p, disorganized: v }))} />
        <PickerSelect label="Feature 4: Altered level of consciousness" options={[
          { value: 'no', label: 'No (RASS = 0)' }, { value: 'yes', label: 'Yes (RASS ≠ 0)' },
        ]} selected={cam.altered} onSelect={v => setCam(p => ({ ...p, altered: v }))} />
        <CalcButton title="Assess for Delirium" onPress={handleAssessCam} />
        {camResult && <ResultDisplay result={camResult.text} type={camResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
});
