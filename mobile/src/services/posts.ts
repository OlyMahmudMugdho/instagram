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

  createPost: async (imageUris: string[], content?: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const formData = new FormData();
      if (content) formData.append('content', content);

      imageUris.forEach((uri, idx) => {
        const filename = uri.split('/').pop() || `photo_${idx}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';
        // @ts-ignore
        formData.append('image', { uri, name: filename, type });
      });

      const res = await fetch(`${API_BASE_URL}/api/posts/create`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  editPost: async (userId: string, postId: string, data: { content: string }) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const payload = { ...data, title: data.content };
      const res = await fetch(`${API_BASE_URL}/api/posts/${userId}/${postId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload),
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  deletePost: async (userId: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/posts/${userId}/${postId}`, {
        method: 'DELETE',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },
};

