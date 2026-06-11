/**
 * FunctionalNutritionSection
 *
 * Self-contained section component for the Preoperative Assessment screen.
 * Renders TWO section groups:
 *   - Functional Assessment  (DASI, 6MWT, TUGT, 5xSST, CPET)
 *   - Nutrition Status        (MUST, SGA, MNA)
 *
 * All scoring is LOCAL (no dependency on calculators.js).
 * Formulas ported EXACTLY from:
 *   Anaesthesia-Companion/templates/preoperative_collapsible.html
 *
 * Props:
 *   patient – { weight: string, age: string, height: string, gender: 'male'|'female' }
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import CalcButton from '../../components/CalcButton';
import ResultDisplay from '../../components/ResultDisplay';
import { CheckboxItem, PickerSelect } from '../../components/FormControls';
import { COLORS, SPACING } from '../../utils/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Pure calculator functions (ported exactly from the HTML template JS)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * DASI – Duke Activity Status Index
 * Formula: VO₂ peak = 0.43 × DASI + 9.6  (Hlatky et al., JACC 1989)
 * METs = VO₂ peak / 3.5
 */
function scoreDASI(checkedValues) {
  const score = checkedValues.reduce((sum, v) => sum + v, 0);
  const vo2 = parseFloat((0.43 * score + 9.6).toFixed(1));
  const mets = parseFloat((vo2 / 3.5).toFixed(1));
  let risk, type;
  if (vo2 >= 20) {
    risk = 'Good functional capacity – low perioperative risk';
    type = 'success';
  } else if (vo2 >= 14) {
    risk = 'Moderate functional capacity';
    type = 'info';
  } else if (vo2 >= 10) {
    risk = 'Poor functional capacity – elevated risk';
    type = 'warning';
  } else {
    risk = 'Very poor functional capacity – high perioperative risk';
    type = 'danger';
  }
  return {
    text:
      `DASI Score: ${score.toFixed(2)}\n` +
      `Estimated VO₂ peak: ${vo2} mL/kg/min\n` +
      `Equivalent: ~${mets} METs\n` +
      `${risk}\n\n` +
      `VO₂ peak = 0.43 × DASI + 9.6 (Hlatky et al., 1989)`,
    type,
  };
}

/**
 * 6MWT – Six Minute Walk Test
 * Enright reference equations:
 *   Male:   predicted = 7.57 × height(cm) − 5.02 × age − 1.76 × weight(kg) − 309
 *   Female: predicted = 2.11 × height(cm) − 2.29 × age − 5.78 × weight(kg) + 667
 *   (predicted clamped ≥ 200 m)
 */
function scoreSixMWT(dist, age, weight, height, gender) {
  let predicted;
  if (gender === 'male') {
    predicted = 7.57 * height - 5.02 * age - 1.76 * weight - 309;
  } else {
    predicted = 2.11 * height - 2.29 * age - 5.78 * weight + 667;
  }
  predicted = Math.max(predicted, 200);
  const pct = Math.round((dist / predicted) * 100);
  let interp, type;
  if (dist >= 450) {
    interp = 'Good functional capacity';
    type = 'success';
  } else if (dist >= 300) {
    interp = 'Moderate functional capacity – increased perioperative risk';
    type = 'warning';
  } else {
    interp = 'Poor functional capacity – high perioperative risk';
    type = 'danger';
  }
  return {
    text:
      `Distance walked: ${dist} m\n` +
      `Predicted distance (Enright): ${Math.round(predicted)} m\n` +
      `% Predicted: ${pct}%\n` +
      `${interp}\n\n` +
      `ATS/ERS Guidelines; Enright reference equations.\n` +
      `LLN = predicted − 153 m (men) or 139 m (women).`,
    type,
  };
}

/**
 * TUGT – Timed Up and Go Test
 * Cutoffs per template:
 *   ≤10 s → Normal | ≤20 s → Mildly impaired | >20 s → Significantly impaired
 */
function scoreTUGT(seconds) {
  let interp, fallRisk, type;
  if (seconds <= 10) {
    interp = 'Normal mobility';
    fallRisk = 'Low fall risk';
    type = 'success';
  } else if (seconds <= 20) {
    interp = 'Mildly impaired mobility';
    fallRisk = 'Moderate fall risk';
    type = 'warning';
  } else {
    interp = 'Significantly impaired mobility';
    fallRisk = 'High fall risk – physiotherapy referral recommended';
    type = 'danger';
  }
  return {
    text:
      `TUGT: ${seconds} seconds\n` +
      `Mobility: ${interp}\n` +
      `Fall risk: ${fallRisk}\n\n` +
      `≤10s: Normal for community-dwelling adults.\n` +
      `>12s: Increased risk of falls.\n` +
      `>20s: Significant functional impairment.`,
    type,
  };
}

/**
 * 5xSST – Five Times Sit to Stand Test
 * Normative values (Bohannon 2006):
 *   age <60 or 60–69 → normRef 11.4 s
 *   age 70–79 → normRef 12.6 s
 *   age ≥80  → normRef 14.8 s
 */
function scoreFXSST(seconds, age) {
  let normRef;
  if (age < 70) {
    normRef = 11.4;
  } else if (age < 80) {
    normRef = 12.6;
  } else {
    normRef = 14.8;
  }
  let interp, type;
  if (seconds <= normRef) {
    interp = 'Normal lower limb strength for age';
    type = 'success';
  } else if (seconds <= normRef * 1.5) {
    interp = 'Mildly reduced lower limb strength';
    type = 'warning';
  } else {
    interp = 'Significantly impaired lower limb strength – high fall/frailty risk';
    type = 'danger';
  }
  return {
    text:
      `5XSST: ${seconds} seconds\n` +
      `Age-adjusted normal: ≤ ${normRef}s\n` +
      `Interpretation: ${interp}\n\n` +
      `Bohannon 2006 normative values.\n` +
      `>15s predicts falls risk and reduced physical function in older adults.`,
    type,
  };
}

/**
 * CPET – Cardiopulmonary Exercise Test Interpretation
 * VO₂ max thresholds:
 *   >20 → Good – Low risk
 *   14–20 → Moderate – Intermediate risk
 *   10–14 → Poor – High risk
 *   <10  → Very Poor – Very high risk
 * AT thresholds:
 *   >11  → Favourable
 *   8–11 → Intermediate risk
 *   <8   → Elevated risk
 */
function scoreCPET(vo2, at) {
  let vo2Interp = '';
  let atInterp = '';
  let type = 'info';

  if (!isNaN(vo2)) {
    if (vo2 > 20) {
      vo2Interp = 'Good – Low perioperative risk';
      type = 'success';
    } else if (vo2 >= 14) {
      vo2Interp = 'Moderate – Intermediate risk';
      type = 'info';
    } else if (vo2 >= 10) {
      vo2Interp = 'Poor – High risk, careful surgical planning required';
      type = 'warning';
    } else {
      vo2Interp = 'Very Poor – Very high risk, consider appropriateness of surgery';
      type = 'danger';
    }
  }

  if (!isNaN(at)) {
    if (at > 11) {
      atInterp = 'Favourable';
    } else if (at >= 8) {
      atInterp = 'Intermediate risk';
    } else {
      atInterp = 'Elevated risk (<8 mL/kg/min = high postoperative complication risk)';
    }
  }

  const lines = [];
  if (!isNaN(vo2)) lines.push(`VO₂ max: ${vo2} mL/kg/min — ${vo2Interp}`);
  if (!isNaN(at)) lines.push(`Anaerobic Threshold: ${at} mL/kg/min — ${atInterp}`);
  lines.push('');
  lines.push('Key thresholds:');
  lines.push('VO₂ max: >20 = low risk | 14–20 = moderate | 10–14 = high | <10 = very high');
  lines.push('AT: >11 = favourable | 8–11 = intermediate | <8 = elevated risk');
  lines.push('');
  lines.push('Refer to cardiology/respiratory if VO₂ max <10 mL/kg/min before major surgery.');

  return { text: lines.join('\n'), type };
}

// ─────────────────────────────────────────────────────────────────────────────
// Nutrition calculators
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MUST – Malnutrition Universal Screening Tool (BAPEN)
 * Step 1: BMI score  (auto or manual)
 * Step 2: Unplanned weight loss score
 * Step 3: Acute disease score
 * Total 0 → Low | 1 → Medium | ≥2 → High
 */
function scoreMUST(bmiMode, bmiManual, wtLoss, acute, weight, height) {
  let bmiScore = 0;
  if (bmiMode === 'auto') {
    const w = parseFloat(weight);
    const h = parseFloat(height);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      const bmi = w / ((h / 100) ** 2);
      bmiScore = bmi > 20 ? 0 : bmi >= 18.5 ? 1 : 2;
    }
  } else {
    bmiScore = parseInt(bmiManual, 10);
  }
  const wtLossInt = parseInt(wtLoss, 10);
  const acuteInt = parseInt(acute, 10);
  const total = bmiScore + wtLossInt + acuteInt;

  let risk, type, action;
  if (total === 0) {
    risk = 'Low Risk';
    type = 'success';
    action =
      'Routine clinical care. Repeat screening: hospital weekly, care home monthly, community annually.';
  } else if (total === 1) {
    risk = 'Medium Risk';
    type = 'warning';
    action =
      'Observe. Dietary advice and monitoring. Repeat screening: hospital weekly, care home monthly.';
  } else {
    risk = 'High Risk';
    type = 'danger';
    action =
      'Treat: set nutrition goals, improve intake, monitor and review. Refer to dietitian.';
  }

  return {
    text:
      `MUST Score: ${total}\n` +
      `BMI score: ${bmiScore} | Weight loss score: ${wtLossInt} | Acute disease: ${acuteInt}\n` +
      `Risk: ${risk}\n` +
      `${action}\n\n` +
      `BAPEN MUST Tool. www.bapen.org.uk`,
    type,
  };
}

/**
 * SGA – Subjective Global Assessment (Detsky et al., 1987)
 * 7 domains each rated A / B / C
 * Rating logic (per template):
 *   C ≥ 3, OR (C ≥ 2 AND fat=C AND muscle=C) → SGA C – Severely malnourished
 *   B ≥ 3, OR C ≥ 1                           → SGA B – Mildly/moderately malnourished
 *   Otherwise                                  → SGA A – Well nourished
 * Domain order: [weight, diet, gi, func, disease, fat, muscle]
 */
function scoreSGA(weight, diet, gi, func, disease, fat, muscle) {
  const domains = [weight, diet, gi, func, disease, fat, muscle];
  const cCount = domains.filter((s) => s === 'C').length;
  const bCount = domains.filter((s) => s === 'B').length;

  let rating, type, action;
  if (cCount >= 3 || (cCount >= 2 && fat === 'C' && muscle === 'C')) {
    rating = 'SGA C – Severely malnourished';
    type = 'danger';
    action =
      'Urgent dietitian referral. Consider enteral/parenteral nutrition support pre-operatively. ' +
      'Discuss with surgeon regarding delay of elective surgery.';
  } else if (bCount >= 3 || cCount >= 1) {
    rating = 'SGA B – Mildly to moderately malnourished';
    type = 'warning';
    action =
      'Dietitian review. Nutritional supplementation and dietary counselling. Reassess at 2–4 weeks.';
  } else {
    rating = 'SGA A – Well nourished';
    type = 'success';
    action = 'Standard care. Continue routine nutritional monitoring.';
  }

  return {
    text:
      `${rating}\n${action}\n\n` +
      `SGA is based on clinician assessment, not a simple point score.\n` +
      `Final rating reflects overall clinical judgement.`,
    type,
  };
}

/**
 * MNA – Mini Nutritional Assessment Screening (Guigoz et al.)
 * 6 items, max 14 points
 * Score ≥ 12 → Normal | ≤ 11 → At risk
 */
function scoreMNA(a, b, c, d, e, f) {
  const score = parseInt(a, 10) + parseInt(b, 10) + parseInt(c, 10) +
                parseInt(d, 10) + parseInt(e, 10) + parseInt(f, 10);
  let status, type, action;
  if (score >= 12) {
    status = 'Normal nutritional status';
    type = 'success';
    action =
      'No further assessment needed. Re-screen at next admission or as clinically indicated.';
  } else {
    status = 'At risk of malnutrition – full MNA-SF recommended';
    type = 'warning';
    action =
      `Score ≤11: Refer for full MNA assessment and dietitian review.\n` +
      `Full MNA score ≥24 = Normal | 17–23.5 = At risk | <17 = Malnourished`;
  }
  return {
    text:
      `MNA Screening Score: ${score}/14\n` +
      `Status: ${status}\n` +
      `${action}\n\n` +
      `Validated for adults ≥65 years. Guigoz et al. Nutrition Reviews 1994.`,
    type,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// DASI item definitions (value, label) – per template HTML
// ─────────────────────────────────────────────────────────────────────────────
const DASI_ITEMS = [
  { value: 2.75, label: 'Take care of yourself (eat, dress, bathe, toilet)' },
  { value: 1.75, label: 'Walk indoors such as around your house' },
  { value: 2.75, label: 'Walk 1–2 blocks on level ground' },
  { value: 5.50, label: 'Climb a flight of stairs or walk uphill' },
  { value: 8.00, label: 'Run a short distance' },
  { value: 2.70, label: 'Light housework (cooking, dusting)' },
  { value: 3.50, label: 'Moderate housework (vacuuming, carrying groceries)' },
  { value: 8.00, label: 'Heavy housework (scrubbing floors, moving furniture)' },
  { value: 4.50, label: 'Yard work (raking leaves, weeding, mowing)' },
  { value: 5.25, label: 'Sexual activities' },
  { value: 6.00, label: 'Participate in moderate recreational activities (golf, bowling, dancing, doubles tennis)' },
  { value: 7.50, label: 'Participate in strenuous sports (swimming, singles tennis, football, basketball)' },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main exported component
// ─────────────────────────────────────────────────────────────────────────────
export default function FunctionalNutritionSection({ patient = {} }) {
  // Normalise patient props (all may be empty strings)
  const patAge    = parseFloat(patient.age)    || NaN;
  const patWeight = parseFloat(patient.weight) || NaN;
  const patHeight = parseFloat(patient.height) || NaN;
  const patGender = patient.gender === 'female' ? 'female' : 'male';

  // ── DASI ──────────────────────────────────────────────────────────────────
  const [dasiChecked, setDasiChecked] = useState(
    () => DASI_ITEMS.map(() => false)
  );
  const [dasiResult, setDasiResult] = useState(null);

  const toggleDasi = (idx) => {
    setDasiChecked((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  const calcDASI = () => {
    const checked = DASI_ITEMS.filter((_, i) => dasiChecked[i]).map((item) => item.value);
    setDasiResult(scoreDASI(checked));
  };

  // ── 6MWT ──────────────────────────────────────────────────────────────────
  const [sixmwtDist, setSixmwtDist] = useState('');
  const [sixmwtResult, setSixmwtResult] = useState(null);

  const calc6MWT = () => {
    const dist = parseFloat(sixmwtDist);
    if (isNaN(dist)) {
      setSixmwtResult({ text: 'Please enter the distance walked (metres).', type: 'warning' });
      return;
    }
    const age    = isNaN(patAge)    ? 65  : patAge;
    const weight = isNaN(patWeight) ? 70  : patWeight;
    const height = isNaN(patHeight) ? 170 : patHeight;
    setSixmwtResult(scoreSixMWT(dist, age, weight, height, patGender));
  };

  // ── TUGT ──────────────────────────────────────────────────────────────────
  const [tugtTime, setTugtTime] = useState('');
  const [tugtResult, setTugtResult] = useState(null);

  const calcTUGT = () => {
    const t = parseFloat(tugtTime);
    if (isNaN(t)) {
      setTugtResult({ text: 'Please enter time in seconds.', type: 'warning' });
      return;
    }
    setTugtResult(scoreTUGT(t));
  };

  // ── 5xSST ─────────────────────────────────────────────────────────────────
  const [fxsstTime, setFxsstTime] = useState('');
  const [fxsstResult, setFxsstResult] = useState(null);

  const calcFXSST = () => {
    const t = parseFloat(fxsstTime);
    if (isNaN(t)) {
      setFxsstResult({ text: 'Please enter time in seconds.', type: 'warning' });
      return;
    }
    const age = isNaN(patAge) ? 65 : patAge;
    setFxsstResult(scoreFXSST(t, age));
  };

  // ── CPET ──────────────────────────────────────────────────────────────────
  const [cpetVo2, setCpetVo2] = useState('');
  const [cpetAt, setCpetAt]   = useState('');
  const [cpetResult, setCpetResult] = useState(null);

  const calcCPET = () => {
    const vo2 = parseFloat(cpetVo2);
    const at  = parseFloat(cpetAt);
    if (isNaN(vo2) && isNaN(at)) {
      setCpetResult({ text: 'Please enter at least one CPET value.', type: 'warning' });
      return;
    }
    setCpetResult(scoreCPET(vo2, at));
  };

  // ── MUST ──────────────────────────────────────────────────────────────────
  const [mustBmiMode, setMustBmiMode] = useState('auto');
  const [mustBmiManual, setMustBmiManual] = useState('0');
  const [mustWtLoss, setMustWtLoss]   = useState('0');
  const [mustAcute, setMustAcute]     = useState('0');
  const [mustResult, setMustResult]   = useState(null);

  const calcMUST = () => {
    setMustResult(
      scoreMUST(
        mustBmiMode,
        mustBmiManual,
        mustWtLoss,
        mustAcute,
        patient.weight,
        patient.height
      )
    );
  };

  // ── SGA ───────────────────────────────────────────────────────────────────
  const [sgaWeight,  setSgaWeight]  = useState('A');
  const [sgaDiet,    setSgaDiet]    = useState('A');
  const [sgaGI,      setSgaGI]      = useState('A');
  const [sgaFunc,    setSgaFunc]    = useState('A');
  const [sgaDisease, setSgaDisease] = useState('A');
  const [sgaFat,     setSgaFat]     = useState('A');
  const [sgaMuscle,  setSgaMuscle]  = useState('A');
  const [sgaResult, setSgaResult]   = useState(null);

  const calcSGA = () => {
    setSgaResult(scoreSGA(sgaWeight, sgaDiet, sgaGI, sgaFunc, sgaDisease, sgaFat, sgaMuscle));
  };

  // ── MNA ───────────────────────────────────────────────────────────────────
  const [mnaA, setMnaA] = useState('2');
  const [mnaB, setMnaB] = useState('3');
  const [mnaC, setMnaC] = useState('2');
  const [mnaD, setMnaD] = useState('2');
  const [mnaE, setMnaE] = useState('2');
  const [mnaF, setMnaF] = useState('3');
  const [mnaResult, setMnaResult] = useState(null);

  const calcMNA = () => {
    const age = isNaN(patAge) ? 65 : patAge;
    if (age < 65) {
      setMnaResult({
        text: 'MNA is validated for patients aged ≥65 years. Patient age appears to be below this threshold.',
        type: 'warning',
      });
      return;
    }
    setMnaResult(scoreMNA(mnaA, mnaB, mnaC, mnaD, mnaE, mnaF));
  };

  // ─────────────────────────────────────────────────────────────────────────
  // Picker option helpers
  // ─────────────────────────────────────────────────────────────────────────
  const SGA_OPTIONS = [
    { value: 'A', label: 'A – Well nourished / No change' },
    { value: 'B', label: 'B – Mild / Moderate concern' },
    { value: 'C', label: 'C – Severe deficit' },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <View>
      {/* ══════════════════ SECTION HEADER: FUNCTIONAL ══════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Functional Assessment</Text>
      </View>

      {/* ── DASI ─────────────────────────────────────────────────────── */}
      <CollapsibleCard title="DASI – Duke Activity Status Index" icon="heartbeat">
        <Text style={styles.hint}>
          Estimates functional capacity (VO₂ peak) from 12 self-reported activities
          (Hlatky et al., JACC 1989). Tick each activity the patient CAN perform.
        </Text>
        {DASI_ITEMS.map((item, idx) => (
          <CheckboxItem
            key={idx}
            label={`${item.label} (${item.value} pts)`}
            checked={dasiChecked[idx]}
            onToggle={() => toggleDasi(idx)}
          />
        ))}
        <CalcButton title="Calculate DASI" onPress={calcDASI} />
        {dasiResult && <ResultDisplay result={dasiResult.text} type={dasiResult.type} />}
      </CollapsibleCard>

      {/* ── 6MWT ─────────────────────────────────────────────────────── */}
      <CollapsibleCard title="6MWT – Six Minute Walk Test" icon="walking">
        <Text style={styles.hint}>
          Distance walked in 6 minutes on a flat surface. Uses Enright reference equations.
          Patient demographics from the Patient Info card are used automatically.
        </Text>
        <Text style={styles.label}>Distance walked (metres)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={sixmwtDist}
          onChangeText={setSixmwtDist}
          placeholder="e.g. 450"
        />
        <Text style={styles.hint}>
          Protocol: Patient walks at own pace for 6 minutes on 30 m corridor.
          Record SpO₂, HR, Borg dyspnoea score and any stops.
        </Text>
        <CalcButton title="Calculate 6MWT" onPress={calc6MWT} />
        {sixmwtResult && <ResultDisplay result={sixmwtResult.text} type={sixmwtResult.type} />}
      </CollapsibleCard>

      {/* ── TUGT ─────────────────────────────────────────────────────── */}
      <CollapsibleCard title="TUGT – Timed Up and Go Test" icon="chair">
        <Text style={styles.hint}>
          Measures mobility, balance, and fall risk. Patient rises from chair, walks 3 metres,
          turns, returns, sits down.
        </Text>
        <Text style={styles.label}>Time to complete (seconds)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={tugtTime}
          onChangeText={setTugtTime}
          placeholder="e.g. 12"
        />
        <CalcButton title="Interpret TUGT" onPress={calcTUGT} />
        {tugtResult && <ResultDisplay result={tugtResult.text} type={tugtResult.type} />}
      </CollapsibleCard>

      {/* ── 5xSST ────────────────────────────────────────────────────── */}
      <CollapsibleCard title="5×SST – Five Times Sit to Stand Test" icon="sort-amount-up">
        <Text style={styles.hint}>
          Measures lower extremity strength and functional mobility. Patient stands up from chair
          5 times as fast as possible without using arms.
        </Text>
        <Text style={styles.label}>Time to complete 5 repetitions (seconds)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={fxsstTime}
          onChangeText={setFxsstTime}
          placeholder="e.g. 12"
        />
        <CalcButton title="Interpret 5×SST" onPress={calcFXSST} />
        {fxsstResult && <ResultDisplay result={fxsstResult.text} type={fxsstResult.type} />}
      </CollapsibleCard>

      {/* ── CPET ─────────────────────────────────────────────────────── */}
      <CollapsibleCard title="CPET – Cardiopulmonary Exercise Test Interpretation" icon="bicycle">
        <Text style={styles.hint}>
          Interprets VO₂ max and anaerobic threshold (AT) values from formal CPET testing.
        </Text>
        <Text style={styles.label}>VO₂ max (mL/kg/min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={cpetVo2}
          onChangeText={setCpetVo2}
          placeholder="e.g. 18"
        />
        <Text style={styles.label}>Anaerobic Threshold (mL/kg/min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={cpetAt}
          onChangeText={setCpetAt}
          placeholder="e.g. 10"
        />
        <CalcButton title="Interpret CPET" onPress={calcCPET} />
        {cpetResult && <ResultDisplay result={cpetResult.text} type={cpetResult.type} />}
      </CollapsibleCard>

      {/* ══════════════════ SECTION HEADER: NUTRITION ══════════════════ */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>Nutrition Status</Text>
      </View>

      {/* ── MUST ─────────────────────────────────────────────────────── */}
      <CollapsibleCard title="MUST – Malnutrition Universal Screening Tool" icon="utensils">
        <Text style={styles.hint}>
          BAPEN-validated screening tool. Patient weight and height are used automatically
          for BMI calculation when &quot;Auto-calculate&quot; is selected.
        </Text>

        {/* Step 1: BMI */}
        <Text style={styles.stepLabel}>Step 1: BMI Score</Text>
        <PickerSelect
          label="BMI source"
          options={[
            { value: 'auto', label: 'Auto-calculate from patient info' },
            { value: '0',    label: 'BMI > 20 kg/m² (0 points)' },
            { value: '1',    label: 'BMI 18.5–20 kg/m² (1 point)' },
            { value: '2',    label: 'BMI < 18.5 kg/m² (2 points)' },
          ]}
          selected={mustBmiMode}
          onSelect={(val) => {
            setMustBmiMode(val);
            if (val !== 'auto') setMustBmiManual(val);
          }}
        />

        {/* Step 2: Weight loss */}
        <Text style={styles.stepLabel}>Step 2: Unplanned Weight Loss in Past 3–6 Months</Text>
        <PickerSelect
          label="Weight loss"
          options={[
            { value: '0', label: '< 5% (0 points)' },
            { value: '1', label: '5–10% (1 point)' },
            { value: '2', label: '> 10% (2 points)' },
          ]}
          selected={mustWtLoss}
          onSelect={setMustWtLoss}
        />

        {/* Step 3: Acute disease */}
        <Text style={styles.stepLabel}>Step 3: Acute Disease Effect</Text>
        <PickerSelect
          label="Acute illness"
          options={[
            { value: '0', label: 'No acute illness / likely to eat within 5 days (0 points)' },
            { value: '2', label: 'Acutely ill AND no nutritional intake > 5 days (2 points)' },
          ]}
          selected={mustAcute}
          onSelect={setMustAcute}
        />

        <CalcButton title="Calculate MUST" onPress={calcMUST} />
        {mustResult && <ResultDisplay result={mustResult.text} type={mustResult.type} />}
      </CollapsibleCard>

      {/* ── SGA ──────────────────────────────────────────────────────── */}
      <CollapsibleCard title="SGA – Subjective Global Assessment" icon="clipboard">
        <Text style={styles.hint}>
          Clinician-assessed nutritional status rating (Detsky et al., 1987).
          Based on history and physical examination.
        </Text>

        <Text style={styles.subHeading}>History</Text>

        <PickerSelect
          label="Weight change (past 6 months)"
          options={[
            { value: 'A', label: 'No change / increase' },
            { value: 'B', label: 'Loss < 5%' },
            { value: 'C', label: 'Loss > 5%' },
          ]}
          selected={sgaWeight}
          onSelect={setSgaWeight}
        />
        <PickerSelect
          label="Dietary intake change"
          options={[
            { value: 'A', label: 'No change / adequate intake' },
            { value: 'B', label: 'Suboptimal solid diet' },
            { value: 'C', label: 'Full liquid / starvation' },
          ]}
          selected={sgaDiet}
          onSelect={setSgaDiet}
        />
        <PickerSelect
          label="GI symptoms (> 2 weeks)"
          options={[
            { value: 'A', label: 'None' },
            { value: 'B', label: 'Intermittent nausea/vomiting' },
            { value: 'C', label: 'Daily nausea/vomiting/diarrhoea' },
          ]}
          selected={sgaGI}
          onSelect={setSgaGI}
        />
        <PickerSelect
          label="Functional capacity"
          options={[
            { value: 'A', label: 'Normal / mild reduction' },
            { value: 'B', label: 'Moderate reduction / ambulatory' },
            { value: 'C', label: 'Bedridden' },
          ]}
          selected={sgaFunc}
          onSelect={setSgaFunc}
        />
        <PickerSelect
          label="Disease & metabolic demand"
          options={[
            { value: 'A', label: 'Low / no stress' },
            { value: 'B', label: 'Moderate stress (minor surgery, mild infection)' },
            { value: 'C', label: 'High stress (major surgery, sepsis, burns)' },
          ]}
          selected={sgaDisease}
          onSelect={setSgaDisease}
        />

        <Text style={styles.subHeading}>Physical Examination</Text>

        <PickerSelect
          label="Subcutaneous fat loss"
          options={SGA_OPTIONS}
          selected={sgaFat}
          onSelect={setSgaFat}
        />
        <PickerSelect
          label="Muscle wasting"
          options={SGA_OPTIONS}
          selected={sgaMuscle}
          onSelect={setSgaMuscle}
        />

        <CalcButton title="Rate SGA" onPress={calcSGA} />
        {sgaResult && <ResultDisplay result={sgaResult.text} type={sgaResult.type} />}
      </CollapsibleCard>

      {/* ── MNA ──────────────────────────────────────────────────────── */}
      <CollapsibleCard title="MNA – Mini Nutritional Assessment (≥65 years)" icon="user-alt">
        <Text style={styles.hint}>
          Validated for nutritional assessment in elderly patients (Guigoz et al.).
          MNA screening; if score ≤11, proceed to full MNA assessment.
          {'\n'}Max 14 points.
        </Text>
        {!isNaN(patAge) && patAge < 65 && (
          <Text style={styles.ageWarning}>
            Note: Patient age ({Math.round(patAge)} years) is below the validated threshold
            of 65 years for MNA.
          </Text>
        )}

        <PickerSelect
          label="A. Decline in food intake over past 3 months"
          options={[
            { value: '0', label: 'Severe decline (0)' },
            { value: '1', label: 'Moderate decline (1)' },
            { value: '2', label: 'No decline (2)' },
          ]}
          selected={mnaA}
          onSelect={setMnaA}
        />
        <PickerSelect
          label="B. Weight loss in past 3 months"
          options={[
            { value: '0', label: 'Loss > 3 kg (0)' },
            { value: '1', label: 'Does not know (1)' },
            { value: '2', label: 'Loss 1–3 kg (2)' },
            { value: '3', label: 'No weight loss (3)' },
          ]}
          selected={mnaB}
          onSelect={setMnaB}
        />
        <PickerSelect
          label="C. Mobility"
          options={[
            { value: '0', label: 'Bed/chair bound (0)' },
            { value: '1', label: 'Gets out of bed/chair but does not go out (1)' },
            { value: '2', label: 'Goes out (2)' },
          ]}
          selected={mnaC}
          onSelect={setMnaC}
        />
        <PickerSelect
          label="D. Acute disease or psychological stress in past 3 months"
          options={[
            { value: '0', label: 'Yes (0)' },
            { value: '2', label: 'No (2)' },
          ]}
          selected={mnaD}
          onSelect={setMnaD}
        />
        <PickerSelect
          label="E. Neuropsychological problems"
          options={[
            { value: '0', label: 'Severe dementia or depression (0)' },
            { value: '1', label: 'Mild dementia (1)' },
            { value: '2', label: 'None (2)' },
          ]}
          selected={mnaE}
          onSelect={setMnaE}
        />
        <PickerSelect
          label="F. BMI (kg/m²)"
          options={[
            { value: '0', label: 'BMI < 19 (0)' },
            { value: '1', label: 'BMI 19–21 (1)' },
            { value: '2', label: 'BMI 21–23 (2)' },
            { value: '3', label: 'BMI ≥ 23 (3)' },
          ]}
          selected={mnaF}
          onSelect={setMnaF}
        />

        <CalcButton title="Calculate MNA Screening" onPress={calcMNA} />
        {mnaResult && <ResultDisplay result={mnaResult.text} type={mnaResult.type} />}
      </CollapsibleCard>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles (match PreoperativeScreen conventions)
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: COLORS.medicalBlue,
    paddingVertical: SPACING.sm + 2,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionHeaderText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  subHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  ageWarning: {
    fontSize: 12,
    color: '#856404',
    backgroundColor: '#fff3cd',
    padding: SPACING.sm,
    borderRadius: 6,
    marginBottom: SPACING.sm,
  },
});
