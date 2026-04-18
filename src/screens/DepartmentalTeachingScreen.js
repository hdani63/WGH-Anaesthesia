import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import ScreenWrapper from '../components/ScreenWrapper';
import FullScreenWebModal from '../components/common/FullScreenWebModal';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const API_BASE = 'http://localhost:9000/api'; // Change to your backend URL

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
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetUrl, setSheetUrl] = useState('');
  const [sheetKey, setSheetKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [fetchLoading, setFetchLoading] = useState(false);

  useEffect(() => {
    fetchTeachingSchedule();
  }, []);

  const fetchTeachingSchedule = async () => {
    try {
      setFetchLoading(true);
      const response = await fetch(`${API_BASE}/teaching`);
      const data = await response.json();

      if (data.success && data.data) {
        const formattedUrl = formatGoogleSheetsUrl(data.data.url);
        setSheetUrl(formattedUrl);
      } else {
        Alert.alert('Error', 'Failed to load teaching schedule');
      }
    } catch (error) {
      console.error('Error fetching teaching schedule:', error);
      Alert.alert('Error', 'Unable to connect to server');
    } finally {
      setFetchLoading(false);
      setLoading(false);
    }
  };

  const handleOpenSchedule = () => {
    if (sheetUrl) {
      setSheetKey((previous) => previous + 1);
      setSheetVisible(true);
    } else {
      Alert.alert('Error', 'Teaching schedule URL not available');
    }
  };

  const handleRefresh = () => {
    setSheetUrl(`${sheetUrl}&t=${Date.now()}`);
  };

  if (loading) {
    return (
      <ScreenWrapper title="Departmental Teaching Resources" subtitle="Educational materials and training resources for the Anaesthesia Department">
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading teaching schedule...</Text>
        </View>
      </ScreenWrapper>
    );
  }

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

        <View style={styles.infoBox}>
          <FontAwesome5 name="info-circle" size={14} color={COLORS.info} style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Open the teaching schedule directly inside the app.
          </Text>
        </View>
      </View>

      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigation.navigate('Home')}>
          <FontAwesome5 name="home" size={14} color={COLORS.white} style={styles.btnIcon} />
          <Text style={styles.primaryBtnText}>Back to Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outlineBtn} onPress={handleOpenSchedule} disabled={fetchLoading}>
          <FontAwesome5 name="table" size={13} color={COLORS.primary} style={styles.btnIcon} />
          <Text style={styles.outlineBtnText}>Open Teaching Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoBtn} onPress={handleRefresh} disabled={fetchLoading}>
          <FontAwesome5 name="sync-alt" size={13} color={COLORS.dark} style={styles.btnIcon} />
          <Text style={styles.infoBtnText}>Refresh Sheet</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Use Open Teaching Schedule to view the sheet inside the app.</Text>
      </View>

      <View style={styles.footerCard}>
        <Text style={styles.footerTitle}>Important Note</Text>
        <Text style={styles.footerText}>
          Always verify dates and venues in the live sheet before departmental sessions.
        </Text>
      </View>

      <FullScreenWebModal
        visible={sheetVisible}
        title="Teaching Schedule"
        onClose={() => setSheetVisible(false)}
        headerActions={(
          <TouchableOpacity style={styles.webViewActionBtn} onPress={handleRefresh}>
            <FontAwesome5 name="sync-alt" size={12} color={COLORS.white} />
          </TouchableOpacity>
        )}
      >
        <WebView
          key={sheetKey}
          source={{ uri: sheetUrl }}
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
      </FullScreenWebModal>
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
  infoBox: {
    backgroundColor: '#eef7ff',
    borderTopWidth: 1,
    borderTopColor: '#cce4ff',
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoIcon: { marginTop: 2, marginRight: 8 },
  infoText: {
    flex: 1,
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 19,
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
  hint: {
    marginTop: SPACING.sm,
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textMuted,
    fontStyle: 'italic',
  },
  footerCard: {
    backgroundColor: '#fff8e1',
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: '#f7df97',
    padding: SPACING.md,
    ...SHADOW,
  },
  footerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8a6d1d',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 13,
    color: '#6f5a1b',
    lineHeight: 18,
  },
  webViewActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webView: {
    flex: 1,
  },
});
