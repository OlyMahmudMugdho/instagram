export const endpoints = {
  auth: {
    login: '/login',
    register: '/register',
    logout: '/logOut',
    token: '/token',
  },
  posts: {
    list: '/posts',
    create: '/posts/create',
    get: (id: string) => `/posts/get/${id}`,
    edit: (id: string) => `/posts/edit/${id}`,
    delete: (id: string) => `/posts/delete/${id}`,
    like: (id: string) => `/likes/like/${id}`,
    unlike: (id: string) => `/likes/unlike/${id}`,
  },
  comments: {
    list: (postId: string) => `/comment/all/${postId}`,
    create: '/comment/create',
    edit: (id: string) => `/comment/edit/${id}`,
    delete: (id: string) => `/comment/delete/${id}`,
  },
  users: {
    profile: (userId: string) => `/users/${userId}`,
    me: '/users/me',
    edit: '/users/profile/edit',
    profilePicture: '/users/profilePicture',
    follow: (userId: string) => `/follow/${userId}`,
    unfollow: (userId: string) => `/unfollow/${userId}`,
    followers: (userId: string) => `/followers/${userId}`,
    following: (userId: string) => `/following/${userId}`,
  },
  search: {
    users: '/search/users',
    posts: '/search/posts',
  },
  feed: '/feed',
};