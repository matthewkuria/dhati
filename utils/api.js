import axios from 'axios';
import Cookie from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    

  },
});

api.interceptors.request.use((config) => {
  const token = Cookie.get('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;