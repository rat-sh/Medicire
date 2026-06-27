import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { NavigatorScreenParams } from '@react-navigation/native';
import { Routes } from '@/constants/routes';

// ─── Auth Stack ───────────────────────────────────────────────────────────────
export type AuthStackParamList = {
  [Routes.ONBOARDING]: undefined;
  [Routes.SPLASH]: undefined;
  [Routes.LOGIN]: undefined;
  [Routes.SIGNUP]: undefined;
  [Routes.OTP]: { phone: string; name?: string; mode?: 'login' | 'signup' };
  [Routes.LOCATION_PERM]: undefined;
  [Routes.PROFILE_SETUP]: undefined;
};

// ─── Home Stack ───────────────────────────────────────────────────────────────
export type HomeStackParamList = {
  [Routes.HOME]: undefined;
  [Routes.NOTIFICATIONS]: undefined;
};

// ─── Search Stack ─────────────────────────────────────────────────────────────
export type SearchStackParamList = {
  [Routes.SEARCH]: undefined;
  [Routes.SEARCH_SUGGESTIONS]: { query: string };
  [Routes.RESULTS_LIST]: { medicineId: string; medicineName: string };
  [Routes.RESULTS_MAP]: { medicineId: string; medicineName: string };
  [Routes.PHARMACY_DETAIL]: { pharmacyId: string; medicineId?: string };
  [Routes.FULL_MAP]: undefined;
  [Routes.RSV_CONFIRM]: { pharmacyId: string; medicineId: string };
  [Routes.RSV_STATUS]: {
    reservationId: string;
    status: 'pending' | 'confirmed' | 'ready' | 'out_for_delivery' | 'cancelled' | 'completed';
  };
};

// ─── Prescription Stack ───────────────────────────────────────────────────────
export type RxStackParamList = {
  [Routes.RX_UPLOAD]: undefined;
  [Routes.RX_CROP]: { imageUri: string };
  [Routes.RX_PROGRESS]: { imageUri: string };
  [Routes.RX_OCR]: { prescriptionId: string };
  [Routes.RX_REVIEW]: { prescriptionId: string };
  [Routes.RX_RESULTS]: { prescriptionId: string };
  [Routes.RX_COMPARE]: { prescriptionId: string };
};

// ─── Vault Stack (includes prescription upload flow) ────────────────────────
export type VaultStackParamList = {
  [Routes.VAULT]: undefined;
  [Routes.VAULT_DETAIL]: { prescriptionId: string };
  [Routes.RX_UPLOAD]: undefined;
  [Routes.RX_CROP]: { imageUri: string };
  [Routes.RX_PROGRESS]: { imageUri: string };
  [Routes.RX_OCR]: { prescriptionId: string };
  [Routes.RX_REVIEW]: { prescriptionId: string };
  [Routes.RX_RESULTS]: { prescriptionId: string };
  [Routes.RX_COMPARE]: { prescriptionId: string };
  [Routes.RSV_CONFIRM]: { pharmacyId: string; medicineId: string };
  [Routes.RSV_STATUS]: {
    reservationId: string;
    status: 'pending' | 'confirmed' | 'ready' | 'out_for_delivery' | 'cancelled' | 'completed';
  };
};

// ─── Reservation Stack ────────────────────────────────────────────────────────
export type ReservationStackParamList = {
  [Routes.RSV_TRACKER]: undefined;
  [Routes.RSV_STATUS]: {
    reservationId: string;
    status: 'pending' | 'confirmed' | 'ready' | 'out_for_delivery' | 'cancelled' | 'completed';
  };
  [Routes.RSV_CONFIRM]: { pharmacyId: string; medicineId: string };
};

// ─── Profile Stack ────────────────────────────────────────────────────────────
export type ProfileStackParamList = {
  [Routes.PROFILE]: undefined;
  [Routes.NOTIFICATIONS]: undefined;
  [Routes.SETTINGS]: undefined;
  [Routes.ADDRESSES]: undefined;
  [Routes.CONDITIONS]: undefined;
  [Routes.NOTIF_PREFS]: undefined;
  [Routes.DELETE_ACCOUNT]: undefined;
};

// ─── Bottom Tab ───────────────────────────────────────────────────────────────
export type MainTabParamList = {
  [Routes.HOME_TAB]: undefined;
  [Routes.SEARCH_TAB]: NavigatorScreenParams<SearchStackParamList> | undefined;
  [Routes.VAULT_TAB]: NavigatorScreenParams<VaultStackParamList> | undefined;
  [Routes.RESERVATIONS_TAB]: NavigatorScreenParams<ReservationStackParamList> | undefined;
  [Routes.PROFILE_TAB]: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

// ─── Root Navigator ───────────────────────────────────────────────────────────
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

// ─── Screen Prop Types ────────────────────────────────────────────────────────
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type HomeScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type SearchScreenProps<T extends keyof SearchStackParamList> =
  NativeStackScreenProps<SearchStackParamList, T>;

export type RxScreenProps<T extends keyof RxStackParamList> =
  NativeStackScreenProps<RxStackParamList, T>;

export type VaultScreenProps<T extends keyof VaultStackParamList> =
  NativeStackScreenProps<VaultStackParamList, T>;

export type ReservationScreenProps<T extends keyof ReservationStackParamList> =
  NativeStackScreenProps<ReservationStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;
