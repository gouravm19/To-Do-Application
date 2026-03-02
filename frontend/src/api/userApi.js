import api from './axiosConfig';

export const userApi = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  deleteAccount: async () => {
    await api.delete('/users/account');
  },
};

export default userApi;
