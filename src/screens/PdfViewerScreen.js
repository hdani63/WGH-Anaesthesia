import React from 'react';
// Added Platform to the import list below
import { StyleSheet, View, ActivityIndicator, Platform } from 'react-native'; 
import { WebView } from 'react-native-webview';

export default function PdfViewerScreen({ route }) {
  const { uri } = route.params;

  /**
   * Android WebView cannot render PDFs directly from a file:// URI.
   * If the URI is local, we use a different approach or a viewer.
   * NOTE: Google Docs Viewer requires a web-accessible URL. 
   * For local assets on Android, the most reliable "In-App" feel 
   * is often just the WebView on iOS and a reader for Android.
   */
  const finalUri = Platform.OS === 'ios' 
    ? uri 
    : `https://docs.google.com/viewer?url=${encodeURIComponent(uri)}&embedded=true`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: finalUri }}
        originWhitelist={['*']}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        startInLoadingState={true}
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loader} color="#1a3a5c" />
        )}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  webview: { 
    flex: 1 
  },
  loader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Centers the loader precisely
    marginTop: -20,
    marginLeft: -20,
  }
});