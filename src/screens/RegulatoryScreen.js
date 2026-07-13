import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const DEV_EMAIL = 'hussain.danial@gmail.com';

function InfoCard({ title, icon, color, children }) {
  return (
    <View style={[styles.card, { borderColor: color }]}>
      <View style={[styles.cardHeader, { backgroundColor: color }]}>
        <FontAwesome5 name={icon} size={14} color={COLORS.white} style={{ marginRight: 8 }} />
        <Text style={styles.cardHeaderText}>{title}</Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function Row({ label, children }) {
  return (
    <View style={styles.kvRow}>
      <Text style={styles.kvLabel}>{label}</Text>
      <Text style={styles.kvValue}>{children}</Text>
    </View>
  );
}

const Bullet = ({ children, color }) => (
  <View style={styles.bulletRow}>
    <Text style={[styles.bulletDot, color ? { color } : null]}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Numbered = ({ n, children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletNum}>{n}.</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

function ColumnHeading({ icon, color, children }) {
  return (
    <View style={styles.colHeadingRow}>
      {icon ? <FontAwesome5 name={icon} size={12} color={color} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.colHeading, color ? { color } : null]}>{children}</Text>
    </View>
  );
}

const mailto = (subject, body) => {
  const q = `?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`;
  Linking.openURL(`mailto:${DEV_EMAIL}${q}`).catch(() => {});
};

export default function RegulatoryScreen() {
  return (
    <ScreenWrapper title="Regulatory & Safety Information" subtitle="Intended Use, Limitations & Safety" icon="shield-alt">

      {/* App Identification */}
      <InfoCard title="App Identification" icon="tag" color={COLORS.primary}>
        <Row label="App Name">Anaesthesia Companion</Row>
        <Row label="Version">v2.1.0</Row>
        <Row label="Release Date">May 2026</Row>
        <Row label="Platform">Progressive Web Application (PWA)</Row>
        <Row label="Developer">Dr. Danial Hussain, WGH Anaesthesia Department</Row>
        <Row label="Contact">
          <Text style={styles.link} onPress={() => mailto('Anaesthesia Companion')}>{DEV_EMAIL}</Text>
        </Row>
        <Row label="App Type">Clinical reference & educational resource</Row>
        <Row label="Last Content Review">May 2026 (v2.1.0)</Row>
      </InfoCard>

      {/* Intended Purpose */}
      <InfoCard title="Intended Purpose" icon="bullseye" color={COLORS.success}>
        <Text style={styles.lead}>
          Anaesthesia Companion is a clinical reference and educational resource for anaesthesia and critical care professionals at Wexford General Hospital. It brings together guidelines, protocols, algorithms, and teaching materials in one accessible place.
        </Text>

        <ColumnHeading icon="check-circle" color={COLORS.success}>What it provides</ColumnHeading>
        <Bullet>Guideline and protocol reference text (DAS, ASRA, AAGBI, ALS, OAA/RCOA)</Bullet>
        <Bullet>Anticoagulation timing reference tables (ASRA 5th Ed.)</Bullet>
        <Bullet>Emergency algorithm reference (QRH 2023, ALS/Resus Council UK)</Bullet>
        <Bullet>Airway management algorithm summaries (DAS guidelines)</Bullet>
        <Bullet>Labour analgesia protocols (OAA/RCOA)</Bullet>
        <Bullet>Perioperative medication management reference</Bullet>
        <Bullet>ROTEM-guided haemorrhage pathway reference</Bullet>
        <Bullet>Departmental protocols and teaching materials</Bullet>
        <Bullet>Antimicrobial prescribing guidelines</Bullet>

        <ColumnHeading icon="times-circle" color={COLORS.danger}>What it is not</ColumnHeading>
        <Bullet color={COLORS.danger}>A clinical decision-making tool or calculator</Bullet>
        <Bullet color={COLORS.danger}>A substitute for clinical judgement or direct patient assessment</Bullet>
        <Bullet color={COLORS.danger}>A diagnostic or prescribing tool</Bullet>
        <Bullet color={COLORS.danger}>A replacement for current BNF, SPC, or institutional protocols</Bullet>
        <Bullet color={COLORS.danger}>A system for storing or processing identifiable patient data</Bullet>
        <Bullet color={COLORS.danger}>Suitable for use by non-healthcare professionals without supervision</Bullet>
        <Bullet color={COLORS.danger}>A definitive source — all content must be confirmed against current standards</Bullet>

        <View style={styles.alertWarn}>
          <FontAwesome5 name="exclamation-triangle" size={13} color="#856404" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.alertWarnText}>
            <Text style={{ fontWeight: '700' }}>Important: </Text>
            Information in this app is for professional education and reference only. It must always be confirmed against current evidence-based standards and your individual patient's clinical situation before application.
          </Text>
        </View>
      </InfoCard>

      {/* Intended Users */}
      <InfoCard title="Intended Users" icon="user-md" color={COLORS.info}>
        <ColumnHeading>Primary Users</ColumnHeading>
        <Bullet>Consultant anaesthetists</Bullet>
        <Bullet>Specialist registrars in anaesthesia</Bullet>
        <Bullet>Senior house officers in anaesthesia</Bullet>
        <Bullet>Anaesthesia trainees and medical students (supervised)</Bullet>
        <Bullet>Critical care physicians</Bullet>
        <Bullet>Advanced nurse practitioners in anaesthesia</Bullet>

        <ColumnHeading>Typical Settings</ColumnHeading>
        <Bullet>Operating theatres and anaesthetic rooms</Bullet>
        <Bullet>Post-anaesthesia care units (PACU / recovery)</Bullet>
        <Bullet>Intensive care units (ICU)</Bullet>
        <Bullet>Labour ward and obstetric theatre</Bullet>
        <Bullet>Preoperative assessment clinics</Bullet>
        <Bullet>Self-directed study and exam preparation</Bullet>
      </InfoCard>

      {/* Instructions for Use */}
      <InfoCard title="Instructions for Use" icon="book-open" color={COLORS.dark}>
        <ColumnHeading icon="play-circle" color={COLORS.success}>Before Use</ColumnHeading>
        <Numbered n={1}>Confirm you are a qualified healthcare professional or supervised trainee.</Numbered>
        <Numbered n={2}>Ensure you have a stable connection for up-to-date content.</Numbered>
        <Numbered n={3}>Verify the app version in the footer matches the current release.</Numbered>
        <Numbered n={4}>Do not use this app as your sole reference — always cross-check with BNF, SPC, and local protocols.</Numbered>

        <ColumnHeading icon="cogs" color={COLORS.primary}>During Use</ColumnHeading>
        <Numbered n={1}>Review all content critically — no reference material overrides clinical judgement.</Numbered>
        <Numbered n={2}>For paediatric patients, confirm all information with a senior clinician.</Numbered>
        <Numbered n={3}>Always check that guidelines referenced are current for your institution.</Numbered>
        <Numbered n={4}>Do not enter patient identifiers into this app.</Numbered>

        <ColumnHeading icon="flag-checkered" color={COLORS.danger}>After Use</ColumnHeading>
        <Numbered n={1}>Document clinical decisions in the patient record — not in this app.</Numbered>
        <Numbered n={2}>Report any discrepancies or errors to the developer promptly.</Numbered>
        <Numbered n={3}>Do not share screenshots of patient-related information outside your clinical record system.</Numbered>
        <Numbered n={4}>Check for updates by verifying the version shown in the footer.</Numbered>
      </InfoCard>

      {/* Warnings & Limitations */}
      <InfoCard title="Warnings & Known Limitations" icon="exclamation-triangle" color={COLORS.danger}>
        <ColumnHeading color={COLORS.danger}>Warnings</ColumnHeading>
        <Bullet color={COLORS.danger}>Not a substitute for clinical judgement. All information is for reference and education only. The treating clinician bears full professional responsibility for all clinical decisions.</Bullet>
        <Bullet color={COLORS.danger}>Emergency situations: Always prioritise direct patient assessment and your institution's emergency protocols over any reference material.</Bullet>
        <Bullet color={COLORS.danger}>Paediatric use: All information regarding paediatric patients requires independent verification by a senior clinician.</Bullet>
        <Bullet color={COLORS.danger}>Pregnancy: Consult specialist obstetric anaesthesia references for drug use in pregnancy.</Bullet>
        <Bullet color={COLORS.danger}>Connectivity: Some features require internet access. Do not rely solely on this app in areas with unreliable connectivity.</Bullet>

        <ColumnHeading color="#997404">Known Limitations</ColumnHeading>
        <Bullet>Drug interactions are not assessed by this app. Always consult the BNF Interactions checker or a clinical pharmacist.</Bullet>
        <Bullet>ECMO parameters are guidance values only; specialist perfusionist and critical care input is required.</Bullet>
        <Bullet>AI tools (where present) use large language models and may produce plausible but inaccurate clinical content. All AI outputs require critical clinician review.</Bullet>
        <Bullet>Content currency: Guidelines are updated periodically. The last content audit was completed May 2026 (v2.1.0). Users should check for newer versions of referenced guidelines.</Bullet>
      </InfoCard>

      {/* Data & Privacy */}
      <InfoCard title="Data & Privacy" icon="lock" color={COLORS.info}>
        <ColumnHeading>What data is collected</ColumnHeading>
        <Bullet>No patient data is stored. This app does not collect, transmit, or retain any patient information.</Bullet>
        <Bullet>User acknowledgment preferences are stored in browser sessionStorage on your device only and cleared when the session ends.</Bullet>
        <Bullet>No cookies are used beyond those essential for PWA functionality.</Bullet>
        <Bullet>No analytics, tracking, or user profiling is performed.</Bullet>
        <Bullet>AI query text (if used) is processed by OpenAI API. Do not enter patient-identifiable information into AI queries.</Bullet>

        <ColumnHeading>Privacy by design</ColumnHeading>
        <Bullet>Users are instructed not to enter patient identifiers — this is reinforced by the session acknowledgement.</Bullet>
        <Bullet>If a patient identifier is accidentally entered, it is not transmitted or retained beyond the current browser session.</Bullet>
        <Bullet>This app is deployed under WGH ICT governance and the HSE Data Protection Framework.</Bullet>
        <View style={styles.bulletRow}>
          <Text style={styles.bulletDot}>•</Text>
          <Text style={styles.bulletText}>
            For further details see the{' '}
            <Text style={styles.link} onPress={() => Linking.openURL('/privacy').catch(() => {})}>Privacy Policy</Text>.
          </Text>
        </View>
      </InfoCard>

      {/* Feedback & Error Reporting */}
      <InfoCard title="Feedback & Error Reporting" icon="comment-medical" color={COLORS.warning}>
        <Text style={styles.bodyText}>
          Users are encouraged to report any concerns about app performance, clinical content errors, or unexpected behaviour. All reports are reviewed and addressed by the developer.
        </Text>

        <View style={styles.reportCard}>
          <FontAwesome5 name="envelope" size={20} color={COLORS.primary} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Clinical Content Error</Text>
          <Text style={styles.reportText}>Report incorrect information, outdated guidelines, or missing content.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.primary }]} onPress={() => mailto('Anaesthesia Companion Content Error', 'Version: v2.1.0\nPage: \nError description: ')}>
            <Text style={styles.reportBtnText}>Report Error</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="bug" size={20} color={COLORS.danger} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Technical Issue</Text>
          <Text style={styles.reportText}>Report display errors, broken links, or app malfunctions.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.danger }]} onPress={() => mailto('Anaesthesia Companion Technical Issue', 'Version: v2.1.0\nDevice/Browser: \nIssue description: ')}>
            <Text style={styles.reportBtnText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="lightbulb" size={20} color={COLORS.success} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Suggestion</Text>
          <Text style={styles.reportText}>Suggest new reference content, protocols, or features.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.success }]} onPress={() => mailto('Anaesthesia Companion Suggestion', 'Version: v2.1.0\nSuggestion: ')}>
            <Text style={styles.reportBtnText}>Send Suggestion</Text>
          </TouchableOpacity>
        </View>
      </InfoCard>

      {/* Disclaimer */}
      <InfoCard title="Disclaimer" icon="gavel" color={COLORS.dark}>
        <Text style={styles.bodyText}>
          Anaesthesia Companion is an independent clinical reference and educational application developed by an individual clinician. It is not developed or endorsed by any hospital, health service, pharmaceutical company, or regulatory body.
        </Text>
        <Text style={styles.bodyText}>
          All content is provided in good faith based on published evidence-based guidelines for educational and reference purposes only. The developer makes no warranty, expressed or implied, regarding accuracy, completeness, or fitness for any particular clinical purpose. The developer accepts no liability for clinical decisions made on the basis of information provided by this app.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 0 }]}>
          Users are solely responsible for verifying all information against current standards, institutional protocols, and their patient's individual clinical circumstances before any clinical application.
        </Text>
      </InfoCard>

      <View style={styles.bulletRow}>
        <Text style={styles.bulletDot}>•</Text>
        <Text style={styles.bulletText}>
          For assistance, visit{' '}
          <Text style={styles.link} onPress={() => Linking.openURL('/support').catch(() => {})}>Support</Text>.
        </Text>
      </View>

    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: BORDER_RADIUS, marginBottom: SPACING.md, overflow: 'hidden', ...SHADOW },
  cardHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: SPACING.sm },
  cardHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  cardBody: { padding: SPACING.md, backgroundColor: COLORS.white },
  kvRow: { flexDirection: 'row', paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: COLORS.border },
  kvLabel: { width: 130, fontSize: 12, fontWeight: '700', color: COLORS.text },
  kvValue: { flex: 1, fontSize: 12, color: COLORS.text },
  lead: { fontSize: 14, color: COLORS.text, lineHeight: 20, marginBottom: SPACING.sm },
  bodyText: { fontSize: 13, color: COLORS.text, lineHeight: 19, marginBottom: SPACING.sm },
  colHeadingRow: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.sm, marginBottom: 4 },
  colHeading: { fontSize: 13, fontWeight: '700', color: COLORS.text },
  bulletRow: { flexDirection: 'row', marginBottom: 4, paddingRight: 4 },
  bulletDot: { fontSize: 13, color: COLORS.text, marginRight: 6, lineHeight: 18 },
  bulletNum: { fontSize: 12, color: COLORS.text, marginRight: 6, lineHeight: 18, fontWeight: '700', minWidth: 16 },
  bulletText: { flex: 1, fontSize: 12, color: COLORS.text, lineHeight: 18 },
  link: { color: COLORS.primary, textDecorationLine: 'underline' },
  alertWarn: {
    backgroundColor: '#fff3cd', borderRadius: 6, padding: SPACING.sm, marginTop: SPACING.sm,
    borderLeftWidth: 4, borderLeftColor: '#ffc107', flexDirection: 'row', alignItems: 'flex-start',
  },
  alertWarnText: { color: '#856404', fontSize: 12, lineHeight: 17, flex: 1 },
  alertDanger: {
    backgroundColor: '#f8d7da', borderRadius: 6, padding: SPACING.sm, marginTop: SPACING.sm,
    borderLeftWidth: 4, borderLeftColor: '#dc3545', flexDirection: 'row', alignItems: 'flex-start',
  },
  alertDangerText: { color: '#842029', fontSize: 12, lineHeight: 17, flex: 1 },
  reportCard: { backgroundColor: COLORS.light, borderRadius: 8, padding: SPACING.md, marginBottom: SPACING.sm, alignItems: 'center' },
  reportTitle: { fontSize: 13, fontWeight: '700', color: COLORS.text, marginBottom: 3 },
  reportText: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: 8, lineHeight: 16 },
  reportBtn: { borderRadius: 6, paddingVertical: 7, paddingHorizontal: 16 },
  reportBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 12 },
});
