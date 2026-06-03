import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { KathaVachak } from '@/types';
import api from '@/services/api';

interface KathaVachakState {
  items: KathaVachak[];
  loading: boolean;
  error: string | null;
}

const initialState: KathaVachakState = {
  items: [],
  loading: false,
  error: null,
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || fallback;
  }

  return fallback;
};

export const fetchKathaVachaks = createAsyncThunk(
  'kathaVachaks/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/katha-vachak');
      return response.data.data as KathaVachak[];
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch Katha Vachaks'));
    }
  }
);

export const addKathaVachak = createAsyncThunk(
  'kathaVachaks/add',
  async (vachakData: Partial<KathaVachak>, { rejectWithValue }) => {
    try {
      const response = await api.post('/katha-vachak', vachakData);
      return response.data.data as KathaVachak;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create Katha Vachak'));
    }
  }
);

export const updateKathaVachak = createAsyncThunk(
  'kathaVachaks/update',
  async ({ id, vachakData }: { id: string; vachakData: Partial<KathaVachak> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/katha-vachak/${id}`, vachakData);
      return response.data.data as KathaVachak;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update Katha Vachak'));
    }
  }
);

export const deleteKathaVachak = createAsyncThunk(
  'kathaVachaks/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/katha-vachak/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete Katha Vachak'));
    }
  }
);

const kathaVachakSlice = createSlice({
  name: 'kathaVachaks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKathaVachaks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKathaVachaks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchKathaVachaks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch Katha Vachaks';
      })
      .addCase(addKathaVachak.fulfilled, (state, action) => {
        state.error = null;
        state.items = [action.payload, ...state.items];
      })
      .addCase(addKathaVachak.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to create Katha Vachak';
      })
      .addCase(updateKathaVachak.fulfilled, (state, action) => {
        state.error = null;
        state.items = state.items.map((item) => (item._id === action.payload._id ? action.payload : item));
      })
      .addCase(updateKathaVachak.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update Katha Vachak';
      })
      .addCase(deleteKathaVachak.fulfilled, (state, action) => {
        state.error = null;
        state.items = state.items.filter((item) => item._id !== action.payload);
      })
      .addCase(deleteKathaVachak.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to delete Katha Vachak';
      });
  },
});

export default kathaVachakSlice.reducer;
