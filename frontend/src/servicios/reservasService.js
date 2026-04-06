// src/servicios/reservasService.js - Servicios de reservas
import api from './api';

/**
 * Obtener todas las reservas del usuario
 */
export const obtenerReservas = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.estado) params.append('estado', filtros.estado);
  if (filtros.fechaDesde) params.append('fechaDesde', filtros.fechaDesde);
  if (filtros.fechaHasta) params.append('fechaHasta', filtros.fechaHasta);
  const queryString = params.toString();
  const url = queryString ? `/reservas?${queryString}` : '/reservas';
  return await api.get(url);
};

/**
 * Obtener detalles de una reserva
 */
export const obtenerReserva = async (idReserva) => {
  const reserva = await api.get(`/reservas/${idReserva}`);
  // El interceptor ya extrajo .data, entonces 'reserva' ES el objeto de la reserva
  // Pero el backend devuelve { exito, data: reservaObj }, así que:
  const datos = reserva?.data || reserva;
  return {
    ...datos,
    fecha_inicio: datos.fecha_entrada,
    fecha_fin: datos.fecha_salida,
    cantidad_personas: datos.numero_huespedes || 0,
    habitacion: {
      id_habitacion: datos.id_habitacion,
      numero_habitacion: datos.numero_habitacion,
      imagen_principal: datos.imagen_principal,
      descripcion_detallada: datos.descripcion_detallada,
      vista: datos.vista,
      nombre: datos.tipo_habitacion
    }
  };
};

/**
 * Crear nueva reserva
 */
export const crearReserva = async (datosReserva) => {
  return await api.post('/reservas', datosReserva);
};

/**
 * Modificar reserva
 */
export const modificarReserva = async (idReserva, datos) => {
  return await api.put(`/reservas/${idReserva}`, datos);
};

/**
 * Cancelar reserva
 */
export const cancelarReserva = async (idReserva) => {
  const response = await api.delete(`/reservas/${idReserva}`);
  return {
    success: response?.exito ?? true,
    ...response
  };
};

/**
 * Obtener historial de reservas
 */
export const obtenerHistorial = async () => {
  const response = await api.get('/reservas/usuario/historial');
  console.log('📡 API Response completa:', response);
  return response; // ✅ El interceptor ya extrajo .data automáticamente
};

/**
 * Confirmar reserva (Solo empleado/admin)
 */
export const confirmar = async (idReserva) => {
  const response = await api.put(`/reservas/${idReserva}/confirmar`);
  return response; // NO response.data
};

export const confirmarReserva = async (idReserva) => {
  const response = await api.put(`/reservas/${idReserva}/confirmar`);
  return response; // NO response.data
};

/**
 * Completar reserva (Solo empleado/admin)
 */
export const completarReserva = async (idReserva) => {
  return await api.put(`/reservas/${idReserva}/completar`);
};

export const cancelarReservaEmpleado = async (idReserva) => {
  return await api.delete(`/reservas/${idReserva}`);
};

/**
 * Cambiar estado de reserva (Admin/Empleado)
 */
export const cambiarEstado = async (idReserva, nuevoEstado) => {
  const response = await api.put(`/reservas/${idReserva}`, { estado: nuevoEstado });
  return response.data;
};

/** Eliminar reserva */
export const eliminarReserva = async (idReserva) => {
  return await api.delete(`/reservas/${idReserva}`, {
    params: { accion: 'eliminar' }
  });
};

// Alias default
const reservasService = {
  obtenerReservas,
  obtenerReserva,
  crearReserva,
  modificarReserva,
  cancelarReserva,
  obtenerHistorial,
  confirmarReserva,
  confirmar,
  completarReserva,
  cancelarReservaEmpleado,
  cambiarEstado,
  eliminarReserva,
};

export default reservasService;