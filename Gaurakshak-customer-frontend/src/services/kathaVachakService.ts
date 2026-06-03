import api from './api';
import { ApiResponse, KathaVachak } from '@/types';

export const kathaVachakService = {
  getAll: async (): Promise<ApiResponse<KathaVachak[]>> => {
    const response = await api.get<ApiResponse<KathaVachak[]>>('/katha-vachak?active=true');
    return response.data;
  },
};
