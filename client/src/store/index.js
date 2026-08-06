import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import pizzaReducer from './slices/pizzaSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    pizza: pizzaReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
