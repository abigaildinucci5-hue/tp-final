// frontend/src/servicios/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG, STORAGE_KEYS } from '../constantes/config';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - Agregar token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Token añadido a la solicitud');
      } else {
        console.log('⚠️ No hay token disponible');
      }
    } catch (error) {
      console.error('Error al obtener token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores y refrescar token
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si el error es 401 y no hemos intentado refrescar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        const refreshToken = await AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh-token`,
            { refreshToken }
          );

          const { token } = response.data;
          await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);

          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } else {
          // No hay refresh token, usuario debe volver a loguearse
          return Promise.reject({
            message: 'Sesión expirada. Por favor, vuelve a loguearte.',
            status: 401,
            data: error.response?.data,
          });
        }
      } catch (refreshError) {
        // El refresh falló - solo entonces borramos el token
        // Esto indica que el token es realmente inválido
        if (refreshError.response?.status === 401) {
          await AsyncStorage.multiRemove([
            STORAGE_KEYS.TOKEN,
            STORAGE_KEYS.USER,
            STORAGE_KEYS.REFRESH_TOKEN
          ]);
        }
        
        return Promise.reject({
          message: 'Sesión expirada. Por favor, vuelve a loguearte.',
          status: 401,
          data: refreshError.response?.data,
        });
      }
    }

    // Formatear error para mejor manejo
    const errorFormatted = {
      message: error.response?.data?.message || error.message || 'Error en la solicitud',
      status: error.response?.status,
      data: error.response?.data,
      originalError: error
    };

    return Promise.reject(errorFormatted);
  }
);

// Funciones helper para peticiones comunes
export const apiHelper = {
  // GET
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Upload de archivos
  uploadFile: async (url, formData, onUploadProgress) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;