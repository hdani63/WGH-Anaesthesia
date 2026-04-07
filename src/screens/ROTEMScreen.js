import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import CollapsibleCard from '../components/CollapsibleCard';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

const JOTFORM_URL = 'https://form.jotform.com/230693021348048';

const ROTEM_IMAGES = {
  setup: require('../../assets/images/web-protocols/ROTEM_Quick_Setup_Guide.png'),
  obstetric: require('../../assets/images/web-protocols/ROTEM_Protocol_For_Obstetric_Haemorrhage.jpg'),
  nonObstetric: require('../../assets/images/web-protocols/Non-Obstetric_ROTEM-guided_Major_Haemorrhage_Pathway.jpg'),
};

function ProtocolImage({ source, alt }) {
  return (
    <View style={styles.imageWrap}>
      <Image source={source} style={styles.protocolImage} resizeMode="contain" accessibilityLabel={alt} />
    </View>
  );
}

export default function ROTEMScreen() {
  return (
    <ScreenWrapper title="ROTEM Analysis" subtitle="Thromboelastometry guided coagulation management">
      <CollapsibleCard title="ROTEM Quick Setup Guide">
        <ProtocolImage source={ROTEM_IMAGES.setup} alt="ROTEM Quick Setup Guide" />
      </CollapsibleCard>

      <CollapsibleCard title="ROTEM Protocol For Obstetric Haemorrhage">
        <ProtocolImage source={ROTEM_IMAGES.obstetric} alt="ROTEM Protocol for Obstetric Haemorrhage" />
      </CollapsibleCard>

      <CollapsibleCard title="Non-Obstetric ROTEM-guided Major Haemorrhage Pathway">
        <ProtocolImage source={ROTEM_IMAGES.nonObstetric} alt="Non-Obstetric ROTEM-Guided Major Haemorrhage Pathway" />
      </CollapsibleCard>

      <CollapsibleCard title="ROTEM Decision Tool">
        <TouchableOpacity style={styles.openBtn} onPress={() => Linking.openURL(JOTFORM_URL)}>
          <Text style={styles.openBtnText}>Open ROTEM Decision Tool</Text>
        </TouchableOpacity>
      </CollapsibleCard>
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
    height: 220,
  },
  openBtn: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS, padding: SPACING.md, alignItems: 'center', marginBottom: SPACING.xs },
  openBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
});
