import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import CalcButton from '../../components/CalcButton';
import ResultDisplay from '../../components/ResultDisplay';
import { RadioGroup, CheckboxItem, PickerSelect } from '../../components/FormControls';
import { COLORS, SPACING } from '../../utils/theme';

// ─────────────────────────────────────────────────────────────
// SORT – Surgical Outcome Risk Tool
// Protopapa et al., Br J Anaesth 2014
// logit = −6.84 + asa + urgency + severity + malignancy + age
// ─────────────────────────────────────────────────────────────
function calculateSORT(asa, urgency, severity, malignancy, age) {
  const logOdds = -6.84 + parseFloat(asa) + parseFloat(urgency) +
    parseFloat(severity) + parseFloat(malignancy) + parseFloat(age);
  const prob = (Math.exp(logOdds) / (1 + Math.exp(logOdds)) * 100).toFixed(2);
  const p = parseFloat(prob);
  const risk = p < 1 ? 'Low' : p < 5 ? 'Moderate' : 'High';
  const type = p < 1 ? 'success' : p < 5 ? 'warning' : 'danger';
  return {
    text: `Predicted 30-day in-hospital mortality: ${prob}%\nRisk category: ${risk}\n\nSORT model (Protopapa et al., Br J Anaesth 2014). For elective & emergency non-cardiac surgery.`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────
// P-POSSUM – Portsmouth-POSSUM
// mortLogit  = 0.1692×phys + 0.1550×op − 7.04
// morbLogit  = 0.1692×phys + 0.1550×op − 5.91
// ─────────────────────────────────────────────────────────────
function calculatePPOSSUM(physScore, opScore) {
  const phys = parseInt(physScore, 10);
  const op = parseInt(opScore, 10);
  const mortLogit = 0.1692 * phys + 0.1550 * op - 7.04;
  const morbLogit = 0.1692 * phys + 0.1550 * op - 5.91;
  const mort = (Math.exp(mortLogit) / (1 + Math.exp(mortLogit)) * 100).toFixed(1);
  const morb = (Math.exp(morbLogit) / (1 + Math.exp(morbLogit)) * 100).toFixed(1);
  const m = parseFloat(mort);
  const type = m < 5 ? 'success' : m < 15 ? 'warning' : 'danger';
  return {
    text: `P-POSSUM Results\nPhysiological Score: ${phys}  |  Operative Score: ${op}\nPredicted 30-day Mortality: ${mort}%\nPredicted Morbidity: ${morb}%\n\nPortsmouth-POSSUM model. Calibrated for non-cardiac surgical populations.`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────
// ARISCAT – Postoperative Pulmonary Complications
// Canet et al., Anesthesiology 2010
// Bands: <26 Low 1.6% | 26–44 Intermediate 13.3% | ≥45 High 42.1%
// ─────────────────────────────────────────────────────────────
function calculateARISCAT(arAge, spo2, infect, anaemia, incision, duration, emerg) {
  const score = [arAge, spo2, infect, anaemia, incision, duration, emerg]
    .reduce((s, v) => s + parseInt(v, 10), 0);
  let risk, pct, type;
  if (score < 26) { risk = 'Low'; pct = '1.6%'; type = 'success'; }
  else if (score <= 44) { risk = 'Intermediate'; pct = '13.3%'; type = 'warning'; }
  else { risk = 'High'; pct = '42.1%'; type = 'danger'; }
  return {
    text: `ARISCAT Score: ${score}\nRisk category: ${risk}\nPredicted postoperative pulmonary complication rate: ${pct}\n\nIncludes: atelectasis, respiratory failure, bronchospasm, pneumonia, pneumothorax, pleural effusion, aspiration pneumonitis.\n(Canet et al., Anesthesiology 2010)`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────
// SRS – Surgical Risk Scale (Sutton et al.)
// score = urgency (1–4) + ASA (1–5) + severity (1–4) → max 13
// ─────────────────────────────────────────────────────────────
const SRS_MORT_TABLE = {
  3: 0.3, 4: 0.5, 5: 0.8, 6: 1.2,
  7: 2, 8: 3.5, 9: 5.5, 10: 9,
  11: 14, 12: 22, 13: 35,
};
function calculateSRS(urgency, asa, severity) {
  const score = parseInt(urgency, 10) + parseInt(asa, 10) + parseInt(severity, 10);
  const risk = score <= 6 ? 'Low risk' : score <= 9 ? 'Moderate risk' : 'High risk';
  const type = score <= 6 ? 'success' : score <= 9 ? 'warning' : 'danger';
  const mort = SRS_MORT_TABLE[Math.min(score, 13)] || 35;
  return {
    text: `SRS Score: ${score} (max 13)\nRisk category: ${risk}\nApproximate predicted 30-day mortality: ~${mort}%`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────
// OS-MRS – Obesity Surgery Mortality Risk Score
// DeMaria et al., Surg Obes Relat Dis 2007
// 5 binary factors; Class A ≤1 (0.31%), B 2–3 (1.90%), C 4–5 (7.56%)
// ─────────────────────────────────────────────────────────────
function calculateOSMRS(factors) {
  const score = Object.values(factors).filter(Boolean).length;
  let cls, mort, type;
  if (score <= 1) { cls = 'A – Low Risk'; mort = '0.31%'; type = 'success'; }
  else if (score <= 3) { cls = 'B – Intermediate Risk'; mort = '1.90%'; type = 'warning'; }
  else { cls = 'C – High Risk'; mort = '7.56%'; type = 'danger'; }
  return {
    text: `OS-MRS Score: ${score}/5\nClass: ${cls}\nPredicted 30-day mortality: ${mort}\n\nDeMaria et al., Surg Obes Relat Dis 2007. For bariatric (metabolic) surgery patients only.`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────
export default function SurgicalRiskSection({ patient = {} }) {
  const age = parseInt(patient.age, 10) || null;
  const weight = parseFloat(patient.weight) || null;
  const height = parseFloat(patient.height) || null;
  const bmi = (weight && height) ? weight / Math.pow(height / 100, 2) : null;

  // ── SORT state ──────────────────────────────────────────────
  const [sortAsa, setSortAsa] = useState('0');
  const [sortUrgency, setSortUrgency] = useState('0');
  const [sortSeverity, setSortSeverity] = useState('0');
  const [sortMalig, setSortMalig] = useState('0');
  const [sortAge, setSortAge] = useState('0');
  const [sortResult, setSortResult] = useState(null);

  // Auto-populate SORT age band from patient prop
  const defaultSortAge = () => {
    if (!age) return '0';
    if (age >= 80) return '1.58';
    if (age >= 65) return '0.67';
    return '0';
  };

  // ── P-POSSUM state ───────────────────────────────────────────
  const [pAge, setPAge] = useState('1');
  const [pCardiac, setPCardiac] = useState('1');
  const [pResp, setPResp] = useState('1');
  const [pBP, setPBP] = useState('1');
  const [pPulse, setPPulse] = useState('1');
  const [pGCS, setPGCS] = useState('1');
  const [pHb, setPHb] = useState('1');
  const [pWBC, setPWBC] = useState('1');
  const [pUrea, setPUrea] = useState('1');
  const [pNa, setPNa] = useState('1');
  const [pK, setPK] = useState('1');
  const [pECG, setPECG] = useState('1');
  const [pOpSev, setPOpSev] = useState('1');
  const [pMulti, setPMulti] = useState('1');
  const [pBlood, setPBlood] = useState('1');
  const [pContam, setPContam] = useState('1');
  const [pMalig, setPMalig] = useState('1');
  const [pMode, setPMode] = useState('1');
  const [possumResult, setPossumResult] = useState(null);

  // ── ARISCAT state ─────────────────────────────────────────────
  const [arAge, setArAge] = useState('0');
  const [arSpo2, setArSpo2] = useState('0');
  const [arInfect, setArInfect] = useState('0');
  const [arAnaemia, setArAnaemia] = useState('0');
  const [arIncision, setArIncision] = useState('0');
  const [arDuration, setArDuration] = useState('0');
  const [arEmerg, setArEmerg] = useState('0');
  const [ariscatResult, setAriscatResult] = useState(null);

  // Auto-populate ARISCAT age from patient
  const defaultArAge = () => {
    if (!age) return '0';
    if (age > 80) return '16';
    if (age >= 51) return '3';
    return '0';
  };

  // ── SRS state ─────────────────────────────────────────────────
  const [srsUrgency, setSrsUrgency] = useState('1');
  const [srsAsa, setSrsAsa] = useState('1');
  const [srsSeverity, setSrsSeverity] = useState('1');
  const [srsResult, setSrsResult] = useState(null);

  // ── OS-MRS state ──────────────────────────────────────────────
  const [osmrsFactors, setOsmrsFactors] = useState({
    bmi50: false,
    male: false,
    htn: false,
    pe: false,
    age45: false,
  });
  const [osmrsResult, setOsmrsResult] = useState(null);
  const toggleOsmrs = (key) => setOsmrsFactors(prev => ({ ...prev, [key]: !prev[key] }));

  // Auto-fill OS-MRS from patient
  const osmrsBmi = bmi !== null && bmi >= 50;
  const osmrsMale = patient.gender === 'male';
  const osmrsAge45 = age !== null && age >= 45;

  return (
    <View>
      {/* Section header */}
      <Text style={styles.sectionHeader}>Surgical Risk Scoring</Text>

      {/* ───────── SORT ───────── */}
      <CollapsibleCard title="SORT – Surgical Outcome Risk Tool" icon="chart-bar">
        <Text style={styles.hint}>
          Predicts 30-day in-hospital mortality for non-cardiac surgery (Protopapa et al., Br J Anaesth 2014)
        </Text>

        <PickerSelect
          label="ASA Physical Status"
          options={[
            { value: '0', label: 'ASA 1–2' },
            { value: '1.39', label: 'ASA 3' },
            { value: '8.10', label: 'ASA 4–5' },
          ]}
          selected={sortAsa}
          onSelect={setSortAsa}
        />

        <PickerSelect
          label="Surgery Urgency"
          options={[
            { value: '0', label: 'Elective' },
            { value: '1.56', label: 'Emergency' },
          ]}
          selected={sortUrgency}
          onSelect={setSortUrgency}
        />

        <PickerSelect
          label="Surgical Severity"
          options={[
            { value: '0', label: 'Minor / Intermediate' },
            { value: '1.14', label: 'Major / Complex' },
          ]}
          selected={sortSeverity}
          onSelect={setSortSeverity}
        />

        <PickerSelect
          label="Active Malignancy"
          options={[
            { value: '0', label: 'No' },
            { value: '0.95', label: 'Yes' },
          ]}
          selected={sortMalig}
          onSelect={setSortMalig}
        />

        <PickerSelect
          label="Patient Age"
          options={[
            { value: '0', label: '1–64 years' },
            { value: '0.67', label: '65–79 years' },
            { value: '1.58', label: '≥ 80 years' },
          ]}
          selected={sortAge}
          onSelect={setSortAge}
        />

        <CalcButton
          title="Calculate SORT"
          onPress={() => setSortResult(calculateSORT(sortAsa, sortUrgency, sortSeverity, sortMalig, sortAge))}
        />
        {sortResult && <ResultDisplay result={sortResult.text} type={sortResult.type} />}
      </CollapsibleCard>

      {/* ───────── P-POSSUM ───────── */}
      <CollapsibleCard title="P-POSSUM – Physiological & Operative Severity Score" icon="calculator">
        <Text style={styles.hint}>
          Predicts morbidity & 30-day mortality (Portsmouth-POSSUM model)
        </Text>

        <Text style={styles.subHeader}>Physiological Score</Text>

        <PickerSelect
          label="Age"
          options={[
            { value: '1', label: '≤ 60' },
            { value: '2', label: '61–70' },
            { value: '4', label: '71–80' },
            { value: '8', label: '> 80' },
          ]}
          selected={pAge}
          onSelect={setPAge}
        />
        <PickerSelect
          label="Cardiac Signs"
          options={[
            { value: '1', label: 'No failure' },
            { value: '2', label: 'Diuretic/digoxin/antihypertensive' },
            { value: '4', label: 'Peripheral oedema, warfarin, borderline CM' },
            { value: '8', label: 'Raised JVP, cardiomegaly' },
          ]}
          selected={pCardiac}
          onSelect={setPCardiac}
        />
        <PickerSelect
          label="Respiratory History"
          options={[
            { value: '1', label: 'No dyspnoea' },
            { value: '2', label: 'SOB on exertion / mild COPD' },
            { value: '4', label: 'Limiting dyspnoea / moderate COPD' },
            { value: '8', label: 'Dyspnoea at rest' },
          ]}
          selected={pResp}
          onSelect={setPResp}
        />
        <PickerSelect
          label="Systolic BP (mmHg)"
          options={[
            { value: '1', label: '110–130' },
            { value: '2', label: '131–170 or 100–109' },
            { value: '4', label: '≥ 171 or 90–99' },
            { value: '8', label: '< 90' },
          ]}
          selected={pBP}
          onSelect={setPBP}
        />
        <PickerSelect
          label="Heart Rate (bpm)"
          options={[
            { value: '1', label: '50–80' },
            { value: '2', label: '81–100 or 40–49' },
            { value: '4', label: '101–120' },
            { value: '8', label: '≥ 121 or ≤ 39' },
          ]}
          selected={pPulse}
          onSelect={setPPulse}
        />
        <PickerSelect
          label="GCS"
          options={[
            { value: '1', label: '15' },
            { value: '2', label: '12–14' },
            { value: '4', label: '9–11' },
            { value: '8', label: '≤ 8' },
          ]}
          selected={pGCS}
          onSelect={setPGCS}
        />
        <PickerSelect
          label="Haemoglobin (g/dL)"
          options={[
            { value: '1', label: 'M: 13–16, F: 11.5–13.5' },
            { value: '2', label: 'M: 11.5–12.9 / 16.1–17, F: 10–11.4 / 13.6–15' },
            { value: '4', label: 'M: 10–11.4 / 17.1–18, F: 8.1–9.9 / 15.1–16' },
            { value: '8', label: 'M: <10 / >18, F: <8 / >16' },
          ]}
          selected={pHb}
          onSelect={setPHb}
        />
        <PickerSelect
          label="WBC (×10⁹/L)"
          options={[
            { value: '1', label: '4–10' },
            { value: '2', label: '10.1–20 or 3.1–4' },
            { value: '4', label: '20.1–30 or < 3' },
            { value: '8', label: '> 30' },
          ]}
          selected={pWBC}
          onSelect={setPWBC}
        />
        <PickerSelect
          label="Urea (mmol/L)"
          options={[
            { value: '1', label: '< 7.5' },
            { value: '2', label: '7.5–10' },
            { value: '4', label: '10.1–15' },
            { value: '8', label: '> 15' },
          ]}
          selected={pUrea}
          onSelect={setPUrea}
        />
        <PickerSelect
          label="Sodium (mmol/L)"
          options={[
            { value: '1', label: '≥ 136' },
            { value: '2', label: '131–135' },
            { value: '4', label: '126–130' },
            { value: '8', label: '≤ 125' },
          ]}
          selected={pNa}
          onSelect={setPNa}
        />
        <PickerSelect
          label="Potassium (mmol/L)"
          options={[
            { value: '1', label: '3.5–5.0' },
            { value: '2', label: '3.2–3.4 or 5.1–5.3' },
            { value: '4', label: '2.9–3.1 or 5.4–5.9' },
            { value: '8', label: '< 2.9 or ≥ 6.0' },
          ]}
          selected={pK}
          onSelect={setPK}
        />
        <PickerSelect
          label="ECG"
          options={[
            { value: '1', label: 'Normal' },
            { value: '2', label: 'AF rate 60–90' },
            { value: '4', label: 'Any other arrhythmia' },
            { value: '8', label: '≥5 ectopics/min, Q waves, ST/T changes' },
          ]}
          selected={pECG}
          onSelect={setPECG}
        />

        <Text style={styles.subHeader}>Operative Score</Text>

        <PickerSelect
          label="Operative Severity"
          options={[
            { value: '1', label: 'Minor' },
            { value: '2', label: 'Moderate' },
            { value: '4', label: 'Major' },
            { value: '8', label: 'Major+ (multiple procedures)' },
          ]}
          selected={pOpSev}
          onSelect={setPOpSev}
        />
        <PickerSelect
          label="Multiple Procedures"
          options={[
            { value: '1', label: 'No' },
            { value: '4', label: 'Yes' },
          ]}
          selected={pMulti}
          onSelect={setPMulti}
        />
        <PickerSelect
          label="Estimated Blood Loss (mL)"
          options={[
            { value: '1', label: '< 100' },
            { value: '2', label: '101–500' },
            { value: '4', label: '501–999' },
            { value: '8', label: '≥ 1000' },
          ]}
          selected={pBlood}
          onSelect={setPBlood}
        />
        <PickerSelect
          label="Peritoneal Contamination"
          options={[
            { value: '1', label: 'None / serous fluid' },
            { value: '2', label: 'Minor GI spillage' },
            { value: '4', label: 'Major GI / pus / blood' },
            { value: '8', label: 'Faecal / pus / blood' },
          ]}
          selected={pContam}
          onSelect={setPContam}
        />
        <PickerSelect
          label="Malignancy"
          options={[
            { value: '1', label: 'None' },
            { value: '2', label: 'Primary only' },
            { value: '4', label: 'Nodal metastases' },
            { value: '8', label: 'Distant metastases' },
          ]}
          selected={pMalig}
          onSelect={setPMalig}
        />
        <PickerSelect
          label="Mode of Surgery"
          options={[
            { value: '1', label: 'Elective' },
            { value: '2', label: 'Emergency – resuscitation possible' },
            { value: '4', label: 'Emergency – immediate operation' },
            { value: '8', label: 'Emergency – immediate + ICU' },
          ]}
          selected={pMode}
          onSelect={setPMode}
        />

        <CalcButton
          title="Calculate P-POSSUM"
          onPress={() => {
            const physTotal = [pAge, pCardiac, pResp, pBP, pPulse, pGCS, pHb, pWBC, pUrea, pNa, pK, pECG]
              .reduce((s, v) => s + parseInt(v, 10), 0);
            const opTotal = [pOpSev, pMulti, pBlood, pContam, pMalig, pMode]
              .reduce((s, v) => s + parseInt(v, 10), 0);
            setPossumResult(calculatePPOSSUM(physTotal, opTotal));
          }}
        />
        {possumResult && <ResultDisplay result={possumResult.text} type={possumResult.type} />}
      </CollapsibleCard>

      {/* ───────── ARISCAT ───────── */}
      <CollapsibleCard title="ARISCAT – Respiratory Risk in Surgical Patients" icon="lungs">
        <Text style={styles.hint}>
          Predicts postoperative pulmonary complications (Canet et al., Anesthesiology 2010)
        </Text>

        <PickerSelect
          label="Age"
          options={[
            { value: '0', label: '≤ 50 years (0 pts)' },
            { value: '3', label: '51–80 years (3 pts)' },
            { value: '16', label: '> 80 years (16 pts)' },
          ]}
          selected={arAge}
          onSelect={setArAge}
        />
        <PickerSelect
          label="Preop SpO₂ on room air"
          options={[
            { value: '0', label: '≥ 96% (0 pts)' },
            { value: '8', label: '91–95% (8 pts)' },
            { value: '24', label: '≤ 90% (24 pts)' },
          ]}
          selected={arSpo2}
          onSelect={setArSpo2}
        />
        <PickerSelect
          label="Respiratory infection in last month"
          options={[
            { value: '0', label: 'No (0 pts)' },
            { value: '17', label: 'Yes (17 pts)' },
          ]}
          selected={arInfect}
          onSelect={setArInfect}
        />
        <PickerSelect
          label="Preop anaemia (Hb ≤ 10 g/dL)"
          options={[
            { value: '0', label: 'No (0 pts)' },
            { value: '11', label: 'Yes (11 pts)' },
          ]}
          selected={arAnaemia}
          onSelect={setArAnaemia}
        />
        <PickerSelect
          label="Surgical incision"
          options={[
            { value: '0', label: 'Peripheral / lower abdominal (0 pts)' },
            { value: '15', label: 'Upper abdominal (15 pts)' },
            { value: '24', label: 'Intrathoracic (24 pts)' },
          ]}
          selected={arIncision}
          onSelect={setArIncision}
        />
        <PickerSelect
          label="Surgery duration"
          options={[
            { value: '0', label: '< 2 hours (0 pts)' },
            { value: '16', label: '2–3 hours (16 pts)' },
            { value: '23', label: '> 3 hours (23 pts)' },
          ]}
          selected={arDuration}
          onSelect={setArDuration}
        />
        <PickerSelect
          label="Emergency procedure"
          options={[
            { value: '0', label: 'No (0 pts)' },
            { value: '8', label: 'Yes (8 pts)' },
          ]}
          selected={arEmerg}
          onSelect={setArEmerg}
        />

        <CalcButton
          title="Calculate ARISCAT"
          onPress={() => setAriscatResult(calculateARISCAT(arAge, arSpo2, arInfect, arAnaemia, arIncision, arDuration, arEmerg))}
        />
        {ariscatResult && <ResultDisplay result={ariscatResult.text} type={ariscatResult.type} />}
      </CollapsibleCard>

      {/* ───────── SRS ───────── */}
      <CollapsibleCard title="SRS – Surgical Risk Scale" icon="balance-scale">
        <Text style={styles.hint}>
          Simple 3-variable scoring tool for 30-day mortality prediction (Sutton et al.)
        </Text>

        <PickerSelect
          label="NCEPOD Classification of Urgency"
          options={[
            { value: '1', label: '1 – Elective' },
            { value: '2', label: '2 – Scheduled (within days)' },
            { value: '3', label: '3 – Urgent (within 24 h)' },
            { value: '4', label: '4 – Emergency (immediate)' },
          ]}
          selected={srsUrgency}
          onSelect={setSrsUrgency}
        />
        <PickerSelect
          label="ASA Grade"
          options={[
            { value: '1', label: 'ASA 1' },
            { value: '2', label: 'ASA 2' },
            { value: '3', label: 'ASA 3' },
            { value: '4', label: 'ASA 4' },
            { value: '5', label: 'ASA 5' },
          ]}
          selected={srsAsa}
          onSelect={setSrsAsa}
        />
        <PickerSelect
          label="Operative Severity"
          options={[
            { value: '1', label: '1 – Minor' },
            { value: '2', label: '2 – Intermediate' },
            { value: '3', label: '3 – Major' },
            { value: '4', label: '4 – Major complex' },
          ]}
          selected={srsSeverity}
          onSelect={setSrsSeverity}
        />

        <CalcButton
          title="Calculate SRS"
          onPress={() => setSrsResult(calculateSRS(srsUrgency, srsAsa, srsSeverity))}
        />
        {srsResult && <ResultDisplay result={srsResult.text} type={srsResult.type} />}
      </CollapsibleCard>

      {/* ───────── OS-MRS ───────── */}
      <CollapsibleCard title="OS-MRS – Obesity Surgery Mortality Risk Score" icon="weight-hanging">
        <Text style={styles.hint}>
          Predicts 30-day mortality risk for bariatric surgery (DeMaria et al., 2007)
        </Text>
        {bmi !== null && (
          <Text style={styles.hint}>
            Calculated patient BMI: {bmi.toFixed(1)} kg/m²
          </Text>
        )}

        <CheckboxItem
          label="BMI ≥ 50 kg/m²"
          checked={osmrsFactors.bmi50}
          onToggle={() => toggleOsmrs('bmi50')}
        />
        <CheckboxItem
          label="Male gender"
          checked={osmrsFactors.male}
          onToggle={() => toggleOsmrs('male')}
        />
        <CheckboxItem
          label="Hypertension"
          checked={osmrsFactors.htn}
          onToggle={() => toggleOsmrs('htn')}
        />
        <CheckboxItem
          label="Known risk factors for PE (prior DVT/PE, pulmonary HTN, obesity hypoventilation syndrome)"
          checked={osmrsFactors.pe}
          onToggle={() => toggleOsmrs('pe')}
        />
        <CheckboxItem
          label="Age ≥ 45 years"
          checked={osmrsFactors.age45}
          onToggle={() => toggleOsmrs('age45')}
        />

        <CalcButton
          title="Calculate OS-MRS"
          onPress={() => setOsmrsResult(calculateOSMRS(osmrsFactors))}
        />
        {osmrsResult && <ResultDisplay result={osmrsResult.text} type={osmrsResult.type} />}
      </CollapsibleCard>

      {/* ───────── ACS-NSQIP ───────── */}
      <CollapsibleCard title="ACS-NSQIP Surgical Risk Calculator" icon="external-link-alt">
        <Text style={styles.hint}>
          The ACS-NSQIP calculator uses 30+ procedure-specific and patient variables requiring an institutional database lookup. It is best accessed via the official online tool.
        </Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Variables assessed include:</Text>
          <Text style={styles.infoText}>
            Age, sex, BMI, functional status, ASA class, diabetes, smoking, dyspnoea, COPD, renal failure, dialysis, hypertension, steroid use, bleeding disorder, disseminated cancer, wound class, CPT procedure code.
          </Text>
        </View>
        <View style={[styles.infoBox, { marginTop: SPACING.sm }]}>
          <Text style={styles.infoTitle}>Outcomes predicted:</Text>
          <Text style={styles.infoText}>
            30-day mortality, serious complications, any complication, pneumonia, cardiac arrest, MI, DVT, PE, renal failure, UTI, wound infection, return to OR, discharge to care facility, readmission, length of stay.
          </Text>
        </View>
        <CalcButton
          title="Open ACS-NSQIP Calculator (riskcalculator.facs.org)"
          onPress={() => Linking.openURL('https://riskcalculator.facs.org')}
        />
      </CollapsibleCard>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.medicalBlue,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 13,
    color: COLORS.textMuted,
    lineHeight: 20,
  },
});
