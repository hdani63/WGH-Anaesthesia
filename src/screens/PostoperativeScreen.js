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
  const [aldrete, setAldrete] = useState({ activity: '', respiration: '', circulation: '', consciousness: '', oxygen: '' });
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

  const aldreteOpts = (label, key) => (
    <PickerSelect
      label={label}
      options={[
        { value: '0', label: '0 points' },
        { value: '1', label: '1 point' },
        { value: '2', label: '2 points' },
      ]}
      selected={aldrete[key]}
      onSelect={v => setAldrete(p => ({ ...p, [key]: v }))}
    />
  );

  return (
    <ScreenWrapper title="Postoperative & Recovery Tools" subtitle="Recovery assessment and discharge planning">
      <PatientInfoCard patient={patient} setPatient={setPatient} />

      <CollapsibleCard title="Aldrete Score (PACU Discharge)" icon="clipboard-list">
        {aldreteOpts('Activity', 'activity')}
        {aldreteOpts('Respiration', 'respiration')}
        {aldreteOpts('Circulation', 'circulation')}
        {aldreteOpts('Consciousness', 'consciousness')}
        {aldreteOpts('Oxygen Saturation', 'oxygen')}
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
            { value: 'surgical_site', label: 'Surgical Site' },
            { value: 'back', label: 'Back' },
            { value: 'head', label: 'Head' },
            { value: 'chest', label: 'Chest' },
            { value: 'abdomen', label: 'Abdomen' },
            { value: 'other', label: 'Other' },
          ]}
          selected={painLocation}
          onSelect={setPainLocation}
        />
        <CalcButton title="Assess Pain" onPress={() => setPainResult(Calc.assessPain(painScore, painLocation))} />
        {painResult && <ResultDisplay result={painResult.text} type={painResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="PADSS (Ambulatory Discharge)" icon="sign-out-alt">
        {[
          ['Vital Signs', 'vitals'],
          ['Activity Level', 'activity'],
          ['Nausea/Vomiting', 'nausea'],
          ['Pain', 'pain'],
          ['Surgical Bleeding', 'bleeding'],
        ].map(([label, key]) => (
          <PickerSelect
            key={key}
            label={label}
            options={[
              { value: '0', label: '0 points' },
              { value: '1', label: '1 point' },
              { value: '2', label: '2 points' },
            ]}
            selected={padss[key]}
            onSelect={v => setPadss(p => ({ ...p, [key]: v }))}
          />
        ))}
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
