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
        // IMPORTANTE: En Web, AsyncStorage a veces guarda con comillas extra
        // Este replace asegura que el Bearer sea "Bearer eyJ..." y no "Bearer "eyJ...""
        const tokenLimpio = token.replace(/^"(.*)"$/, '$1'); 
        
        config.headers.Authorization = `Bearer ${tokenLimpio}`;
        
        // Log para que veas en la consola si el token está saliendo
        console.log("🚀 API: Enviando token en header");
      } else {
        console.log("⚠️ API: No se encontró token en el storage");
      }
    } catch (error) {
      console.error('❌ Error en interceptor de API:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de response - Manejar errores y formatear
api.interceptors.response.use(
  (response) => {
    // Si el backend devuelve data dentro de data, lo extraemos aquí si prefieres
    return response.data; 
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es 401 y no hemos reintentado
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("Error 401 detectado. El token fue rechazado por el servidor.");
      
      // NOTA: El refresh token lo dejamos desactivado o revisado luego 
      // porque tu ruta en config es '/auth/refresh' y en api tenías '/auth/refresh-token'
    }

    const errorFormatted = {
      message: error.response?.data?.mensaje || error.response?.data?.message || 'Error en la solicitud',
      status: error.response?.status,
      data: error.response?.data
    };

    return Promise.reject(errorFormatted);
  }
);

export default api;