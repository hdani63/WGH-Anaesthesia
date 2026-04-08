import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { CheckboxItem, PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function PostoperativeScreen() {
  const [patient, setPatient] = useState({ weight: '', age: '', height: '', gender: 'male' });

  // Aldrete
  const [aldrete, setAldrete] = useState({ activity: '', respiration: '', circulation: '', consciousness: '', color: '' });
  const [aldreteResult, setAldreteResult] = useState(null);

  // PONV
  const [ponv, setPonv] = useState({ female: false, nonsmoker: false, history: false, opioids: false });
  const [ponvResult, setPonvResult] = useState(null);

  // Pain
  const [painScore, setPainScore] = useState(0);
  const [painLocation, setPainLocation] = useState('');
  const [painResult, setPainResult] = useState(null);

  // PADSS
  const [padss, setPadss] = useState({ vitals: '', activity: '', nausea: '', pain: '', bleeding: '' });
  const [padssResult, setPadssResult] = useState(null);

  return (
    <ScreenWrapper title="Postoperative & Recovery Tools" subtitle="Recovery assessment and discharge planning">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="Aldrete Score (PACU Discharge)" icon="clipboard-list">
        <PickerSelect
          label="Activity"
          options={[
            { value: '2', label: 'Able to move 4 extremities voluntarily (2 pts)' },
            { value: '1', label: 'Able to move 2 extremities voluntarily (1 pt)' },
            { value: '0', label: 'Unable to move extremities voluntarily (0 pts)' },
          ]}
          selected={aldrete.activity}
          onSelect={v => setAldrete(p => ({ ...p, activity: v }))}
        />
        <PickerSelect
          label="Respiration"
          options={[
            { value: '2', label: 'Able to breathe deeply and cough freely (2 pts)' },
            { value: '1', label: 'Dyspnea or limited breathing (1 pt)' },
            { value: '0', label: 'Apneic (0 pts)' },
          ]}
          selected={aldrete.respiration}
          onSelect={v => setAldrete(p => ({ ...p, respiration: v }))}
        />
        <PickerSelect
          label="Circulation"
          options={[
            { value: '2', label: 'BP within 20% of pre-anesthetic level (2 pts)' },
            { value: '1', label: 'BP 20-50% of pre-anesthetic level (1 pt)' },
            { value: '0', label: 'BP >50% of pre-anesthetic level (0 pts)' },
          ]}
          selected={aldrete.circulation}
          onSelect={v => setAldrete(p => ({ ...p, circulation: v }))}
        />
        <PickerSelect
          label="Consciousness"
          options={[
            { value: '2', label: 'Fully awake (2 pts)' },
            { value: '1', label: 'Arousable on calling (1 pt)' },
            { value: '0', label: 'Not responding (0 pts)' },
          ]}
          selected={aldrete.consciousness}
          onSelect={v => setAldrete(p => ({ ...p, consciousness: v }))}
        />
        <PickerSelect
          label="Color"
          options={[
            { value: '2', label: 'Pink (2 pts)' },
            { value: '1', label: 'Pale, dusky, blotchy (1 pt)' },
            { value: '0', label: 'Cyanotic (0 pts)' },
          ]}
          selected={aldrete.color}
          onSelect={v => setAldrete(p => ({ ...p, color: v }))}
        />
        <CalcButton title="Calculate Aldrete" onPress={() => setAldreteResult(Calc.calculateAldrete(aldrete))} />
        {aldreteResult && <ResultDisplay result={aldreteResult.text} type={aldreteResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="PONV Risk Assessment (Apfel Score)" icon="dizzy">
        <CheckboxItem label="Female gender" checked={ponv.female} onToggle={() => setPonv(p => ({ ...p, female: !p.female }))} />
        <CheckboxItem label="Non-smoker" checked={ponv.nonsmoker} onToggle={() => setPonv(p => ({ ...p, nonsmoker: !p.nonsmoker }))} />
        <CheckboxItem label="History of PONV or motion sickness" checked={ponv.history} onToggle={() => setPonv(p => ({ ...p, history: !p.history }))} />
        <CheckboxItem label="Post-operative opioids planned" checked={ponv.opioids} onToggle={() => setPonv(p => ({ ...p, opioids: !p.opioids }))} />
        <CalcButton title="Calculate PONV Risk" onPress={() => setPonvResult(Calc.calculatePONV(Object.values(ponv)))} />
        {ponvResult && <ResultDisplay result={ponvResult.text} type={ponvResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Pain Assessment & Management" icon="thermometer-half">
        <Text style={styles.label}>Pain Score: {painScore}/10</Text>
        <View style={styles.sliderRow}>
          <Text>0</Text>
          <View style={styles.sliderTrack}>
            {[0,1,2,3,4,5,6,7,8,9,10].map(val => (
              <Text
                key={val}
                onPress={() => setPainScore(val)}
                style={[styles.sliderDot, painScore === val && styles.sliderDotActive]}
              >
                {val}
              </Text>
            ))}
          </View>
          <Text>10</Text>
        </View>
        <PickerSelect
          label="Pain Location"
          options={[
            { value: 'surgical', label: 'Surgical site' },
            { value: 'throat', label: 'Throat (post-intubation)' },
            { value: 'back', label: 'Back' },
            { value: 'headache', label: 'Headache' },
            { value: 'other', label: 'Other' },
          ]}
          selected={painLocation}
          onSelect={setPainLocation}
        />
        <CalcButton title="Assess Pain" onPress={() => setPainResult(Calc.assessPain(painScore, painLocation))} />
        {painResult && <ResultDisplay result={painResult.text} type={painResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="PADSS (Ambulatory Discharge)" icon="sign-out-alt">
        <PickerSelect
          label="Vital Signs"
          options={[
            { value: '2', label: 'Within 20% of baseline (2 pts)' },
            { value: '1', label: '20-40% of baseline (1 pt)' },
            { value: '0', label: '>40% of baseline (0 pts)' },
          ]}
          selected={padss.vitals}
          onSelect={v => setPadss(p => ({ ...p, vitals: v }))}
        />
        <PickerSelect
          label="Activity Level"
          options={[
            { value: '2', label: 'Steady gait, no dizziness (2 pts)' },
            { value: '1', label: 'Requires assistance (1 pt)' },
            { value: '0', label: 'Unable to ambulate (0 pts)' },
          ]}
          selected={padss.activity}
          onSelect={v => setPadss(p => ({ ...p, activity: v }))}
        />
        <PickerSelect
          label="Nausea/Vomiting"
          options={[
            { value: '2', label: 'Minimal (2 pts)' },
            { value: '1', label: 'Moderate (1 pt)' },
            { value: '0', label: 'Severe (0 pts)' },
          ]}
          selected={padss.nausea}
          onSelect={v => setPadss(p => ({ ...p, nausea: v }))}
        />
        <PickerSelect
          label="Pain"
          options={[
            { value: '2', label: 'Minimal (2 pts)' },
            { value: '1', label: 'Moderate (1 pt)' },
            { value: '0', label: 'Severe (0 pts)' },
          ]}
          selected={padss.pain}
          onSelect={v => setPadss(p => ({ ...p, pain: v }))}
        />
        <PickerSelect
          label="Surgical Bleeding"
          options={[
            { value: '2', label: 'Minimal (2 pts)' },
            { value: '1', label: 'Moderate (1 pt)' },
            { value: '0', label: 'Severe (0 pts)' },
          ]}
          selected={padss.bleeding}
          onSelect={v => setPadss(p => ({ ...p, bleeding: v }))}
        />
        <CalcButton title="Calculate PADSS" onPress={() => setPadssResult(Calc.calculatePADSS(padss))} />
        {padssResult && <ResultDisplay result={padssResult.text} type={padssResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  sliderRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  sliderTrack: { flexDirection: 'row', flex: 1, justifyContent: 'space-around', marginHorizontal: 8 },
  sliderDot: { width: 26, height: 26, textAlign: 'center', lineHeight: 26, borderRadius: 13, borderWidth: 1, borderColor: COLORS.border, fontSize: 11, overflow: 'hidden' },
  sliderDotActive: { backgroundColor: COLORS.primary, color: COLORS.white, borderColor: COLORS.primary },
});
