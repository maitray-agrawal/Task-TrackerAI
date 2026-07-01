import axios from 'axios';

const getBaseURL = () => {
  let url = import.meta.env.VITE_API_URL;
  if (!url) {
    if (typeof window !== 'undefined') {
      const { hostname } = window.location;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000/api';
      }
    }
    return '/api';
  }
  url = url.trim();
  if (url.startsWith('http://') || url.startsWith('https://')) {
    if (!url.endsWith('/api') && !url.endsWith('/api/')) {
      url = url.replace(/\/+$/, '') + '/api';
    }
  }
  return url;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export const taskService = {
  getTasks: async (params) => {
    const { data } = await api.get('/tasks', { params });
    // Backward compatibility check: return data.data if it contains the pagination/tasks structure
    if (data && data.data && data.data.tasks !== undefined) {
      return data.data;
    }
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
