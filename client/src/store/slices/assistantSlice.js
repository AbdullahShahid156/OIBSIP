import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import assistantService from '../../services/assistant';

let messageIdCounter = 0;
function nextId() {
  return `msg-${++messageIdCounter}-${Date.now()}`;
}

export const sendMessage = createAsyncThunk(
  'assistant/sendMessage',
  async ({ message }, { getState, rejectWithValue }) => {
    try {
      const { messages } = getState().assistant;
      const history = messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.text }));

      const response = await assistantService.chat(message, history);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSuggestions = createAsyncThunk(
  'assistant/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await assistantService.getSuggestions();
      return response.data.suggestions;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  text: "Hey! I'm your PizzaCraft assistant. I can recommend pizzas, help you customize one, or answer questions about our menu. What are you in the mood for?",
  recommendations: [],
  timestamp: Date.now(),
};

const initialState = {
  messages: [WELCOME_MESSAGE],
  suggestions: [],
  isOpen: false,
  isTyping: false,
  error: null,
  unreadCount: 0,
};

const assistantSlice = createSlice({
  name: 'assistant',
  initialState,
  reducers: {
    openPanel(state) {
      state.isOpen = true;
      state.unreadCount = 0;
    },
    closePanel(state) {
      state.isOpen = false;
    },
    togglePanel(state) {
      state.isOpen = !state.isOpen;
      if (state.isOpen) state.unreadCount = 0;
    },
    addUserMessage(state, action) {
      state.messages.push({
        id: nextId(),
        role: 'user',
        text: action.payload,
        timestamp: Date.now(),
      });
      state.isTyping = true;
      state.error = null;
    },
    addWelcomeMessage(state) {
      if (state.messages.length === 0) {
        state.messages.push(WELCOME_MESSAGE);
      }
    },
    clearMessages(state) {
      state.messages = [WELCOME_MESSAGE];
      state.error = null;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { reply, recommendations } = action.payload;
        state.messages.push({
          id: nextId(),
          role: 'assistant',
          text: reply,
          recommendations: recommendations || [],
          timestamp: Date.now(),
        });
        state.isTyping = false;
        if (!state.isOpen) {
          state.unreadCount += 1;
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isTyping = false;
        state.error = action.payload || 'Failed to get response. Please try again.';
        state.messages.push({
          id: nextId(),
          role: 'assistant',
          text: "Sorry, I'm having trouble right now. Please try again in a moment.",
          recommendations: [],
          timestamp: Date.now(),
        });
      })
      .addCase(fetchSuggestions.fulfilled, (state, action) => {
        state.suggestions = action.payload;
      });
  },
});

export const {
  openPanel,
  closePanel,
  togglePanel,
  addUserMessage,
  addWelcomeMessage,
  clearMessages,
  clearError,
} = assistantSlice.actions;

export default assistantSlice.reducer;
