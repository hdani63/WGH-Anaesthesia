import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, SPACING } from '../../utils/theme';

export default function FullScreenWebModal({
  visible,
  title,
  onClose,
  headerActions,
  children,
  surfaceBackgroundColor = COLORS.white,
  headerBackgroundColor = COLORS.primary,
}) {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: headerBackgroundColor }]} edges={['left', 'right']}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: headerBackgroundColor,
              paddingTop: top > 0 ? top + 10 : 12,
            },
          ]}
        >
          <Text numberOfLines={1} style={styles.title}>
            {title}
          </Text>

          <View style={styles.actionsRow}>
            {headerActions}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <FontAwesome5 name="times" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.surface, { backgroundColor: surfaceBackgroundColor }]}>{children}</View>

        <View style={[styles.bottomSpacer, { height: bottom + 12 }]} />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.18)',
  },
  title: {
    flex: 1,
    marginRight: SPACING.sm,
    color: COLORS.white,
    fontSize: 15,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  surface: {
    flex: 1,
    marginTop: -8,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    overflow: 'hidden',
  },
  bottomSpacer: {
    backgroundColor: COLORS.background,
  },
});
