import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { logout } from '@/redux/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    success: auth.success,
    logout: () => dispatch(logout()),
  };
};
