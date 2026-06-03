import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Event } from '@/types';
import { eventService } from '@/services/eventService';

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

interface EventState {
  events: Event[];
  featuredEvents: Event[];
  currentEvent: Event | null;
  loading: boolean;
  error: string | null;
}

const initialState: EventState = {
  events: [],
  featuredEvents: [],
  currentEvent: null,
  loading: false,
  error: null,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await eventService.getAll();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch events'));
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await eventService.getById(id);
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch event details'));
    }
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    clearCurrentEvent: (state) => {
      state.currentEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
        state.featuredEvents = action.payload.filter(e => e.isFeatured);
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Event by ID
      .addCase(fetchEventById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentEvent } = eventSlice.actions;
export default eventSlice.reducer;
