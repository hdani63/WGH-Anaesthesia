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

  const color = textColors[type] || textColors.info;
  const lines = String(result).split('\n');

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
      {lines.map((line, i) => (
        <View key={i} style={styles.lineRow}>
          <Text style={[styles.text, { color }]}>{line.length > 0 ? line : ' '}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    marginTop: SPACING.sm,
    alignSelf: 'stretch',
    width: '100%',
    minWidth: 0,
  },
  lineRow: {
    flexDirection: 'row',
    width: '100%',
  },
  text: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    fontSize: 14,
    lineHeight: 22,
  },
});
