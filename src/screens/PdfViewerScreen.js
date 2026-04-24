import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/theme';

export default function PdfViewerScreen({ route }) {
  const { uri, title } = route.params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [pdfUri, setPdfUri] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadPdf();
  }, [uri]);

  const loadPdf = async () => {
    try {
      setLoading(true);
      setError(false);

      // Read the PDF file using expo-file-system
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Create a data URI
      const dataUri = `data:application/pdf;base64,${base64}`;
      setPdfUri(dataUri);
      setLoading(false);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setError(true);
      setLoading(false);
      Alert.alert('Error', 'Could not load PDF file');
    }
  };

  const handleDownload = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Download ${title}`,
          UTI: 'com.adobe.pdf',
        });
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Could not download PDF');
    }
  };

  const handleRetry = () => {
    loadPdf();
  };

  if (error) {
    return (
      <LinearGradient
        colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientContainer}
      >
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backBtn} 
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="arrow-left" size={16} color={COLORS.white} />
              <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <FontAwesome5 name="file-pdf" size={16} color={COLORS.white} style={styles.headerIcon} />
              <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            </View>

            <TouchableOpacity 
              style={styles.downloadBtn} 
              onPress={handleDownload}
              activeOpacity={0.7}
            >
              <FontAwesome5 name="download" size={14} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.errorContainer}>
            <FontAwesome5 name="exclamation-circle" size={48} color={COLORS.primary} />
            <Text style={styles.errorText}>Unable to Load PDF</Text>
            <Text style={styles.errorSubtext}>There was an issue loading the PDF file</Text>
            
            <View style={styles.errorButtonContainer}>
              <TouchableOpacity style={styles.retryBtn} onPress={handleRetry}>
                <FontAwesome5 name="redo" size={14} color={COLORS.white} style={styles.btnIcon} />
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.downloadErrorBtn} onPress={handleDownload}>
                <FontAwesome5 name="download" size={14} color={COLORS.white} style={styles.btnIcon} />
                <Text style={styles.downloadErrorBtnText}>Download Instead</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[COLORS.headerGradientStart, COLORS.headerGradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="arrow-left" size={16} color={COLORS.white} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>

          <View style={styles.titleContainer}>
            <FontAwesome5 name="file-pdf" size={16} color={COLORS.white} style={styles.headerIcon} />
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
          </View>

          <TouchableOpacity 
            style={styles.downloadBtn} 
            onPress={handleDownload}
            activeOpacity={0.7}
          >
            <FontAwesome5 name="download" size={14} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.pdfContainer}>
          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading PDF...</Text>
            </View>
          ) : pdfUri ? (
            <WebView
              source={{ uri: pdfUri }}
              style={styles.webview}
              javaScriptEnabled={true}
              originWhitelist={['*']}
              scalesPageToFit={true}
              onError={(error) => {
                console.error('WebView error:', error);
                setError(true);
              }}
            />
          ) : null}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 8,
    borderRadius: BORDER_RADIUS,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.sm,
  },
  headerIcon: {
    marginRight: SPACING.sm,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    flex: 1,
  },
  downloadBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: 14,
    color: COLORS.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: SPACING.md,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  errorSubtext: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  errorButtonContainer: {
    marginTop: SPACING.lg,
    width: '100%',
    gap: SPACING.sm,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
  retryBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  downloadErrorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: BORDER_RADIUS,
  },
  downloadErrorBtnText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  btnIcon: {
    marginRight: 0,
  },
});
