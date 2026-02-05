// frontend/src/hooks/useReservas.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchReservas,
  fetchReservaById,
  fetchMisReservas,
  fetchReservasActivas,
  fetchReservasPendientes,
  createReserva,
  updateReserva,
  cancelReserva,
  confirmarReserva,
  checkInReserva,
  checkOutReserva,
  verificarDisponibilidad,
  calcularPrecio,
  setReservaSeleccionada,
} from '../redux/slices/reservasSlice';

export const useReservas = () => {
  const dispatch = useDispatch();
  
  const {
    reservas,
    misReservas,
    reservaSeleccionada,
    reservasActivas,
    reservasPendientes,
    loading,
    error,
    paginacion,
  } = useSelector((state) => state.reservas);

  // Cargar todas las reservas (Admin)
  const cargarReservas = async (params = {}) => {
    try {
      await dispatch(fetchReservas(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar reserva por ID
  const cargarReservaPorId = async (id) => {
    try {
      await dispatch(fetchReservaById(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar mis reservas
  const cargarMisReservas = async (params = {}) => {
    try {
      await dispatch(fetchMisReservas(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar reservas activas
  const cargarReservasActivas = async () => {
    try {
      await dispatch(fetchReservasActivas()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar reservas pendientes
  const cargarReservasPendientes = async () => {
    try {
      await dispatch(fetchReservasPendientes()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Crear nueva reserva
  const crearReserva = async (reservaData) => {
    try {
      const result = await dispatch(createReserva(reservaData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Actualizar reserva
  const actualizarReserva = async (id, data) => {
    try {
      await dispatch(updateReserva({ id, data })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (id, motivo = null) => {
    try {
      await dispatch(cancelReserva({ id, motivo })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Confirmar reserva (Admin)
  const confirmar = async (id) => {
    try {
      await dispatch(confirmarReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Check-in
  const checkIn = async (id) => {
    try {
      await dispatch(checkInReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Check-out
  const checkOut = async (id) => {
    try {
      await dispatch(checkOutReserva(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Verificar disponibilidad
  const verificarDisponibilidadHabitacion = async (habitacionId, fechaInicio, fechaFin) => {
    try {
      const result = await dispatch(verificarDisponibilidad({
        habitacionId,
        fechaInicio,
        fechaFin,
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Calcular precio de reserva
  const calcularPrecioReserva = async (habitacionId, fechaInicio, fechaFin, cantidadPersonas = null) => {
    try {
      const result = await dispatch(calcularPrecio({
        habitacionId,
        fechaInicio,
        fechaFin,
        cantidadPersonas,
      })).unwrap();
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Seleccionar reserva
  const seleccionarReserva = (reserva) => {
    dispatch(setReservaSeleccionada(reserva));
  };

  return {
    // Estado
    reservas,
    misReservas,
    reservaSeleccionada,
    reservasActivas,
    reservasPendientes,
    loading,
    error,
    paginacion,
    
    // Funciones
    cargarReservas,
    cargarReservaPorId,
    cargarMisReservas,
    cargarReservasActivas,
    cargarReservasPendientes,
    crearReserva,
    actualizarReserva,
    cancelarReserva,
    confirmar,
    checkIn,
    checkOut,
    verificarDisponibilidadHabitacion,
    calcularPrecioReserva,
    seleccionarReserva,
  };
};

export default useReservas;