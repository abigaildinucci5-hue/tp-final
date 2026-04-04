// frontend/src/hooks/useReservas.js
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
  const cargarReservas = async (filtros = {}) => {
    try {
      await dispatch(obtenerReservas(filtros)).unwrap();
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
  const crearReserva = async (reservaData) => {
    try {
      // Usamos el nombre correcto que definiste en el Slice
      const result = await dispatch(crearReservaAction(reservaData)).unwrap();
      return { success: true, data: result };
    } catch (error) {
      console.error("Error en Hook crearReserva:", error);
      return { success: false, error };
    }
  };

  // Actualizar/Modificar reserva
  const actualizarReserva = async (idReserva, datos) => {
    try {
      await dispatch(modificarReserva({ idReserva, datos })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cancelar reserva
  const cancelarReserva = async (idReserva) => {
    try {
      await dispatch(cancelarReservaAction(idReserva)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Obtener historial
  const cargarHistorial = async () => {
    try {
      console.log('🔄 Iniciando cargarHistorial...');
      const result = await dispatch(obtenerHistorial()).unwrap();
      console.log('✅ Historial obtenido:', result);
      return { success: true };
    } catch (error) {
      console.error('❌ Error cargarHistorial:', error);
      return { success: false, error };
    }
  };

  // Limpiar selección
  const limpiarSeleccion = () => {
    dispatch(clearReservaSeleccionada());
  };

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