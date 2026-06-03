import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ContactMessage } from '@/types';
import api from '@/services/api';
import { initialMockMessages } from '@/data/mockAdminData';

interface MessageState {
  messages: ContactMessage[];
  loading: boolean;
  error: string | null;
}

const getStoredMessages = (): ContactMessage[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminMessages');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('adminMessages', JSON.stringify(initialMockMessages));
  }
  return initialMockMessages;
};

const saveMessages = (messages: ContactMessage[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminMessages', JSON.stringify(messages));
  }
};

const initialState: MessageState = {
  messages: [],
  loading: false,
  error: null,
};

export const fetchMessages = createAsyncThunk(
  'messages/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact');
      return response.data.data;
    } catch (err: any) {
      return getStoredMessages();
    }
  }
);

export const markMessageAsRead = createAsyncThunk(
  'messages/markAsRead',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact/${id}`, { isRead: true });
      return response.data.data;
    } catch (err: any) {
      const current = getStoredMessages();
      const updated = current.map(m => m._id === id ? { ...m, isRead: true } : m);
      saveMessages(updated);
      return { _id: id, isRead: true };
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })
      .addCase(markMessageAsRead.fulfilled, (state, action) => {
        state.messages = state.messages.map(m => m._id === action.payload._id ? { ...m, isRead: action.payload.isRead } : m);
      });
  },
});

export default messageSlice.reducer;
