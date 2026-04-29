import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, ActivityIndicator, StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';
import { getLocalPdfUri } from '../utils/pdfUtils';

let PdfComponent = null;
try {
  // Avoid startup crash when native module is unavailable in Expo Go / mislinked builds.
  PdfComponent = require('react-native-pdf').default;
} catch (_error) {
  PdfComponent = null;
}

export default function PdfViewerScreen({ route }) {
  const { uri, source, fileName, title } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [triedFallback, setTriedFallback] = useState(false);
  const [resolvedSource, setResolvedSource] = useState(null);
  const [useWebViewFallback, setUseWebViewFallback] = useState(false);
  const normalizedUri = typeof uri === 'string' && uri.startsWith('/') ? `file://${uri}` : uri;
  const isLocalFile = typeof normalizedUri === 'string' && normalizedUri.startsWith('file://');
  const fallbackSource = source ? source : (normalizedUri ? { uri: normalizedUri, cache: !isLocalFile } : null);
  const pdfSource = resolvedSource || fallbackSource;

  useEffect(() => {
    let mounted = true;
    const prepare = async () => {
      if (source && fileName) {
        try {
          const localUri = await getLocalPdfUri(source, fileName);
          const safeUri = typeof localUri === 'string' && localUri.startsWith('/') ? `file://${localUri}` : localUri;
          if (mounted) setResolvedSource({ uri: safeUri, cache: false });
          return;
        } catch (_e) {}
      }
      if (mounted) setResolvedSource(null);
    };
    prepare();
    return () => {
      mounted = false;
    };
  }, [source, fileName]);

  const handleDownload = async () => {
    try {
      if (source && fileName) {
        const localUri = await getLocalPdfUri(source, fileName);
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(localUri, {
            mimeType: 'application/pdf',
            dialogTitle: `Download ${title}`,
            UTI: 'com.adobe.pdf',
          });
        }
        return;
      }

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Download ${title}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.headerGradientStart} />
      <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

        {/* App-level header — matches ScreenWrapper */}
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
              <Text style={styles.appHeaderTitle}>WGH Anaesthesia</Text>
              <Text style={styles.appHeaderSubtitle}>Anaesthesia For Wexford General Hospital</Text>
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
                  <FontAwesome5 name="file-pdf" size={18} color={COLORS.medicalBlue} style={styles.pageIcon} />
                  <Text style={styles.pageTitle} numberOfLines={2}>{title}</Text>
                </View>
                <Text style={styles.pageSubtitle}>PDF Document</Text>
              </View>
              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.downloadBtn} onPress={handleDownload} activeOpacity={0.7}>
                  <FontAwesome5 name="download" size={13} color={COLORS.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
                  <FontAwesome5 name="arrow-left" size={14} color={COLORS.primary} style={styles.backIcon} />
                  <Text style={styles.backText}>Back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* PDF content area */}
        <View style={styles.pdfContainer}>
          {useWebViewFallback ? (
            <WebView
              source={resolvedSource?.uri ? { uri: resolvedSource.uri } : { uri: normalizedUri }}
              style={styles.pdf}
              originWhitelist={['*']}
              allowingReadAccessToURL={resolvedSource?.uri || normalizedUri}
              onLoadEnd={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
          ) : error || !PdfComponent ? (
            <View style={styles.errorContainer}>
              <FontAwesome5 name="exclamation-circle" size={48} color={COLORS.primary} />
              <Text style={styles.errorText}>{PdfComponent ? 'Unable to Load PDF' : 'PDF Viewer Unavailable'}</Text>
              <Text style={styles.errorSubtext}>
                {PdfComponent ? 'There was an issue loading the PDF file' : 'Use Download Instead on this build.'}
              </Text>
              <View style={styles.errorButtonContainer}>
                {PdfComponent ? (
                  <TouchableOpacity style={styles.retryBtn} onPress={() => setError(false)}>
                    <FontAwesome5 name="redo" size={14} color={COLORS.white} style={{ marginRight: 8 }} />
                    <Text style={styles.retryBtnText}>Retry</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity style={styles.downloadErrorBtn} onPress={handleDownload}>
                  <FontAwesome5 name="download" size={14} color={COLORS.white} style={{ marginRight: 8 }} />
                  <Text style={styles.downloadErrorBtnText}>Download Instead</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              {loading && (
                <View style={styles.loaderContainer}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Loading PDF...</Text>
                </View>
              )}

              {pdfSource ? (
              <PdfComponent
                trustAllCerts={false}
                source={pdfSource}
                style={[styles.pdf, loading && styles.pdfHidden]}
                onLoadComplete={(pages) => {
                  setTotalPages(pages);
                  setLoading(false);
                }}
                onPageChanged={(page) => setCurrentPage(page)}
                onError={(err) => {
                  console.error('PDF load error:', err);
                  if (!triedFallback && source && resolvedSource) {
                    setTriedFallback(true);
                    setResolvedSource(null);
                    setLoading(true);
                    setError(false);
                    return;
                  }
                  if (!useWebViewFallback) {
                    setLoading(true);
                    setUseWebViewFallback(true);
                    return;
                  }
                  setLoading(false);
                  setError(true);
                }}
                fitPolicy={0}
              />
              ) : null}

              {!loading && totalPages > 0 && (
                <View style={styles.pageIndicator}>
                  <Text style={styles.pageText}>{currentPage} / {totalPages}</Text>
                </View>
              )}
            </>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  // App header — identical to ScreenWrapper
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

  // Page header card — identical to ScreenWrapper pageHeader
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
  pageTitle: { fontSize: 15, fontWeight: '700', color: COLORS.medicalBlue, flex: 1 },
  pageSubtitle: { fontSize: 12, color: COLORS.textMuted, marginTop: 4 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  downloadBtn: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS,
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
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

  // PDF area
  pdfContainer: { flex: 1, backgroundColor: COLORS.background },
  pdf: { flex: 1, width: '100%', backgroundColor: '#f5f5f5' },
  pdfHidden: { opacity: 0, position: 'absolute' },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    zIndex: 1,
  },
  loadingText: { marginTop: SPACING.md, fontSize: 14, color: COLORS.textMuted },
  pageIndicator: {
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pageText: { color: COLORS.white, fontSize: 12, fontWeight: '600' },

  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: SPACING.md,
  },
  errorText: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginTop: SPACING.md },
  errorSubtext: { fontSize: 12, color: COLORS.textMuted, marginTop: SPACING.sm },
  errorButtonContainer: { marginTop: SPACING.lg, width: '100%', gap: SPACING.sm },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
  retryBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  downloadErrorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
  downloadErrorBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
});
