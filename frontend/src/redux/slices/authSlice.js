import axios from 'axios';
import storage from '../../utils/storage';

let onLogoutCallback = null;

export const setLogoutHandler = (callback) => {
  onLogoutCallback = callback;
};

const API_URL =
  __DEV__
    ? 'http://localhost:3000'
    : 'https://tp-final-production-9e41.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// REQUEST
api.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await storage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        await storage.setItem('token', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        await storage.removeItem('token');
        await storage.removeItem('refreshToken');

        if (onLogoutCallback) onLogoutCallback();

        return Promise.reject(err);
      }
    }

    return Promise.reject({
      mensaje: error.response?.data?.mensaje || 'Error de conexión',
      codigo: error.response?.data?.codigo || 'ERROR_DESCONOCIDO',
      status: error.response?.status,
    });
  }
);

export default api;
