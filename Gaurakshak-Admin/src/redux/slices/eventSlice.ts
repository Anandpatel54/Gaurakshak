import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Event } from '@/types';
import api from '@/services/api';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  loading: false,
  error: null,
};

const getErrorMessage = (err: unknown, fallback: string) => {
  if (axios.isAxiosError<{ message?: string }>(err)) {
    return err.response?.data?.message || fallback;
  }

  return fallback;
};

export const fetchEvents = createAsyncThunk(
  'events/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/events');
      return response.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to fetch events'));
    }
  }
);

export const addEvent = createAsyncThunk(
  'events/add',
  async (eventData: Partial<Event>, { rejectWithValue }) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to create event'));
    }
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, eventData }: { id: string; eventData: Partial<Event> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data.data;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to update event'));
    }
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/events/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(getErrorMessage(err, 'Failed to delete event'));
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => { state.loading = true; })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch events';
      })
      .addCase(addEvent.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to create event';
      })
      .addCase(addEvent.fulfilled, (state, action) => {
        state.error = null;
        state.events = [action.payload, ...state.events];
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to update event';
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.error = null;
        state.events = state.events.map(e => e._id === action.payload._id ? { ...e, ...action.payload } : e);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.error = action.payload as string || 'Failed to delete event';
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.error = null;
        state.events = state.events.filter(e => e._id !== action.payload);
      });
  },
});

export default eventSlice.reducer;
