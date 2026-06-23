import apiClient from './client';
import type { User, AuthTokens } from '@/types/user';

/**
 * Auth API service.
 *
 * Required backend endpoints (QuickMeds_Backend — to be wired):
 *   POST /auth/login          { phone, password }
 *   POST /auth/register       { name, phone, password, email? }
 *   POST /auth/send-otp         { phone }
 *   POST /auth/verify-otp       { phone, otp }
 *   PATCH /users/profile        { age?, gender?, conditions? }
 *
 * Current backend has partial routes:
 *   POST /create-login        { email, password }  — needs phone support
 *   POST /create-register     { name, email, password, phone? }
 */

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  password: string;
}

export interface OtpSendPayload {
  phone: string;
}

export interface OtpVerifyPayload {
  phone: string;
  otp: string;
}

export interface ProfileUpdatePayload {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  conditions?: string[];
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

const mapAuthResponse = (data: AuthResponse): { user: User; tokens: AuthTokens } => ({
  user: data.user,
  tokens: {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    expiresAt: Date.now() + (data.expiresIn ?? 86400) * 1000,
  },
});

export const authApi = {
  login: async (payload: LoginPayload) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return mapAuthResponse(data);
  },

  register: async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return mapAuthResponse(data);
  },

  sendOtp: async (payload: OtpSendPayload) => {
    const { data } = await apiClient.post<{ message: string }>('/auth/send-otp', payload);
    return data;
  },

  verifyOtp: async (payload: OtpVerifyPayload) => {
    const { data } = await apiClient.post<AuthResponse>('/auth/verify-otp', payload);
    return mapAuthResponse(data);
  },

  updateProfile: async (payload: ProfileUpdatePayload) => {
    const { data } = await apiClient.patch<{ user: User }>('/users/profile', payload);
    return data.user;
  },
};
