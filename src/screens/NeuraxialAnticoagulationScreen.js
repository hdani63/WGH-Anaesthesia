import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const RAPM_DOC = {
  title: 'RAPM ASRA 5th Edition (2025)',
  fileName: 'rapm_2024_105766_full.pdf',
  source: require('../../assets/pdfs/neuraxial/rapm_2024_105766_full.pdf'),
};

function DataTable({ headers, rows, columnWidths }) {
  const widths = columnWidths || headers.map((_, idx) => (idx === 0 ? 180 : 150));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {headers.map((h, i) => (
            <Text key={i} style={[styles.headerCell, { width: widths[i], minWidth: widths[i] }]}>{h}</Text>
          ))}
        </View>
        {rows.map((row, i) => (
          <View key={i} style={[styles.dataRow, i % 2 === 0 && styles.altRow]}>
            {row.map((cell, j) => (
              <Text key={j} style={[styles.dataCell, { width: widths[j], minWidth: widths[j] }]}>{cell}</Text>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

function InfoBox({ title, items, color, bgColor = '#f8f9fa', icon }) {
  return (
    <View style={[styles.infoBox, { borderLeftColor: color || COLORS.primary, backgroundColor: bgColor }]}>
      <View style={styles.infoTitleRow}>
        {icon ? <FontAwesome5 name={icon} size={13} color={color || COLORS.primary} style={styles.infoTitleIcon} /> : null}
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      {items.map((item, i) => <Text key={i} style={styles.infoItem}>• {item}</Text>)}
    </View>
  );
}

const tabs = [
  { key: 'overview', title: 'Overview', icon: 'info-circle' },
  { key: 'heparin', title: 'Heparin', icon: 'tint' },
  { key: 'doacs', title: 'DOACs', icon: 'pills' },
  { key: 'antiplatelet', title: 'Antiplatelet', icon: 'tablet-alt' },
  { key: 'warfarin', title: 'Warfarin', icon: 'capsules' },
];

export default function NeuraxialAnticoagulationScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <ScreenWrapper title="Neuraxial Anaesthesia & Anticoagulation" subtitle="ASRA Evidence-Based Guidelines (5th Edition, 2025)">
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(RAPM_DOC.source, RAPM_DOC.fileName, RAPM_DOC.title)}>
          <Text style={styles.primaryBtnText}>Open Full Guideline PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(RAPM_DOC.source, RAPM_DOC.fileName, RAPM_DOC.title)}>
          <Text style={styles.outlineBtnText}>Download</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
              <FontAwesome5 name={tab.icon} size={12} color={active ? COLORS.white : COLORS.textMuted} style={styles.tabIcon} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {activeTab === 'overview' && (
        <View style={styles.guidelinesCard}>
          <Text style={styles.sectionTitle}>Key Principles</Text>

          <View style={styles.alertBox}>
            <FontAwesome5 name="exclamation-triangle" size={13} color="#856404" style={styles.alertIcon} />
            <Text style={styles.alertText}>
              <Text style={styles.alertStrong}>Important: </Text>
              These guidelines use an antihemorrhagic approach focused on patient safety. Individual risk-benefit assessment is essential.
            </Text>
          </View>

          <InfoBox
            title="Timing Nomenclature"
            icon="clock"
            items={[
              'Low Dose: Previously prophylactic dosing',
              'High Dose: Previously therapeutic dosing',
              'The same dose may be low or high depending on patient characteristics',
            ]}
            color={COLORS.primary}
          />

          <InfoBox
            title="Safety Measures"
            icon="shield-alt"
            items={[
              'Daily medication review',
              'Neurologic monitoring for at least 24 hours post-catheter removal',
              'Minimal local anaesthetic concentrations for monitoring',
              'Early epidural hematoma detection protocols',
            ]}
            color={COLORS.success}
          />

          <Text style={styles.subSectionTitle}>Risk Factors for Bleeding</Text>
          <InfoBox
            title="Patient Factors"
            items={['Female gender', 'Age over 65 years', 'History of bleeding or bruising', 'Renal insufficiency']}
            color={COLORS.danger}
            bgColor="#fff5f5"
          />
          <InfoBox
            title="Procedural Factors"
            items={['Spinal abnormalities', 'Multiple needle insertion attempts', 'Traumatic needle placement']}
            color={COLORS.warning}
            bgColor="#fff9e6"
          />
          <InfoBox
            title="Medication Factors"
            items={['Concomitant anticoagulants', 'Drug interactions', 'Impaired drug metabolism']}
            color={COLORS.info}
            bgColor="#eef7ff"
          />
        </View>
      )}

      {activeTab === 'heparin' && (
        <View>
          <CollapsibleCard title="Unfractionated Heparin (UFH)">
            <DataTable headers={['Route & Dose', 'Pre-Procedure Timing', 'Post-Procedure Timing', 'Catheter Removal', 'Monitoring']} columnWidths={[220, 190, 180, 180, 180]} rows={[
              ['IV Heparin\nVariable dose', '4-6 hours\nwith normal coagulation', '1 hour after needle placement', 'Normal coagulation required', 'aPTT, platelet count'],
              ['SC UFH Low Dose\n5000 U BID/TID', '4-6 hours\nor normal coagulation', '1 hour after needle placement', 'Normal coagulation', 'Platelet count if >4 days'],
              ['SC UFH Higher Dose\n7500-10000 U BID\nor <=20,000 U daily', '12 hours\nwith normal coagulation', '1 hour after needle placement', 'Normal coagulation', 'aPTT, platelet count'],
              ['SC UFH Very High\n>10,000 U per dose\nor >20,000 U daily', 'Extended interval required', '1 hour after needle placement', 'Normal coagulation', 'aPTT, platelet count'],
            ]} />
          </CollapsibleCard>
          <CollapsibleCard title="Low Molecular Weight Heparin (LMWH)">
            <DataTable headers={['Indication', 'Pre-Procedure Timing', 'Post-Procedure Timing', 'Catheter Management', 'Special Considerations']} columnWidths={[220, 170, 200, 220, 190]} rows={[
              ['Low Dose\nProphylactic dosing', '12 hours', '>=12 hours after needle/catheter placement', 'Remove before LMWH initiation\nDelay LMWH 4 hours after removal', 'Single daily dosing preferred'],
              ['High Dose\nTreatment dosing', '24 hours', '>=12 hours after needle/catheter placement', 'Remove before LMWH initiation\nDelay LMWH 4 hours after removal', 'Consider anti-Xa levels'],
              ['Twice Daily Dosing\nHigher risk regimen', '12-24 hours\nbased on dose', 'Remove catheters before initiation', 'No indwelling catheters', 'Higher bleeding risk'],
            ]} />
            <Text style={styles.noteText}>Note: For renal impairment (CrCl {'<'}30 mL/min), consider dose adjustment and anti-Xa monitoring.</Text>
          </CollapsibleCard>
        </View>
      )}

      {activeTab === 'doacs' && (
        <View>
          <CollapsibleCard title="Direct Oral Anticoagulants">
            <DataTable headers={['Drug', 'Low Dose Indications', 'High Dose Indications', 'Pre-Procedure Timing', 'Post-Procedure Timing', 'Catheter Removal']} columnWidths={[170, 190, 190, 170, 180, 170]} rows={[
              ['Rivaroxaban\n(Xarelto)', '10 mg daily\nDVT/PE prophylaxis post-surgery', '15-20 mg daily\nDVT/PE treatment, AF', '72 hours', '6 hours after catheter removal', '6 hours before restarting'],
              ['Apixaban\n(Eliquis)', '2.5 mg BID\nDVT/PE prophylaxis', '5-10 mg BID\nDVT/PE treatment, AF', '72 hours', '6 hours after catheter removal', '6 hours before restarting'],
              ['Edoxaban\n(Lixiana)', 'N/A', '30-60 mg daily\nDVT/PE treatment, AF', '72 hours', '6 hours after catheter removal', '6 hours before restarting'],
              ['Dabigatran\n(Pradaxa)', '110-220 mg daily\nDVT/PE prophylaxis', '150 mg BID\nDVT/PE treatment, AF', '48-72 hours*', '6 hours after catheter removal', '6 hours before restarting'],
            ]} />
          </CollapsibleCard>

          <InfoBox
            title="Dabigatran Special Considerations"
            icon="exclamation-circle"
            color={COLORS.warning}
            bgColor="#fff9e6"
            items={[
              '48 hours if CrCl >80 mL/min',
              '72 hours if CrCl 50-80 mL/min',
              '96 hours if CrCl 30-50 mL/min',
              'Avoid if CrCl <30 mL/min or with P-gp inhibitors',
            ]}
          />

          <View style={styles.twoPanelRow}>
            <View style={styles.twoPanelCol}>
              <InfoBox
                title="Rivaroxaban / Apixaban"
                color={COLORS.primary}
                items={['Anti-Xa assay (drug-specific)', 'Safe level: <50 ng/mL', 'Consider for unusual pharmacokinetics']}
              />
            </View>
            <View style={styles.twoPanelCol}>
              <InfoBox
                title="Dabigatran"
                color={COLORS.info}
                items={['Dilute thrombin time (dTT)', 'Safe level: <30 ng/mL', 'More reliable than aPTT for residual effect']}
              />
            </View>
          </View>
        </View>
      )}

      {activeTab === 'antiplatelet' && (
        <View>
          <CollapsibleCard title="Antiplatelet Agents">
            <DataTable headers={['Drug Class', 'Examples', 'Pre-Procedure Timing', 'Post-Procedure Timing', 'Special Considerations']} columnWidths={[170, 210, 180, 170, 220]} rows={[
              ['COX-1 Inhibitors', 'Aspirin\nNSAIDs', 'No additional precautions', 'No restrictions', 'Minimal bleeding risk increase'],
              ['P2Y12 Inhibitors', 'Clopidogrel\nPrasugrel\nTicagrelor', '5-7 days', 'No specific restrictions', 'Higher bleeding risk; consider platelet function testing'],
              ['Ticlopidine', 'Ticlopidine', '10 days', 'No specific restrictions', 'Longer half-life with greater bleeding risk'],
              ['GP IIb/IIIa Inhibitors', 'Abciximab\nEptifibatide\nTirofiban', 'Return to normal platelet aggregation', 'Normal platelet function required', 'May require platelet function testing'],
              ['Cangrelor', 'Cangrelor (IV)', '3 hours', 'No specific restrictions', 'Short half-life with rapid offset'],
            ]} />
          </CollapsibleCard>

          <InfoBox
            title="Platelet Function Testing"
            icon="vial"
            color={COLORS.info}
            bgColor="#eef7ff"
            items={['Consider platelet aggregometry or point-of-care testing when timing is uncertain or in high-risk patients.']}
          />
        </View>
      )}

      {activeTab === 'warfarin' && (
        <View>
          <CollapsibleCard title="Warfarin Management">
            <DataTable headers={['Parameter', 'Requirement', 'Timing', 'Monitoring']} columnWidths={[170, 170, 180, 190]} rows={[
              ['Pre-Procedure INR', 'INR <1.4-1.5', 'Within 24 hours of procedure', 'Daily INR during interruption'],
              ['Catheter Placement', 'INR <1.4-1.5', 'Confirm before placement', 'Neurologic assessment'],
              ['Catheter Removal', 'INR <1.5', 'Check INR before removal', 'Continue for at least 24 hours post-removal'],
              ['Warfarin Restart', 'After catheter removal', 'Same day as removal', 'Daily INR until therapeutic'],
            ]} />
          </CollapsibleCard>

          <CollapsibleCard title="Bridging Therapy">
            <DataTable headers={['Risk Category', 'Clinical Conditions', 'Recommendation', 'Agent & Timing']} columnWidths={[170, 260, 180, 230]} rows={[
              ['High Risk\nAnnual risk >10%', 'Mechanical mitral valve\nRecent VTE\nAF with CHADS2 >=5\nSevere thrombophilia', 'Bridging Recommended', 'UFH or LMWH\nStart 36-48h after warfarin stop\nStop 4-6h pre-procedure\nResume 12-24h post-procedure'],
              ['Moderate Risk\nAnnual risk 5-10%', 'AF with CHADS2 3-4\nVTE within 3-12 months\nNon-severe thrombophilia\nActive cancer', 'Consider Bridging', 'Individual assessment based on patient factors and bleeding risk'],
              ['Low Risk\nAnnual risk <5%', 'AF with CHADS2 0-2\nVTE >12 months ago\nBioprosthetic valve >3 months', 'No Bridging', 'Stop warfarin 5 days pre-procedure and resume without heparin bridge'],
            ]} />

            <View style={styles.protocolWrap}>
              <InfoBox
                title="Pre-Procedure Protocol"
                icon="clock"
                color={COLORS.primary}
                bgColor="#fff8e1"
                items={[
                  'Day -5: Stop warfarin',
                  'Day -3: Check INR and start bridging if indicated',
                  'Day -1: Check INR (target <1.5), last LMWH dose',
                  'Day 0: Confirm INR <1.4-1.5 before neuraxial block',
                ]}
              />
              <InfoBox
                title="Post-Procedure Protocol"
                icon="play"
                color={COLORS.success}
                bgColor="#eefaf0"
                items={[
                  'Day 0 evening: Resume warfarin',
                  'Day +1: Start bridging 12-24h post-procedure if hemostasis adequate',
                  'Day +2 onward: Continue daily INR checks',
                  'Stop bridging when INR is therapeutic (>=2.0)',
                ]}
              />
            </View>

            <DataTable headers={['Agent', 'Dosing', 'Monitoring', 'Reversal', 'Advantages', 'Disadvantages']} columnWidths={[140, 210, 160, 140, 180, 170]} rows={[
              ['LMWH\n(Enoxaparin)', 'Treatment: 1 mg/kg BID SC\nProphylactic: 40 mg daily SC', 'Anti-Xa levels if needed\nPlatelet count\nRenal function', 'Protamine (partial)\nNo specific antidote', 'Outpatient friendly\nPredictable kinetics\nLower HIT risk', 'Renal clearance\nIncomplete reversal\nCost'],
              ['UFH\n(Unfractionated)', 'IV infusion target aPTT 1.5-2.5x normal\nSC 15,000-20,000 U BID', 'aPTT q6h\nDaily platelets\nClinical assessment', 'Protamine sulfate\nComplete reversal possible', 'Complete reversal\nFamiliar practice\nShort half-life', 'Often inpatient\nFrequent monitoring\nHigher HIT risk'],
            ]} />

            <View style={styles.twoPanelRow}>
              <View style={styles.twoPanelCol}>
                <InfoBox
                  title="Risk Factors for Mechanical Valves"
                  color={COLORS.primary}
                  items={['Atrial fibrillation', 'Previous thromboembolism', 'Hypercoagulable state', 'Older generation valve', 'LV dysfunction (EF <30%)']}
                />
              </View>
              <View style={styles.twoPanelCol}>
                <InfoBox
                  title="Severe Thrombophilia"
                  color={COLORS.success}
                  items={['Antiphospholipid syndrome', 'Protein C / protein S deficiency', 'Antithrombin deficiency', 'Homozygous Factor V Leiden', 'Compound heterozygous defects']}
                />
              </View>
            </View>

            <InfoBox
              title="Vitamin K Administration"
              icon="exclamation-triangle"
              color={COLORS.warning}
              bgColor="#fff9e6"
              items={['Avoid routine vitamin K for elective procedures. Reserve for urgent situations with excessive bleeding risk.']}
            />
          </CollapsibleCard>

          <CollapsibleCard title="Special Situations">
            <DataTable headers={['Clinical Scenario', 'Recommendation', 'Monitoring', 'Additional Considerations']} columnWidths={[170, 220, 190, 210]} rows={[
              ['Emergency Surgery', 'Consider vitamin K 2.5-5 mg IV\nFFP or PCC if urgent\nAlternative anaesthesia technique', 'Serial INR monitoring\nClose neurologic observation', 'Discuss with hematology\nDocument risk-benefit assessment'],
              ['Renal Impairment\nCrCl <30 mL/min', 'Avoid DOAC where possible\nReduce LMWH dose\nConsider monitored UFH', 'Anti-Xa for LMWH\nFrequent INR checks', 'Nephrology input\nExtended drug clearance awareness'],
              ['Pregnancy', 'LMWH preferred\nWeight-based dosing\nSwitch to UFH near delivery', 'Anti-Xa levels\nPlatelet count\nFetal monitoring', 'Obstetric consultation\nLabor epidural planning'],
              ['Active Cancer', 'LMWH often preferred\nExtended prophylaxis in selected patients', 'Platelet count\nAnti-Xa if indicated', 'Coordinate with oncology\nConsider chemotherapy timing'],
            ]} />

            <InfoBox
              title="DOAC Bridging Considerations"
              icon="info-circle"
              color={COLORS.info}
              bgColor="#eef7ff"
              items={['DOACs generally do not require bridging due to rapid onset and offset, but rare very-high-risk scenarios may warrant tailored strategies.']}
            />

            <DataTable headers={['Risk Category', 'Recommendation', 'Alternative Approach', 'Timing']} columnWidths={[170, 180, 230, 220]} rows={[
              ['Very High Risk\nRecent stroke / mechanical valve', 'Consider short-term LMWH bridging', 'Minimize interruption\nEarlier DOAC resumption\nConsider alternative anaesthesia', 'Stop DOAC 48-72h pre-op\nStart LMWH 24h later\nResume DOAC 24-48h post-op'],
              ['Standard Risk\nStable AF / remote VTE', 'No bridging required', 'Standard interruption\nMechanical prophylaxis\nEarly mobilization', 'Stop DOAC 48-72h pre-op\nNo intermediate therapy\nResume when safe'],
            ]} />
          </CollapsibleCard>
        </View>
      )}

      <View style={styles.refBox}>
        <Text style={styles.refTitle}>Reference</Text>
        <Text style={styles.refText}>
          Based on American Society of Regional Anesthesia and Pain Medicine Evidence-Based Guidelines (Fifth Edition, 2025),
          Regional anesthesia in the patient receiving antithrombotic or thrombolytic therapy, Reg Anesth Pain Med 2025,
          doi:10.1136/rapm-2024-105766.
        </Text>
      </View>

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12, marginRight: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  outlineBtn: { borderColor: COLORS.primary, borderWidth: 1, borderRadius: 6, paddingVertical: 8, paddingHorizontal: 12 },
  outlineBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  tabBar: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
    gap: 6,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 11,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#d8dee6',
  },
  tabBtnActive: {
    backgroundColor: '#1e3a8a',
    borderColor: '#1e3a8a',
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.white,
  },
  guidelinesCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  sectionTitle: {
    color: '#1e3a8a',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: SPACING.md,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
  },
  subSectionTitle: {
    fontWeight: '700',
    fontSize: 15,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    marginTop: SPACING.xs,
  },
  alertBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  alertText: {
    color: '#856404',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  alertStrong: { fontWeight: '700' },
  infoBox: { borderLeftWidth: 4, borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.md },
  infoTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoTitleIcon: { marginRight: 6 },
  infoTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 4 },
  infoItem: { fontSize: 13, color: COLORS.text, marginBottom: 2 },
  twoPanelRow: { flexDirection: 'row', gap: SPACING.sm },
  twoPanelCol: { flex: 1 },
  protocolWrap: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa000',
  },
  tableScrollContent: { paddingBottom: 2 },
  table: { minWidth: '100%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', backgroundColor: '#1e3a8a' },
  headerCell: { padding: 8, color: COLORS.white, fontWeight: '700', fontSize: 11, textAlignVertical: 'top' },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altRow: { backgroundColor: '#f8f9fa' },
  dataCell: { padding: 8, fontSize: 11, color: COLORS.text, lineHeight: 15, textAlignVertical: 'top' },
  noteText: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic', marginTop: SPACING.sm, paddingHorizontal: SPACING.xs },
  refBox: { backgroundColor: '#e8f4fd', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.md },
  refTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue, marginBottom: 4 },
  refText: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
  homeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  homeBtnIcon: { marginRight: 8 },
  homeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});
