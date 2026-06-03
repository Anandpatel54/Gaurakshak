import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Booking } from '@/types';
import api from '@/services/api';
import { initialMockBookings } from '@/data/mockAdminData';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const getStoredBookings = (): Booking[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminBookings');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('adminBookings', JSON.stringify(initialMockBookings));
  }
  return initialMockBookings;
};

const saveBookings = (bookings: Booking[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminBookings', JSON.stringify(bookings));
  }
};

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'bookings/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/bookings');
      return response.data.data;
    } catch (err: any) {
      return getStoredBookings();
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  'bookings/updateStatus',
  async ({ id, status }: { id: string; status: 'confirmed' | 'rejected' }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/bookings/${id}`, { status });
      return response.data.data;
    } catch (err: any) {
      const current = getStoredBookings();
      const updated = current.map(b => b._id === id ? { ...b, status } : b);
      saveBookings(updated);
      return { _id: id, status };
    }
  }
);

export const deleteBooking = createAsyncThunk(
  'bookings/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/bookings/${id}`);
      return id;
    } catch (err: any) {
      const current = getStoredBookings();
      const updated = current.filter(b => b._id !== id);
      saveBookings(updated);
      return id;
    }
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => { state.loading = true; })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(updateBookingStatus.fulfilled, (state, action) => {
        state.bookings = state.bookings.map(b => b._id === action.payload._id ? { ...b, status: action.payload.status } : b);
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(b => b._id !== action.payload);
      });
  },
});

export default bookingSlice.reducer;
