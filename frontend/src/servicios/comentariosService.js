// frontend/src/servicios/comentariosService.js
import { apiHelper } from './api';
import { COMENTARIO_ROUTES } from '../constantes/rutas';

const comentariosService = {
  // Obtener todos los comentarios
  getAll: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams ? `${COMENTARIO_ROUTES.LIST}?${queryParams}` : COMENTARIO_ROUTES.LIST;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener comentarios de una habitación específica
  getByHabitacion: async (habitacionId, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams 
        ? `${COMENTARIO_ROUTES.GET_BY_HABITACION(habitacionId)}?${queryParams}`
        : COMENTARIO_ROUTES.GET_BY_HABITACION(habitacionId);
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo comentario
  create: async (comentarioData) => {
    try {
      const response = await apiHelper.post(COMENTARIO_ROUTES.CREATE, comentarioData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar comentario
  update: async (id, comentarioData) => {
    try {
      const response = await apiHelper.put(COMENTARIO_ROUTES.UPDATE(id), comentarioData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eliminar comentario
  delete: async (id) => {
    try {
      const response = await apiHelper.delete(COMENTARIO_ROUTES.DELETE(id));
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener mis comentarios
  getMisComentarios: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = queryParams 
        ? `${COMENTARIO_ROUTES.MIS_COMENTARIOS}?${queryParams}`
        : COMENTARIO_ROUTES.MIS_COMENTARIOS;
      const response = await apiHelper.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Obtener estadísticas de comentarios de una habitación
  getEstadisticasHabitacion: async (habitacionId) => {
    try {
      const response = await apiHelper.get(
        `${COMENTARIO_ROUTES.GET_BY_HABITACION(habitacionId)}/estadisticas`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Verificar si el usuario puede comentar una habitación
  verificarPuedeComentir: async (habitacionId) => {
    try {
      const response = await apiHelper.get(
        `${COMENTARIO_ROUTES.LIST}/verificar-puede-comentar/${habitacionId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Reportar comentario (Admin)
  reportar: async (id, motivo) => {
    try {
      const response = await apiHelper.post(
        `${COMENTARIO_ROUTES.LIST}/${id}/reportar`,
        { motivo }
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default comentariosService;