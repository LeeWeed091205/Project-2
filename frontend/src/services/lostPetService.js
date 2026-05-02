import api from './api';

const lostPetService = {
  getAllLostPet: (pageNo = 0, pageSize = 10) => api.get('/lostpet', { pageNo, pageSize }),
  getLostPetDetailInfo: (id) => api.get(`/lostpet/${id}`),
  createLostPet: (data) => api.post('/lostpet', data),
  updateLostPet: (id, data) => api.put(`/lostpet/${id}`, data),
  deleteLostPet: (id) => api.delete(`/lostpet/${id}`),
};

export default lostPetService;