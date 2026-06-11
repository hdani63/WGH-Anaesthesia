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
        <Row label="Platform">Mobile Application (iOS / Android)</Row>
        <Row label="Access">Guest access available; optional account</Row>
        <Row label="Developer">Danial Hussain</Row>
        <Row label="Contact">
          <Text style={styles.link} onPress={() => mailto('Anaesthesia Companion')}>{DEV_EMAIL}</Text>
        </Row>
        <Row label="App Type">Independent clinical reference & decision support</Row>
        <Row label="Intended Users">Clinicians and trainees in anaesthesia</Row>
        <Row label="Last Content Review">May 2026 (v2.1.0)</Row>
      </InfoCard>

      {/* Intended Purpose */}
      <InfoCard title="Intended Purpose" icon="bullseye" color={COLORS.success}>
        <Text style={styles.lead}>
          Anaesthesia Companion brings together anaesthesia-related guidelines, protocols, algorithms, teaching notes, and resources in one place for clinicians and trainees. Use it to review perioperative planning, emergency algorithms, airway management summaries, regional anaesthesia timing references, and more.
        </Text>

        <ColumnHeading icon="check-circle" color={COLORS.success}>What it provides</ColumnHeading>
        <Bullet>Weight- and age-adjusted drug dose reference tables</Bullet>
        <Bullet>Validated clinical scoring tools (APACHE II, SOFA, RCRI, Apfel, etc.)</Bullet>
        <Bullet>Regional anaesthesia & anticoagulation timing guidance (ASRA 5th Ed)</Bullet>
        <Bullet>Emergency algorithm reference (QRH 2023, ALS/Resus Council UK)</Bullet>
        <Bullet>Airway management algorithm summaries (DAS guidelines)</Bullet>
        <Bullet>Labour analgesia protocols (OAA/RCOA)</Bullet>
        <Bullet>Perioperative medication management guidance</Bullet>
        <Bullet>Teaching notes and educational resources for trainees</Bullet>
        <Bullet>ROTEM-guided haemorrhage management pathways</Bullet>

        <ColumnHeading icon="times-circle" color={COLORS.danger}>What it is not</ColumnHeading>
        <Bullet color={COLORS.danger}>A substitute for clinical judgement or direct patient assessment</Bullet>
        <Bullet color={COLORS.danger}>A diagnostic or prescribing tool</Bullet>
        <Bullet color={COLORS.danger}>A replacement for current BNF, SPC, or institutional protocols</Bullet>
        <Bullet color={COLORS.danger}>A system for storing or processing identifiable patient data</Bullet>
        <Bullet color={COLORS.danger}>Suitable for use by non-healthcare professionals without supervision</Bullet>
        <Bullet color={COLORS.danger}>Validated for veterinary or non-human medicine</Bullet>
        <Bullet color={COLORS.danger}>A definitive source — all content must be confirmed against current standards and your patient's situation</Bullet>

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
        <Numbered n={1}>Enter accurate patient weight, age, and sex before calculating doses.</Numbered>
        <Numbered n={2}>Review all outputs critically — no software output overrides clinical judgement.</Numbered>
        <Numbered n={3}>For paediatric patients, confirm all doses with a senior clinician.</Numbered>
        <Numbered n={4}>Dose ranges reflect standard adult references; adjust for renal, hepatic, and cardiac status.</Numbered>
        <Numbered n={5}>Scoring systems provide risk estimates, not diagnoses.</Numbered>

        <ColumnHeading icon="flag-checkered" color={COLORS.danger}>After Use</ColumnHeading>
        <Numbered n={1}>Document clinical decisions in the patient record — not in this app.</Numbered>
        <Numbered n={2}>Report any discrepancies or errors to the developer promptly.</Numbered>
        <Numbered n={3}>Do not share screenshots of patient-specific outputs outside your clinical record system.</Numbered>
        <Numbered n={4}>Check for updates by verifying the version shown in the footer.</Numbered>
      </InfoCard>

      {/* Warnings & Limitations */}
      <InfoCard title="Warnings & Known Limitations" icon="exclamation-triangle" color={COLORS.danger}>
        <ColumnHeading color={COLORS.danger}>Warnings</ColumnHeading>
        <Bullet color={COLORS.danger}>Not a substitute for clinical judgement. All outputs are advisory. The treating clinician bears full professional responsibility for all clinical decisions.</Bullet>
        <Bullet color={COLORS.danger}>Drug dose ranges reflect standard published guidelines. Individual pharmacokinetics, comorbidities, and concurrent medications must always be considered.</Bullet>
        <Bullet color={COLORS.danger}>Emergency situations: Always prioritise direct patient assessment and your institution's emergency protocols over app outputs.</Bullet>
        <Bullet color={COLORS.danger}>Connectivity: Some features require internet access. Do not rely solely on this app in areas with unreliable connectivity without confirming offline content is current.</Bullet>
        <Bullet color={COLORS.danger}>Paediatric use: All paediatric dosing outputs require independent verification by a senior clinician.</Bullet>
        <Bullet color={COLORS.danger}>Pregnancy: Drug doses in pregnancy are not always reflected in standard ranges. Consult specialist obstetric anaesthesia references.</Bullet>

        <ColumnHeading color="#997404">Known Limitations</ColumnHeading>
        <Bullet>Framingham Risk Score uses a simplified approximation; validated gender-specific coefficient tables are not fully implemented in this version.</Bullet>
        <Bullet>Infusion rate calculations assume standard concentrations; verify against your pharmacy's prepared concentration.</Bullet>
        <Bullet>ECMO parameters are guidance values only; actual management requires specialist perfusionist and critical care input.</Bullet>
        <Bullet>Drug interactions are not assessed by this app. Always consult the BNF Interactions checker or a clinical pharmacist.</Bullet>
        <Bullet>Content currency: Guidelines are updated periodically. The last content audit was completed May 2026 (v2.1.0).</Bullet>
        <Bullet>AI tools (where present) use large language models and may produce plausible but inaccurate clinical content. All AI outputs require critical clinician review.</Bullet>
      </InfoCard>

      {/* Data & Privacy */}
      <InfoCard title="Data & Privacy" icon="lock" color={COLORS.info}>
        <ColumnHeading>What data is collected</ColumnHeading>
        <Bullet>No patient data is stored. All calculator inputs are processed locally on the device and are not transmitted to any server.</Bullet>
        <Bullet>User acknowledgment preferences are stored on your device only.</Bullet>
        <Bullet>No cookies are used beyond those essential for app functionality.</Bullet>
        <Bullet>No analytics, tracking, or user profiling is performed.</Bullet>

        <ColumnHeading>Privacy by design</ColumnHeading>
        <Bullet>All clinical calculations are processed locally on your device.</Bullet>
        <Bullet>No patient identifiers should be entered into this app.</Bullet>
        <Bullet>If a patient identifier is accidentally entered, it is not transmitted or retained beyond the current session.</Bullet>
        <Bullet>For further details see the Privacy Policy.</Bullet>
      </InfoCard>

      {/* Feedback & Incident Reporting */}
      <InfoCard title="Feedback, Errors & Incident Reporting" icon="comment-medical" color={COLORS.warning}>
        <Text style={styles.bodyText}>
          Users are encouraged to report any concerns about app performance, clinical content errors, or unexpected behaviour. All reports are reviewed and addressed by the developer.
        </Text>

        <View style={styles.reportCard}>
          <FontAwesome5 name="envelope" size={20} color={COLORS.primary} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Clinical Content Error</Text>
          <Text style={styles.reportText}>Report incorrect drug doses, scoring errors, or outdated guidelines.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.primary }]} onPress={() => mailto('Anaesthesia Companion Content Error', 'Version: v2.1.0\nPage: \nError description: ')}>
            <Text style={styles.reportBtnText}>Report Error</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="bug" size={20} color={COLORS.danger} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Technical Issue</Text>
          <Text style={styles.reportText}>Report calculator malfunctions, display errors, or app crashes.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.danger }]} onPress={() => mailto('Anaesthesia Companion Technical Issue', 'Version: v2.1.0\nDevice/Browser: \nIssue description: ')}>
            <Text style={styles.reportBtnText}>Report Issue</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.reportCard}>
          <FontAwesome5 name="lightbulb" size={20} color={COLORS.success} style={{ marginBottom: 6 }} />
          <Text style={styles.reportTitle}>Suggestion</Text>
          <Text style={styles.reportText}>Suggest new features, tools, or content additions.</Text>
          <TouchableOpacity style={[styles.reportBtn, { backgroundColor: COLORS.success }]} onPress={() => mailto('Anaesthesia Companion Suggestion', 'Version: v2.1.0\nSuggestion: ')}>
            <Text style={styles.reportBtnText}>Send Suggestion</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.alertDanger}>
          <FontAwesome5 name="exclamation-circle" size={13} color="#842029" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={styles.alertDangerText}>
            <Text style={{ fontWeight: '700' }}>Patient Safety Incidents: </Text>
            If a software output may have contributed to patient harm, report the incident through your institution's clinical incident reporting system and notify the developer at{' '}
            <Text style={styles.link} onPress={() => mailto('Anaesthesia Companion Safety Incident')}>{DEV_EMAIL}</Text>
            {' '}so the issue can be investigated and corrected urgently.
          </Text>
        </View>
      </InfoCard>

      {/* Disclaimer */}
      <InfoCard title="Disclaimer" icon="gavel" color={COLORS.dark}>
        <Text style={styles.bodyText}>
          Anaesthesia Companion is an independent reference application developed by an individual clinician. It is not developed or endorsed by any hospital, health service, pharmaceutical company, or regulatory body.
        </Text>
        <Text style={styles.bodyText}>
          All content is provided in good faith based on published evidence-based guidelines. The developer makes no warranty, expressed or implied, regarding accuracy, completeness, or fitness for any particular clinical purpose. The developer accepts no liability for clinical decisions made on the basis of information provided by this app.
        </Text>
        <Text style={[styles.bodyText, { marginBottom: 0 }]}>
          Users are solely responsible for verifying all information against current standards, institutional protocols, and their patient's individual clinical circumstances before any clinical application.
        </Text>
      </InfoCard>

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
