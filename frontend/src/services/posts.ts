import { http } from '@/lib/api/http';
import { endpoints } from '@/lib/api/endpoints';

export interface Post {
  _id: string;
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
  title: string;
  description?: string;
  image?: string;
}

export const postsService = {
  getFeed: async (page = 1, limit = 10): Promise<PostsResponse> => {
    return http.get<PostsResponse>(`${endpoints.feed}?page=${page}&limit=${limit}`);
  },

  getPost: async (id: string): Promise<PostResponse> => {
    return http.get<PostResponse>(endpoints.posts.get(id));
  },

  createPost: async (data: CreatePostRequest): Promise<PostResponse> => {
    return http.post<PostResponse>(endpoints.posts.create, { body: data });
  },

  editPost: async (id: string, data: Partial<CreatePostRequest>): Promise<PostResponse> => {
    return http.put<PostResponse>(endpoints.posts.edit(id), { body: data });
  },

  deletePost: async (id: string): Promise<PostResponse> => {
    return http.delete<PostResponse>(endpoints.posts.delete(id));
  },

  likePost: async (id: string): Promise<PostResponse> => {
    return http.post<PostResponse>(endpoints.posts.like(id));
  },

  unlikePost: async (id: string): Promise<PostResponse> => {
    return http.post<PostResponse>(endpoints.posts.unlike(id));
  },
};