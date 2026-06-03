import api from './api';
import { ApiResponse, Member, MemberFormData } from '@/types';

export const memberService = {
  create: async (data: MemberFormData): Promise<ApiResponse<Member>> => {
    const response = await api.post<ApiResponse<Member>>('/members', data);
    return response.data;
  },

  updateMyMembership: async (
    data: Pick<MemberFormData, 'membershipType' | 'address' | 'city'>
  ): Promise<ApiResponse<Member>> => {
    const response = await api.patch<ApiResponse<Member>>('/auth/customer/membership', data);
    return response.data;
  },
};
