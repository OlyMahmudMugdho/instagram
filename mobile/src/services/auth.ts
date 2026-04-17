import { storage } from '../lib/storage';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: any;
  accessToken?: string;
  refreshToken?: string;
}

async function save(key: string, value: string) {
  try {
    await storage.setItem(key, value);
  } catch (e) {
    console.warn('Storage save error', e);
  }
}

async function remove(key: string) {
  try {
    await storage.deleteItem(key);
  } catch (e) {
    console.warn('Storage delete error', e);
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // Clear previous token
    await remove('accessToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: (body && body.message) || 'Login failed' };
      }

      if (body.accessToken) await save('accessToken', body.accessToken);
      if (body.refreshToken) await save('refreshToken', body.refreshToken);

      return { success: true, message: body.message || 'Logged in', user: body.user, accessToken: body.accessToken, refreshToken: body.refreshToken };
    } catch (err) {
      throw err;
    }
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    await remove('accessToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));

      if (!res.ok) {
        return { success: false, message: (body && body.message) || 'Registration failed' };
      }

      if (body.accessToken) await save('accessToken', body.accessToken);
      if (body.refreshToken) await save('refreshToken', body.refreshToken);

      return { success: true, message: body.message || 'Registered', user: body.user, accessToken: body.accessToken, refreshToken: body.refreshToken };
    } catch (err) {
      throw err;
    }
  },

  getAccessToken: async (): Promise<AuthResponse> => {
    try {
      // Try to include refresh token stored in storage as Authorization header
      const refreshToken = await storage.getItem('refreshToken');
      const headers: Record<string, string> = {};
      if (refreshToken) headers['Authorization'] = `Bearer ${refreshToken}`;

      const res = await fetch(`${API_BASE_URL}/api/token`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        if (body.accessToken) await save('accessToken', body.accessToken);
        return body;
      }
      return { success: false, message: body.message || 'Failed to get token' };
    } catch (err) {
      throw err;
    }
  },
// ... (rest of the file remains same, but using save/remove functions)

  getToken: async (): Promise<AuthResponse> => {
    try {
      const tokenRes = await authService.getAccessToken();
      if (!tokenRes.success) return { success: false, message: 'Not authenticated' };

      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenRes.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}),
        },
        credentials: 'include',
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok && body.user) return body;
      return { success: false, message: body.message || 'Not authenticated' };
    } catch (err) {
      throw err;
    }
  },

  logout: async (): Promise<AuthResponse> => {
    await remove('accessToken');
    await remove('refreshToken');
    try {
      const res = await fetch(`${API_BASE_URL}/api/logout`, {
        method: 'GET',
        credentials: 'include',
      });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, message: body.message || '' } as AuthResponse;
    } catch (err) {
      throw err;
    }
  },

  forgotPassword: async (email: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset/password/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email }),
      });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, message: body.message || '' };
    } catch (err) {
      throw err;
    }
  },

  verifyResetCode: async (email: string, code: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset/password/final`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, code }),
      });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, message: body.message || '' };
    } catch (err) {
      throw err;
    }
  },

  resetPassword: async (email: string, newPassword: string, recheck: string): Promise<AuthResponse> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reset/password/change`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, newPassword, recheck }),
      });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, message: body.message || '' };
    } catch (err) {
      throw err;
    }
  },
};
