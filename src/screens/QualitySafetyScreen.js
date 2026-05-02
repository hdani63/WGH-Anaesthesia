import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { CheckboxItem } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';

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

  const [activeCard, setActiveCard] = useState(null);

  const toggle = (setter) => (key) => setter(p => ({ ...p, [key]: !p[key] }));
  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const calcWHO = () => {
    const checkboxes = [
      ...Object.values(whoSignIn),
      ...Object.values(whoTimeOut),
      ...Object.values(whoSignOut),
    ];
    const completed = checkboxes.filter(Boolean).length;
    const total = 19;
    const percentage = Math.round((completed / total) * 100);

    let type = 'danger';
    let interpretation = '';

    if (percentage === 100) {
      interpretation = 'WHO Surgical Safety Checklist fully completed';
      type = 'success';
    } else if (percentage >= 80) {
      interpretation = 'Good compliance with WHO checklist';
      type = 'warning';
    } else {
      interpretation = 'Poor compliance - safety risk identified';
      type = 'danger';
    }

    setWhoResult({
      text: `Checklist Completion: ${completed}/${total} (${percentage}%)\n${interpretation}\nTarget: 100% compliance for optimal patient safety`,
      type,
    });
  };

  const calcAnes = () => {
    const checkboxes = [
      ...Object.values(anesEquip),
      ...Object.values(anesMonitor),
      ...Object.values(anesEmerg),
    ];
    const completed = checkboxes.filter(Boolean).length;
    const total = 9;
    const percentage = Math.round((completed / total) * 100);

    let type = 'danger';
    let interpretation = '';

    if (percentage === 100) {
      interpretation = 'Anesthesia safety checklist fully completed - ready to proceed';
      type = 'success';
    } else if (percentage >= 90) {
      interpretation = 'Minor items outstanding - review before proceeding';
      type = 'warning';
    } else {
      interpretation = 'Critical safety items missing - do not proceed';
      type = 'danger';
    }

    setAnesResult({
      text: `Safety Checklist: ${completed}/${total} (${percentage}%)\n${interpretation}`,
      type,
    });
  };

  const calcQuality = () => {
    const checkboxes = Object.values(quality);
    const score = checkboxes.filter(Boolean).length;
    const total = 8;
    const percentage = Math.round((score / total) * 100);

    let type = 'info';
    let interpretation = '';

    if (percentage >= 90) {
      interpretation = 'Excellent quality score';
      type = 'success';
    } else if (percentage >= 75) {
      interpretation = 'Good quality score';
      type = 'success';
    } else if (percentage >= 60) {
      interpretation = 'Acceptable quality score - room for improvement';
      type = 'warning';
    } else {
      interpretation = 'Poor quality score - significant improvement needed';
      type = 'danger';
    }

    setQualityResult({
      text: `Quality Score: ${score}/${total} (${percentage}%)\n${interpretation}\nTarget: >90% for high-quality care`,
      type,
    });
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
    <ScreenWrapper title="Quality & Safety Checklists" subtitle="WHO surgical checklist, safety protocols, and quality measures">
      <CollapsibleCard
        title="WHO Surgical Safety Checklist"
        icon="check-square"
        open={activeCard === 'who'}
        onToggle={(nextOpen) => toggleCard('who', nextOpen)}
      >
        <CheckGroup title="SIGN IN (Before induction of anesthesia)" state={whoSignIn} onToggle={toggle(setWhoSignIn)} items={{
          patientIdentity: 'Patient has confirmed identity, site, procedure, and consent',
          siteMarked: 'Site marked/not applicable',
          anesCheck: 'Anesthesia safety check completed',
          pulseOx: 'Pulse oximeter on patient and functioning',
          knownAllergy: 'Does patient have a known allergy? No / Yes (and allergy stated)',
          difficultAirway: 'Difficult airway/aspiration risk? No / Yes (and equipment/assistance available)',
          bloodLoss: 'Risk of >500mL blood loss (7mL/kg in children)? No / Yes (and adequate IV access and fluids planned)',
        }} />
        <CheckGroup title="TIME OUT (Before skin incision)" state={whoTimeOut} onToggle={toggle(setWhoTimeOut)} items={{
          teamIntroduction: 'All team members have introduced themselves by name and role',
          patientConfirm: 'Surgeon, anesthetist, and nurse verbally confirm patient, site, and procedure',
          criticalSteps: 'Surgeon reviews critical or unexpected steps, operative duration, anticipated blood loss',
          anestheticConcerns: 'Anesthetist reviews any patient-specific concerns',
          nurseConcerns: 'Nursing team reviews sterility and equipment issues or concerns',
          antibioticProphylaxis: 'Antibiotic prophylaxis given within 60 minutes? Yes / Not applicable',
          imagingDisplayed: 'Essential imaging displayed? Yes / Not applicable',
        }} />
        <CheckGroup title="SIGN OUT (Before patient leaves operating room)" state={whoSignOut} onToggle={toggle(setWhoSignOut)} items={{
          procedureRecorded: 'Nurse verbally confirms with the team the name of the procedure recorded',
          instrumentCount: 'Instrument, sponge, and needle counts are correct (or not applicable)',
          specimenLabeled: 'Specimen is labeled (including patient name)',
          equipmentProblems: 'Are there any equipment problems to be addressed?',
          keyConcerns: 'Surgeon, anesthetist, and nurse review key concerns for recovery and management of patient',
        }} />
        <CalcButton title="Evaluate Checklist Completion" onPress={calcWHO} />
        {whoResult && <ResultDisplay result={whoResult.text} type={whoResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Anesthesia Safety Checklist"
        icon="shield-alt"
        open={activeCard === 'anes'}
        onToggle={(nextOpen) => toggleCard('anes', nextOpen)}
      >
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
        <CalcButton title="Evaluate Safety Checklist" onPress={calcAnes} />
        {anesResult && <ResultDisplay result={anesResult.text} type={anesResult.type} />}
      </CollapsibleCard>

      <CollapsibleCard
        title="Quality Metrics Tracker"
        icon="chart-bar"
        open={activeCard === 'quality'}
        onToggle={(nextOpen) => toggleCard('quality', nextOpen)}
      >
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
          appropriatePositioning: 'Appropriate patient positioning with pressure point protection',
        }} />
        <CalcButton title="Calculate Quality Score" onPress={calcQuality} />
        {qualityResult && <ResultDisplay result={qualityResult.text} type={qualityResult.type} />}
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: SPACING.md },
  groupTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginBottom: SPACING.sm },
});
