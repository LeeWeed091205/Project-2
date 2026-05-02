import api from './api';

const commentService = {
  getCommentsByPost: (postId,pageNo = 0, pageSize = 10) => api.get(`/comment`, { postId, pageNo, pageSize }),
  createComment: (data, postId) => api.post(`/comment`, data, { params: { postId } }),
  updateComment: (id, data) => api.put(`/comment/${id}`, data),
  deleteComment: (id) => api.delete(`/comment/${id}`),
};

export default commentService;