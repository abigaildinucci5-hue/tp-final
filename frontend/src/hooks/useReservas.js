// frontend/src/hooks/useReservas.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  obtenerReservas,
  obtenerReserva,
  crearReserva,
  modificarReserva,
  cancelarReserva,
  obtenerHistorial,
  clearReservaSeleccionada,
  clearError,
} from '../redux/slices/reservasSlice';

export const useReservas = () => {
  const dispatch = useDispatch();
  
  const {
    reservas,
    reservaSeleccionada,
    loading,
    error,
  } = useSelector((state) => state.reservas);

  // Cargar todas las reservas
  const cargarReservas = async (params = {}) => {
    try {
      await dispatch(obtenerReservas(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar reserva por ID
  const cargarReservaPorId = async (id) => {
    try {
      await dispatch(obtenerReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Crear nueva reserva
  const crearReservaFunc = async (reservaData) => {
    try {
      const result = await dispatch(crearReserva(reservaData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.mensaje || error };
    }
  };

  // Actualizar reserva
  const actualizarReserva = async (id, data) => {
    try {
      await dispatch(modificarReserva({ idReserva: id, datos: data })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cancelar reserva
  const cancelarReservaFunc = async (id, motivo = null) => {
    try {
      await dispatch(cancelarReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    // Estado
    reservas,
    reservaSeleccionada,
    loading,
    error,
    
    // Funciones
    cargarReservas,
    cargarReservaPorId,
    crearReserva: crearReservaFunc,
    actualizarReserva,
    cancelarReserva: cancelarReservaFunc,
    cargarHistorial: () => dispatch(obtenerHistorial()),
    clearError: () => dispatch(clearError()),
    clearReservaSeleccionada: () => dispatch(clearReservaSeleccionada()),
  };
};

export default useReservas;