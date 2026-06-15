/**
 * RockwoodFrailtySection
 *
 * Renders ONLY the Rockwood Clinical Frailty Scale (CFS) card.
 * Extracted from FrailtyCognitionMoodSection so the Preoperative screen can
 * mirror the web app's section 9 (Rockwood CFS only).
 *
 * Source: Rockwood et al., CMAJ 2005
 */

import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import CalcButton from '../../components/CalcButton';
import ResultDisplay from '../../components/ResultDisplay';
import { RadioGroup } from '../../components/FormControls';
import { COLORS, SPACING } from '../../utils/theme';

export default function RockwoodFrailtySection() {
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
    <CollapsibleCard title="Rockwood Clinical Frailty Scale (CFS)" icon="user-injured">
      <Text style={styles.hint}>
        Global clinical judgement scale (Rockwood et al., CMAJ 2005). Select the description that best fits the patient.
      </Text>
      <RadioGroup options={options} selected={rcfsScore} onSelect={setRcfsScore} />
      <CalcButton title="Interpret CFS" onPress={calculate} />
      {result && <ResultDisplay result={result.text} type={result.type} />}
    </CollapsibleCard>
  );
}

const styles = StyleSheet.create({
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
});
