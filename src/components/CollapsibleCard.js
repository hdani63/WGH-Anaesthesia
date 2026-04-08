import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, SHADOW, SPACING } from '../utils/theme';

function getIconName(icon) {
  if (!icon || typeof icon !== 'string') return null;
  return icon;
}

export default function CollapsibleCard({
  title,
  icon,
  iconColor,
  rightContent,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onToggle,
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = typeof controlledOpen === 'boolean';
  const open = isControlled ? controlledOpen : internalOpen;
  const iconName = getIconName(icon);

  const handleToggle = () => {
    const next = !open;
    if (!isControlled) {
      setInternalOpen(next);
    }
    if (onToggle) {
      onToggle(next);
    }
  };

  return (
    <View style={[styles.card, SHADOW]}>
      <LinearGradient colors={[COLORS.light, '#e9ecef']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <TouchableOpacity
          style={[styles.header, !open && styles.headerClosed]}
          onPress={handleToggle}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleRow}>
            {iconName ? <FontAwesome5 name={iconName} size={15} color={iconColor || COLORS.medicalBlue} style={styles.headerIcon} /> : null}
            <Text style={styles.headerText}>{title}</Text>
          </View>
          {rightContent ? <View style={styles.rightContent}>{rightContent}</View> : null}
          <FontAwesome5
            name={open ? 'chevron-up' : 'chevron-down'}
            size={12}
            color={COLORS.primary}
            style={styles.chevron}
          />
        </TouchableOpacity>
      </LinearGradient>
      {open && <View style={styles.body}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerClosed: {
    borderBottomWidth: 0,
  },
  headerText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.medicalBlue,
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  headerIcon: {
    width: 20,
    marginRight: 8,
  },
  chevron: {
    width: 14,
    textAlign: 'center',
  },
  rightContent: {
    marginRight: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: SPACING.md,
  },
});
