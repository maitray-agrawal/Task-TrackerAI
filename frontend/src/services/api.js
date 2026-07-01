import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getTasks: async (params) => {
    const { data } = await api.get('/tasks', { params });
    return data;
  },

  getTaskById: async (id) => {
    const { data } = await api.get(`/tasks/${id}`);
    return data.data;
  },

  createTask: async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data.data;
  },

  updateTask: async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    return data.data;
  },

  updateTaskStatus: async (id, status) => {
    const { data } = await api.patch(`/tasks/${id}/status`, { status });
    return data.data;
  },

  deleteTask: async (id) => {
    const { data } = await api.delete(`/tasks/${id}`);
    return data.data;
  },
};

export default api;
