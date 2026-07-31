import { authService } from './auth';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export const friendsService = {
  getSuggestions: async () => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/users`, { method: 'GET', headers });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  searchProfiles: async (query: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const q = encodeURIComponent(query || '');
      const res = await fetch(`${API_BASE_URL}/api/search?q=${q}`, { method: 'GET', headers });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.success && !body.empty && body.result) {
        const ids: string[] = body.result.userIDs || [];
        const usernames: string[] = body.result.usernames || [];
        const names: string[] = body.result.names || [];
        const items = ids.map((id, i) => ({ userID: id, username: usernames[i], name: names[i] }));
        return { success: true, data: items };
      }
      return { success: true, data: [] };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  sendRequest: async (receiver: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/friends/request`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ receiver }),
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  follow: async (followingID: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/follow/${followingID}`, {
        method: 'GET',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  unfollow: async (followingID: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/unfollow/${followingID}`, {
        method: 'GET',
        headers,
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  getRequests: async () => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/friends/requests`, { method: 'GET', headers });
      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },

  acceptRequest: async (sender: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(tokenRes && tokenRes.accessToken ? { 'Authorization': `Bearer ${tokenRes.accessToken}` } : {}),
      };

      const res = await fetch(`${API_BASE_URL}/api/friends/accept`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ sender }),
      });

      const body = await res.json().catch(() => ({}));
      return { success: res.ok, ...body };
    } catch (err) {
      return { success: false, message: String(err) };
    }
  },
};
