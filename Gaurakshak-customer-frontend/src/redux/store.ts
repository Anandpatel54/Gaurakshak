import { configureStore } from '@reduxjs/toolkit';
import eventReducer from './slices/eventSlice';
import galleryReducer from './slices/gallerySlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    events: eventReducer,
    gallery: galleryReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
