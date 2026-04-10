// All calculator functions ported from calculators.js

export function getPatientValues(patient) {
  return {
    weight: parseFloat(patient.weight) || 70,
    age: parseInt(patient.age) || 45,
    height: parseFloat(patient.height) || 170,
    gender: patient.gender || 'male',
  };
}

export function calculateIdealBodyWeight(height, gender) {
  const heightInches = height / 2.54;
  return gender === 'male'
    ? 50 + 2.3 * (heightInches - 60)
    : 45.5 + 2.3 * (heightInches - 60);
}

// =============== PREOPERATIVE ===============

export function calculateASA(asaClass, emergency) {
  if (!asaClass) return { text: 'Please select an ASA classification', type: 'warning' };
  const descriptions = {
    '1': 'Healthy patient',
    '2': 'Mild systemic disease',
    '3': 'Severe systemic disease',
    '4': 'Severe disease, constant threat to life',
    '5': 'Moribund patient',
    '6': 'Brain-dead patient for organ donation',
  };
  const risks = {
    '1': ['Low perioperative risk', 'success'],
    '2': ['Low to moderate risk', 'success'],
    '3': ['Moderate to high risk', 'warning'],
    '4': ['High perioperative risk', 'danger'],
    '5': ['Very high risk', 'danger'],
    '6': ['Organ donation procedure', 'info'],
  };
  const e = emergency ? 'E' : '';
  const [risk, type] = risks[asaClass];
  return {
    text: `ASA ${asaClass}${e}: ${descriptions[asaClass]}\n${risk}${emergency ? '\nEmergency procedure modifier applied' : ''}`,
    type,
  };
}

export function calculateRCRI(factors) {
  const score = factors.filter(Boolean).length;
  const riskMap = [
    [0, 'Low risk (0.4% major cardiac complications)', 'success'],
    [1, 'Intermediate risk (0.9% major cardiac complications)', 'success'],
    [2, 'Intermediate risk (7% major cardiac complications)', 'warning'],
  ];
  const match = riskMap.find(r => r[0] === score) || [score, 'High risk (11% major cardiac complications)', 'danger'];
  return {
    text: `RCRI Score: ${score}/6\n${match[1]}${score >= 2 ? '\nConsider perioperative β-blockade and cardiology consultation' : ''}`,
    type: match[2],
  };
}

export function calculateAirwayRisk(mallampati, thyromental, lipBite) {
  if (!mallampati || !thyromental || !lipBite) return { text: 'Please complete all airway assessments', type: 'warning' };
  let riskScore = 0;
  const riskFactors = [];
  if (parseInt(mallampati) >= 3) { riskScore += 2; riskFactors.push('Mallampati III-IV'); }
  if (thyromental === 'reduced') { riskScore += 2; riskFactors.push('Reduced thyromental distance'); }
  if (parseInt(lipBite) >= 2) { riskScore += 1; riskFactors.push('Poor lip bite test'); }

  let type, text2;
  if (riskScore <= 1) { type = 'success'; text2 = 'Low risk of difficult airway\nStandard airway management'; }
  else if (riskScore <= 3) { type = 'warning'; text2 = 'Moderate risk of difficult airway\nConsider video laryngoscopy, have backup plan ready'; }
  else { type = 'danger'; text2 = 'High risk of difficult airway\nConsider awake intubation, have difficult airway cart ready'; }

  return {
    text: `Airway Risk Score: ${riskScore}\n${text2}${riskFactors.length > 0 ? '\nRisk factors: ' + riskFactors.join(', ') : ''}`,
    type,
  };
}

export function calculateStopBang(criteria) {
  const score = criteria.filter(Boolean).length;
  let type, risk, rec;
  if (score <= 2) { type = 'success'; risk = 'Low risk of OSA'; rec = 'Standard perioperative care'; }
  else if (score <= 4) { type = 'warning'; risk = 'Intermediate risk of OSA'; rec = 'Consider sleep study, postoperative monitoring'; }
  else { type = 'danger'; risk = 'High risk of OSA'; rec = 'Sleep study recommended, enhanced postoperative monitoring, avoid opioids'; }
  return { text: `STOP-BANG Score: ${score}/8\n${risk}\n${rec}`, type };
}

export function calculateFramingham(patient, totalChol, hdlChol, systolicBP, smoking, diabetes) {
  const p = getPatientValues(patient);
  if (!totalChol || !hdlChol || !systolicBP) return { text: 'Please enter all values', type: 'warning' };
  let riskScore = 0;
  if (p.age >= 70) riskScore += 3; else if (p.age >= 60) riskScore += 2; else if (p.age >= 50) riskScore += 1;
  if (p.gender === 'male') riskScore += 1;
  if (totalChol >= 280) riskScore += 3; else if (totalChol >= 240) riskScore += 2; else if (totalChol >= 200) riskScore += 1;
  if (hdlChol < 35) riskScore += 2; else if (hdlChol < 45) riskScore += 1; else if (hdlChol >= 60) riskScore -= 1;
  if (systolicBP >= 160) riskScore += 2; else if (systolicBP >= 140) riskScore += 1;
  if (smoking) riskScore += 2;
  if (diabetes) riskScore += 2;
  let type, risk;
  if (riskScore <= 2) { type = 'success'; risk = 'Low risk (<10% 10-year risk)'; }
  else if (riskScore <= 4) { type = 'warning'; risk = 'Moderate risk (10-20% 10-year risk)'; }
  else { type = 'danger'; risk = 'High risk (>20% 10-year risk)'; }
  return { text: `Framingham Risk Score: ${riskScore}\n${risk}\nConsider cardiology consultation for high-risk patients`, type };
}

export function calculateMETS(activityLevel) {
  if (!activityLevel) return { text: 'Please select activity level', type: 'warning' };
  const mets = parseInt(activityLevel);
  const good = mets >= 4;
  return {
    text: `Functional Capacity: ${mets} METs\n${good ? 'Good functional capacity' : 'Poor functional capacity'}\n${good ? 'Low perioperative cardiac risk, standard care' : 'Consider cardiac evaluation, optimize preoperatively'}`,
    type: good ? 'success' : 'warning',
  };
}

export function calculateChildPugh(bilirubin, albumin, inr, ascites, encephalopathy) {
  if (!bilirubin || !albumin || !inr || !ascites || !encephalopathy)
    return { text: 'Please complete all assessments', type: 'warning' };
  const total = parseInt(bilirubin) + parseInt(albumin) + parseInt(inr) + parseInt(ascites) + parseInt(encephalopathy);
  let cls, interp, type;
  if (total <= 6) { cls = 'A'; interp = 'Mild liver disease (1-year survival: 100%)'; type = 'success'; }
  else if (total <= 9) { cls = 'B'; interp = 'Moderate liver disease (1-year survival: 81%)'; type = 'warning'; }
  else { cls = 'C'; interp = 'Severe liver disease (1-year survival: 45%)'; type = 'danger'; }
  return {
    text: `Child-Pugh Score: ${total} (Class ${cls})\n${interp}\n${cls === 'C' ? 'Consider postponing elective surgery' : 'Monitor hepatic function perioperatively'}`,
    type,
  };
}

export function calculateMELD(bilirubin, creatinine, inr, dialysis) {
  if (!bilirubin || !creatinine || !inr) return { text: 'Please enter all values', type: 'warning' };
  const adjBil = Math.max(parseFloat(bilirubin), 1.0);
  let adjCr = Math.max(parseFloat(creatinine), 1.0);
  const adjINR = Math.max(parseFloat(inr), 1.0);
  if (dialysis) adjCr = 4.0;
  const raw = 3.78 * Math.log(adjBil) + 11.2 * Math.log(adjINR) + 9.57 * Math.log(adjCr) + 6.43;
  const score = Math.min(Math.max(Math.round(raw), 6), 40);
  let type, interp, rec;
  if (score < 10) { type = 'success'; interp = 'Low risk (4% 3-month mortality)'; rec = 'Standard perioperative care'; }
  else if (score < 20) { type = 'warning'; interp = 'Moderate risk (27% 3-month mortality)'; rec = 'Consider optimization and monitoring'; }
  else if (score < 30) { type = 'danger'; interp = 'High risk (76% 3-month mortality)'; rec = 'High-risk surgery, consider postponing elective procedures'; }
  else { type = 'danger'; interp = 'Very high risk (>80% 3-month mortality)'; rec = 'Extremely high risk, avoid elective surgery'; }
  return { text: `MELD Score: ${score}\n${interp}\n${rec}`, type };
}

export function calculateCockcroftGault(patient, creatinine) {
  const p = getPatientValues(patient);
  if (!creatinine) return { text: 'Please enter serum creatinine', type: 'warning' };
  let crCl = ((140 - p.age) * p.weight) / (72 * parseFloat(creatinine));
  if (p.gender === 'female') crCl *= 0.85;
  let type, interp;
  if (crCl >= 90) { type = 'success'; interp = 'Normal renal function'; }
  else if (crCl >= 60) { type = 'success'; interp = 'Mild renal impairment'; }
  else if (crCl >= 30) { type = 'warning'; interp = 'Moderate renal impairment'; }
  else { type = 'danger'; interp = 'Severe renal impairment'; }
  return { text: `Creatinine Clearance: ${crCl.toFixed(1)} mL/min\n${interp}\nAdjust drug dosing for CrCl < 60 mL/min`, type };
}

export function calculateBodyWeights(patient) {
  const p = getPatientValues(patient);
  if (!p.height) return { text: 'Please enter height', type: 'warning' };
  const heightInches = p.height / 2.54;
  const ibw = p.gender === 'male' ? 50 + 2.3 * (heightInches - 60) : 45.5 + 2.3 * (heightInches - 60);
  const lbw = p.gender === 'male'
    ? (1.1 * p.weight) - 128 * Math.pow(p.weight / p.height, 2)
    : (1.07 * p.weight) - 148 * Math.pow(p.weight / p.height, 2);
  const heightM = p.height / 100;
  const bmi = p.weight / Math.pow(heightM, 2);
  let cat = 'Normal';
  if (bmi < 18.5) cat = 'Underweight'; else if (bmi >= 25 && bmi < 30) cat = 'Overweight'; else if (bmi >= 30) cat = 'Obese';
  return {
    text: `Current Weight: ${p.weight} kg\nBMI: ${bmi.toFixed(1)} kg/m² (${cat})\nIdeal Body Weight: ${ibw.toFixed(1)} kg\nLean Body Weight: ${lbw.toFixed(1)} kg\nUse IBW for lipophilic drugs, LBW for hydrophilic drugs in obese patients`,
    type: 'success',
  };
}

export function calculateCaprini(factors, patient) {
  const p = getPatientValues(patient);
  const weights = { majorSurgery: 2, malignancy: 2, priorVTE: 3, immobility: 1, varicoseVeins: 1, obesity: 1 };
  let totalScore = 0;
  Object.keys(factors).forEach(k => { if (factors[k]) totalScore += (weights[k] || 0); });
  if (p.age >= 75) totalScore += 4; else if (p.age >= 61) totalScore += 3; else if (p.age >= 41) totalScore += 2;
  let type, risk, prophylaxis;
  if (totalScore <= 2) { type = 'success'; risk = 'Low risk'; prophylaxis = 'Early mobilization, mechanical prophylaxis'; }
  else if (totalScore <= 4) { type = 'warning'; risk = 'Moderate risk'; prophylaxis = 'LMWH or mechanical prophylaxis'; }
  else if (totalScore <= 6) { type = 'warning'; risk = 'High risk'; prophylaxis = 'LMWH + mechanical prophylaxis'; }
  else { type = 'danger'; risk = 'Very high risk'; prophylaxis = 'Extended LMWH + mechanical prophylaxis'; }
  return { text: `Caprini Score: ${totalScore}\n${risk} of VTE\nProphylaxis: ${prophylaxis}\nAge: ${p.age} years included`, type };
}

// =============== POSTOPERATIVE ===============

export function calculateAldrete(scores) {
  const total = Object.values(scores).reduce((s, v) => s + (parseInt(v) || 0), 0);
  let type, interp;
  if (total >= 9) { type = 'success'; interp = 'Ready for PACU discharge'; }
  else if (total >= 7) { type = 'warning'; interp = 'Continue monitoring in PACU'; }
  else { type = 'danger'; interp = 'Requires continued intensive monitoring'; }
  return { text: `Aldrete Score: ${total}/10\n${interp}`, type };
}

export function calculatePONV(factors) {
  const score = factors.filter(Boolean).length;
  const map = [
    [0, 'Low risk (10% incidence)', 'No prophylaxis needed', 'success'],
    [1, 'Low-moderate risk (21% incidence)', 'Consider single antiemetic', 'success'],
    [2, 'Moderate risk (39% incidence)', 'Combination antiemetic therapy', 'warning'],
    [3, 'High risk (61% incidence)', 'Multimodal antiemetic approach', 'warning'],
    [4, 'Very high risk (79% incidence)', 'Aggressive multimodal prophylaxis', 'danger'],
  ];
  const [, risk, rec, type] = map[score] || map[4];
  return { text: `Apfel Score: ${score}/4\n${risk}\n${rec}`, type };
}

export function assessPain(painScore, location) {
  const score = parseInt(painScore) || 0;
  let type, severity, management;
  if (score === 0) { type = 'success'; severity = 'No pain'; management = 'Continue monitoring'; }
  else if (score <= 3) { type = 'success'; severity = 'Mild pain'; management = 'Non-opioid analgesics, reassess in 30 minutes'; }
  else if (score <= 6) { type = 'warning'; severity = 'Moderate pain'; management = 'Consider opioid analgesics, multimodal approach'; }
  else { type = 'danger'; severity = 'Severe pain'; management = 'Urgent pain management, consider regional techniques'; }
  return { text: `Pain Score: ${score}/10 (${severity})\nLocation: ${location || 'Not specified'}\n${management}`, type };
}

export function calculatePADSS(scores) {
  const total = Object.values(scores).reduce((s, v) => s + (parseInt(v) || 0), 0);
  let type, interp;
  if (total >= 9) { type = 'success'; interp = 'Ready for ambulatory discharge'; }
  else if (total >= 7) { type = 'warning'; interp = 'Requires extended observation'; }
  else { type = 'danger'; interp = 'Not ready for discharge'; }
  return { text: `PADSS Score: ${total}/10\n${interp}\nScore ≥9 required for safe ambulatory discharge`, type };
}

// =============== ICU ===============

export function calculateAPACHE(temperature, gcs, chronicHealth, patient) {
  const p = getPatientValues(patient);
  let score = 0;
  if (p.age >= 75) score += 6; else if (p.age >= 65) score += 5; else if (p.age >= 55) score += 3; else if (p.age >= 45) score += 2;
  const temp = parseFloat(temperature) || 37;
  if (temp >= 41 || temp <= 29.9) score += 4; else if (temp >= 39 || temp <= 31.9) score += 3; else if (temp >= 38.5 || temp <= 33.9) score += 1;
  score += parseInt(chronicHealth) || 0;
  const g = parseInt(gcs) || 15;
  score += (15 - g);
  let mortality;
  if (score < 10) mortality = 'Low risk (< 10%)';
  else if (score < 15) mortality = 'Moderate risk (10-25%)';
  else if (score < 20) mortality = 'High risk (25-50%)';
  else mortality = 'Very high risk (> 50%)';
  return { text: `APACHE II Score: ${score}\nPredicted Mortality: ${mortality}`, type: score < 15 ? 'success' : 'warning' };
}

export function calculateSOFA(scores) {
  const total = Object.values(scores).reduce((s, v) => s + (parseInt(v) || 0), 0);
  let type, interp;
  if (total <= 6) { type = 'success'; interp = 'Low risk of mortality'; }
  else if (total <= 9) { type = 'warning'; interp = 'Moderate risk of mortality'; }
  else { type = 'danger'; interp = 'High risk of mortality'; }
  return { text: `SOFA Score: ${total}/24\n${interp}`, type };
}

export function assessRASS(level) {
  if (level === null || level === undefined || level === '') return { text: 'Please select level', type: 'warning' };
  const lv = parseInt(level);
  const labels = {
    '-5': 'Unarousable', '-4': 'Deep sedation', '-3': 'Moderate sedation',
    '-2': 'Light sedation', '-1': 'Drowsy', '0': 'Alert and calm',
    '1': 'Restless', '2': 'Agitated', '3': 'Very agitated', '4': 'Combative',
  };
  let type;
  if (lv >= -1 && lv <= 1) type = 'success';
  else if (lv < -1) type = 'info';
  else type = 'danger';
  return { text: `RASS Score: ${lv}\n${labels[String(lv)] || 'Unknown'}`, type };
}

export function assessCAM(acute, inattention, disorganized, altered) {
  const positive = acute === 'yes' && inattention === 'yes' && (disorganized === 'yes' || altered === 'yes');
  return {
    text: positive ? 'CAM-ICU: POSITIVE\nDelirium present - Initiate delirium management' : 'CAM-ICU: NEGATIVE\nNo delirium detected',
    type: positive ? 'danger' : 'success',
  };
}

export function calculateGCS(eye, verbal, motor) {
  const e = parseInt(eye) || 0;
  const v = parseInt(verbal) || 0;
  const m = parseInt(motor) || 0;
  const total = e + v + m;
  let type, interp;
  if (total >= 13) { type = 'success'; interp = 'Mild brain injury'; }
  else if (total >= 9) { type = 'warning'; interp = 'Moderate brain injury'; }
  else { type = 'danger'; interp = 'Severe brain injury'; }
  return { text: `GCS Score: ${total}/15\nEye: ${e}, Verbal: ${v}, Motor: ${m}\n${interp}`, type };
}

// =============== EMERGENCY ===============

export function calculateDantrolenes(weight) {
  if (!weight) return { text: 'Please enter patient weight', type: 'warning' };
  const w = parseFloat(weight);
  const initial = w * 2.5;
  const max = w * 10;
  const vials = Math.ceil(max / 20);
  return {
    text: `DANTROLENE DOSING:\nInitial dose: ${initial.toFixed(0)} mg IV\nRepeat: ${initial.toFixed(0)} mg every 5 minutes PRN\nMaximum total: ${max.toFixed(0)} mg\n\nVials needed: ${vials} vials (20mg each)\nEach vial requires 60mL sterile water for reconstitution`,
    type: 'danger',
  };
}

export function calculateLipidRescue(weight) {
  if (!weight) return { text: 'Please enter patient weight', type: 'warning' };
  const w = parseFloat(weight);
  const bolus = w * 1.5;
  const infusion = w * 0.25;
  const max = w * 12;
  return {
    text: `LIPID RESCUE THERAPY (20% Intralipid):\n1. Initial bolus: ${bolus.toFixed(0)} mL IV\n2. Infusion: ${infusion.toFixed(1)} mL/min\n3. Repeat bolus: ${bolus.toFixed(0)} mL (if needed)\n4. Maximum total: ${max.toFixed(0)} mL\n\nContinue infusion until hemodynamic stability`,
    type: 'warning',
  };
}

export function calculateAnaphylaxis(weight, ageGroup) {
  if (!weight) return { text: 'Please enter patient weight', type: 'warning' };
  const w = parseFloat(weight);
  const fluidBolus = w * 20;
  const diphenhydramine = Math.min(w * 1, 50);
  const methylpred = w * 1;

  let epiDose = '';
  switch (ageGroup) {
    case 'adult':
      epiDose = '0.5 mg (0.5 mL of 1:1000) IM';
      break;
    case 'child': {
      const childDose = Math.min(w * 0.01, 0.5);
      epiDose = `${childDose.toFixed(2)} mg (${childDose.toFixed(2)} mL of 1:1000) IM`;
      break;
    }
    case 'infant': {
      const infantDose = w * 0.01;
      epiDose = `${infantDose.toFixed(2)} mg (${infantDose.toFixed(2)} mL of 1:1000) IM`;
      break;
    }
    default:
      epiDose = '0.5 mg (0.5 mL of 1:1000) IM';
  }

  return {
    text: `ANAPHYLAXIS EMERGENCY DOSES:\n1. Epinephrine IM: ${epiDose}\n2. Fluid bolus: ${fluidBolus.toFixed(0)} mL crystalloid\n3. Diphenhydramine: ${diphenhydramine.toFixed(0)} mg IV\n4. Methylprednisolone: ${methylpred.toFixed(0)} mg IV\n\nRepeat epinephrine every 5-15 minutes if needed`,
    type: 'danger',
  };
}

export function getACLSProtocol(rhythm, weight) {
  if (!rhythm) return { text: 'Please select rhythm', type: 'warning' };
  const epiDose = '1 mg IV/IO';
  const amiodarone = '300 mg IV/IO';
  const atropine = '0.5 mg IV/IO';

  switch (rhythm) {
    case 'vfvt':
    case 'vf_vt':
      return {
        text: `VF/VT Algorithm:\n1. CPR + Defibrillation - 2 J/kg (pediatric) or 200-360 J (adult)\n2. Epinephrine - ${epiDose} every 3-5 minutes\n3. Amiodarone - ${amiodarone}, then 150 mg\n4. Continue CPR - Minimize interruptions\n5. Treat reversible causes - H's and T's`,
        type: 'danger',
      };
    case 'asystole':
    case 'pea':
      return {
        text: `Asystole/PEA Algorithm:\n1. High-quality CPR - 30:2 ratio\n2. Epinephrine - ${epiDose} every 3-5 minutes\n3. No defibrillation for asystole/PEA\n4. Treat reversible causes:\n   - Hypovolemia, Hypoxia, H+ (acidosis)\n   - Hypo/hyperkalemia, Hypothermia\n   - Tension pneumothorax, Tamponade\n   - Toxins, Thrombosis (coronary/pulmonary)`,
        type: 'danger',
      };
    case 'bradycardia':
      return {
        text: `Bradycardia with Pulse:\n1. Assess symptoms - Hypotension, altered mental status\n2. Atropine - ${atropine}, may repeat\n3. Consider transcutaneous pacing\n4. Dopamine - 2-10 mcg/kg/min\n5. Epinephrine - 2-10 mcg/min infusion`,
        type: 'warning',
      };
    case 'tachycardia':
      return {
        text: 'Tachycardia with Pulse:\n1. Assess stability - Check BP, consciousness\n2. If unstable: Synchronized cardioversion\n3. If stable SVT: Vagal maneuvers, adenosine\n4. If stable VT: Amiodarone 150 mg IV\n5. Treat underlying causes',
        type: 'warning',
      };
    default:
      return { text: 'Select a valid rhythm', type: 'warning' };
  }
}

// =============== SPECIALIZED ===============

export function calculatePediatricWeight(age) {
  if (!age) return { text: 'Please enter age', type: 'warning' };
  const a = parseFloat(age);
  const estWeight = (a * 2) + 8;
  return { text: `Estimated weight (age ${a}): ${estWeight.toFixed(1)} kg\nFormula: (Age × 2) + 8`, type: 'success' };
}

export function calculateCPP(map, icp) {
  if (!map || !icp) return { text: 'Please enter MAP and ICP', type: 'warning' };
  const cpp = parseFloat(map) - parseFloat(icp);
  let type, interp;
  if (cpp >= 60) { type = 'success'; interp = 'Adequate cerebral perfusion'; }
  else if (cpp >= 50) { type = 'warning'; interp = 'Borderline - consider intervention'; }
  else { type = 'danger'; interp = 'Inadequate cerebral perfusion - immediate intervention'; }
  return { text: `CPP: ${cpp.toFixed(0)} mmHg\nMAP: ${map}, ICP: ${icp}\n${interp}`, type };
}

// =============== QUALITY & SAFETY ===============

export function evaluateChecklist(items, total, name) {
  const checked = items.filter(Boolean).length;
  if (checked === total) return { text: `${name}: COMPLETE (${checked}/${total})`, type: 'success' };
  return { text: `${name}: ${checked}/${total} items completed`, type: checked > total / 2 ? 'warning' : 'danger' };
}

// =============== GENERAL MEDICAL ===============

export function calculateBMI(weight, height) {
  if (!weight || !height) return { text: 'Please enter weight and height', type: 'warning' };
  const h = parseFloat(height) / 100;
  const bmi = parseFloat(weight) / (h * h);
  let category, type;
  if (bmi < 18.5) { category = 'Underweight'; type = 'warning'; }
  else if (bmi < 25) { category = 'Normal'; type = 'success'; }
  else if (bmi < 30) { category = 'Overweight'; type = 'warning'; }
  else if (bmi < 35) { category = 'Obese Class I'; type = 'danger'; }
  else if (bmi < 40) { category = 'Obese Class II'; type = 'danger'; }
  else { category = 'Obese Class III'; type = 'danger'; }
  return { text: `BMI: ${bmi.toFixed(1)} kg/m²\nCategory: ${category}`, type };
}

export function calculateBSA(weight, height, formula) {
  if (!weight || !height) return { text: 'Please enter weight and height', type: 'warning' };
  const w = parseFloat(weight);
  const h = parseFloat(height);
  let bsa, name;
  if (formula === 'mosteller') { bsa = Math.sqrt((w * h) / 3600); name = 'Mosteller'; }
  else if (formula === 'haycock') { bsa = 0.024265 * Math.pow(w, 0.5378) * Math.pow(h, 0.3964); name = 'Haycock'; }
  else { bsa = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725); name = 'Du Bois'; }
  return { text: `BSA: ${bsa.toFixed(2)} m²\nFormula: ${name}`, type: 'success' };
}

export function calculateFluidRequirements(weight, fastingHours, surgeryDuration, surgeryType) {
  if (!weight) return { text: 'Please enter weight', type: 'warning' };
  const w = parseFloat(weight);
  const fh = parseFloat(fastingHours) || 0;
  const sd = parseFloat(surgeryDuration) || 0;
  let maint = 0;
  if (w <= 10) maint = w * 4;
  else if (w <= 20) maint = 40 + ((w - 10) * 2);
  else maint = 60 + ((w - 20) * 1);
  const deficit = maint * fh;
  let surgicalRate = 4;
  if (surgeryType === 'moderate') surgicalRate = 5;
  else if (surgeryType === 'major') surgicalRate = 7;
  const surgicalLoss = w * surgicalRate * sd;
  const total = maint + deficit + surgicalLoss;
  return {
    text: `Maintenance: ${maint.toFixed(0)} mL/hr\nDeficit: ${deficit.toFixed(0)} mL (${fh}h fasting)\nSurgical loss: ${surgicalLoss.toFixed(0)} mL\nTotal: ${total.toFixed(0)} mL`,
    type: 'success',
  };
}

export function assessBloodPressure(systolic, diastolic) {
  if (!systolic || !diastolic) return { text: 'Please enter BP values', type: 'warning' };
  const s = parseFloat(systolic);
  const d = parseFloat(diastolic);
  let type, category;
  if (s < 120 && d < 80) { type = 'success'; category = 'Normal'; }
  else if (s < 130 && d < 80) { type = 'warning'; category = 'Elevated'; }
  else if (s < 140 || d < 90) { type = 'warning'; category = 'Hypertension Stage 1'; }
  else if (s >= 140 || d >= 90) { type = 'danger'; category = 'Hypertension Stage 2'; }
  if (s >= 180 || d >= 120) { type = 'danger'; category = 'Hypertensive Crisis'; }
  return { text: `BP: ${s}/${d} mmHg\nCategory: ${category}`, type };
}

export function convertTemperature(value, unit) {
  if (!value) return { text: 'Please enter temperature', type: 'warning' };
  const v = parseFloat(value);
  if (unit === 'celsius') {
    const f = (v * 9 / 5) + 32;
    return { text: `${v}°C = ${f.toFixed(1)}°F`, type: 'success' };
  }
  const c = (v - 32) * 5 / 9;
  return { text: `${v}°F = ${c.toFixed(1)}°C`, type: 'success' };
}

export function convertWeightUnit(value, unit) {
  if (!value) return { text: 'Please enter weight', type: 'warning' };
  const v = parseFloat(value);
  if (unit === 'kg') return { text: `${v} kg = ${(v * 2.205).toFixed(1)} lbs`, type: 'success' };
  return { text: `${v} lbs = ${(v / 2.205).toFixed(1)} kg`, type: 'success' };
}

// =============== DRUG DOSING ===============

export function calculateDripRate(volume, time, dropFactor) {
  if (!volume || !time) return { text: 'Please enter all values', type: 'warning' };
  const v = parseFloat(volume);
  const t = parseFloat(time);
  const df = parseInt(dropFactor) || 20;
  const mlPerHr = v / t;
  const gttsPerMin = (v * df) / (t * 60);
  return { text: `Rate: ${mlPerHr.toFixed(1)} mL/hr\nDrop rate: ${gttsPerMin.toFixed(1)} gtts/min\n(${df} gtts/mL drop factor)`, type: 'success' };
}

export function calculateHeparin(weight, indication) {
  if (!weight) return { text: 'Please enter weight', type: 'warning' };
  const w = parseFloat(weight);
  const protocols = {
    'dvt_pe': { bolus: 80, infusion: 18, target: '60-80 sec' },
    'acs': { bolus: 60, infusion: 12, target: '50-70 sec' },
    'afib': { bolus: 0, infusion: 15, target: '45-60 sec' },
    'prophylaxis': { bolus: 0, infusion: 0, target: 'N/A', fixed: '5000 units SC q8-12h' },
  };
  const p = protocols[indication] || protocols['dvt_pe'];
  if (p.fixed) return { text: `Heparin Prophylaxis:\n${p.fixed}`, type: 'success' };
  return {
    text: `Heparin (${indication}):\nBolus: ${(w * p.bolus).toFixed(0)} units IV\nInfusion: ${(w * p.infusion).toFixed(0)} units/hr\nTarget aPTT: ${p.target}`,
    type: 'success',
  };
}

export function calculateInsulin(glucose, target, isf, carbRatio, carbs) {
  if (!glucose) return { text: 'Please enter blood glucose', type: 'warning' };
  const g = parseFloat(glucose);
  const t = parseFloat(target) || 100;
  const i = parseFloat(isf) || 50;
  const cr = parseFloat(carbRatio) || 10;
  const c = parseFloat(carbs) || 0;
  const correctionDose = Math.max((g - t) / i, 0);
  const carbDose = c / cr;
  const totalDose = correctionDose + carbDose;
  return {
    text: `Correction dose: ${correctionDose.toFixed(1)} units\nCarb dose: ${carbDose.toFixed(1)} units\nTotal insulin: ${totalDose.toFixed(1)} units`,
    type: 'success',
  };
}

// =============== ECMO ===============

export function calculateInitialECMO(weight, height, ecmoType) {
  if (!weight) return { text: 'Please enter weight', type: 'warning' };
  const w = parseFloat(weight);
  const co = w * 70;
  const targetPercent = ecmoType === 'va' ? 0.7 : 0.8;
  const targetFlow = (co * targetPercent) / 1000;
  return {
    text: `${ecmoType?.toUpperCase() || 'ECMO'} Initial Settings:\nEstimated CO: ${(co / 1000).toFixed(1)} L/min\nTarget flow: ${targetFlow.toFixed(1)} L/min (${(targetPercent * 100).toFixed(0)}% CO)\nSweep gas: Start at 1:1 (flow:sweep ratio)\nFiO₂: Start at 1.0`,
    type: 'success',
  };
}

export function calculateECMOFlow(weight, targetCI, nativeCO) {
  if (!weight) return { text: 'Please enter weight', type: 'warning' };
  const w = parseFloat(weight);
  const ci = parseFloat(targetCI) || 2.4;
  const native = parseFloat(nativeCO) || 0;
  const h = 170;
  const bsa = 0.007184 * Math.pow(w, 0.425) * Math.pow(h, 0.725);
  const targetCO = ci * bsa;
  const ecmoFlow = targetCO * (1 - native / 100);
  return {
    text: `BSA: ${bsa.toFixed(2)} m²\nTarget CO: ${targetCO.toFixed(1)} L/min\nECMO Flow needed: ${ecmoFlow.toFixed(1)} L/min`,
    type: 'success',
  };
}

export function calculateGasExchange(currentPCO2, targetPCO2, currentSweep, targetPO2) {
  if (!currentPCO2 || !targetPCO2 || !currentSweep) return { text: 'Please enter all values', type: 'warning' };
  const cur = parseFloat(currentPCO2);
  const tar = parseFloat(targetPCO2);
  const sweep = parseFloat(currentSweep);
  const newSweep = (sweep * cur) / tar;
  return {
    text: `Current PCO₂: ${cur} mmHg → Target: ${tar} mmHg\nCurrent sweep: ${sweep} L/min\nAdjusted sweep: ${newSweep.toFixed(1)} L/min`,
    type: 'success',
  };
}

// =============== ANESTHETIC DRUG DOSING ===============

export function calculateAnestheticDoses(weight, age, ageGroup) {
  const w = parseFloat(weight) || 70;
  const a = parseInt(age) || 40;

  let ageFactor = 1.0;
  if (ageGroup === 'elderly') ageFactor = 0.8;
  else if (ageGroup === 'neonate' || ageGroup === 'infant') ageFactor = 0.6;
  else if (ageGroup === 'toddler' || ageGroup === 'preschool') ageFactor = 0.7;
  else if (ageGroup === 'school' || ageGroup === 'adolescent') ageFactor = 0.9;

  let macFactor = 1.0;
  if (a > 65) macFactor = 0.85;
  else if (a < 1) macFactor = 0.7;
  else if (a < 5) macFactor = 1.2;

  const dose = (min, max, factor = ageFactor, decimals = 1) => ({
    min: (w * min * factor).toFixed(decimals),
    max: (w * max * factor).toFixed(decimals),
  });

  const singleDose = (perKg, factor = ageFactor, decimals = 1) => (w * perKg * factor).toFixed(decimals);
  const fixedDose = (val) => val.toFixed(0);

  return {
    ageFactor,
    macFactor,
    iv: {
      propofol: { induction: dose(1.5, 2.5), maintenance: dose(100, 200, ageFactor, 0), sedation: dose(25, 75, ageFactor, 0) },
      ketamine: { iv: dose(1, 2), im: dose(4, 8), analgesic: dose(0.1, 0.5) },
      etomidate: { induction: dose(0.2, 0.3) },
      dexmedetomidine: { load: singleDose(1), maintenance: dose(0.2, 1) },
      thiopental: { induction: dose(4, 6) },
      remimazolam: { induction: dose(0.2, 0.35), maintenance: dose(1, 2) },
    },
    inhalational: {
      sevoflurane: { mac: (2.0 * macFactor).toFixed(1) },
      desflurane: { mac: (6.0 * macFactor).toFixed(1) },
      isoflurane: { mac: (1.2 * macFactor).toFixed(1) },
    },
    opioids: {
      fentanyl: { bolus: dose(1, 3), infusion: dose(0.5, 3), epidural: dose(2, 4) },
      morphine: { iv: dose(0.1, 0.15), im: dose(0.1, 0.15), epidural: dose(0.05, 0.1) },
      sufentanil: { bolus: dose(0.2, 0.5), infusion: dose(0.1, 0.5) },
      remifentanil: { bolus: dose(0.5, 1.5), infusion: dose(6, 30, ageFactor, 0) },
      hydromorphone: { iv: dose(0.015, 0.03, ageFactor, 2), im: dose(0.02, 0.04, ageFactor, 2) },
      tramadol: { ivIm: w > 50 ? '100' : '50', oral: w > 50 ? '100' : '50' },
    },
    nmb: {
      succinylcholine: { iv: dose(1, 1.5, 1), im: dose(3, 4, 1) },
      rocuronium: { intubation: singleDose(0.6, 1), maintenance: singleDose(0.15, 1, 2), rsi: dose(1, 1.2, 1) },
      vecuronium: { intubation: singleDose(0.1, 1, 2), maintenance: singleDose(0.02, 1, 2) },
      cisatracurium: { intubation: dose(0.15, 0.2, 1, 2), maintenance: singleDose(0.03, 1, 2) },
      atracurium: { intubation: singleDose(0.5, 1), maintenance: singleDose(0.1, 1, 2) },
    },
    local: {
      lidocaine: { max: fixedDose(300) },
      bupivacaine: { max: fixedDose(175) },
      ropivacaine: { max: fixedDose(200) },
    },
    sedatives: {
      midazolam: { premed: singleDose(0.07) },
      lorazepam: { premed: singleDose(0.03) },
    },
    vasopressors: {
      phenylephrine: { infusion: dose(0.2, 2, 1, 0) },
      ephedrine: { bolus: '5-25' },
      norepinephrine: { infusion: dose(0.6, 180, 1, 0) },
      epinephrine: { infusion: dose(0.6, 18, 1, 0) },
      dopamine: { infusion: dose(120, 1200, 1, 0) },
      dobutamine: { infusion: dose(150, 900, 1, 0) },
    },
    reversal: {
      naloxone: { initial: '0.04-0.4 mg IV (up to 2 mg)', infusion: '0.25-0.4 mg/hr' },
      flumazenil: { initial: '0.1-0.2 mg IV', additional: '0.1 mg q60sec (max 1 mg)' },
      sugammadex: { routine: singleDose(2, 1, 0), deep: singleDose(4, 1, 0), immediate: singleDose(16, 1, 0) },
      neostigmine: { dose: singleDose(0.05, 1) },
      glycopyrrolate: { dose: singleDose(0.01, 1, 2) },
      atropine: { premed: singleDose(0.5, 1, 0), bradycardia: singleDose(6, 1, 0) },
      dantrolene: { dose: singleDose(2.5, 1, 0) },
    },
    antiemetics: {
      ondansetron: { dose: singleDose(0.04, 1) },
      dexamethasone: { dose: singleDose(0.04, 1) },
      metoclopramide: { dose: singleDose(0.1, 1) },
    },
  };
}
