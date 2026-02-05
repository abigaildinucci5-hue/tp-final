/**
 * Utilidades para manejo de fechas
 */

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFecha = (fecha) => {
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

/**
 * Formatea una fecha en formato YYYY-MM-DD
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha formateada
 */
export const formatearFechaISO = (fecha) => {
  const date = new Date(fecha);
  return date.toISOString().split('T')[0];
};

/**
 * Formatea una fecha con hora en formato DD/MM/YYYY HH:mm
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Fecha con hora formateada
 */
export const formatearFechaHora = (fecha) => {
  const date = new Date(fecha);
  const dia = String(date.getDate()).padStart(2, '0');
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const anio = date.getFullYear();
  const horas = String(date.getHours()).padStart(2, '0');
  const minutos = String(date.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
};

/**
 * Obtiene el nombre del mes
 * @param {number} mes - Número del mes (0-11)
 * @returns {string} Nombre del mes
 */
export const obtenerNombreMes = (mes) => {
  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return meses[mes];
};

/**
 * Obtiene el nombre del día de la semana
 * @param {number} dia - Número del día (0-6)
 * @returns {string} Nombre del día
 */
export const obtenerNombreDia = (dia) => {
  const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  return dias[dia];
};

/**
 * Calcula la diferencia en días entre dos fechas
 * @param {Date|string} fecha1 - Primera fecha
 * @param {Date|string} fecha2 - Segunda fecha
 * @returns {number} Diferencia en días
 */
export const diferenciaEnDias = (fecha1, fecha2) => {
  const date1 = new Date(fecha1);
  const date2 = new Date(fecha2);
  const diffTime = Math.abs(date2 - date1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Suma días a una fecha
 * @param {Date|string} fecha - Fecha base
 * @param {number} dias - Días a sumar
 * @returns {Date} Nueva fecha
 */
export const sumarDias = (fecha, dias) => {
  const date = new Date(fecha);
  date.setDate(date.getDate() + dias);
  return date;
};

/**
 * Resta días a una fecha
 * @param {Date|string} fecha - Fecha base
 * @param {number} dias - Días a restar
 * @returns {Date} Nueva fecha
 */
export const restarDias = (fecha, dias) => {
  return sumarDias(fecha, -dias);
};

/**
 * Verifica si una fecha es hoy
 * @param {Date|string} fecha - Fecha a verificar
 * @returns {boolean} True si es hoy
 */
export const esHoy = (fecha) => {
  const date = new Date(fecha);
  const hoy = new Date();
  return date.toDateString() === hoy.toDateString();
};

/**
 * Verifica si una fecha es pasada
 * @param {Date|string} fecha - Fecha a verificar
 * @returns {boolean} True si es pasada
 */
export const esFechaPasada = (fecha) => {
  const date = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return date < hoy;
};

/**
 * Verifica si una fecha es futura
 * @param {Date|string} fecha - Fecha a verificar
 * @returns {boolean} True si es futura
 */
export const esFechaFutura = (fecha) => {
  const date = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  return date > hoy;
};

/**
 * Obtiene el primer día del mes
 * @param {Date|string} fecha - Fecha de referencia
 * @returns {Date} Primer día del mes
 */
export const primerDiaMes = (fecha) => {
  const date = new Date(fecha);
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Obtiene el último día del mes
 * @param {Date|string} fecha - Fecha de referencia
 * @returns {Date} Último día del mes
 */
export const ultimoDiaMes = (fecha) => {
  const date = new Date(fecha);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Formatea una fecha de forma relativa (hace 2 días, etc.)
 * @param {Date|string} fecha - Fecha a formatear
 * @returns {string} Texto relativo
 */
export const formatearRelativo = (fecha) => {
  const date = new Date(fecha);
  const ahora = new Date();
  const diff = ahora - date;
  const segundos = Math.floor(diff / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);

  if (dias > 7) return formatearFecha(fecha);
  if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'hace un momento';
};

/**
 * Valida si una cadena es una fecha válida
 * @param {string} fecha - Cadena a validar
 * @returns {boolean} True si es válida
 */
export const esDateValida = (fecha) => {
  const date = new Date(fecha);
  return date instanceof Date && !isNaN(date);
};