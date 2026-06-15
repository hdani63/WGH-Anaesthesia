import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, StatusBar, Linking, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

// ---------------------------------------------------------------------------
// Reusable presentational helpers (local to this screen)
// ---------------------------------------------------------------------------

function DataTable({ headers, rows, columnWidths, headerColor }) {
  const widths = columnWidths || headers.map((_, idx) => (idx === 0 ? 180 : 150));

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
      <View style={styles.table}>
        <View style={[styles.headerRow, headerColor && { backgroundColor: headerColor }]}>
          {headers.map((h, i) => (
            <Text key={i} style={[styles.headerCell, { width: widths[i], minWidth: widths[i] }]}>{h}</Text>
          ))}
        </View>
        {rows.map((row, i) => (
          <View key={i} style={[styles.dataRow, i % 2 === 0 && styles.altRow, row.rowBg && { backgroundColor: row.rowBg }]}>
            {(row.cells || row).map((cell, j) => (
              <Text key={j} style={[styles.dataCell, { width: widths[j], minWidth: widths[j] }, row.textColor && { color: row.textColor }]}>{cell}</Text>
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

function AlertBox({ children, bgColor, borderColor, textColor, icon }) {
  return (
    <View style={[styles.alertBox, { backgroundColor: bgColor, borderLeftColor: borderColor }]}>
      {icon ? <FontAwesome5 name={icon} size={13} color={textColor} style={styles.alertIcon} /> : null}
      <Text style={[styles.alertText, { color: textColor }]}>{children}</Text>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Reference Guide content
// ---------------------------------------------------------------------------

function ReferenceGuide() {
  return (
    <ScrollView style={styles.refScroll} contentContainerStyle={styles.refContent} showsVerticalScrollIndicator={true}>
      <AlertBox
        bgColor="#e8f4fd"
        borderColor={COLORS.info}
        textColor="#0c5460"
        icon="info-circle"
      >
        <Text style={styles.bold}>Reference only. </Text>
        All target concentrations and infusion rates are indicative starting ranges. Titrate to clinical effect and validated monitoring (BIS/entropy). The treating clinician bears full responsibility for all drug administration decisions.
      </AlertBox>

      {/* OVERVIEW */}
      <CollapsibleCard title="TIVA Overview & Clinical Advantages" icon="info-circle" iconColor="#6f42c1" defaultOpen>
        <InfoBox
          title="Advantages of TIVA over Volatile Anaesthesia"
          color={COLORS.success}
          bgColor="#eefaf0"
          items={[
            'PONV reduction: Propofol has intrinsic antiemetic properties — significantly lower PONV vs volatile agents',
            'Awareness: TCI allows precise, predictable plasma/effect-site concentrations',
            'Smooth emergence: No excitement or agitation; faster return to baseline cognitive function',
            'No pollution: No theatre contamination; preferred for MRI / remote anaesthesia',
            'Malignant hyperthermia (MH): Safe in MH-susceptible patients — no triggering agents',
            'Airway reactivity: Propofol blunts airway reflexes — preferred in reactive airways/asthma',
            'Neurophysiology: Does not suppress MEPs — preferred for spinal cord monitoring',
            'Intracranial pressure: Reduces ICP and CMRO₂ — preferred in neuro-anaesthesia',
          ]}
        />
        <InfoBox
          title="Limitations & Precautions"
          color={COLORS.warning}
          bgColor="#fff9e6"
          items={[
            'PRIS: Risk with >5 mg/kg/h for >48 h — metabolic acidosis, rhabdomyolysis, cardiac failure',
            'No depth surrogate: No volatile end-tidal — require BIS/entropy or clinical vigilance',
            'IV access dependency: Disconnection causes immediate underdosing — check lines regularly',
            'Lipid load: Propofol 1% = 0.1 g lipid/mL (1.1 kcal/mL)',
            'Egg/soya allergy: Propofol contains soya/egg lecithin — exercise caution',
            'OIH risk: Prolonged high-dose remifentanil — mitigate with ketamine',
          ]}
        />
      </CollapsibleCard>

      {/* TCI MODELS */}
      <CollapsibleCard title="TCI Models — Pharmacokinetic Overview" icon="chart-line" iconColor={COLORS.primary}>
        <DataTable
          headers={['Drug', 'Model', 'Input Variables', 'Target', 'Notes']}
          columnWidths={[150, 130, 150, 180, 240]}
          rows={[
            ['Propofol', 'Marsh', 'Weight only', 'Plasma (Cp)', 'Simpler, older model. Over-predicts in elderly/obese. Plasma targeting only.'],
            ['Propofol', 'Schnider', 'Age, weight, height, sex', 'Effect-site (Ce) — preferred', 'Accounts for age-related PK changes. Effect-site targeting available. Preferred model.'],
            ['Remifentanil', 'Minto', 'Age, weight, height, sex', 'Effect-site (Ce) — preferred', 'Lean body mass based. Context-insensitive half-life ~3–5 min. Rapid Ce equilibration.'],
            ['Propofol (Paeds)', 'Kataria / Paedfusor', 'Age, weight', 'Plasma (Cp)', 'Do not use Marsh/Schnider in children. Higher propofol requirements in paediatrics.'],
          ]}
        />
        <View style={styles.tableNote}>
          <Text style={styles.tableNoteText}>
            <Text style={styles.bold}>Effect-site vs plasma targeting: </Text>
            Effect-site (Ce) drives higher initial plasma concentration to rapidly achieve target brain concentration — faster induction, more cardiovascular impact. Plasma targeting (Cp) is slower and smoother. Ce preferred when pump supports it.
          </Text>
        </View>
      </CollapsibleCard>

      {/* PROPOFOL TARGETS */}
      <CollapsibleCard title="Propofol — TCI Targets & Infusion Rates" icon="tint" iconColor={COLORS.info}>
        <DataTable
          headers={['Clinical State', 'Schnider Ce (µg/mL)', 'Marsh Cp (µg/mL)', 'Manual (mg/kg/h)', 'Notes']}
          headerColor={COLORS.info}
          columnWidths={[200, 150, 150, 150, 240]}
          rows={[
            ['Induction', '4–8', '4–8', 'Bolus 1.5–2.5 mg/kg', 'Lower for elderly/frail. Co-induction with remifentanil reduces requirement ~30–50%.'],
            ['Maintenance (with remifentanil)', '2.5–4', '3–5', '4–10', 'Standard TIVA. Increase with high stimulation; reduce during minimal-stimulus phases.'],
            ['Maintenance (no opioid)', '4–6', '4–6', '6–12', 'Higher requirement without synergy.'],
            ['Procedural sedation', '1–2.5', '1–2', '1–4', 'Start low, titrate. Maintain verbal contact. Airway kit available.'],
            ['ICU sedation', '—', '—', '0.3–4 (max 4)', 'Max 4 mg/kg/h. Do not exceed 5 mg/kg/h or use >48 h (PRIS).'],
            ['Elderly / ASA III–IV', 'Reduce all targets by 20–50%', '', '', 'Always titrate — reduced Vd, cardiac output, protein binding.'],
          ]}
        />
        <View style={styles.tableNote}>
          <Text style={styles.tableNoteText}>
            <Text style={styles.bold}>Bristol manual regimen (no TCI pump): </Text>
            Bolus induction → 10 mg/kg/h × 10 min → 8 mg/kg/h × 10 min → 6 mg/kg/h ongoing. Adjust to clinical response.
          </Text>
        </View>
      </CollapsibleCard>

      {/* REMIFENTANIL TARGETS */}
      <CollapsibleCard title="Remifentanil — TCI Targets & Infusion Rates" icon="wind" iconColor={COLORS.success}>
        <DataTable
          headers={['Clinical State', 'Minto Ce (ng/mL)', 'Manual (mcg/kg/min)', 'Notes']}
          headerColor={COLORS.success}
          columnWidths={[210, 150, 170, 260]}
          rows={[
            ['Co-induction / intubation', '4–8', '0.25–0.5\n(Start 3–5 min before laryngoscopy)', 'Blunts sympathetic response. Allow Ce equilibration before airway manipulation.'],
            ['Maintenance — light stimulus', '1–3', '0.05–0.1', 'Tunnelling, positioning, minimal stimulation.'],
            ['Maintenance — moderate stimulus', '3–5', '0.1–0.25', 'Standard abdominal/orthopaedic cases.'],
            ['Maintenance — high stimulus', '5–8', '0.25–0.5', 'Laparoscopy insufflation, thoracic, cardiac bypass.'],
            ['AFOI sedation', '1–3\n(maintain consciousness)', '0.05–0.1', 'With midazolam 1–2 mg IV. Topicalise airway. Patient must remain cooperative.'],
            ['Elderly', 'Reduce all targets by 30–50%', '', 'Pronounced bradycardia/hypotension. Start at lowest end.'],
          ]}
        />
        <AlertBox
          bgColor="#f8d7da"
          borderColor={COLORS.danger}
          textColor="#721c24"
          icon="exclamation-triangle"
        >
          <Text style={styles.bold}>No residual analgesia: </Text>
          Remifentanil offset in 3–5 min. <Text style={styles.bold}>Always establish alternative analgesia 20–30 min before stopping</Text> (morphine 0.05–0.1 mg/kg, paracetamol, NSAID, +/− ketamine). Failure causes immediate severe pain on emergence.
        </AlertBox>
      </CollapsibleCard>

      {/* MANUAL INFUSION RATES */}
      <CollapsibleCard title="Manual Infusion Rates (Without TCI Pump)" icon="calculator" iconColor={COLORS.textMuted}>
        <DataTable
          headers={['Drug / Concentration', 'Infusion Rate', 'Volume (mL/kg/h)', 'Notes']}
          headerColor={COLORS.textMuted}
          columnWidths={[210, 170, 150, 260]}
          rows={[
            ['Propofol 1% (10 mg/mL)', '4–10 mg/kg/h', '0.4–1.0', 'Bristol regimen: 10 → 8 → 6 mg/kg/h at 10 min intervals. Adjust to clinical response.'],
            ['Propofol 2% (20 mg/mL)', '4–10 mg/kg/h', '0.2–0.5', 'Same dose in mg/kg/h — half the mL/h rate vs 1%. Preferred for long cases.'],
            ['Remifentanil 25 mcg/mL\n(5 mg in 200 mL 0.9% NaCl)', '0.05–0.5 mcg/kg/min', '0.12–1.2', 'Start 0.1 mcg/kg/min. Titrate every 5 min. Avoid boluses.'],
            ['Remifentanil 50 mcg/mL\n(5 mg in 100 mL 0.9% NaCl)', '0.05–0.5 mcg/kg/min', '0.06–0.6', 'Half the mL/h rate of 25 mcg/mL for same dose.'],
            ['Ketamine (adjunct)', '0.1–0.3 mg/kg/h', 'Varies', 'Loading dose 0.1–0.3 mg/kg IV. Reduces OIH. Consider midazolam to reduce dysphoria.'],
          ]}
        />
        <View style={styles.tableNote}>
          <Text style={styles.tableNoteText}>
            <Text style={styles.bold}>Calculation: </Text>
            mg/kg/h × weight (kg) = mg/h  →  ÷ concentration (mg/mL) = mL/h{'\n'}
            <Text style={styles.italic}>Example — Propofol 6 mg/kg/h, 70 kg, 1% (10 mg/mL): 6 × 70 = 420 mg/h ÷ 10 = </Text>
            <Text style={styles.bold}>42 mL/h</Text>
          </Text>
        </View>
      </CollapsibleCard>

      {/* BIS MONITORING */}
      <CollapsibleCard title="Depth of Anaesthesia — BIS & Entropy Reference" icon="brain" iconColor={COLORS.warning}>
        <DataTable
          headers={['BIS Value', 'Clinical State', 'Action']}
          headerColor={COLORS.warning}
          columnWidths={[110, 200, 260]}
          rows={[
            { cells: ['80–100', 'Light sedation / awake', 'Increase propofol if GA intended'], rowBg: '#f8d7da' },
            { cells: ['60–80', 'Light anaesthesia', 'Risk of awareness — increase depth'], rowBg: '#fff3cd' },
            { cells: ['40–60', 'Optimal GA range', 'Target range. Minimises awareness without excess depth.'], rowBg: '#d4edda' },
            { cells: ['20–40', 'Deep / burst suppression', 'Reduce propofol. Associated with increased 1-year mortality.'], rowBg: '#d1ecf1' },
            { cells: ['<20', 'Iso-electric (cortical silence)', 'Intentional for neuroprotection only. Otherwise reduce/stop propofol immediately.'], rowBg: '#343a40', textColor: COLORS.white },
          ]}
        />
        <InfoBox
          title="BIS Monitor"
          color={COLORS.info}
          bgColor="#eef7ff"
          items={[
            'Processed EEG (0–100). SQI must be >80%.',
            'Less reliable with ketamine (raises BIS) and N₂O.',
            'EMG artefact falsely elevates reading — check EMG bar.',
            'Use alongside haemodynamics, not in isolation.',
          ]}
        />
        <InfoBox
          title="Entropy (GE)"
          color={COLORS.textMuted}
          bgColor="#f1f3f5"
          items={[
            'SE (State Entropy): 0–91 — target 40–60 for GA.',
            'RE (Response Entropy): 0–100 — includes EMG.',
            'RE − SE gap >10 = facial EMG / impending movement.',
          ]}
        />
        <AlertBox
          bgColor="#fff3cd"
          borderColor={COLORS.warning}
          textColor="#856404"
          icon="exclamation-triangle"
        >
          <Text style={styles.bold}>Awareness during TIVA: </Text>
          No volatile end-tidal surrogate — BIS is especially important. Risk factors: muscle relaxation without adequate depth, pump disconnection, obesity, opioid tolerance.
        </AlertBox>
      </CollapsibleCard>

      {/* SAFETY CHECKLIST */}
      <CollapsibleCard title="TIVA Safety Checklist" icon="check-square" iconColor={COLORS.success}>
        <InfoBox
          title="Setup"
          color={COLORS.success}
          bgColor="#eefaf0"
          items={[
            '☐ TCI model confirmed (Schnider/Minto)',
            '☐ Demographics entered correctly',
            '☐ Drug concentrations labelled',
            '☐ Anti-reflux valves on IV lines',
            '☐ Dedicated IV access for TIVA',
            '☐ Cannula patent — no infiltration',
            '☐ BIS/entropy applied, SQI >80%',
          ]}
        />
        <InfoBox
          title="During Case"
          color={COLORS.warning}
          bgColor="#fff9e6"
          items={[
            '☐ Lines visible and unkinked',
            '☐ Pump alarms enabled and audible',
            '☐ BIS 40–60 maintained',
            '☐ Haemodynamic response monitored',
            '☐ Syringe volumes checked regularly',
            '☐ Syringe changes staggered',
            '☐ Remifentanil running continuously',
          ]}
        />
        <InfoBox
          title="Emergence"
          color={COLORS.danger}
          bgColor="#fff5f5"
          items={[
            '☐ Rescue analgesia 20–30 min before end',
            '☐ Antiemetics given',
            '☐ NMB reversal plan ready',
            '☐ PACU aware — no residual remi analgesia',
            '☐ Post-op analgesia prescription written',
            '☐ TIVA technique + BIS documented',
            '☐ Total propofol dose recorded',
          ]}
        />
      </CollapsibleCard>

      {/* SYNERGY & INTERACTIONS */}
      <CollapsibleCard title="Pharmacodynamic Synergy & Interactions" icon="atom" iconColor={COLORS.danger}>
        <DataTable
          headers={['Combination', 'Effect', 'Clinical Relevance']}
          headerColor={COLORS.danger}
          columnWidths={[210, 230, 280]}
          rows={[
            ['Propofol + Remifentanil', 'Synergistic (supra-additive) for unconsciousness', 'Major dose reduction possible. Cardiovascular depression additive — vasopressor ready.'],
            ['Propofol + Midazolam', 'Synergistic for loss of consciousness', '1–2 mg midazolam IV at co-induction reduces propofol dose ~30%.'],
            ['Ketamine + Propofol ("ketofol")', 'Antagonistic cardiovascular effects', "Ketamine's sympathomimetic properties partially offset propofol hypotension."],
            ['Remifentanil (prolonged) → OIH', 'NMDA-mediated central sensitisation', 'Mitigate with ketamine 0.1–0.3 mg/kg/h and multimodal post-op analgesia.'],
          ]}
        />
      </CollapsibleCard>

      {/* REFERENCES */}
      <View style={styles.refBox}>
        <View style={styles.infoTitleRow}>
          <FontAwesome5 name="book-open" size={13} color={COLORS.medicalBlue} style={styles.infoTitleIcon} />
          <Text style={styles.refTitle}>References</Text>
        </View>
        <Text style={styles.refText}>
          Absalom & Struys — An Overview of TCI & TIVA (4th ed.) | Schnider TW et al. Anesthesiology 1998/1999 | Minto CF et al. Anesthesiology 1997 | Marsh B et al. Br J Anaesth 1991 | AAGBI Safety Guideline: TIVA 2018
        </Text>
      </View>
    </ScrollView>
  );
}

// ---------------------------------------------------------------------------
// Main screen
// ---------------------------------------------------------------------------

export default function ITIVAScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('simulator');
  const [loading, setLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setLoading(false);
      setEmbedError(true);
    }, 10000);
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleLoadSuccess = () => {
    clearTimeout(timeoutRef.current);
    setLoading(false);
  };

  const handleLoadError = () => {
    clearTimeout(timeoutRef.current);
    setLoading(false);
    setEmbedError(true);
  };

  const tabs = [
    { key: 'simulator', title: 'Simulator', icon: 'external-link-square-alt' },
    { key: 'reference', title: 'Reference Guide', icon: 'book-open' },
  ];

  return (
    <LinearGradient
      colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerGradientStart} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* App header — matches ScreenWrapper */}
        <LinearGradient
          colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.appHeader}
        >
          <View style={styles.appHeaderLeft}>
            <View style={styles.appHeaderIconWrap}>
              <FontAwesome5 name="stethoscope" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.appHeaderTitle}>Anaesthesia Companion</Text>
              <Text style={styles.appHeaderSubtitle}>Anaesthesia Companion App</Text>
            </View>
          </View>
          <FontAwesome5 name="hospital" size={38} color="rgba(255,255,255,0.8)" />
        </LinearGradient>

        {/* Page header card — matches ScreenWrapper pageHeader */}
        <View style={styles.pageHeaderWrap}>
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderRow}>
              <View style={styles.pageHeadingWrap}>
                <View style={styles.pageTitleRow}>
                  <FontAwesome5 name="flask" size={18} color={COLORS.medicalBlue} style={styles.pageIcon} />
                  <Text style={styles.pageTitle}>iTIVA</Text>
                </View>
                <Text style={styles.pageSubtitle}>Simulator & Reference</Text>
              </View>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <FontAwesome5 name="arrow-left" size={14} color={COLORS.primary} style={styles.backIcon} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>

            {/* Tab switcher */}
            <View style={styles.tabBar}>
              {tabs.map((tab) => {
                const active = activeTab === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    onPress={() => setActiveTab(tab.key)}
                    style={[styles.tabBtn, active && styles.tabBtnActive]}
                    activeOpacity={0.7}
                  >
                    <FontAwesome5 name={tab.icon} size={12} color={active ? COLORS.white : COLORS.textMuted} style={styles.tabIcon} />
                    <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.title}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Content area */}
        <View style={styles.contentContainer}>
          {/* Simulator tab — kept mounted so the WebView does not reload on tab switch */}
          <View style={[styles.tabPane, activeTab !== 'simulator' && styles.hiddenPane]}>
            {loading && !embedError && (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading simulator...</Text>
              </View>
            )}

            {embedError ? (
              <View style={styles.errorContainer}>
                <FontAwesome5 name="exclamation-triangle" size={48} color="#f0ad4e" style={styles.errorIcon} />
                <Text style={styles.errorTitle}>Unable to load inside the app</Text>
                <Text style={styles.errorMessage}>
                  simtiva.app has restricted in-app embedding. Use the button below to open it directly.
                </Text>
                <TouchableOpacity
                  style={styles.openButton}
                  onPress={() => Linking.openURL('https://simtiva.app/')}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 name="external-link-alt" size={14} color={COLORS.white} style={styles.openButtonIcon} />
                  <Text style={styles.openButtonText}>Open simtiva.app</Text>
                </TouchableOpacity>
                <View style={styles.aboutBlurb}>
                  <Text style={styles.aboutText}>
                    <Text style={styles.aboutBold}>About SimTIVA: </Text>
                    A free pharmacokinetic simulator for TIVA planning, covering propofol and remifentanil target-controlled infusion models.
                  </Text>
                </View>
              </View>
            ) : (
              <WebView
                source={{ uri: 'https://simtiva.app/' }}
                style={[styles.webview, loading && styles.webviewHidden]}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={false}
                scalesPageToFit={true}
                userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
                onLoadEnd={handleLoadSuccess}
                onError={handleLoadError}
                onHttpError={handleLoadError}
                allowsInlineMediaPlayback={true}
                mediaPlaybackRequiresUserAction={false}
              />
            )}
          </View>

          {/* Reference Guide tab */}
          {activeTab === 'reference' && (
            <View style={styles.tabPane}>
              <ReferenceGuide />
            </View>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // App header
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingRight: SPACING.sm,
  },
  appHeaderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  appHeaderTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  appHeaderSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  // Page header card
  pageHeaderWrap: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  pageHeader: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeadingWrap: { flex: 1, paddingRight: 12 },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center' },
  pageIcon: { marginRight: 8 },
  pageTitle: { fontSize: 16, fontWeight: '700', color: COLORS.medicalBlue },
  pageSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  backIcon: { marginRight: 6 },
  backText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },

  // Tab switcher
  tabBar: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: 8,
  },
  tabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    borderWidth: 1,
    borderColor: '#d8dee6',
  },
  tabBtnActive: {
    backgroundColor: COLORS.medicalBlue,
    borderColor: COLORS.medicalBlue,
  },
  tabIcon: { marginRight: 6 },
  tabText: { fontSize: 12, color: COLORS.text, fontWeight: '600' },
  tabTextActive: { color: COLORS.white },

  // Content area / panes
  contentContainer: { flex: 1, backgroundColor: COLORS.white },
  tabPane: { ...StyleSheet.absoluteFillObject },
  hiddenPane: { opacity: 0, zIndex: -1 },

  // WebView
  webview: { flex: 1 },
  webviewHidden: { opacity: 0, position: 'absolute' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: { marginTop: SPACING.md, fontSize: 14, color: COLORS.textMuted },

  // Embed-failure fallback
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: SPACING.lg,
  },
  errorIcon: { marginBottom: SPACING.md },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.medicalBlue,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  openButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: BORDER_RADIUS,
    ...SHADOW,
  },
  openButtonIcon: { marginRight: 8 },
  openButtonText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
  aboutBlurb: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  aboutText: { fontSize: 13, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  aboutBold: { fontWeight: '700' },

  // Reference guide
  refScroll: { flex: 1, backgroundColor: COLORS.background },
  refContent: { padding: SPACING.md, paddingBottom: SPACING.xl },
  bold: { fontWeight: '700' },
  italic: { fontStyle: 'italic' },

  // Alert box
  alertBox: {
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  alertIcon: { marginRight: 8, marginTop: 2 },
  alertText: { fontSize: 13, lineHeight: 18, flex: 1 },

  // Info box
  infoBox: { borderLeftWidth: 4, borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.md },
  infoTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  infoTitleIcon: { marginRight: 6 },
  infoTitle: { fontWeight: '700', fontSize: 14, color: COLORS.text, marginBottom: 4 },
  infoItem: { fontSize: 13, color: COLORS.text, marginBottom: 2, lineHeight: 18 },

  // Table
  tableScrollContent: { paddingBottom: 2 },
  table: { minWidth: '100%', borderWidth: 1, borderColor: COLORS.border, borderRadius: 6, overflow: 'hidden', marginBottom: SPACING.sm },
  headerRow: { flexDirection: 'row', backgroundColor: COLORS.medicalBlue },
  headerCell: { padding: 8, color: COLORS.white, fontWeight: '700', fontSize: 11, textAlignVertical: 'top' },
  dataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  altRow: { backgroundColor: '#f8f9fa' },
  dataCell: { padding: 8, fontSize: 11, color: COLORS.text, lineHeight: 15, textAlignVertical: 'top' },
  tableNote: {
    backgroundColor: COLORS.light,
    borderRadius: 6,
    padding: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tableNoteText: { fontSize: 12, color: COLORS.text, lineHeight: 18 },

  // References block
  refBox: { backgroundColor: '#e9ecef', borderRadius: BORDER_RADIUS, padding: SPACING.md, marginTop: SPACING.sm },
  refTitle: { fontWeight: '700', fontSize: 14, color: COLORS.medicalBlue },
  refText: { fontSize: 12, color: COLORS.text, lineHeight: 18 },
});
