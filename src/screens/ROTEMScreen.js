import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import FullScreenWebModal from '../components/common/FullScreenWebModal';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const JOTFORM_URL = 'https://form.jotform.com/230693021348048';

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

function ProtocolImage({ source, alt }) {
  return (
    <View style={styles.imageWrap}>
      <Image source={source} style={styles.protocolImage} resizeMode="contain" accessibilityLabel={alt} />
    </View>
  );
}

export default function ROTEMScreen() {
  const navigation = useNavigation();
  const { top: topInset, bottom: bottomInset } = useSafeAreaInsets();
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
    <ScreenWrapper title="ROTEM Guidelines & Protocols" subtitle="Thromboelastometry guided coagulation management">
      {ROTEM_SECTIONS.map((section) => (
        <CollapsibleCard
          key={section.key}
          title={section.title}
          icon={section.icon}
          iconColor={section.iconColor}
          open={activeCard === section.key}
          onToggle={(nextOpen) => toggleCard(section.key, nextOpen)}
        >
          <TouchableOpacity activeOpacity={0.85} onPress={() => openImageModal(section.source, section.title)}>
            <ProtocolImage source={section.source} alt={section.title} />
          </TouchableOpacity>
          <Text style={styles.tapHint}>Tap image to enlarge</Text>
        </CollapsibleCard>
      ))}

      <CollapsibleCard
        title="ROTEM Decision Tool"
        icon="calculator"
        iconColor={COLORS.success}
        open={activeCard === 'decisionTool'}
        onToggle={(nextOpen) => toggleCard('decisionTool', nextOpen)}
      >
        <View style={styles.toolBox}>
          <Text style={styles.toolText}>Open the ROTEM decision tool directly inside the app.</Text>
          <TouchableOpacity style={styles.openBtn} onPress={openDecisionTool}>
            <FontAwesome5 name="calculator" size={12} color={COLORS.white} style={styles.openBtnIcon} />
            <Text style={styles.openBtnText}>Open ROTEM Decision Tool</Text>
          </TouchableOpacity>
        </View>
      </CollapsibleCard>

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
  imageWrap: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 8,
    marginBottom: SPACING.md,
  },
  protocolImage: {
    width: '100%',
    height: 260,
  },
  tapHint: { fontSize: 12, color: COLORS.textMuted, textAlign: 'center', marginBottom: SPACING.sm },
  toolBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: SPACING.md,
  },
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
  webView: {
    flex: 1,
  },
});
