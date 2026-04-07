import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

export default function CalcButton({ title, onPress, color }) {
  const bg = color || COLORS.primary;
  return (
    <TouchableOpacity
      style={[styles.btn, { backgroundColor: bg }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  text: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },
});
