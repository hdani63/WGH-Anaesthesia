import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CollapsibleCard from '../../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';

// ---------------------------------------------------------------------------
// Display-only reference tables mirrored from the Flask web app
// (templates/preoperative_collapsible.html). NOT interactive calculators.
// ---------------------------------------------------------------------------

// Generic reference table renderer.
// columns: array of { key, label, flex?, width? }
// rows:    array of objects keyed by column.key
export function RefTable({ columns, rows }) {
  return (
    <View>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        {columns.map((col) => (
          <Text
            key={col.key}
            style={[
              styles.tableCell,
              styles.tableHeaderCell,
              col.flex ? { flex: col.flex } : { width: col.width },
            ]}
          >
            {col.label}
          </Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
          ]}
        >
          {columns.map((col) => (
            <Text
              key={col.key}
              style={[
                styles.tableCell,
                col.flex ? { flex: col.flex } : { width: col.width },
                col.strong ? styles.tableCellStrong : null,
              ]}
            >
              {row[col.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

// ───────── 1. ASA Physical Status ─────────
export function ASAReferenceTable() {
  return (
      <CollapsibleCard title="ASA Physical Status Classification (Reference)" icon="user-md">
        <RefTable
          columns={[
            { key: 'cls', label: 'Class', width: 60, strong: true },
            { key: 'def', label: 'Definition', flex: 1.3 },
            { key: 'ex', label: 'Examples', flex: 2 },
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
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.noteStrong}>Add suffix "E"</Text> for emergency surgery (e.g.,
            ASA IIE). Emergency surgery generally carries 2–5× higher risk than elective at same
            ASA class.
          </Text>
        </View>
      </CollapsibleCard>
  );
}

// ───────── 2. Functional Capacity (METs) ─────────
export function METsReferenceTable() {
  return (
      <CollapsibleCard title="Functional Capacity — METs Reference" icon="running">
        <Text style={styles.hint}>
          1 MET = 3.5 mL O₂/kg/min. Based on Duke Activity Status Index (DASI). Functional
          capacity ≥4 METs with no symptoms generally indicates adequate cardiac reserve —
          further testing rarely changes management.
        </Text>
        <RefTable
          columns={[
            { key: 'mets', label: 'METs', width: 60, strong: true },
            { key: 'level', label: 'Activity Level', flex: 1.2 },
            { key: 'ex', label: 'Example Activities', flex: 2 },
          ]}
          rows={[
            {
              mets: '<1',
              level: 'Severely limited',
              ex: 'Eating, dressing, using toilet',
            },
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
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            <Text style={styles.noteStrong}>Clinical significance: </Text>
            Poor functional capacity (&lt;4 METs) combined with high RCRI score = elevated
            perioperative cardiac risk. Consider cardiology review and optimisation before
            elective high-risk surgery.
          </Text>
        </View>
      </CollapsibleCard>
  );
}

// ───────── 3. El-Ganzouri Risk Index (EGRI) + Airway Parameters ─────────
export function AirwayReferenceTable() {
  return (
      <CollapsibleCard title="Difficult Airway — EGRI & Parameters (Reference)" icon="lungs-virus">
        <Text style={styles.tableHeading}>Airway Parameters — Normal vs. Concerning</Text>
        <RefTable
          columns={[
            { key: 'assess', label: 'Assessment', flex: 1, strong: true },
            { key: 'normal', label: 'Normal / Low Risk', flex: 1 },
            { key: 'concern', label: 'Concerning / Increased Risk', flex: 1.5 },
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

        <Text style={styles.tableHeading}>El-Ganzouri Risk Index (EGRI)</Text>
        <RefTable
          columns={[
            { key: 'param', label: 'Parameter', flex: 1.4, strong: true },
            { key: 'p0', label: '0 points', flex: 1 },
            { key: 'p1', label: '1 point', flex: 1 },
            { key: 'p2', label: '2 points', flex: 1 },
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
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>
            <Text style={styles.noteStrong}>
              EGRI Score ≥4 = significant risk of difficult intubation.
            </Text>{' '}
            Plan awake intubation, video laryngoscopy, or senior assistance.
          </Text>
        </View>
      </CollapsibleCard>
  );
}

// ───────── 4. Surgical Complexity & NCEPOD Urgency ─────────
export function SurgicalComplexityReferenceTable() {
  return (
      <CollapsibleCard title="Surgical Complexity & NCEPOD Urgency (Reference)" icon="procedures">
        <Text style={styles.tableHeading}>Surgical Complexity Classification</Text>
        <RefTable
          columns={[
            { key: 'grade', label: 'Grade', width: 90, strong: true },
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

        <Text style={styles.tableHeading}>NCEPOD Classification of Urgency</Text>
        <RefTable
          columns={[
            { key: 'cat', label: 'Category', width: 100, strong: true },
            { key: 'time', label: 'Time to Theatre', width: 90 },
            { key: 'ex', label: 'Examples', flex: 1 },
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
  );
}

// ───────── 5. NICE NG45 Preoperative Investigations ─────────
export function NICEInvestigationsReferenceTable() {
  return (
      <CollapsibleCard title="Preoperative Investigations — NICE NG45 (Reference)" icon="vials">
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            NICE guideline NG45 (2016). Tests should be ordered based on ASA grade and surgical
            grade — <Text style={styles.noteStrong}>not routinely for all patients.</Text>
          </Text>
        </View>
        <RefTable
          columns={[
            { key: 'test', label: 'Test', width: 70, strong: true },
            { key: 'asa1', label: 'ASA I — Minor/Intermediate', flex: 1 },
            { key: 'asa2', label: 'ASA II — Major+', flex: 1.1 },
            { key: 'asa34', label: 'ASA III/IV — Any surgery', flex: 1 },
            { key: 'ind', label: 'Key Indications', flex: 1.5 },
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
  );
}

// Default export: all reference tables grouped (retained for backwards compat).
export default function ReferenceTablesSection() {
  return (
    <View>
      <Text style={styles.sectionHeader}>Reference Tables</Text>
      <ASAReferenceTable />
      <METsReferenceTable />
      <AirwayReferenceTable />
      <SurgicalComplexityReferenceTable />
      <NICEInvestigationsReferenceTable />
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.medicalBlue,
  },
  hint: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
    marginBottom: SPACING.sm,
  },
  tableHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginTop: SPACING.md,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 2,
  },
  tableHeaderRow: {
    backgroundColor: COLORS.medicalBlue,
  },
  tableHeaderCell: {
    color: COLORS.white,
    fontWeight: '700',
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
    fontSize: 11,
    color: COLORS.text,
    lineHeight: 16,
    paddingRight: 4,
  },
  tableCellStrong: {
    fontWeight: '700',
    color: COLORS.medicalBlue,
  },
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
});
