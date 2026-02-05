// frontend/src/hooks/useHabitaciones.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchHabitaciones,
  fetchHabitacionById,
  buscarHabitacionesDisponibles,
  buscarHabitaciones,
  fetchCategorias,
  fetchHabitacionesPopulares,
  setFiltros,
  clearFiltros,
  setHabitacionSeleccionada,
} from '../redux/slices/habitacionesSlice';

export const useHabitaciones = () => {
  const dispatch = useDispatch();
  
  const {
    habitaciones,
    habitacionSeleccionada,
    habitacionesDisponibles,
    habitacionesPopulares,
    categorias,
    loading,
    error,
    filtros,
    paginacion,
  } = useSelector((state) => state.habitaciones);

  // Cargar habitaciones al montar
  const cargarHabitaciones = async (params = {}) => {
    try {
      await dispatch(fetchHabitaciones(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar habitación por ID
  const cargarHabitacionPorId = async (id) => {
    try {
      await dispatch(fetchHabitacionById(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Buscar habitaciones disponibles
  const buscarDisponibles = async (fechaInicio, fechaFin, cantidadPersonas = null) => {
    try {
      await dispatch(buscarHabitacionesDisponibles({
        fechaInicio,
        fechaFin,
        cantidadPersonas,
      })).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Buscar con filtros
  const buscarConFiltros = async (filtrosPersonalizados) => {
    try {
      await dispatch(buscarHabitaciones(filtrosPersonalizados)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar categorías
  const cargarCategorias = async () => {
    try {
      await dispatch(fetchCategorias()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar habitaciones populares
  const cargarPopulares = async (limit = 5) => {
    try {
      await dispatch(fetchHabitacionesPopulares(limit)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Actualizar filtros
  const actualizarFiltros = (nuevosFiltros) => {
    dispatch(setFiltros(nuevosFiltros));
  };

  // Limpiar filtros
  const limpiarFiltros = () => {
    dispatch(clearFiltros());
  };

  // Seleccionar habitación
  const seleccionarHabitacion = (habitacion) => {
    dispatch(setHabitacionSeleccionada(habitacion));
  };

  return {
    // Estado
    habitaciones,
    habitacionSeleccionada,
    habitacionesDisponibles,
    habitacionesPopulares,
    categorias,
    loading,
    error,
    filtros,
    paginacion,
    
    // Funciones
    cargarHabitaciones,
    cargarHabitacionPorId,
    buscarDisponibles,
    buscarConFiltros,
    cargarCategorias,
    cargarPopulares,
    actualizarFiltros,
    limpiarFiltros,
    seleccionarHabitacion,
  };
};

export default useHabitaciones;