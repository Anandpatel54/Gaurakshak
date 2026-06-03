import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryItem } from '@/types';
import { galleryService } from '@/services/galleryService';

const getErrorMessage = (error: unknown, fallback: string) => {
  return error instanceof Error ? error.message : fallback;
};

interface GalleryState {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: GalleryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchGallery = createAsyncThunk(
  'gallery/fetchGallery',
  async (_, { rejectWithValue }) => {
    try {
      const response = await galleryService.getAll();
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, 'Failed to fetch gallery items'));
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default gallerySlice.reducer;
