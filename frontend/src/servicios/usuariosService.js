// frontend/src/servicios/usuariosService.js
import { apiHelper } from './api';
import { USER_ROUTES } from '../constantes/rutas';

const usuariosService = {
  // Obtener perfil del usuario actual
  getProfile: async () => {
    try {
      const response = await apiHelper.get(USER_ROUTES.PROFILE);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar perfil del usuario
  updateProfile: async (userData) => {
    try {
      const response = await apiHelper.put(USER_ROUTES.UPDATE_PROFILE, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Cambiar contraseña
  changePassword: async (passwordData) => {
    try {
      const response = await apiHelper.put(USER_ROUTES.CHANGE_PASSWORD, passwordData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Subir foto de perfil
  uploadPhoto: async (imageFile, onUploadProgress) => {
    try {
      const formData = new FormData();
      formData.append('foto', {
        uri: imageFile.uri,
        type: imageFile.type || 'image/jpeg',
        name: imageFile.fileName || `perfil_${Date.now()}.jpg`
      });

      const response = await apiHelper.uploadFile(
        USER_ROUTES.UPLOAD_PHOTO,
        formData,
        onUploadProgress
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener usuario por ID (Admin)
  getById: async (id) => {
    try {
      const response = await apiHelper.get(USER_ROUTES.GET_BY_ID(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Listar todos los usuarios (Admin)
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${USER_ROUTES.LIST}?${queryParams}` : USER_ROUTES.LIST;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar usuario (Admin)
  delete: async (id) => {
    try {
      const response = await apiHelper.delete(USER_ROUTES.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar rol de usuario (Admin)
  updateRole: async (id, rol) => {
    try {
      const response = await apiHelper.patch(`${USER_ROUTES.GET_BY_ID(id)}/rol`, { rol });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Activar/Desactivar usuario (Admin)
  toggleStatus: async (id) => {
    try {
      const response = await apiHelper.patch(`${USER_ROUTES.GET_BY_ID(id)}/toggle-status`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas de usuario (Admin)
  getEstadisticas: async (id) => {
    try {
      const response = await apiHelper.get(`${USER_ROUTES.GET_BY_ID(id)}/estadisticas`);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default usuariosService;