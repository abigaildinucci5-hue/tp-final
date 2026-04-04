/**
 * Utilitarios para formatear fechas y horas
 * Re-exporta desde fechas.js y agrega funciones adicionales
 */

export { 
  formatearFecha, 
  formatearFechaISO, 
  formatearFechaHora,
  obtenerNombreMes,
  obtenerNombreDia,
  diferenciaEnDias,
  sumarDias,
  restarDias,
  esHoy,
  esFechaPasada,
  esFechaFutura,
  primerDiaMes
} from './fechas';

/**
 * Formatea una hora en formato HH:mm
 * @param {string} hora - Hora en formato HH:mm:ss
 * @returns {string} Hora formateada en HH:mm
 */
export const formatearHora = (hora) => {
  if (!hora) return 'N/A';
  try {
    // Si es un string con formato HH:mm:ss, extraer HH:mm
    if (typeof hora === 'string' && hora.includes(':')) {
      return hora.substring(0, 5); // HH:mm
    }
    return hora;
  } catch (error) {
    return 'N/A';
  }
};

/**
 * Formatea una fecha completa con hora legible
 * @param {Date|string} fecha - Fecha y hora a formatear
 * @returns {string} Fecha y hora formateadas
 */
export const formatearFechaCompleta = (fecha) => {
  if (!fecha) return 'N/A';
  try {
    const date = new Date(fecha);
    const dia = String(date.getDate()).padStart(2, '0');
    const mes = String(date.getMonth() + 1).padStart(2, '0');
    const anio = date.getFullYear();
    const horas = String(date.getHours()).padStart(2, '0');
    const minutos = String(date.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  } catch (error) {
    return 'N/A';
  }
};
