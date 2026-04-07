import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const SHEETS_URL = 'https://docs.google.com/spreadsheets/d/1vunHVcoOIxHSirSwmybQofc-t81AJsKV25tZR9008q4/edit?usp=drivesdk';

export default function DepartmentalTeachingScreen() {
  return (
    <ScreenWrapper title="📚 Departmental Teaching" subtitle="Teaching schedule and resources">
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Teaching Schedule</Text>
        <Text style={styles.cardDesc}>
          Access the departmental teaching schedule maintained on Google Sheets. This includes tutorial times, topics, and assigned presenters.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(SHEETS_URL)}>
          <Text style={styles.buttonText}>📄 Open Teaching Schedule</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Opens in your default browser or Google Sheets app</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: COLORS.cardBg, borderRadius: BORDER_RADIUS, padding: SPACING.lg, ...SHADOW, alignItems: 'center' },
  cardTitle: { fontSize: 20, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: SPACING.md },
  cardDesc: { fontSize: 14, color: COLORS.text, textAlign: 'center', lineHeight: 22, marginBottom: SPACING.lg },
  button: { backgroundColor: COLORS.primary, borderRadius: BORDER_RADIUS, paddingVertical: 14, paddingHorizontal: 32, marginBottom: SPACING.sm },
  buttonText: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  hint: { fontSize: 12, color: COLORS.textMuted, fontStyle: 'italic' },
});
