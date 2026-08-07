import api from './api';

export const cartAPI = {
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data.cart;
  },

  addItem: async (item) => {
    const response = await api.post('/cart/items', item);
    return response.data.cart;
  },

  updateItem: async (itemId, qty) => {
    const response = await api.patch(`/cart/items/${itemId}`, { qty });
    return response.data.cart;
  },

  removeItem: async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data.cart;
  },

  clearCart: async () => {
    const response = await api.delete('/cart/clear');
    return response.data.cart;
  },

  applyCoupon: async (code) => {
    const response = await api.post('/cart/coupon/apply', { code });
    return response.data.cart;
  },

  removeCoupon: async () => {
    const response = await api.delete('/cart/coupon/remove');
    return response.data.cart;
  },

  validateCheckout: async (addressId) => {
    const response = await api.post('/cart/validate-checkout', { addressId });
    return response.data;
  },
};
