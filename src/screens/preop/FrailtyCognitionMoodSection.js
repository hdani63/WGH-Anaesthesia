/**
 * FrailtyCognitionMoodSection
 *
 * Self-contained section component for the Preoperative Assessment screen.
 * Renders three collapsible section groups:
 *   1. Frailty Assessment  – RCFS, EFS
 *   2. Cognition           – 4AT, MMSE, MoCA
 *   3. Anxiety & Depression – HADS
 *
 * All scoring is local (no dependency on calculators.js).
 * Props: { patient }  (patient object from PreoperativeScreen – currently unused
 *                       but available for future extension)
 */

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import CalcButton from '../../components/CalcButton';
import ResultDisplay from '../../components/ResultDisplay';
import { RadioGroup, PickerSelect } from '../../components/FormControls';
import { COLORS, SPACING } from '../../utils/theme';

// ---------------------------------------------------------------------------
// Helper: clamp a string input value to an integer in [min, max]
// ---------------------------------------------------------------------------
function clampInt(str, min, max) {
  const v = parseInt(str, 10);
  if (isNaN(v)) return NaN;
  return Math.min(Math.max(v, min), max);
}

// ---------------------------------------------------------------------------
// Section header component (matches cat-header style from HTML template)
// ---------------------------------------------------------------------------
function SectionHeader({ title }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// RCFS – Rockwood Clinical Frailty Scale
// Scoring: 9 levels. Each level carries a label + perioperative implication.
// Source: Rockwood et al., CMAJ 2005
// ---------------------------------------------------------------------------
function RCFSCard() {
  const [rcfsScore, setRcfsScore] = useState(null);
  const [result, setResult] = useState(null);

  const options = [
    { value: '1', label: '1 – Very Fit: Robust, active, energetic, well motivated. Exercises regularly.' },
    { value: '2', label: '2 – Well: No active disease symptoms. Exercises occasionally.' },
    { value: '3', label: '3 – Managing Well: Well-treated conditions. Active but not regularly.' },
    { value: '4', label: '4 – Vulnerable: Not dependent; slowed up and/or tires easily. Symptoms limit activities.' },
    { value: '5', label: '5 – Mildly Frail: Limited dependence on others for instrumental ADLs.' },
    { value: '6', label: '6 – Moderately Frail: Needs help with all outside activities and housekeeping. Indoor independence.' },
    { value: '7', label: '7 – Severely Frail: Completely dependent for personal care, but stable and not at high risk of dying.' },
    { value: '8', label: '8 – Very Severely Frail: Completely dependent; approaching end of life.' },
    { value: '9', label: '9 – Terminally Ill: Life expectancy < 6 months.' },
  ];

  const implications = {
    1: { label: 'Very Fit', type: 'success', advice: 'Excellent physiological reserve. Proceed as planned.' },
    2: { label: 'Well', type: 'success', advice: 'Good reserve. Standard perioperative care.' },
    3: { label: 'Managing Well', type: 'info', advice: 'Minor vulnerabilities. Standard perioperative care with early mobilisation.' },
    4: { label: 'Vulnerable', type: 'info', advice: 'Consider enhanced recovery protocol. Early physiotherapy.' },
    5: {
      label: 'Mildly Frail',
      type: 'warning',
      advice:
        'Elevated perioperative risk. Comprehensive geriatric assessment recommended for major surgery. Enhanced recovery, early mobilisation, delirium prevention.',
    },
    6: {
      label: 'Moderately Frail',
      type: 'warning',
      advice:
        'Significantly elevated risk. Multidisciplinary discussion. Assess goals of care. CPEX if major surgery planned.',
    },
    7: {
      label: 'Severely Frail',
      type: 'danger',
      advice:
        'High risk of major complications, delirium, and functional decline. Weigh surgical benefit vs risk carefully. Consider palliative/conservative approaches.',
    },
    8: {
      label: 'Very Severely Frail',
      type: 'danger',
      advice: 'Extremely high risk. Surgery likely futile unless for palliation. Goals of care discussion essential.',
    },
    9: {
      label: 'Terminally Ill',
      type: 'danger',
      advice: 'Surgery for comfort/palliation only. Full palliative care team involvement.',
    },
  };

  function calculate() {
    if (!rcfsScore) {
      setResult({ text: 'Please select a CFS level.', type: 'info' });
      return;
    }
    const s = parseInt(rcfsScore, 10);
    const imp = implications[s];
    setResult({
      text: `RCFS ${s} – ${imp.label}\n\n${imp.advice}`,
      type: imp.type,
    });
  }

  return (
    <CollapsibleCard title="RCFS – Rockwood Clinical Frailty Scale" icon="user-injured">
      <Text style={styles.hint}>
        Global clinical judgement scale (Rockwood et al., CMAJ 2005). Select the description that best fits the patient.
      </Text>
      <RadioGroup options={options} selected={rcfsScore} onSelect={setRcfsScore} />
      <CalcButton title="Interpret RCFS" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// EFS – Edmonton Frail Scale
// 11 domains, max 17 points.
// Banding: 0–5 Not Frail | 6–7 Vulnerable | 8–9 Mild | 10–11 Moderate | 12+ Severe
// Source: Rolfson et al., Age & Ageing 2006
// ---------------------------------------------------------------------------
function EFSCard() {
  const [efsClock, setEfsClock] = useState('0');
  const [efsHealth, setEfsHealth] = useState('0');
  const [efsADL, setEfsADL] = useState('0');
  const [efsSocial, setEfsSocial] = useState('0');
  const [efsMeds, setEfsMeds] = useState('0');
  const [efsNutrition, setEfsNutrition] = useState('0');
  const [efsMood, setEfsMood] = useState('0');
  const [efsContinence, setEfsContinence] = useState('0');
  const [efsTUG, setEfsTUG] = useState('0');
  const [efsAttitudes, setEfsAttitudes] = useState('0');
  const [efsHosp, setEfsHosp] = useState('0');
  const [result, setResult] = useState(null);

  const domainFields = [
    {
      label: '1. Cognitive Performance (Clock Drawing Test)',
      state: efsClock,
      setter: setEfsClock,
      options: [
        { value: '0', label: 'No errors (0)' },
        { value: '1', label: 'Minor errors (1)' },
        { value: '2', label: 'Major errors / unable (2)' },
      ],
    },
    {
      label: '2. General Health Status',
      state: efsHealth,
      setter: setEfsHealth,
      options: [
        { value: '0', label: 'Excellent / Very good / Good (0)' },
        { value: '1', label: 'Fair (1)' },
        { value: '2', label: 'Poor (2)' },
      ],
    },
    {
      label: '3. Functional Independence (ADLs)',
      state: efsADL,
      setter: setEfsADL,
      options: [
        { value: '0', label: '0–1 ADL dependencies (0)' },
        { value: '1', label: '2–4 ADL dependencies (1)' },
        { value: '2', label: '5–8 ADL dependencies (2)' },
      ],
    },
    {
      label: '4. Social Support (help when needed)',
      state: efsSocial,
      setter: setEfsSocial,
      options: [
        { value: '0', label: 'Always (0)' },
        { value: '1', label: 'Sometimes (1)' },
        { value: '2', label: 'Never (2)' },
      ],
    },
    {
      label: '5. Medication Use',
      state: efsMeds,
      setter: setEfsMeds,
      options: [
        { value: '0', label: '0–4 medications (0)' },
        { value: '1', label: '5–8 medications (1)' },
        { value: '2', label: '≥ 9 medications (2)' },
      ],
    },
    {
      label: '6. Nutrition (recent weight loss > 5 kg)',
      state: efsNutrition,
      setter: setEfsNutrition,
      options: [
        { value: '0', label: 'No (0)' },
        { value: '1', label: 'Yes (1)' },
      ],
    },
    {
      label: '7. Mood (feels sad or depressed often)',
      state: efsMood,
      setter: setEfsMood,
      options: [
        { value: '0', label: 'No (0)' },
        { value: '1', label: 'Yes (1)' },
      ],
    },
    {
      label: '8. Continence (urinary incontinence)',
      state: efsContinence,
      setter: setEfsContinence,
      options: [
        { value: '0', label: 'No (0)' },
        { value: '1', label: 'Yes (1)' },
      ],
    },
    {
      label: '9. Functional Performance (Timed Up and Go)',
      state: efsTUG,
      setter: setEfsTUG,
      options: [
        { value: '0', label: '≤ 10 seconds (0)' },
        { value: '1', label: '11–20 seconds (1)' },
        { value: '2', label: '> 20 seconds or unable (2)' },
      ],
    },
    {
      label: '10. Health Attitudes ("Too old to worry about health")',
      state: efsAttitudes,
      setter: setEfsAttitudes,
      options: [
        { value: '0', label: 'No (0)' },
        { value: '1', label: 'Yes (1)' },
      ],
    },
    {
      label: '11. Hospitalisation in past year (≥ 1)',
      state: efsHosp,
      setter: setEfsHosp,
      options: [
        { value: '0', label: 'No (0)' },
        { value: '1', label: 'Yes (1)' },
      ],
    },
  ];

  function calculate() {
    const states = [efsClock, efsHealth, efsADL, efsSocial, efsMeds, efsNutrition, efsMood, efsContinence, efsTUG, efsAttitudes, efsHosp];
    const score = states.reduce((acc, v) => acc + parseInt(v, 10), 0);

    let level, type, advice;
    if (score <= 5) {
      level = 'Not Frail';
      type = 'success';
      advice = 'Standard perioperative care.';
    } else if (score <= 7) {
      level = 'Vulnerable';
      type = 'info';
      advice = 'Enhanced monitoring. Delirium prevention. Early mobilisation.';
    } else if (score <= 9) {
      level = 'Mild Frailty';
      type = 'warning';
      advice = 'Comprehensive geriatric assessment. Enhanced recovery. Dietitian and physio referral.';
    } else if (score <= 11) {
      level = 'Moderate Frailty';
      type = 'warning';
      advice = 'Multidisciplinary team discussion for major surgery. High risk of postoperative delirium and functional decline.';
    } else {
      level = 'Severe Frailty';
      type = 'danger';
      advice = 'Very high perioperative risk. Consider goals of care. Conservative management where possible.';
    }

    setResult({
      text: `Edmonton Frail Scale: ${score}/17\nLevel: ${level}\n\n${advice}`,
      type,
    });
  }

  return (
    <CollapsibleCard title="EFS – Edmonton Frail Scale" icon="walking">
      <Text style={styles.hint}>
        Validated 11-domain frailty assessment (Rolfson et al., Age &amp; Ageing 2006). Max score 17.
      </Text>
      {domainFields.map((field, idx) => (
        <PickerSelect
          key={idx}
          label={field.label}
          options={field.options}
          selected={field.state}
          onSelect={field.setter}
        />
      ))}
      <CalcButton title="Calculate EFS" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// 4AT – Rapid Delirium / Cognitive Assessment
// 4 items; max 12 points.
// Banding: 0 unlikely | 1–3 possible CI | >=4 delirium likely
// Source: Bellelli et al., BMC Medicine 2014
// ---------------------------------------------------------------------------
function FourATCard() {
  const [alertness, setAlertness] = useState('0');
  const [amt, setAmt] = useState('0');
  const [attention, setAttention] = useState('0');
  const [change, setChange] = useState('0');
  const [result, setResult] = useState(null);

  function calculate() {
    const total = parseInt(alertness, 10) + parseInt(amt, 10) + parseInt(attention, 10) + parseInt(change, 10);
    let interp, type;
    if (total >= 4) {
      interp = 'Delirium likely';
      type = 'danger';
    } else if (total >= 1) {
      interp = 'Possible cognitive impairment – further assessment needed';
      type = 'warning';
    } else {
      interp = 'Delirium or cognitive impairment unlikely';
      type = 'success';
    }

    setResult({
      text:
        `4AT Score: ${total}/12\nInterpretation: ${interp}\n\n` +
        'Scoring: 0 = delirium unlikely | 1–3 = possible CI, review | ≥4 = delirium likely\n' +
        'Action: Score ≥4 or clinical concern → full clinical assessment, treat underlying cause, delirium prevention bundle, family notification.',
      type,
    });
  }

  return (
    <CollapsibleCard title="4AT – Rapid Delirium/Cognitive Assessment" icon="brain">
      <Text style={styles.hint}>
        Validated delirium screening tool (Bellelli et al., BMC Medicine 2014). Takes ~2 minutes.
      </Text>

      <PickerSelect
        label="Item 1: Alertness – Observe patient during assessment"
        options={[
          { value: '0', label: 'Normal (fully alert, but not agitated) (0)' },
          { value: '0_mild', label: 'Mild sleepiness <10 seconds then wakes fully (0)' },
          { value: '4', label: 'Clearly abnormal (4)' },
        ]}
        selected={alertness}
        onSelect={(v) => setAlertness(v === '0_mild' ? '0' : v)}
      />

      <PickerSelect
        label="Item 2: AMT4 – Abbreviated Mental Test (Age / DOB / Place / Year)"
        options={[
          { value: '0', label: 'No errors (0)' },
          { value: '1', label: '1 error (1)' },
          { value: '2', label: '2 or more errors / untestable (2)' },
        ]}
        selected={amt}
        onSelect={setAmt}
      />

      <PickerSelect
        label="Item 3: Attention – Months of the Year Backwards"
        options={[
          { value: '0', label: 'Achieves 7 or more months correctly (0)' },
          { value: '1', label: 'Starts but achieves <7 months correctly or refuses (1)' },
          { value: '2', label: 'Unable to start (2)' },
        ]}
        selected={attention}
        onSelect={setAttention}
      />

      <PickerSelect
        label="Item 4: Acute Change or Fluctuating Course (past 2 weeks)"
        options={[
          { value: '0', label: 'No (0)' },
          { value: '4', label: 'Yes (4)' },
        ]}
        selected={change}
        onSelect={setChange}
      />

      <CalcButton title="Calculate 4AT" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// MMSE – Mini-Mental State Examination
// 6 domains, max 30 points.
// Banding: >=24 Normal | 18–23 Mild CI | <18 Moderate–severe CI
// Source: Folstein et al., 1975
// ---------------------------------------------------------------------------
function MMSECard() {
  const [orientTime, setOrientTime] = useState('');
  const [orientPlace, setOrientPlace] = useState('');
  const [registration, setRegistration] = useState('');
  const [attCalc, setAttCalc] = useState('');
  const [recall, setRecall] = useState('');
  const [language, setLanguage] = useState('');
  const [result, setResult] = useState(null);

  const domains = [
    { label: 'Orientation to Time (0–5)', hint: 'Year / Season / Month / Date / Day', max: 5, value: orientTime, setter: setOrientTime },
    { label: 'Orientation to Place (0–5)', hint: 'Country / County / Town / Hospital / Floor', max: 5, value: orientPlace, setter: setOrientPlace },
    { label: 'Registration (0–3)', hint: 'Name 3 objects; patient repeats', max: 3, value: registration, setter: setRegistration },
    { label: 'Attention / Calculation (0–5)', hint: 'Serial 7s (5 times) or WORLD backwards', max: 5, value: attCalc, setter: setAttCalc },
    { label: 'Recall (0–3)', hint: 'Recall 3 objects registered earlier', max: 3, value: recall, setter: setRecall },
    {
      label: 'Language / Praxis (0–9)',
      hint: 'Name 2 objects (2) + repeat phrase (1) + 3-stage command (3) + read & obey (1) + write sentence (1) + copy design (1)',
      max: 9,
      value: language,
      setter: setLanguage,
    },
  ];

  function calculate() {
    const maxes = [5, 5, 3, 5, 3, 9];
    const values = [orientTime, orientPlace, registration, attCalc, recall, language];
    let total = 0;
    for (let i = 0; i < values.length; i++) {
      const v = clampInt(values[i], 0, maxes[i]);
      if (isNaN(v)) {
        setResult({ text: `Please enter a valid score for each domain (0–${maxes[i]}).`, type: 'info' });
        return;
      }
      total += v;
    }

    let interp, type;
    if (total >= 24) {
      interp = 'Normal cognitive function';
      type = 'success';
    } else if (total >= 18) {
      interp = 'Mild cognitive impairment';
      type = 'warning';
    } else {
      interp = 'Moderate–severe cognitive impairment';
      type = 'danger';
    }

    setResult({
      text: `MMSE Score: ${total}/30\nInterpretation: ${interp}\n\n≥24: Normal | 18–23: Mild CI | <18: Moderate–severe CI\nNote: MMSE is copyright; use in clinical settings only.`,
      type,
    });
  }

  return (
    <CollapsibleCard title="MMSE – Mini-Mental State Examination" icon="file-alt">
      <Text style={styles.hint}>
        Standard cognitive screening test (Folstein et al., 1975). Max 30 points. Typically takes 5–10 minutes.
      </Text>
      {domains.map((d, idx) => (
        <View key={idx}>
          <Text style={styles.label}>
            {d.label}
          </Text>
          <Text style={styles.subHint}>{d.hint}</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={d.value}
            onChangeText={d.setter}
            placeholder={`0–${d.max}`}
            maxLength={2}
          />
        </View>
      ))}
      <CalcButton title="Calculate MMSE" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// MoCA – Montreal Cognitive Assessment
// 7 domains, max 30 points. +1 point if <=12 years education (capped at 30).
// Banding: >=26 Normal | 18–25 Mild CI | <18 Moderate–severe CI
// Source: Nasreddine et al., 2005
// ---------------------------------------------------------------------------
function MoCACard() {
  const [visuospatial, setVisuospatial] = useState('');
  const [naming, setNaming] = useState('');
  const [attention, setAttention] = useState('');
  const [language, setLanguage] = useState('');
  const [abstraction, setAbstraction] = useState('');
  const [delayedRecall, setDelayedRecall] = useState('');
  const [orientation, setOrientation] = useState('');
  const [education, setEducation] = useState('0');
  const [result, setResult] = useState(null);

  const domains = [
    {
      label: 'Visuospatial / Executive (0–5)',
      hint: 'Trail B (1) + Cube copy (1) + Clock (3)',
      max: 5,
      value: visuospatial,
      setter: setVisuospatial,
    },
    {
      label: 'Naming (0–3)',
      hint: 'Lion, rhino, camel',
      max: 3,
      value: naming,
      setter: setNaming,
    },
    {
      label: 'Attention (0–6)',
      hint: 'Digit forward (1) + backward (1) + vigilance (1) + serial subtraction (3)',
      max: 6,
      value: attention,
      setter: setAttention,
    },
    {
      label: 'Language (0–3)',
      hint: 'Repeat 2 sentences (2) + fluency (1)',
      max: 3,
      value: language,
      setter: setLanguage,
    },
    {
      label: 'Abstraction (0–2)',
      hint: '2 similarity pairs',
      max: 2,
      value: abstraction,
      setter: setAbstraction,
    },
    {
      label: 'Delayed Recall (0–5)',
      hint: '5 words after ~5 min delay',
      max: 5,
      value: delayedRecall,
      setter: setDelayedRecall,
    },
    {
      label: 'Orientation (0–6)',
      hint: 'Date / Month / Year / Day / Place / City',
      max: 6,
      value: orientation,
      setter: setOrientation,
    },
  ];

  function calculate() {
    const maxes = [5, 3, 6, 3, 2, 5, 6];
    const values = [visuospatial, naming, attention, language, abstraction, delayedRecall, orientation];
    let subtotal = 0;
    for (let i = 0; i < values.length; i++) {
      const v = clampInt(values[i], 0, maxes[i]);
      if (isNaN(v)) {
        setResult({ text: `Please enter a valid score for each domain (0–${maxes[i]}).`, type: 'info' });
        return;
      }
      subtotal += v;
    }
    const eduAdj = parseInt(education, 10);
    const total = Math.min(subtotal + eduAdj, 30);

    let interp, type;
    if (total >= 26) {
      interp = 'Normal cognitive function';
      type = 'success';
    } else if (total >= 18) {
      interp = 'Mild cognitive impairment';
      type = 'warning';
    } else {
      interp = 'Moderate–severe cognitive impairment';
      type = 'danger';
    }

    const eduNote = eduAdj > 0 ? ' (+1 education adjustment applied)' : '';
    setResult({
      text: `MoCA Score: ${total}/30${eduNote}\nInterpretation: ${interp}\n\nNormal: ≥26. MoCA is more sensitive than MMSE for MCI.\n© Z. Nasreddine, moca-test.org`,
      type,
    });
  }

  return (
    <CollapsibleCard title="MoCA – Montreal Cognitive Assessment" icon="brain">
      <Text style={styles.hint}>
        More sensitive than MMSE for mild cognitive impairment (Nasreddine et al., 2005). Max 30 points (add 1 if ≤12 years education).
      </Text>
      {domains.map((d, idx) => (
        <View key={idx}>
          <Text style={styles.label}>{d.label}</Text>
          <Text style={styles.subHint}>{d.hint}</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={d.value}
            onChangeText={d.setter}
            placeholder={`0–${d.max}`}
            maxLength={2}
          />
        </View>
      ))}
      <PickerSelect
        label="Education Adjustment"
        options={[
          { value: '1', label: '≤ 12 years education (add +1)' },
          { value: '0', label: '> 12 years education' },
        ]}
        selected={education}
        onSelect={setEducation}
      />
      <CalcButton title="Calculate MoCA" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// HADS – Hospital Anxiety and Depression Scale
// 7 anxiety items + 7 depression items, each scored 0–3.
// Banding per subscale: 0–7 Normal | 8–10 Borderline | 11–21 Abnormal
// Source: Zigmond & Snaith, 1983
// ---------------------------------------------------------------------------
function HADSCard() {
  // Anxiety items – initial value '0' (least symptomatic option)
  const [a1, setA1] = useState('0');
  const [a2, setA2] = useState('0');
  const [a3, setA3] = useState('0');
  const [a4, setA4] = useState('0');
  const [a5, setA5] = useState('0');
  const [a6, setA6] = useState('0');
  const [a7, setA7] = useState('0');

  // Depression items
  const [d1, setD1] = useState('0');
  const [d2, setD2] = useState('0');
  const [d3, setD3] = useState('0');
  const [d4, setD4] = useState('0');
  const [d5, setD5] = useState('0');
  const [d6, setD6] = useState('0');
  const [d7, setD7] = useState('0');

  const [result, setResult] = useState(null);

  const anxietyItems = [
    {
      id: 'A1',
      question: 'A1. I feel tense or “wound up”',
      state: a1,
      setter: setA1,
      options: [
        { value: '3', label: 'Most of the time (3)' },
        { value: '2', label: 'A lot of the time (2)' },
        { value: '1', label: 'From time to time / occasionally (1)' },
        { value: '0', label: 'Not at all (0)' },
      ],
    },
    {
      id: 'A2',
      question: 'A2. I get a sort of frightened feeling as if something awful is about to happen',
      state: a2,
      setter: setA2,
      options: [
        { value: '3', label: 'Very definitely and quite badly (3)' },
        { value: '2', label: 'Yes, but not too badly (2)' },
        { value: '1', label: 'A little, but it doesn’t worry me (1)' },
        { value: '0', label: 'Not at all (0)' },
      ],
    },
    {
      id: 'A3',
      question: 'A3. Worrying thoughts go through my mind',
      state: a3,
      setter: setA3,
      options: [
        { value: '3', label: 'A great deal of the time (3)' },
        { value: '2', label: 'A lot of the time (2)' },
        { value: '1', label: 'From time to time but not too often (1)' },
        { value: '0', label: 'Only occasionally (0)' },
      ],
    },
    {
      id: 'A4',
      question: 'A4. I can sit at ease and feel relaxed',
      state: a4,
      setter: setA4,
      options: [
        { value: '0', label: 'Definitely (0)' },
        { value: '1', label: 'Usually (1)' },
        { value: '2', label: 'Not often (2)' },
        { value: '3', label: 'Not at all (3)' },
      ],
    },
    {
      id: 'A5',
      question: 'A5. I get a sort of frightened feeling like “butterflies” in my stomach',
      state: a5,
      setter: setA5,
      options: [
        { value: '0', label: 'Not at all (0)' },
        { value: '1', label: 'Occasionally (1)' },
        { value: '2', label: 'Quite often (2)' },
        { value: '3', label: 'Very often (3)' },
      ],
    },
    {
      id: 'A6',
      question: 'A6. I feel restless, as if I have to be on the move',
      state: a6,
      setter: setA6,
      options: [
        { value: '3', label: 'Very much indeed (3)' },
        { value: '2', label: 'Quite a lot (2)' },
        { value: '1', label: 'Not very much (1)' },
        { value: '0', label: 'Not at all (0)' },
      ],
    },
    {
      id: 'A7',
      question: 'A7. I get sudden feelings of panic',
      state: a7,
      setter: setA7,
      options: [
        { value: '3', label: 'Very often indeed (3)' },
        { value: '2', label: 'Quite often (2)' },
        { value: '1', label: 'Not very often (1)' },
        { value: '0', label: 'Not at all (0)' },
      ],
    },
  ];

  const depressionItems = [
    {
      id: 'D1',
      question: 'D1. I still enjoy the things I used to enjoy',
      state: d1,
      setter: setD1,
      options: [
        { value: '0', label: 'Definitely as much (0)' },
        { value: '1', label: 'Not quite so much (1)' },
        { value: '2', label: 'Only a little (2)' },
        { value: '3', label: 'Hardly at all (3)' },
      ],
    },
    {
      id: 'D2',
      question: 'D2. I can laugh and see the funny side of things',
      state: d2,
      setter: setD2,
      options: [
        { value: '0', label: 'As much as I always could (0)' },
        { value: '1', label: 'Not quite so much now (1)' },
        { value: '2', label: 'Definitely not so much (2)' },
        { value: '3', label: 'Not at all (3)' },
      ],
    },
    {
      id: 'D3',
      question: 'D3. I feel cheerful',
      state: d3,
      setter: setD3,
      options: [
        { value: '3', label: 'Not at all (3)' },
        { value: '2', label: 'Not often (2)' },
        { value: '1', label: 'Sometimes (1)' },
        { value: '0', label: 'Most of the time (0)' },
      ],
    },
    {
      id: 'D4',
      question: 'D4. I feel as if I am slowed down',
      state: d4,
      setter: setD4,
      options: [
        { value: '3', label: 'Nearly all the time (3)' },
        { value: '2', label: 'Very often (2)' },
        { value: '1', label: 'Sometimes (1)' },
        { value: '0', label: 'Not at all (0)' },
      ],
    },
    {
      id: 'D5',
      question: 'D5. I have lost interest in my appearance',
      state: d5,
      setter: setD5,
      options: [
        { value: '3', label: 'Definitely (3)' },
        { value: '2', label: 'I don’t take as much care as I should (2)' },
        { value: '1', label: 'I may not take quite as much care (1)' },
        { value: '0', label: 'I take just as much care as ever (0)' },
      ],
    },
    {
      id: 'D6',
      question: 'D6. I look forward with enjoyment to things',
      state: d6,
      setter: setD6,
      options: [
        { value: '0', label: 'As much as I ever did (0)' },
        { value: '1', label: 'Rather less than I used to (1)' },
        { value: '2', label: 'Definitely less than I used to (2)' },
        { value: '3', label: 'Hardly at all (3)' },
      ],
    },
    {
      id: 'D7',
      question: 'D7. I can enjoy a good book, radio or TV programme',
      state: d7,
      setter: setD7,
      options: [
        { value: '0', label: 'Often (0)' },
        { value: '1', label: 'Sometimes (1)' },
        { value: '2', label: 'Not often (2)' },
        { value: '3', label: 'Very seldom (3)' },
      ],
    },
  ];

  function interpret(score) {
    if (score <= 7) return { label: 'Normal', type: 'success' };
    if (score <= 10) return { label: 'Borderline / Possible', type: 'warning' };
    return { label: 'Abnormal / Probable', type: 'danger' };
  }

  function calculate() {
    const aScore = [a1, a2, a3, a4, a5, a6, a7].reduce((acc, v) => acc + parseInt(v, 10), 0);
    const dScore = [d1, d2, d3, d4, d5, d6, d7].reduce((acc, v) => acc + parseInt(v, 10), 0);

    const aInterp = interpret(aScore);
    const dInterp = interpret(dScore);

    const worstType =
      aScore >= 11 || dScore >= 11
        ? 'danger'
        : aScore >= 8 || dScore >= 8
        ? 'warning'
        : 'success';

    setResult({
      text:
        `HADS Anxiety (A): ${aScore}/21 – ${aInterp.label}\n` +
        `HADS Depression (D): ${dScore}/21 – ${dInterp.label}\n\n` +
        'Scoring: 0–7 Normal | 8–10 Borderline (consider referral) | 11–21 Abnormal (referral recommended)\n' +
        'Consider preoperative psychological support for scores ≥8. High anxiety correlates with increased postoperative pain and prolonged recovery.',
      type: worstType,
    });
  }

  return (
    <CollapsibleCard title="HADS – Hospital Anxiety and Depression Scale" icon="smile-beam">
      <Text style={styles.hint}>
        Validated screening for anxiety and depression in medical patients (Zigmond &amp; Snaith, 1983). Each item scored 0–3.
      </Text>

      <Text style={styles.subSectionLabel}>Anxiety Subscale (A)</Text>
      {anxietyItems.map((item) => (
        <PickerSelect
          key={item.id}
          label={item.question}
          options={item.options}
          selected={item.state}
          onSelect={item.setter}
        />
      ))}

      <Text style={[styles.subSectionLabel, styles.subSectionLabelSpaced]}>Depression Subscale (D)</Text>
      {depressionItems.map((item) => (
        <PickerSelect
          key={item.id}
          label={item.question}
          options={item.options}
          selected={item.state}
          onSelect={item.setter}
        />
      ))}

      <CalcButton title="Calculate HADS" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------
export default function FrailtyCognitionMoodSection({ patient }) {
  return (
    <View>
      {/* ===== FRAILTY ASSESSMENT ===== */}
      <SectionHeader title="Frailty Assessment" />
      <RCFSCard />
      <EFSCard />

      {/* ===== COGNITION ===== */}
      <SectionHeader title="Cognition" />
      <FourATCard />
      <MMSECard />
      <MoCACard />

      {/* ===== ANXIETY & DEPRESSION ===== */}
      <SectionHeader title="Anxiety & Depression" />
      <HADSCard />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles (mirrors PreoperativeScreen.js conventions)
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  sectionHeader: {
    backgroundColor: COLORS.medicalBlue,
    paddingVertical: 10,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  sectionHeaderText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  subHint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: 4,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: 14,
    backgroundColor: COLORS.white,
    marginBottom: SPACING.sm,
  },
  subSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  subSectionLabelSpaced: {
    marginTop: SPACING.md,
  },
});
