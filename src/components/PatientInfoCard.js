import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PickerSelect } from './FormControls';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

export default function PatientInfoCard({ patient, setPatient }) {
  const update = (field, value) => {
    setPatient(prev => ({ ...prev, [field]: value }));
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleRow}>
          <FontAwesome5 name="user" size={16} color={COLORS.white} style={styles.titleIcon} />
          <Text style={styles.title}>Patient Information</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.field}>
          <Text style={styles.label}>Weight (kg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="70"
            value={patient.weight}
            onChangeText={v => update('weight', v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Age (years)</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            placeholder="45"
            value={patient.age}
            onChangeText={v => update('age', v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Height (cm)</Text>
          <TextInput
            style={styles.input}
            keyboardType="decimal-pad"
            placeholder="170"
            value={patient.height}
            onChangeText={v => update('height', v)}
          />
        </View>

        <View style={styles.field}>
          <PickerSelect
            label="Gender"
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]}
            selected={patient.gender}
            onSelect={v => update('gender', v)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.primary,
    overflow: 'hidden',
  },
  cardHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    color: COLORS.white,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 8,
  },
  cardBody: {
    padding: SPACING.md,
  },
  field: {
    marginBottom: SPACING.sm,
  },
  label: {
    fontSize: 13,
    color: COLORS.text,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 14,
    fontSize: 15,
    backgroundColor: COLORS.white,
  },
});
