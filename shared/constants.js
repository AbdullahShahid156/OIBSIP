export const API_VERSION = 'v1';

export const PIZZA_SIZES = ['small', 'medium', 'large', 'extra_large'];

export const CRUST_TYPES = [
  'thin',
  'regular',
  'thick',
  'stuffed',
  'gluten_free',
];

export const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
];

export const PAYMENT_STATUSES = [
  'pending',
  'completed',
  'failed',
  'refunded',
];

export const USER_ROLES = ['customer', 'admin'];

export const PAGINATION_DEFAULTS = {
  page: 1,
  limit: 10,
  maxLimit: 50,
};
