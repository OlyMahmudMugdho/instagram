import { http } from '@/lib/api/http';
import { endpoints } from '@/lib/api/endpoints';

export interface User {
  _id: string;
  username: string;
  name: string;
  userID: string;
  profilePicture?: string;
  followers?: number;
  following?: number;
  isFollowing?: boolean;
  isFriend?: boolean;
}

export const usersService = {
  getProfile: async (userID: string): Promise<{ success: boolean; message?: { foundUser: User } }> => {
    return http.get(endpoints.users.profile(userID));
  },

  follow: async (userID: string): Promise<{ success: boolean; message?: string }> => {
    return http.get(endpoints.users.follow(userID));
  },
  
  unfollow: async (userID: string): Promise<{ success: boolean; message?: string }> => {
    return http.get(endpoints.users.unfollow(userID));
  },
  
  searchUsers: async (query: string): Promise<{ success: boolean; result?: { names: string[], usernames: string[], userIDs: string[] } }> => {
    return http.get(`${endpoints.search.users}?q=${encodeURIComponent(query)}`);
  },
  
  getSuggestions: async (): Promise<{ success: boolean; suggested: User[] }> => {
    return http.get(endpoints.suggestions);
  }
};
