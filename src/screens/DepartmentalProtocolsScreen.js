import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { renderProtocolContent } from '../utils/protocolRenderer';
import { departmentService } from '../services/departmentService';

const ICON_ALIASES = {
  'first-aid-kit': 'first-aid',
  droplet: 'tint',
  mask: 'head-side-mask',
};

const SUPPORTED_PROTOCOL_ICONS = new Set([
  'file-medical',
  'syringe',
  'heartbeat',
  'brain',
  'lungs',
  'pills',
  'microscope',
  'flask',
  'stethoscope',
  'hospital',
  'ambulance',
  'user-md',
  'bed',
  'tint',
  'bone',
  'tooth',
  'first-aid',
  'head-side-mask',
  'virus',
]);

const getSafeProtocolIcon = (rawIcon) => {
  const fallback = 'file-medical';

  if (!rawIcon || typeof rawIcon !== 'string') {
    return fallback;
  }

  const normalized = rawIcon.trim().toLowerCase();
  const mapped = ICON_ALIASES[normalized] || normalized;

  if (SUPPORTED_PROTOCOL_ICONS.has(mapped)) {
    return mapped;
  }

  return fallback;
};

function DataTable({ headers, rows, columnWidths }) {
  const widths = columnWidths || headers.map((_, i) => (i === 0 ? 180 : 160));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
      <View style={styles.tableWrapper}>
        <View style={styles.tableRow}>
          {headers.map((header, i) => (
            <Text key={`${header}-${i}`} style={[styles.tableHeader, { width: widths[i], minWidth: widths[i] }]}>
              {header}
            </Text>
          ))}
        </View>

        {rows.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={[styles.tableRow, rowIndex % 2 === 1 && styles.tableRowAlt]}>
            {row.map((cell, cellIndex) => (
              <Text key={`cell-${rowIndex}-${cellIndex}`} style={[styles.tableCell, { width: widths[cellIndex], minWidth: widths[cellIndex] }]}>
                {cell}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function SectionHeader({ title, icon, color = COLORS.primary }) {
  return (
    <View style={styles.sectionHeaderRow}>
      <FontAwesome5 name={icon} size={13} color={color} style={styles.sectionHeaderIcon} />
      <Text style={styles.sectionHeaderTitle}>{title}</Text>
    </View>
  );
}

function InfoSection({ title, items, icon = 'list-alt' }) {
  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardTitleRow}>
        <FontAwesome5 name={icon} size={12} color={COLORS.success} style={styles.infoCardIcon} />
        <Text style={styles.infoCardTitle}>{title}</Text>
      </View>
      {items.map((item, i) => <Text key={i} style={styles.sectionItem}>• {item}</Text>)}
    </View>
  );
}

function StepCard({ step, title, intro, items }) {
  return (
    <View style={styles.stepCard}>
      <View style={styles.stepTitleRow}>
        <View style={styles.stepNumberBadge}><Text style={styles.stepNumberText}>{step}</Text></View>
        <Text style={styles.stepTitle}>{title}</Text>
      </View>
      <Text style={styles.stepIntro}>{intro}</Text>
      {items.map((item, i) => <Text key={i} style={styles.sectionItem}>• {item}</Text>)}
    </View>
  );
}

function ContactCard({ title, detail, icon, borderColor }) {
  return (
    <View style={[styles.contactCard, { borderLeftColor: borderColor || COLORS.primary }]}>
      <FontAwesome5 name={icon} size={18} color={COLORS.primary} style={styles.contactIcon} />
      <View style={styles.contactTextWrap}>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function MetricCard({ icon, label, value }) {
  return (
    <View style={styles.metricCard}>
      <FontAwesome5 name={icon} size={20} color={COLORS.primary} style={styles.metricIcon} />
      <Text style={styles.metricLabel}>{label}</Text>
      <Text style={styles.metricValue}>{value}</Text>
    </View>
  );
}

export default function DepartmentalProtocolsScreen() {
  const navigation = useNavigation();
  const [apiProtocols, setApiProtocols] = useState([]);
  const [loadingApiProtocols, setLoadingApiProtocols] = useState(false);

  useEffect(() => {
    fetchApiProtocols();
  }, []);

  const fetchApiProtocols = async () => {
    try {
      setLoadingApiProtocols(true);
      const protocols = await departmentService.getProtocols();
      if (Array.isArray(protocols)) {
        setApiProtocols(protocols);
      }
    } catch (error) {
      console.error('Error fetching protocols from API:', error);
    } finally {
      setLoadingApiProtocols(false);
    }
  };

  return (
    <ScreenWrapper title="Departmental Protocols" subtitle="Wexford General Hospital Anaesthesia Department">
      {/* Existing protocols from database */}
      <CollapsibleCard title="IV Cannulation Request Protocol" icon="syringe">
        <SectionHeader title="Protocol Overview" icon="info-circle" />
        <View style={styles.protocolAlertInfo}>
          <Text style={styles.alertLine}><Text style={styles.alertStrong}>Effective Date:</Text> Monday 13th May 2024</Text>
          <Text style={styles.alertLine}><Text style={styles.alertStrong}>Purpose:</Text> New system for managing requests for assistance with difficult peripheral venous cannulation at ward level.</Text>
          <Text style={styles.alertLine}><Text style={styles.alertStrong}>Operating Hours:</Text> 09:00 - 17:00 on weekdays (period of greatest frequency of requests)</Text>
        </View>

        <SectionHeader title="Key Principles" icon="lightbulb" color={COLORS.success} />
        <InfoSection title="Rationale" icon="check-circle" items={[
          'Optimizes Anaesthesiology resource utilization',
          'Ensures appropriate escalation pathway',
          'Provides consultant-level oversight for difficult cases',
          'Maintains audit trail for quality improvement',
          'Reduces delays through proper coordination',
        ]} />
        <InfoSection title="Benefits" icon="star" items={[
          'Consultant awareness of difficult cases',
          'Coordinated response from best available person',
          'Continuous audit and feedback loop',
          'Clear escalation pathway for all teams',
          'Improved patient care and safety',
        ]} />

        <SectionHeader title="Step-by-Step Request Process" icon="clipboard-check" color={COLORS.warning} />
        <StepCard
          step="1"
          title="Initial Consultation Within Specialty"
          intro="The primary team in difficulty should consult among their own specialty colleagues first."
          items={[
            'Medical teams: 10 teams of Medical NCHDs operating at ward level',
            'Surgical teams: 4 teams of Surgical NCHDs operating at ward level',
            'At least one person per shift should possess the required cannulation skills',
            'Attempt cannulation within your specialty before involving Anaesthesiology',
          ]}
        />

        <StepCard
          step="2"
          title="Notify Admitting Consultant"
          intro="If not successful, the primary team must notify the patient\'s admitting consultant."
          items={[
            'Admitting consultant is made aware of a sick patient with no IV access',
            'Confirms registrar-level cannulation attempts have failed',
            'Triggers formal cross-specialty request for assistance',
          ]}
        />

        <StepCard
          step="3"
          title="Contact Consultant Anaesthesiologist"
          intro="The admitting consultant should contact the consultant anaesthesiologist on-call."
          items={[
            'Who to contact: duty consultant of the day, based in theatre',
            'How to contact: dial O and request switchboard connection',
            'Duty consultant coordinates available anaesthesia staff response',
            'Best placed to identify the least-delay response clinician',
          ]}
        />

        <StepCard
          step="4"
          title="Complete Audit Documentation"
          intro="A member of the admitting team should complete the audit process in parallel."
          items={[
            'Bring a patient sticker to theatre reception',
            'Locate the IV Cannulation Request Audit Book',
            'Record patient details, requesting team, location, request time, and requester',
            'Data contributes to rolling feedback and quality improvement',
          ]}
        />

        <SectionHeader title="Operating Hours & Out-of-Hours Procedure" icon="clock" />
        <DataTable
          headers={['Time Period', 'Contact Method', 'Process', 'Audit Requirements']}
          columnWidths={[170, 220, 220, 200]}
          rows={[
            [
              'WEEKDAYS\n09:00 - 17:00',
              'Admitting consultant contacts anaesthesiology duty consultant via switchboard (dial O)',
              'Follow 4-step process, duty consultant coordinates and deploys best available anaesthesiologist',
              'Required: bring patient sticker to theatre reception and complete audit book',
            ],
            [
              'OUT OF HOURS\n17:00 - 09:00\nWeekends',
              'Team registrar contacts 1st-on-call anaesthesiologist directly',
              'Direct on-call response without duty consultant coordination',
              'Still required: attend theatre and complete same audit documentation',
            ],
          ]}
        />

        <SectionHeader title="Documentation & Follow-up" icon="file-medical" color={COLORS.info} />
        <InfoSection title="Required Documentation" icon="clipboard-list" items={[
          'Date and time of request',
          'Requesting clinician details',
          'Clinical indication for IV access',
          'Previous attempts and outcomes',
          'Patient consent documentation',
          'Procedure notes and complications',
        ]} />

        <InfoSection title="Post-Procedure Actions" icon="tasks" items={[
          'Document successful cannulation site and size',
          'Record any complications or difficulties',
          'Provide care instructions to nursing staff',
          'Schedule follow-up if required',
          'Update patient medical record',
          'Communicate outcomes with primary team',
        ]} />

        <SectionHeader title="Central Venous Cannulation" icon="heartbeat" color={COLORS.danger} />
        <View style={styles.importantNoteBox}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.importantNoteIcon} />
          <Text style={styles.importantNote}>
            <Text style={styles.importantNoteStrong}>Important Distinction: </Text>
            If central venous cannulation is required, this must continue as a formal consultation with Anaesthesiology in the existing manner and be performed in theatre under sterile conditions.
          </Text>
        </View>

        <SectionHeader title="Key Contact Information" icon="phone" />
        <View style={styles.contactColumn}>
          <ContactCard
            title="Weekdays 09:00-17:00"
            detail="Anaesthesiology Duty Consultant via Hospital Switchboard. Dial 0 and request Anaesthesiology Duty Consultant."
            icon="user-md"
            borderColor={COLORS.success}
          />
          <ContactCard
            title="Out of Hours"
            detail="1st-on-call Anaesthesiologist direct contact via Switchboard. Available 17:00-09:00 and weekends."
            icon="clock"
            borderColor={COLORS.warning}
          />
          <ContactCard
            title="Audit Documentation"
            detail="Theatre Reception IV Cannulation Request Audit Book. Patient sticker required at all hours, including out-of-hours."
            icon="book"
            borderColor={COLORS.primary}
          />
        </View>

        <SectionHeader title="Quality Assurance & Review" icon="star" color={COLORS.warning} />
        <View style={styles.qualityBox}>
          <Text style={styles.sectionItem}>• This protocol is reviewed annually by the Anaesthesia Department.</Text>
          <Text style={styles.sectionItem}>• All IV cannulation requests are logged for quality improvement purposes.</Text>
          <Text style={styles.sectionItem}>• Feedback on protocol effectiveness should be directed to the department lead.</Text>
          <Text style={styles.sectionItem}>• Training updates are communicated through departmental meetings and bulletins.</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard title="Paediatric Surgery Cut-off Limit" icon="child">
        <View style={styles.paediatricAlert}>
          <Text style={styles.cutoffTitle}>Paediatric Surgery Cut-off Limit</Text>
          <Text style={styles.cutoffLead}>The cut-off for non-life-threatening paediatric surgery is:</Text>
          <View style={styles.metricRow}>
            <MetricCard icon="birthday-cake" label="Age" value="4 years and over" />
            <MetricCard icon="weight" label="Weight" value="15 kg and over" />
          </View>
          <Text style={styles.cutoffNote}>Applies to non-life-threatening paediatric surgery.</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard title="Additional Protocols" icon="plus-circle">
        {loadingApiProtocols ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading protocols...</Text>
          </View>
        ) : apiProtocols.length === 0 ? (
          <View style={styles.placeholderCard}>
            <FontAwesome5 name="folder-plus" size={32} color={COLORS.textMuted} style={styles.placeholderIcon} />
            <Text style={styles.placeholderText}>Additional departmental protocols will be added here as they become available.</Text>
          </View>
        ) : (
          <View>
            {apiProtocols.map((protocol, idx) => {
              const iconName = getSafeProtocolIcon(protocol.icon);
              return (
                <View key={protocol.id || idx} style={styles.apiProtocolCard}>
                  <View style={styles.apiProtocolHeader}>
                    <FontAwesome5 name={iconName} size={16} color={COLORS.primary} style={styles.apiProtocolIcon} />
                    <Text style={styles.apiProtocolTitle}>{protocol.title || `Protocol ${idx + 1}`}</Text>
                  </View>
                  {protocol.category && (
                    <Text style={styles.apiProtocolCategory}>Category: {protocol.category}</Text>
                  )}
                  {renderProtocolContent(protocol.content, styles)}
                </View>
              );
            })}
          </View>
        )}
      </CollapsibleCard>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e8f5e9',
    paddingBottom: 6,
  },
  sectionHeaderIcon: { marginRight: 7 },
  sectionHeaderTitle: { fontWeight: '700', fontSize: 14, color: '#2e7d32' },
  protocolAlertInfo: {
    backgroundColor: '#e8f4fd',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#cfe8ff',
  },
  alertLine: { fontSize: 13, color: COLORS.text, marginBottom: 4, lineHeight: 19 },
  alertStrong: { fontWeight: '700' },
  infoCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  infoCardTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoCardIcon: { marginRight: 6 },
  infoCardTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text },
  sectionItem: { fontSize: 13, color: COLORS.text, marginBottom: 2, paddingLeft: 4 },
  stepCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  stepTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  stepNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  stepNumberText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  stepTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, flex: 1 },
  stepIntro: { fontSize: 13, color: COLORS.text, marginBottom: 6, fontWeight: '600', lineHeight: 18 },
  tableScrollContent: { paddingBottom: 2 },
  tableWrapper: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.md },
  tableRow: { flexDirection: 'row' },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  tableHeader: { backgroundColor: COLORS.medicalBlue, color: COLORS.white, padding: 8, fontWeight: '700', fontSize: 12, lineHeight: 17 },
  tableCell: { padding: 8, fontSize: 12, color: COLORS.text, borderTopWidth: 1, borderTopColor: COLORS.border, lineHeight: 17 },
  importantNoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#ffc107',
  },
  importantNoteIcon: { marginRight: 8, marginTop: 2 },
  importantNote: { fontSize: 13, color: '#856404', lineHeight: 19, flex: 1 },
  importantNoteStrong: { fontWeight: '700', color: '#856404' },
  contactColumn: { marginBottom: SPACING.sm },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: SPACING.sm,
    borderLeftWidth: 4,
    marginBottom: SPACING.sm,
  },
  contactIcon: { width: 22, marginRight: 4 },
  contactTextWrap: { flex: 1 },
  contactTitle: { fontWeight: '700', fontSize: 12, color: COLORS.text },
  contactDetail: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },
  qualityBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#adb5bd',
  },
  paediatricAlert: {
    backgroundColor: '#e8f0ff',
    borderRadius: 8,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: '#cfe0ff',
  },
  cutoffTitle: { fontWeight: '700', fontSize: 16, color: COLORS.success, marginBottom: SPACING.sm },
  cutoffLead: { fontSize: 13, color: COLORS.text, marginBottom: SPACING.sm },
  metricRow: { flexDirection: 'row' },
  metricCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#86b6ff',
    borderRadius: 8,
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xs,
    backgroundColor: COLORS.white,
  },
  metricIcon: { marginBottom: 6 },
  metricLabel: { fontSize: 12, color: COLORS.primary, fontWeight: '600', marginBottom: 2 },
  metricValue: { fontSize: 13, color: COLORS.text, fontWeight: '700', textAlign: 'center' },
  cutoffNote: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic', marginTop: SPACING.sm },
  placeholderCard: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  placeholderIcon: { marginBottom: SPACING.sm },
  placeholderText: { fontSize: 14, color: COLORS.textMuted, fontStyle: 'italic', textAlign: 'center' },
  homeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOW,
  },
  homeBtnIcon: { marginRight: 8 },
  homeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  loadingText: {
    marginTop: SPACING.sm,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  apiProtocolCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  apiProtocolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  apiProtocolIcon: {
    marginRight: SPACING.sm,
  },
  apiProtocolTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  apiProtocolCategory: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: SPACING.sm,
  },
});
