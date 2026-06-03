import api from './api';
import { ApiResponse, Booking, BookingFormData } from '@/types';

export const bookingService = {
  create: async (data: BookingFormData): Promise<ApiResponse<Booking>> => {
    const response = await api.post<ApiResponse<Booking>>('/bookings', data);
    return response.data;
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const response = await api.get<ApiResponse<Booking[]>>('/bookings/my-bookings');
    return response.data;
  },
};
