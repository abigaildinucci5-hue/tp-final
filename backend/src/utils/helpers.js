// src/utils/helpers.js - Funciones auxiliares
const crypto = require('crypto');

// ====================================
// FORMATEO DE DATOS
// ====================================

/**
 * Formatear fecha a formato legible en español
 */
const formatearFecha = (fecha, incluirHora = false) => {
  const opciones = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  };

  if (incluirHora) {
    opciones.hour = '2-digit';
    opciones.minute = '2-digit';
  }

  return new Date(fecha).toLocaleDateString('es-AR', opciones);
};

/**
 * Formatear fecha corta (DD/MM/YYYY)
 */
const formatearFechaCorta = (fecha) => {
  const f = new Date(fecha);
  const dia = String(f.getDate()).padStart(2, '0');
  const mes = String(f.getMonth() + 1).padStart(2, '0');
  const anio = f.getFullYear();
  return `${dia}/${mes}/${anio}`;
};

/**
 * Formatear moneda argentina
 */
const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

/**
 * Formatear número con separadores de miles
 */
const formatearNumero = (numero) => {
  return new Intl.NumberFormat('es-AR').format(numero);
};

/**
 * Formatear teléfono argentino
 */
const formatearTelefono = (telefono) => {
  // Remover todo excepto números
  const soloNumeros = telefono.replace(/\D/g, '');
  
  // Formato: +54 (223) 123-4567
  if (soloNumeros.length === 10) {
    return `+54 (${soloNumeros.substring(0, 3)}) ${soloNumeros.substring(3, 6)}-${soloNumeros.substring(6)}`;
  }
  
  return telefono;
};

// ====================================
// CÁLCULOS DE FECHAS
// ====================================

/**
 * Calcular número de noches entre dos fechas
 */
const calcularNoches = (fechaEntrada, fechaSalida) => {
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const diferencia = salida - entrada;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Calcular días hasta una fecha
 */
const diasHasta = (fecha) => {
  const hoy = new Date();
  const fechaObjetivo = new Date(fecha);
  const diferencia = fechaObjetivo - hoy;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};

/**
 * Verificar si una fecha es fin de semana
 */
const esFinDeSemana = (fecha) => {
  const dia = new Date(fecha).getDay();
  return dia === 0 || dia === 6; // Domingo o Sábado
};

/**
 * Obtener rango de fechas
 */
const obtenerRangoFechas = (fechaInicio, fechaFin) => {
  const fechas = [];
  const actual = new Date(fechaInicio);
  const fin = new Date(fechaFin);

  while (actual <= fin) {
    fechas.push(new Date(actual));
    actual.setDate(actual.getDate() + 1);
  }

  return fechas;
};

/**
 * Agregar días a una fecha
 */
const agregarDias = (fecha, dias) => {
  const resultado = new Date(fecha);
  resultado.setDate(resultado.getDate() + dias);
  return resultado;
};

// ====================================
// GENERADORES
// ====================================

/**
 * Generar ID único
 */
const generarId = () => {
  return crypto.randomBytes(16).toString('hex');
};

/**
 * Generar código de reserva
 */
const generarCodigoReserva = () => {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  
  for (let i = 0; i < 8; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  
  return codigo;
};

/**
 * Generar código de verificación (6 dígitos)
 */
const generarCodigoVerificacion = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generar slug a partir de texto
 */
const generarSlug = (texto) => {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// ====================================
// VALIDACIONES
// ====================================

/**
 * Validar CUIT/CUIL argentino
 */
const validarCUIL = (cuil) => {
  const cuilLimpio = cuil.replace(/\D/g, '');
  
  if (cuilLimpio.length !== 11) return false;
  
  const multiplicadores = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let suma = 0;
  
  for (let i = 0; i < 10; i++) {
    suma += parseInt(cuilLimpio[i]) * multiplicadores[i];
  }
  
  const digitoVerificador = 11 - (suma % 11);
  const digito = digitoVerificador === 11 ? 0 : digitoVerificador === 10 ? 9 : digitoVerificador;
  
  return digito === parseInt(cuilLimpio[10]);
};

/**
 * Validar DNI argentino
 */
const validarDNI = (dni) => {
  const dniLimpio = dni.replace(/\D/g, '');
  return dniLimpio.length >= 7 && dniLimpio.length <= 8;
};

/**
 * Validar email
 */
const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar URL
 */
const validarURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ====================================
// MANIPULACIÓN DE STRINGS
// ====================================

/**
 * Capitalizar primera letra
 */
const capitalizar = (texto) => {
  if (!texto) return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
};

/**
 * Capitalizar cada palabra
 */
const capitalizarPalabras = (texto) => {
  if (!texto) return '';
  return texto
    .toLowerCase()
    .split(' ')
    .map(palabra => capitalizar(palabra))
    .join(' ');
};

/**
 * Truncar texto
 */
const truncar = (texto, longitud, sufijo = '...') => {
  if (!texto || texto.length <= longitud) return texto;
  return texto.substring(0, longitud).trim() + sufijo;
};

/**
 * Limpiar espacios extras
 */
const limpiarEspacios = (texto) => {
  return texto.replace(/\s+/g, ' ').trim();
};

/**
 * Remover acentos
 */
const removerAcentos = (texto) => {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

// ====================================
// MANIPULACIÓN DE ARRAYS
// ====================================

/**
 * Agrupar array por campo
 */
const agruparPor = (array, campo) => {
  return array.reduce((resultado, item) => {
    const clave = item[campo];
    if (!resultado[clave]) {
      resultado[clave] = [];
    }
    resultado[clave].push(item);
    return resultado;
  }, {});
};

/**
 * Ordenar array por campo
 */
const ordenarPor = (array, campo, ascendente = true) => {
  return [...array].sort((a, b) => {
    const valorA = a[campo];
    const valorB = b[campo];
    
    if (valorA < valorB) return ascendente ? -1 : 1;
    if (valorA > valorB) return ascendente ? 1 : -1;
    return 0;
  });
};

/**
 * Obtener elementos únicos
 */
const unicos = (array) => {
  return [...new Set(array)];
};

/**
 * Dividir array en chunks
 */
const dividirEnChunks = (array, tamanio) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += tamanio) {
    chunks.push(array.slice(i, i + tamanio));
  }
  return chunks;
};

// ====================================
// MANIPULACIÓN DE OBJETOS
// ====================================

/**
 * Limpiar objeto de valores nulos o undefined
 */
const limpiarObjeto = (objeto) => {
  return Object.entries(objeto).reduce((resultado, [clave, valor]) => {
    if (valor !== null && valor !== undefined) {
      resultado[clave] = valor;
    }
    return resultado;
  }, {});
};

/**
 * Convertir objeto a query string
 */
const objetoAQueryString = (objeto) => {
  return Object.entries(objeto)
    .filter(([_, valor]) => valor !== null && valor !== undefined)
    .map(([clave, valor]) => `${encodeURIComponent(clave)}=${encodeURIComponent(valor)}`)
    .join('&');
};

/**
 * Clonar objeto profundamente
 */
const clonarProfundo = (objeto) => {
  return JSON.parse(JSON.stringify(objeto));
};

// ====================================
// UTILIDADES DE RESPUESTA
// ====================================

/**
 * Respuesta exitosa estándar
 */
const respuestaExito = (data, mensaje = 'Operación exitosa') => {
  return {
    exito: true,
    mensaje,
    data,
  };
};

/**
 * Respuesta de error estándar
 */
const respuestaError = (mensaje, codigo = 'ERROR', detalles = null) => {
  const respuesta = {
    exito: false,
    mensaje,
    codigo,
  };
  
  if (detalles) {
    respuesta.detalles = detalles;
  }
  
  return respuesta;
};

/**
 * Respuesta paginada estándar
 */
const respuestaPaginada = (data, pagina, limite, total) => {
  return {
    exito: true,
    data,
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: parseInt(total),
      totalPaginas: Math.ceil(total / limite),
      tieneSiguiente: (pagina * limite) < total,
      tieneAnterior: pagina > 1,
    },
  };
};

// ====================================
// CÁLCULOS DE PRECIOS
// ====================================

/**
 * Calcular precio total de reserva
 */
const calcularPrecioReserva = (precioBase, noches, descuento = 0) => {
  const subtotal = precioBase * noches;
  const montoDescuento = subtotal * (descuento / 100);
  const total = subtotal - montoDescuento;
  
  return {
    precioBase,
    noches,
    subtotal,
    descuento,
    montoDescuento,
    total,
  };
};

/**
 * Calcular descuento porcentual
 */
const calcularDescuento = (precioOriginal, precioConDescuento) => {
  const diferencia = precioOriginal - precioConDescuento;
  const porcentaje = (diferencia / precioOriginal) * 100;
  return Math.round(porcentaje);
};

// ====================================
// UTILIDADES DE TIEMPO
// ====================================

/**
 * Pausar ejecución (sleep)
 */
const pausar = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Obtener timestamp actual
 */
const timestamp = () => {
  return Math.floor(Date.now() / 1000);
};

/**
 * Tiempo transcurrido desde fecha
 */
const tiempoTranscurrido = (fecha) => {
  const ahora = new Date();
  const entonces = new Date(fecha);
  const diferencia = ahora - entonces;
  
  const segundos = Math.floor(diferencia / 1000);
  const minutos = Math.floor(segundos / 60);
  const horas = Math.floor(minutos / 60);
  const dias = Math.floor(horas / 24);
  
  if (dias > 0) return `hace ${dias} día${dias > 1 ? 's' : ''}`;
  if (horas > 0) return `hace ${horas} hora${horas > 1 ? 's' : ''}`;
  if (minutos > 0) return `hace ${minutos} minuto${minutos > 1 ? 's' : ''}`;
  return 'hace un momento';
};

// ====================================
// UTILIDADES DE DESARROLLO
// ====================================

/**
 * Logger mejorado
 */
const log = {
  info: (mensaje, datos = null) => {
    console.log(`ℹ️  [INFO] ${mensaje}`, datos || '');
  },
  exito: (mensaje, datos = null) => {
    console.log(`✅ [ÉXITO] ${mensaje}`, datos || '');
  },
  error: (mensaje, error = null) => {
    console.error(`❌ [ERROR] ${mensaje}`, error || '');
  },
  advertencia: (mensaje, datos = null) => {
    console.warn(`⚠️  [ADVERTENCIA] ${mensaje}`, datos || '');
  },
  debug: (mensaje, datos = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 [DEBUG] ${mensaje}`, datos || '');
    }
  },
};

module.exports = {
  // Formateo
  formatearFecha,
  formatearFechaCorta,
  formatearPrecio,
  formatearNumero,
  formatearTelefono,
  
  // Fechas
  calcularNoches,
  diasHasta,
  esFinDeSemana,
  obtenerRangoFechas,
  agregarDias,
  
  // Generadores
  generarId,
  generarCodigoReserva,
  generarCodigoVerificacion,
  generarSlug,
  
  // Validaciones
  validarCUIL,
  validarDNI,
  validarEmail,
  validarURL,
  
  // Strings
  capitalizar,
  capitalizarPalabras,
  truncar,
  limpiarEspacios,
  removerAcentos,
  
  // Arrays
  agruparPor,
  ordenarPor,
  unicos,
  dividirEnChunks,
  
  // Objetos
  limpiarObjeto,
  objetoAQueryString,
  clonarProfundo,
  
  // Respuestas
  respuestaExito,
  respuestaError,
  respuestaPaginada,
  
  // Precios
  calcularPrecioReserva,
  calcularDescuento,
  
  // Tiempo
  pausar,
  timestamp,
  tiempoTranscurrido,
  
  // Desarrollo
  log,
};