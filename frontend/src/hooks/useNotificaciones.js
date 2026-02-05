// frontend/src/hooks/useNotificaciones.js
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchNotificaciones,
  fetchNotificacionesNoLeidas,
  fetchCountNoLeidas,
  marcarNotificacionLeida,
  marcarTodasLeidas,
  deleteNotificacion,
  addNotificacion,
} from '../redux/slices/notificacionesSlice';

export const useNotificaciones = () => {
  const dispatch = useDispatch();
  
  const {
    notificaciones,
    notificacionesNoLeidas,
    countNoLeidas,
    loading,
    error,
  } = useSelector((state) => state.notificaciones);

  // Cargar notificaciones al montar
  useEffect(() => {
    cargarCountNoLeidas();
  }, []);

  // Cargar todas las notificaciones
  const cargarNotificaciones = async (params = {}) => {
    try {
      await dispatch(fetchNotificaciones(params)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar notificaciones no leídas
  const cargarNoLeidas = async () => {
    try {
      await dispatch(fetchNotificacionesNoLeidas()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Cargar contador de no leídas
  const cargarCountNoLeidas = async () => {
    try {
      await dispatch(fetchCountNoLeidas()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Marcar como leída
  const marcarLeida = async (id) => {
    try {
      await dispatch(marcarNotificacionLeida(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Marcar todas como leídas
  const marcarTodas = async () => {
    try {
      await dispatch(marcarTodasLeidas()).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Eliminar notificación
  const eliminarNotificacion = async (id) => {
    try {
      await dispatch(deleteNotificacion(id)).unwrap();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  // Agregar notificación (para notificaciones en tiempo real)
  const agregarNotificacion = (notificacion) => {
    dispatch(addNotificacion(notificacion));
  };

  return {
    // Estado
    notificaciones,
    notificacionesNoLeidas,
    countNoLeidas,
    loading,
    error,
    
    // Funciones
    cargarNotificaciones,
    cargarNoLeidas,
    cargarCountNoLeidas,
    marcarLeida,
    marcarTodas,
    eliminarNotificacion,
    agregarNotificacion,
  };
};

export default useNotificaciones;