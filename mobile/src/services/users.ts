import { authService } from './auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export const usersService = {
  getProfile: async (userID: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/users/${userID}`, {
        method: 'GET',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },
};
