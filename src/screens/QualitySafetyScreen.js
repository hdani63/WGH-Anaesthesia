import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { CheckboxItem } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

export default function QualitySafetyScreen() {
  // WHO Checklist
  const [whoSignIn, setWhoSignIn] = useState({
    patientIdentity: false, siteMarked: false, anesCheck: false, pulseOx: false,
    knownAllergy: false, difficultAirway: false, bloodLoss: false,
  });
  const [whoTimeOut, setWhoTimeOut] = useState({
    teamIntroduction: false, patientConfirm: false, criticalSteps: false,
    anestheticConcerns: false, nurseConcerns: false, antibioticProphylaxis: false, imagingDisplayed: false,
  });
  const [whoSignOut, setWhoSignOut] = useState({
    procedureRecorded: false, instrumentCount: false, specimenLabeled: false,
    equipmentProblems: false, keyConcerns: false,
  });
  const [whoResult, setWhoResult] = useState(null);

  // Anes Checklist
  const [anesEquip, setAnesEquip] = useState({ machineCheck: false, o2Supply: false, suctionCheck: false, airwayEquip: false });
  const [anesMonitor, setAnesMonitor] = useState({ standardMonitors: false, alarmLimits: false });
  const [anesEmerg, setAnesEmerg] = useState({ emergencyDrugs: false, difficultAirwayCart: false, mhCart: false });
  const [anesResult, setAnesResult] = useState(null);

  // Quality Metrics
  const [quality, setQuality] = useState({
    onTimeStart: false, appropriateAntibiotics: false, normothermia: false, euglycemia: false, fluidManagement: false,
    noAwarenessEvents: false, noMedicationErrors: false, appropriatePositioning: false,
  });
  const [qualityResult, setQualityResult] = useState(null);

  const toggle = (setter) => (key) => setter(p => ({ ...p, [key]: !p[key] }));

  const calcWHO = () => {
    const all = { ...whoSignIn, ...whoTimeOut, ...whoSignOut };
    setWhoResult(Calc.evaluateChecklist(Object.values(all), 19, 'WHO Surgical Safety Checklist'));
  };

  const calcAnes = () => {
    const all = { ...anesEquip, ...anesMonitor, ...anesEmerg };
    setAnesResult(Calc.evaluateChecklist(Object.values(all), 9, 'Anesthesia Safety Checklist'));
  };

  const calcQuality = () => {
    setQualityResult(Calc.evaluateChecklist(Object.values(quality), 8, 'Quality Metrics'));
  };

  const CheckGroup = ({ title, items, state, onToggle }) => (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {Object.entries(items).map(([key, label]) => (
        <CheckboxItem key={key} label={label} checked={state[key]} onToggle={() => onToggle(key)} />
      ))}
    </View>
  );

  return (
    <ScreenWrapper title="Quality & Safety" subtitle="Surgical safety checklists and quality metrics">
      <CollapsibleCard title="WHO Surgical Safety Checklist" icon="check-square">
        <CheckGroup title="SIGN IN" state={whoSignIn} onToggle={toggle(setWhoSignIn)} items={{
          patientIdentity: 'Patient identity, site, procedure, and consent confirmed',
          siteMarked: 'Site marked / not applicable',
          anesCheck: 'Anesthesia safety check completed',
          pulseOx: 'Pulse oximeter functioning',
          knownAllergy: 'Known allergy reviewed',
          difficultAirway: 'Difficult airway / aspiration risk assessed',
          bloodLoss: 'Risk of >500mL blood loss assessed',
        }} />
        <CheckGroup title="TIME OUT" state={whoTimeOut} onToggle={toggle(setWhoTimeOut)} items={{
          teamIntroduction: 'Team members introduced by name and role',
          patientConfirm: 'Surgeon, anaesthetist, nurse confirm patient/site/procedure',
          criticalSteps: 'Surgeon reviews critical steps & anticipated blood loss',
          anestheticConcerns: 'Anaesthetist reviews patient-specific concerns',
          nurseConcerns: 'Nursing team reviews sterility and equipment',
          antibioticProphylaxis: 'Antibiotic prophylaxis given within 60 minutes',
          imagingDisplayed: 'Essential imaging displayed',
        }} />
        <CheckGroup title="SIGN OUT" state={whoSignOut} onToggle={toggle(setWhoSignOut)} items={{
          procedureRecorded: 'Procedure name recorded',
          instrumentCount: 'Instrument, sponge, needle counts correct',
          specimenLabeled: 'Specimen labeled with patient name',
          equipmentProblems: 'Equipment problems addressed',
          keyConcerns: 'Key recovery / management concerns reviewed',
        }} />
        <CalcButton title="Evaluate Checklist" onPress={calcWHO} />
        {whoResult && <ResultDisplay result={whoResult.text} type={whoResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Anesthesia Safety Checklist" icon="sliders-h">
        <CheckGroup title="Equipment Checks" state={anesEquip} onToggle={toggle(setAnesEquip)} items={{
          machineCheck: 'Anesthesia machine safety check completed',
          o2Supply: 'Oxygen supply and backup verified',
          suctionCheck: 'Suction equipment tested and ready',
          airwayEquip: 'Airway equipment available and checked',
        }} />
        <CheckGroup title="Monitoring" state={anesMonitor} onToggle={toggle(setAnesMonitor)} items={{
          standardMonitors: 'Standard ASA monitors applied',
          alarmLimits: 'Alarm limits set appropriately',
        }} />
        <CheckGroup title="Emergency Preparedness" state={anesEmerg} onToggle={toggle(setAnesEmerg)} items={{
          emergencyDrugs: 'Emergency drugs readily available',
          difficultAirwayCart: 'Difficult airway cart location known',
          mhCart: 'Malignant hyperthermia cart location known',
        }} />
        <CalcButton title="Evaluate Checklist" onPress={calcAnes} />
        {anesResult && <ResultDisplay result={anesResult.text} type={anesResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard title="Quality Metrics Tracker" icon="chart-line">
        <CheckGroup title="Case Quality Indicators" state={quality} onToggle={toggle(setQuality)} items={{
          onTimeStart: 'Case started on time (within 15 minutes)',
          appropriateAntibiotics: 'Appropriate antibiotic prophylaxis given',
          normothermia: 'Normothermia maintained (>36°C)',
          euglycemia: 'Appropriate glucose management',
          fluidManagement: 'Goal-directed fluid therapy used',
        }} />
        <CheckGroup title="Safety Indicators" state={quality} onToggle={toggle(setQuality)} items={{
          noAwarenessEvents: 'No intraoperative awareness events',
          noMedicationErrors: 'No medication errors occurred',
          appropriatePositioning: 'Appropriate positioning with pressure point protection',
        }} />
        <CalcButton title="Calculate Quality Score" onPress={calcQuality} />
        {qualityResult && <ResultDisplay result={qualityResult.text} type={qualityResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: SPACING.md },
  groupTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm, textTransform: 'uppercase' },
});
