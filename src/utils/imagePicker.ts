import { Alert, PermissionsAndroid, Platform } from 'react-native';
import {
  launchCamera,
  launchImageLibrary,
  type CameraOptions,
  type ImageLibraryOptions,
} from 'react-native-image-picker';

const PICKER_OPTIONS: CameraOptions & ImageLibraryOptions = {
  mediaType: 'photo',
  quality: 0.8,
  saveToPhotos: false,
};

const requestCameraPermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Camera Permission',
      message: 'Medicire needs camera access to capture prescription photos.',
      buttonNeutral: 'Ask Me Later',
      buttonNegative: 'Cancel',
      buttonPositive: 'OK',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED;
};

export const pickImageFromCamera = async (): Promise<string | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    Alert.alert(
      'Camera Permission Denied',
      'Enable camera access in Settings to capture prescriptions.',
    );
    return null;
  }

  const result = await launchCamera(PICKER_OPTIONS);
  if (result.didCancel || result.errorCode) {
    return null;
  }

  return result.assets?.[0]?.uri ?? null;
};

export const pickImageFromGallery = async (): Promise<string | null> => {
  const result = await launchImageLibrary(PICKER_OPTIONS);
  if (result.didCancel || result.errorCode) {
    return null;
  }

  return result.assets?.[0]?.uri ?? null;
};
