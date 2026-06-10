import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import FullScreenWebModal from '../components/common/FullScreenWebModal';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const JOTFORM_URL = 'https://form.jotform.com/230693021348048';

const WGH_FLOWCHART = require('../../assets/images/web-protocols/MTP_WGH.jpg');

// Header tone -> background / foreground colours (mirrors the WGH MTP flowchart).
const TONES = {
  danger: { bg: COLORS.danger, fg: COLORS.white },
  warning: { bg: COLORS.warning, fg: '#212529' },
  grey: { bg: COLORS.textMuted, fg: COLORS.white },
  sky: { bg: '#5bb8d6', fg: COLORS.white },
  blue: { bg: COLORS.primary, fg: COLORS.white },
  green: { bg: COLORS.success, fg: COLORS.white },
  magenta: { bg: COLORS.medicalRed, fg: COLORS.white },
  black: { bg: '#212529', fg: COLORS.white },
};

const RISK_BADGES = [
  { label: 'Hypoxia', bg: COLORS.danger, fg: COLORS.white },
  { label: 'Hypothermia', bg: '#1d6fe0', fg: COLORS.white },
  { label: 'Hypocalcaemia', bg: COLORS.warning, fg: '#212529' },
  { label: 'Acidosis', bg: COLORS.textMuted, fg: COLORS.white },
  { label: 'Hyperkalaemia', bg: '#212529', fg: COLORS.white },
];

const ROTEM_SECTIONS = [
  {
    key: 'setup',
    title: 'ROTEM Quick Setup Guide',
    icon: 'cogs',
    iconColor: COLORS.primary,
    source: require('../../assets/images/web-protocols/ROTEM_Quick_Setup_Guide.png'),
  },
  {
    key: 'obstetric',
    title: 'ROTEM Protocol For Obstetric Haemorrhage',
    icon: 'baby',
    iconColor: COLORS.danger,
    source: require('../../assets/images/web-protocols/ROTEM_Protocol_For_Obstetric_Haemorrhage.jpg'),
  },
  {
    key: 'nonObstetric',
    title: 'Non-Obstetric ROTEM-guided Major Haemorrhage Pathway',
    icon: 'tint',
    iconColor: COLORS.danger,
    source: require('../../assets/images/web-protocols/Non-Obstetric_ROTEM-guided_Major_Haemorrhage_Pathway.jpg'),
  },
];

/* ------------------------------- MTP building blocks ------------------------------- */

function SectionCard({ title, icon, tone = 'blue', children }) {
  const t = TONES[tone] || TONES.blue;
  return (
    <View style={styles.section}>
      <View style={[styles.sectionHeader, { backgroundColor: t.bg }]}>
        {icon ? <FontAwesome5 name={icon} size={13} color={t.fg} style={styles.sectionHeaderIcon} /> : null}
        <Text style={[styles.sectionHeaderText, { color: t.fg }]}>{title}</Text>
      </View>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

function Bullet({ children }) {
  return (
    <View style={styles.bulletRow}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  );
}

function DataTable({ columns, rows }) {
  return (
    <View style={styles.table}>
      <View style={[styles.tableRow, styles.tableHeaderRow]}>
        {columns.map((c, i) => (
          <Text key={i} style={[styles.tableCell, styles.tableHeaderCell, i === 0 && styles.tableCellFirst]}>
            {c}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={[styles.tableRow, ri % 2 === 1 && styles.tableRowAlt]}>
          {row.map((cell, ci) => (
            <Text key={ci} style={[styles.tableCell, ci === 0 && styles.tableCellFirst]}>
              {cell}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

/* ------------------------------- MTP tab ------------------------------- */

function MTPTab({ onOpenImage }) {
  return (
    <View>
      {/* Intro / document control */}
      <View style={styles.alertBox}>
        <Text style={styles.alertText}>
          <Text style={styles.alertStrong}>⚠ Adult &gt;18yrs MTP</Text> — Includes unexpected adult intra-operative life
          threatening haemorrhage &amp; Obstetric MTP. All components are available to issue outside of MTP by phoning
          the lab and requesting as normal.
        </Text>
        <Text style={styles.alertMeta}>WGH-HV-HI-001 Rev 006 | Effective: 30.10.2024 | Authorised: Dr Kumar &amp; Dr Honan</Text>
      </View>

      <SectionCard title="Criteria to Activate MTP" icon="bell" tone="danger">
        <Bullet><Text style={styles.b}>&gt;10 units of Red Cells</Text> in 24 hrs</Bullet>
        <Bullet><Text style={styles.b}>Loss of one blood volume</Text> within 24 hrs</Bullet>
        <Bullet>Predicted need for <Text style={styles.b}>&gt;8 units Red Cells</Text> in 2 hrs</Bullet>
        <Bullet>Transfusion of <Text style={styles.b}>&gt;4 units of Red Cells</Text> in &lt;1 hr</Bullet>
        <Bullet>Loss of <Text style={styles.b}>150 ml/min</Text></Bullet>
        <Bullet><Text style={styles.b}>50% blood volume loss</Text> within 3 hrs</Bullet>
      </SectionCard>

      <SectionCard title="Activate MTP — Call Lab Ext: 53259  |  Bleep 239" icon="phone" tone="warning">
        <Text style={styles.bodyText}>
          <Text style={styles.b}>Massive Transfusion Protocol</Text> — Decision by Senior Clinician to Activate
        </Text>
      </SectionCard>

      <SectionCard title="Document MTP Activation Time" icon="clock" tone="grey">
        <Text style={styles.bodyText}>Patient notes / blood prescription record</Text>
      </SectionCard>

      <SectionCard title="Identify Communication Leader" icon="users" tone="sky">
        <Text style={styles.bodyText}>
          Contact key personnel: <Text style={styles.b}>Consultant, Cons Anaesthetist, Senior Nurse, Cons Haem.</Text>
        </Text>
      </SectionCard>

      <SectionCard title="Establish Access / Take Bloods" icon="syringe" tone="blue">
        <Text style={styles.bodyText}>Group &amp; Save, FBC, Coag, Fibrinogen, U&amp;E, Calcium, Lactate, VBG/ABG</Text>
        <Text style={styles.warnText}>Team identify if anticoagulated — discuss reversal with Cons. Haem.</Text>
      </SectionCard>

      <SectionCard title="Manage Risks" icon="exclamation-circle" tone="warning">
        <View style={styles.badgeWrap}>
          {RISK_BADGES.map((badge) => (
            <View key={badge.label} style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.fg }]}>{badge.label}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      <SectionCard title="Massive Transfusion Pack 1" icon="box" tone="green">
        <Bullet>
          <Text style={styles.b}>4 Group O Neg / Group-specific Red Cells</Text>{' '}
          <Text style={styles.muted}>(Consider O Pos in females &gt;50y and males)</Text>
        </Bullet>
        <Bullet><Text style={styles.b}>4 Units Plasma / Octaplas</Text></Bullet>
        <Bullet>
          <Text style={styles.b}>2 Units Platelets</Text>{' '}
          <Text style={styles.muted}>(1 unit available immediately, 2nd comes from IBTS)</Text>
        </Bullet>
      </SectionCard>

      <SectionCard title="If Bleeding Continues — Pack 2" icon="boxes" tone="danger">
        <Bullet>4 Red Cells</Bullet>
        <Bullet>4 Plasma</Bullet>
        <Bullet>1 Pool Platelets</Bullet>
        <Bullet>4g Fibrinogen</Bullet>
        <Text style={styles.warnText}>Repeat MTP Pack 2 guided by test results until bleeding controlled.</Text>
      </SectionCard>

      <SectionCard title="Obstetric Bleed" icon="baby" tone="magenta">
        <Text style={styles.b}>Tranexamic Acid</Text>
        <Text style={styles.bodyText}>1g IV Bolus / 10 min</Text>
        <Text style={styles.bodyText}>Repeat after 30 min</Text>
        <Text style={[styles.b, styles.spacedTop]}>Fibrinogen 4g</Text>
        <Text style={styles.muted}>(Allow approx. 5 mins. for reconstitution)</Text>
      </SectionCard>

      <SectionCard title="Trauma Bleed" icon="car-crash" tone="warning">
        <Text style={styles.bodyText}>&lt;3 hrs from injury:</Text>
        <Text style={styles.b}>1g IV Tranexamic Acid /10 min</Text>
        <Text style={styles.bodyText}>Further 1g 8hrly IV infusion</Text>
        <Text style={styles.warnText}>Ensure no recent MI/Stroke</Text>
      </SectionCard>

      <SectionCard title="Repeat & Recheck / Review & Reassess" icon="sync" tone="grey">
        <Text style={styles.bodyText}>
          <Text style={styles.b}>Labs:</Text> Vital signs, FBC, Coag, U&amp;E, LFTs, Calcium, ABG
        </Text>
        <Text style={[styles.bodyText, styles.spacedTop]}>
          <Text style={styles.b}>If bleeding continues:</Text> Contact Cons. Haem. Consider 10mls 10% Calcium Gluconate
        </Text>
      </SectionCard>

      <SectionCard title="MTP Stand-Down / Deactivation" icon="power-off" tone="black">
        <Bullet>MTP “Stand Down” — Decision by Clinical Lead</Bullet>
        <Bullet>Document Time of Deactivation of MTP</Bullet>
        <Bullet>Communication Leader to contact lab to “Stand Down” Massive Transfusion/MTP</Bullet>
        <Bullet>Complete documentation, blood product traceability</Bullet>
        <Bullet>Request Forms &amp; Blood Storage/Verification Form and return with Igloo to lab</Bullet>
      </SectionCard>

      <SectionCard title="Treatment Targets" icon="bullseye" tone="blue">
        <DataTable
          columns={['Target', 'To Achieve / Give']}
          rows={[
            ['Hb 7–9', 'RBC'],
            ['PT/APPT <1.5g/l', 'Plasma if <1.5g/l'],
            ['Fib >1.5g/l', 'Fib 4g'],
            ['Platelets >50 × 10⁹/L', '1 pool platelets'],
            ['Calcium >1mmol/l', 'Consider 10% Calcium gluconate'],
          ]}
        />
      </SectionCard>

      <SectionCard title="Time from Sample to Availability" icon="clock" tone="sky">
        <DataTable
          columns={['Product', 'Time']}
          rows={[
            ['O Neg Red Cells', 'Immediately'],
            ['Uncrossmatched Red Cells', '15 mins'],
            ['Crossmatched RBC', '60 mins'],
            ['Plasma', '30 mins'],
            ['Platelets', '1 unit held onsite\n2nd: 2 hrs from IBTS'],
          ]}
        />
      </SectionCard>

      <SectionCard title="Original WGH MTP Flowchart" icon="image" tone="grey">
        <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenImage(WGH_FLOWCHART, 'Original WGH MTP Flowchart')}>
          <View style={styles.imageWrap}>
            <Image source={WGH_FLOWCHART} style={styles.protocolImage} resizeMode="contain" accessibilityLabel="Original WGH MTP Flowchart" />
          </View>
        </TouchableOpacity>
        <Text style={styles.tapHint}>Tap image to enlarge</Text>
      </SectionCard>
    </View>
  );
}

/* ------------------------------- ROTEM tab ------------------------------- */

function ROTEMTab({ activeCard, onToggleCard, onOpenImage, onOpenDecisionTool }) {
  return (
    <View>
      {ROTEM_SECTIONS.map((section) => (
        <CollapsibleCard
          key={section.key}
          title={section.title}
          icon={section.icon}
          iconColor={section.iconColor}
          open={activeCard === section.key}
          onToggle={(nextOpen) => onToggleCard(section.key, nextOpen)}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={() => onOpenImage(section.source, section.title)}>
            <View style={styles.imageWrap}>
              <Image source={section.source} style={styles.protocolImage} resizeMode="contain" accessibilityLabel={section.title} />
            </View>
          </TouchableOpacity>
          <Text style={styles.tapHint}>Tap image to enlarge</Text>
        </CollapsibleCard>
      ))}

      <CollapsibleCard
        title="ROTEM Decision Tool"
        icon="calculator"
        iconColor={COLORS.success}
        open={activeCard === 'decisionTool'}
        onToggle={(nextOpen) => onToggleCard('decisionTool', nextOpen)}
      >
        <View style={styles.toolBox}>
          <Text style={styles.toolText}>Open the ROTEM decision tool directly inside the app.</Text>
          <TouchableOpacity style={styles.openBtn} onPress={onOpenDecisionTool}>
            <FontAwesome5 name="calculator" size={12} color={COLORS.white} style={styles.openBtnIcon} />
            <Text style={styles.openBtnText}>Open ROTEM Decision Tool</Text>
          </TouchableOpacity>
        </View>
      </CollapsibleCard>
    </View>
  );
}

/* ------------------------------- Screen ------------------------------- */

export default function ROTEMScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('mtp');
  const [activeCard, setActiveCard] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [decisionToolVisible, setDecisionToolVisible] = useState(false);
  const [decisionToolKey, setDecisionToolKey] = useState(0);

  const toggleCard = (key, nextOpen) => {
    setActiveCard(nextOpen ? key : null);
  };

  const openImageModal = (source, title) => {
    setModalImage(source);
    setModalTitle(title);
    setModalVisible(true);
  };

  const openDecisionTool = () => {
    setDecisionToolKey((previous) => previous + 1);
    setDecisionToolVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <ScreenWrapper
      title="Massive Transfusion & ROTEM"
      subtitle="WGH Haemovigilance Department & ROTEM Protocols"
    >
      {/* Tab switcher */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mtp' && styles.tabActive]}
          onPress={() => setActiveTab('mtp')}
          activeOpacity={0.85}
        >
          <FontAwesome5 name="tint" size={13} color={activeTab === 'mtp' ? COLORS.white : COLORS.primary} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'mtp' && styles.tabTextActive]}>MTP</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rotem' && styles.tabActive]}
          onPress={() => setActiveTab('rotem')}
          activeOpacity={0.85}
        >
          <FontAwesome5 name="pen" size={12} color={activeTab === 'rotem' ? COLORS.white : COLORS.primary} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'rotem' && styles.tabTextActive]}>ROTEM</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'mtp' ? (
        <MTPTab onOpenImage={openImageModal} />
      ) : (
        <ROTEMTab
          activeCard={activeCard}
          onToggleCard={toggleCard}
          onOpenImage={openImageModal}
          onOpenDecisionTool={openDecisionTool}
        />
      )}

      <TouchableOpacity style={styles.bottomHomeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.bottomHomeIcon} />
        <Text style={styles.bottomHomeText}>Back to Home</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeImageModal}>
        <View style={styles.modalBackdrop}>
          <TouchableOpacity style={styles.modalCloseBtn} onPress={closeImageModal}>
            <FontAwesome5 name="times" size={16} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.modalContent}>
            <ScrollView
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              maximumZoomScale={3}
              minimumZoomScale={1}
              zoomScale={1}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            >
              {modalImage ? (
                <Image source={modalImage} style={styles.modalImage} resizeMode="contain" />
              ) : null}
            </ScrollView>
            {modalTitle ? <Text style={styles.modalTitle}>{modalTitle}</Text> : null}
          </View>
        </View>
      </Modal>

      <FullScreenWebModal
        visible={decisionToolVisible}
        title="ROTEM Decision Tool"
        onClose={() => setDecisionToolVisible(false)}
      >
        <WebView
          key={decisionToolKey}
          source={{ uri: JOTFORM_URL }}
          startInLoadingState
          style={styles.webView}
          cacheEnabled={false}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      </FullScreenWebModal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  /* Tabs */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    padding: 4,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: BORDER_RADIUS - 2,
  },
  tabActive: {
    backgroundColor: COLORS.primary,
  },
  tabIcon: { marginRight: 7 },
  tabText: { fontSize: 14, fontWeight: '700', color: COLORS.primary },
  tabTextActive: { color: COLORS.white },

  /* Alert box */
  alertBox: {
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c2c7',
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  alertText: { fontSize: 13, color: '#842029', lineHeight: 19 },
  alertStrong: { fontWeight: '700', color: '#842029' },
  alertMeta: { fontSize: 11, color: '#9b6168', marginTop: SPACING.sm },

  /* Section cards */
  section: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOW,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: SPACING.md,
  },
  sectionHeaderIcon: { marginRight: 8 },
  sectionHeaderText: { fontSize: 14, fontWeight: '700', flex: 1 },
  sectionBody: { padding: SPACING.md },

  bodyText: { fontSize: 13, color: COLORS.text, lineHeight: 20 },
  b: { fontWeight: '700', color: COLORS.text },
  muted: { color: COLORS.textMuted, fontSize: 12 },
  warnText: { color: COLORS.danger, fontSize: 13, fontWeight: '600', marginTop: SPACING.sm, lineHeight: 19 },
  spacedTop: { marginTop: SPACING.sm },

  /* Bullets */
  bulletRow: { flexDirection: 'row', marginBottom: 6 },
  bulletDot: { fontSize: 14, color: COLORS.text, marginRight: 8, lineHeight: 20 },
  bulletText: { flex: 1, fontSize: 13, color: COLORS.text, lineHeight: 20 },

  /* Badges */
  badgeWrap: { flexDirection: 'row', flexWrap: 'wrap', marginTop: -SPACING.xs },
  badge: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: SPACING.sm,
    marginTop: SPACING.sm,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },

  /* Tables */
  table: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  tableRow: { flexDirection: 'row' },
  tableRowAlt: { backgroundColor: '#f8f9fa' },
  tableHeaderRow: { backgroundColor: '#212529' },
  tableCell: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
    paddingVertical: 9,
    paddingHorizontal: 10,
    lineHeight: 18,
  },
  tableCellFirst: { borderRightWidth: 1, borderRightColor: COLORS.border },
  tableHeaderCell: { color: COLORS.white, fontWeight: '700' },

  /* Images */
  imageWrap: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
    marginBottom: SPACING.sm,
  },
  protocolImage: { width: '100%', height: 260 },
  tapHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center' },

  /* ROTEM decision tool */
  toolBox: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: SPACING.md },
  toolText: { fontSize: 13, color: COLORS.text, marginBottom: SPACING.sm, lineHeight: 19 },
  openBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 11,
    paddingHorizontal: SPACING.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  openBtnIcon: { marginRight: 7 },
  openBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  /* Bottom home */
  bottomHomeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOW,
  },
  bottomHomeIcon: { marginRight: 8 },
  bottomHomeText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },

  /* Image modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  modalCloseBtn: {
    position: 'absolute',
    top: 48,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  modalContent: { width: '100%', height: '78%', maxHeight: '78%' },
  modalImage: { width: '100%', height: '100%' },
  modalScrollView: { width: '100%', height: '100%' },
  modalScrollContent: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  modalTitle: {
    marginTop: SPACING.sm,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  webView: { flex: 1 },
});
