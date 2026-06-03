import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Member } from '@/types';
import api from '@/services/api';
import { initialMockMembers } from '@/data/mockAdminData';

interface MemberState {
  members: Member[];
  loading: boolean;
  error: string | null;
}

const getStoredMembers = (): Member[] => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('adminMembers');
    if (stored) return JSON.parse(stored);
    localStorage.setItem('adminMembers', JSON.stringify(initialMockMembers));
  }
  return initialMockMembers;
};

const saveMembers = (members: Member[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('adminMembers', JSON.stringify(members));
  }
};

const initialState: MemberState = {
  members: [],
  loading: false,
  error: null,
};

export const fetchMembers = createAsyncThunk(
  'members/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/members');
      return response.data.data;
    } catch (err: any) {
      return getStoredMembers();
    }
  }
);

export const updateMemberStatus = createAsyncThunk(
  'members/updateStatus',
  async ({ id, status }: { id: string; status: 'approved' | 'rejected' }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/members/${id}`, { status });
      return response.data.data;
    } catch (err: any) {
      const current = getStoredMembers();
      const updated = current.map(m => m._id === id ? { ...m, status } : m);
      saveMembers(updated);
      return { _id: id, status };
    }
  }
);

const memberSlice = createSlice({
  name: 'members',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => { state.loading = true; })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch members';
      })
      .addCase(updateMemberStatus.fulfilled, (state, action) => {
        state.members = state.members.map(m => m._id === action.payload._id ? { ...m, status: action.payload.status } : m);
      });
  },
});

export default memberSlice.reducer;
