import api from './api';

const address = {
  getAddresses: () => api.get('/profile/addresses'),
  createAddress: (data) => api.post('/profile/addresses', data),
  updateAddress: (id, data) => api.patch(`/profile/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/profile/addresses/${id}`),
  setDefaultAddress: (id) => api.patch(`/profile/addresses/${id}/default`),
};

export default address;
