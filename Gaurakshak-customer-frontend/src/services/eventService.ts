import api from './api';
import { ApiResponse, Event } from '@/types';

export const eventService = {
  getAll: async (): Promise<ApiResponse<Event[]>> => {
    const response = await api.get<ApiResponse<Event[]>>('/events');
    return response.data;
  },

  getById: async (id: string): Promise<ApiResponse<Event>> => {
    const response = await api.get<ApiResponse<Event>>(`/events/${id}`);
    return response.data;
  },
};
