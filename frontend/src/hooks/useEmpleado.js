// frontend/src/hooks/useEmpleado.js - Hook personalizado para funcionalidades de empleado/recepcionista

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { api } from '../servicios/api';

/**
 * Hook para manejar funcionalidades del panel de empleado
 */
export const useEmpleado = () => {
  const { usuario } = useAuth();
  const [reservasHoy, setReservasHoy] = useState([]);
  const [estadoHabitaciones, setEstadoHabitaciones] = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Cargar reservas del día
  const cargarReservasHoy = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empleado/reservas/hoy');
      if (response.data.exito) {
        setReservasHoy(response.data.reservas || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error cargando reservas del día:', err);
      setError('Error cargando reservas del día');
    } finally {
      setLoading(false);
    }
  };

  // Cargar estado de habitaciones
  const cargarEstadoHabitaciones = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empleado/habitaciones/estado');
      if (response.data.exito) {
        setEstadoHabitaciones(response.data.detalles || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error cargando estado de habitaciones:', err);
      setError('Error cargando estado de habitaciones');
    } finally {
      setLoading(false);
    }
  };

  // Cargar solicitudes pendientes
  const cargarSolicitudesPendientes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/empleado/solicitudes/pendientes');
      if (response.data.exito) {
        setSolicitudes(response.data.solicitudes || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      setError('Error cargando solicitudes');
    } finally {
      setLoading(false);
    }
  };

  // Realizar check-in
  const hacerCheckIn = async (reservaId, observaciones = '') => {
    try {
      const response = await api.post(`/empleado/reservas/${reservaId}/check-in`, {
        observaciones,
      });

      if (response.data.exito) {
        // Actualizar lista de reservas
        await cargarReservasHoy();
        return { success: true, mensaje: 'Check-in realizado exitosamente' };
      }
    } catch (err) {
      console.error('Error realizando check-in:', err);
      return { success: false, error: err.response?.data?.error || 'Error realizando check-in' };
    }
  };

  // Realizar check-out
  const hacerCheckOut = async (reservaId, observaciones = '') => {
    try {
      const response = await api.post(`/empleado/reservas/${reservaId}/check-out`, {
        observaciones,
      });

      if (response.data.exito) {
        // Actualizar lista de reservas
        await cargarReservasHoy();
        return { 
          success: true, 
          mensaje: 'Check-out realizado exitosamente',
          puntosGanados: response.data.puntosGanados
        };
      }
    } catch (err) {
      console.error('Error realizando check-out:', err);
      return { success: false, error: err.response?.data?.error || 'Error realizando check-out' };
    }
  };

  // Cambiar estado de habitación
  const cambiarEstadoHabitacion = async (habitacionId, nuevoEstado) => {
    try {
      const response = await api.put(`/empleado/habitaciones/${habitacionId}/estado`, {
        estado: nuevoEstado,
      });

      if (response.data.exito) {
        // Actualizar estado local
        await cargarEstadoHabitaciones();
        return { success: true, mensaje: 'Estado actualizado exitosamente' };
      }
    } catch (err) {
      console.error('Error cambiando estado:', err);
      return { success: false, error: err.response?.data?.error || 'Error cambiando estado' };
    }
  };

  // Resolver solicitud
  const resolverSolicitud = async (solicitudId, observaciones = '') => {
    try {
      const response = await api.post(`/empleado/solicitudes/${solicitudId}/resolver`, {
        observaciones,
      });

      if (response.data.exito) {
        // Actualizar lista de solicitudes
        await cargarSolicitudesPendientes();
        return { success: true, mensaje: 'Solicitud resuelta exitosamente' };
      }
    } catch (err) {
      console.error('Error resolviendo solicitud:', err);
      return { success: false, error: err.response?.data?.error || 'Error resolviendo solicitud' };
    }
  };

  // Cargar solicitudes con filtros
  const cargarSolicitudes = async (estado = null) => {
    try {
      const params = estado ? { estado } : {};
      const response = await api.get('/empleado/solicitudes/pendientes', { params });
      if (response.data.exito) {
        setSolicitudes(response.data.solicitudes || []);
        setError(null);
      }
    } catch (err) {
      console.error('Error cargando solicitudes:', err);
      setError('Error cargando solicitudes');
    }
  };

  // Crear solicitud especial
  const crearSolicitud = async (reservaId, tipo, descripcion, prioridad = 'media') => {
    try {
      const response = await api.post('/empleado/solicitudes', {
        idReserva: reservaId,
        tipo,
        descripcion,
        prioridad,
      });

      if (response.data.exito) {
        await cargarSolicitudesPendientes();
        return { success: true, solicitudId: response.data.solicitudId };
      }
    } catch (err) {
      console.error('Error creando solicitud:', err);
      return { success: false, error: err.response?.data?.error || 'Error creando solicitud' };
    }
  };

  // Obtener historial de un huésped
  const obtenerHistorialHuesped = async (usuarioId) => {
    try {
      const response = await api.get(`/empleado/historial-huesped/${usuarioId}`);
      if (response.data.exito) {
        return response.data.historial || [];
      }
    } catch (err) {
      console.error('Error obteniendo historial:', err);
      return [];
    }
  };

  // Obtener reporte de huéspedes
  const obtenerReporteHuespedes = async (fechaDesde = null, fechaHasta = null) => {
    try {
      const params = {};
      if (fechaDesde) params.fechaDesde = fechaDesde;
      if (fechaHasta) params.fechaHasta = fechaHasta;

      const response = await api.get('/empleado/reporte-huespedes', { params });
      if (response.data.exito) {
        return response.data.huespedes || [];
      }
    } catch (err) {
      console.error('Error obteniendo reporte:', err);
      return [];
    }
  };

  // Refrescar todos los datos
  const refrescaRTodos = async () => {
    try {
      setRefreshing(true);
      await Promise.all([
        cargarReservasHoy(),
        cargarEstadoHabitaciones(),
        cargarSolicitudesPendientes(),
      ]);
    } catch (err) {
      console.error('Error refrescando datos:', err);
      setError('Error refrescando datos');
    } finally {
      setRefreshing(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (usuario?.rol === 'empleado' || usuario?.rol === 'admin') {
      refrescaRTodos();
    }
  }, [usuario?.id_usuario]);

  return {
    // Estados
    reservasHoy,
    estadoHabitaciones,
    solicitudes,
    loading,
    error,
    refreshing,

    // Métodos
    cargarReservasHoy,
    cargarEstadoHabitaciones,
    cargarSolicitudesPendientes,
    hacerCheckIn,
    hacerCheckOut,
    cambiarEstadoHabitacion,
    resolverSolicitud,
    cargarSolicitudes,
    crearSolicitud,
    obtenerHistorialHuesped,
    obtenerReporteHuespedes,
    refrescaRTodos,
  };
};

export default useEmpleado;
