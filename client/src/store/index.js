import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import pizzaReducer from './slices/pizzaSlice';
import builderReducer from './slices/builderSlice';
import profileReducer from './slices/profileSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    pizza: pizzaReducer,
    builder: builderReducer,
    profile: profileReducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
