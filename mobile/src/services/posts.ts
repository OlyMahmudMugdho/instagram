import { authService } from './auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export const postsService = {
  getPosts: async (page = 1) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/posts/${page}`, {
        method: 'GET',
        headers,
        credentials: 'include',
      });

      const body = await res.json().catch(() => ({}));
      if (res.ok) return { success: true, ...body };
      return { success: false, message: body.message || 'Failed to fetch posts' };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },
};
