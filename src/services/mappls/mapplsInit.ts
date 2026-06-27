/**
 * mapplsInit.ts
 * Initialises the Mappls (MapMyIndia) SDK once at app launch.
 *
 * The auth-legacy SDK uses OAuth 2.0 credentials (Map SDK Key + Client ID +
 * Client Secret) set via module-level calls before any MapView is rendered.
 *
 * Call `initMappls()` once, early in app startup (e.g. src/app/index.tsx).
 */
import {
  setMapSDKKey,
  setAtlasClientId,
  setAtlasClientSecret,
  setConnected,
} from 'mappls-map-react-native';
import { Config } from '@/constants/config';

let _initialised = false;

export function initMappls(): void {
  if (_initialised) return;
  _initialised = true;

  // Set the REST / Map SDK key (used for tile fetching)
  setMapSDKKey(Config.MAPPLS_MAP_SDK_KEY);

  // OAuth 2.0 Atlas credentials (Client ID + Client Secret)
  setAtlasClientId(Config.MAPPLS_CLIENT_ID);
  setAtlasClientSecret(Config.MAPPLS_CLIENT_SECRET);

  // Mark the SDK as online
  setConnected(true);
}
