import axios from 'axios';
import { config } from '../config';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 15000, // 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('weather_wise_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is due to an expired token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('weather_wise_refresh_token');
        const response = await axios.post(
          config.auth.endpoints.refresh,
          { refreshToken },
          { baseURL: config.api.baseUrl }
        );

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        localStorage.setItem('weather_wise_auth_token', accessToken);
        localStorage.setItem('weather_wise_refresh_token', newRefreshToken);

        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        return axiosInstance(originalRequest);
      } catch (_) {
        localStorage.removeItem('weather_wise_auth_token');
        localStorage.removeItem('weather_wise_refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance; 