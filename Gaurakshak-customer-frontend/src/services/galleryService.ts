import api from './api';
import { ApiResponse, GalleryItem } from '@/types';
import { mockGallery } from '@/data/mockData';

export const galleryService = {
  getAll: async (): Promise<ApiResponse<GalleryItem[]>> => {
    try {
      const response = await api.get<ApiResponse<GalleryItem[]>>('/gallery');
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock gallery:', error);
      return {
        success: true,
        message: 'Loaded mock gallery successfully',
        data: mockGallery,
      };
    }
  },
};
