// ─── App Configuration ────────────────────────────────────────────────────────
// Toggle USE_MOCK to switch between real API and mock data.
// When your backend is ready, set USE_MOCK to false and provide the API_BASE_URL.

export const Config = {
  // ─── Mock Data Toggle ───────────────────────────────────────────────────────
  // true  → app uses local mock data (no backend required)
  // false → app hits real API endpoints
  USE_MOCK: true,

  // ─── API ────────────────────────────────────────────────────────────────────
  API_BASE_URL: 'https://api.medicire.app/v1', // Replace when backend is ready
  API_TIMEOUT: 15000, // 15 seconds

  // ─── Socket.io ──────────────────────────────────────────────────────────────
  SOCKET_URL: 'https://api.medicire.app', // Replace when backend is ready

  // ─── Cloudinary ─────────────────────────────────────────────────────────────
  CLOUDINARY_CLOUD_NAME: 'medicire',       // Replace with your cloud name
  CLOUDINARY_UPLOAD_PRESET: 'rx_uploads',  // Replace with your preset

  // ─── Maps ───────────────────────────────────────────────────────────────────
  // Using OpenStreetMap via react-native-maps — completely FREE
  // No API key required for OpenStreetMap tiles
  MAP_PROVIDER: 'osm' as const, // 'osm' = OpenStreetMap (free) | 'google' = Google Maps

  // ─── App ────────────────────────────────────────────────────────────────────
  APP_NAME: 'Medicire',
  APP_VERSION: '1.0.0',

  // ─── OTP / Auth ─────────────────────────────────────────────────────────────
  OTP_LENGTH: 6,
  OTP_RESEND_TIMEOUT: 30, // seconds
} as const;
