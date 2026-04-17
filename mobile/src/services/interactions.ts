import { authService } from './auth';

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
      await fetch(`${API_BASE_URL}/api/unlike/${userID}/${postId}`, {
        headers: { ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}) },
      });
      return true;
    } catch {
      return false;
    }
  },

  getComments: async (userID: string, postId: string) => {
    try {
      const tokenRes = await authService.getAccessToken();
      const res = await fetch(`${API_BASE_URL}/api/comment/${userID}/${postId}`, {
        headers: { ...(tokenRes?.accessToken ? { Authorization: `Bearer ${tokenRes.accessToken}` } : {}) },
      });
      const body = await res.json().catch(() => ({}));
      if (!Array.isArray(body.data)) return [];

      return body.data.map((comment: any) => ({
        _id: comment._id,
        commentID: comment.commentID,
        username: comment.username || 'Unknown',
        text: comment.text || comment.comment || '',
        createdAt: comment.createdAt || comment.date,
      }));
    } catch {
      return [];
    }
  },
};
