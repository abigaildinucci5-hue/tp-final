// frontend/src/hooks/useReservas.js
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  obtenerReservas,
  obtenerReserva,
  obtenerHistorial,
  crearReserva as crearReservaAction, // Renombrado para evitar conflicto con el nombre de la función local
  modificarReserva,
  cancelarReserva as cancelarReservaAction,
  clearReservaSeleccionada
} from '../redux/slices/reservasSlice';

export const useReservas = () => {
  const dispatch = useDispatch();
  
  // Extraemos del estado de Redux (asegúrate que el nombre coincida con tu store)
  const {
    reservas,
    reservaSeleccionada,
    historial,
    loading,
    error
  } = useSelector((state) => state.reservas);

  // Cargar todas las reservas
  const cargarReservas = useCallback(async (filtros = {}) => {
    try {
      await dispatch(obtenerReservas(filtros)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  // Cargar reserva por ID
  const cargarReservaPorId = useCallback(async (id) => {
    try {
      await dispatch(obtenerReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  // Crear nueva reserva
  const crearReserva = useCallback(async (reservaData) => {
    try {
      const result = await dispatch(crearReservaAction(reservaData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error("Error en Hook crearReserva:", error);
      return { success: false, error };
    }
  }, [dispatch]);

  // Actualizar/Modificar reserva
  const actualizarReserva = useCallback(async (idReserva, datos) => {
    try {
      await dispatch(modificarReserva({ idReserva, datos })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  // Cancelar reserva
  const cancelarReserva = useCallback(async (idReserva) => {
    try {
      await dispatch(cancelarReservaAction(idReserva)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [dispatch]);

  // Obtener historial
  const cargarHistorial = useCallback(async () => {
    try {
      console.log('🔄 Iniciando cargarHistorial...');
      const result = await dispatch(obtenerHistorial()).unwrap();
      console.log('✅ Historial obtenido:', result);
      return { success: true };
    } catch (error) {
      console.error('❌ Error cargarHistorial:', error);
      return { success: false, error };
    }
  }, [dispatch]);

  // Limpiar selección
  const limpiarSeleccion = useCallback(() => {
    dispatch(clearReservaSeleccionada());
  }, [dispatch]);

  return {
    // Estado
    reservas,
    reservaSeleccionada,
    historial,
    loading,
    error,
    
    // Funciones
    cargarReservas,
    cargarReservaPorId,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    cargarHistorial,
    limpiarSeleccion
  };
};

export default useReservas;