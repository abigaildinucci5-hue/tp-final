// frontend/src/redux/thunks/reservasThunks.js
// Los thunks principales ya están en reservasSlice.js
// Este archivo contiene thunks adicionales con lógica compleja

import { createAsyncThunk } from '@reduxjs/toolkit';
import reservasService from '../../servicios/reservasService';
import { showSuccessToast, showErrorToast } from '../slices/uiSlice';

// Crear reserva con notificaciones
export const crearReservaConNotificacion = createAsyncThunk(
  'reservas/crearConNotificacion',
  async (reservaData, { dispatch, rejectWithValue }) => {
    try {
      const response = await reservasService.create(reservaData);
      
      // Mostrar toast de éxito
      dispatch(showSuccessToast('¡Reserva creada exitosamente!'));
      
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al crear reserva'));
      return rejectWithValue(error.message);
    }
  }
);

// Cancelar reserva con notificaciones
export const cancelarReservaConNotificacion = createAsyncThunk(
  'reservas/cancelarConNotificacion',
  async ({ id, motivo }, { dispatch, rejectWithValue }) => {
    try {
      const response = await reservasService.cancel(id, motivo);
      dispatch(showSuccessToast('Reserva cancelada correctamente'));
      
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al cancelar reserva'));
      return rejectWithValue(error.message);
    }
  }
);

// Confirmar reserva con notificaciones (Admin)
export const confirmarReservaConNotificacion = createAsyncThunk(
  'reservas/confirmarConNotificacion',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await reservasService.confirmar(id);
      dispatch(showSuccessToast('Reserva confirmada exitosamente'));
      
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al confirmar reserva'));
      return rejectWithValue(error.message);
    }
  }
);

// Check-in con notificaciones
export const checkInConNotificacion = createAsyncThunk(
  'reservas/checkInConNotificacion',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await reservasService.checkIn(id);
      dispatch(showSuccessToast('Check-in realizado exitosamente. ¡Disfruta tu estadía!'));
      
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al realizar check-in'));
      return rejectWithValue(error.message);
    }
  }
);

// Check-out con notificaciones
export const checkOutConNotificacion = createAsyncThunk(
  'reservas/checkOutConNotificacion',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const response = await reservasService.checkOut(id);
      dispatch(showSuccessToast('Check-out realizado. ¡Esperamos verte pronto!'));
      return response;
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al realizar check-out'));
      return rejectWithValue(error.message);
    }
  }
);

// Verificar disponibilidad y calcular precio
export const verificarYCalcular = createAsyncThunk(
  'reservas/verificarYCalcular',
  async ({ habitacionId, fechaInicio, fechaFin, cantidadPersonas }, { dispatch, rejectWithValue }) => {
    try {
      // Verificar disponibilidad
      const disponibilidad = await reservasService.verificarDisponibilidad(
        habitacionId,
        fechaInicio,
        fechaFin
      );
      
      if (!disponibilidad.disponible) {
        dispatch(showErrorToast('La habitación no está disponible para las fechas seleccionadas'));
        return rejectWithValue('Habitación no disponible');
      }
      
      // Calcular precio
      const precio = await reservasService.calcularPrecio(
        habitacionId,
        fechaInicio,
        fechaFin,
        cantidadPersonas
      );
      
      return {
        disponible: true,
        precio: precio,
      };
    } catch (error) {
      dispatch(showErrorToast(error.message || 'Error al verificar disponibilidad'));
      return rejectWithValue(error.message);
    }
  }
);

export default {
  crearReservaConNotificacion,
  cancelarReservaConNotificacion,
  confirmarReservaConNotificacion,
  checkInConNotificacion,
  checkOutConNotificacion,
  verificarYCalcular,
};