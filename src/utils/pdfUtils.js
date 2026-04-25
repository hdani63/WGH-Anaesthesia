import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';

/**
 * 📁 Get cached/local PDF URI
 */
export async function getLocalPdfUri(sourceModule, fileName) {
  try {
    const asset = Asset.fromModule(sourceModule);
    await asset.downloadAsync();

    const sourceUri = asset.localUri || asset.uri;

    if (!sourceUri) {
      throw new Error('Missing PDF source URI');
    }

    // If cache not available, return directly
    if (!FileSystem.cacheDirectory) {
      return sourceUri;
    }

    const cachedUri = FileSystem.cacheDirectory + fileName;

    const cachedInfo = await FileSystem.getInfoAsync(cachedUri);

    if (!cachedInfo.exists) {
      await FileSystem.copyAsync({
        from: sourceUri,
        to: cachedUri,
      });
    }

    return cachedUri;
  } catch (error) {
    console.log('getLocalPdfUri error:', error);
    throw error;
  }
}

/**
 * 📖 OPEN PDF (READ MODE) — navigates to in-app PdfViewerScreen
 * Pass the navigation object from the calling component.
 */
export async function openPdf(sourceModule, fileName, title = 'PDF', navigation = null) {
  try {
    const localUri = await getLocalPdfUri(sourceModule, fileName);

    if (navigation) {
      navigation.navigate('PdfViewerScreen', { uri: localUri, title });
    } else {
      // Fallback: share if no navigation provided
      await Sharing.shareAsync(localUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Open ${title}`,
        UTI: 'com.adobe.pdf',
      });
    }
  } catch (error) {
    console.log('Open PDF error:', error);
    Alert.alert('Error', 'Could not open this PDF.');
  }
}

/**
 * 📥 DOWNLOAD PDF
 */
export async function downloadPdf(sourceModule, fileName, title = 'PDF') {
  try {
    const localUri = await getLocalPdfUri(sourceModule, fileName);

    let targetUri = localUri;

    if (FileSystem.documentDirectory) {
      const savedUri = FileSystem.documentDirectory + fileName;

      const savedInfo = await FileSystem.getInfoAsync(savedUri);

      if (!savedInfo.exists) {
        await FileSystem.copyAsync({
          from: localUri,
          to: savedUri,
        });
      }

      targetUri = savedUri;
    }

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Download ${title}`,
        UTI: 'com.adobe.pdf',
      });
    } else {
      Alert.alert('Downloaded', `Saved PDF:\n${targetUri}`);
    }

  } catch (error) {
    console.log('Download PDF error:', error);
    Alert.alert('Error', 'Could not download this PDF.');
  }
}