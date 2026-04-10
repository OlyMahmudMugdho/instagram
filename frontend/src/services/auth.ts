import { http } from '@/lib/api/http';
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
  };
  token?: string;
  data?: Array<{ userID?: string }>;
  refreshToken?: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await http.post<AuthResponse>(endpoints.auth.login, { body: data });
    if (res.success && res.data && res.data[0]) {
      const userID = res.data[0].userID;
      return {
        success: true,
        message: res.message,
        user: {
          _id: userID || '',
          email: '',
          username: data.username || '',
          name: '',
        },
        token: res.refreshToken,
      };
    }
    return res;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return http.post<AuthResponse>(endpoints.auth.register, { body: data });
  },

  logout: async (): Promise<AuthResponse> => {
    return http.post<AuthResponse>(endpoints.auth.logout);
  },

  getToken: async (): Promise<AuthResponse> => {
    try {
      const res = await http.get<AuthResponse>('/users/me');
      if (res.success && res.user) {
        return res;
      }
      throw new Error(res.message || 'Not authenticated');
    } catch (error) {
      throw error;
    }
  },
};