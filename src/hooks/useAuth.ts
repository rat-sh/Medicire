import { useMutation } from '@tanstack/react-query';
import { Config } from '@/constants/config';
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
  type OtpSendPayload,
  type OtpVerifyPayload,
  type ProfileUpdatePayload,
} from '@/services/api/auth';
import { useAuthStore } from '@/store/authStore';
import type { User, AuthTokens } from '@/types/user';

const devCompleteAuth = (
  user: Pick<User, 'name' | 'phone'> & Partial<User>,
): { user: User; tokens: AuthTokens } => ({
  user: {
    id: `dev-${Date.now()}`,
    name: user.name,
    phone: user.phone,
    conditions: user.conditions ?? [],
    savedAddresses: user.savedAddresses ?? [],
    createdAt: new Date().toISOString(),
    age: user.age,
    gender: user.gender,
    email: user.email,
  },
  tokens: {
    accessToken: `dev-token-${Date.now()}`,
    refreshToken: `dev-refresh-${Date.now()}`,
    expiresAt: Date.now() + 86400 * 1000,
  },
});

export const useLogin = () => {
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      try {
        return await authApi.login(payload);
      } catch (error) {
        if (Config.USE_MOCK) {
          return devCompleteAuth({ name: 'User', phone: payload.phone });
        }
        throw error;
      }
    },
    onSuccess: ({ user, tokens }) => setUser(user, tokens),
  });
};

export const useRegister = () => {
  const setPendingSession = useAuthStore(s => s.setPendingSession);

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      try {
        return await authApi.register(payload);
      } catch (error) {
        if (Config.USE_MOCK) {
          return devCompleteAuth({ name: payload.name, phone: payload.phone });
        }
        throw error;
      }
    },
    onSuccess: ({ user, tokens }) => setPendingSession(user, tokens),
  });
};

export const useSendOtp = () =>
  useMutation({
    mutationFn: async (payload: OtpSendPayload) => {
      try {
        return await authApi.sendOtp(payload);
      } catch (error) {
        if (Config.USE_MOCK) {
          return { message: 'OTP sent (dev mode)' };
        }
        throw error;
      }
    },
  });

export const useVerifyOtp = () => {
  const setPendingSession = useAuthStore(s => s.setPendingSession);
  const setUser = useAuthStore(s => s.setUser);

  return useMutation({
    mutationFn: async (
      payload: OtpVerifyPayload & { name?: string; mode?: 'login' | 'signup' },
    ) => {
      try {
        return await authApi.verifyOtp(payload);
      } catch (error) {
        if (Config.USE_MOCK) {
          return devCompleteAuth({
            name: payload.name ?? 'User',
            phone: payload.phone,
          });
        }
        throw error;
      }
    },
    onSuccess: (result, variables) => {
      if (variables.mode === 'login') {
        setUser(result.user, result.tokens);
      } else {
        setPendingSession(result.user, result.tokens);
      }
    },
  });
};

export const useUpdateProfile = () => {
  const updateUser = useAuthStore(s => s.updateUser);
  const commitPendingSession = useAuthStore(s => s.commitPendingSession);
  const user = useAuthStore(s => s.user);
  const pendingSession = useAuthStore(s => s.pendingSession);

  return useMutation({
    mutationFn: async (payload: ProfileUpdatePayload) => {
      const baseUser = user ?? pendingSession?.user;
      if (!baseUser) throw new Error('No user session');

      try {
        return await authApi.updateProfile(payload);
      } catch (error) {
        if (Config.USE_MOCK) {
          return {
            ...baseUser,
            age: payload.age ?? baseUser.age,
            gender: payload.gender ?? baseUser.gender,
            conditions: payload.conditions ?? baseUser.conditions,
          };
        }
        throw error;
      }
    },
    onSuccess: updatedUser => {
      if (pendingSession) {
        useAuthStore.setState({
          pendingSession: { ...pendingSession, user: updatedUser },
        });
        commitPendingSession();
      } else {
        updateUser(updatedUser);
      }
    },
  });
};

export const useCompleteOnboarding = () => {
  const commitPendingSession = useAuthStore(s => s.commitPendingSession);
  const pendingSession = useAuthStore(s => s.pendingSession);

  return () => {
    if (pendingSession) {
      commitPendingSession();
    }
  };
};
