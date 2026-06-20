// ─── User Types ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  conditions: string[];
  savedAddresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  label: 'home' | 'work' | 'other';
  line1: string;
  line2?: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
