import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';
import { openPdf, downloadPdf } from '../utils/pdfUtils';

const DAS_DOC = {
  title: 'DAS Unanticipated Difficult Airway Guideline',
  fileName: 'das_unanticipated_guidelines_new.pdf',
  source: require('../../assets/pdfs/archive/das_unanticipated_guidelines_new.pdf'),
};

const OBSTETRIC_DOC = {
  title: 'Obstetric GA and Failed Intubation Guideline',
  fileName: 'obstetric_guidelines_new.pdf',
  source: require('../../assets/pdfs/archive/obstetric_guidelines_new.pdf'),
};

const AIRWAY_IMAGES = {
  unanticipatedOverview: require('../../assets/images/web-protocols/das_unanticipated_overview.jpg'),
  unanticipatedManagement: require('../../assets/images/web-protocols/das_unanticipated_management.jpg'),
  unanticipatedCico: require('../../assets/images/web-protocols/das_unanticipated_cico.jpg'),
  ati: require('../../assets/images/web-protocols/ati_algorithm_new.jpg'),
  icu: require('../../assets/images/web-protocols/das_icu_algorithm_new.jpg'),
  cervical: require('../../assets/images/web-protocols/airway_cervical_spine_new.png'),
  extubation1: require('../../assets/images/web-protocols/das_extubation_1_new.png'),
  extubation2: require('../../assets/images/web-protocols/das_extubation_2_new.png'),
  extubation3: require('../../assets/images/web-protocols/das_extubation_3_new.png'),
  obstetricMaster: require('../../assets/images/web-protocols/obstetric_master_algorithm.jpg'),
  obstetric1: require('../../assets/images/web-protocols/obstetric_algorithm_1.jpg'),
  obstetric2: require('../../assets/images/web-protocols/obstetric_algorithm_2.jpg'),
  obstetric3: require('../../assets/images/web-protocols/obstetric_algorithm_3.jpg'),
  obstetricTable1: require('../../assets/images/web-protocols/obstetric_table_1.jpg'),
  obstetricTable2: require('../../assets/images/web-protocols/obstetric_table_2.jpg'),
};

function ProtocolImage({ source, label, onPress }) {
  const imageComponent = (
    <View style={styles.imageWrap}>
      <Image source={source} style={styles.protocolImage} resizeMode="contain" accessibilityLabel={label} />
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}>
        {imageComponent}
        <Text style={styles.tapHint}>Tap image to enlarge</Text>
      </TouchableOpacity>
    );
  }

  return imageComponent;
}

function GuidelineSection({ title, items }) {
  return (
    <View style={styles.guidelineBox}>
      <Text style={styles.guidelineTitle}>{title}</Text>
      {items.map((item, i) => <Text key={i} style={styles.guidelineItem}>• {item}</Text>)}
    </View>
  );
}

function PanelColumns({ panels }) {
  return (
    <View style={styles.panelRow}>
      {panels.map((panel, i) => (
        <View key={i} style={[styles.panelCard, { borderColor: panel.borderColor || COLORS.border }]}> 
          <View style={[styles.panelHeader, { backgroundColor: panel.headerColor || COLORS.primary }]}> 
            <Text style={styles.panelHeaderText}>{panel.title}</Text>
          </View>
          <View style={[styles.panelBody, { backgroundColor: panel.bodyColor || '#f8f9fa' }]}> 
            {panel.items.map((item, j) => <Text key={j} style={styles.panelItem}>• {item}</Text>)}
          </View>
        </View>
      ))}
    </View>
  );
}

export default function DifficultAirwayScreen() {
  const navigation = useNavigation();
  const [activeCard, setActiveCard] = useState('unanticipated');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');

  const toggleCard = (cardKey, nextOpen) => {
    setActiveCard(nextOpen ? cardKey : null);
  };

  const openImageModal = (source, title) => {
    setModalImage(source);
    setModalTitle(title);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
    setModalImage(null);
    setModalTitle('');
  };

  return (
    <ScreenWrapper
      title="Difficult Airway Management"
      subtitle="Difficult Airway Society (DAS) Guidelines & Algorithms"
    >
      <CollapsibleCard
        title="DAS Unanticipated Difficult Intubation Guidelines (2015)"
        icon="exclamation-triangle"
        open={activeCard === 'unanticipated'}
        onToggle={(nextOpen) => toggleCard('unanticipated', nextOpen)}
      >
        <Text style={styles.desc}>Difficult Airway Society guidelines for unanticipated difficult tracheal intubation in adults.</Text>
        <ProtocolImage source={AIRWAY_IMAGES.unanticipatedOverview} label="DAS Difficult Intubation Overview" onPress={() => openImageModal(AIRWAY_IMAGES.unanticipatedOverview, "DAS Difficult Intubation Overview")} />
        <ProtocolImage source={AIRWAY_IMAGES.unanticipatedManagement} label="DAS Unanticipated Management Algorithm" onPress={() => openImageModal(AIRWAY_IMAGES.unanticipatedManagement, "DAS Unanticipated Management Algorithm")} />
        <ProtocolImage source={AIRWAY_IMAGES.unanticipatedCico} label="DAS CICO Emergency Algorithm" onPress={() => openImageModal(AIRWAY_IMAGES.unanticipatedCico, "DAS CICO Emergency Algorithm")} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(DAS_DOC.source, DAS_DOC.fileName, DAS_DOC.title, navigation)}>
            <Text style={styles.primaryBtnText}>View PDF Guidelines</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(DAS_DOC.source, DAS_DOC.fileName, DAS_DOC.title)}>
            <Text style={styles.outlineBtnText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
        <GuidelineSection title="Key Points" items={[
          'Plan A: Facemask ventilation and tracheal intubation',
          'Plan B: Maintaining oxygenation — Supraglottic Airway Device',
          'Plan C: Facemask ventilation',
          'Plan D: Emergency front of neck access (CICO)',
          'Maximum 3+1 intubation attempts',
          'Declare failed intubation early',
        ]} />
        <Text style={styles.noteText}>Refer to the full DAS PDF for complete algorithms.</Text>
      </CollapsibleCard>

      <CollapsibleCard
        title="DAS Awake Tracheal Intubation (ATI) Technique"
        icon="eye"
        open={activeCard === 'ati'}
        onToggle={(nextOpen) => toggleCard('ati', nextOpen)}
      >
        <ProtocolImage source={AIRWAY_IMAGES.ati} label="DAS Awake Tracheal Intubation Algorithm" onPress={() => openImageModal(AIRWAY_IMAGES.ati, "DAS Awake Tracheal Intubation Algorithm")} />
        <PanelColumns panels={[
          {
            title: 'OXYGENATE',
            headerColor: '#dc3545',
            borderColor: '#dc3545',
            bodyColor: '#fff5f5',
            items: ['Apply HFNO early', 'Titrate HFNO 30-70 L/min', 'Continue throughout procedure'],
          },
          {
            title: 'TOPICALISE',
            headerColor: '#198754',
            borderColor: '#198754',
            bodyColor: '#f2fbf5',
            items: ['Lidocaine 10% spray', '20-30 sprays over 5 min', 'Co-phenylcaine if nasal'],
          },
          {
            title: 'SEDATE',
            headerColor: '#0dcaf0',
            borderColor: '#0dcaf0',
            bodyColor: '#f0fcff',
            items: ['Remifentanil TCI 1.0-3.0 ng/ml', 'Consider midazolam 0.5-1 mg', 'Maintain consciousness'],
          },
          {
            title: 'PERFORM',
            headerColor: '#f59f00',
            borderColor: '#f59f00',
            bodyColor: '#fff9ea',
            items: ['Patient sitting up', 'Clear secretions', 'Two-point check before induction'],
          },
        ]} />
      </CollapsibleCard>

      <CollapsibleCard
        title="DAS ICU Tracheal Intubation Guidelines"
        icon="heartbeat"
        open={activeCard === 'icu'}
        onToggle={(nextOpen) => toggleCard('icu', nextOpen)}
      >
        <ProtocolImage source={AIRWAY_IMAGES.icu} label="DAS ICU Tracheal Intubation Algorithm" onPress={() => openImageModal(AIRWAY_IMAGES.icu, "DAS ICU Tracheal Intubation Algorithm")} />
        <View style={styles.warningBox}>
          <Text style={styles.warningTitle}>Critical Care Considerations</Text>
          <PanelColumns panels={[
            {
              title: 'Pre-oxygenation & Checklist',
              headerColor: '#9a6700',
              borderColor: '#f1c40f',
              bodyColor: '#fff8db',
              items: ['Position head up if possible', 'Assess airway and identify cricothyroid', 'Waveform capnograph ready', 'Optimize cardiovascular system'],
            },
            {
              title: 'Plan A - Laryngoscopy',
              headerColor: '#9a6700',
              borderColor: '#f1c40f',
              bodyColor: '#fff8db',
              items: ['Maximum 3 attempts', 'Maintain oxygenation', 'Video/direct laryngoscopy +/- bougie', 'Call for help on first failure'],
            },
            {
              title: 'CICO Emergency',
              headerColor: '#9a6700',
              borderColor: '#f1c40f',
              bodyColor: '#fff8db',
              items: ['Declare can\'t intubate, can\'t oxygenate', 'Use FONA set', 'Scalpel cricothyroidotomy', 'Trained expert only'],
            },
          ]} />
        </View>
      </CollapsibleCard>

      <CollapsibleCard
        title="Airway Management in Cervical Spine Injury (2024)"
        icon="bone"
        open={activeCard === 'cspine'}
        onToggle={(nextOpen) => toggleCard('cspine', nextOpen)}
      >
        <ProtocolImage source={AIRWAY_IMAGES.cervical} label="Cervical Spine Airway Management" onPress={() => openImageModal(AIRWAY_IMAGES.cervical, "Cervical Spine Airway Management")} />
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>2024 Multi-Society Guidelines</Text>
          <Text style={styles.infoText}>Collaborating Societies: DAS, AoA, BSOA, ICS, NACCS, Faculty of Prehospital Care, RCEM</Text>
          <Text style={styles.infoText}>Key Focus: Pragmatic approach to improve safety and efficacy of airway management in adult patients with suspected or confirmed cervical spine injury.</Text>
        </View>
        <PanelColumns panels={[
          {
            title: 'Key Recommendations',
            headerColor: COLORS.primary,
            borderColor: '#8ec5ff',
            bodyColor: '#f3f8ff',
            items: [
              'Minimize cervical spine movement during pre-oxygenation and facemask ventilation',
              'Use jaw thrust rather than head tilt plus chin lift',
              'No specific supraglottic airway device recommended - use familiar device',
              'Consider second-generation SADs over first-generation SADs',
              'Use videolaryngoscopy in preference to direct laryngoscopy',
              'Regular training in use of videolaryngoscopy with cervical spine immobilization',
              'Consider adjuncts when performing tracheal intubation',
              'Remove anterior part of cervical collar during intubation attempts',
              'Consider multidisciplinary planning and human factors optimization',
            ],
          },
          {
            title: 'Equipment & Technique',
            headerColor: '#f59f00',
            borderColor: '#f5c26b',
            bodyColor: '#fff9ef',
            items: [
              'Video laryngoscopy preferred',
              'Manual in-line stabilization - acknowledge limitations',
              'Ultrasound guidance for cricothyroid membrane',
              'Emergency FONA preparation and training',
              'Team approach with clear communication and role allocation',
            ],
          },
        ]} />
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>Important: MILS may be ineffective in preventing vertebral movement and can worsen intubation success rates.</Text>
        </View>
      </CollapsibleCard>

      <CollapsibleCard
        title="DAS Extubation Guidelines"
        icon="lungs"
        open={activeCard === 'extubation'}
        onToggle={(nextOpen) => toggleCard('extubation', nextOpen)}
      >
        <ProtocolImage source={AIRWAY_IMAGES.extubation1} label="DAS Extubation Algorithm 1" onPress={() => openImageModal(AIRWAY_IMAGES.extubation1, "DAS Extubation Algorithm 1")} />
        <ProtocolImage source={AIRWAY_IMAGES.extubation2} label="DAS Extubation Algorithm 2" onPress={() => openImageModal(AIRWAY_IMAGES.extubation2, "DAS Extubation Algorithm 2")} />
        <ProtocolImage source={AIRWAY_IMAGES.extubation3} label="DAS Extubation Algorithm 3" onPress={() => openImageModal(AIRWAY_IMAGES.extubation3, "DAS Extubation Algorithm 3")} />
        <PanelColumns panels={[
          {
            title: 'Low Risk Extubation',
            headerColor: '#198754',
            borderColor: '#198754',
            bodyColor: '#f2fbf5',
            items: ['Criteria: Fasted, uncomplicated airway, no general risk factors', 'Approach: Standard deep or awake extubation', 'Recovery: Standard post-extubation care'],
          },
          {
            title: 'At Risk Extubation',
            headerColor: '#dc3545',
            borderColor: '#dc3545',
            bodyColor: '#fff5f5',
            items: ['Criteria: Ability to oxygenate uncertain, re-intubation potentially difficult', 'Options: Awake extubation, advanced techniques, postpone, or tracheostomy', 'Key question: Is it safe to remove the tube?'],
          },
        ]} />
        <GuidelineSection
          title="Extubation Planning Steps"
          items={[
            'Step 1 - Plan: Assess airway and general risk factors',
            'Step 2 - Prepare: Optimize patient and other factors',
            'Step 3 - Perform: Execute appropriate algorithm',
            'Step 4 - Post-care: Recovery/HDU/ICU as appropriate',
          ]}
        />
      </CollapsibleCard>

      <CollapsibleCard
        title="Obstetric General Anaesthesia & Failed Intubation"
        icon="female"
        open={activeCard === 'obstetric'}
        onToggle={(nextOpen) => toggleCard('obstetric', nextOpen)}
      >
        <ProtocolImage source={AIRWAY_IMAGES.obstetricMaster} label="Obstetric Master Algorithm" onPress={() => openImageModal(AIRWAY_IMAGES.obstetricMaster, "Obstetric Master Algorithm")} />
        <ProtocolImage source={AIRWAY_IMAGES.obstetric1} label="Obstetric Algorithm 1" onPress={() => openImageModal(AIRWAY_IMAGES.obstetric1, "Obstetric Algorithm 1")} />
        <ProtocolImage source={AIRWAY_IMAGES.obstetric2} label="Obstetric Algorithm 2" onPress={() => openImageModal(AIRWAY_IMAGES.obstetric2, "Obstetric Algorithm 2")} />
        <ProtocolImage source={AIRWAY_IMAGES.obstetric3} label="Obstetric Algorithm 3" onPress={() => openImageModal(AIRWAY_IMAGES.obstetric3, "Obstetric Algorithm 3")} />
        <ProtocolImage source={AIRWAY_IMAGES.obstetricTable1} label="Obstetric Table 1" onPress={() => openImageModal(AIRWAY_IMAGES.obstetricTable1, "Obstetric Table 1")} />
        <ProtocolImage source={AIRWAY_IMAGES.obstetricTable2} label="Obstetric Table 2" onPress={() => openImageModal(AIRWAY_IMAGES.obstetricTable2, "Obstetric Table 2")} />
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => openPdf(OBSTETRIC_DOC.source, OBSTETRIC_DOC.fileName, OBSTETRIC_DOC.title, navigation)}>
            <Text style={styles.primaryBtnText}>View PDF Guidelines</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.outlineBtn} onPress={() => downloadPdf(OBSTETRIC_DOC.source, OBSTETRIC_DOC.fileName, OBSTETRIC_DOC.title)}>
            <Text style={styles.outlineBtnText}>Download PDF</Text>
          </TouchableOpacity>
        </View>
        <PanelColumns panels={[
          {
            title: 'Algorithm 1: Safe Obstetric GA',
            headerColor: COLORS.primary,
            borderColor: '#8ec5ff',
            bodyColor: '#f3f8ff',
            items: ['Pre-induction planning and preparation', 'Team discussion and WHO safety checklist', 'Rapid sequence induction protocol', 'Maximum 2 intubation attempts (3rd by experienced colleague)', 'Verify successful intubation with capnography'],
          },
          {
            title: 'Algorithm 2: Failed Intubation',
            headerColor: '#f59f00',
            borderColor: '#f5c26b',
            bodyColor: '#fff9ef',
            items: ['Declare failed intubation, call for help', 'Supraglottic airway (2nd generation) or facemask', 'Remove cricoid pressure during SAD insertion', 'Decision: Essential/safe to proceed with surgery?', 'Options: Wake patient or proceed with surgery'],
          },
        ]} />

        <View style={styles.dangerBox}>
          <Text style={styles.dangerTitle}>Algorithm 3: Cannot Intubate, Cannot Oxygenate</Text>
          <PanelColumns panels={[
            {
              title: 'Immediate Actions',
              headerColor: '#b02a37',
              borderColor: '#f1aeb5',
              bodyColor: '#fff5f5',
              items: ['Declare emergency to theatre team', 'Call additional specialist help', 'Give 100% oxygen', 'Exclude laryngospasm and ensure neuromuscular blockade', 'Perform front-of-neck procedure'],
            },
            {
              title: 'If Oxygenation Not Restored',
              headerColor: '#b02a37',
              borderColor: '#f1aeb5',
              bodyColor: '#fff5f5',
              items: ['Maternal advanced life support', 'Perimortem caesarean section', 'Continuous resuscitation efforts', 'Multidisciplinary team approach'],
            },
          ]} />
        </View>

        <PanelColumns panels={[
          {
            title: 'Maternal Factors',
            headerColor: '#0dcaf0',
            borderColor: '#8be2f7',
            bodyColor: '#f0fcff',
            items: ['Rapid desaturation', 'Airway edema', 'Enlarged breasts', 'Aspiration risk'],
          },
          {
            title: 'Fetal Factors',
            headerColor: '#0dcaf0',
            borderColor: '#8be2f7',
            bodyColor: '#f0fcff',
            items: ['Avoid prolonged hypoxia', 'Consider delivery timing', 'Aortocaval compression', 'Left lateral positioning'],
          },
          {
            title: 'Technical Modifications',
            headerColor: '#0dcaf0',
            borderColor: '#8be2f7',
            bodyColor: '#f0fcff',
            items: ['Ramped/sitting position', 'Smaller ET tube (6.5-7.0)', 'Cricoid pressure controversial', 'Maximum pre-oxygenation'],
          },
        ]} />
      </CollapsibleCard>

      <View style={styles.resourceCard}>
        <View style={styles.resourceTitleRow}>
          <FontAwesome5 name="phone" size={14} color={COLORS.danger} style={styles.resourceTitleIcon} />
          <Text style={styles.resourceTitle}>Emergency Contacts & Resources</Text>
        </View>
        <PanelColumns panels={[
          {
            title: 'Immediate Help',
            headerColor: '#dc3545',
            borderColor: '#f1aeb5',
            bodyColor: '#fff5f5',
            items: ['Senior anesthetist', 'ENT surgeon', 'ICU consultant', 'Theatre coordinator'],
          },
          {
            title: 'Equipment Check',
            headerColor: '#f59f00',
            borderColor: '#f5c26b',
            bodyColor: '#fff9ef',
            items: ['✓ Video laryngoscope charged and ready', '✓ Difficult airway trolley accessible', '✓ Emergency cricothyroidotomy kit', '✓ Capnography functioning'],
          },
          {
            title: 'Post-Event Actions',
            headerColor: '#198754',
            borderColor: '#8dd5ad',
            bodyColor: '#f2fbf5',
            items: ['Complete airway alert form', 'Debrief with team', 'Patient explanation and documentation', 'Report to local airway database'],
          },
        ]} />
      </View>

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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  imageWrap: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    padding: 8,
    marginBottom: SPACING.sm,
  },
  protocolImage: {
    width: '100%',
    height: 240,
  },
  desc: { fontSize: 13, color: COLORS.textMuted, marginBottom: SPACING.md, fontStyle: 'italic' },
  buttonRow: { flexDirection: 'row', marginBottom: SPACING.sm },
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12, marginRight: 8 },
  primaryBtnText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },
  outlineBtn: { borderColor: COLORS.primary, borderWidth: 1, borderRadius: 6, paddingVertical: 7, paddingHorizontal: 12 },
  outlineBtnText: { color: COLORS.primary, fontSize: 12, fontWeight: '600' },
  guidelineBox: { backgroundColor: '#f8f9fa', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm },
  guidelineTitle: { fontWeight: '700', fontSize: 14, color: COLORS.primary, marginBottom: 4 },
  guidelineItem: { fontSize: 13, color: COLORS.text, marginBottom: 2, paddingLeft: 4 },
  panelRow: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -4, marginBottom: SPACING.sm },
  panelCard: { flex: 1, minWidth: 150, borderWidth: 1, borderRadius: 6, overflow: 'hidden', marginHorizontal: 4, marginBottom: SPACING.sm },
  panelHeader: { paddingVertical: 7, paddingHorizontal: 8 },
  panelHeaderText: { color: COLORS.white, fontSize: 12, fontWeight: '700' },
  panelBody: { padding: SPACING.sm },
  panelItem: { fontSize: 12, color: COLORS.text, marginBottom: 2, lineHeight: 17 },
  warningBox: { backgroundColor: '#fff3cd', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm },
  warningTitle: { color: '#856404', fontSize: 14, fontWeight: '700', marginBottom: SPACING.xs },
  warningText: { color: '#856404', fontSize: 13, fontWeight: '600' },
  infoBox: { backgroundColor: '#d1ecf1', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm },
  infoTitle: { color: '#0c5460', fontSize: 14, fontWeight: '700', marginBottom: SPACING.xs },
  infoText: { color: '#0c5460', fontSize: 12, marginBottom: 3, lineHeight: 17 },
  dangerBox: { backgroundColor: '#f8d7da', borderRadius: 6, padding: SPACING.sm, marginBottom: SPACING.sm },
  dangerTitle: { color: '#721c24', fontSize: 14, fontWeight: '700', marginBottom: SPACING.xs },
  noteText: { fontSize: 12, color: COLORS.primary, fontStyle: 'italic', marginTop: SPACING.sm },
  resourceCard: { backgroundColor: '#fff5f5', borderRadius: BORDER_RADIUS, padding: SPACING.md, borderWidth: 1, borderColor: '#f1aeb5', marginTop: SPACING.sm },
  resourceTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.sm },
  resourceTitleIcon: { marginRight: 6 },
  resourceTitle: { fontSize: 15, fontWeight: '700', color: COLORS.danger },
  tapHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.sm },
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
  modalContent: {
    width: '100%',
    height: '78%',
    maxHeight: '78%',
  },
  modalImage: {
    width: '100%',
    height: '100%',
  },
  modalScrollView: {
    width: '100%',
    height: '100%',
  },
  modalScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    marginTop: SPACING.sm,
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
