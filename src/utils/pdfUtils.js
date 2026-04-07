import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Asset } from 'expo-asset';
import * as WebBrowser from 'expo-web-browser';

export async function getLocalPdfUri(sourceModule, fileName) {
  const asset = Asset.fromModule(sourceModule);
  await asset.downloadAsync();

  const sourceUri = asset.localUri || asset.uri;
  if (!sourceUri) {
    throw new Error('Missing PDF source URI');
  }

  if (!FileSystem.cacheDirectory) {
    return sourceUri;
  }

  const cachedUri = FileSystem.cacheDirectory + fileName;
  try {
    const cachedInfo = await FileSystem.getInfoAsync(cachedUri);
    if (!cachedInfo.exists) {
      await FileSystem.copyAsync({ from: sourceUri, to: cachedUri });
    }
    return cachedUri;
  } catch (error) {
    return sourceUri;
  }
}

export async function openPdf(sourceModule, fileName, title = 'PDF') {
  try {
    const localUri = await getLocalPdfUri(sourceModule, fileName);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Open ${title}`,
        UTI: 'com.adobe.pdf',
      });
      return;
    }

    await WebBrowser.openBrowserAsync(localUri);
  } catch (error) {
    try {
      const fallbackUri = await getLocalPdfUri(sourceModule, fileName);
      await WebBrowser.openBrowserAsync(fallbackUri);
    } catch (fallbackError) {
      Alert.alert('Error', 'Could not open this PDF.');
    }
  }
}

export async function downloadPdf(sourceModule, fileName, title = 'PDF') {
  try {
    const localUri = await getLocalPdfUri(sourceModule, fileName);
    let targetUri = localUri;

    if (FileSystem.documentDirectory) {
      const savedUri = FileSystem.documentDirectory + fileName;
      const savedInfo = await FileSystem.getInfoAsync(savedUri);

      if (!savedInfo.exists) {
        await FileSystem.copyAsync({ from: localUri, to: savedUri });
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
    try {
      const fallbackUri = await getLocalPdfUri(sourceModule, fileName);
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fallbackUri, {
          mimeType: 'application/pdf',
          dialogTitle: `Download ${title}`,
          UTI: 'com.adobe.pdf',
        });
        return;
      }
    } catch (fallbackError) {
    }

    Alert.alert('Error', 'Could not download this PDF.');
  }
}
