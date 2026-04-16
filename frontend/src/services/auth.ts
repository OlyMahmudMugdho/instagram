import { ApiError, http } from '@/lib/api/http';
import { endpoints } from '@/lib/api/endpoints';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  name: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    _id: string;
    email: string;
    username: string;
    name: string;
    avatar?: string;
    followers?: number;
    following?: number;
  };
  token?: string;
  accessToken?: string;
  data?: Array<{ userID?: string }>;
  refreshToken?: string;
}

export const authService = {
  getAccessToken: async (): Promise<AuthResponse> => {
    try {
      const res = await http.get<AuthResponse>(endpoints.auth.token);
      if (res.success && res.accessToken) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', res.accessToken);
        }
        return res;
      }
      throw new Error(res.message || 'Failed to get access token');
    } catch (error) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
      }
      if (error instanceof ApiError && error.status === 403 && error.message === 'no refresh token') {
        return { success: false, message: 'Not authenticated' };
      }
      throw error;
    }
  },

  login: async (data: LoginRequest): Promise<AuthResponse> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    const res = await http.post<AuthResponse>(endpoints.auth.login, { body: data });
    if (res.success && res.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', res.accessToken);
      return res;
    }
    if (res.success) {
      return authService.getAccessToken();
    }
    return res;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>(endpoints.auth.register, { body: data });
    if (res.success && res.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', res.accessToken);
      return res;
    }
    if (res.success) {
      return authService.getAccessToken();
    }
    return res;
  },

  logout: async (): Promise<AuthResponse> => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
    return http.get<AuthResponse>(endpoints.auth.logout);
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    return http.post<AuthResponse>(endpoints.auth.forgotPassword, { body: { email } });
  },

  verifyCode: async (email: string, code: string): Promise<AuthResponse> => {
    return http.post<AuthResponse>(endpoints.auth.verifyCode, { body: { email, code } });
  },

  resetPassword: async (email: string, newPassword: string, recheck: string): Promise<AuthResponse> => {
    return http.post<AuthResponse>(endpoints.auth.resetPassword, { body: { email, newPassword, recheck } });
  },

  getToken: async (): Promise<AuthResponse> => {
    try {
      const tokenRes = await authService.getAccessToken();
      if (!tokenRes.success) {
        return { success: false, message: 'Not authenticated' };
      }
      
      // Then fetch the full user profile
      const res = await http.get<AuthResponse>(endpoints.users.me);
      if (res.success && res.user) {
        return res;
      }
      throw new Error(res.message || 'Not authenticated');
    } catch (error) {
      throw error;
    }
  },
};
