import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { RefTable } from './preop/ReferenceTablesSection';

// ---------------------------------------------------------------------------
// Preoperative Assessment — Risk Score Reference
// 100% STATIC reference tables mirrored verbatim from the Flask web app
// (templates/preoperative_collapsible.html). No inputs / no interactive logic.
// ---------------------------------------------------------------------------

// Small presentational helpers --------------------------------------------------

function SubHeading({ children }) {
  return <Text style={styles.tableHeading}>{children}</Text>;
}

function Hint({ children }) {
  return <Text style={styles.hint}>{children}</Text>;
}

function NoteBox({ children }) {
  return (
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{children}</Text>
    </View>
  );
}

function InfoBox({ children }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoText}>{children}</Text>
    </View>
  );
}

function WarnBox({ children }) {
  return (
    <View style={styles.warnBox}>
      <Text style={styles.warnText}>{children}</Text>
    </View>
  );
}

function FormulaBox({ children }) {
  return (
    <View style={styles.formulaBox}>
      <Text style={styles.formulaText}>{children}</Text>
    </View>
  );
}

// A coloured-header card holding a bulleted list (used for Caprini groups,
// body-weight & renal sub-cards).
function HeaderCard({ title, headerColor, headerTextColor, children }) {
  return (
    <View style={styles.card}>
      <View style={[styles.cardHeader, { backgroundColor: headerColor }]}>
        <Text style={[styles.cardHeaderText, { color: headerTextColor || COLORS.white }]}>
          {title}
        </Text>
      </View>
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

function CheckList({ items }) {
  return (
    <View>
      {items.map((item, i) => (
        <Text key={i} style={styles.checkItem}>
          {'☐'} {item}
        </Text>
      ))}
    </View>
  );
}

// =============================================================================

export default function PreoperativeScreen() {
  return (
    <ScreenWrapper
      title="Preoperative Assessment — Risk Score Reference"
      subtitle="Scoring criteria, point values & risk thresholds — clinician calculates manually"
    >
      {/* Top reference-only note */}
      <View style={styles.topNote}>
        <FontAwesome5 name="info-circle" size={13} color={COLORS.info} style={styles.topNoteIcon} />
        <Text style={styles.topNoteText}>
          <Text style={styles.noteStrong}>Reference only. </Text>
          All scoring criteria and formulas are shown for clinician reference. Apply clinical
          judgement — no software output should replace direct patient assessment.
        </Text>
      </View>

      {/* 1. ASA PHYSICAL STATUS CLASSIFICATION */}
      <CollapsibleCard title="ASA Physical Status Classification" icon="user-md">
        <RefTable
          columns={[
            { key: 'cls', label: 'Class', width: 60, strong: true },
            { key: 'def', label: 'Definition', flex: 1.3 },
            { key: 'ex', label: 'Examples', flex: 3 },
            { key: 'mort', label: 'Periop Mortality', width: 70 },
          ]}
          rows={[
            {
              cls: 'ASA I',
              def: 'Normal healthy patient',
              ex: 'Non-smoker, minimal alcohol, no organic/physiological/psychiatric disturbance',
              mort: '<0.1%',
            },
            {
              cls: 'ASA II',
              def: 'Mild systemic disease',
              ex: 'Well-controlled DM/HTN, current smoker, BMI 30–40, mild lung disease, social alcohol, pregnancy',
              mort: '~0.27%',
            },
            {
              cls: 'ASA III',
              def: 'Severe systemic disease',
              ex: 'Poorly controlled DM/HTN, COPD, morbid obesity (BMI ≥40), active hepatitis, alcohol dependence, pacemaker, moderate reduced EF, ESRD on dialysis, history (≥3 months) of MI/CVA/TIA/CAD',
              mort: '~1.8%',
            },
            {
              cls: 'ASA IV',
              def: 'Severe systemic disease, constant threat to life',
              ex: 'Recent (<3 months) MI/CVA/TIA, ongoing cardiac ischaemia, severe valve disease, severe reduced EF, sepsis, DIC, ESRD not on dialysis',
              mort: '~7.8%',
            },
            {
              cls: 'ASA V',
              def: 'Moribund — not expected to survive without operation',
              ex: 'Ruptured aortic aneurysm, massive trauma, intracranial bleed with mass effect, ischaemic bowel with multi-organ failure',
              mort: '~9.4%',
            },
            {
              cls: 'ASA VI',
              def: 'Brain-dead — organ donation',
              ex: 'Declared brain-dead patient for organ harvesting',
              mort: '—',
            },
          ]}
        />
        <NoteBox>
          <Text style={styles.noteStrong}>Add suffix "E"</Text> for emergency surgery (e.g., ASA
          IIE). Emergency surgery generally carries 2–5× higher risk than elective at same ASA
          class.
        </NoteBox>
      </CollapsibleCard>

      {/* 2. RCRI */}
      <CollapsibleCard title="RCRI — Revised Cardiac Risk Index (Lee's Index)" icon="heartbeat">
        <Hint>
          Lee TH et al. Circulation 1999. Predicts major adverse cardiac events (MACE) with
          non-cardiac surgery. Each criterion = 1 point. Sum all that apply.
        </Hint>
        <RefTable
          columns={[
            { key: 'n', label: '#', width: 28, strong: true },
            { key: 'crit', label: 'Criterion', flex: 1.4, strong: true },
            { key: 'def', label: 'Definition', flex: 3 },
            { key: 'pts', label: 'Points', width: 50 },
          ]}
          rows={[
            {
              n: '1',
              crit: 'High-risk surgery',
              def: 'Intraperitoneal, intrathoracic, or suprainguinal vascular surgery',
              pts: '1',
            },
            {
              n: '2',
              crit: 'Ischaemic heart disease',
              def: 'History of MI, positive exercise test, chest pain with ischaemic ECG changes, nitrate therapy, or ECG with pathological Q waves',
              pts: '1',
            },
            {
              n: '3',
              crit: 'Congestive heart failure',
              def: 'History of pulmonary oedema, PND, bilateral rales, S3 gallop, or CXR with pulmonary vascular redistribution',
              pts: '1',
            },
            {
              n: '4',
              crit: 'Cerebrovascular disease',
              def: 'History of TIA or stroke',
              pts: '1',
            },
            {
              n: '5',
              crit: 'Insulin-dependent diabetes mellitus',
              def: 'Pre-operative insulin therapy',
              pts: '1',
            },
            {
              n: '6',
              crit: 'Pre-operative creatinine >170 µmol/L',
              def: 'Serum creatinine >170 µmol/L (2.0 mg/dL)',
              pts: '1',
            },
          ]}
        />
        <RefTable
          columns={[
            { key: 'score', label: 'Score', width: 50, strong: true },
            { key: 'risk', label: 'MACE Risk', flex: 1.2 },
            { key: 'action', label: 'Recommended Action', flex: 2.2 },
          ]}
          rows={[
            {
              score: '0',
              risk: '<1% (very low)',
              action: 'Proceed — no further cardiac workup required',
            },
            {
              score: '1',
              risk: '~1% (low)',
              action: 'Proceed — cardiology if poor functional capacity',
            },
            {
              score: '2',
              risk: '~2.4% (intermediate)',
              action: 'Consider stress testing only if result will change management',
            },
            {
              score: '≥3',
              risk: '≥5.4% (high)',
              action:
                'Cardiology review recommended; consider optimisation before elective surgery',
            },
          ]}
        />
        <NoteBox>
          <Text style={styles.noteStrong}>Note: </Text>
          Functional capacity ≥4 METs — cardiac risk is low regardless of RCRI score (further
          testing unlikely to change management for intermediate-risk patients).
        </NoteBox>
      </CollapsibleCard>

      {/* 3. AIRWAY ASSESSMENT */}
      <CollapsibleCard title="Airway Assessment" icon="lungs-virus">
        <SubHeading>Mallampati Classification (Modified — Samsoon & Young)</SubHeading>
        <RefTable
          columns={[
            { key: 'cls', label: 'Class', width: 50, strong: true },
            {
              key: 'struct',
              label: 'Structures visible (mouth open, tongue out, no phonation)',
              flex: 3,
            },
            { key: 'diff', label: 'Predicted difficulty', flex: 1.3 },
          ]}
          rows={[
            {
              cls: 'I',
              struct: 'Soft palate, fauces, uvula, anterior & posterior pillars',
              diff: 'Easy',
            },
            {
              cls: 'II',
              struct: 'Soft palate, fauces, uvula (partially obscured)',
              diff: 'Easy–Moderate',
            },
            {
              cls: 'III',
              struct: 'Soft palate and base of uvula only',
              diff: 'Moderate–Difficult',
            },
            {
              cls: 'IV',
              struct: 'Soft palate not visible (hard palate only)',
              diff: 'Difficult',
            },
          ]}
        />

        <SubHeading>Airway Parameters — Normal vs. Concerning</SubHeading>
        <RefTable
          columns={[
            { key: 'assess', label: 'Assessment', flex: 1.2, strong: true },
            { key: 'normal', label: 'Normal / Low Risk', flex: 1 },
            { key: 'concern', label: 'Concerning / Increased Risk', flex: 2 },
          ]}
          rows={[
            {
              assess: 'Thyromental distance',
              normal: '≥6.5 cm',
              concern: '<6 cm — difficult laryngoscopy predicted',
            },
            {
              assess: 'Mouth opening (inter-incisor)',
              normal: '≥4 cm',
              concern: '<3 cm — may not accommodate laryngoscope',
            },
            {
              assess: 'Sternomental distance',
              normal: '≥12.5 cm',
              concern: '<12.5 cm — difficulty predicted',
            },
            {
              assess: 'Neck extension',
              normal: '≥35° from neutral',
              concern: 'Reduced — C-spine disease, burns, scarring',
            },
            {
              assess: 'Neck circumference',
              normal: '<40 cm',
              concern: '≥40 cm — obesity-related difficulty',
            },
            {
              assess: 'Anatomy',
              normal: 'Normal',
              concern:
                'Beard, short neck, buck teeth, receding mandible, high arched palate, limited jaw protrusion',
            },
            {
              assess: 'History',
              normal: 'No previous difficulties',
              concern: 'Known difficult intubation — review previous anaesthetic records',
            },
          ]}
        />

        <SubHeading>El-Ganzouri Risk Index (EGRI)</SubHeading>
        <RefTable
          columns={[
            { key: 'param', label: 'Parameter', flex: 1.6, strong: true },
            { key: 'p0', label: '0 points', flex: 1 },
            { key: 'p1', label: '1 point', flex: 1 },
            { key: 'p2', label: '2 points', flex: 1.3 },
          ]}
          rows={[
            { param: 'Mouth opening', p0: '≥4 cm', p1: '3–4 cm', p2: '<3 cm' },
            { param: 'Thyromental distance', p0: '>6.5 cm', p1: '6–6.5 cm', p2: '<6 cm' },
            { param: 'Mallampati class', p0: 'I', p1: 'II', p2: 'III or IV' },
            { param: 'Neck movement', p0: '>90°', p1: '80–90°', p2: '<80°' },
            {
              param: 'Prognathism (jaw protrusion)',
              p0: 'Upper teeth behind lower',
              p1: 'Upper & lower teeth level',
              p2: 'Upper teeth cannot reach lower',
            },
            { param: 'Body weight', p0: '<90 kg', p1: '90–110 kg', p2: '>110 kg' },
            { param: 'History of difficult intubation', p0: 'None', p1: '—', p2: 'Yes' },
          ]}
        />
        <NoteBox>
          <Text style={styles.noteStrong}>
            EGRI Score ≥4 = significant risk of difficult intubation.
          </Text>{' '}
          Plan awake intubation, video laryngoscopy, or senior assistance.
        </NoteBox>
      </CollapsibleCard>

      {/* 4. FUNCTIONAL CAPACITY — METs */}
      <CollapsibleCard title="Functional Capacity — METs Reference" icon="running">
        <Hint>
          1 MET = 3.5 mL O₂/kg/min. Based on Duke Activity Status Index (DASI). Functional capacity
          ≥4 METs with no symptoms generally indicates adequate cardiac reserve — further testing
          rarely changes management.
        </Hint>
        <RefTable
          columns={[
            { key: 'mets', label: 'METs', width: 70, strong: true },
            { key: 'level', label: 'Activity Level', flex: 1.2 },
            { key: 'ex', label: 'Example Activities', flex: 2.4 },
          ]}
          rows={[
            { mets: '<1', level: 'Severely limited', ex: 'Eating, dressing, using toilet' },
            {
              mets: '1–2',
              level: 'Very poor',
              ex: 'Walking slowly on level ground (2 km/h), light housework (washing dishes, dusting)',
            },
            {
              mets: '2–4',
              level: 'Poor (<4 = poor capacity)',
              ex: 'Walking on level at 4 km/h, light gardening, descending one flight of stairs',
            },
            {
              mets: '≥4 — key threshold',
              level: 'Adequate',
              ex: 'Climbing one flight of stairs or a hill, walking briskly at 6 km/h, heavy housework (scrubbing, moving furniture)',
            },
            {
              mets: '4–6',
              level: 'Moderate',
              ex: 'Running short distance, cycling leisurely, playing golf, doubles tennis',
            },
            {
              mets: '6–10',
              level: 'Good',
              ex: 'Brisk cycling, swimming, singles tennis, dancing',
            },
            {
              mets: '>10',
              level: 'Excellent',
              ex: 'Competitive running, swimming laps, cross-country skiing',
            },
          ]}
        />
        <InfoBox>
          <Text style={styles.noteStrong}>Clinical significance: </Text>
          Poor functional capacity (&lt;4 METs) combined with high RCRI score = elevated
          perioperative cardiac risk. Consider cardiology review and optimisation before elective
          high-risk surgery.
        </InfoBox>
      </CollapsibleCard>

      {/* 5. STOP-BANG */}
      <CollapsibleCard title="STOP-BANG Score — OSA Screening" icon="bed">
        <Hint>
          Chung F et al. Anesthesiology 2008. Each Yes answer = 1 point. Total score: 0–8.
        </Hint>
        <RefTable
          columns={[
            { key: 'letter', label: 'Letter', width: 50, strong: true },
            { key: 'q', label: 'Question', flex: 3 },
            { key: 'pos', label: 'Positive if', flex: 1.1 },
          ]}
          rows={[
            {
              letter: 'S',
              q: 'Snoring: Do you snore loudly (heard through a closed door / bed-partner elbows you)?',
              pos: 'Yes',
            },
            {
              letter: 'T',
              q: 'Tired: Do you often feel tired, fatigued, or sleepy during the daytime?',
              pos: 'Yes',
            },
            {
              letter: 'O',
              q: 'Observed: Has anyone observed you stop breathing or choking/gasping during sleep?',
              pos: 'Yes',
            },
            {
              letter: 'P',
              q: 'Pressure: Do you have or are you being treated for high blood pressure?',
              pos: 'Yes',
            },
            { letter: 'B', q: 'BMI: Is your BMI >35 kg/m²?', pos: 'BMI >35' },
            { letter: 'A', q: 'Age: Are you older than 50 years?', pos: 'Age >50' },
            { letter: 'N', q: 'Neck: Is your neck circumference >40 cm?', pos: 'Neck >40 cm' },
            { letter: 'G', q: 'Gender: Are you male?', pos: 'Male' },
          ]}
        />
        <RefTable
          columns={[
            { key: 'score', label: 'Score', width: 50, strong: true },
            { key: 'risk', label: 'OSA Risk', flex: 1 },
            { key: 'rec', label: 'Perioperative Recommendation', flex: 3 },
          ]}
          rows={[
            { score: '0–2', risk: 'Low', rec: 'Standard monitoring and analgesia' },
            {
              score: '3–4',
              risk: 'Intermediate',
              rec: 'Consider HDU postop monitoring; multimodal analgesia to minimise opioids; CPAP if prescribed',
            },
            {
              score: '5–8',
              risk: 'High',
              rec: 'HDU/ICU postop monitoring; awake extubation; CPAP; minimise opioids; lateral/semi-upright positioning',
            },
          ]}
        />
      </CollapsibleCard>

      {/* 6. CAPRINI VTE */}
      <CollapsibleCard title="Caprini VTE Risk Score" icon="vial">
        <Hint>
          Caprini JA. Semin Thromb Hemost 2010. Check all that apply and sum all points.
        </Hint>
        <HeaderCard title="1 Point Each" headerColor={COLORS.textMuted}>
          <CheckList
            items={[
              'Age 41–60 years',
              'Minor surgery planned',
              'BMI >25 kg/m²',
              'Swollen legs (current)',
              'Varicose veins',
              'Pregnancy or postpartum (<1 month)',
              'History of unexplained/recurrent spontaneous abortion',
              'Oral contraceptives or hormone replacement therapy',
              'Sepsis (<1 month)',
              'Serious lung disease / pneumonia (<1 month)',
              'Abnormal pulmonary function (COPD)',
              'Acute MI',
              'Congestive heart failure (<1 month)',
              'History of inflammatory bowel disease',
              'Medical patient at bed rest',
              'Other risk factor',
            ]}
          />
        </HeaderCard>
        <HeaderCard title="2 Points Each" headerColor={COLORS.warning} headerTextColor="#212529">
          <CheckList
            items={[
              'Age 61–74 years',
              'Arthroscopic surgery',
              'Malignancy (present or previous)',
              'Laparoscopic surgery >45 min',
              'Confined to bed >72 h',
              'Immobilising plaster cast (<1 month)',
              'Central venous access',
            ]}
          />
        </HeaderCard>
        <HeaderCard title="3 Points Each" headerColor={COLORS.danger}>
          <CheckList
            items={[
              'Age ≥75 years',
              'Family history of VTE',
              'Factor V Leiden mutation',
              'Prothrombin 20210A mutation',
              'Lupus anticoagulant positive',
              'Anticardiolipin antibodies elevated',
              'Elevated serum homocysteine',
              'Heparin-induced thrombocytopaenia (HIT)',
              'Other congenital or acquired thrombophilia',
            ]}
          />
        </HeaderCard>
        <HeaderCard title="5 Points Each" headerColor="#212529">
          <CheckList
            items={[
              'Stroke (<1 month)',
              'Elective major lower extremity arthroplasty',
              'Hip, pelvis, or leg fracture (<1 month)',
              'Acute spinal cord injury (paralysis) <1 month',
              'Multiple trauma (<1 month)',
            ]}
          />
        </HeaderCard>
        <RefTable
          columns={[
            { key: 'score', label: 'Total Score', width: 60, strong: true },
            { key: 'risk', label: 'Risk', flex: 1 },
            { key: 'rate', label: '30-Day VTE Rate', flex: 1 },
            { key: 'prophy', label: 'Prophylaxis', flex: 2.4 },
          ]}
          rows={[
            {
              score: '0–1',
              risk: 'Low',
              rate: '~2%',
              prophy: 'Early ambulation; TED stockings (consider)',
            },
            {
              score: '2',
              risk: 'Moderate',
              rate: '~10%',
              prophy: 'Pharmacological prophylaxis (LMWH) + TED stockings',
            },
            {
              score: '3–4',
              risk: 'High',
              rate: '~20–40%',
              prophy: 'LMWH + TED stockings; extended if major surgery',
            },
            {
              score: '≥5',
              risk: 'Very High',
              rate: '~40–80%',
              prophy: 'LMWH + TED + IPC; extended prophylaxis 28 days',
            },
          ]}
        />
      </CollapsibleCard>

      {/* 7. CHILD-PUGH */}
      <CollapsibleCard title="Child-Pugh Score — Hepatic Functional Reserve" icon="notes-medical">
        <Hint>Pugh RNH et al. Br J Surg 1973. Score each parameter and sum. Total 5–15.</Hint>
        <RefTable
          columns={[
            { key: 'param', label: 'Parameter', flex: 1.3, strong: true },
            { key: 'p1', label: '1 Point', flex: 1.4 },
            { key: 'p2', label: '2 Points', flex: 1.4 },
            { key: 'p3', label: '3 Points', flex: 1.4 },
          ]}
          rows={[
            {
              param: 'Total Bilirubin',
              p1: '<34 µmol/L (<2 mg/dL)',
              p2: '34–51 µmol/L (2–3 mg/dL)',
              p3: '>51 µmol/L (>3 mg/dL)',
            },
            {
              param: 'Serum Albumin',
              p1: '>35 g/L',
              p2: '28–35 g/L',
              p3: '<28 g/L',
            },
            {
              param: 'PT prolongation',
              p1: '<4 s prolonged (INR <1.7)',
              p2: '4–6 s (INR 1.7–2.3)',
              p3: '>6 s prolonged (INR >2.3)',
            },
            {
              param: 'Ascites',
              p1: 'None',
              p2: 'Mild (controlled with medication)',
              p3: 'Moderate–severe (refractory)',
            },
            {
              param: 'Hepatic Encephalopathy',
              p1: 'None',
              p2: 'Grade I–II (mild confusion, asterixis)',
              p3: 'Grade III–IV (stupor, coma)',
            },
          ]}
        />
        <RefTable
          columns={[
            { key: 'cls', label: 'Class', width: 70, strong: true },
            { key: 'score', label: 'Score', width: 55 },
            { key: 'y1', label: '1-Year Survival', flex: 1 },
            { key: 'y2', label: '2-Year Survival', flex: 1 },
            { key: 'surg', label: 'Surgical Mortality', flex: 1 },
          ]}
          rows={[
            { cls: 'Child A', score: '5–6', y1: '100%', y2: '85%', surg: '~10%' },
            { cls: 'Child B', score: '7–9', y1: '81%', y2: '57%', surg: '~30%' },
            { cls: 'Child C', score: '10–15', y1: '45%', y2: '35%', surg: '76–82%' },
          ]}
        />
        <NoteBox>
          <Text style={styles.noteStrong}>Anaesthetic implications: </Text>
          Child B/C — reduced protein binding, prolonged drug effect. Avoid hepatotoxic agents.
          Coagulopathy may require FFP/Vitamin K. Consider hepatology review for Child C patients.
        </NoteBox>
      </CollapsibleCard>

      {/* 8. MELD SCORE */}
      <CollapsibleCard title="MELD Score — Model for End-Stage Liver Disease" icon="calculator">
        <HeaderCard title="MELD Formula" headerColor={COLORS.medicalBlue}>
          <FormulaBox>
            MELD = (3.78 × ln[Bilirubin mg/dL]) + (11.2 × ln[INR]) + (9.57 × ln[Creatinine mg/dL]) +
            6.43
          </FormulaBox>
          <Text style={styles.smallMuted}>
            <Text style={styles.noteStrong}>Unit conversions: </Text>
            Bilirubin µmol/L ÷ 17.1 = mg/dL  |  Creatinine µmol/L ÷ 88.4 = mg/dL{'\n'}
            If any value &lt;1, use 1 (avoid negative log). Creatinine capped at 4 mg/dL. Round to
            nearest integer.
          </Text>
        </HeaderCard>
        <RefTable
          columns={[
            { key: 'score', label: 'MELD Score', width: 70, strong: true },
            { key: 'mort', label: '90-Day Mortality', flex: 1 },
            { key: 'impl', label: 'Surgical Implication', flex: 2.6 },
          ]}
          rows={[
            {
              score: '<9',
              mort: '~2%',
              impl: 'Low perioperative mortality for most procedures',
            },
            {
              score: '9–11',
              mort: '~5%',
              impl: 'Acceptable risk for essential procedures',
            },
            {
              score: '12–19',
              mort: '~20%',
              impl: 'Significant risk — weigh benefit carefully; hepatology review advised',
            },
            {
              score: '20–29',
              mort: '~60%',
              impl: 'High risk — avoid elective surgery; only essential procedures',
            },
            {
              score: '≥30',
              mort: '>80%',
              impl: 'Prohibitive risk — avoid surgery unless immediately life-saving; liver transplant evaluation',
            },
          ]}
        />
        <WarnBox>
          <Text style={styles.noteStrong}>MELD-Na</Text> (sodium-adjusted): MELD-Na = MELD + 1.32 ×
          (137 − Na) − [0.24 × MELD × (137 − Na)]. Sodium input range: 125–137 mmol/L.
        </WarnBox>
      </CollapsibleCard>

      {/* 9. ROCKWOOD CLINICAL FRAILTY SCALE */}
      <CollapsibleCard title="Rockwood Clinical Frailty Scale (CFS)" icon="user-injured">
        <Hint>
          Rockwood K et al. CMAJ 2005. Assign the single score that best describes the patient's
          usual status (2 weeks before current illness) — not based on acute presentation.
        </Hint>
        <RefTable
          columns={[
            { key: 'score', label: 'Score', width: 45, strong: true },
            { key: 'cat', label: 'Category', flex: 1.3 },
            { key: 'desc', label: 'Description', flex: 3 },
          ]}
          rows={[
            {
              score: '1',
              cat: 'Very Fit',
              desc: 'Robust, active, energetic, motivated, and fit. Exercise regularly. Among the fittest for their age.',
            },
            {
              score: '2',
              cat: 'Well',
              desc: 'No active disease symptoms but less fit than score 1. Exercise occasionally (e.g., seasonal).',
            },
            {
              score: '3',
              cat: 'Managing Well',
              desc: 'Medical problems are well controlled. Not regularly active beyond routine walking.',
            },
            {
              score: '4',
              cat: 'Vulnerable',
              desc: 'Not dependent for daily help but symptoms limit activities. Often complain of fatigue or slowing down.',
            },
            {
              score: '5',
              cat: 'Mildly Frail',
              desc: 'Evident slowing. Dependent in instrumental ADLs (finances, transport, housework, medications). Problems shopping, walking outside, meal preparation.',
            },
            {
              score: '6',
              cat: 'Moderately Frail',
              desc: 'Help needed for all outside activities and housekeeping. Problems with stairs and bathing. May need minimal personal care assistance.',
            },
            {
              score: '7',
              cat: 'Severely Frail',
              desc: 'Completely dependent for personal care. Stable — not at high risk of dying within 6 months.',
            },
            {
              score: '8',
              cat: 'Very Severely Frail',
              desc: 'Completely dependent. Approaching end of life. Typically cannot recover even from mild illness.',
            },
            {
              score: '9',
              cat: 'Terminally Ill',
              desc: 'Approaching end of life. Life expectancy <6 months. Otherwise not evidently frail.',
            },
          ]}
        />
        <WarnBox>
          <Text style={styles.noteStrong}>Perioperative significance: </Text>
          CFS ≥5 associated with significantly increased postoperative complications, mortality, and
          prolonged hospital stay. CFS ≥7 warrants senior review, goals-of-care discussion, and
          careful risk-benefit assessment. Multidisciplinary frailty pathway recommended.
        </WarnBox>
      </CollapsibleCard>

      {/* 10. BODY WEIGHT FORMULAS & RENAL FUNCTION */}
      <CollapsibleCard
        title="Body Weight Formulas & Renal Function Reference"
        icon="weight"
      >
        <HeaderCard title="Body Weight Formulas" headerColor={COLORS.info}>
          <View style={styles.lvRow}>
            <Text style={styles.lvLabel}>BMI</Text>
            <Text style={styles.lvValue}>Weight (kg) ÷ Height² (m²)</Text>
          </View>
          <Text style={styles.lvGroup}>Ideal Body Weight (IBW)</Text>
          <View style={styles.lvRow}>
            <Text style={styles.lvLabelIndent}>Male:</Text>
            <Text style={styles.lvValue}>50 + 0.91 × (height cm − 152.4)</Text>
          </View>
          <View style={styles.lvRow}>
            <Text style={styles.lvLabelIndent}>Female:</Text>
            <Text style={styles.lvValue}>45.5 + 0.91 × (height cm − 152.4)</Text>
          </View>
          <Text style={styles.lvGroup}>Lean Body Weight (LBW)</Text>
          <View style={styles.lvRow}>
            <Text style={styles.lvLabelIndent}>Male:</Text>
            <Text style={styles.lvValue}>1.1 × TBW − 128 × (TBW ÷ height cm)²</Text>
          </View>
          <View style={styles.lvRow}>
            <Text style={styles.lvLabelIndent}>Female:</Text>
            <Text style={styles.lvValue}>1.07 × TBW − 148 × (TBW ÷ height cm)²</Text>
          </View>
          <Text style={styles.lvGroup}>Adjusted Body Weight (ABW)</Text>
          <Text style={styles.smallMutedTight}>(for obese patients — use where specified)</Text>
          <Text style={styles.lvValueIndent}>ABW = IBW + 0.4 × (TBW − IBW)</Text>

          <View style={styles.divider} />
          <Text style={styles.listLabel}>BMI Classification (WHO):</Text>
          <Text style={styles.bullet}>• &lt;18.5 — Underweight</Text>
          <Text style={styles.bullet}>• 18.5–24.9 — Normal weight</Text>
          <Text style={styles.bullet}>• 25–29.9 — Overweight</Text>
          <Text style={styles.bullet}>• 30–34.9 — Obesity class I</Text>
          <Text style={styles.bullet}>• 35–39.9 — Obesity class II</Text>
          <Text style={styles.bullet}>• ≥40 — Morbid obesity (class III)</Text>
        </HeaderCard>

        <HeaderCard title="Renal Function — Cockcroft-Gault (CrCl)" headerColor={COLORS.info}>
          <Text style={styles.listLabel}>Formula:</Text>
          <FormulaBox>
            CrCl (mL/min) ={'\n'}
            [(140 − Age) × Weight kg] ÷ [72 × Creatinine mg/dL]{'\n'}
            {'\n'}× 0.85 for female patients
          </FormulaBox>
          <Text style={styles.listLabel}>Conversion: Creatinine µmol/L ÷ 88.4 = mg/dL</Text>
          <View style={styles.divider} />
          <Text style={styles.listLabel}>CKD Staging (eGFR mL/min/1.73m²):</Text>
          <RefTable
            columns={[
              { key: 'stage', label: 'Stage', width: 60, strong: true },
              { key: 'egfr', label: 'eGFR', width: 70 },
              { key: 'desc', label: 'Description', flex: 1 },
            ]}
            rows={[
              { stage: 'Stage 1', egfr: '≥90', desc: 'Normal (+ damage markers)' },
              { stage: 'Stage 2', egfr: '60–89', desc: 'Mildly reduced' },
              { stage: 'Stage 3a', egfr: '45–59', desc: 'Mild–moderately reduced' },
              { stage: 'Stage 3b', egfr: '30–44', desc: 'Moderately–severely reduced' },
              { stage: 'Stage 4', egfr: '15–29', desc: 'Severely reduced' },
              { stage: 'Stage 5', egfr: '<15', desc: 'Kidney failure / dialysis' },
            ]}
          />
          <Text style={styles.smallMuted}>
            CKD ≥3b: avoid NSAIDs, reduce LMWH dose, caution with renally cleared drugs
            (morphine-6-glucuronide, gabapentin). eGFR &lt;15: critical electrolyte monitoring.
          </Text>
        </HeaderCard>
      </CollapsibleCard>

      {/* 11. SURGICAL RISK & SORT */}
      <CollapsibleCard title="Surgical Risk Classification & SORT Reference" icon="procedures">
        <SubHeading>Surgical Complexity Classification</SubHeading>
        <RefTable
          columns={[
            { key: 'grade', label: 'Grade', width: 95, strong: true },
            { key: 'ex', label: 'Examples', flex: 1 },
          ]}
          rows={[
            {
              grade: 'Minor',
              ex: 'Excision of skin lesion, incision of abscess, circumcision, diagnostic endoscopy, laparoscopy',
            },
            {
              grade: 'Intermediate',
              ex: 'Hernia repair + mesh, appendicectomy, tonsillectomy, knee arthroscopy, cataract, thyroid lobectomy, breast lumpectomy',
            },
            {
              grade: 'Major',
              ex: 'Total hip/knee replacement, colectomy, hysterectomy, open cholecystectomy, mastectomy, splenectomy',
            },
            {
              grade: 'Major+',
              ex: 'Oesophagectomy, pancreatectomy, liver resection, cystectomy, radical prostatectomy, total gastrectomy',
            },
            {
              grade: 'Complex Major',
              ex: 'Aortic aneurysm repair, liver transplant, cardiopulmonary bypass, multi-organ resection',
            },
          ]}
        />

        <SubHeading>SORT — Surgical Outcome Risk Tool (Variables)</SubHeading>
        <InfoBox>
          Protopapa KL et al. Br J Anaesth 2014. SORT predicts 30-day mortality using 6 variables.
          For full calculation, visit <Text style={styles.noteStrong}>sortsurgery.com</Text> at a
          workstation — enter values manually.
        </InfoBox>
        <RefTable
          columns={[
            { key: 'var', label: 'Variable', flex: 1.3, strong: true },
            { key: 'cats', label: 'Categories', flex: 2.5 },
          ]}
          rows={[
            { var: '1. ASA Class', cats: 'I / II / III / IV / V' },
            { var: '2. Urgency', cats: 'Elective / Expedited / Urgent / Immediate' },
            {
              var: '3. Surgical severity',
              cats: 'Minor / Intermediate / Major / Major+ / Complex Major',
            },
            { var: '4. Malignancy', cats: 'No / Yes (cancer in operative field)' },
            {
              var: '5. Surgical speciality',
              cats: 'Cardiac / Thoracic / Upper GI / Lower GI / HPB / Urology / Vascular / Orthopaedic / Gynaecology / Other',
            },
            { var: '6. Age', cats: "Patient's age in years" },
          ]}
        />

        <SubHeading>NCEPOD Classification of Urgency</SubHeading>
        <RefTable
          columns={[
            { key: 'cat', label: 'Category', width: 100, strong: true },
            { key: 'time', label: 'Time to Theatre', flex: 1 },
            { key: 'ex', label: 'Examples', flex: 2.4 },
          ]}
          rows={[
            {
              cat: 'Immediate (1)',
              time: 'Within minutes',
              ex: 'Ruptured aorta, cardiac tamponade, airway emergency, exsanguinating haemorrhage',
            },
            {
              cat: 'Urgent (2)',
              time: 'Within hours',
              ex: 'Hip fracture, bowel obstruction, ectopic pregnancy, appendicitis',
            },
            {
              cat: 'Expedited (3)',
              time: 'Within days',
              ex: 'Malignancy requiring timely intervention, infective conditions not immediately life-threatening',
            },
            {
              cat: 'Elective (4)',
              time: 'Planned',
              ex: 'Elective joint replacement, hernia repair, cholecystectomy, varicose veins',
            },
          ]}
        />
      </CollapsibleCard>

      {/* 12. PREOPERATIVE INVESTIGATIONS — NICE NG45 */}
      <CollapsibleCard title="Preoperative Investigations — NICE NG45 Guidance" icon="vials">
        <View style={styles.secondaryBox}>
          <Text style={styles.secondaryText}>
            NICE guideline NG45 (2016). Tests should be ordered based on ASA grade and surgical grade
            — <Text style={styles.noteStrong}>not routinely for all patients.</Text>
          </Text>
        </View>
        <RefTable
          columns={[
            { key: 'test', label: 'Test', width: 80, strong: true },
            { key: 'asa1', label: 'ASA I — Minor/Intermediate', flex: 1.2 },
            { key: 'asa2', label: 'ASA II — Major+', flex: 1.3 },
            { key: 'asa34', label: 'ASA III/IV — Any surgery', flex: 1.2 },
            { key: 'ind', label: 'Key Indications', flex: 2 },
          ]}
          rows={[
            {
              test: 'FBC',
              asa1: 'No',
              asa2: 'Consider',
              asa34: 'Yes',
              ind: 'Anaemia, thrombocytopaenia, haematological disease',
            },
            {
              test: 'U&E / Creatinine',
              asa1: 'No',
              asa2: 'Consider if >60 yr, HTN, or DM',
              asa34: 'Yes',
              ind: 'Renal disease, HTN, DM, diuretics, ACEi',
            },
            {
              test: 'Coagulation (PT/APTT)',
              asa1: 'No',
              asa2: 'No (unless indicated)',
              asa34: 'If liver disease / anticoagulants',
              ind: 'Liver disease, bleeding history, anticoagulant use, major surgery with significant expected blood loss',
            },
            {
              test: 'LFTs',
              asa1: 'No',
              asa2: 'No (unless indicated)',
              asa34: 'If liver disease suspected',
              ind: 'Known liver disease, alcohol excess, jaundice, hepatotoxic medications',
            },
            {
              test: 'Glucose / HbA1c',
              asa1: 'No',
              asa2: 'If DM suspected',
              asa34: 'Yes (if DM)',
              ind: 'Known/suspected DM, obesity, SGLT2 inhibitor use',
            },
            {
              test: 'ECG',
              asa1: 'No',
              asa2: 'If >65 yr or cardiac disease',
              asa34: 'Yes',
              ind: 'Known cardiac disease, HTN, DM, arrhythmia, major/high-risk surgery',
            },
            {
              test: 'CXR',
              asa1: 'No',
              asa2: 'Only if clinically indicated',
              asa34: 'Only if clinically indicated',
              ind: 'Not routine. Only if known cardiac/pulmonary disease not recently investigated',
            },
            {
              test: 'Group & Save / Crossmatch',
              asa1: 'No',
              asa2: 'If significant blood loss possible',
              asa34: 'As appropriate',
              ind: 'Major surgery with anticipated >500 mL blood loss; crossmatch if >1 unit expected',
            },
            {
              test: 'Echocardiogram',
              asa1: 'No',
              asa2: 'Only if new murmur/symptoms',
              asa34: 'If cardiac dysfunction suspected',
              ind: 'New murmur, dyspnoea, reduced functional capacity, valve disease, heart failure',
            },
            {
              test: 'Lung function (PFTs)',
              asa1: 'No',
              asa2: 'Only if indicated',
              asa34: 'If severe COPD/asthma',
              ind: 'Severe obstructive/restrictive lung disease; thoracic surgery planning',
            },
          ]}
        />
      </CollapsibleCard>

      {/* REFERENCES FOOTER */}
      <View style={styles.refBox}>
        <Text style={styles.refText}>
          <Text style={styles.noteStrong}>References: </Text>
          NICE NG45 (2016)  |  Lee TH et al. Circulation 1999 (RCRI)  |  Chung F et al.
          Anesthesiology 2008 (STOP-BANG)  |  Rockwood K et al. CMAJ 2005 (CFS)  |  Caprini JA Semin
          Thromb Hemost 2010  |  Protopapa KL et al. Br J Anaesth 2014 (SORT)  |  Pugh RNH et al. Br
          J Surg 1973 (Child-Pugh)  |  Malinchoc M et al. Hepatology 2000 (MELD).
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  // Top reference-only note
  topNote: {
    flexDirection: 'row',
    backgroundColor: '#d1ecf1',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
  },
  topNoteIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  topNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#0c5460',
    lineHeight: 18,
  },

  // Sub-heading
  tableHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.md,
    marginBottom: 4,
  },

  // Caption hint
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },

  // Note / info / warn boxes
  noteBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textMuted,
  },
  noteText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },
  noteStrong: {
    fontWeight: '700',
    color: COLORS.text,
  },
  infoBox: {
    backgroundColor: '#d1ecf1',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.info,
  },
  infoText: {
    fontSize: 12,
    color: '#0c5460',
    lineHeight: 18,
  },
  warnBox: {
    backgroundColor: '#fff3cd',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  warnText: {
    fontSize: 12,
    color: '#664d03',
    lineHeight: 18,
  },

  // Coloured-header cards
  card: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#dee2e6',
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  cardHeader: {
    paddingVertical: 6,
    paddingHorizontal: SPACING.sm,
  },
  cardHeaderText: {
    fontSize: 13,
    fontWeight: '700',
  },
  cardBody: {
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
  },

  // Caprini checklists
  checkItem: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 20,
  },

  // Formula box (monospace)
  formulaBox: {
    backgroundColor: '#f1f3f5',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginVertical: 6,
  },
  formulaText: {
    fontSize: 12,
    color: COLORS.text,
    fontFamily: 'monospace',
    lineHeight: 18,
  },

  // Label/value lists (body weight formulas)
  lvRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  lvLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    width: 50,
  },
  lvLabelIndent: {
    fontSize: 12,
    color: COLORS.text,
    width: 60,
    paddingLeft: 12,
  },
  lvValue: {
    flex: 1,
    fontSize: 12,
    color: COLORS.text,
  },
  lvValueIndent: {
    fontSize: 12,
    color: COLORS.text,
    paddingLeft: 12,
    marginBottom: 3,
  },
  lvGroup: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
    marginBottom: 3,
  },

  // Bulleted lists
  listLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 4,
    marginBottom: 3,
  },
  bullet: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 18,
  },

  smallMuted: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  smallMutedTight: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 3,
  },

  divider: {
    height: 1,
    backgroundColor: '#dee2e6',
    marginVertical: 8,
  },

  // Secondary (grey) box — NICE NG45
  secondaryBox: {
    backgroundColor: '#e2e3e5',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textMuted,
  },
  secondaryText: {
    fontSize: 12,
    color: '#41464b',
    lineHeight: 18,
  },

  // References footer
  refBox: {
    backgroundColor: '#e2e3e5',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  refText: {
    fontSize: 11,
    color: '#41464b',
    lineHeight: 17,
  },
});
