import api from './api';

const clinicService = {
  getAllClinics: (pageNo = 0, pageSize = 10) => api.get('/clinic', { pageNo, pageSize }),
  getClinicById: (id) => api.get(`/clinic/${id}`),
  createClinic: (data) => api.post('/clinic', data),
  updateClinic: (id, data) => api.put(`/clinic/${id}`, data),
  deleteClinic: (id) => api.delete(`/clinic/${id}`),
};

export default clinicService;