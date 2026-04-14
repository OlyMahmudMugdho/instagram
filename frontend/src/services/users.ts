import { http } from '@/lib/api/http';

export interface User {
  _id: string;
  username: string;
  name: string;
  userID: string;
  profilePicture?: string;
}

export const usersService = {
  follow: async (userID: string): Promise<{ success: boolean; message?: string }> => {
    return http.post(`/friends/request`, { body: { receiver: userID } });
  },
  
  searchUsers: async (query: string): Promise<{ success: boolean; result?: { names: string[], usernames: string[], userIDs: string[] } }> => {
    return http.get(`/search?q=${query}`);
  },
  
  getSuggestions: async (): Promise<{ success: boolean; suggested: User[] }> => {
    return http.get('/suggestions/suggestions');
  }
};
