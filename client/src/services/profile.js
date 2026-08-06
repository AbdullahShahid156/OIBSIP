import api from './api';

const profile = {
  getProfile: () => api.get('/profile/me'),
  updateProfile: (data) => api.patch('/profile/me', data),
  uploadAvatar: (formData) =>
    api.post('/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000,
    }),
  removeAvatar: () => api.delete('/profile/avatar'),
  changePassword: (data) => api.patch('/profile/change-password', data),
};

export default profile;
