import api from './api';

/**
 * Obtener todas las habitaciones con filtros
 */
export const obtenerHabitaciones = async (filtros = {}) => {
  const params = new URLSearchParams();
  
  if (filtros.tipo) params.append('tipo', filtros.tipo);
  if (filtros.precioMin) params.append('precioMin', filtros.precioMin);
  if (filtros.precioMax) params.append('precioMax', filtros.precioMax);
  if (filtros.capacidad) params.append('capacidad', filtros.capacidad);
  if (filtros.vista) params.append('vista', filtros.vista);
  if (filtros.disponible !== undefined) params.append('disponible', filtros.disponible);

  const queryString = params.toString();
  const url = queryString ? `/habitaciones?${queryString}` : '/habitaciones';
  
  return await api.get(url);
};

/**
 * Obtener detalles de una habitación
 */
export const obtenerHabitacion = async (idHabitacion) => {
  if (!idHabitacion) return null;
  return await api.get(`/habitaciones/${idHabitacion}`);
};

/**
 * ✅ Obtener habitaciones populares (La que usa el Home)
 */
// ✅ Esta es la función que evita el 404 en el Home
export const obtenerHabitacionesPopulares = async (limite = 8) => {
  return await api.get(`/habitaciones?limit=${limite}`);
};

export const obtenerTiposHabitacion = async () => await api.get('/habitaciones/tipos/lista');

export const toggleFavorito = async (id) => await api.post(`/habitaciones/${id}/favorito`);

export const obtenerFavoritos = async () => await api.get('/habitaciones/favoritos/mis-favoritos');

export const buscarHabitaciones = async (busqueda) => await api.get('/habitaciones', { params: { busqueda } });

/**
 * Buscar habitaciones disponibles por fechas y personas
 */
export const buscarHabitacionesDisponibles = async (fechaInicio, fechaFin, cantidadPersonas) => {
  const params = { fechaInicio, fechaFin };
  if (cantidadPersonas) params.cantidadPersonas = cantidadPersonas;
  return await api.get('/habitaciones/disponibles', { params });
};

/**
 * Obtener categorías de habitaciones
 */
export const obtenerCategorias = async () => {
  return await api.get('/habitaciones/categorias');
};