import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { CheckboxItem } from '../components/FormControls';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const formatTime = (date) => (date ? date.toLocaleTimeString('en-IE', { hour: '2-digit', minute: '2-digit', hour12: false }) : '');
const formatDateTime = (date) => (date ? date.toLocaleString('en-IE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
}) : '');

const SECTION_ORDER = ['decision', 'clinical', 'equipment', 'handover'];

const SECTIONS = {
  decision: {
    title: 'Section 1: The Decision to Transfer',
    items: [
      {
        key: 'consultantDiscussionRefer',
        label: 'Consultant Discussion (Referring): I have discussed this transfer with the senior decision-maker (Consultant) in my ICU',
      },
      {
        key: 'consultantDiscussionReceive',
        label: 'Consultant Discussion (Receiving): I have spoken directly with the accepting consultant at the receiving hospital',
      },
      {
        key: 'informedConsent',
        label: 'Informed Consent: The patient (if able) or their next of kin has been informed of the reason for transfer and the associated risks',
      },
      {
        key: 'timeCritical',
        label: 'Is this a time-critical transfer?',
      },
      {
        key: 'phecProformaReady',
        label: 'I have the PHECC Protocol 37 request pro-forma ready',
      },
    ],
  },
  clinical: {
    title: 'Section 2: Patient Clinical Preparation',
    groups: [
      {
        title: 'Airway & Breathing',
        icon: 'lungs',
        items: [
          { key: 'ettSecured', label: 'Endotracheal Tube/Tracheostomy is secured' },
          { key: 'ettCuffPressure', label: 'ETT cuff pressure checked' },
          { key: 'ventilatorSettings', label: 'Transport ventilator settings match ICU settings, and are appropriate for patient' },
          { key: 'recentABG', label: 'Recent ABG confirms adequate ventilation' },
          { key: 'spareAirwayEquipment', label: 'Spare airway equipment is packed (same and smaller ETTs, laryngoscope, bougie, etc.)' },
          { key: 'portableSuction', label: 'Portable suction is functional and charged' },
        ],
      },
      {
        title: 'Circulation',
        icon: 'heartbeat',
        items: [
          { key: 'ivAccessSecure', label: 'At least two secure and functional IV access points (e.g., CVC, PICC, peripheral lines)' },
          { key: 'hemodynamicStability', label: 'Patient is hemodynamically stable on current support' },
          { key: 'infusionPumpsCharged', label: 'All vasopressors and inotropes are in charged syringe pumps' },
          { key: 'criticalInfusionSupply', label: "A minimum of one hour's supply of all critical infusions is prepared and labelled" },
          { key: 'recentECG', label: 'A recent ECG has been performed and is within safe limits' },
        ],
      },
      {
        title: 'Neurological',
        icon: 'brain',
        items: [
          { key: 'adequateSedation', label: 'Patient is adequately sedated and/or paralyzed' },
          { key: 'bloodGlucoseTarget', label: 'Blood glucose is checked and within target range' },
          { key: 'seizureICPPlan', label: 'Plan for managing seizures or raised ICP is in place' },
        ],
      },
      {
        title: 'Other',
        icon: 'notes-medical',
        items: [
          { key: 'linesSecuredLabelled', label: 'All lines, drains, and tubes are checked, secured, and clearly labelled' },
          { key: 'temperatureMonitored', label: "Patient's temperature is monitored and actively managed" },
          { key: 'patientSecuredTrolley', label: 'Patient is secured on the transfer trolley with a 5-point harness' },
        ],
      },
    ],
  },
  equipment: {
    title: 'Section 3: Team & Equipment Preparation',
    groups: [
      {
        title: 'Transfer Team',
        icon: 'users',
        items: [
          { key: 'teamQualified', label: 'The team consists of at least two appropriately qualified and experienced personnel (e.g., ICU Doctor and ICU Nurse)' },
          { key: 'teamAwareComplications', label: 'The team is aware of all patient needs and potential complications' },
          { key: 'teamContactNumbers', label: 'The team has contact numbers for both hospitals and a backup plan for communication failure' },
        ],
      },
      {
        title: 'Equipment Checklist',
        icon: 'toolbox',
        items: [
          { key: 'transferTrolleySecure', label: 'Transfer Trolley: All equipment is securely mounted and functional' },
          { key: 'monitorFullyCharged', label: 'Monitor: Fully charged, with all leads attached (ECG, SpO2, NIBP, IBP, ETCO2) and displays visible' },
          { key: 'ventilatorCharged', label: 'Ventilator: Fully charged, with a spare battery' },
          { key: 'infusionPumpsSecured', label: 'Infusion Pumps: All pumps are fully charged and secured' },
          { key: 'oxygenAirSupply', label: "Oxygen/Air: Sufficient supply for the journey plus a generous reserve (e.g., one hour's worth of reserve)" },
          { key: 'consumablesBag', label: 'Consumables: A bag containing emergency drugs, fluids, backup infusions, and spare consumables is prepared' },
        ],
      },
    ],
  },
  handover: {
    title: 'Section 4: In-Transit & Handover',
    groups: [
      {
        title: 'In-Transit',
        icon: 'ambulance',
        items: [
          { key: 'continuousMonitoringDocumented', label: 'Continuous monitoring is maintained and documented every 5-10 minutes on a transfer record' },
          { key: 'equipmentSecureStaffSeated', label: 'The team has confirmed all equipment and restraints are secure before the ambulance departs. Staff are seated with seatbelts' },
          { key: 'structuredHandover', label: 'Upon arrival at the receiving hospital, a formal, structured handover is conducted' },
          { key: 'allDocumentationHandover', label: 'All patient records, a summary of the transfer, and the transfer checklist are handed over to the receiving team' },
        ],
      },
      {
        title: '5. Post-Transfer: Review & Audit',
        icon: 'clipboard-check',
        items: [
          { key: 'debriefingSession', label: 'A debriefing session has been conducted with the transfer team to discuss any issues' },
          { key: 'incidentsReported', label: "Any incidents, near-misses, or equipment failures have been reported through the hospital's incident reporting system (e.g., Datix)" },
          { key: 'transferLoggedAudit', label: 'The transfer is logged for departmental audit and review purposes' },
        ],
      },
    ],
  },
};

function getSectionItems(section) {
  if (section.items) return section.items;
  if (section.groups) {
    return section.groups.reduce((acc, group) => [...acc, ...group.items], []);
  }
  return [];
}

const ALL_ITEMS = Object.values(SECTIONS).reduce((acc, section) => [...acc, ...getSectionItems(section)], []);

export default function CriticalTransferScreen() {
  const navigation = useNavigation();
  const [startTime] = useState(() => new Date());
  const [activeCard, setActiveCard] = useState('decision');

  const [formData, setFormData] = useState({
    referringConsultant: '', receivingConsultant: '', patientName: '', transferReason: '',
    agreementDocumented: '',
  });
  const [callTime, setCallTime] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [timestamps, setTimestamps] = useState({});

  const isTimeCritical = !!checkedItems.timeCritical;
  const visibleItemKeys = useMemo(
    () => ALL_ITEMS
      .filter((item) => isTimeCritical || item.key !== 'phecProformaReady')
      .map((item) => item.key),
    [isTimeCritical],
  );

  const totalItems = visibleItemKeys.length;
  const checkedCount = visibleItemKeys.filter((key) => !!checkedItems[key]).length;
  const progress = totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const toggleItem = useCallback((key) => {
    const now = new Date();
    const turningOffTimeCritical = key === 'timeCritical' && !!checkedItems.timeCritical;

    setCheckedItems((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      if (turningOffTimeCritical) {
        delete next.phecProformaReady;
      }
      return next;
    });

    setTimestamps((prev) => {
      const next = { ...prev, [key]: now };
      if (turningOffTimeCritical) {
        delete next.phecProformaReady;
      }
      return next;
    });
  }, [checkedItems.timeCritical]);

  const generateReport = () => {
    const lines = [
      '=== CRITICALCARE TRANSFERCHECK REPORT ===',
      `Date: ${formatDateTime(new Date())}`,
      `Checklist Start: ${formatDateTime(startTime)}`,
      `Patient: ${formData.patientName || 'N/A'}`,
      `Reason: ${formData.transferReason || 'N/A'}`,
      `Referring: ${formData.referringConsultant || 'N/A'}`,
      `Receiving: ${formData.receivingConsultant || 'N/A'}`,
      `Agreement Documented: ${formData.agreementDocumented ? formData.agreementDocumented.toUpperCase() : 'N/A'}`,
      `Call Time: ${callTime ? formatDateTime(callTime) : 'Not set'}`,
      '',
      `Completion: ${checkedCount}/${totalItems} (${progress}%)`,
      '',
    ];

    SECTION_ORDER.forEach((sectionKey) => {
      const section = SECTIONS[sectionKey];
      lines.push(`--- ${section.title} ---`);

      const sectionItems = getSectionItems(section).filter((item) => isTimeCritical || item.key !== 'phecProformaReady');
      sectionItems.forEach((item) => {
        const checked = checkedItems[item.key] ? '[x]' : '[ ]';
        const time = timestamps[item.key] ? ` (${formatTime(timestamps[item.key])})` : '';
        lines.push(`${checked} ${item.label}${time}`);
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
        setActiveCard('decision');
        setFormData({ referringConsultant: '', receivingConsultant: '', patientName: '', transferReason: '', agreementDocumented: '' });
      }},
    ]);
  };

  const renderChecklist = (items) => items.map((item) => {
    if (item.key === 'phecProformaReady' && !isTimeCritical) return null;

    return (
      <View key={item.key} style={[styles.checkRow, checkedItems[item.key] && styles.checkRowDone]}>
        <CheckboxItem label={item.label} checked={!!checkedItems[item.key]} onToggle={() => toggleItem(item.key)} />
        {timestamps[item.key] ? <Text style={styles.timestamp}>{formatTime(timestamps[item.key])}</Text> : null}
      </View>
    );
  });

  const renderDecisionSection = () => (
    <>
      <View style={styles.field}>
        <Text style={styles.label}>Consultant (Referring) Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter referring consultant name"
          value={formData.referringConsultant}
          onChangeText={(v) => setFormData((p) => ({ ...p, referringConsultant: v }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Consultant (Receiving) Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter receiving consultant name"
          value={formData.receivingConsultant}
          onChangeText={(v) => setFormData((p) => ({ ...p, receivingConsultant: v }))}
        />
      </View>

      <View style={styles.field}>
        <PickerSelect
          label="Agreement Documented"
          options={[
            { value: '', label: 'Select...' },
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
          ]}
          selected={formData.agreementDocumented}
          onSelect={(v) => setFormData((p) => ({ ...p, agreementDocumented: v }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Patient Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter patient name"
          value={formData.patientName}
          onChangeText={(v) => setFormData((p) => ({ ...p, patientName: v }))}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Transfer Reason</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter reason for transfer"
          value={formData.transferReason}
          onChangeText={(v) => setFormData((p) => ({ ...p, transferReason: v }))}
        />
      </View>

      <TouchableOpacity style={styles.timeButton} onPress={() => setCallTime(new Date())}>
        <FontAwesome5 name="clock" size={13} color={COLORS.primary} style={styles.timeButtonIcon} />
        <Text style={styles.timeButtonText}>Set Time of Call</Text>
      </TouchableOpacity>
      {callTime ? <Text style={styles.callTimeText}>Call time: {formatDateTime(callTime)}</Text> : null}

      {renderChecklist(SECTIONS.decision.items)}

      {isTimeCritical ? (
        <View style={styles.alertBox}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertStrong}>REMINDER: </Text>
            I am aware of and will activate PHECC Protocol 37.
          </Text>
        </View>
      ) : null}
    </>
  );

  const renderGroupSection = (sectionKey) => (
    <View>
      {SECTIONS[sectionKey].groups.map((group) => (
        <View key={group.title} style={styles.groupBox}>
          <View style={styles.groupTitleRow}>
            <FontAwesome5 name={group.icon} size={13} color={COLORS.primary} style={styles.groupTitleIcon} />
            <Text style={styles.groupTitle}>{group.title}</Text>
          </View>
          {renderChecklist(group.items)}
        </View>
      ))}
    </View>
  );

  return (
    <ScreenWrapper title="CriticalCare TransferCheck" subtitle="Interactive Checklist for Inter-hospital Transfer of Critically Ill Patients">
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: progress === 100 ? COLORS.success : progress >= 75 ? COLORS.warning : COLORS.danger }]} />
        </View>
        <Text style={styles.progressText}>{progress}% Complete ({checkedCount}/{totalItems})</Text>
      </View>

      <CollapsibleCard
        title={SECTIONS.decision.title}
        icon="phone"
        open={activeCard === 'decision'}
        onToggle={(nextOpen) => toggleCard('decision', nextOpen)}
      >
        {renderDecisionSection()}
      </CollapsibleCard>

      <CollapsibleCard
        title={SECTIONS.clinical.title}
        icon="user-md"
        open={activeCard === 'clinical'}
        onToggle={(nextOpen) => toggleCard('clinical', nextOpen)}
      >
        {renderGroupSection('clinical')}
      </CollapsibleCard>

      <CollapsibleCard
        title={SECTIONS.equipment.title}
        icon="toolbox"
        open={activeCard === 'equipment'}
        onToggle={(nextOpen) => toggleCard('equipment', nextOpen)}
      >
        {renderGroupSection('equipment')}
      </CollapsibleCard>

      <CollapsibleCard
        title={SECTIONS.handover.title}
        icon="exchange-alt"
        open={activeCard === 'handover'}
        onToggle={(nextOpen) => toggleCard('handover', nextOpen)}
      >
        {renderGroupSection('handover')}
        <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
          <FontAwesome5 name="file-alt" size={13} color={COLORS.white} style={styles.reportIcon} />
          <Text style={styles.reportButtonText}>Generate Transfer Report</Text>
        </TouchableOpacity>
      </CollapsibleCard>

      <View style={styles.referencesBox}>
        <Text style={styles.refTitle}>References and Guidelines</Text>
        <Text style={styles.refIntro}>
          This checklist is based on core national and international guidance for safe inter-hospital transfer of critically ill patients.
        </Text>
        <Text style={styles.refItem}>1. ICSI / JFICMI National Standards for Adult Critical Care Services.</Text>
        <Text style={styles.refItem}>2. AAGBI / ICS Safety Guideline: Inter-hospital Transfer of the Critically Ill Patient.</Text>
        <Text style={styles.refItem}>3. PHECC Protocol 37: Emergency Inter-Hospital Transfer Policy.</Text>
        <Text style={styles.refItem}>4. NAS Critical Care Retrieval Services (CCRS) transfer protocols.</Text>
      </View>

      <View style={styles.footerActions}>
        <TouchableOpacity style={[styles.actionBtn, styles.homeBtn]} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.actionIcon} />
          <Text style={styles.actionBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, styles.resetBtn]} onPress={resetChecklist}>
          <FontAwesome5 name="redo" size={13} color={COLORS.dark} style={styles.actionIcon} />
          <Text style={styles.resetBtnText}>Reset Checklist</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    ...SHADOW,
  },
  progressBar: { height: 22, backgroundColor: '#e9ecef', borderRadius: 11, overflow: 'hidden', marginBottom: 5 },
  progressFill: { height: '100%', borderRadius: 10 },
  progressText: { fontSize: 13, fontWeight: '700', color: COLORS.text, textAlign: 'center' },
  field: { marginBottom: SPACING.sm },
  label: { fontSize: 13, color: COLORS.text, marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: COLORS.white,
  },
  checkRow: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f3f5',
  },
  checkRowDone: {
    borderColor: '#b7e4c7',
    backgroundColor: '#f2fbf5',
  },
  timestamp: { fontSize: 11, color: COLORS.success, fontWeight: '600', marginLeft: 28, marginTop: 2 },
  timeButton: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: SPACING.sm,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fbff',
  },
  timeButtonIcon: {
    marginRight: 7,
  },
  timeButtonText: { color: COLORS.primary, fontWeight: '700' },
  callTimeText: { fontSize: 13, color: COLORS.success, fontWeight: '600', marginBottom: SPACING.sm },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffc107',
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
  },
  alertIcon: {
    marginTop: 2,
    marginRight: 8,
  },
  alertText: {
    color: '#856404',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  alertStrong: {
    fontWeight: '700',
  },
  groupBox: {
    marginBottom: SPACING.md,
  },
  groupTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  groupTitleIcon: {
    marginRight: 6,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primary,
  },
  reportButton: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.success,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  reportIcon: {
    marginRight: 8,
  },
  reportButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
  referencesBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
    marginBottom: SPACING.md,
  },
  refTitle: {
    fontWeight: '700',
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 4,
  },
  refIntro: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
    marginBottom: 6,
  },
  refItem: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
    lineHeight: 17,
  },
  footerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  homeBtn: {
    backgroundColor: COLORS.primary,
  },
  resetBtn: {
    backgroundColor: '#f1f3f5',
    borderWidth: 1,
    borderColor: '#ced4da',
  },
  actionBtnText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  resetBtnText: {
    color: COLORS.dark,
    fontWeight: '700',
    fontSize: 13,
  },
  actionIcon: {
    marginRight: 7,
  },
});
