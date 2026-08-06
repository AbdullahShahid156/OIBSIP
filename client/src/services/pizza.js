import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const pizzaService = {
  getAll: (params) => api.get(API_ENDPOINTS.PIZZAS.BASE, { params }),
  getById: (id) => api.get(API_ENDPOINTS.PIZZAS.BY_ID(id)),
  getCategories: () => api.get(API_ENDPOINTS.PIZZAS.CATEGORIES),
};

export default pizzaService;
