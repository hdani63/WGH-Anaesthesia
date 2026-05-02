import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

export default function ITIVAScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  return (
    <LinearGradient
      colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerGradientStart} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* App header — matches ScreenWrapper */}
        <LinearGradient
          colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.appHeader}
        >
          <View style={styles.appHeaderLeft}>
            <View style={styles.appHeaderIconWrap}>
              <FontAwesome5 name="stethoscope" size={24} color={COLORS.white} />
            </View>
            <View>
              <Text style={styles.appHeaderTitle}>WGH Anesthesia</Text>
              <Text style={styles.appHeaderSubtitle}>Anesthesia For Wexford General Hospital</Text>
            </View>
          </View>
          <FontAwesome5 name="hospital" size={38} color="rgba(255,255,255,0.8)" />
        </LinearGradient>

        {/* Page header card — matches ScreenWrapper pageHeader */}
        <View style={styles.pageHeaderWrap}>
          <View style={styles.pageHeader}>
            <View style={styles.pageHeaderRow}>
              <View style={styles.pageHeadingWrap}>
                <View style={styles.pageTitleRow}>
                  <FontAwesome5 name="flask" size={18} color={COLORS.medicalBlue} style={styles.pageIcon} />
                  <Text style={styles.pageTitle}>iTIVA</Text>
                </View>
                <Text style={styles.pageSubtitle}>Target Controlled Infusion</Text>
              </View>
              <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                <FontAwesome5 name="arrow-left" size={14} color={COLORS.primary} style={styles.backIcon} />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* WebView content */}
        <View style={styles.webviewContainer}>
          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading simulator...</Text>
            </View>
          )}

          <WebView
            source={{ uri: 'https://simtiva.app/' }}
            style={[styles.webview, loading && styles.webviewHidden]}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            scalesPageToFit={true}
            userAgent="Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
            onLoadEnd={() => setLoading(false)}
            onError={() => {
              setLoading(false);
            }}
            onHttpError={() => {
              setLoading(false);
            }}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // App header
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  appHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    paddingRight: SPACING.sm,
  },
  appHeaderIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  appHeaderTitle: { fontSize: 22, fontWeight: '700', color: COLORS.white },
  appHeaderSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 2 },

  // Page header card
  pageHeaderWrap: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
  },
  pageHeader: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.sm,
    ...SHADOW,
  },
  pageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageHeadingWrap: { flex: 1, paddingRight: 12 },
  pageTitleRow: { flexDirection: 'row', alignItems: 'center' },
  pageIcon: { marginRight: 8 },
  pageTitle: { fontSize: 16, fontWeight: '700', color: COLORS.medicalBlue },
  pageSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
  },
  backIcon: { marginRight: 6 },
  backText: { color: COLORS.primary, fontSize: 14, fontWeight: '500' },

  // WebView
  webviewContainer: { flex: 1, backgroundColor: COLORS.white },
  webview: { flex: 1 },
  webviewHidden: { opacity: 0, position: 'absolute' },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: { marginTop: SPACING.md, fontSize: 14, color: COLORS.textMuted },
});
