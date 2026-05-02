import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect, CheckboxItem } from '../components/FormControls';
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
  const [apacheSodium, setApacheSodium] = useState('');
  const [apachePotassium, setApachePotassium] = useState('');
  const [arterialPH, setArterialPH] = useState('');
  const [oxygenationScore, setOxygenationScore] = useState('0');
  const [acuteRF, setAcuteRF] = useState(false);
  const [chronicHealth, setChronicHealth] = useState('0');
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
      const temp = parseFloat(temperature);
      const mapVal = parseFloat(map);
      const hr = parseFloat(heartRate);
      const rr = parseFloat(respRate);
      const wbcVal = parseFloat(wbc);
      const hct = parseFloat(hematocrit);
      const creat = parseFloat(creatinine);
      const g = parseInt(gcs, 10);
      const sodium = parseFloat(apacheSodium);
      const potassium = parseFloat(apachePotassium);
      const ph = parseFloat(arterialPH);
      const oxyScore = parseInt(oxygenationScore, 10) || 0;
      const chronicPts = parseInt(chronicHealth, 10) || 0;
      const age = parseInt(patient.age, 10) || 0;

      const missing = [];
      if (Number.isNaN(temp)) missing.push('Temperature');
      if (Number.isNaN(mapVal)) missing.push('MAP');
      if (Number.isNaN(hr)) missing.push('Heart Rate');
      if (Number.isNaN(rr)) missing.push('Respiratory Rate');
      if (Number.isNaN(sodium)) missing.push('Sodium');
      if (Number.isNaN(potassium)) missing.push('Potassium');
      if (Number.isNaN(ph)) missing.push('Arterial pH');
      if (Number.isNaN(wbcVal)) missing.push('WBC');
      if (Number.isNaN(hct)) missing.push('Hematocrit');
      if (Number.isNaN(creat)) missing.push('Creatinine');

      if (missing.length) {
        setApacheResult({ text: `Please complete: ${missing.join(', ')}`, type: 'warning' });
        return;
      }

      let tScore = 4;
      if (temp >= 41) tScore = 4;
      else if (temp >= 39) tScore = 3;
      else if (temp >= 38.5) tScore = 1;
      else if (temp >= 36) tScore = 0;
      else if (temp >= 34) tScore = 1;
      else if (temp >= 32) tScore = 2;
      else if (temp >= 30) tScore = 3;
      else tScore = 4;

      let mScore;
      if (mapVal >= 160) mScore = 4;
      else if (mapVal >= 130) mScore = 3;
      else if (mapVal >= 110) mScore = 2;
      else if (mapVal >= 70) mScore = 0;
      else if (mapVal >= 50) mScore = 2;
      else mScore = 4;

      let hrScore;
      if (hr >= 180) hrScore = 4;
      else if (hr >= 140) hrScore = 3;
      else if (hr >= 110) hrScore = 2;
      else if (hr >= 70) hrScore = 0;
      else if (hr >= 55) hrScore = 2;
      else if (hr >= 40) hrScore = 3;
      else hrScore = 4;

      let rrScore;
      if (rr >= 50) rrScore = 4;
      else if (rr >= 35) rrScore = 3;
      else if (rr >= 25) rrScore = 1;
      else if (rr >= 12) rrScore = 0;
      else if (rr >= 10) rrScore = 1;
      else if (rr >= 6) rrScore = 2;
      else rrScore = 4;

      let phScore;
      if (ph >= 7.7) phScore = 4;
      else if (ph >= 7.6) phScore = 3;
      else if (ph >= 7.5) phScore = 1;
      else if (ph >= 7.33) phScore = 0;
      else if (ph >= 7.25) phScore = 2;
      else if (ph >= 7.15) phScore = 3;
      else phScore = 4;

      let naScore;
      if (sodium >= 180) naScore = 4;
      else if (sodium >= 160) naScore = 3;
      else if (sodium >= 155) naScore = 2;
      else if (sodium >= 150) naScore = 1;
      else if (sodium >= 130) naScore = 0;
      else if (sodium >= 120) naScore = 2;
      else if (sodium >= 111) naScore = 3;
      else naScore = 4;

      let kScore;
      if (potassium >= 7) kScore = 4;
      else if (potassium >= 6) kScore = 3;
      else if (potassium >= 5.5) kScore = 1;
      else if (potassium >= 3.5) kScore = 0;
      else if (potassium >= 3) kScore = 1;
      else if (potassium >= 2.5) kScore = 2;
      else kScore = 4;

      let creatScore;
      if (creat >= 3.5) creatScore = 4;
      else if (creat >= 2.0) creatScore = 3;
      else if (creat >= 1.5) creatScore = 2;
      else if (creat >= 0.6) creatScore = 0;
      else creatScore = 2;
      if (acuteRF) creatScore = Math.min(creatScore * 2, 8);

      let hctScore;
      if (hct >= 60) hctScore = 4;
      else if (hct >= 50) hctScore = 2;
      else if (hct >= 46) hctScore = 1;
      else if (hct >= 30) hctScore = 0;
      else if (hct >= 20) hctScore = 2;
      else hctScore = 4;

      let wbcScore;
      if (wbcVal >= 40) wbcScore = 4;
      else if (wbcVal >= 20) wbcScore = 2;
      else if (wbcVal >= 15) wbcScore = 1;
      else if (wbcVal >= 3) wbcScore = 0;
      else if (wbcVal >= 1) wbcScore = 2;
      else wbcScore = 4;

      const gcsScore = 15 - g;
      const aps =
        tScore + mScore + hrScore + rrScore + oxyScore + phScore + naScore + kScore + creatScore + hctScore + wbcScore + gcsScore;

      let ageScore;
      if (age >= 75) ageScore = 6;
      else if (age >= 65) ageScore = 5;
      else if (age >= 55) ageScore = 3;
      else if (age >= 45) ageScore = 2;
      else ageScore = 0;

      const total = aps + ageScore + chronicPts;

      let mortality;
      let type;
      if (total <= 4) { mortality = '<4%'; type = 'success'; }
      else if (total <= 9) { mortality = '~8%'; type = 'success'; }
      else if (total <= 14) { mortality = '~15%'; type = 'warning'; }
      else if (total <= 19) { mortality = '~25%'; type = 'warning'; }
      else if (total <= 24) { mortality = '~40%'; type = 'warning'; }
      else if (total <= 29) { mortality = '~55%'; type = 'danger'; }
      else if (total <= 34) { mortality = '~75%'; type = 'danger'; }
      else { mortality = '>85%'; type = 'danger'; }

      setApacheResult({
        text: `APACHE II Score: ${total}\nEstimated hospital mortality: ${mortality}\nAPS: ${aps} | Age points: ${ageScore} | Chronic health: ${chronicPts}\nAge sourced from Patient Information panel above. Scores ≥25 are associated with >50% mortality.`,
        type,
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
      } else if (total <= 14) {
        interpretation = 'Very high mortality risk (~50%)';
        type = 'danger';
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
        <Text style={styles.label}>Sodium (mEq/L)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="140" value={apacheSodium} onChangeText={setApacheSodium} />
        <Text style={styles.label}>Potassium (mEq/L)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="4.0" value={apachePotassium} onChangeText={setApachePotassium} />
        <Text style={styles.label}>Arterial pH</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="7.40" value={arterialPH} onChangeText={setArterialPH} />
        <PickerSelect label="Glasgow Coma Scale" options={[
          { value: '15', label: '15 (Normal)' }, { value: '14', label: '14' }, { value: '13', label: '13' },
          { value: '12', label: '12' }, { value: '11', label: '11' }, { value: '10', label: '10' },
          { value: '9', label: '9' }, { value: '8', label: '8' }, { value: '7', label: '7' },
          { value: '6', label: '6' }, { value: '5', label: '5' }, { value: '4', label: '4' }, { value: '3', label: '3 (Lowest)' },
        ]} selected={gcs} onSelect={setGcs} />
        <PickerSelect
          label="Oxygenation"
          options={[
            { value: '0', label: '0 pts — PaO₂ >70 mmHg (FiO₂ <0.5), or A-aDO₂ <200' },
            { value: '1', label: '1 pt — PaO₂ 61-70 mmHg (FiO₂ <0.5)' },
            { value: '2', label: '2 pts — A-aDO₂ 200-349 (FiO₂ ≥0.5)' },
            { value: '3', label: '3 pts — PaO₂ 55-60 mmHg, or A-aDO₂ 350-499' },
            { value: '4', label: '4 pts — PaO₂ <55 mmHg, or A-aDO₂ ≥500' },
          ]}
          selected={oxygenationScore}
          onSelect={setOxygenationScore}
        />
        <CheckboxItem
          label="Acute renal failure (doubles creatinine points)"
          checked={acuteRF}
          onToggle={() => setAcuteRF((v) => !v)}
        />
        <PickerSelect
          label="Chronic Health Points"
          options={[
            { value: '0', label: '0 — No severe chronic organ disease' },
            { value: '2', label: '2 — Elective postoperative patient with severe organ insufficiency*' },
            { value: '5', label: '5 — Non-operative or emergency postoperative with severe organ insufficiency*' },
          ]}
          selected={chronicHealth}
          onSelect={setChronicHealth}
        />
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
        <PickerSelect label="Central Nervous System (Glasgow Coma Scale)" options={[
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
