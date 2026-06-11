import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { departmentService } from '../services/departmentService';

const FALLBACK_SHEET_URL =
  'https://docs.google.com/spreadsheets/d/1vunHVcoOIxHSirSwmybQofc-t81AJsKV25tZR9008q4/edit?usp=drivesdk';

// Extract Google Sheets ID and convert to embeddable URL
const formatGoogleSheetsUrl = (url) => {
  if (!url) return '';

  // Extract sheet ID from various Google Sheets URL formats
  const sheetIdMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9_-]+)/);
  if (sheetIdMatch && sheetIdMatch[1]) {
    const sheetId = sheetIdMatch[1];
    // Return format that works in WebView
    return `https://docs.google.com/spreadsheets/d/${sheetId}/edit?usp=sharing`;
  }

  return url;
};

export default function DepartmentalTeachingScreen() {
  const navigation = useNavigation();
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetKey, setSheetKey] = useState(0);
  const [fetchLoading, setFetchLoading] = useState(false);

  // Fetch on mount so the inline WebView loads straight away
  useEffect(() => {
    fetchTeachingSchedule();
  }, []);

  const fetchTeachingSchedule = async (forceRefresh = false) => {
    try {
      setFetchLoading(true);
      const teachingSchedule = await departmentService.getTeachingSchedule();

      if (teachingSchedule?.url) {
        const formattedUrl = forceRefresh
          ? `${formatGoogleSheetsUrl(teachingSchedule.url)}&t=${Date.now()}`
          : formatGoogleSheetsUrl(teachingSchedule.url);
        setSheetUrl(formattedUrl);
        return formattedUrl;
      } else {
        // Fall back to hardcoded URL instead of showing an error alert
        setSheetUrl(FALLBACK_SHEET_URL);
        return FALLBACK_SHEET_URL;
      }
    } catch {
      // Fall back to hardcoded URL when the backend is unreachable
      setSheetUrl(FALLBACK_SHEET_URL);
      return FALLBACK_SHEET_URL;
    } finally {
      setFetchLoading(false);
    }
  };

  const handleRefresh = async () => {
    const nextUrl = await fetchTeachingSchedule(true);
    if (nextUrl) {
      setSheetKey((previous) => previous + 1);
    }
  };

  const handleOpenInBrowser = () => {
    const url = sheetUrl || FALLBACK_SHEET_URL;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open the link in your browser.')
    );
  };

  // URL shown in the inline WebView – prefer the fetched one, fall back to hardcoded
  const activeUrl = sheetUrl || FALLBACK_SHEET_URL;

  return (
    <ScreenWrapper title="Departmental Teaching Resources" subtitle="Educational materials and training resources for the Anaesthesia Department">
      <View style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceIconWrap}>
            <FontAwesome5 name="graduation-cap" size={20} color={COLORS.white} />
          </View>
          <View style={styles.resourceHeaderTextWrap}>
            <Text style={styles.resourceTitle}>Teaching Schedule</Text>
            <Text style={styles.resourceSubtitle}>Google Sheets schedule with tutorials, topics, and presenters.</Text>
          </View>
        </View>
      </View>

      {/* Inline schedule embed – always visible */}
      <View style={styles.embedCard}>
        {fetchLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading sheet...</Text>
          </View>
        ) : (
          <WebView
            key={sheetKey}
            source={{ uri: activeUrl }}
            startInLoadingState
            style={styles.webView}
            javaScriptEnabled={true}
            scalesPageToFit={true}
            scrollEnabled={true}
            originWhitelist={['*']}
            cacheEnabled={false}
            renderLoading={() => (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Loading sheet...</Text>
              </View>
            )}
            onError={() => Alert.alert('Error', 'Failed to load Google Sheet')}
          />
        )}
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={14} color={COLORS.white} style={styles.btnIcon} />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleOpenInBrowser}>
          <FontAwesome5 name="external-link-alt" size={13} color={COLORS.primary} style={styles.btnIcon} />
          <Text style={styles.outlineBtnText}>Open in Browser</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoBtn} onPress={handleRefresh} disabled={fetchLoading}>
          <FontAwesome5 name="sync-alt" size={13} color={COLORS.dark} style={styles.btnIcon} />
          <Text style={styles.infoBtnText}>Refresh Sheet</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: SPACING.xl,
  },
  loadingText: {
    marginTop: SPACING.md,
    color: COLORS.textMuted,
    fontSize: 14,
  },
  resourceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
    ...SHADOW,
  },
  resourceHeader: {
    backgroundColor: COLORS.medicalBlue,
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  resourceIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  resourceHeaderTextWrap: { flex: 1 },
  resourceTitle: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  resourceSubtitle: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    lineHeight: 18,
  },
  embedCard: {
    borderRadius: BORDER_RADIUS,
    borderWidth: 2,
    borderColor: COLORS.medicalBlue || '#2c5282',
    overflow: 'hidden',
    marginBottom: SPACING.md,
    height: 500,
    backgroundColor: COLORS.white,
    ...SHADOW,
  },
  webView: {
    flex: 1,
  },
  actionsCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: SPACING.sm,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.white,
  },
  outlineBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  infoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#17a2b8',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 16,
    backgroundColor: '#e8f8fb',
  },
  infoBtnText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '600',
  },
  btnIcon: {
    marginRight: 8,
  },
});
