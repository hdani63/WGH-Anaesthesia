import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import PatientInfoCard from '../components/PatientInfoCard';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING } from '../utils/theme';
import * as Calc from '../utils/calculators';

function TableSection({ title, headers, rows, columnFlex }) {
  const minWidth = headers.length <= 4 ? 760 : 980;

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}><Text style={styles.tableHeaderText}>{title}</Text></View>
      <ScrollView horizontal showsHorizontalScrollIndicator>
        <View style={[styles.tableInner, { minWidth }]}> 
          <View style={[styles.gridRow, styles.gridHeaderRow]}>
            {headers.map((header, index) => (
              <Text
                key={`header-${header}-${index}`}
                style={[styles.gridHeaderText, { flex: columnFlex[index] || 1 }]}
              >
                {header}
              </Text>
            ))}
          </View>

          {rows.map((row, rowIndex) => (
            <View
              key={`row-${title}-${rowIndex}`}
              style={[styles.gridRow, rowIndex % 2 === 1 && styles.gridRowAlt]}
            >
              {headers.map((_, colIndex) => (
                <Text
                  key={`cell-${title}-${rowIndex}-${colIndex}`}
                  style={[
                    styles.gridCellText,
                    { flex: columnFlex[colIndex] || 1 },
                    colIndex === 0 && styles.gridCellPrimary,
                  ]}
                >
                  {row[colIndex] || '-'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

export default function AnestheticDrugDosingScreen() {
  const [patient, setPatient] = useState({ weight: '70', age: '40', height: '170', gender: 'male' });
  const [ageGroup, setAgeGroup] = useState('adult');
  const [activeCard, setActiveCard] = useState('iv');

  const doses = useMemo(
    () => Calc.calculateAnestheticDoses(patient.weight, patient.age, ageGroup),
    [patient.weight, patient.age, ageGroup]
  );

  const fmt = (d) => typeof d === 'object' ? `${d.min}-${d.max}` : d;
  const toggleCard = (card) => setActiveCard((prev) => (prev === card ? null : card));

  const ivRows = [
    [
      'Propofol',
      `${fmt(doses.iv.propofol.induction)} mg`,
      `Maint: ${fmt(doses.iv.propofol.maintenance)} mg/hr\nSedation: ${fmt(doses.iv.propofol.sedation)} mg/hr`,
      'May cause injection pain',
    ],
    [
      'Ketamine',
      `IV: ${fmt(doses.iv.ketamine.iv)} mg\nIM: ${fmt(doses.iv.ketamine.im)} mg`,
      `Analgesic: ${fmt(doses.iv.ketamine.analgesic)} mg`,
      'Dissociative, preserves airway',
    ],
    ['Etomidate', `${fmt(doses.iv.etomidate.induction)} mg`, '-', 'Hemodynamically stable'],
    [
      'Dexmedetomidine',
      `Load: ${doses.iv.dexmedetomidine.load} mcg over 10 min`,
      `Maint: ${fmt(doses.iv.dexmedetomidine.maintenance)} mcg/hr`,
      'alpha2-agonist, no respiratory depression',
    ],
    ['Thiopental', `${fmt(doses.iv.thiopental.induction)} mg`, '-', 'Avoid in hypovolemia'],
    [
      'Remimazolam',
      `${fmt(doses.iv.remimazolam.induction)} mg`,
      `Maint: ${fmt(doses.iv.remimazolam.maintenance)} mg/hr`,
      'Ultra-short benzodiazepine',
    ],
  ];

  const inhalationalRows = [
    ['Sevoflurane', `${doses.inhalational.sevoflurane.mac}%`, 'Induction: 8%\nMaint: 1-3%', 'Non-pungent, pediatric friendly'],
    ['Desflurane', `${doses.inhalational.desflurane.mac}%`, 'Maint: 3-8%', 'Very rapid offset, pungent'],
    ['Isoflurane', `${doses.inhalational.isoflurane.mac}%`, 'Maint: 1-2.5%', 'Intermediate onset/offset'],
    ['Nitrous Oxide', '104%', 'Typical: 30-70%', 'Adjuvant, contraindications'],
  ];

  const opioidRows = [
    [
      'Fentanyl',
      `${fmt(doses.opioids.fentanyl.bolus)} mcg`,
      `${fmt(doses.opioids.fentanyl.infusion)} mcg/hr`,
      `Epidural: ${fmt(doses.opioids.fentanyl.epidural)} mcg`,
      'Rapid onset, 30-60 min',
    ],
    [
      'Morphine',
      `IV: ${fmt(doses.opioids.morphine.iv)} mg`,
      '-',
      `IM/SC: ${fmt(doses.opioids.morphine.im)} mg\nEpidural: ${fmt(doses.opioids.morphine.epidural)} mg`,
      'Histamine release',
    ],
    [
      'Sufentanil',
      `${fmt(doses.opioids.sufentanil.bolus)} mcg`,
      `${fmt(doses.opioids.sufentanil.infusion)} mcg/hr`,
      '-',
      'Very potent',
    ],
    [
      'Remifentanil',
      `${fmt(doses.opioids.remifentanil.bolus)} mcg`,
      `${fmt(doses.opioids.remifentanil.infusion)} mcg/hr`,
      '-',
      'Ultra-short acting',
    ],
    [
      'Hydromorphone',
      `IV: ${fmt(doses.opioids.hydromorphone.iv)} mg`,
      '-',
      `IM/SC: ${fmt(doses.opioids.hydromorphone.im)} mg`,
      'Less histamine release',
    ],
    [
      'Tramadol',
      `IV/IM: ${doses.opioids.tramadol.ivIm} mg`,
      '-',
      `Oral: ${doses.opioids.tramadol.oral} mg`,
      'SNRI activity',
    ],
  ];

  const nmbRows = [
    [
      'Succinylcholine',
      `IV: ${fmt(doses.nmb.succinylcholine.iv)} mg`,
      '-',
      `IM: ${fmt(doses.nmb.succinylcholine.im)} mg`,
      'Depolarizing, many contraindications',
    ],
    [
      'Rocuronium',
      `${doses.nmb.rocuronium.intubation} mg`,
      `${doses.nmb.rocuronium.maintenance} mg q30-40min`,
      `RSI: ${fmt(doses.nmb.rocuronium.rsi)} mg`,
      'Reversible with sugammadex',
    ],
    [
      'Vecuronium',
      `${doses.nmb.vecuronium.intubation} mg`,
      `${doses.nmb.vecuronium.maintenance} mg q25-40min`,
      '-',
      'Intermediate duration',
    ],
    [
      'Cisatracurium',
      `${fmt(doses.nmb.cisatracurium.intubation)} mg`,
      `${doses.nmb.cisatracurium.maintenance} mg q40-60min`,
      '-',
      'Organ-independent elimination',
    ],
    [
      'Atracurium',
      `${doses.nmb.atracurium.intubation} mg`,
      `${doses.nmb.atracurium.maintenance} mg q20-45min`,
      '-',
      'Hoffman elimination',
    ],
  ];

  const localRows = [
    ['Lidocaine', '0.5-1% solution', '1.5-2% solution', '5% solution, 50-100 mg', `${doses.local.lidocaine.max} mg (max)`],
    ['Bupivacaine', '0.25-0.5% solution', '0.25-0.5% solution', '0.5% solution, 10-20 mg', `${doses.local.bupivacaine.max} mg (max)`],
    ['Ropivacaine', '0.2-0.5% solution', '0.2-0.5% solution', '-', `${doses.local.ropivacaine.max} mg (max)`],
  ];

  const sedativeRows = [
    ['Midazolam', `${doses.sedatives.midazolam.premed} mg IV`, '1-5 mg IV (titrate)', 'N/A (adult)', 'Reversible with flumazenil'],
    ['Lorazepam', `${doses.sedatives.lorazepam.premed} mg`, '0.5-2 mg IV', '-', 'Longer duration than midazolam'],
  ];

  const vasopressorRows = [
    ['Phenylephrine', '50-200 mcg IV', `${fmt(doses.vasopressors.phenylephrine.infusion)} mcg/min`, 'Spinal hypotension', 'Pure alpha1-agonist'],
    ['Ephedrine', `${doses.vasopressors.ephedrine.bolus} mg IV`, '-', 'Obstetric hypotension', 'Indirect sympathomimetic'],
    ['Norepinephrine', '-', `${fmt(doses.vasopressors.norepinephrine.infusion)} mcg/hr`, 'Septic shock', 'alpha1/beta1-agonist'],
    ['Epinephrine', 'Anaphylaxis: 0.3-0.5 mg IM\nArrest: 1 mg IV', `${fmt(doses.vasopressors.epinephrine.infusion)} mcg/hr`, 'Anaphylaxis, cardiac arrest', 'Non-selective adrenergic'],
    ['Dopamine', '-', `${fmt(doses.vasopressors.dopamine.infusion)} mcg/hr`, 'Cardiogenic shock', 'Dose-dependent receptors'],
    ['Dobutamine', '-', `${fmt(doses.vasopressors.dobutamine.infusion)} mcg/hr`, 'Heart failure', 'beta1-selective inotrope'],
  ];

  const reversalRows = [
    ['Naloxone', doses.reversal.naloxone.initial, doses.reversal.naloxone.infusion, 'Opioid reversal', 'Short half-life'],
    ['Flumazenil', doses.reversal.flumazenil.initial, doses.reversal.flumazenil.additional, 'Benzodiazepine reversal', 'Seizure risk'],
    ['Sugammadex', `Routine: ${doses.reversal.sugammadex.routine} mg\nDeep: ${doses.reversal.sugammadex.deep} mg\nImmediate: ${doses.reversal.sugammadex.immediate} mg`, '-', 'Rocuronium/vecuronium reversal', 'Specific reversal agent'],
    ['Neostigmine', `Neostigmine: ${doses.reversal.neostigmine.dose} mg\n+ Glycopyrrolate: ${doses.reversal.glycopyrrolate.dose} mg`, '-', 'NMB reversal', 'Give with anticholinergic'],
    ['Atropine', `Premedication: ${doses.reversal.atropine.premed} mcg\nBradycardia: ${doses.reversal.atropine.bradycardia} mcg`, '-', 'Bradycardia, antisialagogue', 'Anticholinergic'],
    ['Dantrolene', `${doses.reversal.dantrolene.dose} mg`, 'Continue until resolution', 'Malignant hyperthermia', 'Emergency only'],
  ];

  const antiemeticRows = [
    ['Ondansetron', `${doses.antiemetics.ondansetron.dose} mg`, 'See adult dose', '5-HT3 antagonist', 'QT prolongation'],
    ['Dexamethasone', `${doses.antiemetics.dexamethasone.dose} mg`, 'See adult dose', 'Corticosteroid', 'Delayed wound healing'],
    ['Metoclopramide', `${doses.antiemetics.metoclopramide.dose} mg`, 'See adult dose', 'Dopamine antagonist', 'Extrapyramidal effects'],
  ];

  return (
    <ScreenWrapper title="Anaesthetic Drug Dosing" subtitle="Comprehensive anaesthetic medication dosing calculator">
      <PatientInfoCard patient={patient} setPatient={setPatient} showGender={false}>
        <View style={styles.extraField}>
          <PickerSelect
            label="Age Group"
            options={[
              { value: 'neonate', label: 'Neonate (0-1 month)' },
              { value: 'infant', label: 'Infant (1-12 months)' },
              { value: 'toddler', label: 'Toddler (1-3 years)' },
              { value: 'preschool', label: 'Preschool (3-6 years)' },
              { value: 'school', label: 'School age (6-12 years)' },
              { value: 'adolescent', label: 'Adolescent (12-18 years)' },
              { value: 'adult', label: 'Adult (18-65 years)' },
              { value: 'elderly', label: 'Elderly (>65 years)' },
            ]}
            selected={ageGroup}
            onSelect={setAgeGroup}
          />
        </View>
      </PatientInfoCard>

      <CollapsibleCard
        title="I. Intravenous Anesthetics"
        icon="syringe"
        open={activeCard === 'iv'}
        onToggle={() => toggleCard('iv')}
      >
        <TableSection
          title="Dosing Table"
          headers={['Medication', 'Induction', 'Maintenance/Other', 'Notes']}
          rows={ivRows}
          columnFlex={[1.15, 1.35, 1.65, 1.35]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="I.B. Inhalational Anesthetics"
        icon="wind"
        open={activeCard === 'inhalational'}
        onToggle={() => toggleCard('inhalational')}
      >
        <TableSection
          title="Inhalational Agents"
          headers={['Agent', 'MAC (Adult)', 'Concentrations', 'Characteristics']}
          rows={inhalationalRows}
          columnFlex={[1.1, 1, 1.3, 1.6]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="II. Opioid Analgesics"
        icon="pills"
        open={activeCard === 'opioids'}
        onToggle={() => toggleCard('opioids')}
      >
        <TableSection
          title="Opioid Dosing"
          headers={['Medication', 'Bolus/Immediate', 'Infusion/Sustained', 'Other Routes', 'Notes']}
          rows={opioidRows}
          columnFlex={[1.05, 1.2, 1.2, 1.5, 1.2]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="III. Neuromuscular Blocking Agents"
        icon="link"
        open={activeCard === 'nmb'}
        onToggle={() => toggleCard('nmb')}
      >
        <TableSection
          title="Neuromuscular Blockers"
          headers={['Medication', 'Intubation Dose', 'Maintenance', 'Other/Special', 'Notes']}
          rows={nmbRows}
          columnFlex={[1.1, 1.25, 1.2, 1.25, 1.2]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="IV. Local Anesthetics"
        icon="syringe"
        open={activeCard === 'local'}
        onToggle={() => toggleCard('local')}
      >
        <TableSection
          title="Local Anaesthetic Profiles"
          headers={['Agent', 'Local Infiltration', 'Epidural', 'Spinal', 'Max Safe Dose']}
          rows={localRows}
          columnFlex={[1.1, 1.2, 1.2, 1.25, 1.2]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="V. Sedatives/Anxiolytics"
        icon="smile"
        open={activeCard === 'sedatives'}
        onToggle={() => toggleCard('sedatives')}
      >
        <TableSection
          title="Sedative Agents"
          headers={['Medication', 'Premedication', 'IV Sedation', 'Pediatric PO', 'Notes']}
          rows={sedativeRows}
          columnFlex={[1.1, 1.2, 1.1, 1, 1.6]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="VI. Vasopressors and Inotropes"
        icon="tint"
        open={activeCard === 'vasopressors'}
        onToggle={() => toggleCard('vasopressors')}
      >
        <TableSection
          title="Vasopressor and Inotrope Dosing"
          headers={['Medication', 'Bolus Dose', 'Infusion Rate', 'Special Indications', 'Mechanism']}
          rows={vasopressorRows}
          columnFlex={[1.05, 1.2, 1.25, 1.25, 1.25]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="VII. Emergency/Reversal Medications"
        icon="exclamation-triangle"
        open={activeCard === 'reversal'}
        onToggle={() => toggleCard('reversal')}
      >
        <TableSection
          title="Emergency and Reversal Dosing"
          headers={['Medication', 'Initial Dose', 'Additional/Infusion', 'Indication', 'Notes']}
          rows={reversalRows}
          columnFlex={[1.05, 1.45, 1.25, 1.2, 1.2]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="VIII. Antiemetics"
        icon="dizzy"
        open={activeCard === 'antiemetics'}
        onToggle={() => toggleCard('antiemetics')}
      >
        <TableSection
          title="Antiemetic Dosing"
          headers={['Medication', 'Adult Dose', 'Pediatric Dose', 'Mechanism', 'Side Effects']}
          rows={antiemeticRows}
          columnFlex={[1.1, 1.1, 1.1, 1.2, 1.3]}
        />
      </CollapsibleCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  extraField: { marginBottom: SPACING.sm },
  table: { marginBottom: SPACING.md, borderRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  tableHeader: { backgroundColor: COLORS.medicalBlue, padding: SPACING.sm },
  tableHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
  tableInner: { backgroundColor: COLORS.white },
  gridHeaderRow: { backgroundColor: '#2b2d42' },
  gridRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  gridRowAlt: { backgroundColor: '#f8f9fa' },
  gridHeaderText: { color: COLORS.white, fontSize: 12, fontWeight: '700', padding: SPACING.sm },
  gridCellText: { color: COLORS.text, fontSize: 12, lineHeight: 17, padding: SPACING.sm },
  gridCellPrimary: { fontWeight: '700' },
});
