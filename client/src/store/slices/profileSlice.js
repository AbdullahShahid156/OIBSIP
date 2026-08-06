import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import profileService from '../../services/profile';
import addressService from '../../services/address';

export const getProfile = createAsyncThunk(
  'profile/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await profileService.getProfile();
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const res = await profileService.updateProfile(data);
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  'profile/uploadAvatar',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await profileService.uploadAvatar(formData);
      return res.data.avatar;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeAvatar = createAsyncThunk(
  'profile/removeAvatar',
  async (_, { rejectWithValue }) => {
    try {
      await profileService.removeAvatar();
      return '';
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'profile/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const res = await profileService.changePassword(data);
      return res.data.accessToken;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getAddresses = createAsyncThunk(
  'profile/getAddresses',
  async (_, { rejectWithValue }) => {
    try {
      const res = await addressService.getAddresses();
      return res.data.addresses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createAddress = createAsyncThunk(
  'profile/createAddress',
  async (data, { rejectWithValue }) => {
    try {
      const res = await addressService.createAddress(data);
      return res.data.address;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateAddress = createAsyncThunk(
  'profile/updateAddress',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await addressService.updateAddress(id, data);
      return res.data.address;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'profile/deleteAddress',
  async (id, { rejectWithValue }) => {
    try {
      const res = await addressService.deleteAddress(id);
      return res.data.addresses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const setDefaultAddress = createAsyncThunk(
  'profile/setDefaultAddress',
  async (id, { rejectWithValue }) => {
    try {
      const res = await addressService.setDefaultAddress(id);
      return res.data.addresses;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    user: null,
    addresses: [],
    isLoading: false,
    isSaving: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearProfileError: (state) => { state.error = null; },
    clearProfileSuccess: (state) => { state.successMessage = null; },
    resetProfile: (state) => {
      state.user = null;
      state.addresses = [];
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (s) => { s.isLoading = true; s.error = null; })
      .addCase(getProfile.fulfilled, (s, a) => {
        s.isLoading = false;
        s.user = a.payload;
        s.addresses = a.payload?.addresses || [];
      })
      .addCase(getProfile.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(updateProfile.pending, (s) => { s.isSaving = true; s.error = null; s.successMessage = null; })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.isSaving = false;
        s.user = a.payload;
        s.successMessage = 'Profile updated successfully';
      })
      .addCase(updateProfile.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(uploadAvatar.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(uploadAvatar.fulfilled, (s, a) => {
        s.isSaving = false;
        if (s.user) s.user.avatar = a.payload;
        s.successMessage = 'Avatar updated successfully';
      })
      .addCase(uploadAvatar.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(removeAvatar.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(removeAvatar.fulfilled, (s) => {
        s.isSaving = false;
        if (s.user) s.user.avatar = '';
        s.successMessage = 'Avatar removed';
      })
      .addCase(removeAvatar.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(changePassword.pending, (s) => { s.isSaving = true; s.error = null; s.successMessage = null; })
      .addCase(changePassword.fulfilled, (s, a) => {
        s.isSaving = false;
        s.successMessage = 'Password changed successfully';
        if (a.payload) localStorage.setItem('token', a.payload);
      })
      .addCase(changePassword.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(getAddresses.pending, (s) => { s.isLoading = true; })
      .addCase(getAddresses.fulfilled, (s, a) => { s.isLoading = false; s.addresses = a.payload; })
      .addCase(getAddresses.rejected, (s, a) => { s.isLoading = false; s.error = a.payload; })

      .addCase(createAddress.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(createAddress.fulfilled, (s, a) => {
        s.isSaving = false;
        s.addresses.push(a.payload);
        s.successMessage = 'Address added successfully';
      })
      .addCase(createAddress.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(updateAddress.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(updateAddress.fulfilled, (s, a) => {
        s.isSaving = false;
        const idx = s.addresses.findIndex((addr) => addr._id === a.payload._id);
        if (idx !== -1) s.addresses[idx] = a.payload;
        s.successMessage = 'Address updated successfully';
      })
      .addCase(updateAddress.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(deleteAddress.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(deleteAddress.fulfilled, (s, a) => {
        s.isSaving = false;
        s.addresses = a.payload;
        s.successMessage = 'Address deleted successfully';
      })
      .addCase(deleteAddress.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; })

      .addCase(setDefaultAddress.pending, (s) => { s.isSaving = true; s.error = null; })
      .addCase(setDefaultAddress.fulfilled, (s, a) => {
        s.isSaving = false;
        s.addresses = a.payload;
        s.successMessage = 'Default address updated';
      })
      .addCase(setDefaultAddress.rejected, (s, a) => { s.isSaving = false; s.error = a.payload; });
  },
});

export const { clearProfileError, clearProfileSuccess, resetProfile } = profileSlice.actions;
export default profileSlice.reducer;
