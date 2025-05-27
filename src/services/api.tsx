import axios from 'axios';

// Set the base URL for your backend API
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com/api' // Replace with your production API URL
  : 'http://localhost:8000/api';       // Default development API URL

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach the token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized and token exists, the token might be expired
     if (error.response?.status === 401 && localStorage.getItem('accessToken')) {
+      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;