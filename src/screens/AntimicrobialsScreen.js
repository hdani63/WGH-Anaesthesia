import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

// ───────────────────────────────────────────────────────────────
// Reusable table renderer (horizontally scrollable)
// ───────────────────────────────────────────────────────────────
function DataTable({ headers, rows, columnWidths, headerColors }) {
  const widths = columnWidths || headers.map((_, idx) => (idx === 0 ? 160 : 140));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          {headers.map((h, i) => (
            <Text
              key={i}
              style={[styles.headerCell, { width: widths[i], minWidth: widths[i] }, headerColors && headerColors[i] ? { backgroundColor: headerColors[i] } : null]}
            >
              {h}
            </Text>
          ))}
        </View>
        {rows.map((row, i) => {
          // Section/group row: single cell spanning full width
          if (row.section) {
            const totalWidth = widths.reduce((a, b) => a + b, 0);
            return (
              <View key={i} style={[styles.sectionRow, { backgroundColor: row.bg || '#e9ecef' }]}>
                <Text style={[styles.sectionCell, { width: totalWidth, minWidth: totalWidth, color: row.color || COLORS.dark }]}>
                  {row.section}
                </Text>
              </View>
            );
          }
          return (
            <View key={i} style={[styles.dataRow, i % 2 === 0 && styles.altRow]}>
              {row.cells.map((cell, j) => (
                <Text key={j} style={[styles.dataCell, { width: widths[j], minWidth: widths[j] }, cell.style]}>
                  {cell.text}
                </Text>
              ))}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

// ───────────────────────────────────────────────────────────────
// Surgical prophylaxis data
// ───────────────────────────────────────────────────────────────
const PROPHYLAXIS_HEADERS = ['Type of Surgery', 'Prophylaxis Required?', '1st Choice', 'PCN Allergy (not severe)', 'Severe Allergy / Anaphylaxis'];
const PROPHYLAXIS_WIDTHS = [170, 150, 120, 140, 150];
const PROPHYLAXIS_HEADER_COLORS = [null, null, '#198754', '#ffc107', '#dc3545'];

const c = (text, style) => ({ text, style });

const PROPHYLAXIS_ROWS = [
  { section: 'SKIN', bg: '#fff3cd', color: '#664d03' },
  { cells: [c('Skin grafting'), c('Should be considered'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime'), c('Clindamycin', { color: '#dc3545' })] },

  { section: 'LIMB SURGERY', bg: '#cff4fc', color: '#055160' },
  { cells: [c('Lower limb amputation'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Varicose veins'), c('Consider in patients undergoing groin surgery'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Soft tissue surgery of the hand'), c('Should be considered'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'UROGENITAL SURGERY', bg: '#e2e3e5', color: '#41464b' },
  { cells: [c('Circumcision (routine elective), Hydrocoeles'), c('Not recommended'), c('—'), c('—'), c('—')] },
  { cells: [c('Urethral catheterisation'), c('Should be considered'), c('Gentamicin', { color: '#157347', fontWeight: '600' }), c('Gentamicin'), c('Gentamicin', { color: '#dc3545' })] },

  { section: 'UPPER GASTROINTESTINAL', bg: '#cfe2ff', color: '#084298' },
  { cells: [c('Oesophageal, Stomach & Duodenal, Small Intestine surgery'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'HEPATOBILIARY', bg: '#ffe0b2', color: '#7a4100' },
  { cells: [c('Bile duct, Pancreatic, Gall Bladder (open) surgery'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Gall bladder surgery (laparoscopic)'), c('Not recommended. Consider in high risk patients'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'LOWER GASTROINTESTINAL', bg: '#d1e7dd', color: '#0a3622' },
  { cells: [c('Appendicectomy, Colorectal Surgery (incl. laparoscopic)'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Haemorrhoidectomies'), c('Should be considered'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'SPLEEN  (Refer to Appendix 1 for post-splenectomy recommendations)', bg: '#fff3cd', color: '#664d03' },
  { cells: [c('Splenectomy'), c('Not recommended unless high risk'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'ABDOMEN', bg: '#f8f9fa', color: '#41464b' },
  { cells: [c('Hernia repair – groin (Inguinal/femoral, Laparoscopic/incisional ± mesh)'), c('Should be considered'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime'), c('Clindamycin', { color: '#dc3545' })] },
  { cells: [c('Diagnostic endoscopic procedures'), c('Not recommended'), c('—'), c('—'), c('—')] },
  { cells: [c('Therapeutic endoscopic procedures (PEG)'), c('Consider in high risk patients'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },

  { section: 'GYNAECOLOGICAL SURGERY', bg: '#f8bbd0', color: '#7a1140' },
  { cells: [c('Abdominal & Vaginal hysterectomy'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Caesarean section'), c('Highly recommended'), c('Cefuroxime', { color: '#157347', fontWeight: '600' }), c('Cefuroxime'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Assisted delivery'), c('Not recommended'), c('—'), c('—'), c('—')] },
  { cells: [c('Perineal tear'), c('Recommended for 3rd/4th degree tears involving anal sphincter/rectal mucosa'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Manual removal of the placenta'), c('Should be considered. Recommended in proven chlamydia or gonorrhoea infection'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Clindamycin + Gentamicin', { color: '#dc3545' })] },
  { cells: [c('Evacuation of incomplete miscarriage'), c('Not recommended'), c('—'), c('—'), c('—')] },
  { cells: [c('Intrauterine contraceptive device (IUCD) insertion'), c('Not recommended – consider if known colonisation'), c('—'), c('—'), c('—')] },

  { section: 'GENERAL — clean-contaminated, dirty/infected procedures, prosthetic device / implant insertion', bg: '#343a40', color: '#ffffff' },
  { cells: [c('All above categories (general rule)'), c('Recommended'), c('Co-amoxiclav', { color: '#157347', fontWeight: '600' }), c('Cefuroxime + Metronidazole'), c('Consider Clindamycin + Gentamicin / discuss with Microbiology', { color: '#dc3545' })] },
];

const PROPHYLAXIS_TIPS = [
  'For patients with MRSA colonisation / risk factors where screening results are not available, consider ADDING vancomycin to prophylactic regimen.',
  'IV antibiotics should be given within 30 minutes of incision. A patient already on antibiotics on the ward will not cover perioperatively unless timing is within 30 minutes of incision.',
  'A single pre-op dose is as effective as a full 5-day course for an uncomplicated procedure.',
  'A 2nd dose should be given for procedures longer than 3 hours or in the event of major blood loss.',
  'Prophylaxis should not exceed 24 hours for the majority of procedures (excluding patients with documented infection at time of surgery or within 48 hours post-op).',
];

// ───────────────────────────────────────────────────────────────
// Empiric therapy data
// ───────────────────────────────────────────────────────────────
const EMPIRIC_SECTIONS = [
  {
    key: 'sepsis',
    title: 'SEPSIS',
    icon: 'heartbeat',
    color: '#b71c1c',
    bg: '#ffebee',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy', 'Comments'],
    widths: [140, 220, 170, 170],
    rows: [
      { cells: [c('Suspected source of infection'), c('Refer to relevant section below', { fontStyle: 'italic' }), c(''), c('')] },
      { cells: [c('Unknown source of infection', { fontWeight: '700' }), c('Tazocin 4.5g QDS IV\nIf unstable/severe: ADD Gentamicin + Teicoplanin. ADD Teicoplanin if suspected CVC infection/MRSA risk. Consider empiric antifungal if pyrexia persists after 4 days of antibiotic therapy'), c('Metronidazole + Gentamicin + Teicoplanin'), c('Use Amikacin instead of Gentamicin if MDRO suspected or severe sepsis')] },
      { cells: [c('Neutropenic sepsis', { fontWeight: '700' }), c('Tazocin 4.5g QDS IV. ADD Teicoplanin if suspected CVC infection/MRSA risk'), c('Ciprofloxacin + Gentamicin + Teicoplanin'), c('')] },
      { cells: [c('Sepsis in Pregnancy', { fontWeight: '700' }), c('Tazocin 4.5g QDS IV. Unstable/severe: ADD Gentamicin 3–5mg/kg (booking weight) OD IV (max 400mg). If already on Gentamicin: ADD Teicoplanin. ADD Clindamycin if invasive Group A Strep suspected. ⚠ Severe sepsis: Meropenem 1–2g TDS IV — Consult Micro & Critical Care'), c('Clindamycin + Gentamicin + Teicoplanin'), c('')] },
    ],
  },
  {
    key: 'uti',
    title: 'URINARY TRACT INFECTIONS',
    icon: 'tint',
    color: '#0d47a1',
    bg: '#e3f2fd',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy / Notes'],
    widths: [170, 240, 180],
    rows: [
      { cells: [c('Lower UTI (uncomplicated/females)'), c('Nitrofurantoin 50mg QDS PO × 5 days OR Cephalexin 500mg BD PO × 3 days'), c('')] },
      { cells: [c('Hospital acquired / Recurrent / Complicated UTI'), c('Tazocin 4.5g TDS IV (QDS if septic) × 7 days (Refer to C&S)'), c('If history of ESBL: use Meropenem 1g TDS IV. Review with C&S.')] },
      { cells: [c('Catheter-related UTI'), c('Tazocin 4.5g TDS IV (QDS if septic). Recommend to remove/change catheter'), c('Gentamicin')] },
      { cells: [c('Pyelonephritis'), c('Tazocin 4.5g QDS IV × 10–14 days'), c('')] },
      { cells: [c('Prostatitis'), c('Ciprofloxacin 500mg BD PO × 2–6 weeks (Refer to C&S)'), c('')] },
    ],
  },
  {
    key: 'resp',
    title: 'RESPIRATORY TRACT INFECTIONS',
    icon: 'lungs',
    color: '#1b5e20',
    bg: '#e8f5e9',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy', 'Comments'],
    widths: [180, 230, 200, 150],
    rows: [
      { section: 'Community Acquired Pneumonia (CAP)', bg: '#f1f3f5', color: '#212529' },
      { cells: [c('CAP — Low Severity (CURB 0–1)'), c('Amoxicillin 1g TDS PO × 5–7 days'), c('Doxycycline 200mg OD PO Day 1, then 100mg OD PO × 5–7 days'), c('')] },
      { cells: [c('CAP — Moderate Severity (CURB 2)'), c('Co-amoxiclav 625mg TDS PO + Doxycycline 100mg BD PO × 7–10 days'), c('Doxycycline 100mg BD PO × 7–10 days'), c('')] },
      { cells: [c('CAP — High Severity (CURB 3–5)'), c('Ceftriaxone 2g OD IV + Doxycycline 100mg BD PO × 7–10 days. ADD Metronidazole if aspiration pneumonia suspected. If Legionella: ADD Levofloxacin instead of Doxycycline'), c('Severe/anaphylaxis: Levofloxacin 500mg BD PO/IV × 7–10 days; ADD Metronidazole if aspiration suspected'), c('If oral route unavailable: use Clarithromycin IV. ADD Metronidazole if aspiration suspected')] },
      { cells: [c('Legionellosis'), c('Levofloxacin 500mg OD PO/IV (BD if severe). If suspected/confirmed: discuss with Microbiologist'), c(''), c('MRSA known/high risk: ADD Teicoplanin')] },
      { section: 'Healthcare Associated Pneumonia (HAP)', bg: '#f1f3f5', color: '#212529' },
      { cells: [c('HAP ≤48 hrs of admission'), c('As per CAP above. For nursing home patients or multiple hospitalisations, treat as >48 hrs.'), c(''), c('')] },
      { cells: [c('HAP >48 hrs since admission'), c('Tazocin 4.5g TDS IV × 7 days'), c('Levofloxacin 500mg OD PO/IV (BD if severe) × 7 days; ADD Metronidazole if aspiration suspected'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Acute exacerbation of COPD'), c('Co-amoxiclav 625mg TDS PO or 1.2g TDS IV × 5–7 days'), c('Doxycycline 100mg BD PO × 5–7 days'), c('')] },
      { cells: [c('Influenza'), c('Treatment: Oseltamivir 75mg BD PO × 5 days (longer if immunocompromised). Post-exposure prophylaxis: 75mg OD PO × 10 days'), c(''), c('See national guidelines')] },
    ],
  },
  {
    key: 'gi',
    title: 'INTRA-ABDOMINAL & GI INFECTIONS',
    icon: 'procedures',
    color: '#e65100',
    bg: '#fff3e0',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy', 'Comments'],
    widths: [160, 250, 180, 150],
    rows: [
      { cells: [c('Peritonitis, Diverticulitis, Biliary Tract, Pancreatitis'), c('Co-amoxiclav 1.2g TDS IV ± Gentamicin × 7–10 days'), c('Not severe: Cefuroxime 1.5g TDS + Metronidazole IV. Severe/anaphylaxis: Metronidazole IV + Gentamicin + Teicoplanin'), c('Use Amikacin instead of Gentamicin if MDRO suspected or severe sepsis')] },
      { cells: [c('Severe acute necrotising pancreatitis'), c('Firstline: Tazocin 4.5g TDS/QDS IV + Gentamicin'), c('Firstline: Cefuroxime 1.5g TDS + Metronidazole IV. Severe/anaphylaxis: Metronidazole IV + Gentamicin + Teicoplanin'), c('')] },
      { section: 'Clostridium difficile Infection (CDI)', bg: '#f1f3f5', color: '#212529' },
      { cells: [c('CDI — First episode or first recurrence (Mild–Moderate)'), c('Metronidazole 400mg TDS PO × 10–14 days (IV if PO unavailable). Secondline: Vancomycin 125mg QDS PO × 10–14 days'), c(''), c('')] },
      { cells: [c('CDI — Severe (uncomplicated)'), c('Vancomycin 125mg QDS PO × 10–14 days'), c(''), c('')] },
      { cells: [c('CDI — Severe complicated (hypotension, shock, elevated lactate, ileus, megacolon)'), c('Vancomycin 500mg QDS PO/IV (BD if severe) + Metronidazole 500mg TDS IV'), c(''), c('')] },
      { cells: [c('CDI — Second & subsequent episodes'), c('Option 1: Oral Vancomycin taper: 125mg QDS × 7d → BD × 7d → OD × 7d → alt. days × 7d → every 3 days × 2 doses. Option 2: Fidaxomicin 200mg BD PO × 10 days (discuss with Micro). Option 3: Vancomycin 125mg QDS PO × 10 days, then Rifaximin 400mg TDS PO × 20 days'), c('Fidaxomicin may be used if high risk of recurrence or concomitant antimicrobials — discuss with Micro'), c('')] },
    ],
  },
  {
    key: 'cns',
    title: 'CENTRAL NERVOUS SYSTEM',
    icon: 'brain',
    color: '#4527a0',
    bg: '#ede7f6',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy (Severe)', 'Comments'],
    widths: [140, 240, 200, 170],
    rows: [
      { cells: [c('Meningitis (bacterial)'), c('Ceftriaxone 2g BD IV + Amoxicillin 2g 4-hourly IV (if Listeria risk) + Vancomycin (if MRSA risk)'), c('Chloramphenicol 25mg/kg QDS IV. Non-immunocompromised: ADD Vancomycin + Co-trimoxazole 10mg/kg BD IV (if Listeria risk)'), c('Listeria risk factors: >60 years, diabetic, pregnant, immunocompromised, alcohol dependency')] },
      { cells: [c('Meningitis (viral)'), c('Supportive treatment — check PCR result on CSF if indicated'), c(''), c('')] },
      { cells: [c('Encephalitis'), c('Aciclovir 10mg/kg TDS IV'), c(''), c('')] },
    ],
  },
  {
    key: 'genital',
    title: 'GENITAL TRACT INFECTIONS',
    icon: 'venus',
    color: '#880e4f',
    bg: '#fce4ec',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy'],
    widths: [180, 250, 200],
    rows: [
      { cells: [c('Pelvic Inflammatory Disease, Salpingitis, Tubo-ovarian abscess'), c('Outpatient: Ceftriaxone 1g IM/IV stat, then Doxycycline 100mg BD PO + Metronidazole PO × 14 days. Inpatient: Ceftriaxone 1–2g OD IV + Doxycycline 100mg BD PO + Metronidazole PO × 14 days'), c('Clindamycin 900mg TDS IV + Gentamicin + Doxycycline 100mg BD PO + Metronidazole PO × 14 days')] },
    ],
  },
  {
    key: 'bone',
    title: 'BONE & JOINT INFECTIONS',
    icon: 'bone',
    color: '#6a1b9a',
    bg: '#f3e5f5',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy (Not severe)', 'PCN Allergy (Severe)', 'Comments'],
    widths: [150, 220, 200, 200, 160],
    rows: [
      { cells: [c('Osteomyelitis / Septic Arthritis'), c('Flucloxacillin 2g QDS IV + Sodium fucidate 500mg TDS PO × 4–6 weeks (Refer to C&S if available)'), c('Cefuroxime 1.5g TDS + Sodium fucidate 500mg TDS PO × 4–6 weeks'), c('Teicoplanin + Sodium fucidate 500mg TDS PO × 4–6 weeks'), c('Hold Statins while on Sodium fucidate. MRSA known/high risk: ADD Teicoplanin')] },
    ],
  },
  {
    key: 'skin',
    title: 'SKIN & SOFT TISSUE INFECTIONS',
    icon: 'user-injured',
    color: '#004d40',
    bg: '#e0f2f1',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy (Not severe)', 'PCN Allergy (Severe)', 'Comments'],
    widths: [170, 230, 210, 210, 160],
    rows: [
      { section: 'Cellulitis / Erysipelas', bg: '#f1f3f5', color: '#212529' },
      { cells: [c('Mild–Moderate'), c('Flucloxacillin 1–2g QDS IV × 7–10 days. If erysipelas: ADD Benzylpenicillin 1.2–2.4g QDS IV'), c('Cefuroxime 1.5g TDS IV × 7–10 days'), c('Clindamycin 600mg–1.2g QDS IV × 7–10 days'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Severe'), c('Flucloxacillin 2g QDS IV + Benzylpenicillin 2.4g QDS IV'), c('Clindamycin 1.2g QDS IV + Teicoplanin × 10–14 days'), c('Teicoplanin + Clindamycin 1.2g QDS IV + Benzylpenicillin × 10–14 days'), c('Group A Strep confirmed: consider de-escalation to Benzylpenicillin + Clindamycin')] },
      { cells: [c('Necrotising fasciitis / NSTi'), c('Tazocin 4.5g QDS IV + Clindamycin 1.2g QDS IV ± Gentamicin × 14+ days'), c('Meropenem 1g TDS IV + Clindamycin 1.2g QDS IV ± Gentamicin × 10–14 days'), c('Teicoplanin + Clindamycin 1.2g QDS IV + Metronidazole IV × 14+ days'), c('')] },
      { cells: [c('Human & animal bites'), c('Co-amoxiclav 625mg TDS PO (if severe: 1.2g TDS IV) × 5 days'), c('Doxycycline 100mg BD PO + Metronidazole 400mg TDS PO'), c('Doxycycline 100mg BD PO + Metronidazole 400mg TDS PO'), c('If severe: discuss with Micro')] },
      { section: 'Diabetic Foot Infection', bg: '#f1f3f5', color: '#212529' },
      { cells: [c('Mild/Superficial — Antibiotic naïve'), c('Flucloxacillin 1g QDS PO (or 1–2g QDS IV) × 5–7 days'), c('Doxycycline 100mg BD PO × 5–7 days'), c('Doxycycline 100mg BD PO × 5–7 days'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Mild/Superficial — Not antibiotic naïve'), c('Flucloxacillin 1–2g QDS IV × 5–7 days'), c('Doxycycline 100mg BD PO × 5–7 days'), c('Doxycycline 100mg BD PO × 5–7 days'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Moderate / Deep ulcer'), c('Co-amoxiclav 1.2g TDS IV'), c('Ciprofloxacin 500mg BD PO + Metronidazole 400mg TDS PO'), c('Ciprofloxacin 500mg BD PO + Metronidazole 400mg TDS PO'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Severe'), c('Tazocin 4.5g TDS IV ± Teicoplanin ± Gentamicin if unstable × 10–14 days'), c('Gentamicin + Metronidazole IV + Teicoplanin × 10–14 days'), c('Gentamicin + Metronidazole IV + Teicoplanin × 10–14 days'), c('MRSA known/high risk: ADD Teicoplanin')] },
      { cells: [c('Osteomyelitis (Diabetic Foot)'), c('Co-amoxiclav 1.2g TDS IV or Tazocin 4.5g TDS/QDS IV'), c('Ciprofloxacin + Metronidazole + Teicoplanin × 4–6 weeks'), c('Ciprofloxacin + Metronidazole + Teicoplanin × 4–6 weeks'), c('')] },
    ],
  },
  {
    key: 'ent',
    title: 'ENT INFECTIONS',
    icon: 'assistive-listening-systems',
    color: '#1a237e',
    bg: '#e8eaf6',
    headers: ['Condition', 'Antibiotic', 'PCN Allergy'],
    widths: [160, 230, 200],
    rows: [
      { cells: [c('Acute Epiglottitis'), c('Ceftriaxone 2g BD IV'), c('Clindamycin 1.2g QDS IV + Ciprofloxacin 400mg BD IV')] },
      { cells: [c('Tonsillitis / Pharyngitis'), c('Phenoxymethylpenicillin 666mg QDS PO × 10 days. If severe: Benzylpenicillin 1.2–2.4g QDS IV'), c('Clarithromycin 500mg BD PO/IV × 10 days')] },
      { cells: [c('Sinusitis / Otitis media'), c('Co-amoxiclav 1.2g TDS IV × 5–7 days'), c('Clarithromycin 500mg BD PO × 5–7 days')] },
    ],
  },
];

// ───────────────────────────────────────────────────────────────
// Principles cards
// ───────────────────────────────────────────────────────────────
function PrinciplesCard({ title, icon, headerColor, headerTextColor = '#fff', children, borderColor }) {
  return (
    <View style={[styles.princCard, { borderColor }]}>
      <View style={[styles.princHeader, { backgroundColor: headerColor }]}>
        <FontAwesome5 name={icon} size={13} color={headerTextColor} style={{ marginRight: 8 }} />
        <Text style={[styles.princHeaderText, { color: headerTextColor }]}>{title}</Text>
      </View>
      <View style={styles.princBody}>{children}</View>
    </View>
  );
}

const Bullet = ({ children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletDot}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Numbered = ({ n, children }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletNum}>{n}.</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const TABS = [
  { key: 'prophylaxis', title: 'Surgical Prophylaxis', icon: 'shield-virus' },
  { key: 'empiric', title: 'Empiric Therapy', icon: 'prescription-bottle' },
  { key: 'principles', title: 'Principles', icon: 'lightbulb' },
];

export default function AntimicrobialsScreen() {
  const [activeTab, setActiveTab] = useState('prophylaxis');

  return (
    <ScreenWrapper title="Antimicrobial Guidelines" subtitle="Antimicrobial Stewardship Team" icon="bacterium">
      <View style={styles.alertWarn}>
        <FontAwesome5 name="exclamation-triangle" size={13} color="#856404" style={{ marginRight: 8, marginTop: 2 }} />
        <Text style={styles.alertWarnText}>
          Always consider patient-specific factors: organ function, allergies, interactions, cultures, and local resistance patterns. Consult Microbiology for complex cases.
        </Text>
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} onPress={() => setActiveTab(tab.key)} style={[styles.tabBtn, active && styles.tabBtnActive]}>
              <FontAwesome5 name={tab.icon} size={12} color={active ? COLORS.white : COLORS.textMuted} style={styles.tabIcon} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.title}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* TAB 1: PROPHYLAXIS */}
      {activeTab === 'prophylaxis' && (
        <View>
          <Text style={styles.noteText}>Surgical Prophylaxis Flashcard 2019 — Antimicrobial Stewardship Team, QS 000503, Review Aug 2021</Text>

          <View style={styles.legendRow}>
            <View style={[styles.legendBadge, { backgroundColor: '#198754' }]}><Text style={styles.legendBadgeText}>1st Choice</Text></View>
            <View style={[styles.legendBadge, { backgroundColor: '#ffc107' }]}><Text style={[styles.legendBadgeText, { color: '#212529' }]}>PCN Allergy (not severe)</Text></View>
            <View style={[styles.legendBadge, { backgroundColor: '#dc3545' }]}><Text style={styles.legendBadgeText}>Severe Allergy / Anaphylaxis</Text></View>
          </View>

          <DataTable headers={PROPHYLAXIS_HEADERS} rows={PROPHYLAXIS_ROWS} columnWidths={PROPHYLAXIS_WIDTHS} headerColors={PROPHYLAXIS_HEADER_COLORS} />

          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <FontAwesome5 name="star" size={13} color="#212529" style={{ marginRight: 8 }} />
              <Text style={styles.tipsHeaderText}>Top Tips</Text>
            </View>
            <View style={styles.tipsBody}>
              {PROPHYLAXIS_TIPS.map((tip, i) => <Bullet key={i}>{tip}</Bullet>)}
            </View>
          </View>
        </View>
      )}

      {/* TAB 2: EMPIRIC THERAPY */}
      {activeTab === 'empiric' && (
        <View>
          <Text style={styles.noteText}>Start Smart Then Focus — Empiric Antimicrobial Quick Reference — Antimicrobial Advisory Team, Review: June 2020, QS: 000517</Text>
          {EMPIRIC_SECTIONS.map((section, idx) => (
            <CollapsibleCard
              key={section.key}
              title={section.title}
              icon={section.icon}
              iconColor={section.color}
              defaultOpen={idx === 0}
            >
              <DataTable headers={section.headers} rows={section.rows} columnWidths={section.widths} />
            </CollapsibleCard>
          ))}
        </View>
      )}

      {/* TAB 3: PRINCIPLES */}
      {activeTab === 'principles' && (
        <View>
          <PrinciplesCard title="Time 0: START SMART" icon="clock" headerColor="#198754" borderColor="#198754">
            <Numbered n={1}>Start antimicrobials only if there is clinical evidence of infection</Numbered>
            <Numbered n={2}>Get appropriate cultures before starting antibiotics</Numbered>
            <Numbered n={3}>Review previous micro results</Numbered>
            <Numbered n={4}>Document indication and treatment details in drug chart and clinical notes</Numbered>
            <Numbered n={5}>Ensure antibiotics administered within 4 hours (within 1 hour for sepsis)</Numbered>
            <Text style={styles.princFootnote}>*Adapted from Start Smart then Focus RCSI/RCPI 2012</Text>
          </PrinciplesCard>

          <PrinciplesCard title="Time 24–48 hrs: THEN FOCUS" icon="microscope" headerColor={COLORS.primary} borderColor={COLORS.primary}>
            <Text style={styles.princText}>Review diagnosis and lab/radiology results. Refer to cultures taken at Time 0.</Text>
            <Text style={[styles.princText, { fontWeight: '700', marginTop: 4 }]}>THEN decide and document:</Text>
            <Numbered n={1}>Stop antibiotics</Numbered>
            <Numbered n={2}>Switch from IV to PO</Numbered>
            <Numbered n={3}>Change antibiotic to narrower spectrum if possible, or broader spectrum if indicated</Numbered>
            <Numbered n={4}>Continue antibiotics</Numbered>
            <Numbered n={5}>Consider OPAT</Numbered>
          </PrinciplesCard>

          <PrinciplesCard title="Penicillin Allergy — Quick Reference" icon="allergies" headerColor="#ffc107" headerTextColor="#212529" borderColor="#ffc107">
            <View style={[styles.allergyBox, { borderColor: '#198754' }]}>
              <Text style={[styles.allergyTitle, { color: '#157347' }]}>Not Allergic</Text>
              <Text style={styles.allergyText}>Use 1st-line agent as listed</Text>
            </View>
            <View style={[styles.allergyBox, { borderColor: '#ffc107' }]}>
              <Text style={[styles.allergyTitle, { color: '#997404' }]}>PCN Allergy — not severe</Text>
              <Text style={styles.allergyText}>Cephalosporins are generally safe (cross-reactivity {'<'}2%). Use column 4 alternatives.</Text>
            </View>
            <View style={[styles.allergyBox, { borderColor: '#dc3545' }]}>
              <Text style={[styles.allergyTitle, { color: '#dc3545' }]}>Severe Hypersensitivity / Anaphylaxis</Text>
              <Text style={styles.allergyText}>Avoid all beta-lactams. Use column 5 alternatives. Discuss with Microbiology.</Text>
            </View>
          </PrinciplesCard>

          <PrinciplesCard title="MRSA Considerations" icon="bug" headerColor="#dc3545" borderColor="#dc3545">
            <Bullet>Add Teicoplanin if MRSA known or high risk (unless already covered)</Bullet>
            <Bullet>Use Amikacin instead of Gentamicin if MDRO suspected or severe sepsis</Bullet>
            <Bullet>Consider adding Vancomycin to surgical prophylaxis if MRSA colonisation/risk factors present and screening unavailable</Bullet>
            <Bullet>Review cultures and escalate/de-escalate accordingly at 24–48 hours</Bullet>
          </PrinciplesCard>

          <PrinciplesCard title="Gentamicin Dosing Notes" icon="info-circle" headerColor={COLORS.info} borderColor={COLORS.info}>
            <Bullet>Extended interval dosing preferred: 5–7 mg/kg OD IV (or as per local guidelines)</Bullet>
            <Bullet>In pregnancy: 3–5 mg/kg (booking weight) OD IV, max 400mg</Bullet>
            <Bullet>Monitor levels and renal function — avoid prolonged courses</Bullet>
            <Bullet>Use Amikacin if MDRO/severe sepsis</Bullet>
          </PrinciplesCard>
        </View>
      )}
    </ScreenWrapper>
  );
}

var styles = StyleSheet.create({
  alertWarn: {
    backgroundColor: '#fff3cd',
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertWarnText: { color: '#856404', fontSize: 12, lineHeight: 17, flex: 1 },
  tabBar: { flexDirection: 'row', marginBottom: SPACING.md, flexWrap: 'wrap', gap: 6 },
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
  tabBtnActive: { backgroundColor: '#0d7e83', borderColor: '#0d7e83' },
  tabIcon: { marginRight: 6 },
  tabText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  tabTextActive: { color: COLORS.white },
  noteText: { fontSize: 11, color: COLORS.textMuted, fontStyle: 'italic', marginBottom: SPACING.sm },
  legendRow: { flexDirection: 'row', gap: 6, marginBottom: SPACING.sm },
  legendBadge: { flex: 1, borderRadius: 4, paddingVertical: 5, alignItems: 'center', justifyContent: 'center' },
  legendBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '700', textAlign: 'center' },
  // Table
  tableScrollContent: { paddingBottom: 2 },
  table: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden' },
  headerRow: { flexDirection: 'row', backgroundColor: '#343a40' },
  headerCell: { padding: 8, color: COLORS.white, fontWeight: '700', fontSize: 11, textAlignVertical: 'top' },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altRow: { backgroundColor: '#f8f9fa' },
  dataCell: { padding: 8, fontSize: 11, color: COLORS.text, lineHeight: 15, textAlignVertical: 'top' },
  sectionRow: { flexDirection: 'row' },
  sectionCell: { paddingVertical: 6, paddingHorizontal: 8, fontSize: 11, fontWeight: '700' },
  // Tips
  tipsCard: { borderWidth: 1, borderColor: '#ffc107', borderRadius: 8, marginTop: SPACING.md, overflow: 'hidden' },
  tipsHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffc107', paddingVertical: 8, paddingHorizontal: SPACING.sm },
  tipsHeaderText: { fontWeight: '700', fontSize: 13, color: '#212529' },
  tipsBody: { padding: SPACING.sm },
  // Principles
  princCard: { borderWidth: 1, borderRadius: 8, marginBottom: SPACING.md, overflow: 'hidden', ...SHADOW },
  princHeader: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: SPACING.sm },
  princHeaderText: { fontWeight: '700', fontSize: 13 },
  princBody: { padding: SPACING.sm, backgroundColor: COLORS.white },
  princText: { fontSize: 13, color: COLORS.text, lineHeight: 18 },
  princFootnote: { fontSize: 10, color: COLORS.textMuted, marginTop: 6 },
  bulletRow: { flexDirection: 'row', marginBottom: 5, paddingRight: 4 },
  bulletDot: { fontSize: 13, color: COLORS.text, marginRight: 6, lineHeight: 18 },
  bulletNum: { fontSize: 13, color: COLORS.text, marginRight: 6, lineHeight: 18, fontWeight: '700', minWidth: 16 },
  bulletText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 18 },
  allergyBox: { borderWidth: 1, borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm, backgroundColor: '#f8f9fa' },
  allergyTitle: { fontWeight: '700', fontSize: 13, marginBottom: 3 },
  allergyText: { fontSize: 12, color: COLORS.text, lineHeight: 17 },
});
