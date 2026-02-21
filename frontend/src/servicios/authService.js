// frontend/src/servicios/authService.js
// Servicio de autenticación con soporte OAuth (Google + GitHub)

import axios from 'axios';
import { Platform } from 'react-native';
import { API_CONFIG } from '../constantes/config';

/**
 * ========================================
 * CONFIGURACIÓN DE LA API
 * ========================================
 */
// Usar la URL central del proyecto (configurable en `src/constantes/config.js`)
const API_BASE = API_CONFIG.BASE_URL.replace(/\/$/, '');
const API_URL = `${API_BASE}/auth`;

/**
 * ========================================
 * SERVICIO DE AUTENTICACIÓN
 * ========================================
 */
export const authService = {
  
  /**
   * Login local (email + password)
   */
  loginLocal: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password,
        dispositivo: Platform.OS
      });
      return response.data;
    } catch (error) {
      console.error('Error en login local:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        mensaje: 'Error de conexión. Verifica que el backend esté corriendo.',
      };
    }
  },

  /**
   * Registro local
   */
  registroLocal: async (datos) => {
    try {
      const response = await axios.post(`${API_URL}/registro`, {
        ...datos,
        dispositivo: Platform.OS
      });
      return response.data;
    } catch (error) {
      console.error('Error en registro:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        mensaje: 'Error de conexión. Verifica que el backend esté corriendo.',
      };
    }
  },

  /**
   * Login con Google (mobile - React Native)
   */
  googleMobileAuth: async (googleAccessToken) => {
    try {
      const response = await axios.post(`${API_URL}/google/mobile`, {
        access_token: googleAccessToken,
        dispositivo: Platform.OS
      });
      return response.data;
    } catch (error) {
      console.error('Error en Google mobile auth:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        mensaje: 'Error al autenticar con Google',
      };
    }
  },

  /**
   * Login con GitHub (mobile - React Native)
   */
  githubMobileAuth: async (githubAccessToken) => {
    try {
      const response = await axios.post(`${API_URL}/github/mobile`, {
        access_token: githubAccessToken,
        dispositivo: Platform.OS
      });
      return response.data;
    } catch (error) {
      console.error('Error en GitHub mobile auth:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        mensaje: 'Error al autenticar con GitHub',
      };
    }
  },

  /**
   * Obtener perfil del usuario autenticado
   */
  obtenerPerfil: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/perfil`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener perfil:', error);
      return {
        exito: false,
        mensaje: 'Error al obtener datos del usuario',
      };
    }
  },

  /**
   * Logout (invalidar token)
   */
  logout: async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error en logout:', error);
      return {
        exito: false,
        mensaje: 'Error al cerrar sesión',
      };
    }
  },

  /**
   * Cerrar todas las sesiones
   */
  logoutAll: async (token) => {
    try {
      const response = await axios.post(
        `${API_URL}/logout-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error en logout all:', error);
      return {
        exito: false,
        mensaje: 'Error al cerrar todas las sesiones',
      };
    }
  },

  /**
   * Refrescar token
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await axios.post(`${API_URL}/refresh`, {
        refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Error al refrescar token:', error);
      return {
        exito: false,
        mensaje: 'Error al refrescar token',
      };
    }
  },

  /**
   * Cambiar contraseña
   */
  cambiarPassword: async (token, passwordActual, nuevaPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/cambiar-password`,
        {
          passwordActual,
          nuevaPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      if (error.response?.data) {
        return error.response.data;
      }
      return {
        exito: false,
        mensaje: 'Error al cambiar contraseña',
      };
    }
  },
};

export default authService;