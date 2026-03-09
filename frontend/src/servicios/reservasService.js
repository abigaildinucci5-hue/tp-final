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
  
  const response = await api.get(url);
  return response.data;
};

/**
 * Obtener detalles de una reserva
 */
export const obtenerReserva = async (idReserva) => {
  const response = await api.get(`/reservas/${idReserva}`);
  return response.data;
};

/**
 * Crear nueva reserva
 */
export const crearReserva = async (datosReserva) => {
  const response = await api.post('/reservas', datosReserva);
  return response.data;
};

/**
 * Modificar reserva
 */
export const modificarReserva = async (idReserva, datos) => {
  const response = await api.put(`/reservas/${idReserva}`, datos);
  return response.data;
};

/**
 * Cancelar reserva
 */
export const cancelarReserva = async (idReserva) => {
  const response = await api.delete(`/reservas/${idReserva}`);
  return response.data;
};

/**
 * Obtener historial de reservas
 */
export const obtenerHistorial = async () => {
  const response = await api.get('/reservas/usuario/historial');
  return response.data;
};

/**
 * Confirmar reserva (Solo empleado/admin)
 */
export const confirmarReserva = async (idReserva) => {
  const response = await api.put(`/reservas/${idReserva}/confirmar`);
  return response.data;
};