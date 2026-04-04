import api from './api';

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

export const obtenerHabitacion = async (idHabitacion) => {
  if (!idHabitacion) return null;
  return await api.get(`/habitaciones/${idHabitacion}`);
};

export const obtenerHabitacionesPopulares = async () => {
  return await api.get(`/habitaciones`);
};

export const obtenerTiposHabitacion = async () => await api.get('/habitaciones/tipos/lista');

export const toggleFavorito = async (id) => await api.post(`/habitaciones/${id}/favorito`);

export const obtenerFavoritos = async () => await api.get('/habitaciones/favoritos/mis-favoritos');

export const buscarHabitaciones = async (busqueda) => await api.get('/habitaciones', { params: { busqueda } });

export const buscarHabitacionesDisponibles = async (fechaInicio, fechaFin, cantidadPersonas) => {
  const params = { fechaInicio, fechaFin };
  if (cantidadPersonas) params.cantidadPersonas = cantidadPersonas;
  return await api.get('/habitaciones/disponibles', { params });
};

export const obtenerCategorias = async () => {
  return await api.get('/habitaciones/categorias');
};

export const create = async (datos) => {
  return await api.post('/habitaciones', datos);
};

export const update = async (idHabitacion, datos) => {
  console.log('🔧 habitacionesService.update llamado');
  console.log('🔧 id:', idHabitacion);
  console.log('🔧 datos a enviar:', JSON.stringify(datos));
  const resultado = await api.put(`/habitaciones/${idHabitacion}`, datos);
  console.log('🔧 respuesta:', JSON.stringify(resultado));
  return resultado;
};

export const deleteHabitacion = async (idHabitacion) => {
  return await api.delete(`/habitaciones/${idHabitacion}`);
};

// ✅ FIX PRINCIPAL: El objeto default ahora incluye update y delete
// EditarHabitacionScreen llama habitacionesService.update() y habitacionesService.delete()
// pero el export default anterior NO los tenía → por eso no funcionaba guardar/eliminar
const habitacionesService = {
  obtenerHabitaciones,
  obtenerHabitacion,
  obtenerHabitacionesPopulares,
  obtenerTiposHabitacion,
  toggleFavorito,
  obtenerFavoritos,
  buscarHabitaciones,
  buscarHabitacionesDisponibles,
  obtenerCategorias,
  create,
  update,
  delete: deleteHabitacion, // ✅ alias para habitacionesService.delete(id)
};

export default habitacionesService;