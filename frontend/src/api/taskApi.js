import api from './axiosConfig';

// Helper to clean filter params
const cleanParams = (params) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    // Skip empty values and 'all' placeholder values
    if (value && value !== '' && value !== 'all') {
      cleaned[key] = value;
    }
  });
  return cleaned;
};

export const taskApi = {
  getTasks: async (params = {}) => {
    const cleanedParams = cleanParams(params);
    const response = await api.get('/tasks', { params: cleanedParams });
    return response.data;
  },

  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  getTaskStats: async () => {
    const response = await api.get('/tasks/stats');
    return response.data;
  },

  createTask: async (data) => {
    const response = await api.post('/tasks', data);
    return response.data;
  },

  updateTask: async (id, data) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },

  updateTaskStatus: async (id, status) => {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  togglePin: async (id) => {
    const response = await api.patch(`/tasks/${id}/pin`);
    return response.data;
  },

  deleteTask: async (id) => {
    await api.delete(`/tasks/${id}`);
  },
};

export default taskApi;
