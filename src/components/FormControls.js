import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING } from '../utils/theme';

export function RadioGroup({ options, selected, onSelect }) {
  return (
    <View>
      {options.map((opt, i) => (
        <TouchableOpacity
          key={i}
          style={styles.radioRow}
          onPress={() => onSelect(opt.value)}
          activeOpacity={0.7}
        >
          <View style={[styles.radio, selected === opt.value && styles.radioActive]}>
            {selected === opt.value && <View style={styles.radioDot} />}
          </View>
          <Text style={styles.radioLabel}>{opt.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function CheckboxGroup({ options, selected, onToggle }) {
  return (
    <View>
      {options.map((opt, i) => {
        const checked = selected.includes(opt.value);
        return (
          <TouchableOpacity
            key={i}
            style={styles.radioRow}
            onPress={() => onToggle(opt.value)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, checked && styles.checkboxActive]}>
              {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.radioLabel}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export function CheckboxItem({ label, checked, onToggle }) {
  return (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.checkbox, checked && styles.checkboxActive]}>
        {checked && <Text style={styles.checkmark}>✓</Text>}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
}

export function PickerSelect({ label, options, selected, onSelect }) {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === selected);

  return (
    <View style={styles.pickerWrap}>
      {label && <Text style={styles.pickerLabel}>{label}</Text>}
      <TouchableOpacity style={styles.selectTrigger} onPress={() => setOpen(!open)} activeOpacity={0.8}>
        <Text style={styles.selectText} numberOfLines={1}>
          {selectedOption ? selectedOption.label : 'Select option'}
        </Text>
        <FontAwesome5 name={open ? 'chevron-up' : 'chevron-down'} size={14} color={COLORS.textMuted} />
      </TouchableOpacity>

      {open && (
        <View style={styles.selectDropdown}>
          {options.map((opt, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.selectOption, selected === opt.value && styles.selectOptionActive]}
              onPress={() => {
                onSelect(opt.value);
                setOpen(false);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.selectOptionText, selected === opt.value && styles.selectOptionTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  radioRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  radioActive: {
    borderColor: COLORS.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  radioLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    marginTop: 1,
  },
  checkboxActive: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  pickerWrap: {
    marginBottom: SPACING.sm,
  },
  pickerLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  selectTrigger: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
    marginRight: 8,
  },
  selectDropdown: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    marginTop: 6,
    overflow: 'hidden',
  },
  selectOption: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f5',
  },
  selectOptionActive: {
    backgroundColor: '#e8f4fd',
  },
  selectOptionText: {
    fontSize: 14,
    color: COLORS.text,
  },
  selectOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});
