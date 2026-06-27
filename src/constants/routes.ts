// ─── Route Name Constants ─────────────────────────────────────────────────────
// Single source of truth for all navigation route names.

export const Routes = {
  // Auth Stack
  ONBOARDING: 'Onboarding',
  SPLASH: 'Splash',
  LOGIN: 'Login',
  SIGNUP: 'Signup',
  OTP: 'Otp',
  LOCATION_PERM: 'LocationPerm',
  PROFILE_SETUP: 'ProfileSetup',

  // Main Tab Navigator
  MAIN: 'Main',
  HOME_TAB: 'HomeTab',
  SEARCH_TAB: 'SearchTab',
  VAULT_TAB: 'VaultTab',
  RESERVATIONS_TAB: 'ReservationsTab',
  PROFILE_TAB: 'ProfileTab',

  // Home Stack
  HOME: 'Home',

  // Search Stack
  SEARCH: 'Search',
  SEARCH_SUGGESTIONS: 'SearchSuggestions',
  RESULTS_LIST: 'ResultsList',
  RESULTS_MAP: 'ResultsMap',
  PHARMACY_DETAIL: 'PharmacyDetail',
  FULL_MAP: 'FullMap',

  // Prescription Stack
  RX_UPLOAD: 'RxUpload',
  RX_CROP: 'RxCrop',
  RX_PROGRESS: 'RxProgress',
  RX_OCR: 'RxOcr',
  RX_REVIEW: 'RxReview',
  RX_RESULTS: 'RxResults',
  RX_COMPARE: 'RxCompare',

  // Vault Stack
  VAULT: 'Vault',
  VAULT_DETAIL: 'VaultDetail',

  // Reservation Stack
  RSV_CONFIRM: 'ReservationConfirm',
  RSV_STATUS: 'ReservationStatus',
  RSV_TRACKER: 'ReservationTracker',

  // Account Stack (inside ProfileTab)
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  ADDRESSES: 'Addresses',
  CONDITIONS: 'Conditions',
  NOTIF_PREFS: 'NotifPrefs',
  DELETE_ACCOUNT: 'DeleteAccount',
} as const;

export type RouteName = (typeof Routes)[keyof typeof Routes];
