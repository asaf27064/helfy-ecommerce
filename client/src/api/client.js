import axios from 'axios';

// nginx proxies /api to the Express server, so the relative base works in Docker.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE ?? '/api',
});

// Attach the JWT to every request if present.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('helfy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalize the server's { error: { message, code } } shape into error.message.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const apiMessage = error.response?.data?.error?.message;
    error.message = apiMessage || error.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('helfy_token');
    }
    return Promise.reject(error);
  }
);

export default api;
