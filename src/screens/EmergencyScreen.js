import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import CalcButton from '../components/CalcButton';
import ResultDisplay from '../components/ResultDisplay';
import { PickerSelect } from '../components/FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import * as Calc from '../utils/calculators';

const protocolSteps = {
  mh: [
    '1. Stop all triggering agents (volatile anesthetics, succinylcholine)',
    '2. Call for help - Get MH cart',
    '3. Hyperventilate with 100% O2 at 10 L/min',
    '4. Give Dantrolene - 2-3 mg/kg IV bolus, then 1 mg/kg every 5 min as needed',
    '5. Cool patient - Ice packs, cold IV fluids',
    '6. Treat arrhythmias - Avoid calcium channel blockers',
    '7. Monitor - ABG, electrolytes, CK, temperature',
  ],
  last: [
    '1. Stop local anesthetic injection',
    '2. Call for help - Get lipid emulsion',
    '3. Manage airway and breathing',
    '4. Suppress seizures - Small doses of benzodiazepines/propofol',
    '5. Give 20% Intralipid - Initial bolus 1.5 mL/kg',
    '6. Start infusion - 0.25 mL/kg/min',
    '7. CPR if needed - Continue for extended period',
    '8. Avoid vasopressin, calcium channel blockers, beta-blockers',
  ],
  anaphylaxis: [
    '1. Call for help and note the time',
    '2. Stop/remove potential triggers and maintain anesthesia',
    '3. Give 100% oxygen and secure airway/ventilation',
    '4. Elevate legs if hypotensive',
    '5. If severe hypotension/cardiac arrest, start CPR immediately',
    '6. Give adrenaline and repeat as needed',
    '7. Give rapid IV crystalloid 20 mL/kg; repeat until hypotension resolves',
    '8. If persistent bronchospasm, treat as severe bronchospasm',
    '9. Send serum tryptase ASAP, then repeat at 1-2 h and >24 h',
  ],
};

const qrhSections = [
  {
    key: 's1',
    badge: 'Section 1',
    title: 'Key Basic Plan',
    color: '#1a3a5c',
    subtitle: 'Single guideline for any crisis where diagnosis is unclear',
    cards: [
      {
        key: 'qrh-kbp',
        title: '1-1 Key Basic Plan',
        icon: 'clipboard-list',
        intro:
          'Use this for any crisis where signs, symptoms and underlying problem are not clear. The same systematic approach increases the chance of identifying the problem and limits fixation.',
        alert:
          'START. If problem worsens significantly or a new problem arises - call for help and go back to START.',
        steps: [
          'Adequate Oxygen Delivery - Pause surgery if possible. Check fresh gas flow AND measured FiO2. Visual inspection of entire breathing system. Confirm reservoir bag / ventilator bellows moving.',
          'Airway - Check position of airway device and listen for noise (including larynx and stomach). Check capnogram shape. Confirm airway device patent (consider suction catheter). Consider isolating equipment.',
          'Breathing - Check chest symmetry, rate, breath sounds, SpO2, measured VTexp, EtCO2. Feel airway pressure using reservoir bag and APL valve (<3 breaths).',
          'Circulation - Check rate, rhythm, perfusion, recheck BP.',
          'Depth - Ensure appropriate depth of anesthesia, analgesia and neuromuscular blockade.',
          'Consider surgical problem.',
          'Call for help if problem not resolving quickly.',
          'Isolating Equipment - Ventilate using self-inflating bag connected directly to tracheal tube connector. Do NOT use HME filter, angle piece, or catheter mount.',
          'Airway Noise - Listen over the larynx with a stethoscope for additional information (leak/obstruction). Pass suction catheter to check patency.',
        ],
      },
    ],
  },
  {
    key: 's2',
    badge: 'Section 2',
    title: 'Unknowns',
    color: '#b91c1c',
    subtitle: 'Crisis manifesting as signs/symptoms - diagnosis and treatment simultaneous',
    cards: [
      {
        key: 'qrh-ca',
        title: '2-1 Cardiac Arrest',
        icon: 'heartbeat',
        intro:
          'Probable cause: something related to surgery/anesthesia, patient medical condition, reason for surgery, or equipment failure. First priority: start chest compressions.',
        alert:
          "START. Systematically evaluate and treat potential causes (4 H's, 4 T's + perioperative problems).",
        steps: [
          '1. IMMEDIATE ACTION - Declare cardiac arrest and note time. Delegate ONE person to chest compressions (100 min-1, depth 5 cm). Call for help. Call for cardiac arrest trolley. Delegate evaluation of potential causes.',
          '2. Adequate Oxygen Delivery - Increase FGF, give 100% O2, check measured FiO2. Turn off anesthetic (inhalational and IV). Check breathing system valves and connections. Confirm ventilator bellows moving or provide manual ventilation.',
          '3. Airway - Check position and listen for noise. Confirm patency (suction catheter). If absent EtCO2 - presume oesophageal intubation until excluded.',
          '4. Breathing - Check chest symmetry, SpO2, measured volume, EtCO2. Evaluate airway pressure.',
          '5. Circulation - Check rate and adequacy of compressions (visual + EtCO2). Rotate personnel. IV or IO access. Check ECG rhythm <5 seconds. Follow Resuscitation Council (UK)/ERC Guidelines.',
          "6. Systematically evaluate and treat underlying causes - 4 H's & 4 T's + perioperative: vagal tone, drug error, LA toxicity (->3-10), acidosis, anaphylaxis (->3-1), massive blood loss (->3-2).",
          '7. If ROSC - re-establish anesthesia.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUG DOSES:',
            lines: [
              'Fluid bolus 20 ml.kg-1 (adult 500 ml)',
              'Adrenaline 10 ug.kg-1 (adult 1 mg - may give in increments)',
              'Atropine 10 ug.kg-1 (adult 0.5-1 mg) if vagal tone likely',
              'Amiodarone 5 mg.kg-1 (adult 300 mg) after 3rd shock',
              'Magnesium 50 mg.kg-1 (adult 2 g) for polymorphic VT',
              'Calcium chloride 10%: 0.2 ml.kg-1 (adult 10 ml)',
            ],
          },
          {
            tone: 'green',
            title: 'DEFIBRILLATION:',
            lines: [
              'Continue compressions while charging.',
              'Biphasic 4 J.kg-1 (adult 150-200 J).',
              'DO NOT check pulse after defibrillation.',
              'Use 3 stacked shocks in cardiac cath lab.',
            ],
          },
          {
            tone: 'gray',
            title: "POTENTIAL CAUSES (4 H's & 4 T's):",
            lines: [
              'Hypoxia · Hypovolaemia · Hypo/hyperkalaemia · Hypothermia',
              'Tamponade (->3-9) · Thrombosis (->3-5) · Toxins · Tension pneumothorax',
            ],
          },
          {
            tone: 'gray',
            title: "DON'T FORGET:",
            lines: [
              'Use waveform capnography. No EtCO2 = lungs not ventilated.',
              'Sudden rise in EtCO2 usually signals ROSC.',
              'Uterine displacement in pregnant patients.',
            ],
          },
        ],
      },
      {
        key: 'qrh-hypoxia',
        title: '2-2 Hypoxia / Desaturation / Cyanosis',
        icon: 'lungs',
        intro:
          'Using these steps from start to end should identify any cause. Avoid spending excessive time on one aspect until you have run through the whole drill.',
        steps: [
          '1. Adequate Oxygen Delivery - Pause surgery. Increase FGF AND give 100% O2 AND check FiO2. Inspect breathing system. Confirm ventilation. If SpO2 low - is it accurate? Consider poor perfusion.',
          '2. Airway - Check position and listen for noise (larynx and stomach). Check capnogram shape. Confirm patency. Isolate patient from machine (self-inflating bag directly to TT connector). Consider replacing airway device.',
          '3. Breathing - Chest symmetry, rate, sounds, SpO2, VTexp, EtCO2. Feel airway pressure. Consider causes (Box D).',
          '4. Circulation - Heart rate, rhythm, perfusion, BP. If unstable, consider if secondary to hypoxia.',
          '5. Depth - Ensure adequate anesthesia and analgesia.',
          '6. If not resolving - call for help AND check ABG, 12-lead ECG, CXR.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'Potential Causes:',
            lines: [
              'Laryngospasm (->3-6) · Bronchospasm (->3-4) · Anaphylaxis (->3-1) · Circulatory embolism (->3-5)',
              'Cardiac ischaemia (->3-12) · Cardiac tamponade (->3-9) · Sepsis (->3-14) · MH crisis (->3-8)',
              'Aspiration · Pulmonary oedema',
            ],
          },
        ],
      },
      {
        key: 'qrh-press',
        title: '2-3 Increased Airway Pressure',
        icon: 'compress-arrows-alt',
        intro:
          'Using these steps from start to end should identify any cause. Avoid spending excessive time on one aspect until you have run through the whole guideline.',
        steps: [
          '1. Adequate Oxygen Delivery - Pause surgery. Consider surgery-related cause. Increase FGF AND 100% O2 AND check FiO2. Inspect breathing system. Confirm increased pressure by switching to hand ventilation (<3 breaths).',
          '2. Airway - Check position and noise. Check capnogram. Confirm patency. Isolate from machine (self-inflating bag directly to TT). Consider replacing airway device.',
          '3. Breathing - Chest, SpO2, VTexp, EtCO2. Feel pressure. Consider causes: inadequate NMB, laparoscopic surgery (release pneumoperitoneum), laryngospasm (->3-6), bronchospasm (->3-4), anaphylaxis (->3-1), circulatory embolus (->3-5), aspiration, pulmonary oedema, bronchial intubation, foreign body, pneumothorax.',
          '4. Circulation - Check HR, rhythm, perfusion, BP. Unstable? Consider high airway pressure/gas trapping as cause.',
          '5. Depth - Ensure adequate anesthesia and analgesia.',
          '6. If not resolving - call for help AND ABG, 12-lead ECG, CXR.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'Key Point:',
            lines: [
              'Airway "feel" depends on APL valve setting - you can only feel a maximum of what the APL valve is set to.',
              'Measured expired tidal volume gives additional information.',
            ],
          },
        ],
      },
      {
        key: 'qrh-hypotension',
        title: '2-4 Hypotension',
        icon: 'arrow-down',
        intro:
          'Commonly due to deep anesthesia, neuraxial autonomic effects, hypovolaemia or combined causes. Rapidly exclude O2 delivery, airway and breathing problems first.',
        steps: [
          '1. Adequate Oxygen Delivery - Pause surgery. Increase FGF AND 100% O2 AND check FiO2. Inspect breathing system.',
          '2. Airway - Position, noise, capnogram, patency.',
          '3. Breathing - Chest symmetry, SpO2, VTexp, EtCO2. Feel airway pressure. Exclude high intrathoracic pressure as cause.',
          '4. Circulation - Check HR, rhythm, perfusion, recheck BP.',
          'If HR <60 bpm - anticholinergic drug.',
          'Give vasopressor and position head-down.',
          'Consider fluid boluses (adult 250 ml; child 10 ml.kg-1).',
          'If HR >100 sinus - treat as hypovolaemia: IV fluid bolus.',
          'If HR >100 and non-sinus - 2-7 Tachycardia.',
          '5. Depth - Correct depth AND analgesia (consider awareness risk).',
          '6. Exclude surgical causes - vena cava compression, blood loss, vagal reaction, embolism.',
          '7. Consider drug error, pneumothorax, cardiac ischaemia (->3-12), anaphylaxis (->3-1), tamponade (->3-9), LA toxicity (->3-10), sepsis (->3-14). Call for help.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'ANTICHOLINERGICS:',
            lines: [
              'Glycopyrrolate 5 ug.kg-1 (adult 200-400 ug)',
              'Atropine 5 ug.kg-1 (adult 300-600 ug)',
            ],
          },
          {
            tone: 'blue',
            title: 'VASOPRESSORS:',
            lines: [
              'Ephedrine 100 ug.kg-1 (adult 3-12 mg)',
              'Phenylephrine 5 ug.kg-1 (adult 100 ug)',
              'Metaraminol 5 ug.kg-1 (adult 500 ug)',
              'Adrenaline 1 ug.kg-1 (adult 10-100 ug) - emergency only',
            ],
          },
        ],
      },
      {
        key: 'qrh-hypertension',
        title: '2-5 Hypertension',
        icon: 'arrow-up',
        intro:
          'Most commonly due to inappropriate depth of anesthesia or inadequate analgesia. Rapidly exclude O2 delivery, airway and breathing problems first.',
        steps: [
          '1. Immediate Actions - Recheck BP AND increase anesthesia AND reduce stimulus.',
          '2. Adequate Oxygen Delivery - Check FGF AND FiO2. Inspect breathing system.',
          '3. Airway - Position, noise, capnogram, patency.',
          '4. Breathing - Exclude hypoxia and hypercarbia. Chest, SpO2, VTexp, EtCO2.',
          '5. Circulation - Rate, rhythm, perfusion. Increase BP check frequency. Check cuff size/position. Consider intra-arterial monitoring.',
          '6. Depth - Ensure adequate anesthesia and analgesia.',
          '7. Consider underlying problems: inadequate anesthesia/analgesia, drug error, omitted antihypertensives, distended bladder, surgical tourniquet, fluid overload, phaeochromocytoma, raised ICP, thyrotoxicosis.',
          '8. Call for help and consider temporising drug.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'TEMPORISING DRUGS:',
            lines: [
              'Alfentanil 10 ug.kg-1 (adult 0.5-1 mg) | Propofol 1 mg.kg-1 (adult 50-100 mg)',
              'Labetalol 0.5 mg.kg-1 (adult 25-50 mg) | Esmolol 0.5 mg.kg-1 (adult 25-50 mg)',
              'Hydralazine 0.1 mg.kg-1 (adult 5-10 mg) | GTN 0.5-5 ug.kg.min-1 infusion',
            ],
          },
        ],
      },
      {
        key: 'qrh-brady',
        title: '2-6 Bradycardia',
        icon: 'heart',
        intro:
          'Do not treat as an isolated variable - tailor treatment to the patient and situation. Follow full steps to exclude a serious underlying problem.',
        steps: [
          '1. Immediate Action - Stop any stimulus. Check pulse, rhythm and BP.',
          'If NO pulse, OR not sinus bradycardia, OR severe hypotension - Atropine 20 ug.kg-1 (adult 0.5-1 mg) with fluid flush; if no pulse -> start compressions -> 2-1.',
          'If pulse present AND sinus bradycardia - use drug box below.',
          '2. Adequate Oxygen Delivery - Check FGF AND FiO2. Inspect breathing system.',
          '3. Airway - Position, noise, capnogram, patency.',
          '4. Breathing - Chest, SpO2, VTexp, EtCO2.',
          '5. Circulation - Rhythm, perfusion, BP. Consider: high vagal tone (surgical stimulation), drug-induced, high spinal/epidural, cardiac ischaemia (->3-12), hypoxia (->2-2), anaphylaxis (->3-1).',
          '6. Depth - Correct depth and analgesia.',
          '7. Call for help if not resolving. Consider external pacing.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUGS FOR BRADYCARDIA:',
            lines: [
              'Glycopyrrolate 5 ug.kg-1 (adult 200-400 ug)',
              'Ephedrine 100 ug.kg-1 (adult 3-12 mg)',
              'Atropine 10 ug.kg-1 (adult 500-1000 ug)',
              'Isoprenaline 0.5 ug.kg.min-1 (adult 5 ug.min-1)',
            ],
          },
        ],
      },
      {
        key: 'qrh-tachy',
        title: '2-7 Tachycardia',
        icon: 'bolt',
        intro:
          'Do not treat as an isolated variable - identify and treat the underlying cause.',
        steps: [
          '1. Immediate Action - If NO pulse -> 2-1 Cardiac Arrest. Check rhythm and BP.',
          '2. Adequate Oxygen Delivery - Check FGF AND FiO2. Inspect breathing system.',
          '3. Airway - Position, noise, capnogram, patency.',
          '4. Breathing - Chest, SpO2, VTexp, EtCO2. Exclude hypoxia and hypercarbia as causes.',
          '5. Circulation - Rhythm, perfusion, BP.',
          'If sinus tachycardia - treat underlying cause (hypovolaemia, hypoxia, pain, light anesthesia, pyrexia).',
          'If broad complex - consider VT. Treat as per ALS guidelines. If haemodynamically unstable -> synchronised DC cardioversion.',
          'If narrow complex - consider AF, SVT. Consider adenosine, verapamil, or synchronised DC cardioversion if unstable.',
          '6. Depth - Correct depth and analgesia.',
          '7. Consider: anaphylaxis (->3-1), MH (->3-8), sepsis (->3-14), LA toxicity (->3-10), thyrotoxicosis, phaeochromocytoma.',
          '8. Call for help. Obtain 12-lead ECG. DC cardioversion: start 1 J.kg-1 (adult 50-100 J) biphasic.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DC CARDIOVERSION (synchronised):',
            lines: [
              'Start 1 J.kg-1 (adult 50-100 J) biphasic.',
              'Remember to hold shock button until sync shock delivered.',
            ],
          },
        ],
      },
      {
        key: 'qrh-hyperthermia',
        title: '2-8 Peri-operative Hyperthermia',
        icon: 'thermometer-full',
        intro:
          'If prolonged or >=39C - this is a clinical emergency: permanent organ dysfunction and death can result. Distinguish between excessive heating, inadequate heat dissipation, excessive heat production, and actively maintained fever.',
        steps: [
          '1. Call for help. Inform theatre team. Measure and record core temperature.',
          '2. Remove cause of hyperthermia including any insulation and heating devices.',
          '3. Make an initial diagnosis: actively maintained fever (cold peripheries, vasoconstricted) OR non-febrile hyperthermia (warm peripheries, vasodilated). Suspect MH or neuroleptic malignant syndrome? (->3-8).',
          '4. Start active cooling WITH CAUTION if >=39C (stop once below):',
          'Reduce OR ambient temperature.',
          'Cooling jackets or blankets.',
          'Ice packing in groin, axillae and anterior neck.',
          'Bladder, gastric or peritoneal lavage with 10 ml.kg-1 iced water boluses.',
          '5. Give benzodiazepines to treat shivering. Consider tracheal intubation and muscle paralysis if >=40C.',
          '6. If fever - give antipyretics (paracetamol) and treat underlying cause.',
          '7. Give chlorpromazine (Largactil) 25-50 mg IM 6-8 hourly if serotonin syndrome suspected. Caution in elderly.',
          '8. Monitor and manage life-threatening complications: hyperkalaemia, hypoglycaemia, acidosis, hypotension (->2-4), malignant hypertension, convulsions, coagulopathy/DIC.',
        ],
        panels: [
          {
            tone: 'yellow',
            title: 'Common Causes:',
            lines: [
              'Excessive insulation/ambient temp/warming devices (most common) · Sepsis (->3-14) · Blood transfusion · Anaphylaxis (->3-1) · Neuroleptic malignant syndrome · MH crisis (late sign, ->3-8)',
              'Serotonin syndrome · Anticholinergic syndrome · Thyrotoxicosis · Phaeochromocytoma',
            ],
          },
        ],
      },
    ],
  },
  {
    key: 's3',
    badge: 'Section 3',
    title: 'Knowns',
    color: '#92400e',
    subtitle: 'Crisis where a known or suspected event requires treatment',
    cards: [
      {
        key: 'qrh-ana',
        title: '3-1 Anaphylaxis',
        icon: 'allergies',
        intro:
          'Signs: unexplained hypotension · unexplained bronchospasm · unexplained tachy/bradycardia · angioedema · unexpected cardiac arrest · cutaneous flushing (often absent in severe cases).',
        steps: [
          '1. Call for help. Note the time. Stop/do not start non-essential surgery.',
          '2. Call for cardiac arrest trolley, anaphylaxis treatment pack and investigation pack.',
          '3. Remove all potential causative agents and maintain anesthesia. Important culprits: antibiotics, neuromuscular blocking agents, patent blue, chlorhexidine, IV colloids. Change to inhalational anesthetic if not already.',
          '4. Give 100% oxygen and ensure adequate ventilation. Maintain airway; if necessary secure with TT.',
          "5. Elevate patient's legs if hypotension.",
          '6. If SBP <50 mmHg or cardiac arrest - start CPR immediately -> 2-1.',
          '7. Give adrenaline bolus and repeat as necessary. Consider adrenaline infusion after 3 boluses. If hypotension resistant -> metaraminol/noradrenaline infusion +/- vasopressin. Give glucagon if beta-blocked and unresponsive to adrenaline. Hydrocortisone and chlorphenamine are no longer part of acute treatment (can consider for refractory reactions or skin symptoms).',
          '8. Give rapid IV crystalloid: 20 ml.kg-1 initial bolus, repeated until hypotension resolved.',
          '9. If bronchospasm persists -> 3-4.',
          '10. Take 5-10 ml clotted blood for serum tryptase as soon as stable. Plan repeat at 1-2 h and >24 h.',
          '11. Plan transfer to critical care. Note follow-up tasks.',
          '12. Prevent re-administration of possible triggers (allergy band, annotate notes).',
        ],
        panels: [
          {
            tone: 'red',
            title: 'ADRENALINE DOSES:',
            lines: [
              'Adult IV: 50 ug (0.5 ml of 1:10,000)',
              'Adult IM: 0.5 mg (0.5 ml of 1:1,000)',
              'Paediatric IV: 1 ug.kg-1 (0.1 ml.kg-1 of 1:100,000)',
              'Adult infusion: 3 mg in 50 ml saline, start 3 ml.h-1, max 40 ml.h-1',
              'Glucagon (adult): 1 mg IV, repeat as necessary',
              'Vasopressin (adult): 2 units IV, repeat as necessary',
            ],
          },
          {
            tone: 'yellow',
            title: "DON'T FORGET:",
            lines: [
              'Repeat serum tryptase at 1-2 h and >24 h.',
              'Inform patient, surgeon and GP.',
              'Report to MHRA (yellowcard.mhra.gov.uk).',
              'Refer to allergy/immunology centre (bsaci.org).',
            ],
          },
        ],
      },
      {
        key: 'qrh-mbl',
        title: '3-2 Massive Blood Loss',
        icon: 'tint',
        intro: 'Expected or unexpected major haemorrhage.',
        steps: [
          '1. Call for help, inform theatre team, note the time.',
          '2. Increase FiO2. Consider cautiously reducing inhalational/IV anesthetics.',
          '3. Check and expose intravenous access.',
          '4. Control any obvious bleeding (pressure, uterotonics, tourniquet, haemostatic dressings).',
          '5. Call blood bank (assign one person to liaise). Activate major haemorrhage protocol. Communicate speed required and volume needed.',
          '6. Begin active patient warming.',
          '7. Use rapid infusion and fluid warming equipment.',
          '8. Discuss management plan between surgical, anesthetic and nursing teams. Liaise with haematologist if needed. Consider interventional radiology and cell salvage.',
          '9. Monitor: point-of-care testing (Hb, lactate, coagulation). Lab testing including calcium and fibrinogen.',
          '10. Replace calcium and consider tranexamic acid.',
          '11. If bleeding continues - consider recombinant factor VIIa: liaise with haematologist.',
          '12. Plan ongoing care in appropriate clinical area.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'TRANSFUSION GOALS:',
            lines: [
              'Hb >80 g.l-1 · Platelets >75×10^9.l-1',
              'PT and APTT <1.5×mean control (FFP)',
              'Fibrinogen >1.0 g.l-1 (cryoprecipitate)',
              'Avoid DIC: maintain BP, prevent acidosis, avoid hypothermia, treat hypocalcaemia/hyperkalaemia',
            ],
          },
          {
            tone: 'blue',
            title: 'DRUG DOSES:',
            lines: [
              'Calcium chloride 10%: adult 10 ml IV · child 0.2 ml.kg-1 IV',
              'Calcium gluconate 10%: adult 20 ml IV · child 0.5 ml.kg-1 IV',
              'Tranexamic acid: adult 1 g IV bolus then 1 g over 8 h (non-obstetric) or repeat 1 g at 30 min (obstetric)',
              'Child: 15 mg.kg-1 bolus then 2 mg.kg-1.h-1',
            ],
          },
        ],
      },
      {
        key: 'qrh-cico',
        title: "3-3 Can't Intubate, Can't Oxygenate (CICO)",
        icon: 'ban',
        intro:
          'Last resort when all other attempts to oxygenate have failed. Cardiac arrest -> 2-1.',
        steps: [
          '1. Check optimal airway management in place and maintain anesthesia. Supply 100% O2 by tightly fitting facemask, supraglottic airway or nasal high-flow.',
          '2. Consider ONE final attempt at rescue oxygenation via upper airway if not already done.',
          '3. Declare CICO and call for help (additional staff and surgical airway expertise - ENT, ICU).',
          '4. Call for airway rescue trolley then cardiac arrest trolley.',
          '5. Give neuromuscular blocking drug NOW.',
          '6. Prepare for Front of Neck Access (FoNA).',
          '7. Check patient positioned with full neck extension.',
          "8. Operator position: right-handed -> patient's left side; left-handed -> patient's right side.",
          "9. Perform 'laryngeal handshake' to identify laryngeal anatomy.",
          '10. Perform FoNA via cricothyroid membrane - scalpel-bougie-tube technique.',
          '11. Secure tube, continue to oxygenate, ensure adequate depth of anesthesia.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'FoNA EQUIPMENT (Airway Rescue Trolley):',
            lines: [
              'Scalpel with number 10 blade',
              'Bougie with coudé (angled) tip',
              'Tracheal tube, cuffed, 6 mm',
              '',
              'STAB-TWIST-BOUGIE-TUBE:',
              '1. Identify cricothyroid membrane',
              '2. Single transverse incision through skin and membrane',
              '3. Rotate scalpel 90° with sharp edge caudally',
              '4. Slide angled tip of bougie past scalpel into trachea',
              '5. Railroad tube over bougie',
            ],
          },
          {
            tone: 'gray',
            title: 'IF CRICOTHYROID MEMBRANE NOT FOUND:',
            lines: [
              'Scalpel-Finger-Bougie technique:',
              '1. Make 8-10 cm vertical incision (head-to-toe orientation)',
              '2. Blunt dissection to retract tissue and identify trachea',
              '3. Stabilise trachea and proceed through cricothyroid membrane as above',
            ],
          },
        ],
      },
      {
        key: 'qrh-bronch',
        title: '3-4 Bronchospasm',
        icon: 'wind',
        intro:
          'Signs: expiratory wheeze, prolonged expiration, increased inflation pressures, desaturation, hypercapnia, upsloping capnograph, silent chest. Can occur alone or as part of another problem.',
        steps: [
          '1. Call for help and inform theatre team.',
          '2. Give 100% oxygen.',
          '3. Stop surgery/other stimulation.',
          '4. Fully expose chest: inspect, percuss, palpate, auscultate. Absence of wheeze may indicate severe bronchospasm with no air movement.',
          '5. Deepen anesthesia. Inhalational agents are bronchodilators. Avoid isoflurane/desflurane if possible - airway irritants if increased rapidly.',
          '6. Exclude mimics: mispositioned/occluded airway device, endobronchial or oesophageal intubation, occluded breathing system hoses, pulmonary oedema, ARDS, laryngospasm, pneumothorax.',
          '7. Consider anaphylaxis - if suspected -> 3-1.',
          '8. Treat bronchospasm: first line salbutamol by MDI or nebuliser (remove HME filter or nebulise downstream); IV is second line.',
          '9. If airway soiling/aspiration suspected: consider tracheal intubation and tracheal toilet. Use NG tube to aspirate gastric contents.',
          '10. Use appropriate ventilation strategy: increase expiratory time, pressure control, avoid breath stacking, permissive hypercapnia.',
          '11. If raised airway pressure/desaturation persists -> 2-2.',
          '12. Obtain CXR when clinically safe. Plan appropriate post-procedure care.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUG DOSES:',
            lines: [
              'Salbutamol Neb: adult/>5yr 5 mg, child <5yr 2.5 mg · IV bolus: adult 250 ug · IV infusion: adult 5-20 ug.min-1',
              'Ipratropium Neb: adult 0.5 mg, 2-12yr 0.25 mg',
              'Adrenaline Neb: adult 5 ml of 1:1,000 · IM: adult 500 ug',
              'Slow IV: 0.1-1 ug.kg-1',
              'Magnesium 50 mg.kg-1 IV over 20 min (adult 2 g)',
              'Ketamine bolus adult 20 mg · Hydrocortisone 4 mg.kg-1 (adult 200 mg)',
              'Aminophylline 5 mg.kg-1 IV over 20 min (omit if on theophylline); infusion adult 0.5 mg.kg-1.h-1',
            ],
          },
        ],
      },
      {
        key: 'qrh-embolus',
        title: '3-5 Circulatory Embolus',
        icon: 'circle-notch',
        intro:
          'Causes: thrombus, fat, amniotic fluid, air/gas. Signs: hypotension, tachycardia, hypoxaemia, decreased EtCO2. Consider if sudden unexplained loss of cardiac output.',
        steps: [
          '1. Call for help and inform theatre team. Note the time.',
          '2. Call for cardiac arrest trolley.',
          '3. Stop all potential triggers. Stop surgery.',
          '4. Give 100% O2 and ensure adequate ventilation. Maintain/secure airway.',
          '5. If indicated start CPR immediately - CPR can help disperse air emboli and large thrombi.',
          '6. Give IV crystalloid at high rate (adult 500-1,000 ml, child 20 ml.kg-1). Inotropes may be required.',
          '7. Treat according to suspected embolus type.',
          '8. Investigations: ABG (increased PaCO2-EtCO2 gradient), TOE, CT.',
          '9. If refractory cardiovascular collapse - consider ECMO or intra-aortic balloon counter-pulsation.',
          '10. Plan transfer to appropriate critical care area.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'THROMBOEMBOLISM:',
            lines: [
              'Alteplase 10 mg IV then 90 mg over 2 h (>65 kg). Consider surgical or percutaneous removal.',
              '',
              'AIR/GAS EMBOLISM: Discontinue source of air/gas and N2O. Flood wound with saline. Lower surgical field below level of heart. Place patient in left lateral position. Aspirate air via central venous catheter. Volume loading and Valsalva.',
            ],
          },
          {
            tone: 'gray',
            title: 'FAT EMBOLISM:',
            lines: [
              'Petechial rash, desaturation, confusion. Supportive measures.',
              '',
              'AMNIOTIC FLUID EMBOLISM: Supportive measures. Monitor fetus. Treat coagulopathy (FFP, cryoprecipitate, platelets). Consider plasmapheresis.',
              '',
              'Alternative diagnoses: Pneumothorax, hypovolaemia, bronchospasm (->3-4), pulmonary oedema, sepsis (->3-14), anaphylaxis (->3-1), bone cement implantation syndrome.',
            ],
          },
        ],
      },
      {
        key: 'qrh-laryngo',
        title: '3-6 Laryngospasm and Stridor',
        icon: 'comment-slash',
        intro:
          'Laryngospasm usually occurs when a patient is in a light plane of anesthesia and their airway is stimulated. Stridor is a sign associated with laryngospasm (but can have other causes). A correctly positioned tracheal tube rules out laryngospasm.',
        steps: [
          '1. Call for help and inform theatre team.',
          '2. Perform jaw thrust and stop any other stimulation.',
          '3. Remove airway devices and anything that may be stimulating or obstructing - suction catheters, blood, vomit (direct visualisation and suction if in doubt).',
          '4. Give CPAP with 100% O2 and face mask. Avoid over-vigorous inflation (stomach inflation). Insert oro/nasopharyngeal airway if unsure airway is clear above larynx.',
          '5. If problem persists: continue CPAP, deepen anesthesia, give neuromuscular blocker.',
          '6. Consider tracheal intubation particularly if likely to recur.',
          '7. Use NG tube to decompress the stomach.',
          '8. Consider other causes: foreign body, infection, anaphylaxis, sub-glottic stenosis, tumour, vocal cord paralysis.',
          '9. Consider whether 2-3 Increased Airway Pressure may help.',
          '10. Consider appropriate strategy/location/support for waking the patient.',
          '11. Continued airway support may be necessary if aspiration or negative-pressure pulmonary oedema has occurred.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUG DOSES (0.25-0.5 mg.kg-1 IV):',
            lines: [
              'Propofol · Rocuronium · Atracurium · Suxamethonium (also IM including tongue: 4.0 mg.kg-1)',
            ],
          },
        ],
      },
      {
        key: 'qrh-fire',
        title: '3-7 Patient Fire',
        icon: 'fire',
        intro:
          "Evidence of fire (smoke, heat, odour, flash, flame) on patient, drapes, or in patient's airway.",
        steps: [
          '1. Call for help, inform theatre team. Activate fire alarm. Dial hospital fire emergency number and report location and nature of fire. Bring CO2 extinguisher into theatre.',
          '4. Assess patient and devise ongoing management plan. Confirm no secondary fire. Consider intensive care.',
          '5. Keep involved materials/devices for inspection and report to MHRA.',
          '6. If secondary non-patient fire or smoke/fire risk to staff - follow local fire procedures.',
        ],
        panels: [
          {
            tone: 'red',
            title: 'AIRWAY FIRE:',
            lines: [
              '2 Stop laser/diathermy. Discontinue ventilation AND fresh gas flow. Remove TT if on fire. Remove flammable material from airway. Flood airway with 0.9% saline.',
              '3 After extinguished: Re-establish ventilation. Minimise O2, avoid N2O. Check airway for damage and debris. Consider bronchoscopy. Re-intubate.',
            ],
          },
          {
            tone: 'yellow',
            title: 'NON-AIRWAY FIRE:',
            lines: [
              '2 Stop laser/diathermy. Remove all drapes and burning material. Flood fire with 0.9% saline or saline-soaked gauze. Use CO2 extinguisher.',
              '3 After extinguished: Re-establish ventilation. Minimise O2, avoid N2O. Assess damage. Consider inhalational injury. Consider intubation depending on degree of injury.',
            ],
          },
        ],
      },
      {
        key: 'qrh-mh',
        title: '3-8 Malignant Hyperthermia Crisis',
        icon: 'temperature-high',
        intro:
          'Unexplained increase in EtCO2 AND tachycardia AND increased O2 consumption. Temperature rise is a late sign. MH is rare - always consider other causes of hyperthermia first (->2-8). UK MH Emergency Hotline: 07947 609601 or 0113 243 3144.',
        alert:
          'START. Delegate 6, 7 and 8 to be performed SIMULTANEOUSLY.',
        steps: [
          '1. Call for help and inform theatre team. Note the time.',
          '2. Aim to abandon or finish surgery as soon as possible.',
          '3. Call for MH treatment pack/dantrolene and cardiac arrest trolley.',
          '4. Maintain anesthesia with TIVA. Neuromuscular block with non-depolarising drug.',
          '5. Allocate enough team members to perform 6, 7 and 8 simultaneously.',
          '6. Eliminate trigger drug: Turn off vaporisers and remove from workstation. Set FGF to 100% O2 maximum flow. Hyperventilate (2-3x normal minute volume). Place activated charcoal filters on both limbs of breathing circuit. Change soda lime and circuit when feasible.',
          '7. Give dantrolene: 2-3 mg.kg-1 immediate IV bolus (adult ~200 mg). Repeat 1 mg.kg-1 every 5 min until EtCO2 <6 kPa and temp <38.5C. Pause and observe; repeat to maintain goals. Continue for 24-48 h post-crisis.',
          '8. Active cooling: IV cold saline boluses · surface cooling · consider cold lavage if severe. Target temperature <38.5C.',
          '9. Monitor and treat complications: hyperkalaemia (dextrose/insulin/calcium) · myoglobinuria (forced alkaline diuresis - urine pH >7, UOP >2 ml.kg-1) · DIC (FFP, cryoprecipitate, platelets) · tachyarrhythmias (amiodarone, beta-blockers). AVOID calcium channel blockers.',
          '10. Plan transfer to ICU for continued monitoring at least 24-48 h.',
        ],
        panels: [
          {
            tone: 'yellow',
            title: 'AVOID:',
            lines: [
              'Volatile anesthetics · Suxamethonium',
              'Calcium channel blockers (interaction with dantrolene)',
            ],
          },
        ],
      },
      {
        key: 'qrh-tamponade',
        title: '3-9 Cardiac Tamponade',
        icon: 'heart',
        intro:
          'Caused by accumulation of blood, pus, effusion fluid or air. Most common in cardiothoracic surgery, trauma or iatrogenic causes (e.g. central line placement).',
        steps: [
          '1. Call for help and inform clinical team. Note the time.',
          '2. If indicated, start CPR immediately.',
          '3. Give 100% O2, ventilate, exclude tension pneumothorax. Maintain/secure airway.',
          '4. Rapid diagnosis and rapid drainage are vital. Call for: ultrasound machine · pericardiocentesis kit (18G spinal needle + 3-way tap + 20 ml syringe or purpose-made kit) · cardiac arrest trolley.',
          '5. Consider whether time allows waiting for an expert in pericardiocentesis, or whether thoracotomy is better.',
          '6. Temporising measures: fluid bolus (adult 500-1,000 ml; child 20 ml.kg-1) · inotropic drugs · low TV/low-no PEEP ventilation strategy.',
          '7. If clinically indicated - perform pericardiocentesis (sub-xiphoid approach, ultrasound-guided preferred).',
          '8. After pericardiocentesis - reassess with ultrasound and vital signs.',
          '9. Reassess continually in case tamponade recurs.',
          '10. Plan definitive management of underlying cause including specialist referral.',
          '11. Plan transfer to appropriate critical care area.',
        ],
        panels: [
          {
            tone: 'yellow',
            title: "Beck's Triad:",
            lines: [
              'Jugular venous distension · Muffled heart sounds · Hypotension.',
              'Other: pulsus paradoxus · ECG low-voltage QRS/electrical alternans/PEA · Enlarged cardiac silhouette on CXR.',
              'Ultrasound diagnosis is preferred.',
            ],
          },
          {
            tone: 'gray',
            title: 'PERICARDIOCENTESIS (sub-xiphoid):',
            lines: [
              'Identify tip of xiphoid. Prep and drape. Infiltrate LA.',
              'Use ultrasound to identify pericardial fluid.',
              'Insert needle immediately left of xiphoid tip, directed toward left shoulder.',
              'Attach 3-way tap and 20 ml syringe. Aspirate - a small volume may cause dramatic clinical improvement.',
              'CONTRAINDICATIONS: myocardial rupture, aortic dissection, severe bleeding disorder.',
            ],
          },
        ],
      },
      {
        key: 'qrh-last',
        title: '3-10 Local Anesthetic Toxicity',
        icon: 'syringe',
        intro:
          'Signs of severe toxicity: sudden altered mental status/severe agitation/loss of consciousness ± tonic-clonic convulsions · cardiovascular collapse: sinus bradycardia, conduction blocks, asystole, VT. May occur some time after initial injection.',
        steps: [
          '1. Stop injecting local anesthetic (remember infusion pumps).',
          '2. Call for help and inform immediate clinical team.',
          '3. Call for cardiac arrest trolley and lipid rescue pack.',
          '4. Give 100% O2 and ensure adequate lung ventilation. Maintain airway; if necessary secure with TT. Avoid hypercarbia - consider mild hyperventilation.',
          '5. Confirm or establish IV access.',
          '6. If circulatory arrest: Start CPR (->2-1) AND give IV lipid emulsion. Use smaller adrenaline dose (<=1 ug.kg-1 instead of 1 mg). Avoid vasopressin. Recovery may take >1 h. Consider CPB if available.',
          '7. If no circulatory arrest: conventional therapies for hypotension/arrhythmias. Consider lipid emulsion.',
          '8. Control seizures: small incremental benzodiazepine is drug of choice. Thiopental or propofol can be used (beware negative inotropy). Consider NMB if seizures uncontrolled.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'LIPID EMULSION REGIME (20% Intralipid - propofol is NOT a substitute):',
            lines: [
              'Immediately: IV bolus 1.5 ml.kg-1 over 2-3 min (~100 ml for 70 kg adult). Start infusion 15 ml.kg-1.h-1.',
              'At 5 and 10 min: Repeat same bolus if cardiovascular stability not restored or deteriorates.',
              'After 5 min: Double infusion to 30 ml.kg-1.h-1 if deteriorating.',
              'Max cumulative dose: 12 ml.kg-1 (70 kg adult = 840 ml)',
            ],
          },
        ],
      },
      {
        key: 'qrh-highblock',
        title: '3-11 High Central Neuraxial Block',
        icon: 'level-up-alt',
        intro:
          'Can occur with deliberate or accidental injection into subarachnoid space. Symptom sequence: hypotension and bradycardia -> difficulty breathing -> arm paralysis -> impaired consciousness -> apnoea and unconsciousness. Progression may be slow or fast.',
        steps: [
          '1. Reassure the patient - they may be fully aware. Plan to ensure hypnosis as soon as clinical situation permits.',
          '2. Call for help and inform theatre team.',
          '3. Treat airway and breathing: give 100% O2. Chin lift/jaw thrust may suffice. Consider supraglottic airway or tracheal intubation.',
          '4. Treat circulatory insufficiency: IV fluid by rapid infusion. Elevate legs - do NOT use head-down tilt. In obstetrics, relieve aorto-caval compression. Treat bradycardia (atropine/glycopyrrolate). Treat hypotension (metaraminol/phenylephrine/ephedrine). CPR may be necessary to circulate drugs.',
          '5. If obstetric - consider expedited delivery to manage risk of aorto-caval compression to mother and impaired feto-placental O2 delivery to fetus.',
          '6. Consider other causes: aorto-caval compression, LA toxicity, embolism, vasovagal, haemorrhage.',
          '7. Plan ongoing care in suitable location.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUGS FOR BRADYCARDIA:',
            lines: [
              'Atropine: 0.6-1.2 mg',
              'Glycopyrrolate: 0.2-0.4 mg',
            ],
          },
          {
            tone: 'blue',
            title: 'DRUGS FOR HYPOTENSION:',
            lines: [
              'Metaraminol: 1-2 mg boluses repeated',
              'Phenylephrine: 50-100 ug boluses or infusion',
              'Ephedrine: 6-12 mg boluses (max 30 mg - tachyphylaxis limits use)',
            ],
          },
        ],
      },
      {
        key: 'qrh-ischaemia',
        title: '3-12 Cardiac Ischaemia',
        icon: 'procedures',
        intro:
          'Signs (unconscious patient): ST elevation/depression · T wave flattening/inversion · arrhythmias · haemodynamic abnormalities · new regional wall motion abnormalities. Symptoms (conscious patient): chest pain, breathlessness, dizziness, nausea. High index of suspicion in patients with pre-existing cardiac history or risk factors.',
        steps: [
          '1. Call for cardiac arrest trolley and 12-lead ECG machine.',
          '2. Ensure adequate oxygenation and anesthesia/analgesia.',
          '3. Treat haemodynamic instability: cardiac arrest (->2-1) · hypotension (->2-4) · hypertension (->2-5) · bradycardia (->2-6) · tachycardia (->2-7).',
          '4. Apply CM5 continuous ECG monitoring. Obtain 12-lead ECG as soon as possible.',
          '5. If ischaemia does not resolve: call for help, inform team, stop/rapidly complete surgery. Start GTN (not if hypotensive). EXTREME CAUTION with GTN if hypotensive.',
          '6. Consider invasive arterial BP monitoring.',
          '7. Treat electrolyte abnormalities - particularly potassium, magnesium, calcium.',
          '8. Treat anaemia - target haematocrit >30%. Caution with volume overload especially in heart failure.',
          '9. If persistent ST elevation - consider anticoagulation, anti-platelet therapy and revascularisation in consultation with cardiology and surgical teams.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'GTN DOSE:',
            lines: [
              'Consider sublingual administration.',
              'IV: 1 mg.ml-1 solution - start at 0.1 ml.kg-1.h-1, titrate to response.',
              'NOT RECOMMENDED IN CHILDREN.',
            ],
          },
          {
            tone: 'gray',
            title: 'CM5 ECG CONFIGURATION:',
            lines: [
              'Right arm (red): upper right sternum',
              'Left arm (yellow): 5th intercostal space under left nipple',
              'Indifferent (green/black): left shoulder',
              '',
              'After event: Admit to critical care, consult cardiology, serial 12-lead ECGs and cardiac enzymes.',
            ],
          },
        ],
      },
      {
        key: 'qrh-neuro',
        title: '3-13 Neuroprotection Following Cardiac Arrest',
        icon: 'brain',
        intro:
          'Following ROSC - inability to obey commands indicates neuroprotection techniques should be considered. Outcome is determined by severity of neurological/cardiac dysfunction from poor vital organ perfusion.',
        steps: [
          '1. Prepare cardiac arrest trolley for any further events.',
          '2. Use positive pressure ventilation - target: SpO2 94-98% and PCO2 4.5-5.5 kPa.',
          '3. Give sedation and NMB drugs to reduce thermogenesis from shivering.',
          '4. Insert intra-arterial BP monitoring. Consider vasopressor/inotrope to maintain SBP >100 mmHg.',
          '5. Obtain 12-lead ECG and discuss with cardiology if PCI is possible or appropriate.',
          '6. Check blood glucose. Start glycaemic control if >10 mmol.l-1.',
          '7. Check core temperature. Target: constant temperature 32-36C (local policy). Usually decreases without intervention initially. Start cooling strategies if indicated. Avoid hyperthermia >37.5C.',
          '8. Give antiepileptic drugs if seizures develop.',
          '9. Plan further management in critical care area. Call for extra help as necessary.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'COOLING STRATEGIES:',
            lines: [
              'IV fluid bolus: 30 ml.kg-1 cold (4C) non-glucose-containing solutions.',
              'External: ice packs/wet towels, cooling blankets/pads, water-circulating pads.',
              'Internal: intravascular heat exchanger, CPB.',
            ],
          },
          {
            tone: 'blue',
            title: 'SEIZURE CONTROL:',
            lines: [
              'Benzodiazepines or propofol (likely closest to hand in theatre).',
              'Sodium valproate, levetiracetam, phenytoin or barbiturate also options.',
            ],
          },
        ],
      },
      {
        key: 'qrh-sepsis',
        title: '3-14 Sepsis',
        icon: 'shield-virus',
        intro:
          'Severe sepsis: hypotension persisting after initial fluid challenge of 30 ml.kg-1 OR blood lactate >=4 mmol.l-1 if infection most likely cause. Septic shock: sepsis with end organ dysfunction.',
        steps: [
          '1. Call for help and inform theatre team.',
          '2. Increase FiO2. Consider reducing anesthetic agent. Intubate patient.',
          '3. Give crystalloid IV: adult >=30 ml.kg-1 · child >=20 ml.kg-1. Continue fluid challenge if haemodynamic improvement. Do not use hydroxyethyl starches.',
          '4. Take bloods: ABG, lactate, FBC, U&Es, coagulation and cultures.',
          '5. Give empiric IV antimicrobials within 1 h (seek microbiology advice).',
          '6. Consider whether indwelling devices could have caused a septic shower.',
          '7. If not improving, proceed to next steps.',
          '8. Insert central and arterial access lines. Check serial lactates.',
          '9. Start noradrenaline to achieve MAP >=65 mmHg.',
          '10. Insert urinary catheter and record hourly urine output.',
          '11. Consider monitoring cardiac output to aid fluid and vasopressor therapy.',
          '12. Identify source of sepsis - consider source control and send source cultures (surgical site, urine, BAL).',
          '13. Discuss whether appropriate to abandon or limit surgery.',
          '14. Discuss ongoing management plan with ICU team.',
        ],
        panels: [
          {
            tone: 'blue',
            title: 'DRUG THERAPY:',
            lines: [
              'Noradrenaline - first choice vasopressor',
              'Adrenaline - add to noradrenaline when additional agent needed',
              'Vasopressin 0.03 units.min-1 - to increase MAP or reduce noradrenaline need',
              'Dobutamine up to 20 ug.kg-1.min-1 - if myocardial dysfunction or ongoing hypoperfusion despite adequate MAP',
              'Hydrocortisone - if unable to restore haemodynamic stability',
              '',
              'Paediatric goals: CRT <=2 s · normal BP for age · warm extremities · urine >1 ml.kg-1.h-1 · ScvO2 >70%',
            ],
          },
        ],
      },
    ],
  },
  {
    key: 's4',
    badge: 'Section 4',
    title: 'Other',
    color: '#374151',
    subtitle: 'Crisis external to but posing risk to the patient',
    cards: [
      {
        key: 'qrh-o2',
        title: '4-1 Mains Oxygen Failure',
        icon: 'exclamation-circle',
        intro:
          'Complete failure of wall or pendant O2 supply. Failure may be theatre-specific, zone-specific or hospital-wide.',
        steps: [
          '1. Inform theatre team and theatre coordinator.',
          '2. Call for help - be aware failure may be widespread.',
          '3. Switch to cylinder oxygen supply immediately.',
          '4. Check remaining cylinder content. Ensure at least one further cylinder always available.',
          '5. Prolong cylinder O2 supply: use circle system · lowest possible FGF · lowest possible FiO2 · check FiO2 alarms.',
          '6. Minimise auxiliary gas usage. If ventilator is gas-driven - switch to manual ventilation to prolong cylinder supply.',
          '7. Evaluate moving to nearby area if O2 supply there is preserved.',
          '8. Continue to monitor adequacy of inspired O2 and volatile agent.',
          '9. Workflow: do not start new cases unless clinical priority absolutely requires it. Expedite conclusion of current case. Consider recovering patient in theatre if recovery also affected.',
          '10. Disconnect from failed outlets. Do not reconnect until safe to do so - output may not initially be 100% O2 when re-established.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'CYLINDER REMAINING CONTENTS (approximate):',
            lines: [
              'Size E (full 680 L at 137 bar): 50% = 340 L · 25% = 170 L',
              'Size F (full 1360 L): 50% = 680 L · 25% = 340 L',
              'Size G (full 3400 L): 50% = 1700 L · 25% = 850 L',
            ],
          },
        ],
      },
      {
        key: 'qrh-power',
        title: '4-2 Mains Electricity Failure',
        icon: 'bolt',
        intro:
          'Unexpected total power failure is rare and unpredictable. Ability to safely deliver and maintain anesthesia is immediately compromised.',
        steps: [
          '1. Call for help - extra staff to monitor patient and source additional equipment.',
          '2. Liaise with local coordinator to activate appropriate local plan. If immediate evacuation necessary -> 4-3.',
          '3. Get additional light into theatre: open doors and blinds, hand torches, portable lights, mobile phones, laryngoscopes.',
          '4. Ensure ventilation continues: manual ventilation if required. Consider moving to spontaneous ventilation. Maintain anesthesia.',
          '5. Check pulse and blood pressure manually if monitors have failed.',
          '6. Check mains oxygen supply is intact. If failed -> 4-1.',
          '7. Unplug unnecessary equipment. Use correct socket for essential equipment (SPS = red; UPS = blue - use sparingly as supply is limited).',
          '8. Assess reliability of power supply, duration of surgery and patient condition: consider stopping surgery immediately, continuing until stable/wound closed, or evacuation to theatre with intact mains -> 4-3.',
          '9. Prepare recovery facilities.',
        ],
      },
      {
        key: 'qrh-evac',
        title: '4-3 Emergency Evacuation',
        icon: 'running',
        intro:
          'Anesthetized or sedated patient requires unplanned transfer because of environmental hazard (flood, fire, smoke, structural collapse, noxious gas).',
        steps: [
          '1. Consider if patient can be safely moved. If not - ensure adequate depth, adequate reserve (100% O2, low flow, fill vaporiser), adequate NMB if relevant. Evacuate all staff including anesthetist when indicated. Inform rescue services and theatre coordinator.',
          '2. Stop any operative procedure as soon as safe. Pack and cover wounds.',
          '3. Transfer patient to bed or trolley (operating table in extremis).',
          '4. Evacuate non-essential staff. Consider calling for help - be aware their own safety may preclude attendance.',
          '5. Airway: consider tracheal intubation for improved airway security if time allows.',
          '6. Breathing/ventilation: minimise O2 usage (lowest flows possible). Self-inflating bag +/- supplemental O2. Mechanical ventilator or C-circuit require higher flows.',
          '7. Circulation: ensure adequacy and security of IV access. Take adequate supplies of fluid +/- infusion sets. Take vasopressor(s) and/or resuscitation drug box.',
          '8. Maintenance of anesthesia: intermittent bolus propofol is simplest and quickest.',
        ],
        panels: [
          {
            tone: 'gray',
            title: 'DRUGS TO TAKE:',
            lines: [
              'O2 · Propofol/hypnotic · Neuromuscular blockade · Vasopressor(s) · Analgesics · IV fluids · Neuromuscular reversal if extubation anticipated',
              '',
              'MUSTER POINT: Anesthetized patient -> area with appropriate access to O2 and medications (theatre, recovery or critical care in safe zone).',
            ],
          },
        ],
      },
    ],
  },
];

function ProtocolSteps({ title, steps }) {
  const renderStepLine = (line, idxPrefix) => {
    const text = String(line);
    const parts = String(line).split('**');
    if (parts.length === 1) {
      const dashMatch = text.match(/^(\d+\.\s+[^:]{1,80}?)\s[-–—]\s(.+)$/);
      if (dashMatch) {
        return (
          <Text key={idxPrefix} style={styles.protocolStep}>
            <Text style={styles.protocolStepBold}>{dashMatch[1]} - </Text>
            <Text>{dashMatch[2]}</Text>
          </Text>
        );
      }
      const colonIndex = text.indexOf(':');
      if (colonIndex > 0 && colonIndex < 40) {
        const lead = text.slice(0, colonIndex + 1);
        const tail = text.slice(colonIndex + 1);
        return (
          <Text key={idxPrefix} style={styles.protocolStep}>
            <Text style={styles.protocolStepBold}>{lead}</Text>
            <Text>{tail}</Text>
          </Text>
        );
      }
    }
    return (
      <Text key={idxPrefix} style={styles.protocolStep}>
        {parts.map((part, i) => (
          <Text key={`${idxPrefix}-${i}`} style={i % 2 === 1 ? styles.protocolStepBold : null}>
            {part}
          </Text>
        ))}
      </Text>
    );
  };

  return (
    <View style={styles.protocolBox}>
      <Text style={styles.protocolTitle}>{title}</Text>
      {steps.map((s, i) => renderStepLine(s, i))}
    </View>
  );
}

export default function EmergencyScreen() {
  const [patientWeight, setPatientWeight] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('male');

  const [mhWeight, setMhWeight] = useState('');
  const [mhResult, setMhResult] = useState(null);

  const [lastWeight, setLastWeight] = useState('');
  const [lastResult, setLastResult] = useState(null);

  const [anaWeight, setAnaWeight] = useState('');
  const [anaAge, setAnaAge] = useState('adult');
  const [anaResult, setAnaResult] = useState(null);

  const [activeCard, setActiveCard] = useState(null);
  const [aclsRhythm, setAclsRhythm] = useState('vfvt');
  const [aclsWeight, setAclsWeight] = useState('70');
  const [aclsResult, setAclsResult] = useState(null);
  const [anaQrhWeight, setAnaQrhWeight] = useState('70');
  const [anaQrhAge, setAnaQrhAge] = useState('adult');
  const [anaQrhResult, setAnaQrhResult] = useState(null);
  const [mhQrhWeight, setMhQrhWeight] = useState('70');
  const [mhQrhResult, setMhQrhResult] = useState(null);
  const [lastQrhWeight, setLastQrhWeight] = useState('70');
  const [lastQrhResult, setLastQrhResult] = useState(null);

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  return (
    <ScreenWrapper title="Emergency & Crisis Management" subtitle="Association of Anesthetists — Quick Reference Handbook (QRH) June 2023">
      <View style={styles.alertBox}>
        <View style={styles.alertRow}>
          <FontAwesome5 name="exclamation-triangle" size={14} color="#721c24" style={styles.alertIcon} />
          <Text style={styles.alertText}>
            <Text style={styles.alertStrong}>Emergency Use Only: </Text>
            Always apply clinical judgement. These guidelines do not replace individual clinical assessment. Source: anesthetists.org/QRH.
          </Text>
        </View>
      </View>

      <View style={styles.patientCard}>
        <View style={styles.patientHeader}>
          <View style={styles.patientHeaderRow}>
            <FontAwesome5 name="user" size={14} color={COLORS.white} style={styles.patientHeaderIcon} />
            <Text style={styles.patientHeaderText}>Patient Information</Text>
          </View>
        </View>
        <View style={styles.patientBody}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={patientWeight} onChangeText={setPatientWeight} />

          <Text style={styles.label}>Age (years)</Text>
          <TextInput style={styles.input} keyboardType="number-pad" placeholder="45" value={patientAge} onChangeText={setPatientAge} />

          <PickerSelect
            label="Gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            selected={patientGender}
            onSelect={setPatientGender}
          />
        </View>
      </View>

      <CollapsibleCard title="Malignant Hyperthermia Protocol" icon="fire" open={activeCard === 'mh'} onToggle={(nextOpen) => toggleCard('mh', nextOpen)}>
        <View style={[styles.sectionAlert, styles.sectionAlertDanger]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextDanger]}>MALIGNANT HYPERTHERMIA EMERGENCY</Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={mhWeight} onChangeText={setMhWeight} />
        <CalcButton title="Calculate Dantrolene Dosing" color={COLORS.danger} onPress={() => setMhResult(Calc.calculateDantrolenes(mhWeight))} />
        {mhResult && <ResultDisplay result={mhResult.text} type={mhResult.type} />}
        <ProtocolSteps title="Immediate Actions:" steps={protocolSteps.mh} />
      </CollapsibleCard>

      <CollapsibleCard title="LAST Protocol (Lipid Rescue)" icon="syringe" open={activeCard === 'last'} onToggle={(nextOpen) => toggleCard('last', nextOpen)}>
        <View style={[styles.sectionAlert, styles.sectionAlertWarning]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextWarning]}>LOCAL ANAESTHETIC SYSTEMIC TOXICITY</Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={lastWeight} onChangeText={setLastWeight} />
        <CalcButton title="Calculate Lipid Rescue Dosing" color="#d39e00" onPress={() => setLastResult(Calc.calculateLipidRescue(lastWeight))} />
        {lastResult && <ResultDisplay result={lastResult.text} type={lastResult.type} />}
        <ProtocolSteps title="LAST Treatment Protocol:" steps={protocolSteps.last} />
      </CollapsibleCard>

      <CollapsibleCard title="Anaphylaxis Management" icon="allergies" open={activeCard === 'anaphylaxis'} onToggle={(nextOpen) => toggleCard('anaphylaxis', nextOpen)}>
        <View style={[styles.sectionAlert, styles.sectionAlertDanger]}>
          <Text style={[styles.sectionAlertText, styles.sectionAlertTextDanger]}>ANAPHYLAXIS EMERGENCY</Text>
        </View>
        <Text style={styles.label}>Patient Weight (kg)</Text>
        <TextInput style={styles.input} keyboardType="decimal-pad" placeholder="70" value={anaWeight} onChangeText={setAnaWeight} />
        <PickerSelect label="Age Group" options={[
          { value: 'adult', label: 'Adult (>12 years)' },
          { value: 'child', label: 'Child (6mo - 12yr)' },
          { value: 'infant', label: 'Infant (<6 months)' },
        ]} selected={anaAge} onSelect={setAnaAge} />
        <CalcButton title="Calculate Emergency Doses" color={COLORS.danger} onPress={() => setAnaResult(Calc.calculateAnaphylaxis(anaWeight, anaAge))} />
        {anaResult && <ResultDisplay result={anaResult.text} type={anaResult.type} />}
        <ProtocolSteps title="Anaphylaxis Treatment Protocol:" steps={protocolSteps.anaphylaxis} />
      </CollapsibleCard>

      {qrhSections.map((section) => (
        <View key={section.key} style={styles.qrhSectionWrap}>
          <View style={styles.qrhSectionHeader}>
            <View style={[styles.qrhSectionBadge, { backgroundColor: section.color }]}>
              <Text style={styles.qrhSectionBadgeText}>{section.badge}</Text>
            </View>
            <View style={styles.qrhSectionTextWrap}>
              <Text style={[styles.qrhSectionTitle, { color: section.color }]}>{section.title}</Text>
              <Text style={styles.qrhSectionSubtitle}>{section.subtitle}</Text>
            </View>
          </View>

          {section.cards.map((card) => (
            <CollapsibleCard
              key={card.key}
              title={card.title}
              icon={card.icon}
              open={activeCard === card.key}
              onToggle={(nextOpen) => toggleCard(card.key, nextOpen)}
            >
              {card.intro ? <Text style={styles.qrhIntro}>{card.intro}</Text> : null}
              {card.alert ? <Text style={styles.qrhWarning}>{card.alert}</Text> : null}
              <ProtocolSteps title="Key Steps:" steps={card.steps} />
              {card.panels ? (
                <View style={styles.qrhPanelsWrap}>
                  {card.panels.map((panel, idx) => (
                    <View
                      key={`${card.key}-panel-${idx}`}
                      style={[
                        styles.qrhPanel,
                        panel.tone === 'blue' && styles.qrhPanelBlue,
                        panel.tone === 'green' && styles.qrhPanelGreen,
                        panel.tone === 'gray' && styles.qrhPanelGray,
                        panel.tone === 'yellow' && styles.qrhPanelYellow,
                        panel.tone === 'red' && styles.qrhPanelRed,
                      ]}
                    >
                      <Text style={styles.qrhPanelTitle}>{panel.title}</Text>
                      {panel.lines.map((line, li) => (
                        <Text key={`${card.key}-panel-${idx}-line-${li}`} style={styles.qrhPanelLine}>
                          {line}
                        </Text>
                      ))}
                    </View>
                  ))}
                </View>
              ) : null}
              {card.key === 'qrh-ca' ? (
                <View style={styles.calcCard}>
                  <Text style={styles.calcCardTitle}>Resuscitation Drug Calculator</Text>
                  <PickerSelect
                    label="Rhythm"
                    options={[
                      { value: 'vfvt', label: 'VF/pVT (Shockable)' },
                      { value: 'asystole', label: 'Asystole / PEA' },
                      { value: 'bradycardia', label: 'Bradycardia with pulse' },
                      { value: 'tachycardia', label: 'Tachycardia with pulse' },
                    ]}
                    selected={aclsRhythm}
                    onSelect={setAclsRhythm}
                  />
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={aclsWeight}
                    onChangeText={setAclsWeight}
                  />
                  <CalcButton
                    title="Calculate"
                    color={COLORS.danger}
                    onPress={() => setAclsResult(Calc.getACLSProtocol(aclsRhythm, aclsWeight))}
                  />
                  {aclsResult && <ResultDisplay result={aclsResult.text} type={aclsResult.type} />}
                </View>
              ) : null}
              {card.key === 'qrh-ana' ? (
                <View style={styles.calcCard}>
                  <Text style={styles.calcCardTitle}>Anaphylaxis Dose Calculator</Text>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={anaQrhWeight}
                    onChangeText={setAnaQrhWeight}
                  />
                  <PickerSelect
                    label="Age Group"
                    options={[
                      { value: 'adult', label: 'Adult (>12 yr)' },
                      { value: 'child', label: 'Child (6mo - 12yr)' },
                      { value: 'infant', label: 'Infant (<6 months)' },
                    ]}
                    selected={anaQrhAge}
                    onSelect={setAnaQrhAge}
                  />
                  <CalcButton
                    title="Calculate"
                    color={COLORS.danger}
                    onPress={() => setAnaQrhResult(Calc.calculateAnaphylaxis(anaQrhWeight, anaQrhAge))}
                  />
                  {anaQrhResult && <ResultDisplay result={anaQrhResult.text} type={anaQrhResult.type} />}
                </View>
              ) : null}
              {card.key === 'qrh-mh' ? (
                <View style={styles.calcCard}>
                  <Text style={styles.calcCardTitle}>Dantrolene Dose Calculator</Text>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={mhQrhWeight}
                    onChangeText={setMhQrhWeight}
                  />
                  <CalcButton
                    title="Calculate Dantrolene"
                    color={COLORS.danger}
                    onPress={() => setMhQrhResult(Calc.calculateDantrolenes(mhQrhWeight))}
                  />
                  {mhQrhResult && <ResultDisplay result={mhQrhResult.text} type={mhQrhResult.type} />}
                </View>
              ) : null}
              {card.key === 'qrh-last' ? (
                <View style={styles.calcCard}>
                  <Text style={styles.calcCardTitle}>Lipid Rescue Dose Calculator</Text>
                  <Text style={styles.label}>Weight (kg)</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="decimal-pad"
                    value={lastQrhWeight}
                    onChangeText={setLastQrhWeight}
                  />
                  <CalcButton
                    title="Calculate Lipid Doses"
                    color="#ffc107"
                    onPress={() => setLastQrhResult(Calc.calculateLipidRescue(lastQrhWeight))}
                  />
                  {lastQrhResult && <ResultDisplay result={lastQrhResult.text} type={lastQrhResult.type} />}
                </View>
              ) : null}
            </CollapsibleCard>
          ))}
        </View>
      ))}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  alertBox: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb', borderWidth: 1, borderRadius: BORDER_RADIUS, padding: SPACING.md, marginBottom: SPACING.md },
  alertRow: { flexDirection: 'row', alignItems: 'flex-start' },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertText: { color: '#721c24', fontSize: 13, lineHeight: 19 },
  alertStrong: { fontWeight: '700', color: '#721c24' },
  patientCard: { backgroundColor: COLORS.white, borderRadius: BORDER_RADIUS, borderWidth: 1, borderColor: COLORS.primary, marginBottom: SPACING.md, overflow: 'hidden' },
  patientHeader: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  patientHeaderRow: { flexDirection: 'row', alignItems: 'center' },
  patientHeaderIcon: { marginRight: 8 },
  patientHeaderText: { fontSize: 16, fontWeight: '600', color: COLORS.white },
  patientBody: { padding: SPACING.md },
  sectionAlert: { borderWidth: 1, borderRadius: BORDER_RADIUS, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginBottom: SPACING.md },
  sectionAlertDanger: { backgroundColor: '#f8d7da', borderColor: '#f5c6cb' },
  sectionAlertWarning: { backgroundColor: '#fff3cd', borderColor: '#ffeeba' },
  sectionAlertText: { fontSize: 13, fontWeight: '700' },
  sectionAlertTextDanger: { color: '#721c24' },
  sectionAlertTextWarning: { color: '#856404' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.xs },
  input: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, padding: 10, fontSize: 14, backgroundColor: COLORS.white, marginBottom: SPACING.md },
  protocolBox: { backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.md, marginTop: SPACING.md },
  protocolTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: SPACING.sm },
  protocolStep: { fontSize: 13, color: COLORS.text, marginBottom: 4, paddingLeft: 4, lineHeight: 18 },
  protocolStepBold: { fontWeight: '700' },
  qrhSectionWrap: { marginTop: SPACING.md },
  qrhSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  qrhSectionBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 6, marginRight: 10 },
  qrhSectionBadgeText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  qrhSectionTextWrap: { flex: 1 },
  qrhSectionTitle: { fontSize: 16, fontWeight: '700' },
  qrhSectionSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  qrhIntro: { fontSize: 13, color: COLORS.text, lineHeight: 20, marginTop: SPACING.sm },
  qrhWarning: {
    marginTop: SPACING.sm,
    backgroundColor: '#fff3cd',
    borderColor: '#ffe69c',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: '#856404',
    fontWeight: '700',
    lineHeight: 18,
  },
  qrhPanelsWrap: { marginTop: SPACING.sm },
  qrhPanel: { borderRadius: 8, padding: 10, marginBottom: SPACING.sm },
  qrhPanelBlue: { backgroundColor: '#cfe0ff' },
  qrhPanelGreen: { backgroundColor: '#d9f2df' },
  qrhPanelGray: { backgroundColor: '#e9ecef' },
  qrhPanelYellow: { backgroundColor: '#fff3cd', borderColor: '#ffe69c', borderWidth: 1 },
  qrhPanelRed: { backgroundColor: '#f8d7da', borderColor: '#f5c2c7', borderWidth: 1 },
  qrhPanelTitle: { fontSize: 13, fontWeight: '700', color: '#1f2937', marginBottom: 4 },
  qrhPanelLine: { fontSize: 13, color: '#1f2937', lineHeight: 18, marginBottom: 2 },
  calcCard: {
    marginTop: SPACING.sm,
    backgroundColor: '#fff3cd',
    borderColor: '#f1d274',
    borderWidth: 1,
    borderRadius: 8,
    padding: SPACING.sm,
  },
  calcCardTitle: { fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: SPACING.sm },
});
