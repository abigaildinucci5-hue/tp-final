// src/middlewares/middlewareAuth.js - Middleware de autenticación y autorización
const { verificarAccessToken } = require('../config/jwt');
const { ejecutarConsulta } = require('../config/baseDatos');

/**
 * Middleware para verificar autenticación
 * Verifica que el usuario tenga un token válido
 */
const verificarAutenticacion = async (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No se proporcionó token de autenticación'
      });
    }

    // Extraer el token
    const token = authHeader.substring(7); // Remover 'Bearer '

    // Verificar que el token sea válido
    const decoded = verificarAccessToken(token);

    // Obtener datos actualizados del usuario
    const sql = `
      SELECT id_usuario, nombre, apellido, email, rol, activo, verificado
      FROM usuarios
      WHERE id_usuario = ? AND activo = TRUE
      LIMIT 1
    `;
    const usuarios = await ejecutarConsulta(sql, [decoded.id]);

    if (usuarios.length === 0) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no encontrado o inactivo'
      });
    }

    // Adjuntar información del usuario a la petición
    req.usuario = usuarios[0];
    req.token = token;

    next();
  } catch (error) {
    console.error('Error en verificarAutenticacion:', error.message);
    
    if (error.message === 'Token expirado') {
      return res.status(401).json({
        exito: false,
        mensaje: 'Token expirado',
        codigo: 'TOKEN_EXPIRED'
      });
    }

    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido'
    });
  }
};

/**
 * Middleware para verificar que el usuario esté verificado
 */
const verificarUsuarioVerificado = (req, res, next) => {
  if (!req.usuario.verificado) {
    return res.status(403).json({
      exito: false,
      mensaje: 'Debes verificar tu email antes de continuar',
      codigo: 'EMAIL_NOT_VERIFIED'
    });
  }
  next();
};

/**
 * Middleware para verificar roles específicos
 * @param {...string} rolesPermitidos - Roles que tienen acceso
 * @returns {Function} Middleware
 */
const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'No autenticado'
      });
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permisos para realizar esta acción',
        rolRequerido: rolesPermitidos,
        tuRol: req.usuario.rol
      });
    }

    next();
  };
};

/**
 * Middleware para verificar que el usuario es admin
 */
const verificarAdmin = verificarRol('admin');

/**
 * Middleware para verificar que el usuario es empleado o admin
 */
const verificarEmpleado = verificarRol('empleado', 'admin');

/**
 * Middleware para verificar que el usuario es cliente o superior
 */
const verificarCliente = verificarRol('cliente', 'empleado', 'admin');

/**
 * Middleware para verificar que el usuario es dueño del recurso o admin
 * @param {string} paramName - Nombre del parámetro que contiene el ID del usuario
 * @returns {Function} Middleware
 */
const verificarPropietarioOAdmin = (paramName = 'idUsuario') => {
  return (req, res, next) => {
    const idRecurso = parseInt(req.params[paramName] || req.body[paramName]);
    const idUsuarioActual = req.usuario.id_usuario;
    const rolUsuario = req.usuario.rol;

    // Admin puede acceder a cualquier recurso
    if (rolUsuario === 'admin') {
      return next();
    }

    // El usuario debe ser el dueño del recurso
    if (idRecurso !== idUsuarioActual) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para acceder a este recurso'
      });
    }

    next();
  };
};

/**
 * Middleware opcional de autenticación
 * Si hay token lo verifica, si no hay permite continuar
 * Útil para rutas que funcionan tanto con usuarios autenticados como invitados
 */
const autenticacionOpcional = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No hay token, continuar sin usuario autenticado
      req.usuario = null;
      return next();
    }

    const token = authHeader.substring(7);
    const decoded = verificarAccessToken(token);
  
    // Obtener datos del usuario
    const sql = `
      SELECT id_usuario, nombre, apellido, email, rol, activo, verificado
      FROM usuarios
      WHERE id_usuario = ? AND activo = TRUE
      LIMIT 1
    `;
    const usuarios = await ejecutarConsulta(sql, [decoded.id]);

    if (usuarios.length > 0) {
      req.usuario = usuarios[0];
    } else {
      req.usuario = null;
    }

    next();
  } catch (error) {
    // Si hay error en la verificación, continuar sin usuario
    req.usuario = null;
    next();
  }
};

/**
 * Middleware para registrar actividad del usuario
 */
const registrarActividad = async (req, res, next) => {
  if (req.usuario) {
    try {
      const sql = `UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?`;
      await ejecutarConsulta(sql, [req.usuario.id_usuario]);
    } catch (error) {
      // No bloquear la petición si falla el registro de actividad
      console.error('Error al registrar actividad:', error.message);
    }
  }
  next();
};

/**
 * Middleware para limitar acceso basado en IP
 * Útil para proteger endpoints sensibles
 */
const limitarPorIP = (maxIntentos = 5, ventanaTiempo = 15 * 60 * 1000) => {
  const intentosPorIP = new Map();

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const ahora = Date.now();

    if (!intentosPorIP.has(ip)) {
      intentosPorIP.set(ip, { intentos: 1, primerIntento: ahora });
      return next();
    }

    const datos = intentosPorIP.get(ip);
    
    // Resetear si pasó la ventana de tiempo
    if (ahora - datos.primerIntento > ventanaTiempo) {
      intentosPorIP.set(ip, { intentos: 1, primerIntento: ahora });
      return next();
    }

    // Incrementar intentos
    datos.intentos++;

    if (datos.intentos > maxIntentos) {
      return res.status(429).json({
        exito: false,
        mensaje: 'Demasiados intentos desde esta IP. Por favor intenta más tarde.'
      });
    }

    intentosPorIP.set(ip, datos);
    next();
  };
};

module.exports = {
  verificarAutenticacion,
  verificarUsuarioVerificado,
  verificarRol,
  verificarAdmin,
  verificarEmpleado,
  verificarCliente,
  verificarPropietarioOAdmin,
  autenticacionOpcional,
  registrarActividad,
  limitarPorIP
};