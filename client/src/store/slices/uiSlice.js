import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isDarkMode: false,
  isSidebarOpen: false,
  isMobileMenuOpen: false,
  isLoading: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      document.documentElement.classList.toggle('dark', state.isDarkMode);
    },
    setDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
      document.documentElement.classList.toggle('dark', state.isDarkMode);
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.isMobileMenuOpen = !state.isMobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.isMobileMenuOpen = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  toggleMobileMenu,
  setMobileMenuOpen,
  setLoading,
} = uiSlice.actions;

export default uiSlice.reducer;
