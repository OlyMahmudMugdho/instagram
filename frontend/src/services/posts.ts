import { http } from '@/lib/api/http';
import { endpoints } from '@/lib/api/endpoints';

export interface Post {
  _id: string;
  postId: string;
  userId: string;
  username: string;
  avatar?: string;
  image?: string;
  title: string;
  description?: string;
  likes: number;
  comments: number;
  createdAt: string;
  isLiked?: boolean;
}

export interface PostsResponse {
  success: boolean;
  posts?: Post[];
  message?: string;
}

export interface PostResponse {
  success: boolean;
  post?: Post;
  message?: string;
}

export interface CreatePostRequest {
  content: string;
  image?: string;
}

export const postsService = {
  getFeed: async (page = 1, limit = 10): Promise<PostsResponse> => {
    return http.get<PostsResponse>(`${endpoints.feed}?page=${page}&limit=${limit}`);
  },

  getUserPosts: async (userID?: string): Promise<PostsResponse> => {
    return http.get<PostsResponse>(`${endpoints.posts.list}/myposts${userID ? `?userID=${userID}` : ''}`);
  },

  getPost: async (id: string): Promise<PostResponse> => {
    return http.get<PostResponse>(endpoints.posts.get(id));
  },

  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    return http.post<PostResponse>(endpoints.posts.create, { body: data });
  },

  editPost: async (userId: string, postId: string, data: { content: string }): Promise<PostResponse> => {
    return http.put<PostResponse>(endpoints.posts.edit(userId, postId), { body: data });
  },

  deletePost: async (userId: string, postId: string): Promise<PostResponse> => {
    return http.delete<PostResponse>(endpoints.posts.delete(userId, postId));
  },

  likePost: async (userId: string, postId: string): Promise<PostResponse> => {
    return http.get<PostResponse>(endpoints.posts.like(userId, postId));
  },

  unlikePost: async (userId: string, postId: string): Promise<PostResponse> => {
    return http.get<PostResponse>(endpoints.posts.unlike(userId, postId));
  },
};

export interface Comment {
  _id: string;
  commentID: string;
  commentor: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface CommentsResponse {
  success: boolean;
  comments?: Comment[];
  message?: string;
}

export const commentsService = {
  getComments: async (userId: string, postId: string): Promise<CommentsResponse> => {
    try {
      const res = await http.get<{ success: boolean; data: any[] }>(endpoints.comments.list(userId, postId));
      if (res.success && Array.isArray(res.data)) {
          return {
              success: true,
              comments: res.data.map((c: any) => ({
                  _id: c._id,
                  commentID: c.commentID,
                  commentor: c.commentor,
                  username: 'User', // Backend doesn't return username in comment
                  text: c.comment,
                  createdAt: c.date
              }))
          };
      }
      return { success: false, message: 'Failed to load comments' };
    } catch (e) {
      return { success: false, message: 'Error loading comments' };
    }
  },

  addComment: async (userId: string, postId: string, comment: string): Promise<{ success: boolean; message?: string }> => {
    return http.post(endpoints.comments.create(userId, postId), { body: { comment } });
  },
};