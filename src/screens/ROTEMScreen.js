import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const JOTFORM_URL = 'https://form.jotform.com/230693021348048';

function InfoSection({ title, items }) {
  return (
    <View style={styles.infoSection}>
      <Text style={styles.infoTitle}>{title}</Text>
      {items.map((item, i) => (
        <Text key={i} style={styles.infoItem}>• {item}</Text>
      ))}
    </View>
  );
}

function StepList({ steps }) {
  return steps.map((s, i) => (
    <View key={i} style={styles.stepRow}>
      <View style={styles.stepNum}><Text style={styles.stepNumText}>{i + 1}</Text></View>
      <Text style={styles.stepText}>{s}</Text>
    </View>
  ));
}

export default function ROTEMScreen() {
  return (
    <ScreenWrapper title="ROTEM Analysis" subtitle="Thromboelastometry guided coagulation management">
      <CollapsibleCard title="ROTEM Quick Setup Guide" defaultOpen>
        <InfoSection title="Parameters Measured" items={[
          'EXTEM — Extrinsic pathway (tissue factor activated)',
          'INTEM — Intrinsic pathway (contact activated)',
          'FIBTEM — Fibrinogen contribution (platelet inhibited)',
          'APTEM — Antifibrinolytic effect (aprotinin added)',
          'HEPTEM — Heparin reversal assessment',
        ]} />
        <InfoSection title="Key Values" items={[
          'CT (Clotting Time) — Time to initiation of clotting',
          'CFT (Clot Formation Time) — Time from CT to 20mm amplitude',
          'A5/A10 — Amplitude at 5/10 minutes (early clot firmness)',
          'MCF (Maximum Clot Firmness) — Maximum amplitude',
          'ML (Maximum Lysis) — Clot breakdown percentage',
        ]} />
        <InfoSection title="Normal Ranges" items={[
          'EXTEM CT: 38-79s',
          'EXTEM CFT: 34-159s',
          'EXTEM MCF: 50-72mm',
          'FIBTEM MCF: 9-25mm',
          'INTEM CT: 100-240s',
        ]} />
      </CollapsibleCard>

      <CollapsibleCard title="ROTEM Protocol - Obstetric Haemorrhage">
        <View style={styles.alertBox}>
          <View style={styles.alertRow}>
            <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              <Text style={styles.alertStrong}>Warning: </Text>
              Obstetric-specific reference ranges differ from general surgical values
            </Text>
          </View>
        </View>
        <InfoSection title="Obstetric Trigger Values" items={[
          'FIBTEM A5 < 12mm → Give Fibrinogen (Cryoprecipitate or Concentrate)',
          'EXTEM A5 < 35mm + FIBTEM A5 ≥ 12mm → Give Platelets',
          'EXTEM CT > 80s → Give FFP',
          'EXTEM ML > 15% → Give Tranexamic Acid',
        ]} />
        <InfoSection title="Fibrinogen Targets in Obstetric Haemorrhage" items={[
          'Target Fibrinogen > 2.0 g/L (higher than general surgical)',
          'FIBTEM MCF < 12mm suggests Fibrinogen < 2.0 g/L',
          'Give Cryoprecipitate 2 pools or Fibrinogen Concentrate 2-4g',
          'Recheck ROTEM after each intervention',
        ]} />
        <StepList steps={[
          'Activate Major Obstetric Haemorrhage protocol',
          'Take ROTEM sample immediately',
          'Give TXA 1g IV if not already given',
          'Review ROTEM results at 5 minutes (A5 values)',
          'Treat according to trigger values above',
          'Repeat ROTEM after each round of blood products',
          'Target FIBTEM A5 > 12mm, EXTEM A5 > 35mm',
          'Escalate if ongoing bleeding despite correction',
        ]} />
      </CollapsibleCard>

      <CollapsibleCard title="Non-Obstetric ROTEM-Guided Major Haemorrhage">
        <InfoSection title="General Surgical Trigger Values" items={[
          'FIBTEM A5 < 9mm → Give Fibrinogen (Cryo or Concentrate)',
          'EXTEM A5 < 35mm + FIBTEM A5 ≥ 9mm → Give Platelets',
          'EXTEM CT > 80s → Give FFP (15-20 mL/kg)',
          'EXTEM ML > 15% or APTEM correction → Give TXA 1g IV',
          'HEPTEM corrects INTEM → Consider Protamine',
        ]} />
        <InfoSection title="Treatment Algorithm" items={[
          '1. Initiate Major Haemorrhage Protocol — call blood bank',
          '2. Take baseline ROTEM + bloods (FBC, Coag, Fibrinogen)',
          '3. Empiric: O Neg blood + TXA 1g IV',
          '4. At 5 min: review A5 values for targeted therapy',
          '5. At 10 min: confirm with A10 values',
          '6. Repeat ROTEM after each intervention cycle',
          '7. Target: FIBTEM MCF > 9mm, EXTEM MCF > 50mm',
          '8. Plt count > 50 (>100 if CNS/eye trauma)',
        ]} />
      </CollapsibleCard>

      <CollapsibleCard title="ROTEM Decision Tool (Interactive)">
        <Text style={styles.toolDesc}>
          Use the interactive ROTEM Decision Tool to guide coagulation management based on your ROTEM results. This opens an external form.
        </Text>
        <TouchableOpacity style={styles.openBtn} onPress={() => Linking.openURL(JOTFORM_URL)}>
          <Text style={styles.openBtnText}>Open ROTEM Decision Tool</Text>
        </TouchableOpacity>
        <Text style={styles.urlText}>{JOTFORM_URL}</Text>
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  infoSection: { marginBottom: SPACING.md },
  infoTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue, marginBottom: SPACING.xs },
  infoItem: { fontSize: 13, color: COLORS.text, marginBottom: 3, paddingLeft: 4 },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: SPACING.xs },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.xs },
  stepNumText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },
  stepText: { fontSize: 13, color: COLORS.text, flex: 1, paddingTop: 2 },
  alertBox: { backgroundColor: '#fff3cd', borderLeftWidth: 4, borderLeftColor: '#ffc107', padding: SPACING.sm, borderRadius: 4, marginBottom: SPACING.md },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start' },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertText: { fontSize: 13, color: '#856404', lineHeight: 18 },
  alertStrong: { fontWeight: '700', color: '#856404' },
  toolDesc: { fontSize: 14, color: COLORS.text, marginBottom: SPACING.md, lineHeight: 20 },
  openBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.xs },
  openBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  urlText: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center' },
});
