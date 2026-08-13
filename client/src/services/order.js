import api from './api';

export const orderAPI = {
  createOrder: async (addressId, notes) => {
    const response = await api.post('/orders/create', { addressId, notes });
    return response.data;
  },

  initiateJazzCash: async (addressId, notes) => {
    const response = await api.post('/orders/jazzcash/initiate', { addressId, notes });
    return response.data;
  },

  verifyPayment: async (paymentData) => {
    const response = await api.post('/orders/verify', paymentData);
    return response.data;
  },

  testPayment: async (orderIdOrPayload) => {
    const response = await api.post('/orders/test-pay', typeof orderIdOrPayload === 'string' ? { orderId: orderIdOrPayload } : orderIdOrPayload);
    return response.data;
  },

  getOrder: async (orderId) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.order;
  },

  getOrders: async (page = 1, limit = 10) => {
    const response = await api.get(`/orders?page=${page}&limit=${limit}`);
    return response.data;
  },
};
