// frontend/src/redux/thunks/habitacionesThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import habitacionesService from '../../servicios/habitacionesService';
import { showSuccessToast, showErrorToast } from '../slices/uiSlice';

// Buscar habitaciones con notificaciones
export const buscarHabitacionesConNotificacion = createAsyncThunk(
  'habitaciones/buscarConNotificacion',
  async (filtros, { dispatch, rejectWithValue }) => {
    try {
      const response = await habitacionesService.buscar(filtros);
      
      if (!response || response.length === 0) {
        dispatch(showErrorToast('No se encontraron habitaciones con los filtros seleccionados'));
      } else {
        dispatch(showSuccessToast(`Se encontraron ${response.length} habitaciones`));
      }
      
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al buscar habitaciones'));
      return rejectWithValue(error.message);
    }
  }
);

// Crear habitación con notificación (Admin)
export const crearHabitacionConNotificacion = createAsyncThunk(
  'habitaciones/crearConNotificacion',
  async (habitacionData, { dispatch, rejectWithValue }) => {
    try {
      const response = await habitacionesService.create(habitacionData);
      dispatch(showSuccessToast('Habitación creada exitosamente'));
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al crear habitación'));
      return rejectWithValue(error.message);
    }
  }
);

// Actualizar habitación con notificación (Admin)
export const actualizarHabitacionConNotificacion = createAsyncThunk(
  'habitaciones/actualizarConNotificacion',
  async ({ id, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await habitacionesService.update(id, data);
      dispatch(showSuccessToast('Habitación actualizada exitosamente'));
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al actualizar habitación'));
      return rejectWithValue(error.message);
    }
  }
);

// Eliminar habitación con notificación (Admin)
export const eliminarHabitacionConNotificacion = createAsyncThunk(
  'habitaciones/eliminarConNotificacion',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await habitacionesService.delete(id);
      dispatch(showSuccessToast('Habitación eliminada exitosamente'));
      return id;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al eliminar habitación'));
      return rejectWithValue(error.message);
    }
  }
);

export default {
  buscarHabitacionesConNotificacion,
  crearHabitacionConNotificacion,
  actualizarHabitacionConNotificacion,
  eliminarHabitacionConNotificacion,
};