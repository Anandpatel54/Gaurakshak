import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { GalleryItem } from '@/types';
import api from '@/services/api';
import { initialMockGallery } from '@/data/mockAdminData';

interface GalleryState {
  items: GalleryItem[];
  loading: boolean;
  error: string | null;
}

const getStoredGallery = (): GalleryItem[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminGallery');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('adminGallery', JSON.stringify(initialMockGallery));
  }
  return initialMockGallery;
};

const saveGallery = (gallery: GalleryItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminGallery', JSON.stringify(gallery));
  }
};

const initialState: GalleryState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchGallery = createAsyncThunk(
  'gallery/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/gallery');
      return response.data.data;
    } catch (err: any) {
      return getStoredGallery();
    }
  }
);

export const addGalleryItem = createAsyncThunk(
  'gallery/add',
  async (itemData: Partial<GalleryItem>, { rejectWithValue }) => {
    try {
      const response = await api.post('/gallery', itemData);
      return response.data.data;
    } catch (err: any) {
      const current = getStoredGallery();
      const newItem: GalleryItem = {
        _id: 'gallery-' + Math.random().toString(36).substr(2, 9),
        title: itemData.title || '',
        type: itemData.type || 'photo',
        url: itemData.url || 'https://images.unsplash.com/photo-1608976478512-ca619a9e33ec?auto=format&fit=crop&q=80&w=800',
        category: itemData.category || 'General',
        isHighlight: itemData.isHighlight || false,
        createdAt: new Date().toISOString(),
      };
      const updated = [newItem, ...current];
      saveGallery(updated);
      return newItem;
    }
  }
);

export const deleteGalleryItem = createAsyncThunk(
  'gallery/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/gallery/${id}`);
      return id;
    } catch (err: any) {
      const current = getStoredGallery();
      const updated = current.filter(g => g._id !== id);
      saveGallery(updated);
      return id;
    }
  }
);

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGallery.pending, (state) => { state.loading = true; })
      .addCase(fetchGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch gallery';
      })
      .addCase(addGalleryItem.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
      })
      .addCase(deleteGalleryItem.fulfilled, (state, action) => {
        state.items = state.items.filter(g => g._id !== action.payload);
      });
  },
});

export default gallerySlice.reducer;
