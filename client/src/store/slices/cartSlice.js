import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../services/cart';

const DELIVERY_FEE_FREE_THRESHOLD = 35;
const DELIVERY_FEE = 4.99;
const TAX_RATE = 0.08;

const DEFAULT_SUMMARY = {
  subtotal: 0,
  deliveryFee: 0,
  tax: 0,
  couponDiscount: 0,
  total: 0,
  maxPrepTime: 0,
};

function calculateSummary(items, couponDiscount = 0) {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return { ...DEFAULT_SUMMARY, couponDiscount: couponDiscount || 0 };
    }
    const subtotal = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0);
    const deliveryFee = subtotal > 0 ? (subtotal >= DELIVERY_FEE_FREE_THRESHOLD ? 0 : DELIVERY_FEE) : 0;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + deliveryFee + tax - (couponDiscount || 0);
    const prepTimes = items.map((i) => Number(i.prepTime)).filter((t) => !isNaN(t) && t > 0);
    return {
      subtotal: Math.round(subtotal * 100) / 100,
      deliveryFee,
      tax: Math.round(tax * 100) / 100,
      couponDiscount: couponDiscount || 0,
      total: Math.round(total * 100) / 100,
      maxPrepTime: prepTimes.length > 0 ? Math.max(...prepTimes) : 0,
    };
  } catch {
    return { ...DEFAULT_SUMMARY, couponDiscount: couponDiscount || 0 };
  }
}

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem('pizzaCart');
    if (!stored) return { items: [], couponCode: '', couponDiscount: 0 };
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return { items: [], couponCode: '', couponDiscount: 0 };
    return {
      items: Array.isArray(parsed.items) ? parsed.items : [],
      couponCode: typeof parsed.couponCode === 'string' ? parsed.couponCode : '',
      couponDiscount: typeof parsed.couponDiscount === 'number' ? parsed.couponDiscount : 0,
    };
  } catch {
    try { localStorage.removeItem('pizzaCart'); } catch { /* ignore */ }
    return { items: [], couponCode: '', couponDiscount: 0 };
  }
}

function saveCartToStorage(data) {
  try {
    localStorage.setItem('pizzaCart', JSON.stringify(data));
  } catch { /* ignore */ }
}

const initialStored = loadCartFromStorage();

const initialState = {
  items: initialStored.items || [],
  couponCode: initialStored.couponCode || '',
  couponDiscount: initialStored.couponDiscount || 0,
  summary: calculateSummary(initialStored.items || [], initialStored.couponDiscount || 0),
  isLoading: false,
  error: null,
  isDrawerOpen: false,
};

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.getCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (item, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.addItem(item);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateItem',
  async ({ itemId, qty }, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.updateItem(itemId, qty);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (itemId, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.removeItem(itemId);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCartAsync = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.clearCart();
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const applyCouponCode = createAsyncThunk(
  'cart/applyCoupon',
  async (code, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.applyCoupon(code);
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeCouponCode = createAsyncThunk(
  'cart/removeCoupon',
  async (_, { rejectWithValue }) => {
    try {
      const cart = await cartAPI.removeCoupon();
      return cart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const syncCartToServer = createAsyncThunk(
  'cart/syncToServer',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { cart } = getState();
      if (!cart.items || cart.items.length === 0) {
        const serverCart = await cartAPI.getCart();
        return serverCart;
      }
      try {
        await cartAPI.clearCart();
      } catch {
        // Cart may not exist yet in MongoDB — that's fine
      }
      for (const item of cart.items) {
        await cartAPI.addItem({
          pizzaId: item.pizzaId,
          name: item.name,
          image: item.image || '',
          size: item.size,
          base: item.base,
          baseName: item.baseName || '',
          sauce: item.sauce,
          sauceName: item.sauceName || '',
          cheese: item.cheese,
          cheeseName: item.cheeseName || '',
          veggies: item.veggies || {},
          veggieNames: item.veggieNames || {},
          qty: item.qty,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          prepTime: item.prepTime || 10,
          isCustomized: item.isCustomized || false,
          configurationId: item.configurationId,
        });
      }
      if (cart.couponCode) {
        try {
          await cartAPI.applyCoupon(cart.couponCode);
        } catch {
          // Coupon may not be valid server-side — ignore
        }
      }
      const serverCart = await cartAPI.getCart();
      return serverCart;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

function applyServerCart(state, cartData) {
  state.items = cartData.items || [];
  state.couponCode = cartData.couponCode || '';
  state.couponDiscount = cartData.couponDiscount || 0;
  state.summary = {
    subtotal: cartData.subtotal,
    deliveryFee: cartData.deliveryFee,
    tax: cartData.tax,
    couponDiscount: cartData.couponDiscount,
    total: cartData.total,
    maxPrepTime: cartData.maxPrepTime,
  };
  saveCartToStorage({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount });
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    openDrawer(state) {
      state.isDrawerOpen = true;
    },
    closeDrawer(state) {
      state.isDrawerOpen = false;
    },
    toggleDrawer(state) {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    addItemLocal(state, action) {
      const item = action.payload;
      const existingIdx = state.items.findIndex(
        (ci) => ci.configurationId === item.configurationId
      );
      if (existingIdx !== -1) {
        state.items[existingIdx].qty += item.qty || 1;
        state.items[existingIdx].totalPrice = state.items[existingIdx].unitPrice * state.items[existingIdx].qty;
      } else {
        state.items.push(item);
      }
      state.summary = calculateSummary(state.items, state.couponDiscount);
      saveCartToStorage({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount });
    },
    updateItemQtyLocal(state, action) {
      const { itemId, qty } = action.payload;
      const item = state.items.find((i) => i._id === itemId || i.configurationId === itemId);
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter((i) => i._id !== itemId && i.configurationId !== itemId);
        } else {
          item.qty = qty;
          item.totalPrice = item.unitPrice * qty;
        }
      }
      state.summary = calculateSummary(state.items, state.couponDiscount);
      saveCartToStorage({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount });
    },
    removeItemLocal(state, action) {
      state.items = state.items.filter((i) => i._id !== action.payload && i.configurationId !== action.payload);
      state.summary = calculateSummary(state.items, state.couponDiscount);
      saveCartToStorage({ items: state.items, couponCode: state.couponCode, couponDiscount: state.couponDiscount });
    },
    clearCartLocal(state) {
      state.items = [];
      state.couponCode = '';
      state.couponDiscount = 0;
      state.summary = calculateSummary([], 0);
      saveCartToStorage({ items: [], couponCode: '', couponDiscount: 0 });
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(fetchCart.fulfilled, (state, action) => { state.isLoading = false; applyServerCart(state, action.payload); })
      .addCase(fetchCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(addToCart.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(addToCart.fulfilled, (state, action) => { state.isLoading = false; applyServerCart(state, action.payload); })
      .addCase(addToCart.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(updateCartItemQty.pending, (state) => { state.error = null; })
      .addCase(updateCartItemQty.fulfilled, (state, action) => { applyServerCart(state, action.payload); })
      .addCase(updateCartItemQty.rejected, (state, action) => { state.error = action.payload; })

      .addCase(removeCartItem.pending, (state) => { state.error = null; })
      .addCase(removeCartItem.fulfilled, (state, action) => { applyServerCart(state, action.payload); })
      .addCase(removeCartItem.rejected, (state, action) => { state.error = action.payload; })

      .addCase(clearCartAsync.fulfilled, (state, action) => { applyServerCart(state, action.payload); })

      .addCase(applyCouponCode.pending, (state) => { state.error = null; })
      .addCase(applyCouponCode.fulfilled, (state, action) => { state.isLoading = false; applyServerCart(state, action.payload); })
      .addCase(applyCouponCode.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })

      .addCase(removeCouponCode.fulfilled, (state, action) => { applyServerCart(state, action.payload); })

      .addCase(syncCartToServer.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(syncCartToServer.fulfilled, (state, action) => { state.isLoading = false; applyServerCart(state, action.payload); })
      .addCase(syncCartToServer.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; });
  },
});

export const {
  openDrawer, closeDrawer, toggleDrawer,
  addItemLocal, updateItemQtyLocal, removeItemLocal,
  clearCartLocal, clearError,
} = cartSlice.actions;

export default cartSlice.reducer;
