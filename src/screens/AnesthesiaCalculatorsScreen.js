import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const CALCULATOR_GROUPS = [
  {
    key: 'Preoperative',
    title: 'Preoperative Assessment',
    icon: 'clipboard-list',
    description: 'Risk and optimization calculators before surgery',
  },
  {
    key: 'Postoperative',
    title: 'Postoperative & Recovery',
    icon: 'bed',
    description: 'Recovery scoring and post-op support tools',
  },
  {
    key: 'ICUCalculators',
    title: 'ICU Calculators',
    icon: 'procedures',
    description: 'Critical care calculations for ICU management',
  },
  {
    key: 'GeneralMedical',
    title: 'General Medical',
    icon: 'stethoscope',
    description: 'Core medical calculations and conversions',
  },
];

export default function AnesthesiaCalculatorsScreen({ navigation }) {
  return (
    <ScreenWrapper
      title="Anesthesia Calculators"
      subtitle="Core calculator groups for perioperative and critical care workflows"
      icon="calculator"
    >
      <View style={styles.grid}>
        {CALCULATOR_GROUPS.map((group) => (
          <TouchableOpacity
            key={group.key}
            style={[styles.card, SHADOW]}
            onPress={() => navigation.navigate(group.key)}
            activeOpacity={0.8}
          >
            <View style={styles.iconWrap}>
              <FontAwesome5 name={group.icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.title}>{group.title}</Text>
            <Text style={styles.description}>{group.description}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    minHeight: 150,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eaf3ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
});
