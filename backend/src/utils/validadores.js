// src/utils/validadores.js - Validadores personalizados
const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para validar resultados
 */
const validarResultado = (req, res, next) => {
  const errores = validationResult(req);
  
  if (!errores.isEmpty()) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Errores de validación',
      errores: errores.array().map(error => ({
        campo: error.path || error.param,
        mensaje: error.msg,
        valor: error.value,
      })),
    });
  }
  
  next();
};

// ====================================
// VALIDADORES DE AUTENTICACIÓN
// ====================================

const validarRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El nombre debe tener entre 2 y 50 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El nombre solo puede contener letras'),
  
  body('apellido')
    .trim()
    .notEmpty().withMessage('El apellido es requerido')
    .isLength({ min: 2, max: 50 }).withMessage('El apellido debe tener entre 2 y 50 caracteres')
    .matches(/^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/).withMessage('El apellido solo puede contener letras'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida')
    .isLength({ min: 6, max: 50 }).withMessage('La contraseña debe tener entre 6 y 50 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  body('telefono')
    .optional()
    .trim()
    .matches(/^[\d\s\+\-\(\)]+$/).withMessage('El teléfono no es válido'),
  
  validarResultado,
];

const validarLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido'),
  
  body('password')
    .notEmpty().withMessage('La contraseña es requerida'),
  
  validarResultado,
];

const validarCambioPassword = [
  body('passwordActual')
    .notEmpty().withMessage('La contraseña actual es requerida'),
  
  body('nuevaPassword')
    .notEmpty().withMessage('La nueva contraseña es requerida')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  
  validarResultado,
];

const validarRecuperarPassword = [
  body('email')
    .trim()
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email no es válido'),
  
  validarResultado,
];

// ====================================
// VALIDADORES DE HABITACIONES
// ====================================

const validarCrearHabitacion = [
  body('numeroHabitacion')
    .trim()
    .notEmpty().withMessage('El número de habitación es requerido')
    .isLength({ max: 20 }).withMessage('El número de habitación no puede exceder 20 caracteres'),
  
  body('idTipo')
    .notEmpty().withMessage('El tipo de habitación es requerido')
    .isInt({ min: 1 }).withMessage('El ID de tipo debe ser un número válido'),
  
  body('piso')
    .optional()
    .isInt({ min: 0, max: 50 }).withMessage('El piso debe ser un número entre 0 y 50'),
  
  body('descripcionDetallada')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('vista')
    .optional()
    .isIn(['mar', 'ciudad', 'jardin', 'montaña']).withMessage('Vista inválida'),
  
  validarResultado,
];

const validarActualizarHabitacion = [
  param('idHabitacion')
    .isInt({ min: 1 }).withMessage('ID de habitación inválido'),
  
  body('descripcionDetallada')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['disponible', 'ocupada', 'mantenimiento', 'limpieza']).withMessage('Estado inválido'),
  
  body('vista')
    .optional()
    .isIn(['mar', 'ciudad', 'jardin', 'montaña']).withMessage('Vista inválida'),
  
  validarResultado,
];

// ====================================
// VALIDADORES DE RESERVAS
// ====================================

const validarCrearReserva = [
  body('idHabitacion')
    .notEmpty().withMessage('La habitación es requerida')
    .isInt({ min: 1 }).withMessage('ID de habitación inválido'),
  
  body('fechaEntrada')
    .notEmpty().withMessage('La fecha de entrada es requerida')
    .isISO8601().withMessage('Fecha de entrada inválida')
    .custom((value) => {
      const fecha = new Date(value);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        throw new Error('La fecha de entrada no puede ser anterior a hoy');
      }
      return true;
    }),
  
  body('fechaSalida')
    .notEmpty().withMessage('La fecha de salida es requerida')
    .isISO8601().withMessage('Fecha de salida inválida')
    .custom((value, { req }) => {
      const entrada = new Date(req.body.fechaEntrada);
      const salida = new Date(value);
      
      if (salida <= entrada) {
        throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
      }
      
      // Máximo 30 días de estadía
      const diferenciaDias = (salida - entrada) / (1000 * 60 * 60 * 24);
      if (diferenciaDias > 30) {
        throw new Error('La estadía no puede exceder 30 días');
      }
      
      return true;
    }),
  
  body('numeroHuespedes')
    .notEmpty().withMessage('El número de huéspedes es requerido')
    .isInt({ min: 1, max: 10 }).withMessage('El número de huéspedes debe estar entre 1 y 10'),
  
  body('notasEspeciales')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Las notas no pueden exceder 500 caracteres'),
  
  validarResultado,
];

const validarModificarReserva = [
  param('idReserva')
    .isInt({ min: 1 }).withMessage('ID de reserva inválido'),
  
  body('fechaEntrada')
    .optional()
    .isISO8601().withMessage('Fecha de entrada inválida'),
  
  body('fechaSalida')
    .optional()
    .isISO8601().withMessage('Fecha de salida inválida'),
  
  body('numeroHuespedes')
    .optional()
    .isInt({ min: 1, max: 10 }).withMessage('El número de huéspedes debe estar entre 1 y 10'),
  
  validarResultado,
];

// ====================================
// VALIDADORES DE COMENTARIOS
// ====================================

const validarCrearComentario = [
  body('tipoComentario')
    .notEmpty().withMessage('El tipo de comentario es requerido')
    .isIn(['hotel', 'habitacion']).withMessage('Tipo de comentario inválido'),
  
  body('calificacion')
    .notEmpty().withMessage('La calificación es requerida')
    .isInt({ min: 1, max: 5 }).withMessage('La calificación debe estar entre 1 y 5'),
  
  body('titulo')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('El título no puede exceder 200 caracteres'),
  
  body('comentario')
    .notEmpty().withMessage('El comentario es requerido')
    .trim()
    .isLength({ min: 10, max: 1000 }).withMessage('El comentario debe tener entre 10 y 1000 caracteres'),
  
  body('idHabitacion')
    .if(body('tipoComentario').equals('habitacion'))
    .notEmpty().withMessage('El ID de habitación es requerido para comentarios de habitación')
    .isInt({ min: 1 }).withMessage('ID de habitación inválido'),
  
  validarResultado,
];

const validarResponderComentario = [
  param('idComentario')
    .isInt({ min: 1 }).withMessage('ID de comentario inválido'),
  
  body('respuesta')
    .notEmpty().withMessage('La respuesta es requerida')
    .trim()
    .isLength({ min: 10, max: 500 }).withMessage('La respuesta debe tener entre 10 y 500 caracteres'),
  
  validarResultado,
];

// ====================================
// VALIDADORES DE PARÁMETROS
// ====================================

const validarId = (nombreParam = 'id') => [
  param(nombreParam)
    .isInt({ min: 1 }).withMessage(`${nombreParam} inválido`),
  
  validarResultado,
];

const validarPaginacion = [
  query('pagina')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de página debe ser mayor a 0')
    .toInt(),
  
  query('limite')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('El límite debe estar entre 1 y 100')
    .toInt(),
  
  validarResultado,
];

const validarFechas = [
  query('fechaDesde')
    .optional()
    .isISO8601().withMessage('Fecha desde inválida'),
  
  query('fechaHasta')
    .optional()
    .isISO8601().withMessage('Fecha hasta inválida')
    .custom((value, { req }) => {
      if (req.query.fechaDesde && value) {
        const desde = new Date(req.query.fechaDesde);
        const hasta = new Date(value);
        
        if (hasta < desde) {
          throw new Error('La fecha hasta debe ser posterior a la fecha desde');
        }
      }
      return true;
    }),
  
  validarResultado,
];

// ====================================
// VALIDADORES PERSONALIZADOS
// ====================================

/**
 * Validar email único en base de datos
 */
const validarEmailUnico = async (email) => {
  const { ejecutarConsulta } = require('../config/baseDatos');
  const sql = 'SELECT id_usuario FROM usuarios WHERE email = ? LIMIT 1';
  const usuarios = await ejecutarConsulta(sql, [email]);
  
  if (usuarios.length > 0) {
    throw new Error('El email ya está registrado');
  }
  
  return true;
};

/**
 * Validar fecha no pasada
 */
const validarFechaFutura = (fecha) => {
  const fechaObj = new Date(fecha);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  
  if (fechaObj < hoy) {
    throw new Error('La fecha no puede ser anterior a hoy');
  }
  
  return true;
};

/**
 * Validar formato de teléfono argentino
 */
const validarTelefonoArgentino = (telefono) => {
  const regex = /^(\+54|54)?[\s\-]?(\(?\d{2,4}\)?)[\s\-]?\d{3,4}[\s\-]?\d{4}$/;
  
  if (!regex.test(telefono)) {
    throw new Error('Formato de teléfono argentino inválido');
  }
  
  return true;
};

/**
 * Sanitizar string para prevenir XSS
 */
const sanitizarString = (str) => {
  return str
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 1000);
};

module.exports = {
  // Middleware principal
  validarResultado,
  
  // Autenticación
  validarRegistro,
  validarLogin,
  validarCambioPassword,
  validarRecuperarPassword,
  
  // Habitaciones
  validarCrearHabitacion,
  validarActualizarHabitacion,
  
  // Reservas
  validarCrearReserva,
  validarModificarReserva,
  
  // Comentarios
  validarCrearComentario,
  validarResponderComentario,
  
  // Generales
  validarId,
  validarPaginacion,
  validarFechas,
  
  // Personalizados
  validarEmailUnico,
  validarFechaFutura,
  validarTelefonoArgentino,
  sanitizarString,
};