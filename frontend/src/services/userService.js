import api from './api';

const userService = {
  getAllUserInfo:()=> api.get(`user/all`),
  getUserProfile: (id) => api.get(`/user/${id}`),
  getMyInfoDetail: () => api.get('user/my-info'),
  updateUserProfile: (data) => api.put(`/user`, data),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append('files', file);
    return api.post('/files/upload-files', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default userService;