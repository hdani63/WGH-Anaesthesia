import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import CalcButton from '../../components/CalcButton';
import ResultDisplay from '../../components/ResultDisplay';
import { PickerSelect } from '../../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';

// ---------------------------------------------------------------------------
// GOLD COPD Classification Logic (local — GOLD 2024 Report)
// Grade:  FEV1 >= 80 => G1 (Mild)
//         FEV1 50-79 => G2 (Moderate)
//         FEV1 30-49 => G3 (Severe)
//         FEV1 <  30 => G4 (Very Severe)
//
// Group:  Exacerbations HIGH  (>=2 OR >=1 hospitalised) => E  (any symptoms)
//         Exacerbations LOW   + symptoms LOW  (CAT<10 AND mMRC 0-1)  => A
//         Exacerbations LOW   + symptoms HIGH (CAT>=10 OR mMRC>=2)   => B
// ---------------------------------------------------------------------------
function calculateGOLD(fev1Str, catStr, mmrcStr, exacerStr) {
  const fev1 = parseFloat(fev1Str);
  const cat = parseFloat(catStr);
  const mmrc = parseInt(mmrcStr, 10);
  const exacer = parseInt(exacerStr, 10);

  if (isNaN(fev1) || fev1 < 0) {
    return { text: 'Please enter a valid FEV₁ % predicted value.', type: 'warning' };
  }

  // GOLD Grade (airflow limitation severity)
  let grade, gradeSeverity, gradeImplication;
  if (fev1 >= 80) {
    grade = 1;
    gradeSeverity = 'Mild';
    gradeImplication =
      'Standard precautions. Ensure bronchodilators continued perioperatively.';
  } else if (fev1 >= 50) {
    grade = 2;
    gradeSeverity = 'Moderate';
    gradeImplication =
      'Optimise bronchodilators, smoking cessation, chest physio pre-op. Consider regional anaesthesia.';
  } else if (fev1 >= 30) {
    grade = 3;
    gradeSeverity = 'Severe';
    gradeImplication =
      'High risk of postoperative pulmonary complications. Avoid unnecessary GA. Chest physio, ICU awareness.';
  } else {
    grade = 4;
    gradeSeverity = 'Very Severe';
    gradeImplication =
      'Very high risk. Multidisciplinary discussion. Consider if surgery is appropriate.';
  }

  // GOLD Group (symptom + exacerbation burden)
  let group, groupTreatment;
  const highExacer = exacer === 2; // >=2 or >=1 hospitalised
  const highSymptoms = !isNaN(cat)
    ? cat >= 10 || mmrc >= 2
    : mmrc >= 2;

  if (highExacer) {
    group = 'E';
    groupTreatment = 'LABA + LAMA; consider ICS if eosinophils ≥300/µL';
  } else if (highSymptoms) {
    group = 'B';
    groupTreatment = 'LABA + LAMA combination';
  } else {
    group = 'A';
    groupTreatment = 'One bronchodilator (SAMA or SABA)';
  }

  const catDisplay = isNaN(cat) ? 'not entered' : cat;
  const mmrcLabels = [
    'Grade 0 – only with strenuous exercise',
    'Grade 1 – hurrying on level / walking uphill',
    'Grade 2 – slower than peers on level',
    'Grade 3 – stops after ≈100 m on level',
    'Grade 4 – too breathless to leave house',
  ];
  const mmrcDisplay = mmrcLabels[mmrc] || `Grade ${mmrc}`;

  const resultType = grade <= 1 ? 'success' : grade === 2 ? 'info' : grade === 3 ? 'warning' : 'danger';

  const text =
    `GOLD Grade ${grade} – ${gradeSeverity} COPD\n` +
    `FEV₁ ${fev1}% predicted\n\n` +
    `GOLD Group ${group}\n` +
    `CAT: ${catDisplay}  |  mMRC: ${mmrcDisplay}\n` +
    `Exacerbations: ${exacer === 0 ? '0' : exacer === 1 ? '1 (no hospitalisation)' : '≥2 or ≥1 hospitalised'}\n\n` +
    `Recommended treatment focus: ${groupTreatment}\n\n` +
    `Anaesthetic implication: ${gradeImplication}`;

  return { text, type: resultType };
}

// ---------------------------------------------------------------------------
// Static guidance content arrays
// ---------------------------------------------------------------------------
const OSA_IMPLICATIONS = [
  {
    score: 'Score 0–2',
    risk: 'Low risk',
    guidance: 'Standard care',
  },
  {
    score: 'Score 3–4',
    risk: 'Intermediate',
    guidance: 'Consider CPAP, avoid opioids, HDU post-op',
  },
  {
    score: 'Score 5–8',
    risk: 'High risk',
    guidance:
      'Formal sleep study if time allows, HDU/ICU, CPAP, multimodal analgesia, awake extubation',
  },
];

const COPD_PREOP = [
  'Ensure all bronchodilators continued up to and including day of surgery (SABA, LABA, LAMA, ICS)',
  'Smoking cessation: ≥8 weeks before surgery for maximum benefit; cessation at any point reduces risk',
  'Chest physiotherapy and inspiratory muscle training pre-op',
  'Treat any acute exacerbation before elective surgery',
  'Consider pulmonary rehabilitation if GOLD 3–4',
  'Spirometry, ABG (if GOLD 3–4), echo if suspected cor pulmonale',
  'Nutritional assessment (MUST) — malnutrition common in GOLD 3–4',
];

const COPD_INTRAOP = [
  'Regional anaesthesia preferred where feasible (avoid airway manipulation)',
  'If GA needed: use low-resistance circuit, large-bore ETT (≥8 mm)',
  'Avoid N₂O in bullous disease',
  'Ventilator strategy: low respiratory rate (8–12/min), long expiratory time (I:E 1:2–1:4), low PEEP, permissive hypercapnia',
  'Monitor for air trapping / auto-PEEP (pause at end expiration)',
  'Inhalational agents have bronchodilator properties (sevoflurane preferred)',
  'Nebulised salbutamol/ipratropium available in theatre',
];

const COPD_POSTOP = [
  'Extubate awake and with patient upright; avoid deep extubation in high-risk COPD',
  'Supplemental O₂: target SpO₂ 88–92% in type II respiratory failure',
  'Continue bronchodilators immediately post-op (nebulised if unable to inhale)',
  'Early chest physiotherapy and mobilisation',
  'NIV (BiPAP) — low threshold post-op in GOLD 3–4 or if any respiratory deterioration',
  'Multimodal analgesia: minimise systemic opioids — prefer epidural, regional, NSAIDs, paracetamol',
  'HDU monitoring for GOLD 3–4 after major surgery',
];

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BulletList({ items }) {
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>{'•'}</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SubSection({ title, items, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={styles.subSection}>
      <CalcButton
        title={`${open ? '▼' : '►'}  ${title}`}
        onPress={() => setOpen(!open)}
        color={open ? COLORS.secondary : COLORS.medicalBlue}
      />
      {open && (
        <View style={styles.subSectionBody}>
          <BulletList items={items} />
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Main exported component
// ---------------------------------------------------------------------------
export default function RespiratorySection({ patient }) {
  // GOLD calculator state
  const [goldFev1, setGoldFev1] = useState('');
  const [goldCat, setGoldCat] = useState('');
  const [goldMmrc, setGoldMmrc] = useState('0');
  const [goldExacer, setGoldExacer] = useState('0');
  const [goldResult, setGoldResult] = useState(null);

  const handleCalculateGOLD = () => {
    const result = calculateGOLD(goldFev1, goldCat, goldMmrc, goldExacer);
    setGoldResult(result);
  };

  return (
    <View>
      {/* ================================================================
          SECTION: Obstructive Sleep Apnoea
      ================================================================ */}
      <Text style={styles.sectionHeader}>Obstructive Sleep Apnoea</Text>

      {/* OSA Anaesthetic Implications — static guidance card */}
      <CollapsibleCard
        title="OSA – Anaesthetic Implications"
        icon="bed"
        defaultOpen
      >
        <Text style={styles.cardSubtitle}>
          Based on STOP-BANG score. These implications complement the STOP-BANG
          calculator which is used to derive the score.
        </Text>

        {OSA_IMPLICATIONS.map((item, i) => {
          const bandType = i === 0 ? 'success' : i === 1 ? 'warning' : 'danger';
          const bandBg = i === 0 ? '#d4edda' : i === 1 ? '#fff3cd' : '#f8d7da';
          const bandBorder =
            i === 0 ? '#c3e6cb' : i === 1 ? '#ffeeba' : '#f5c6cb';
          const bandText =
            i === 0 ? '#155724' : i === 1 ? '#856404' : '#721c24';
          return (
            <View
              key={i}
              style={[
                styles.implicationBand,
                { backgroundColor: bandBg, borderColor: bandBorder },
              ]}
            >
              <Text style={[styles.implicationScore, { color: bandText }]}>
                {item.score}
              </Text>
              <Text style={[styles.implicationRisk, { color: bandText }]}>
                {item.risk}
              </Text>
              <Text style={[styles.implicationGuidance, { color: bandText }]}>
                {item.guidance}
              </Text>
            </View>
          );
        })}
      </CollapsibleCard>

      {/* ================================================================
          SECTION: COPD / Respiratory
      ================================================================ */}
      <Text style={styles.sectionHeader}>COPD / Respiratory</Text>

      {/* GOLD Criteria Calculator */}
      <CollapsibleCard
        title="GOLD Criteria – COPD Classification"
        icon="lungs"
      >
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            Diagnosis requires post-bronchodilator{' '}
            <Text style={styles.bold}>FEV₁/FVC {'<'} 0.70</Text>.{' '}
            GOLD 2024 Report — COPD staging and ABCD group classification.
          </Text>
        </View>

        {/* FEV1 */}
        <Text style={styles.label}>
          Post-Bronchodilator FEV₁ (% predicted)
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={goldFev1}
          onChangeText={setGoldFev1}
          placeholder="e.g. 65"
        />

        {/* CAT */}
        <Text style={styles.label}>CAT Score (COPD Assessment Test, 0–40)</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={goldCat}
          onChangeText={setGoldCat}
          placeholder="0–40"
        />
        <Text style={styles.hint}>
          CAT items (0–5 each): Cough | Phlegm | Chest tightness |
          Breathlessness on hills/stairs | Activities at home | Confidence
          leaving home | Sleep | Energy
        </Text>

        {/* mMRC */}
        <PickerSelect
          label="mMRC Dyspnoea Scale (0–4)"
          options={[
            {
              value: '0',
              label:
                'Grade 0 – Breathless only with strenuous exercise',
            },
            {
              value: '1',
              label:
                'Grade 1 – Short of breath when hurrying on level or walking up hill',
            },
            {
              value: '2',
              label:
                'Grade 2 – Walks slower than people of same age on level due to breathlessness, or has to stop for breath when walking at own pace',
            },
            {
              value: '3',
              label:
                'Grade 3 – Stops for breath after walking ≈100 m or after a few minutes on level ground',
            },
            {
              value: '4',
              label:
                'Grade 4 – Too breathless to leave the house, or breathless when dressing/undressing',
            },
          ]}
          selected={goldMmrc}
          onSelect={setGoldMmrc}
        />

        {/* Exacerbations */}
        <PickerSelect
          label="Exacerbations in past 12 months"
          options={[
            { value: '0', label: '0 exacerbations' },
            {
              value: '1',
              label: '1 exacerbation (not requiring hospitalisation)',
            },
            {
              value: '2',
              label:
                '≥2 exacerbations, OR ≥1 requiring hospitalisation',
            },
          ]}
          selected={goldExacer}
          onSelect={setGoldExacer}
        />

        <CalcButton title="Classify COPD" onPress={handleCalculateGOLD} />
        {goldResult && (
          <ResultDisplay result={goldResult.text} type={goldResult.type} />
        )}

        {/* Reference tables */}
        <Text style={styles.tableHeading}>GOLD Grade Reference</Text>
        {[
          {
            grade: '1',
            sev: 'Mild',
            fev: '≥80%',
            impl: 'Standard precautions. Ensure bronchodilators continued perioperatively.',
          },
          {
            grade: '2',
            sev: 'Moderate',
            fev: '50–79%',
            impl: 'Optimise bronchodilators, smoking cessation, chest physio pre-op. Consider regional anaesthesia.',
          },
          {
            grade: '3',
            sev: 'Severe',
            fev: '30–49%',
            impl: 'High risk of postoperative pulmonary complications. Avoid unnecessary GA. Chest physio, ICU awareness.',
          },
          {
            grade: '4',
            sev: 'Very Severe',
            fev: '<30%',
            impl: 'Very high risk. Multidisciplinary discussion. Consider if surgery is appropriate.',
          },
        ].map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
            ]}
          >
            <Text style={[styles.tableCell, styles.tableCellGrade]}>
              Grade {row.grade}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellSev]}>
              {row.sev}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellFev]}>
              {row.fev}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellImpl]}>
              {row.impl}
            </Text>
          </View>
        ))}

        <Text style={styles.tableHeading}>GOLD Group Reference</Text>
        {[
          {
            group: 'A',
            exacer: 'Low (0–1, no hosp)',
            symptoms: 'Low (CAT<10, mMRC 0–1)',
            tx: 'One bronchodilator (SAMA or SABA)',
          },
          {
            group: 'B',
            exacer: 'Low (0–1, no hosp)',
            symptoms: 'High (CAT≥10, mMRC≥2)',
            tx: 'LABA + LAMA combination',
          },
          {
            group: 'E',
            exacer: 'High (≥2 or ≥1 hosp)',
            symptoms: 'Any',
            tx: 'LABA + LAMA; consider ICS if eos ≥300',
          },
        ].map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
            ]}
          >
            <Text style={[styles.tableCell, styles.tableCellGroup]}>
              Group {row.group}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellExacer]}>
              {row.exacer}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellSymptoms]}>
              {row.symptoms}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellTx]}>
              {row.tx}
            </Text>
          </View>
        ))}
      </CollapsibleCard>

      {/* COPD Perioperative Considerations */}
      <CollapsibleCard
        title="COPD – Perioperative Considerations"
        icon="procedures"
      >
        <Text style={styles.cardSubtitle}>
          Evidence-based perioperative management guidance for patients with
          COPD. Expand each sub-section below.
        </Text>

        <SubSection
          title="Pre-Operative Optimisation"
          items={COPD_PREOP}
        />
        <SubSection
          title="Intraoperative Management"
          items={COPD_INTRAOP}
        />
        <SubSection
          title="Postoperative Care"
          items={COPD_POSTOP}
        />
      </CollapsibleCard>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    paddingBottom: 4,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.medicalBlue,
  },

  // OSA implication bands
  cardSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
    lineHeight: 18,
  },
  implicationBand: {
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  implicationScore: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  implicationRisk: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  implicationGuidance: {
    fontSize: 13,
    lineHeight: 19,
  },

  // GOLD form
  label: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
    marginTop: SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    padding: SPACING.sm,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginTop: 4,
    lineHeight: 17,
  },
  bold: {
    fontWeight: '700',
  },
  infoBox: {
    backgroundColor: '#fff3cd',
    borderWidth: 1,
    borderColor: '#ffeeba',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  infoBoxText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },

  // Reference tables
  tableHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableRowEven: {
    backgroundColor: '#e8f4fd',
  },
  tableRowOdd: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  tableCell: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  tableCellGrade: {
    width: 52,
    fontWeight: '700',
    color: COLORS.medicalBlue,
  },
  tableCellSev: {
    width: 72,
    fontWeight: '600',
  },
  tableCellFev: {
    width: 54,
  },
  tableCellImpl: {
    flex: 1,
    color: COLORS.textMuted,
  },
  tableCellGroup: {
    width: 52,
    fontWeight: '700',
    color: COLORS.medicalBlue,
  },
  tableCellExacer: {
    width: 110,
  },
  tableCellSymptoms: {
    width: 110,
  },
  tableCellTx: {
    flex: 1,
    color: COLORS.textMuted,
  },

  // Sub-section accordion
  subSection: {
    marginTop: SPACING.sm,
  },
  subSectionBody: {
    backgroundColor: '#fafcff',
    borderWidth: 1,
    borderColor: '#d0dff5',
    borderTopWidth: 0,
    borderBottomLeftRadius: BORDER_RADIUS,
    borderBottomRightRadius: BORDER_RADIUS,
    padding: SPACING.sm,
  },

  // Bullet list
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3,
  },
  bullet: {
    fontSize: 14,
    color: COLORS.medicalBlue,
    marginRight: 6,
    marginTop: 1,
  },
  bulletText: {
    fontSize: 13,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
});
