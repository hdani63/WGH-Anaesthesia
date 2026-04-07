import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

function InfoSection({ title, items }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.map((item, i) => <Text key={i} style={styles.sectionItem}>• {item}</Text>)}
    </View>
  );
}

function ContactCard({ title, detail, icon }) {
  return (
    <View style={styles.contactCard}>
      <FontAwesome5 name={icon} size={18} color={COLORS.primary} style={styles.contactIcon} />
      <View>
        <Text style={styles.contactTitle}>{title}</Text>
        <Text style={styles.contactDetail}>{detail}</Text>
      </View>
    </View>
  );
}

export default function DepartmentalProtocolsScreen() {
  return (
    <ScreenWrapper title="Departmental Protocols" subtitle="WGH Anaesthesia department protocols">
      <CollapsibleCard title="IV Cannulation Request Protocol" icon="iv-drip">
        <View style={styles.protocolHeader}>
          <Text style={styles.effectiveDate}>Effective Date: 13 May 2024</Text>
          <Text style={styles.hours}>Operating Hours: 09:00 – 17:00</Text>
        </View>

        <InfoSection title="Key Principles" items={[
          'Peripheral IV cannulation is a core medical skill',
          'All NCHDs should be competent in IV cannulation',
          'Anaesthesia department assists when standard approaches fail',
          'Structured referral pathway ensures appropriate use of resources',
          'Documentation supports audit and quality improvement',
        ]} />

        <InfoSection title="Step 1: Initial Consultation Within Specialty" items={[
          'Requesting NCHD must attempt cannulation first',
          'Seek assistance from senior colleague within own specialty',
          'Document number of attempts and sites tried',
        ]} />

        <InfoSection title="Step 2: Notify Admitting Consultant" items={[
          'Inform admitting consultant of failed attempts',
          'Consultant reviews clinical urgency and alternative access',
        ]} />

        <InfoSection title="Step 3: Contact Consultant Anaesthesiologist" items={[
          'Dial \'O\' — request Consultant Anaesthesiologist on call',
          'Provide patient details, number of failed attempts, clinical urgency',
          'Anaesthesiologist will assess and arrange assistance',
        ]} />

        <InfoSection title="Step 4: Complete Audit Documentation" items={[
          'Record referral in patient notes',
          'Complete audit form for departmental tracking',
        ]} />

        <View style={styles.tableWrapper}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Weekdays 09:00-17:00</Text>
            <Text style={[styles.tableHeader, { flex: 1 }]}>Out of Hours</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Contact Consultant Anaesthesiologist via switchboard</Text>
            <Text style={[styles.tableCell, { flex: 1 }]}>Contact On-Call Anaesthesia NCHD / Registrar</Text>
          </View>
        </View>

        <InfoSection title="Documentation Required" items={[
          'Patient details and clinical need',
          'Number of attempts and sites',
          'Referring doctor and specialty',
          'Outcome of anaesthesia assessment',
          'Type of access achieved',
          'Any complications',
        ]} />

        <View style={styles.importantNoteBox}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.importantNoteIcon} />
          <Text style={styles.importantNote}>
            <Text style={styles.importantNoteStrong}>Important Distinction: </Text>
            Central Venous Cannulation requires formal consultation with Anaesthesiology in the existing manner and is not covered by this protocol.
          </Text>
        </View>

        <View style={styles.contactRow}>
          <ContactCard title="Weekdays" detail="Dial 'O' → Consultant Anaesthesiologist" icon="phone-alt" />
          <ContactCard title="Out of Hours" detail="On-Call Anaesthesia Team" icon="moon" />
        </View>
      </CollapsibleCard>

      <CollapsibleCard title="Paediatric Surgery Cut-off Limit" icon="baby">
        <View style={styles.cutoffCard}>
          <Text style={styles.cutoffTitle}>Eligibility Criteria</Text>
          <View style={styles.cutoffRow}>
            <Text style={styles.cutoffLabel}>Age:</Text>
            <Text style={styles.cutoffValue}>4 years and over</Text>
          </View>
          <View style={styles.cutoffRow}>
            <Text style={styles.cutoffLabel}>Weight:</Text>
            <Text style={styles.cutoffValue}>15 kg and over</Text>
          </View>
          <Text style={styles.cutoffNote}>For non-life-threatening surgery only</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard title="Additional Protocols" icon="list">
        <Text style={styles.placeholderText}>Additional protocols will be added here as they become available.</Text>
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  protocolHeader: { backgroundColor: '#e8f4fd', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.md },
  effectiveDate: { fontSize: 13, fontWeight: '600', color: COLORS.medicalBlue },
  hours: { fontSize: 13, color: COLORS.text },
  section: { marginBottom: SPACING.md },
  sectionTitle: { fontWeight: '700', fontSize: 14, color: COLORS.primary, marginBottom: 4 },
  sectionItem: { fontSize: 13, color: COLORS.text, marginBottom: 2, paddingLeft: 4 },
  tableWrapper: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.md },
  tableRow: { flexDirection: 'row' },
  tableHeader: { backgroundColor: COLORS.medicalBlue, color: COLORS.white, padding: 8, fontWeight: '700', fontSize: 12 },
  tableCell: { padding: 8, fontSize: 12, color: COLORS.text, borderTopWidth: 1, borderTopColor: COLORS.border },
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
  contactRow: { flexDirection: 'row', gap: SPACING.sm },
  contactCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.sm },
  contactIcon: { width: 22, marginRight: 4 },
  contactTitle: { fontWeight: '700', fontSize: 12, color: COLORS.text },
  contactDetail: { fontSize: 11, color: COLORS.textMuted },
  cutoffCard: { backgroundColor: '#f0fdf4', borderRadius: 6, padding: SPACING.md, borderWidth: 1, borderColor: '#86efac' },
  cutoffTitle: { fontWeight: '700', fontSize: 16, color: COLORS.success, marginBottom: SPACING.sm },
  cutoffRow: { flexDirection: 'row', marginBottom: 4 },
  cutoffLabel: { fontWeight: '700', fontSize: 14, color: COLORS.text, width: 80 },
  cutoffValue: { fontSize: 14, color: COLORS.text },
  cutoffNote: { fontSize: 13, color: COLORS.textMuted, fontStyle: 'italic', marginTop: SPACING.sm },
  placeholderText: { fontSize: 14, color: COLORS.textMuted, fontStyle: 'italic', textAlign: 'center', padding: SPACING.lg },
});
