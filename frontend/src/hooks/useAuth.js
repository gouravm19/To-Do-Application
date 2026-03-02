import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userApi from '../api/userApi';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';

export const userKeys = {
  profile: ['user', 'profile'],
};

export const useProfile = () => {
  return useQuery({
    queryKey: userKeys.profile,
    queryFn: userApi.getProfile,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: (data) => {
      queryClient.setQueryData(userKeys.profile, data);
      updateUser(data);
      toast.success('Profile updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });
};

export const useChangePassword = () => {
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast.success('Password changed. Please login again.');
      setTimeout(() => {
        logout();
        window.location.href = '/login';
      }, 1500);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password');
    },
  });
};
