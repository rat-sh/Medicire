import axios from 'axios';
import { Config } from '@/constants/config';
import { storage } from '@/services/storage/mmkv';

const apiClient = axios.create({
  baseURL: Config.API_BASE_URL,
  timeout: Config.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor — Attach Auth Token ──────────────────────────────────
apiClient.interceptors.request.use(
  config => {
    const token = storage.getString('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error),
);

// ─── Response Interceptor — Handle 401 ───────────────────────────────────────
apiClient.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Clear tokens and let the app handle re-auth via Zustand auth store
      storage.remove('accessToken');
      storage.remove('refreshToken');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
