import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import eventReducer from './slices/eventSlice';
import bookingReducer from './slices/bookingSlice';
import galleryReducer from './slices/gallerySlice';
import memberReducer from './slices/memberSlice';
import messageReducer from './slices/messageSlice';
import kathaVachakReducer from './slices/kathaVachakSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    events: eventReducer,
    bookings: bookingReducer,
    gallery: galleryReducer,
    members: memberReducer,
    messages: messageReducer,
    kathaVachaks: kathaVachakReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
