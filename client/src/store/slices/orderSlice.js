import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderAPI } from '../../services/order';

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async ({ addressId, notes }, { rejectWithValue }) => {
    try {
      return await orderAPI.createOrder(addressId, notes);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to create order');
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async (paymentData, { rejectWithValue }) => {
    try {
      return await orderAPI.verifyPayment(paymentData);
    } catch (error) {
      return rejectWithValue(error.message || 'Payment verification failed');
    }
  }
);

export const getOrder = createAsyncThunk(
  'orders/getOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      return await orderAPI.getOrder(orderId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch order');
    }
  }
);

export const getOrders = createAsyncThunk(
  'orders/getOrders',
  async ({ page, limit } = {}, { rejectWithValue }) => {
    try {
      return await orderAPI.getOrders(page, limit);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch orders');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    currentOrder: null,
    razorpayOrderData: null,
    orders: [],
    pagination: null,
    isLoading: false,
    isVerifying: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.razorpayOrderData = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.razorpayOrderData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.isVerifying = true;
        state.error = null;
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.isVerifying = false;
        state.currentOrder = action.payload.order;
        state.razorpayOrderData = null;
        state.successMessage = 'Payment verified successfully!';
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.isVerifying = false;
        state.error = action.payload;
      })
      .addCase(getOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
