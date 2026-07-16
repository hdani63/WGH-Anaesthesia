// Icon grid for the Sepsis / Antimicrobial Guidelines landing screen.
// Mirrors templates/antimicrobials.html (order, labels and colours) from the
// Flask app, so the two stay recognisably the same product.
//
// The web page uses FontAwesome 6 names; @expo/vector-icons ships FontAwesome 5,
// where several of those don't exist. `lib: 'mci'` marks tiles that fall back to
// MaterialCommunityIcons for the closest equivalent glyph.

export const UHW_TILES = [
  { label: 'General Guidance', section: 'uhw-general-guidance', color: '#7B8C3F', icon: 'book-medical' },
  { label: 'Therapeutic Drug Monitoring', section: 'uhw-therapeutic-drug-monitoring', color: '#1AB7A6', icon: 'flask' },
  // Mirrors the web app: the IV→PO switch guidance lives inside the TDM section.
  { label: 'IV to PO Switch', section: 'uhw-therapeutic-drug-monitoring', color: '#8E9CA8', icon: 'pills' },
  { label: 'Sepsis', section: 'uhw-sepsis', color: '#1A237E', icon: 'virus', bold: true },
  // fa-person-pregnant (FA6) has no FA5 equivalent.
  { label: 'Sepsis in Pregnancy', section: 'uhw-sepsis-in-pregnancy', color: '#880E4F', icon: 'human-pregnant', lib: 'mci' },
  { label: 'Postpartum Sepsis (≤42 days)', section: 'uhw-postpartum-sepsis', color: '#C62828', icon: 'heart' },
  { label: 'Positive Blood Cultures', section: 'uhw-positive-blood-cultures', color: '#B71C1C', icon: 'vials' },
  { label: 'Respiratory Tract Infection', section: 'uhw-respiratory-tract', color: '#33691E', icon: 'lungs' },
  // fa-heart-crack (FA6) -> heart-broken (FA5)
  { label: 'Infective Endocarditis', section: 'uhw-infective-endocarditis', color: '#C62828', icon: 'heart-broken' },
  // fa-droplet (FA6) -> tint (FA5)
  { label: 'Urinary Tract Infection', section: 'uhw-urinary-tract-infection', color: '#2E7D32', icon: 'tint' },
  { label: 'Genital Tract Infection', section: 'uhw-genital-tract', color: '#9E9D24', icon: 'venus-mars' },
  { label: 'Intra-abdominal Infections', section: 'uhw-intra-abdominal', color: '#6D4C41', icon: 'x-ray' },
  // fa-stomach is not in FA5 Free.
  { label: 'Gastro-intestinal Infection', section: 'uhw-gastro-intestinal', color: '#AD1457', icon: 'stomach', lib: 'mci' },
  { label: 'Bone and Joint Infections', section: 'uhw-bone---joint', color: '#546E7A', icon: 'bone' },
  { label: 'Skin & Soft Tissue', section: 'uhw-skin---soft-tissue', color: '#6A1B9A', icon: 'shoe-prints' },
  { label: 'CNS & ENT', section: 'uhw-cns---ent', color: '#D81B60', icon: 'brain' },
  { label: 'Obstetrics', section: 'uhw-obstetrics', color: '#BF360C', icon: 'baby' },
  // fa-scissors (FA6) -> cut (FA5)
  { label: 'Surgical Prophylaxis', section: 'uhw-surgical-prophylaxis', color: '#1565C0', icon: 'cut' },
  // fa-triangle-exclamation (FA6) -> exclamation-triangle (FA5)
  { label: 'Penicillin Allergy', section: 'uhw-penicillin-allergy', color: '#E65100', icon: 'exclamation-triangle' },
  { label: 'Microbiology Consult', section: 'uhw-microbiology-consult', color: '#37474F', icon: 'microscope' },
  { label: 'Malaria', section: 'uhw-malaria', color: '#827717', icon: 'bug' },
];
