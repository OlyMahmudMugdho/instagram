import { authService } from './auth';
import { usersService } from './users';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://10.0.2.2:5000';

export const interactionService = {
  likePost: async (userID: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      console.log(`Liking post: ${userID}/${postId}`);
      const res = await fetch(`${API_BASE_URL}/api/like/${userID}/${postId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}),
        },
      });
      const body = await res.json().catch(() => ({}));
      console.log('Like result:', res.status, body);
      return res.ok;
    } catch (e) {
      console.error('Like error:', e);
      return false;
    }
  },

  isLiked: async (userID: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/api/isliked/${userID}/${postId}`, {
        headers: { ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}) },
      });
      const body = await res.json().catch(() => ({}));
      return !!body.liked;
    } catch {
      return false;
    }
  },

  unlikePost: async (userID: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/api/unlike/${userID}/${postId}`, {
        method: 'GET',
        headers: { ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}) },
      });
      const body = await res.json().catch(() => ({}));
      console.log('Unlike result:', res.status, body);
      return res.ok;
    } catch (e) {
      console.error('unlike error', e);
      return false;
    }
  },

  addComment: async (userID: string, postId: string, comment: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/api/comment/${userID}/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}),
        },
        body: JSON.stringify({ comment }),
      });
      const body = await res.json().catch(() => ({}));
      console.log('Add comment result:', res.status, body);
      return res.ok;
    } catch (e) {
      console.error('addComment error', e);
      return false;
    }
  },

  getComments: async (userID: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const headers: Record<string, string> = {
        ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {})
      };

      const res = await fetch(`${API_BASE_URL}/api/comment/${userID}/${postId}`, {
        headers,
      });
      const body = await res.json().catch(() => ({}));
      if (!Array.isArray(body.data)) return [];

      const comments = body.data.map((comment: any) => {
        let pp = comment.profilePicture || null;
        if (pp && typeof pp === 'string' && !pp.startsWith('http')) {
          const base = API_BASE_URL.replace(/\/$/, '');
          pp = (pp.startsWith('/') ? base + pp : base + '/' + pp);
        }
        return {
          _id: comment._id,
          commentID: comment.commentID,
          username: comment.username || 'Unknown',
          profilePicture: pp,
          text: comment.text || comment.comment || '',
          createdAt: comment.createdAt || comment.date,
        };
      });

      // Try to resolve missing profile pictures by searching user and fetching profile
      await Promise.all(comments.map(async (c: any) => {
        if (c.profilePicture) return;
        if (!c.username) return;
        try {
          const searchRes = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(c.username)}`, { headers });
          const searchBody = await searchRes.json().catch(() => ({}));
          const userID = searchBody?.result?.userIDs?.[0] || null;
          if (!userID) return;
          const profile = await usersService.getProfile(userID);
          const foundUser = profile?.message?.foundUser;
          const pic = foundUser?.profilePicture || null;
          if (pic && typeof pic === 'string') {
            c.profilePicture = pic.startsWith('http') ? pic : API_BASE_URL.replace(/\/$/, '') + (pic.startsWith('/') ? '' : '/') + pic;
          }
        } catch (e) {
          // ignore
        }
      }));

      return comments;
    } catch (e) {
      console.error('getComments error', e);
      return [];
    }
  },
};
