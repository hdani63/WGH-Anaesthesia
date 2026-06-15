import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { RefTable } from './preop/ReferenceTablesSection';

// ---------------------------------------------------------------------------
// Anaesthetic Drug Dose Reference
// 100% STATIC reference tables mirrored verbatim from the Flask web app
// (templates/anesthetic_drug_dosing_comprehensive.html). No inputs / no
// interactive calculator logic.
// ---------------------------------------------------------------------------

function NoteBox({ children }) {
  return (
    <View style={styles.noteBox}>
      <Text style={styles.noteText}>{children}</Text>
    </View>
  );
}

function DangerBox({ children }) {
  return (
    <View style={styles.dangerBox}>
      <Text style={styles.dangerText}>{children}</Text>
    </View>
  );
}

// Column definitions ---------------------------------------------------------
const COLS_5 = (c2, c3, c4) => [
  { key: 'drug', label: 'Drug', flex: 1.5, strong: true },
  { key: 'c2', label: c2, flex: 2 },
  { key: 'c3', label: c3, flex: 1 },
  { key: 'c4', label: c4, flex: 1.3 },
  { key: 'notes', label: 'Notes', flex: 3 },
];

const COLS_NMB = [
  { key: 'drug', label: 'Drug', flex: 1.5, strong: true },
  { key: 'c2', label: 'Intubating Dose', flex: 1.6 },
  { key: 'c3', label: 'Maintenance', flex: 1.6 },
  { key: 'c4', label: 'Duration', flex: 1.2 },
  { key: 'notes', label: 'Notes', flex: 3 },
];

const COLS_LOCAL = [
  { key: 'drug', label: 'Drug', flex: 1.3, strong: true },
  { key: 'plain', label: 'Max Dose (plain)', flex: 1.3 },
  { key: 'adren', label: 'Max Dose (with adrenaline)', flex: 1.5 },
  { key: 'onset', label: 'Onset', flex: 1 },
  { key: 'duration', label: 'Duration', flex: 1 },
  { key: 'notes', label: 'Notes', flex: 2.6 },
];

const COLS_CARDIO = [
  { key: 'drug', label: 'Drug', flex: 1.3, strong: true },
  { key: 'c2', label: 'Dose', flex: 2.2 },
  { key: 'c3', label: 'Route', flex: 1.1 },
  { key: 'notes', label: 'Notes', flex: 3 },
];

// ── 1. Induction Agents ──
const INDUCTION = [
  { drug: 'Propofol', c2: '1.5–2.5 mg/kg IV\nElderly/frail: 1–1.5 mg/kg', c3: 'IV', c4: '30–45 s', notes: 'Titrate slowly. Pain on injection — lidocaine 20–40 mg IV first. Causes apnoea, hypotension. Avoid in egg/soya allergy.' },
  { drug: 'Thiopentone', c2: '3–5 mg/kg IV\nElderly: 1–3 mg/kg', c3: 'IV', c4: '30 s', notes: '2.5% solution (25 mg/mL). Preferred for raised ICP. Avoid in porphyria. Extravasation causes tissue necrosis.' },
  { drug: 'Ketamine', c2: 'IV: 1–2 mg/kg\nIM: 4–6 mg/kg\nDissociative sedation: 0.5–1 mg/kg IV', c3: 'IV / IM', c4: 'IV: 60 s\nIM: 3–5 min', notes: 'Maintains airway reflexes and CVS stability. Increases secretions (give glycopyrrolate). May cause emergence phenomena — benzodiazepine co-induction reduces this.' },
  { drug: 'Etomidate', c2: '0.2–0.3 mg/kg IV', c3: 'IV', c4: '30–60 s', notes: 'Minimal cardiovascular depression. Single dose causes adrenocortical suppression for 6–24 h. Pain on injection. Myoclonic movements common.' },
  { drug: 'Midazolam', c2: 'Premedication: 1–2 mg IV (titrate)\nOral preop: 7.5 mg PO (1–2 h pre-op)', c3: 'IV / PO', c4: 'IV: 2–3 min', notes: 'Anxiolysis, amnesia, antiemetic. Reversible with flumazenil. Caution in elderly — prolonged sedation. Avoid in first trimester.' },
];

// ── 2. Neuromuscular Blocking Agents ──
const NMB = [
  { drug: 'Suxamethonium\n(Succinylcholine)', c2: '1–1.5 mg/kg IV\nRSI: 1.5 mg/kg', c3: 'Not used for maintenance', c4: '5–10 min', notes: 'Depolarising. Ultra-short acting. For RSI/can’t intubate emergency. Contraindications: hyperkalaemia risk (burns >24h, spinal cord injury, prolonged immobility), personal/family history of malignant hyperthermia, pseudocholinesterase deficiency.' },
  { drug: 'Rocuronium', c2: '0.6 mg/kg IV\nRSI: 1.2 mg/kg', c3: '0.1–0.2 mg/kg IV\n(when TOF ≥2)', c4: '0.6 mg/kg: 30–40 min\n1.2 mg/kg: 60–70 min', notes: 'Non-depolarising. Drug of choice where suxamethonium contraindicated. RSI dose (1.2 mg/kg) reversed by sugammadex 16 mg/kg. Mild vagolytic effect.' },
  { drug: 'Atracurium', c2: '0.4–0.5 mg/kg IV', c3: '0.1–0.2 mg/kg IV\nor 5–10 mcg/kg/min infusion', c4: '20–35 min', notes: 'Hofmann elimination — useful in renal/hepatic failure. Laudanosine metabolite (CNS excitatory at high doses). Histamine release possible at high doses.' },
  { drug: 'Cisatracurium', c2: '0.15–0.2 mg/kg IV', c3: '0.03 mg/kg IV\nor 1–2 mcg/kg/min infusion', c4: '40–50 min', notes: 'Hofmann elimination. Lower laudanosine production than atracurium. No histamine release. Preferred in ICU sedation/neuromuscular blockade.' },
  { drug: 'Vecuronium', c2: '0.08–0.1 mg/kg IV', c3: '0.02–0.03 mg/kg IV', c4: '25–40 min', notes: 'Minimal cardiovascular effects. Hepatic metabolism. Avoid in liver disease.' },
  { drug: 'Mivacurium', c2: '0.15–0.2 mg/kg IV', c3: '0.05–0.1 mg/kg IV', c4: '12–20 min', notes: 'Metabolised by pseudocholinesterase. Shortest duration non-depolarising agent. Histamine release at rapid injection. Prolonged action in pseudocholinesterase deficiency.' },
];

// ── 3. Reversal Agents ──
const REVERSAL = [
  { drug: 'Sugammadex', c2: 'Moderate block (TOF 2 twitches): 2 mg/kg\nDeep block (post-tetanic 1–2): 4 mg/kg\nImmediate reversal of 1.2 mg/kg rocuronium: 16 mg/kg', c3: 'IV', c4: 'Rocuronium\nVecuronium', notes: 'Encapsulates aminosteroid NMBAs. Drug of choice for rocuronium reversal. Not effective for benzylisoquinoliniums (atracurium, cisatracurium, mivacurium). Monitor with TOF.' },
  { drug: 'Neostigmine', c2: '50 mcg/kg IV (max 5 mg)\nAlways give with glycopyrrolate', c3: 'IV', c4: 'All non-depolarising NMBAs', notes: 'Acetylcholinesterase inhibitor. Must have TOF ≥2 twitches. Give with glycopyrrolate 10 mcg/kg (max 0.4 mg) to prevent muscarinic side effects (bradycardia, secretions, bronchospasm).' },
  { drug: 'Glycopyrrolate', c2: 'Anti-muscarinic with neostigmine: 0.2 mg per 1 mg neostigmine\nBradycardia: 200–400 mcg IV', c3: 'IV', c4: 'Muscarinic side effects', notes: 'Does not cross blood-brain barrier (unlike atropine). Preferred over atropine when co-administered with neostigmine (matched onset).' },
  { drug: 'Atropine', c2: 'Bradycardia: 300–600 mcg IV\nSinus arrest: 600 mcg–1.2 mg IV\nPaediatric: 20 mcg/kg IV (min 100 mcg)', c3: 'IV / IM', c4: 'Bradycardia\nMuscarinic effects', notes: 'Crosses BBB. Tachycardia, dry mouth, urinary retention. Paradoxical bradycardia at low doses. Use glycopyrrolate with neostigmine instead.' },
  { drug: 'Flumazenil', c2: '200 mcg IV over 15 s\nRepeat 100 mcg every 60 s\nMax 1 mg total', c3: 'IV', c4: 'Benzodiazepines', notes: 'Short duration (1 h) — re-sedation may occur. May precipitate seizures in chronic benzodiazepine users. Does not reverse opioids.' },
  { drug: 'Naloxone', c2: 'Opioid reversal: 100–200 mcg IV\nTitrate 25–40 mcg IV every 2–3 min\nIM: 200–400 mcg', c3: 'IV / IM / SC', c4: 'Opioids', notes: 'Duration 45–90 min (shorter than most opioids — re-narcotisation risk). Titrate to preserve analgesia while reversing respiratory depression. May precipitate acute withdrawal in opioid-dependent patients.' },
];

// ── 4. Opioid Analgesics ──
const OPIOIDS = [
  { drug: 'Fentanyl', c2: 'Intraoperative: 1–3 mcg/kg IV\nAnalgesia bolus: 25–100 mcg IV\nTCI: Ce target 1–4 ng/mL (Marsh/Schnider)', c3: 'IV / TCI', c4: '30–60 min', notes: 'Highly lipid-soluble. Rapid onset. Chest wall rigidity with large rapid doses. Minimal histamine release. Remifentanil preferred for longer cases.' },
  { drug: 'Remifentanil', c2: 'Intraoperative infusion: 0.1–0.5 mcg/kg/min\nTCI: Ce target 2–8 ng/mL (Minto model)\nReduce by 50% in elderly', c3: 'IV infusion / TCI', c4: '3–5 min (context-insensitive)', notes: 'Metabolised by plasma esterases. Ultra-short acting — predictable offset regardless of infusion duration. Must provide alternative analgesia before discontinuing. Risk of opioid-induced hyperalgesia with prolonged infusion.' },
  { drug: 'Morphine', c2: 'Intraoperative: 0.1–0.15 mg/kg IV (titrate)\nPACU analgesia: 1–2 mg IV every 5 min (titrate)\nSC/IM: 5–10 mg every 4 h', c3: 'IV / SC / IM / PO', c4: '3–5 h', notes: 'Active metabolite (morphine-6-glucuronide) accumulates in renal failure. Histamine release possible. Nausea/vomiting common. Caution in asthma.' },
  { drug: 'Alfentanil', c2: 'Induction supplement: 10–20 mcg/kg IV\nMaintenance infusion: 0.5–1 mcg/kg/min', c3: 'IV / TCI', c4: '10–15 min', notes: 'Shorter acting than fentanyl. Less lipid-soluble — faster recovery. Useful for short procedures.' },
  { drug: 'Oxycodone', c2: 'IV: 1–10 mg (titrate)\nPO: 5–10 mg every 4–6 h (immediate release)', c3: 'IV / PO', c4: '3–4 h (IR)', notes: 'Approximately twice as potent as oral morphine. Active metabolites. Caution in renal impairment.' },
  { drug: 'Codeine', c2: 'PO: 30–60 mg every 4–6 h\nMax: 240 mg/day', c3: 'PO / IM', c4: '4–6 h', notes: 'Prodrug — converted to morphine by CYP2D6. Poor metabolisers: no effect. Ultra-rapid metabolisers: risk of toxicity. Avoid in children <12 and post-tonsillectomy.' },
  { drug: 'Tramadol', c2: '1–2 mg/kg IV over 15 min (max 100 mg)\nPO: 50–100 mg every 4–6 h (max 400 mg/day)', c3: 'IV / PO', c4: '4–6 h', notes: 'Dual action (opioid + SNRI). Lower respiratory depression risk. Significant PONV. Lower seizure threshold. Serotonin syndrome risk with SSRIs/MAOIs. Avoid in severe renal failure.' },
];

// ── 5. Antiemetics ──
const ANTIEMETICS = [
  { drug: 'Ondansetron', c2: '4 mg IV (8 mg for high-risk PONV)', c3: 'IV (slow over 30 s)', c4: 'End of surgery', notes: '5-HT₃ antagonist. Drug of choice for PONV. QTc prolongation risk — avoid with other QT-prolonging drugs. Headache, constipation.' },
  { drug: 'Dexamethasone', c2: '4–8 mg IV', c3: 'IV', c4: 'At induction', notes: 'Most effective as prophylaxis given early. Additive with ondansetron (different mechanism). Transient hyperglycaemia. Use with caution in diabetic patients.' },
  { drug: 'Cyclizine', c2: '50 mg IV/IM\nMax 150 mg/day', c3: 'IV / IM / PO', c4: '15–30 min pre-op or end of surgery', notes: 'H1 antihistamine + anticholinergic. Useful for motion-related PONV. Sedation, dry mouth, tachycardia. Caution in heart failure.' },
  { drug: 'Metoclopramide', c2: '10 mg IV/IM/PO\nMax 30 mg/day', c3: 'IV / IM / PO', c4: 'End of surgery or PACU', notes: 'D2 antagonist + prokinetic. Extrapyramidal side effects (akathisia, dystonia). Avoid in Parkinson’s. Risk of tardive dyskinesia with prolonged use. Limited evidence for PONV vs 5-HT₃ antagonists.' },
  { drug: 'Droperidol', c2: '0.625–1.25 mg IV', c3: 'IV', c4: 'End of surgery', notes: 'Butyrophenone D2 antagonist. Highly effective antiemetic. QTc prolongation (black box warning in USA but used safely at low doses). Sedation. Extrapyramidal effects less common at antiemetic doses.' },
  { drug: 'Prochlorperazine', c2: '12.5 mg IM / 3–6 mg buccal / 5–10 mg PO', c3: 'IM / PO / buccal', c4: 'PACU / ward', notes: 'Phenothiazine D2 antagonist. Extrapyramidal effects. Avoid in Parkinson’s and children <12 kg.' },
  { drug: 'Scopolamine patch\n(Hyoscine)', c2: '1 patch (1.5 mg) applied 4 h before surgery', c3: 'Transdermal', c4: 'Night before or 4 h pre-op', notes: 'Effective for 72 h. Anticholinergic effects: dry mouth, sedation, blurred vision, urinary retention. Particularly useful for motion-related PONV and high-risk patients.' },
];

// ── 6. Vasopressors & Emergency Drugs ──
const VASOPRESSORS = [
  { drug: 'Adrenaline\n(Epinephrine)', c2: 'Anaphylaxis: 0.5 mg IM (0.5 mL of 1:1000 = 1 mg/mL)\nCardiac arrest: 1 mg IV (10 mL of 1:10,000)\nBolus (cardiovascular): 10–100 mcg IV\nInfusion: 0.01–0.3 mcg/kg/min', c3: 'IM / IV / infusion', c4: 'α + β1 + β2', notes: 'Anaphylaxis: IM thigh (anterolateral). Repeat 5 min if needed. Increases HR, BP, bronchodilation. Cardiac arrest: alternate with chest compressions (2 min cycles).' },
  { drug: 'Ephedrine', c2: '3–6 mg IV bolus (repeat to effect)\nMax ~30 mg titrated doses', c3: 'IV', c4: 'α + β (indirect sympathomimetic)', notes: 'First-line for spinal anaesthesia hypotension. Indirect acting — less effective in chronic catecholamine depletion. Tachycardia. Tachyphylaxis. Cross placenta — fetal tachycardia.' },
  { drug: 'Phenylephrine', c2: 'Bolus: 50–100 mcg IV\nInfusion: 25–100 mcg/min', c3: 'IV', c4: 'Pure α1 agonist', notes: 'Preferred vasopressor in spinal hypotension for elective caesarean section (preserves uteroplacental blood flow). Reflex bradycardia — avoid if bradycardic. Reduces heart rate and CO.' },
  { drug: 'Metaraminol', c2: 'Bolus: 0.5–2 mg IV\nInfusion: 5 mg in 50 mL, titrate', c3: 'IV', c4: 'α1 agonist (primarily) + mild β1', notes: 'Longer duration than phenylephrine. Mixed α/β effects. Suitable for spinal hypotension. May cause reflex bradycardia. Useful in theatre where noradrenaline not available.' },
  { drug: 'Noradrenaline\n(Norepinephrine)', c2: 'Infusion: 0.01–0.3 mcg/kg/min\nCentral line preferred', c3: 'IV infusion', c4: 'α1 >> β1', notes: 'First-line vasopressor in septic shock (Surviving Sepsis guidelines). Increases SVR. May reduce CO in healthy hearts (reflex bradycardia). Peripheral necrosis risk with extravasation.' },
  { drug: 'Vasopressin', c2: 'Septic shock: 0.03–0.04 units/min infusion (fixed)\nCardiac arrest: 40 units IV (single dose)', c3: 'IV infusion', c4: 'V1 receptor vasoconstriction', notes: 'Adjunct to noradrenaline in refractory vasodilatory shock. Catecholamine-sparing. Not titrated in sepsis — fixed dose of 0.03 units/min.' },
  { drug: 'Atropine', c2: 'Bradycardia: 300–600 mcg IV\nSinus arrest: 600 mcg–1.2 mg IV\nMax 3 mg', c3: 'IV', c4: 'Muscarinic antagonist', notes: 'Paradoxical bradycardia possible at <300 mcg. Tachycardia, dry mouth, urinary retention, mydriasis. Second-line after atropine in ALS — consider adrenaline or pacing.' },
  { drug: 'Calcium chloride 10%', c2: 'Hyperkalaemia/hypocalcaemia: 5–10 mL (6.8–13.6 mmol Ca²⁺) IV slowly\nCardiac arrest with hyperkalaemia: 10 mL IV', c3: 'IV (central preferred)', c4: 'Membrane stabilisation / ionotrope', notes: '1 g/10 mL = 6.8 mmol Ca²⁺ (note: calcium gluconate 10% = 2.25 mmol Ca²⁺ per 10 mL — less potent). Peripheral extravasation causes necrosis — central line preferred.' },
  { drug: 'Dantrolene', c2: 'Malignant hyperthermia: 2.5 mg/kg IV rapidly\nRepeat 1 mg/kg every 5–10 min\nMax 10 mg/kg', c3: 'IV', c4: 'Ryanodine receptor blocker', notes: 'Specific treatment for MH. Call for help immediately. Reconstitute each 20 mg vial in 60 mL sterile water. Muscle weakness, phlebitis. Continue 1 mg/kg 6-hourly for 24 h post-crisis.' },
  { drug: 'Intralipid 20%', c2: 'LAST: Bolus 1.5 mL/kg IV over 1 min\nThen infusion 15 mL/kg/h\nMax 12 mL/kg total (30 min)', c3: 'IV', c4: 'Lipid sink for local anaesthetic toxicity', notes: 'Local Anaesthetic Systemic Toxicity (LAST): stop LA, call for help, manage airway, treat seizures (benzodiazepine), CPR if cardiac arrest. Intralipid is adjunct — not a substitute for resuscitation.' },
];

// ── 7. Local Anaesthetics — Maximum Safe Doses ──
const LOCAL = [
  { drug: 'Lidocaine', plain: '3 mg/kg', adren: '7 mg/kg', onset: 'Fast (2–5 min)', duration: '1–2 h plain\n2–6 h with adrenaline', notes: 'IV lidocaine infusion for analgesia: 1.5 mg/kg bolus then 1.5 mg/kg/h. Useful for laryngoscopy attenuation (1.5 mg/kg IV 3 min before). Antiarrhythmic: 1–1.5 mg/kg IV bolus.' },
  { drug: 'Bupivacaine', plain: '2 mg/kg (max 150 mg)', adren: '2.5 mg/kg (max 200 mg)', onset: 'Slow (10–15 min)', duration: '3–8 h', notes: 'Most cardiotoxic LA. Highly protein-bound. Slow-onset but long duration. Avoid rapid IV injection. 0.5% hyperbaric for spinal. 0.25% / 0.125% for epidural. Not for IV regional anaesthesia.' },
  { drug: 'Levobupivacaine', plain: '2 mg/kg (max 150 mg)', adren: '2.5 mg/kg', onset: 'Slow (10–15 min)', duration: '3–8 h', notes: 'S-enantiomer of bupivacaine. Less cardiotoxic than racemic bupivacaine. Similar clinical profile. Preferred in obstetric practice at some institutions.' },
  { drug: 'Ropivacaine', plain: '3 mg/kg (max 225 mg)', adren: '3 mg/kg (adrenaline not routinely added)', onset: 'Slow (10–15 min)', duration: '3–8 h', notes: 'Less cardiotoxic than bupivacaine. Motor-sparing at low concentrations (0.2% epidural for labour). Good for peripheral nerve blocks. Does not usually require adrenaline.' },
  { drug: 'Prilocaine', plain: '6 mg/kg', adren: '8 mg/kg', onset: 'Fast (2–5 min)', duration: '1–2 h', notes: 'Least cardiotoxic. Metabolised to o-toluidine (methaemoglobinaemia at large doses >600 mg). Drug of choice for IV regional anaesthesia (Bier’s block). Also in EMLA cream with lidocaine.' },
  { drug: 'Cocaine', plain: '3 mg/kg (max 200 mg for topical ENT)', adren: 'Not used with adrenaline (cocaine has intrinsic sympathomimetic effects)', onset: 'Fast (2–5 min)', duration: '30–60 min', notes: 'Only LA with vasoconstrictor properties. Used topically in ENT surgery (nasal). Schedule 1 controlled drug — strict storage and documentation.' },
];

// ── 8. Non-Opioid Analgesics & Adjuncts ──
const NON_OPIOID = [
  { drug: 'Paracetamol', c2: 'IV: 1 g (500 mg if <50 kg)\nPO/PR: 0.5–1 g', c3: 'IV / PO / PR', c4: 'Every 4–6 h (max 4 g/day)', notes: 'First-line step 1 analgesic. Antipyretic. Minimal side effects at therapeutic doses. Hepatotoxic in overdose. Give IV over 15 min. Reduce dose in severe hepatic impairment and if weight <50 kg.' },
  { drug: 'Diclofenac', c2: 'IM/IV: 75 mg\nPO/PR: 50 mg\nMax 150 mg/day', c3: 'PO / PR / IV / IM', c4: 'Every 6–8 h', notes: 'NSAID. Effective for acute pain, renal colic. Contraindications: peptic ulcer, renal failure (eGFR <30), severe heart failure, NSAID hypersensitivity, pregnancy ≥30 weeks. Use with PPI if GI risk.' },
  { drug: 'Ketorolac', c2: 'IV/IM: 15–30 mg\nElderly: 15 mg', c3: 'IV / IM', c4: 'Every 6 h. Max 5 days', notes: 'Parenteral NSAID. Effective opioid-sparing agent. Same contraindications as diclofenac. Max duration 5 days (renal toxicity). Avoid in renal impairment.' },
  { drug: 'Ibuprofen', c2: '400–600 mg PO\nMax 2.4 g/day', c3: 'PO', c4: 'Every 6–8 h (with food)', notes: 'NSAID. Moderate analgesic and antipyretic. Lower risk profile than diclofenac at standard doses. Same contraindications class-wide.' },
  { drug: 'Gabapentin', c2: 'Preoperative: 300–900 mg PO\nChronic pain: 300 mg titrated to 900–3600 mg/day in 3 divided doses', c3: 'PO', c4: '3 times daily', notes: 'Calcium channel α2δ subunit ligand. Preoperative dose reduces intraoperative opioid requirement. Sedation, dizziness. Dose reduce in renal impairment. Abuse potential.' },
  { drug: 'Pregabalin', c2: 'Preoperative: 75–150 mg PO\nNeuropathic pain: 75–150 mg twice daily (max 600 mg/day)', c3: 'PO', c4: 'Twice daily', notes: 'More predictable absorption than gabapentin. Preoperative use reduces opioid consumption and PONV. Sedation, weight gain, peripheral oedema. Reduce dose in renal impairment.' },
  { drug: 'Ketamine (sub-anaesthetic)', c2: 'IV bolus: 0.1–0.5 mg/kg\nInfusion: 0.1–0.3 mg/kg/h', c3: 'IV', c4: 'Bolus PRN / continuous infusion', notes: 'NMDA antagonist. Opioid-sparing, anti-hyperalgesic. Useful in opioid-tolerant patients. Psychomimetic effects (dysphoria, hallucinations) at higher doses — consider midazolam co-administration. Preserves respiratory drive.' },
  { drug: 'Magnesium sulphate', c2: 'Analgesia adjunct: 1–2 g IV over 15–20 min\nEclampsia: 4 g IV over 5–10 min + 1 g/h infusion', c3: 'IV', c4: 'Single perioperative dose', notes: 'NMDA receptor antagonist. Opioid-sparing, reduces postoperative analgesic requirements. Monitor for toxicity: loss of tendon reflexes (first sign), respiratory depression. Calcium gluconate 1 g IV is antidote.' },
  { drug: 'Dexamethasone', c2: 'Anti-inflammatory/analgesia: 4–8 mg IV\nAirway oedema: 8 mg IV', c3: 'IV', c4: 'Single dose (at induction)', notes: 'Analgesic effect from anti-inflammatory properties. Reduces postoperative pain and opioid consumption. Antiemetic (see antiemetics section). Transient hyperglycaemia. No single dose concerns for adrenal suppression.' },
];

// ── 9. Cardiovascular & Antiarrhythmic Agents ──
const CARDIO = [
  { drug: 'Amiodarone', c2: 'VF/pulseless VT: 300 mg IV bolus (peripheral), then 150 mg if refractory\nHaemodynamically stable VT/AF: 300 mg IV over 1 h, then 900 mg over 24 h', c3: 'IV (central for infusion)', notes: 'Broad-spectrum antiarrhythmic (class III). Long half-life (40–55 days). Hypotension with rapid IV bolus. Thyroid, pulmonary, hepatic toxicity with chronic use.' },
  { drug: 'Adenosine', c2: 'SVT: 6 mg rapid IV bolus\nRepeat with 12 mg if unsuccessful\nFurther 18 mg if needed', c3: 'IV (rapid, proximal vein)', notes: 'Drug of choice for terminating SVT. Flush immediately with 10–20 mL saline. Half-life <10 s. Chest pain, dyspnoea, flushing (transient). Contraindicated in Wolff-Parkinson-White syndrome (anterograde delta wave). Warn patient.' },
  { drug: 'Esmolol', c2: 'Bolus: 500 mcg/kg IV over 1 min\nInfusion: 50–300 mcg/kg/min', c3: 'IV', notes: 'Ultra-short-acting β1 blocker (t½ 9 min). Controls HR during laryngoscopy, emergence, tachyarrhythmias. Useful when short duration β-blockade needed. Hypotension.' },
  { drug: 'Labetalol', c2: 'Hypertensive emergency: 5–20 mg IV boluses\nInfusion: 2 mg/min', c3: 'IV', notes: 'α1 + β blocker. Reduces BP without reflex tachycardia. Suitable in pregnancy (pre-eclampsia). Avoid in asthma, heart failure.' },
  { drug: 'Hydralazine', c2: '5–10 mg IV slowly\nRepeat at 20–30 min intervals', c3: 'IV', notes: 'Arterial vasodilator. Used in pre-eclampsia (second-line after labetalol). Reflex tachycardia. Headache. Drug-induced lupus with chronic use.' },
  { drug: 'GTN (Nitroglycerin)', c2: 'Sublingual: 400–800 mcg\nIV infusion: 10–200 mcg/min', c3: 'SL / IV', notes: 'Venodilator > arteriodilator. Reduces preload. For acute coronary syndromes, hypertensive emergency, pulmonary oedema. Headache, hypotension. Tolerance with continuous use.' },
  { drug: 'Digoxin', c2: 'AF rate control: Loading 250–500 mcg IV over 30 min\nThen 250 mcg IV at 4 h and 8 h\nMaintenance 62.5–250 mcg/day', c3: 'IV / PO', notes: 'Narrow therapeutic index. Monitor levels and electrolytes (K⁺, Mg²⁺). Toxicity: nausea, yellow-green visual halos, arrhythmias. Digoxin-specific antibody (Digibind) for toxicity.' },
];

// ── 10. Corticosteroids, Bronchodilators & Other Perioperative Drugs ──
const SPECIAL = [
  { drug: 'Hydrocortisone', c2: 'Steroid cover (minor surgery): 50 mg IV at induction\nMajor surgery: 100 mg IV at induction + 50 mg every 8 h for 24 h\nAnaphylaxis: 200 mg IV', c3: 'IV / IM', c4: 'Steroid supplementation, anaphylaxis, adrenal crisis', notes: 'For patients on long-term steroids (>10 mg prednisolone/day). Equivalent steroid doses: hydrocortisone 100 mg ≈ prednisolone 25 mg ≈ methylprednisolone 20 mg ≈ dexamethasone 4 mg.' },
  { drug: 'Methylprednisolone', c2: 'Acute spinal cord injury: 30 mg/kg IV over 15 min (controversial)\nAnti-inflammatory: 40–500 mg IV', c3: 'IV', c4: 'Anti-inflammatory, immunosuppression', notes: 'High-dose use in acute spinal cord injury is controversial — not routinely recommended per current guidelines. Significant glucose elevation.' },
  { drug: 'Salbutamol\n(Albuterol)', c2: 'Bronchospasm: 2.5–5 mg nebulised\nSevere: 100–200 mcg IV slowly\nHyperkalaemia: 10–20 mg nebulised', c3: 'Nebulised / IV / MDI', c4: 'Bronchospasm, hyperkalaemia', notes: 'β2 agonist. IV use for severe bronchospasm/laryngospasm. Tachycardia, hypokalaemia with large doses. MDI via circuit (10 puffs) effective intraoperatively.' },
  { drug: 'Ipratropium', c2: '250–500 mcg nebulised\nMax 2 mg/day', c3: 'Nebulised / MDI', c4: 'Bronchospasm, COPD exacerbation', notes: 'Anticholinergic bronchodilator. Additive with salbutamol. Less effective alone than in combination. Minimal systemic effects.' },
  { drug: 'Aminophylline', c2: 'Loading: 5 mg/kg IV over 20 min (omit if on theophylline)\nMaintenance: 0.5 mg/kg/h', c3: 'IV', c4: 'Severe bronchospasm, refractory to β2 agonists', notes: 'Third-line bronchodilator. Narrow therapeutic index — monitor levels. Tachycardia, arrhythmias, seizures in toxicity. Check theophylline level before loading dose.' },
  { drug: 'Tranexamic acid (TXA)', c2: 'Surgical haemorrhage: 1 g IV over 10 min at start, repeat at 3 h\nMajor trauma: 1 g IV over 10 min within 3 h of injury, then 1 g over 8 h\nObstetric haemorrhage: 1 g IV, repeat if bleeding continues after 30 min', c3: 'IV', c4: 'Antifibrinolytic — reduces surgical blood loss', notes: 'Lysine analogue. Most effective given early. Reduces mortality in trauma and PPH. Risk of seizures at high doses. Avoid if history of arterial/venous thrombosis or DIC.' },
  { drug: 'Protamine', c2: 'Heparin reversal: 1 mg per 100 units heparin given in preceding 2–3 h\nMax 50 mg IV over 10 min', c3: 'IV (slowly)', c4: 'Reversal of heparin anticoagulation', notes: 'Rapid injection causes hypotension, bradycardia, anaphylaxis. Anaphylactic risk higher in fish allergy, prior protamine exposure, vasectomy. Have adrenaline available.' },
  { drug: 'Heparin (unfractionated)', c2: 'Prophylaxis: 5000 units SC every 8–12 h\nTherapeutic: 5000 units IV bolus + 18 units/kg/h infusion\nCardiopulmonary bypass: 300–400 units/kg (target ACT >480 s)', c3: 'SC / IV', c4: 'DVT prophylaxis, therapeutic anticoagulation, CPB', notes: 'Monitor APTT (therapeutic target 60–100 s). Reversed by protamine. Risk of HIT — check platelets day 5–10 if on >4 days. Does not cross placenta (safe in pregnancy).' },
];

// =============================================================================

export default function AnaestheticDrugDosingScreen() {
  return (
    <ScreenWrapper
      title="Anaesthetic Drug Dose Reference"
      subtitle="Standard adult doses — verify against current BNF/SPC before administration"
    >
      {/* Top reference-only warning */}
      <View style={styles.topNote}>
        <FontAwesome5 name="exclamation-triangle" size={13} color={COLORS.warning} style={styles.topNoteIcon} />
        <Text style={styles.topNoteText}>
          <Text style={styles.noteStrong}>Reference only. </Text>
          Doses shown are standard adult starting ranges. Adjust for age, weight, comorbidity, and
          concomitant drugs. Always verify with current BNF/SPC. The treating clinician bears full
          responsibility for all prescribing decisions.
        </Text>
      </View>

      {/* 1. INDUCTION AGENTS */}
      <CollapsibleCard title="Induction Agents" icon="bed">
        <RefTable columns={COLS_5('Standard Dose', 'Route', 'Onset')} rows={INDUCTION} />
      </CollapsibleCard>

      {/* 2. NEUROMUSCULAR BLOCKING AGENTS */}
      <CollapsibleCard title="Neuromuscular Blocking Agents" icon="hand-paper">
        <DangerBox>
          All NMBAs cause complete apnoea. Ensure airway management capability before administration.
        </DangerBox>
        <RefTable columns={COLS_NMB} rows={NMB} />
      </CollapsibleCard>

      {/* 3. REVERSAL AGENTS */}
      <CollapsibleCard title="Reversal Agents" icon="undo">
        <RefTable columns={COLS_5('Dose', 'Route', 'Reverses')} rows={REVERSAL} />
      </CollapsibleCard>

      {/* 4. OPIOID ANALGESICS */}
      <CollapsibleCard title="Opioid Analgesics" icon="pills">
        <RefTable columns={COLS_5('Dose', 'Route', 'Duration')} rows={OPIOIDS} />
      </CollapsibleCard>

      {/* 5. ANTIEMETICS */}
      <CollapsibleCard title="Antiemetics" icon="ban">
        <RefTable columns={COLS_5('Dose', 'Route', 'Timing')} rows={ANTIEMETICS} />
        <NoteBox>
          <Text style={styles.noteStrong}>Apfel PONV Score (risk factors): </Text>
          Female sex | Non-smoker | History of PONV/motion sickness | Postoperative opioid use — 0
          factors: 10% risk; 1: 20%; 2: 40%; 3: 60%; 4: 80%.{'\n'}
          For high-risk patients (≥3 factors): use multimodal prophylaxis (e.g., ondansetron +
          dexamethasone + TIVA).
        </NoteBox>
      </CollapsibleCard>

      {/* 6. VASOPRESSORS & EMERGENCY DRUGS */}
      <CollapsibleCard title="Vasopressors & Emergency Drugs" icon="heartbeat">
        <RefTable columns={COLS_5('Dose', 'Route', 'Action')} rows={VASOPRESSORS} />
      </CollapsibleCard>

      {/* 7. LOCAL ANAESTHETICS */}
      <CollapsibleCard title="Local Anaesthetics — Maximum Safe Doses" icon="map-pin">
        <DangerBox>
          Always aspirate before injection. Inject slowly. Max doses are cumulative across all sites.
          Have Intralipid 20% immediately available for regional anaesthesia.
        </DangerBox>
        <RefTable columns={COLS_LOCAL} rows={LOCAL} />
        <NoteBox>
          <Text style={styles.noteStrong}>Dose calculation reminder: </Text>
          Max dose (mg) = max dose (mg/kg) × patient weight (kg). For 1% solution: 1% = 10 mg/mL.
          For 0.5%: 5 mg/mL. For 0.25%: 2.5 mg/mL.
        </NoteBox>
      </CollapsibleCard>

      {/* 8. NON-OPIOID ANALGESICS */}
      <CollapsibleCard title="Non-Opioid Analgesics & Adjuncts" icon="capsules">
        <RefTable columns={COLS_5('Dose', 'Route', 'Frequency')} rows={NON_OPIOID} />
      </CollapsibleCard>

      {/* 9. CARDIOVASCULAR & ANTIARRHYTHMIC */}
      <CollapsibleCard title="Cardiovascular & Antiarrhythmic Agents" icon="heart">
        <RefTable columns={COLS_CARDIO} rows={CARDIO} />
      </CollapsibleCard>

      {/* 10. CORTICOSTEROIDS & SPECIAL DRUGS */}
      <CollapsibleCard title="Corticosteroids, Bronchodilators & Other Perioperative Drugs" icon="flask">
        <RefTable columns={COLS_5('Dose', 'Route', 'Indication')} rows={SPECIAL} />
      </CollapsibleCard>

      {/* REFERENCES FOOTER */}
      <View style={styles.refBox}>
        <Text style={styles.refText}>
          <Text style={styles.noteStrong}>References: </Text>
          British National Formulary (BNF) current edition  |  Stoelting&apos;s Pharmacology &
          Physiology in Anaesthetic Practice  |  Miller&apos;s Anesthesia  |  Resuscitation Council
          UK ALS Guidelines (2021)  |  Association of Anaesthetists Quick Reference Handbook (QRH 2024).
        </Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topNote: {
    flexDirection: 'row',
    backgroundColor: '#fff3cd',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  topNoteIcon: { marginRight: 8, marginTop: 2 },
  topNoteText: { flex: 1, fontSize: 12, color: '#664d03', lineHeight: 18 },
  noteStrong: { fontWeight: '700', color: COLORS.text },

  noteBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.textMuted,
  },
  noteText: { fontSize: 12, color: COLORS.text, lineHeight: 18 },

  dangerBox: {
    backgroundColor: '#f8d7da',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.danger || '#dc3545',
  },
  dangerText: { fontSize: 12, color: '#842029', lineHeight: 18, fontWeight: '600' },

  refBox: {
    backgroundColor: '#e2e3e5',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  refText: { fontSize: 11, color: '#41464b', lineHeight: 17 },
});
