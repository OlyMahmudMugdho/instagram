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

  updateProfile: async (data: { name?: string; email?: string }) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/users/profile/edit`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data),
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  uploadProfilePicture: async (fileUri: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const formData = new FormData();
      const filename = fileUri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';
      // @ts-ignore - React Native FormData file
      formData.append('image', { uri: fileUri, name: filename, type });

      const res = await fetch(`${API_BASE_URL}/api/users/profile/picture`, {
        method: 'PUT',
        headers,
        body: formData,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },
};
