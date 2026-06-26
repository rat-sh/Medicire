// ─── App Configuration ────────────────────────────────────────────────────────
// Sensitive values are read from .env via react-native-config.
// Use Config.USE_MOCK in dev; always false in production release.

import RNConfig from 'react-native-config';

export const Config = {
  // ─── Mock Data Toggle ───────────────────────────────────────────────────────
  // Reads USE_MOCK from .env; defaults to __DEV__ so production builds are never
  // accidentally shipped in mock mode when the env var is absent.
  USE_MOCK: RNConfig.USE_MOCK === 'true' || (RNConfig.USE_MOCK === undefined && __DEV__),

  // ─── API ────────────────────────────────────────────────────────────────────
  // .env: API_BASE_URL=https://api.medicire.app/v1
  API_BASE_URL: RNConfig.API_BASE_URL ?? 'https://api.medicire.app/v1',
  API_TIMEOUT: 15000, // 15 seconds

  // ─── Socket.io ──────────────────────────────────────────────────────────────
  // .env: SOCKET_URL=https://api.medicire.app
  SOCKET_URL: RNConfig.SOCKET_URL ?? 'https://api.medicire.app',

  // ─── Cloudinary ─────────────────────────────────────────────────────────────
  // .env: CLOUDINARY_CLOUD_NAME=medicire  CLOUDINARY_UPLOAD_PRESET=rx_uploads
  CLOUDINARY_CLOUD_NAME:    RNConfig.CLOUDINARY_CLOUD_NAME   ?? 'medicire',
  CLOUDINARY_UPLOAD_PRESET: RNConfig.CLOUDINARY_UPLOAD_PRESET ?? 'rx_uploads',

  // ─── Maps ───────────────────────────────────────────────────────────────────
  MAP_PROVIDER: 'osm' as const,

  // ─── App ────────────────────────────────────────────────────────────────────
  APP_NAME: 'Medicire',
  APP_VERSION: '1.0.0',

  // ─── OTP / Auth ─────────────────────────────────────────────────────────────
  OTP_LENGTH: 6,
  OTP_RESEND_TIMEOUT: 30, // seconds
} as const;
