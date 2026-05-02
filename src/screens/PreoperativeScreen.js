import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { RadioGroup, CheckboxItem, PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function PreoperativeScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // ASA
  const [asaClass, setAsaClass] = useState(null);
  const [emergency, setEmergency] = useState(false);
  const [asaResult, setAsaResult] = useState(null);

  // RCRI
  const [rcriFactors, setRcriFactors] = useState({ highRisk: false, ischemic: false, heartFailure: false, cerebrovascular: false, diabetes: false, creatinine: false });
  const [rcriResult, setRcriResult] = useState(null);

  // Airway
  const [mallampati, setMallampati] = useState('');
  const [thyromental, setThyromental] = useState('');
  const [lipBite, setLipBite] = useState('');
  const [airwayResult, setAirwayResult] = useState(null);

  // STOP-BANG
  const [sbCriteria, setSbCriteria] = useState({ snoring: false, tiredness: false, observed: false, pressure: false, bmi: false, age: false, neck: false, gender: false });
  const [sbResult, setSbResult] = useState(null);

  // Framingham
  const [totalChol, setTotalChol] = useState('');
  const [hdlChol, setHdlChol] = useState('');
  const [systolicBP, setSystolicBP] = useState('');
  const [smoking, setSmoking] = useState(false);
  const [diabetes2, setDiabetes2] = useState(false);
  const [framResult, setFramResult] = useState(null);

  // METs
  const [activityLevel, setActivityLevel] = useState('');
  const [metsResult, setMetsResult] = useState(null);

  // Child-Pugh
  const [cpBili, setCpBili] = useState('');
  const [cpAlbumin, setCpAlbumin] = useState('');
  const [cpINR, setCpINR] = useState('');
  const [cpAscites, setCpAscites] = useState('');
  const [cpEnceph, setCpEnceph] = useState('');
  const [cpResult, setCpResult] = useState(null);

  // MELD
  const [meldBili, setMeldBili] = useState('');
  const [meldCr, setMeldCr] = useState('');
  const [meldINR, setMeldINR] = useState('');
  const [dialysis, setDialysis] = useState(false);
  const [meldResult, setMeldResult] = useState(null);

  // Cockcroft-Gault
  const [serumCr, setSerumCr] = useState('');
  const [ckResult, setCkResult] = useState(null);

  // Body Weights
  const [bwResult, setBwResult] = useState(null);

  // Caprini
  const [capriniFactors, setCapriniFactors] = useState({ majorSurgery: false, malignancy: false, priorVTE: false, immobility: false, varicoseVeins: false, obesity: false });
  const [capriniResult, setCapriniResult] = useState(null);

  const toggleCaprini = (key) => setCapriniFactors(p => ({ ...p, [key]: !p[key] }));
  const toggleRCRI = (key) => setRcriFactors(p => ({ ...p, [key]: !p[key] }));
  const toggleSB = (key) => setSbCriteria(p => ({ ...p, [key]: !p[key] }));

  return (
    <ScreenWrapper title="Preoperative Assessment Tools" subtitle="Comprehensive risk assessment and planning tools for perioperative care">
      <View style={styles.alert}>
        <View style={styles.alertRow}>
          <FontAwesome5 name="info-circle" size={14} color="#0c5460" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertStrong}>Clinical Guidance: </Text>
            These assessment tools support clinical decision-making. Always consider individual patient factors and institutional protocols.
          </Text>
        </View>
      </View>

      <PatientInfoCard patient={patient} setPatient={setPatient} />

      {/* ASA */}
      <CollapsibleCard title="ASA Physical Status Classification" icon="stethoscope">
        <RadioGroup
          options={[
            { value: '1', label: 'ASA I: Healthy patient' },
            { value: '2', label: 'ASA II: Mild systemic disease' },
            { value: '3', label: 'ASA III: Severe systemic disease' },
            { value: '4', label: 'ASA IV: Severe disease, constant threat to life' },
            { value: '5', label: 'ASA V: Moribund patient' },
            { value: '6', label: 'ASA VI: Brain-dead patient for organ donation' },
          ]}
          selected={asaClass}
          onSelect={setAsaClass}
        />
        <CheckboxItem label='Emergency procedure (add "E" modifier)' checked={emergency} onToggle={() => setEmergency(!emergency)} />
        <CalcButton title="Set ASA Classification" onPress={() => setAsaResult(Calc.calculateASA(asaClass, emergency))} />
        {asaResult && <ResultDisplay result={asaResult.text} type={asaResult.type} />}
      </CollapsibleCard>

      {/* RCRI */}
      <CollapsibleCard title="Revised Cardiac Risk Index (RCRI)" icon="heartbeat">
        {[
          ['highRisk', 'High-risk surgery (vascular, major abdominal, thoracic)'],
          ['ischemic', 'History of ischemic heart disease'],
          ['heartFailure', 'History of heart failure'],
          ['cerebrovascular', 'History of cerebrovascular disease'],
          ['diabetes', 'Diabetes requiring insulin'],
          ['creatinine', 'Preoperative creatinine > 2 mg/dL'],
        ].map(([k, label]) => (
          <CheckboxItem key={k} label={label} checked={rcriFactors[k]} onToggle={() => toggleRCRI(k)} />
        ))}
        <CalcButton title="Calculate RCRI" onPress={() => setRcriResult(Calc.calculateRCRI(Object.values(rcriFactors)))} />
        {rcriResult && <ResultDisplay result={rcriResult.text} type={rcriResult.type} />}
      </CollapsibleCard>

      {/* Mallampati / Airway */}
      <CollapsibleCard title="Mallampati Airway Assessment" icon="eye">
        <PickerSelect
          label="Mallampati Class"
          options={[
            { value: '1', label: 'Class I - Full visibility of soft palate, uvula, tonsils' },
            { value: '2', label: 'Class II - Partial visibility of uvula' },
            { value: '3', label: 'Class III - Only base of uvula visible' },
            { value: '4', label: 'Class IV - No visibility of soft palate' },
          ]}
          selected={mallampati}
          onSelect={setMallampati}
        />
        <PickerSelect
          label="Thyromental Distance"
          options={[
            { value: 'normal', label: '> 6 cm (Normal)' },
            { value: 'reduced', label: '< 6 cm (Reduced)' },
          ]}
          selected={thyromental}
          onSelect={setThyromental}
        />
        <PickerSelect
          label="Upper Lip Bite Test"
          options={[
            { value: '1', label: 'Class I - Lower teeth can bite upper lip above vermillion border' },
            { value: '2', label: 'Class II - Lower teeth can bite upper lip below vermillion border' },
            { value: '3', label: 'Class III - Lower teeth cannot bite upper lip' },
          ]}
          selected={lipBite}
          onSelect={setLipBite}
        />
        <CalcButton title="Assess Airway Risk" onPress={() => setAirwayResult(Calc.calculateAirwayRisk(mallampati, thyromental, lipBite))} />
        {airwayResult && <ResultDisplay result={airwayResult.text} type={airwayResult.type} />}
      </CollapsibleCard>

      {/* STOP-BANG */}
      <CollapsibleCard title="STOP-BANG Score (Sleep Apnea)" icon="bed">
        {[
          ['snoring', 'Snoring - Loud snoring'],
          ['tiredness', 'Tiredness - Daytime tiredness'],
          ['observed', 'Observed apnea - Witnessed breathing interruptions'],
          ['pressure', 'Pressure - High blood pressure'],
          ['bmi', 'BMI > 35 kg/m²'],
          ['age', 'Age > 50 years'],
          ['neck', 'Neck circumference > 40 cm'],
          ['gender', 'Gender - Male'],
        ].map(([k, label]) => (
          <CheckboxItem key={k} label={label} checked={sbCriteria[k]} onToggle={() => toggleSB(k)} />
        ))}
        <CalcButton title="Calculate STOP-BANG" onPress={() => setSbResult(Calc.calculateStopBang(Object.values(sbCriteria)))} />
        {sbResult && <ResultDisplay result={sbResult.text} type={sbResult.type} />}
      </CollapsibleCard>

      {/* Framingham */}
      <CollapsibleCard title="Framingham Cardiovascular Risk" icon="chart-bar">
        <Text style={styles.label}>Total Cholesterol (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={totalChol} onChangeText={setTotalChol} placeholder="200" />
        <Text style={styles.label}>HDL Cholesterol (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={hdlChol} onChangeText={setHdlChol} placeholder="50" />
        <Text style={styles.label}>Systolic BP (mmHg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={systolicBP} onChangeText={setSystolicBP} placeholder="120" />
        <CheckboxItem label="Current smoker" checked={smoking} onToggle={() => setSmoking(!smoking)} />
        <CheckboxItem label="Diabetes" checked={diabetes2} onToggle={() => setDiabetes2(!diabetes2)} />
        <CalcButton title="Calculate CV Risk" onPress={() => setFramResult(Calc.calculateFramingham(patient, parseFloat(totalChol), parseFloat(hdlChol), parseFloat(systolicBP), smoking, diabetes2))} />
        {framResult && <ResultDisplay result={framResult.text} type={framResult.type} />}
      </CollapsibleCard>

      {/* METs */}
      <CollapsibleCard title="Functional Capacity (METs)" icon="running">
        <PickerSelect
          label="Activity Level"
          options={[
            { value: '1', label: '1 MET - Light housework, eating, dressing' },
            { value: '2', label: '2 METs - Walking slowly (2 mph)' },
            { value: '3', label: '3 METs - Walking 3 mph, light gardening' },
            { value: '4', label: '4 METs - Climbing stairs, walking briskly (4 mph)' },
            { value: '5', label: '5 METs - Dancing, moderate cycling' },
            { value: '6', label: '6 METs - Sexual activity, moderate sports' },
            { value: '7', label: '7 METs - Tennis (singles), skiing' },
            { value: '8', label: '8 METs - Running 6 mph, heavy lifting' },
            { value: '9', label: '9+ METs - Running >7 mph, vigorous sports' },
          ]}
          selected={activityLevel}
          onSelect={setActivityLevel}
        />
        <CalcButton title="Assess Functional Capacity" onPress={() => setMetsResult(Calc.calculateMETS(activityLevel))} />
        {metsResult && <ResultDisplay result={metsResult.text} type={metsResult.type} />}
      </CollapsibleCard>

      {/* Child-Pugh */}
      <CollapsibleCard title="Child-Pugh Score" icon="vial">
        {[
          ['Bilirubin', cpBili, setCpBili, [{ v: '1', l: '<2 (1pt)' }, { v: '2', l: '2-3 (2pt)' }, { v: '3', l: '>3 (3pt)' }]],
          ['Albumin', cpAlbumin, setCpAlbumin, [{ v: '1', l: '>3.5 (1pt)' }, { v: '2', l: '2.8-3.5 (2pt)' }, { v: '3', l: '<2.8 (3pt)' }]],
          ['INR', cpINR, setCpINR, [{ v: '1', l: '<1.7 (1pt)' }, { v: '2', l: '1.7-2.3 (2pt)' }, { v: '3', l: '>2.3 (3pt)' }]],
          ['Ascites', cpAscites, setCpAscites, [{ v: '1', l: 'None (1pt)' }, { v: '2', l: 'Mild (2pt)' }, { v: '3', l: 'Moderate to severe (3pt)' }]],
          ['Encephalopathy', cpEnceph, setCpEnceph, [{ v: '1', l: 'None (1pt)' }, { v: '2', l: 'Grade 1-2 (2pt)' }, { v: '3', l: 'Grade 3-4 (3pt)' }]],
        ].map(([label, val, setter, opts]) => (
          <PickerSelect key={label} label={label} options={opts.map(o => ({ value: o.v, label: o.l }))} selected={val} onSelect={setter} />
        ))}
        <CalcButton title="Calculate Child-Pugh" onPress={() => setCpResult(Calc.calculateChildPugh(cpBili, cpAlbumin, cpINR, cpAscites, cpEnceph))} />
        {cpResult && <ResultDisplay result={cpResult.text} type={cpResult.type} />}
      </CollapsibleCard>

      {/* MELD */}
      <CollapsibleCard title="MELD Score" icon="vial">
        <Text style={styles.label}>Bilirubin (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={meldBili} onChangeText={setMeldBili} placeholder="1.0" />
        <Text style={styles.label}>Creatinine (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={meldCr} onChangeText={setMeldCr} placeholder="1.0" />
        <Text style={styles.label}>INR</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={meldINR} onChangeText={setMeldINR} placeholder="1.0" />
        <CheckboxItem label="On dialysis (twice in past week)" checked={dialysis} onToggle={() => setDialysis(!dialysis)} />
        <CalcButton title="Calculate MELD" onPress={() => setMeldResult(Calc.calculateMELD(parseFloat(meldBili), parseFloat(meldCr), parseFloat(meldINR), dialysis))} />
        {meldResult && <ResultDisplay result={meldResult.text} type={meldResult.type} />}
      </CollapsibleCard>

      {/* Cockcroft-Gault */}
      <CollapsibleCard title="Cockcroft-Gault Creatinine Clearance" icon="prescription-bottle">
        <Text style={styles.label}>Serum Creatinine (mg/dL)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" value={serumCr} onChangeText={setSerumCr} placeholder="1.0" />
        <CalcButton title="Calculate CrCl" onPress={() => setCkResult(Calc.calculateCockcroftGault(patient, parseFloat(serumCr)))} />
        {ckResult && <ResultDisplay result={ckResult.text} type={ckResult.type} />}
      </CollapsibleCard>

      {/* Body Weights */}
      <CollapsibleCard title="Ideal & Lean Body Weight" icon="balance-scale">
        <Text style={styles.hint}>Uses patient information above</Text>
        <CalcButton title="Calculate IBW & LBW" onPress={() => setBwResult(Calc.calculateBodyWeights(patient))} />
        {bwResult && <ResultDisplay result={bwResult.text} type={bwResult.type} />}
      </CollapsibleCard>

      {/* Caprini */}
      <CollapsibleCard title="Caprini DVT Risk Score" icon="lungs">
        {[
          ['majorSurgery', 'Major surgery (>45 minutes) - 2 points'],
          ['malignancy', 'History of malignancy - 2 points'],
          ['priorVTE', 'Prior VTE - 3 points'],
          ['immobility', 'Confined to bed >72 hours - 1 point'],
          ['varicoseVeins', 'Varicose veins - 1 point'],
          ['obesity', 'BMI > 25 kg/m² - 1 point'],
        ].map(([k, label]) => (
          <CheckboxItem key={k} label={label} checked={capriniFactors[k]} onToggle={() => toggleCaprini(k)} />
        ))}
        <CalcButton title="Calculate DVT Risk" onPress={() => setCapriniResult(Calc.calculateCaprini(capriniFactors, patient))} />
        {capriniResult && <ResultDisplay result={capriniResult.text} type={capriniResult.type} />}
      </CollapsibleCard>

      {/* Quick Reference Guide */}
      <View style={styles.quickRef}>
        <View style={styles.quickRefHeader}>
          <FontAwesome5 name="info-circle" size={14} color={COLORS.white} style={{ marginRight: 8 }} />
          <Text style={styles.quickRefTitle}>Preoperative Assessment Quick Reference</Text>
        </View>
        <View style={styles.quickRefBody}>
          <View style={styles.quickRefCol}>
            <Text style={styles.quickRefHeading}>High-Risk Indicators</Text>
            {['ASA ≥ III', 'RCRI ≥ 2', 'METs < 4', 'Mallampati III-IV', 'STOP-BANG ≥ 3'].map(i => (
              <Text key={i} style={styles.quickRefItem}>• {i}</Text>
            ))}
          </View>
          <View style={styles.quickRefCol}>
            <Text style={styles.quickRefHeading}>Cardiac Risk Factors</Text>
            {['Known CAD/CHF', 'CVA history', 'Insulin-dependent DM', 'Creatinine > 2 mg/dL', 'High-risk surgery'].map(i => (
              <Text key={i} style={styles.quickRefItem}>• {i}</Text>
            ))}
          </View>
          <View style={styles.quickRefCol}>
            <Text style={styles.quickRefHeading}>Airway Concerns</Text>
            {['Mallampati III-IV', 'Thyromental < 6cm', 'Limited neck mobility', 'Previous difficult airway', 'OSA (STOP-BANG ≥ 3)'].map(i => (
              <Text key={i} style={styles.quickRefItem}>• {i}</Text>
            ))}
          </View>
          <View style={styles.quickRefCol}>
            <Text style={styles.quickRefHeading}>Special Considerations</Text>
            {['Liver disease (Child-Pugh B/C)', 'Renal impairment (CrCl < 60)', 'Poor functional status', 'Emergency procedures', 'Multiple comorbidities'].map(i => (
              <Text key={i} style={styles.quickRefItem}>• {i}</Text>
            ))}
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  alert: { backgroundColor: '#d1ecf1', padding: SPACING.md, borderRadius: 8, marginBottom: SPACING.md, borderLeftWidth: 4, borderLeftColor: COLORS.info },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start' },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertText: { fontSize: 13, color: '#0c5460', lineHeight: 20 },
  alertStrong: { fontWeight: '700', color: '#0c5460' },
  label: { fontSize: 13, color: COLORS.textMuted, marginBottom: 4, marginTop: SPACING.sm },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: SPACING.sm, fontSize: 14, backgroundColor: COLORS.white },
  hint: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' },
  quickRef: { borderRadius: 8, overflow: 'hidden', marginTop: SPACING.sm, borderWidth: 1, borderColor: COLORS.border },
  quickRefHeader: { backgroundColor: COLORS.medicalBlue, flexDirection: 'row', alignItems: 'center', padding: SPACING.sm + 2 },
  quickRefTitle: { fontSize: 13, fontWeight: '700', color: COLORS.white, flexShrink: 1 },
  quickRefBody: { backgroundColor: COLORS.white, padding: SPACING.sm },
  quickRefCol: { marginBottom: SPACING.sm },
  quickRefHeading: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  quickRefItem: { fontSize: 12, color: COLORS.textMuted, lineHeight: 20 },
});
