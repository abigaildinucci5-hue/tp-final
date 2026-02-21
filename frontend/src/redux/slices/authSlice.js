import axios from 'axios';
import storage from '../../utils/storage';
import { API_CONFIG } from '../../constantes/config';

let onLogoutCallback = null;

export const setLogoutHandler = (callback) => {
  onLogoutCallback = callback;
};

const API_URL = API_CONFIG.BASE_URL.replace(/\/$/, '');

const api = axios.create({
  baseURL: API_URL,
  timeout: API_CONFIG.TIMEOUT || 30000,
});

// REQUEST
api.interceptors.request.use(
  async (config) => {
    const token = await storage.get('token');
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
        const refreshToken = await storage.get('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken } = response.data.data;

        await storage.set('token', accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        await storage.remove('token');
        await storage.remove('refreshToken');

        if (onLogoutCallback) onLogoutCallback();

        return Promise.reject(err);
      }
    }

    return Promise.reject({
      mensaje: error.response?.data?.mensaje || error.message || 'Error de conexión con el servidor',
      codigo: error.response?.data?.codigo || (error.message === 'Network Error' ? 'ERROR_RED' : 'ERROR_DESCONOCIDO'),
      status: error.response?.status,
      detalles: error.message
    });
  }
);

export default api;
