import api from './api';

const reviewService = {
  getReviewsByClinic: (clinicId, pageNo = 0, pageSize = 10) =>
    api.get('/review', { clinicId, pageNo, pageSize }),

  getReviewsByRatingAndClinic: (clinicId, rating, pageNo = 0, pageSize = 10) =>
    api.get('/review/rating', { clinicId, rating, pageNo, pageSize }),

  createReview: (clinicId, data) => api.post('/review', data, { params: { clinicId } }),

  updateReview: (reviewId, data) => api.put(`/review/${reviewId}`, data),

  deleteReview: (reviewId) => api.delete(`/review/${reviewId}`),
};

export default reviewService;