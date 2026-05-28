import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `❌ API Error: ${error.response.status} - ${error.response.config.url}`
      );
    } else if (error.request) {
      console.error('❌ Network Error: No response received');
    } else {
      console.error('❌ Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;