import { authService } from './auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export const postsService = {
  getPosts: async (page = 1) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/posts/${page}`, {
        method: 'GET',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      console.log('Posts fetch status:', res.status, 'body:', body);
      if (res.ok) return { success: true, ...body };
      if (res.status === 404 && body.end) return { success: true, data: [], pages: 0 };
      return { success: false, message: body.message || 'Failed to fetch posts' };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  getFeed: async () => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/feed`, {
        method: 'GET',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  getUserPosts: async (userID: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/posts/myposts?userID=${userID}`, {
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

