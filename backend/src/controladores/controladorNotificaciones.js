// src/controladores/controladorNotificaciones.js - Gestión de notificaciones
const { ejecutarConsulta, insertar, actualizar } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError403 } = require('../middlewares/manejadorErrores');

/**
 * Obtener notificaciones del usuario
 * GET /api/notificaciones
 */
const obtenerNotificaciones = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;
  const { limite = 50, pagina = 1, tipo } = req.query;
  const offset = (pagina - 1) * limite;

  let sql = `
    SELECT 
      id_notificacion,
      tipo,
      titulo,
      mensaje,
      leida,
      fecha_creacion,
      fecha_lectura,
      datos_adicionales
    FROM notificaciones
    WHERE id_usuario = ?
  `;

  const parametros = [id_usuario];

  if (tipo) {
    sql += ` AND tipo = ?`;
    parametros.push(tipo);
  }

  sql += ` ORDER BY fecha_creacion DESC LIMIT ? OFFSET ?`;
  parametros.push(parseInt(limite), offset);

  const notificaciones = await ejecutarConsulta(sql, parametros);

  // Parsear datos_adicionales JSON
  notificaciones.forEach(n => {
    if (n.datos_adicionales) {
      try {
        n.datos_adicionales = JSON.parse(n.datos_adicionales);
      } catch (error) {
        n.datos_adicionales = null;
      }
    }
  });

  // Contar total
  const sqlTotal = `
    SELECT COUNT(*) as total
    FROM notificaciones
    WHERE id_usuario = ?
    ${tipo ? 'AND tipo = ?' : ''}
  `;
  const totalParams = tipo ? [id_usuario, tipo] : [id_usuario];
  const totalResult = await ejecutarConsulta(sqlTotal, totalParams);

  res.json({
    exito: true,
    data: notificaciones,
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: totalResult[0].total
    }
  });
});

/**
 * Obtener notificaciones no leídas
 * GET /api/notificaciones/no-leidas
 */
const obtenerNoLeidas = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `
    SELECT 
      id_notificacion,
      tipo,
      titulo,
      mensaje,
      fecha_creacion,
      datos_adicionales
    FROM notificaciones
    WHERE id_usuario = ? AND leida = FALSE
    ORDER BY fecha_creacion DESC
    LIMIT 20
  `;

  const notificaciones = await ejecutarConsulta(sql, [id_usuario]);

  // Parsear datos_adicionales JSON
  notificaciones.forEach(n => {
    if (n.datos_adicionales) {
      try {
        n.datos_adicionales = JSON.parse(n.datos_adicionales);
      } catch (error) {
        n.datos_adicionales = null;
      }
    }
  });

  res.json({
    exito: true,
    data: notificaciones,
    total: notificaciones.length
  });
});

/**
 * Obtener cantidad de notificaciones no leídas
 * GET /api/notificaciones/cantidad-no-leidas
 */
const obtenerCantidadNoLeidas = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `
    SELECT COUNT(*) as cantidad
    FROM notificaciones
    WHERE id_usuario = ? AND leida = FALSE
  `;

  const resultado = await ejecutarConsulta(sql, [id_usuario]);

  res.json({
    exito: true,
    data: {
      cantidad: resultado[0].cantidad
    }
  });
});

/**
 * Marcar notificación como leída
 * PUT /api/notificaciones/:idNotificacion/marcar-leida
 */
const marcarLeida = asyncHandler(async (req, res) => {
  const { idNotificacion } = req.params;
  const { id_usuario } = req.usuario;

  // Verificar que la notificación pertenece al usuario
  const sqlVerificar = `
    SELECT id_usuario FROM notificaciones
    WHERE id_notificacion = ?
    LIMIT 1
  `;
  const notificaciones = await ejecutarConsulta(sqlVerificar, [idNotificacion]);

  if (notificaciones.length === 0) {
    throw crearError404('Notificación no encontrada');
  }

  if (notificaciones[0].id_usuario !== id_usuario) {
    throw crearError403('No tienes permiso para modificar esta notificación');
  }

  await actualizar('notificaciones', 'id_notificacion', idNotificacion, {
    leida: true,
    fecha_lectura: new Date()
  });

  res.json({
    exito: true,
    mensaje: 'Notificación marcada como leída'
  });
});

/**
 * Marcar todas las notificaciones como leídas
 * PUT /api/notificaciones/marcar-todas-leidas
 */
const marcarTodasLeidas = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `
    UPDATE notificaciones
    SET leida = TRUE, fecha_lectura = NOW()
    WHERE id_usuario = ? AND leida = FALSE
  `;

  const resultado = await ejecutarConsulta(sql, [id_usuario]);

  res.json({
    exito: true,
    mensaje: 'Todas las notificaciones marcadas como leídas',
    cantidad: resultado.affectedRows
  });
});

/**
 * Eliminar notificación
 * DELETE /api/notificaciones/:idNotificacion
 */
const eliminarNotificacion = asyncHandler(async (req, res) => {
  const { idNotificacion } = req.params;
  const { id_usuario } = req.usuario;

  // Verificar que la notificación pertenece al usuario
  const sqlVerificar = `
    SELECT id_usuario FROM notificaciones
    WHERE id_notificacion = ?
    LIMIT 1
  `;
  const notificaciones = await ejecutarConsulta(sqlVerificar, [idNotificacion]);

  if (notificaciones.length === 0) {
    throw crearError404('Notificación no encontrada');
  }

  if (notificaciones[0].id_usuario !== id_usuario) {
    throw crearError403('No tienes permiso para eliminar esta notificación');
  }

  const sql = `DELETE FROM notificaciones WHERE id_notificacion = ?`;
  await ejecutarConsulta(sql, [idNotificacion]);

  res.json({
    exito: true,
    mensaje: 'Notificación eliminada'
  });
});

/**
 * Eliminar todas las notificaciones del usuario
 * DELETE /api/notificaciones/limpiar-todas
 */
const limpiarTodas = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `DELETE FROM notificaciones WHERE id_usuario = ?`;
  const resultado = await ejecutarConsulta(sql, [id_usuario]);

  res.json({
    exito: true,
    mensaje: 'Todas las notificaciones eliminadas',
    cantidad: resultado.affectedRows
  });
});

/**
 * Crear notificación (uso interno del sistema)
 * @param {number} idUsuario - ID del usuario
 * @param {string} tipo - Tipo de notificación
 * @param {string} titulo - Título
 * @param {string} mensaje - Mensaje
 * @param {Object} datosAdicionales - Datos adicionales
 */
const crearNotificacion = async (idUsuario, tipo, titulo, mensaje, datosAdicionales = null) => {
  try {
    const datosNotificacion = {
      id_usuario: idUsuario,
      tipo,
      titulo,
      mensaje,
      datos_adicionales: datosAdicionales ? JSON.stringify(datosAdicionales) : null
    };

    const idNotificacion = await insertar('notificaciones', datosNotificacion);
    return idNotificacion;
  } catch (error) {
    console.error('Error al crear notificación:', error);
    return null;
  }
};

/**
 * Crear notificación masiva para todos los usuarios activos
 * POST /api/notificaciones/enviar-masiva (Admin)
 */
const enviarNotificacionMasiva = asyncHandler(async (req, res) => {
  const { tipo, titulo, mensaje, datosAdicionales } = req.body;

  if (!tipo || !titulo || !mensaje) {
    throw crearError400('Tipo, título y mensaje son requeridos');
  }

  // Obtener todos los usuarios activos
  const sqlUsuarios = `
    SELECT id_usuario FROM usuarios WHERE activo = TRUE
  `;
  const usuarios = await ejecutarConsulta(sqlUsuarios);

  let notificacionesCreadas = 0;

  for (const usuario of usuarios) {
    const resultado = await crearNotificacion(
      usuario.id_usuario,
      tipo,
      titulo,
      mensaje,
      datosAdicionales
    );

    if (resultado) notificacionesCreadas++;
  }

  res.json({
    exito: true,
    mensaje: 'Notificación masiva enviada',
    data: {
      totalUsuarios: usuarios.length,
      notificacionesCreadas
    }
  });
});

/**
 * Obtener estadísticas de notificaciones (Admin)
 * GET /api/notificaciones/estadisticas
 */
const obtenerEstadisticas = asyncHandler(async (req, res) => {
  const sqlEstadisticas = `
    SELECT 
      tipo,
      COUNT(*) as total,
      SUM(CASE WHEN leida = TRUE THEN 1 ELSE 0 END) as leidas,
      SUM(CASE WHEN leida = FALSE THEN 1 ELSE 0 END) as no_leidas
    FROM notificaciones
    GROUP BY tipo
  `;

  const estadisticas = await ejecutarConsulta(sqlEstadisticas);

  const sqlTotales = `
    SELECT 
      COUNT(*) as total_notificaciones,
      COUNT(DISTINCT id_usuario) as usuarios_con_notificaciones,
      AVG(CASE WHEN leida = TRUE THEN 1 ELSE 0 END) * 100 as tasa_lectura
    FROM notificaciones
  `;

  const totales = await ejecutarConsulta(sqlTotales);

  res.json({
    exito: true,
    data: {
      porTipo: estadisticas,
      totales: totales[0]
    }
  });
});

module.exports = {
  obtenerNotificaciones,
  obtenerNoLeidas,
  obtenerCantidadNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
  eliminarNotificacion,
  limpiarTodas,
  crearNotificacion,
  enviarNotificacionMasiva,
  obtenerEstadisticas
};