export const ROUTES = {
  HOME: '/',
  MENU: '/menu',
  PIZZA_DETAIL: '/pizza/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ORDER_SUCCESS: '/order/:id/success',
  ORDERS: '/orders',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile',
  ADMIN: {
    DASHBOARD: '/admin',
    PIZZAS: '/admin/pizzas',
    ORDERS: '/admin/orders',
    INVENTORY: '/admin/inventory',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    VERIFY_EMAIL: '/auth/verify-email',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  PIZZAS: {
    BASE: '/pizzas',
    BY_ID: (id) => `/pizzas/${id}`,
    CATEGORIES: '/pizzas/categories',
  },
  ORDERS: {
    BASE: '/orders',
    BY_ID: (id) => `/orders/${id}`,
    STATUS: (id) => `/orders/${id}/status`,
  },
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id) => `/inventory/${id}`,
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    SETTINGS: '/admin/settings',
  },
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};
