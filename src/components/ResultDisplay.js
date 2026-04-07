import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

export default function ResultDisplay({ result, type = 'info' }) {
  if (!result) return null;

  const bgColors = {
    success: '#d4edda',
    warning: '#fff3cd',
    danger: '#f8d7da',
    info: '#d1ecf1',
  };
  const textColors = {
    success: '#155724',
    warning: '#856404',
    danger: '#721c24',
    info: '#0c5460',
  };
  const borderColors = {
    success: '#c3e6cb',
    warning: '#ffeeba',
    danger: '#f5c6cb',
    info: '#bee5eb',
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: bgColors[type] || bgColors.info,
          borderColor: borderColors[type] || borderColors.info,
        },
      ]}
    >
      <Text style={[styles.text, { color: textColors[type] || textColors.info }]}>
        {result}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    marginTop: SPACING.sm,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
  },
});
