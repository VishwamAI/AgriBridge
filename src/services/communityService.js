import api from './api';

const communityService = {
  getPosts: async () => {
    try {
      const response = await api.get('/community/posts');
      return response.data;
    } catch (error) {
      console.error('Error fetching community posts:', error);
      throw error;
    }
  },

  createPost: async (postData) => {
    try {
      const response = await api.post('/community/posts', postData);
      return response.data;
    } catch (error) {
      console.error('Error creating community post:', error);
      throw error;
    }
  },

  likePost: async (postId) => {
    try {
      const response = await api.post(`/community/posts/${postId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  },

  commentOnPost: async (postId, commentData) => {
    try {
      const response = await api.post(`/community/posts/${postId}/comments`, commentData);
      return response.data;
    } catch (error) {
      console.error('Error commenting on post:', error);
      throw error;
    }
  },

  getPostComments: async (postId) => {
    try {
      const response = await api.get(`/community/posts/${postId}/comments`);
      return response.data;
    } catch (error) {
      console.error('Error fetching post comments:', error);
      throw error;
    }
  }
};

export default communityService;
