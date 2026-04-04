// usuariosService.js — cambiar import
import api from './api'; // en lugar de { apiHelper }

// Y reemplazar todos los apiHelper.get/put/delete/patch por api.get/put/delete/patch
const usuariosService = {
  getProfile: async () => {
    return await api.get('/usuarios/perfil');
  },

  updateProfile: async (userData) => {
    return await api.put('/usuarios/perfil', userData);
  },

  getById: async (id) => {
    return await api.get(`/usuarios/${id}`);
  },

  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const url = queryParams ? `/usuarios?${queryParams}` : '/usuarios';
    return await api.get(url);
  },

  delete: async (id) => {
    return await api.delete(`/usuarios/${id}`);
  },

  updateRole: async (id, rol) => {
    return await api.put(`/usuarios/${id}/cambiar-rol`, { nuevoRol: rol });
  },

  toggleStatus: async (id) => {
    return await api.put(`/usuarios/${id}/toggle-activo`);
  },
};

export default usuariosService;