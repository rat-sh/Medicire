import { useCallback } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { useLocationStore } from '@/store/locationStore';
import { storage, StorageKeys, storeObject } from '@/services/storage/mmkv';

export const useLocation = () => {
  const {
    latitude,
    longitude,
    city,
    hasPermission,
    isLoading,
    setLocation,
    setPermission,
    setLoading,
  } = useLocationStore();

  const requestLocation = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    try {
      let hasPerm = false;

      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Medicire needs access to your location to find nearby pharmacies.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        hasPerm = granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const status = await Geolocation.requestAuthorization('whenInUse');
        hasPerm = status === 'granted';
      }

      if (hasPerm) {
        setPermission(true);
        return new Promise((resolve) => {
          Geolocation.getCurrentPosition(
            (position) => {
              const { latitude: lat, longitude: lng } = position.coords;
              setLocation(lat, lng);
              storeObject(StorageKeys.LAST_LOCATION, {
                latitude: lat,
                longitude: lng,
                city: '', // TODO: Reverse geocode if needed
              });
              resolve(true);
            },
            (error) => {
              if (__DEV__) {
                // eslint-disable-next-line no-console
                console.error('[DEV] Location error:', error);
              }
              Alert.alert('Error', 'Unable to fetch your current location. Please ensure GPS is enabled.');
              resolve(false);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
          );
        });
      } else {
        setPermission(false);
        Alert.alert(
          'Location Permission Denied',
          'Enable location in Settings to find pharmacies near you.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ],
        );
        return false;
      }
    } catch (err) {
      if (__DEV__) {
        // eslint-disable-next-line no-console
        console.error('[DEV] Request location error:', err);
      }
      setPermission(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setPermission, setLoading, setLocation]);

  const saveLocation = useCallback(
    (lat: number, lng: number, cityName?: string) => {
      setLocation(lat, lng, cityName);
      storeObject(StorageKeys.LAST_LOCATION, {
        latitude: lat,
        longitude: lng,
        city: cityName ?? '',
      });
    },
    [setLocation],
  );

  const hydrateLocation = useCallback(() => {
    const saved = storage.getString(StorageKeys.LAST_LOCATION);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as {
        latitude: number;
        longitude: number;
        city?: string;
      };
      setLocation(parsed.latitude, parsed.longitude, parsed.city);
      setPermission(true);
    } catch {
      // ignore invalid cache
    }
  }, [setLocation, setPermission]);

  const locationLabel =
    city?.trim() ||
    (latitude != null && longitude != null ? 'Current location' : 'Set your location');

  return {
    latitude,
    longitude,
    city: locationLabel,
    hasPermission,
    isLoading,
    requestLocation,
    saveLocation,
    hydrateLocation,
  };
};
