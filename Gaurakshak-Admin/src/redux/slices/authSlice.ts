import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '@/services/api';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  admin: { name: string; email: string } | null;
}

const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('adminToken');
    const adminStr = localStorage.getItem('adminUser');
    if (token && adminStr) {
      return {
        token,
        isAuthenticated: true,
        loading: false,
        error: null,
        admin: JSON.parse(adminStr),
      };
    }
  }
  return {
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    admin: null,
  };
};

export const loginAdmin = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, admin } = response.data.data;
      localStorage.setItem('adminToken', token);
      localStorage.setItem('adminUser', JSON.stringify(admin));
      return { token, admin };
    } catch (error) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        return rejectWithValue(error.response?.data?.message || 'Invalid username or password');
      }

      return rejectWithValue('Invalid username or password');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    logout: (state) => {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      state.token = null;
      state.admin = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
