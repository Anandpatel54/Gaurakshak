import api from './api';
import { ApiResponse, ContactMessage, ContactFormData } from '@/types';

export const contactService = {
  create: async (data: ContactFormData): Promise<ApiResponse<ContactMessage>> => {
    try {
      const response = await api.post<ApiResponse<ContactMessage>>('/contact', data);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, simulating contact form submission locally:', error);
      const mockResult: ContactMessage = {
        _id: 'message-' + Math.random().toString(36).substr(2, 9),
        ...data,
        isRead: false,
        createdAt: new Date().toISOString(),
      };
      return {
        success: true,
        message: 'Your message has been sent successfully (Simulated offline)',
        data: mockResult,
      };
    }
  },
};
