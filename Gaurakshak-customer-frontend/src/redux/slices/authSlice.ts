import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: boolean;
}

interface SignupPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  city?: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isAuthenticated: authService.isAuthenticated(),
  loading: false,
  error: null,
  success: false,
};

// Async thunks
export const signup = createAsyncThunk(
  'auth/signup',
  async (data: SignupPayload, { rejectWithValue }) => {
    try {
      const response = await authService.signup(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (data: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await authService.login(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // Signup
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || 'Signup failed';
        state.success = false;
      });

    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.success = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.toString() || 'Login failed';
        state.success = false;
      });
  },
});

export const { logout, clearError, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
