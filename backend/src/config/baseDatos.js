// src/config/baseDatos.js - Configuración de conexión a MySQL
const mysql = require('mysql2/promise');

// Configuración del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'hotel_reservas',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  timezone: '-03:00', // Timezone de Argentina (Mar del Plata)
});

/**
 * Verificar conexión a la base de datos
 */
const verificarConexionDB = async () => {
  try {
    const conexion = await pool.getConnection();
    console.log('✅ Conexión a MySQL establecida correctamente');
    conexion.release();
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error.message);
    throw error;
  }
};

/**
 * Ejecutar una consulta SQL
 * @param {string} sql - Consulta SQL
 * @param {Array} parametros - Parámetros de la consulta
 * @returns {Promise} Resultado de la consulta
 */
const ejecutarConsulta = async (sql, parametros = []) => {
  try {
    const [resultado] = await pool.execute(sql, parametros);
    return resultado;
  } catch (error) {
    console.error('Error en consulta SQL:', error.message);
    throw error;
  }
};

/**
 * Ejecutar múltiples consultas en una transacción
 * @param {Function} callback - Función con las consultas a ejecutar
 * @returns {Promise} Resultado de la transacción
 */
const ejecutarTransaccion = async (callback) => {
  const conexion = await pool.getConnection();
  
  try {
    await conexion.beginTransaction();
    const resultado = await callback(conexion);
    await conexion.commit();
    return resultado;
  } catch (error) {
    await conexion.rollback();
    console.error('Error en transacción:', error.message);
    throw error;
  } finally {
    conexion.release();
  }
};

/**
 * Obtener un registro por ID
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo ID
 * @param {number} id - ID del registro
 * @returns {Promise} Registro encontrado o null
 */
const obtenerPorId = async (tabla, campoId, id) => {
  try {
    const sql = `SELECT * FROM ${tabla} WHERE ${campoId} = ? LIMIT 1`;
    const resultado = await ejecutarConsulta(sql, [id]);
    return resultado.length > 0 ? resultado[0] : null;
  } catch (error) {
    console.error(`Error al obtener registro de ${tabla}:`, error.message);
    throw error;
  }
};

/**
 * Insertar un nuevo registro
 * @param {string} tabla - Nombre de la tabla
 * @param {Object} datos - Objeto con los datos a insertar
 * @returns {Promise} ID del registro insertado
 */
const insertar = async (tabla, datos) => {
  try {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const placeholders = campos.map(() => '?').join(', ');
    
    const sql = `INSERT INTO ${tabla} (${campos.join(', ')}) VALUES (${placeholders})`;
    const resultado = await ejecutarConsulta(sql, valores);
    
    return resultado.insertId;
  } catch (error) {
    console.error(`Error al insertar en ${tabla}:`, error.message);
    throw error;
  }
};

/**
 * Actualizar un registro
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo ID
 * @param {number} id - ID del registro
 * @param {Object} datos - Objeto con los datos a actualizar
 * @returns {Promise} Número de filas afectadas
 */
const actualizar = async (tabla, campoId, id, datos) => {
  try {
    const campos = Object.keys(datos);
    const valores = Object.values(datos);
    const sets = campos.map(campo => `${campo} = ?`).join(', ');
    
    const sql = `UPDATE ${tabla} SET ${sets} WHERE ${campoId} = ?`;
    const resultado = await ejecutarConsulta(sql, [...valores, id]);
    
    return resultado.affectedRows;
  } catch (error) {
    console.error(`Error al actualizar ${tabla}:`, error.message);
    throw error;
  }
};

/**
 * Eliminar un registro (soft delete)
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo ID
 * @param {number} id - ID del registro
 * @returns {Promise} Número de filas afectadas
 */
const eliminar = async (tabla, campoId, id) => {
  try {
    // Soft delete - cambiar estado a inactivo
    const sql = `UPDATE ${tabla} SET activo = FALSE WHERE ${campoId} = ?`;
    const resultado = await ejecutarConsulta(sql, [id]);
    return resultado.affectedRows;
  } catch (error) {
    console.error(`Error al eliminar de ${tabla}:`, error.message);
    throw error;
  }
};

/**
 * Eliminar permanentemente un registro
 * @param {string} tabla - Nombre de la tabla
 * @param {string} campoId - Nombre del campo ID
 * @param {number} id - ID del registro
 * @returns {Promise} Número de filas afectadas
 */
const eliminarPermanente = async (tabla, campoId, id) => {
  try {
    const sql = `DELETE FROM ${tabla} WHERE ${campoId} = ?`;
    const resultado = await ejecutarConsulta(sql, [id]);
    return resultado.affectedRows;
  } catch (error) {
    console.error(`Error al eliminar permanentemente de ${tabla}:`, error.message);
    throw error;
  }
};

/**
 * Cerrar el pool de conexiones
 */
const cerrarConexiones = async () => {
  try {
    await pool.end();
    console.log('✅ Pool de conexiones cerrado correctamente');
  } catch (error) {
    console.error('❌ Error al cerrar conexiones:', error.message);
    throw error;
  }
};

module.exports = {
  pool,
  verificarConexionDB,
  ejecutarConsulta,
  ejecutarTransaccion,
  obtenerPorId,
  insertar,
  actualizar,
  eliminar,
  eliminarPermanente,
  cerrarConexiones
};