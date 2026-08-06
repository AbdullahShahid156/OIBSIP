import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import pizzaReducer from './slices/pizzaSlice';
import builderReducer from './slices/builderSlice';
import profileReducer from './slices/profileSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    pizza: pizzaReducer,
    builder: builderReducer,
    profile: profileReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
