// src/middlewares/manejadorErrores.js - Manejo centralizado de errores

/**
 * Clase personalizada para errores de la API
 */
class ErrorAPI extends Error {
  constructor(mensaje, codigoEstado = 500, codigo = 'ERROR_INTERNO') {
    super(mensaje);
    this.codigoEstado = codigoEstado;
    this.codigo = codigo;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para manejo de errores
 */
const manejadorErrores = (error, req, res, next) => {
  console.error('❌ Error capturado:', {
    mensaje: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    ruta: req.originalUrl,
    metodo: req.method
  });

  // Error personalizado de la API
  if (error instanceof ErrorAPI) {
    return res.status(error.codigoEstado).json({
      exito: false,
      mensaje: error.message,
      codigo: error.codigo,
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
  }

  // Errores de validación de MySQL
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      exito: false,
      mensaje: 'El registro ya existe en la base de datos',
      codigo: 'DUPLICADO'
    });
  }

  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      exito: false,
      mensaje: 'Referencia inválida en la base de datos',
      codigo: 'REFERENCIA_INVALIDA'
    });
  }

  // Errores de JWT
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido',
      codigo: 'TOKEN_INVALIDO'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token expirado',
      codigo: 'TOKEN_EXPIRADO'
    });
  }

  // Errores de validación
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      exito: false,
      mensaje: 'Error de validación',
      errores: error.errors,
      codigo: 'VALIDACION_ERROR'
    });
  }

  // Error de sintaxis JSON
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({
      exito: false,
      mensaje: 'JSON inválido en la petición',
      codigo: 'JSON_INVALIDO'
    });
  }

  // Error por defecto (500 Internal Server Error)
  return res.status(500).json({
    exito: false,
    mensaje: 'Error interno del servidor',
    codigo: 'ERROR_INTERNO',
    ...(process.env.NODE_ENV === 'development' && {
      detalles: error.message,
      stack: error.stack
    })
  });
};

/**
 * Wrapper para funciones async para capturar errores
 * @param {Function} fn - Función async a ejecutar
 * @returns {Function} Función con manejo de errores
 */
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Crear error 404 - No encontrado
 */
const crearError404 = (mensaje = 'Recurso no encontrado') => {
  return new ErrorAPI(mensaje, 404, 'NO_ENCONTRADO');
};

/**
 * Crear error 400 - Petición incorrecta
 */
const crearError400 = (mensaje = 'Petición incorrecta') => {
  return new ErrorAPI(mensaje, 400, 'PETICION_INCORRECTA');
};

/**
 * Crear error 401 - No autorizado
 */
const crearError401 = (mensaje = 'No autorizado') => {
  return new ErrorAPI(mensaje, 401, 'NO_AUTORIZADO');
};

/**
 * Crear error 403 - Prohibido
 */
const crearError403 = (mensaje = 'Acceso prohibido') => {
  return new ErrorAPI(mensaje, 403, 'PROHIBIDO');
};

/**
 * Crear error 409 - Conflicto
 */
const crearError409 = (mensaje = 'Conflicto con el estado actual') => {
  return new ErrorAPI(mensaje, 409, 'CONFLICTO');
};

/**
 * Crear error 500 - Error interno
 */
const crearError500 = (mensaje = 'Error interno del servidor') => {
  return new ErrorAPI(mensaje, 500, 'ERROR_INTERNO');
};

module.exports = {
  ErrorAPI,
  manejadorErrores,
  asyncHandler,
  crearError404,
  crearError400,
  crearError401,
  crearError403,
  crearError409,
  crearError500
};