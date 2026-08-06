import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import pizzaService from '../../services/pizza';

export const fetchPizzas = createAsyncThunk(
  'pizza/fetchPizzas',
  async (params, { rejectWithValue }) => {
    try {
      const response = await pizzaService.getAll(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPizzaById = createAsyncThunk(
  'pizza/fetchPizzaById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await pizzaService.getById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'pizza/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await pizzaService.getCategories();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  pizzas: [],
  pagination: null,
  categories: [],
  selectedPizza: null,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: '',
    sort: '-rating',
    page: 1,
  },
};

const pizzaSlice = createSlice({
  name: 'pizza',
  initialState,
  reducers: {
    clearPizzaError: (state) => {
      state.error = null;
    },
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    clearSelectedPizza: (state) => {
      state.selectedPizza = null;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPizzas.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPizzas.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pizzas = action.payload.pizzas;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchPizzas.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPizzaById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPizzaById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedPizza = action.payload.pizza;
      })
      .addCase(fetchPizzaById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload.categories;
      });
  },
});

export const { clearPizzaError, setFilter, clearSelectedPizza, setPage } = pizzaSlice.actions;
export default pizzaSlice.reducer;
