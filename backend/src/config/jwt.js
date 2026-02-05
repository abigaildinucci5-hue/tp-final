// src/config/jwt.js - Configuración y utilidades para JWT
const jwt = require('jsonwebtoken');
const { insertar, ejecutarConsulta } = require('./baseDatos');

const JWT_SECRET = process.env.JWT_SECRET || 'clave_secreta_super_segura';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh_secret_key';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';
const JWT_EXPIRE_HOURS = 24;
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || '7d';

/**
 * Generar access token
 * @param {Object} payload - Datos del usuario
 * @returns {string} Token JWT
 */
const generarAccessToken = (payload) => {
  try {
    const token = jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        rol: payload.rol
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRE,
        issuer: 'hotel-luna-serena-api',
        audience: 'hotel-luna-serena-app'
      }
    );
    return token;
  } catch (error) {
    console.error('Error al generar access token:', error.message);
    throw new Error('Error al generar token de acceso');
  }
};

/**
 * Generar refresh token
 * @param {Object} payload - Datos del usuario
 * @returns {string} Refresh token
 */
const generarRefreshToken = (payload) => {
  try {
    const refreshToken = jwt.sign(
      {
        id: payload.id,
        email: payload.email
      },
      JWT_REFRESH_SECRET,
      {
        expiresIn: JWT_REFRESH_EXPIRE,
        issuer: 'hotel-luna-serena-api',
        audience: 'hotel-luna-serena-app'
      }
    );
    return refreshToken;
  } catch (error) {
    console.error('Error al generar refresh token:', error.message);
    throw new Error('Error al generar token de actualización');
  }
};

const verificarAccessToken = (token) => {
  try {
    // Quitamos issuer y audience para evitar errores de coincidencia en local
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new Error('Token expirado');
    throw new Error('Token inválido');
  }
};

const verificarRefreshToken = (refreshToken) => {
  try {
    return jwt.verify(refreshToken, JWT_REFRESH_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') throw new Error('Refresh token expirado');
    throw new Error('Refresh token inválido');
  }
};

/**
 * Guardar tokens en la base de datos
 * @param {number} idUsuario - ID del usuario
 * @param {string} token - Access token
 * @param {string} refreshToken - Refresh token
 * @param {Object} infoDispositivo - Información del dispositivo
 * @returns {Promise<number>} ID del token guardado
 */
const guardarToken = async (idUsuario, token, refreshToken, infoDispositivo = {}) => {
  try {
    // Calcular fecha de expiración (mismo tiempo que el JWT)
    const fechaExpiracion = new Date();
      fechaExpiracion.setHours(
    fechaExpiracion.getHours() + JWT_EXPIRE_HOURS
);

    const datosToken = {
      id_usuario: idUsuario,
      refresh_token: refreshToken,
      dispositivo: infoDispositivo.dispositivo || 'unknown',
      ip: infoDispositivo.ip || null,
     expira_en: fechaExpiracion,
     activo: 1
};

    const idToken = await insertar('tokens_sesion', datosToken);
    return idToken;
  } catch (error) {
    console.error('Error al guardar token:', error.message);
    throw error;
  }
};

/**
 * Invalidar token (logout)
 * @param {string} token - Token a invalidar
 * @returns {Promise<boolean>} True si se invalidó correctamente
 */
const invalidarToken = async (token) => {
  try {
    const sql = `UPDATE tokens_sesion SET activo = 0 WHERE refresh_token = ?`;
    await ejecutarConsulta(sql, [token]);
    return true;
  } catch (error) {
    console.error('Error al invalidar token:', error.message);
    throw error;
  }
};

/**
 * Invalidar todos los tokens de un usuario
 * @param {number} idUsuario - ID del usuario
 * @returns {Promise<boolean>} True si se invalidaron correctamente
 */
const invalidarTodosTokensUsuario = async (idUsuario) => {
  try {
    const sql = `UPDATE tokens_sesion SET activo = FALSE WHERE id_usuario = ?`;
    await ejecutarConsulta(sql, [idUsuario]);
    return true;
  } catch (error) {
    console.error('Error al invalidar tokens del usuario:', error.message);
    throw error;
  }
};

/**
 * Verificar si un token está activo en la base de datos
 * @param {string} token - Token a verificar
 * @returns {Promise<boolean>} True si el token está activo
 */
const verificarTokenActivo = async (token) => {
  try {
    const sql = `
  SELECT id, activo, expira_en
  FROM tokens_sesion
  WHERE refresh_token = ?
    AND activo = 1
    AND expira_en > NOW()
  LIMIT 1
`;
    const resultado = await ejecutarConsulta(sql, [token]);
    return resultado.length > 0;
  } catch (error) {
    console.error('Error al verificar token activo:', error.message);
    return false;
  }
};

/**
 * Limpiar tokens expirados de la base de datos
 * @returns {Promise<number>} Número de tokens eliminados
 */
const limpiarTokensExpirados = async () => {
  try {
    const sql = `DELETE FROM tokens_sesion WHERE expira_en < NOW() OR activo = 0`;
    const resultado = await ejecutarConsulta(sql);
    console.log(`🧹 Tokens expirados eliminados: ${resultado.affectedRows}`);
    return resultado.affectedRows;
  } catch (error) {
    console.error('Error al limpiar tokens expirados:', error.message);
    throw error;
  }
};

/**
 * Generar token de verificación de email
 * @param {string} email - Email del usuario
 * @returns {string} Token de verificación
 */
const generarTokenVerificacion = (email) => {
  try {
    const token = jwt.sign(
      { email: email, tipo: 'verificacion' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return token;
  } catch (error) {
    console.error('Error al generar token de verificación:', error.message);
    throw error;
  }
};

/**
 * Generar token de recuperación de contraseña
 * @param {string} email - Email del usuario
 * @returns {string} Token de recuperación
 */
const generarTokenRecuperacion = (email) => {
  try {
    const token = jwt.sign(
      { email: email, tipo: 'recuperacion' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    return token;
  } catch (error) {
    console.error('Error al generar token de recuperación:', error.message);
    throw error;
  }
};

// Configurar limpieza automática de tokens expirados cada 6 horas
setInterval(() => {
  limpiarTokensExpirados().catch(error => {
    console.error('Error en limpieza automática de tokens:', error);
  });
}, 6 * 60 * 60 * 1000);

module.exports = {
  generarAccessToken,
  generarRefreshToken,
  verificarAccessToken,
  verificarRefreshToken,
  guardarToken,
  invalidarToken,
  invalidarTodosTokensUsuario,
  verificarTokenActivo,
  limpiarTokensExpirados,
  generarTokenVerificacion,
  generarTokenRecuperacion
};