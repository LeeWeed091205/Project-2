import api from './api';

const postService = {
  getAllPost: (pageNo = 0, pageSize = 10) => api.get('/post', { pageNo, pageSize }),
  getMyPost: (pageNo = 0, pageSize = 10) => api.get('/post/my', { pageNo, pageSize }),
  getPostByUser: (userId, pageNo = 0, pageSize = 10) => api.get(`/post/user/${userId}`, { pageNo, pageSize }),
  getPostById: (id) => api.get(`/post/${id}`),
  createPost: (data) => api.post('/post', data),
  updatePost: (id, data) => api.put(`/post/${id}`, data),
  deletePost: (id) => api.delete(`/post/${id}`),
};

export default postService;