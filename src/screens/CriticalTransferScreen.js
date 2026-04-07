import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { CheckboxItem } from '../components/FormControls';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const formatTime = (date) => date ? date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit' }) : '';
const formatDateTime = (date) => date ? date.toLocaleString('en-IE') : '';

const SECTIONS = {
  decision: {
    title: '1. Decision to Transfer',
    items: {
      consultantDiscussionRefer: 'Consultant Discussion (Referring)',
      consultantDiscussionReceive: 'Consultant Discussion (Receiving)',
      informedConsent: 'Informed Consent',
      timeCritical: 'Is this a time-critical transfer?',
    },
  },
  clinical: {
    title: '2. Clinical Preparation',
    groups: {
      'Airway & Breathing': {
        ettSecured: 'ETT secured and position confirmed',
        ettCuffPressure: 'ETT cuff pressure checked',
        ventilatorSettings: 'Ventilator settings documented',
        recentABG: 'Recent ABG available',
        spareAirwayEquipment: 'Spare airway equipment packed',
        portableSuction: 'Portable suction available',
      },
      'Circulation': {
        ivAccessSecure: 'IV access secure (×2 minimum)',
        hemodynamicStability: 'Haemodynamic stability achieved',
        infusionPumpsCharged: 'Infusion pumps fully charged',
        criticalInfusionSupply: 'Critical infusion supply adequate',
        recentECG: 'Recent ECG available',
      },
      'Neurological': {
        adequateSedation: 'Adequate sedation/analgesia',
        bloodGlucoseTarget: 'Blood glucose at target',
        seizureICPPlan: 'Seizure/ICP management plan documented',
      },
      'Other': {
        linesSecuredLabelled: 'All lines secured and labelled',
        temperatureMonitored: 'Temperature actively monitored',
        patientSecuredTrolley: 'Patient secured to transfer trolley',
      },
    },
  },
  equipment: {
    title: '3. Team & Equipment',
    groups: {
      'Transfer Team': {
        teamQualified: 'Team appropriately qualified',
        teamAwareComplications: 'Team aware of potential complications',
        teamContactNumbers: 'Contact numbers exchanged',
      },
      'Equipment': {
        transferTrolleySecure: 'Transfer trolley secure',
        monitorFullyCharged: 'Monitor fully charged',
        ventilatorCharged: 'Ventilator fully charged',
        infusionPumpsSecured: 'Infusion pumps secured',
        oxygenAirSupply: 'Oxygen/air supply adequate',
        consumablesBag: 'Consumables bag prepared',
      },
    },
  },
  handover: {
    title: '4. Transit & Handover',
    groups: {
      'In-Transit': {
        continuousMonitoringDocumented: 'Continuous monitoring documented',
        equipmentSecureStaffSeated: 'Equipment secure, staff seated',
        structuredHandover: 'Structured handover (ISBAR)',
        allDocumentationHandover: 'All documentation for handover',
      },
      'Post-Transfer': {
        debriefingSession: 'Debriefing session completed',
        incidentsReported: 'Incidents reported (if any)',
        transferLoggedAudit: 'Transfer logged for audit',
      },
    },
  },
};

export default function CriticalTransferScreen() {
  const [formData, setFormData] = useState({
    referringConsultant: '', receivingConsultant: '', patientName: '', transferReason: '',
    agreementDocumented: '',
  });
  const [callTime, setCallTime] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [timestamps, setTimestamps] = useState({});

  const totalItems = 34;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggleItem = useCallback((key) => {
    const now = new Date();
    setCheckedItems(prev => {
      const newVal = !prev[key];
      return { ...prev, [key]: newVal };
    });
    setTimestamps(prev => ({ ...prev, [key]: now }));
  }, []);

  const generateReport = () => {
    const lines = [
      '=== CRITICAL TRANSFER REPORT ===',
      `Date: ${formatDateTime(new Date())}`,
      `Patient: ${formData.patientName || 'N/A'}`,
      `Reason: ${formData.transferReason || 'N/A'}`,
      `Referring: ${formData.referringConsultant || 'N/A'}`,
      `Receiving: ${formData.receivingConsultant || 'N/A'}`,
      `Call Time: ${callTime ? formatDateTime(callTime) : 'Not set'}`,
      '',
      `Completion: ${checkedCount}/${totalItems} (${progress}%)`,
      '',
    ];

    Object.entries(SECTIONS).forEach(([sectionKey, section]) => {
      lines.push(`--- ${section.title} ---`);
      const items = section.items || Object.values(section.groups || {}).reduce((acc, g) => ({ ...acc, ...g }), {});
      Object.entries(items).forEach(([key, label]) => {
        const checked = checkedItems[key] ? '[x]' : '[ ]';
        const time = timestamps[key] ? ` (${formatTime(timestamps[key])})` : '';
        lines.push(`${checked} ${label}${time}`);
      });
      lines.push('');
    });

    Alert.alert('Transfer Report', lines.join('\n'), [{ text: 'OK' }]);
  };

  const resetChecklist = () => {
    Alert.alert('Reset Checklist', 'Are you sure you want to reset all items?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => {
        setCheckedItems({});
        setTimestamps({});
        setCallTime(null);
        setFormData({ referringConsultant: '', receivingConsultant: '', patientName: '', transferReason: '', agreementDocumented: '' });
      }},
    ]);
  };

  const renderChecklist = (items) => Object.entries(items).map(([key, label]) => (
    <View key={key} style={styles.checkRow}>
      <CheckboxItem label={label} checked={!!checkedItems[key]} onToggle={() => toggleItem(key)} />
      {timestamps[key] && <Text style={styles.timestamp}>{formatTime(timestamps[key])}</Text>}
    </View>
  ));

  return (
    <ScreenWrapper title="Critical Transfer" subtitle="Inter-hospital transfer checklist">
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: progress === 100 ? COLORS.success : progress >= 75 ? COLORS.warning : COLORS.danger }]} />
        </View>
        <Text style={styles.progressText}>{progress}% Complete ({checkedCount}/{totalItems})</Text>
      </View>

      {/* Decision to Transfer */}
      <CollapsibleCard title={SECTIONS.decision.title} icon="phone">
        <Text style={styles.label}>Referring Consultant</Text>
        <TextInput style={styles.input} placeholder="Name" value={formData.referringConsultant} onChangeText={v => setFormData(p => ({ ...p, referringConsultant: v }))} />
        <Text style={styles.label}>Receiving Consultant</Text>
        <TextInput style={styles.input} placeholder="Name" value={formData.receivingConsultant} onChangeText={v => setFormData(p => ({ ...p, receivingConsultant: v }))} />
        <Text style={styles.label}>Patient Name</Text>
        <TextInput style={styles.input} placeholder="Patient name" value={formData.patientName} onChangeText={v => setFormData(p => ({ ...p, patientName: v }))} />
        <Text style={styles.label}>Transfer Reason</Text>
        <TextInput style={styles.input} placeholder="Reason for transfer" value={formData.transferReason} onChangeText={v => setFormData(p => ({ ...p, transferReason: v }))} />
        <PickerSelect label="Agreement Documented" options={[
          { value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' },
        ]} selected={formData.agreementDocumented} onSelect={v => setFormData(p => ({ ...p, agreementDocumented: v }))} />
        <TouchableOpacity style={styles.timeButton} onPress={() => setCallTime(new Date())}>
          <Text style={styles.timeButtonText}>Set Time of Call</Text>
        </TouchableOpacity>
        {callTime && <Text style={styles.callTimeText}>Call time: {formatDateTime(callTime)}</Text>}
        {renderChecklist(SECTIONS.decision.items)}
      </CollapsibleCard>

      {/* Clinical Preparation */}
      <CollapsibleCard title={SECTIONS.clinical.title} icon="user-md">
        {Object.entries(SECTIONS.clinical.groups).map(([groupName, items]) => (
          <View key={groupName}>
            <Text style={styles.groupTitle}>{groupName}</Text>
            {renderChecklist(items)}
          </View>
        ))}
      </CollapsibleCard>

      {/* Team & Equipment */}
      <CollapsibleCard title={SECTIONS.equipment.title} icon="toolbox">
        {Object.entries(SECTIONS.equipment.groups).map(([groupName, items]) => (
          <View key={groupName}>
            <Text style={styles.groupTitle}>{groupName}</Text>
            {renderChecklist(items)}
          </View>
        ))}
      </CollapsibleCard>

      {/* Transit & Handover */}
      <CollapsibleCard title={SECTIONS.handover.title} icon="exchange-alt">
        {Object.entries(SECTIONS.handover.groups).map(([groupName, items]) => (
          <View key={groupName}>
            <Text style={styles.groupTitle}>{groupName}</Text>
            {renderChecklist(items)}
          </View>
        ))}
      </CollapsibleCard>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.success }]} onPress={generateReport}>
          <Text style={styles.actionBtnText}>Generate Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: COLORS.danger }]} onPress={resetChecklist}>
          <Text style={styles.actionBtnText}>Reset Checklist</Text>
        </TouchableOpacity>
      </View>

      {/* References */}
      <View style={styles.refBox}>
        <Text style={styles.refTitle}>References</Text>
        <Text style={styles.refItem}>• ICSI/JFICMI Inter-Hospital Transfer Guidelines</Text>
        <Text style={styles.refItem}>• AAGBI/ICS Interhospital Transfer Guidelines</Text>
        <Text style={styles.refItem}>• PHECC Protocol 37</Text>
        <Text style={styles.refItem}>• NAS CCRS (Critical Care Retrieval Service)</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  progressContainer: { marginBottom: SPACING.md },
  progressBar: { height: 20, backgroundColor: '#e9ecef', borderRadius: 10, overflow: 'hidden', marginBottom: 4 },
  progressFill: { height: '100%', borderRadius: 10 },
  progressText: { fontSize: 13, fontWeight: '600', color: COLORS.text, textAlign: 'center' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  groupTitle: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginTop: SPACING.sm, marginBottom: SPACING.xs },
  checkRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  timestamp: { fontSize: 11, color: COLORS.textMuted },
  timeButton: { backgroundColor: COLORS.info, borderRadius: 6, padding: 10, alignItems: 'center', marginVertical: SPACING.sm },
  timeButtonText: { color: COLORS.white, fontWeight: '700' },
  callTimeText: { fontSize: 13, color: COLORS.success, fontWeight: '600', marginBottom: SPACING.sm },
  actions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  actionBtn: { flex: 1, padding: 14, borderRadius: BORDER_RADIUS, alignItems: 'center' },
  actionBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  refBox: { backgroundColor: '#f0f4f8', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.md },
  refTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: SPACING.xs },
  refItem: { fontSize: 12, color: COLORS.textMuted, marginBottom: 2 },
});
