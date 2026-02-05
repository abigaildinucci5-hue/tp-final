// src/controladores/controladorComentarios.js - Gestión de comentarios y reseñas
const { ejecutarConsulta, insertar, actualizar, eliminar } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError400, crearError403 } = require('../middlewares/manejadorErrores');

/**
 * Obtener comentarios del hotel
 * GET /api/comentarios/hotel
 */
const obtenerComentariosHotel = asyncHandler(async (req, res) => {
  const { limite = 20, pagina = 1 } = req.query;
  const offset = (pagina - 1) * limite;

  const sql = `
    SELECT 
      c.id_comentario,
      c.calificacion,
      c.titulo,
      c.comentario,
      c.respuesta_hotel,
      c.fecha_comentario,
      c.fecha_respuesta,
      u.nombre,
      u.apellido,
      u.foto_perfil
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.tipo_comentario = 'hotel' 
    AND c.aprobado = TRUE
    ORDER BY c.fecha_comentario DESC
    LIMIT ? OFFSET ?
  `;

  const comentarios = await ejecutarConsulta(sql, [parseInt(limite), offset]);

  // Calcular estadísticas
  const sqlEstadisticas = `
    SELECT 
      COUNT(*) as total,
      AVG(calificacion) as promedio,
      SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) as cinco_estrellas,
      SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) as cuatro_estrellas,
      SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) as tres_estrellas,
      SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) as dos_estrellas,
      SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) as una_estrella
    FROM comentarios
    WHERE tipo_comentario = 'hotel' AND aprobado = TRUE
  `;

  const estadisticas = await ejecutarConsulta(sqlEstadisticas);

  res.json({
    exito: true,
    data: comentarios,
    estadisticas: estadisticas[0],
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: estadisticas[0].total
    }
  });
});

/**
 * Obtener comentarios de una habitación
 * GET /api/comentarios/habitacion/:idHabitacion
 */
const obtenerComentariosHabitacion = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const { limite = 20, pagina = 1 } = req.query;
  const offset = (pagina - 1) * limite;

  const sql = `
    SELECT 
      c.id_comentario,
      c.calificacion,
      c.titulo,
      c.comentario,
      c.respuesta_hotel,
      c.fecha_comentario,
      c.fecha_respuesta,
      u.nombre,
      u.apellido,
      u.foto_perfil
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_habitacion = ? 
    AND c.tipo_comentario = 'habitacion'
    AND c.aprobado = TRUE
    ORDER BY c.fecha_comentario DESC
    LIMIT ? OFFSET ?
  `;

  const comentarios = await ejecutarConsulta(sql, [idHabitacion, parseInt(limite), offset]);

  // Calcular promedio de la habitación
  const sqlPromedio = `
    SELECT 
      COUNT(*) as total,
      AVG(calificacion) as promedio
    FROM comentarios
    WHERE id_habitacion = ? AND tipo_comentario = 'habitacion' AND aprobado = TRUE
  `;

  const estadisticas = await ejecutarConsulta(sqlPromedio, [idHabitacion]);

  res.json({
    exito: true,
    data: comentarios,
    estadisticas: estadisticas[0],
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: estadisticas[0].total
    }
  });
});

/**
 * Crear nuevo comentario
 * POST /api/comentarios
 */
const crearComentario = asyncHandler(async (req, res) => {
  const {
    idHabitacion,
    idReserva,
    tipoComentario,
    calificacion,
    titulo,
    comentario
  } = req.body;

  const { id_usuario } = req.usuario;

  // Validaciones
  if (!tipoComentario || !calificacion || !comentario) {
    throw crearError400('Tipo, calificación y comentario son requeridos');
  }

  if (!['hotel', 'habitacion'].includes(tipoComentario)) {
    throw crearError400('Tipo de comentario inválido');
  }

  if (calificacion < 1 || calificacion > 5) {
    throw crearError400('La calificación debe estar entre 1 y 5');
  }

  if (tipoComentario === 'habitacion' && !idHabitacion) {
    throw crearError400('ID de habitación es requerido para comentarios de habitación');
  }

  // Verificar que el usuario tenga una reserva completada
  if (idReserva) {
    const sqlReserva = `
      SELECT id_reserva, estado, id_usuario
      FROM reservas
      WHERE id_reserva = ? AND id_usuario = ?
      LIMIT 1
    `;
    const reservas = await ejecutarConsulta(sqlReserva, [idReserva, id_usuario]);

    if (reservas.length === 0) {
      throw crearError403('Solo puedes comentar sobre tus propias reservas');
    }

    // Verificar que no haya comentado ya esta reserva
    const sqlExiste = `
      SELECT id_comentario FROM comentarios
      WHERE id_reserva = ? AND id_usuario = ?
      LIMIT 1
    `;
    const existe = await ejecutarConsulta(sqlExiste, [idReserva, id_usuario]);

    if (existe.length > 0) {
      throw crearError400('Ya has comentado sobre esta reserva');
    }
  }

  const datosComentario = {
    id_usuario,
    id_habitacion: idHabitacion || null,
    id_reserva: idReserva || null,
    tipo_comentario: tipoComentario,
    calificacion,
    titulo: titulo || null,
    comentario,
    aprobado: false // Los comentarios deben ser aprobados por empleados
  };

  const idComentario = await insertar('comentarios', datosComentario);

  // Crear notificación para administradores
  const sqlAdmins = `SELECT id_usuario FROM usuarios WHERE rol = 'admin' AND activo = TRUE`;
  const admins = await ejecutarConsulta(sqlAdmins);

  for (const admin of admins) {
    await insertar('notificaciones', {
      id_usuario: admin.id_usuario,
      tipo: 'sistema',
      titulo: 'Nuevo Comentario Pendiente',
      mensaje: `Hay un nuevo comentario esperando aprobación`,
      datos_adicionales: JSON.stringify({ idComentario })
    });
  }

  res.status(201).json({
    exito: true,
    mensaje: 'Comentario creado exitosamente. Será visible una vez aprobado.',
    data: {
      idComentario
    }
  });
});

/**
 * Actualizar comentario (solo el autor)
 * PUT /api/comentarios/:idComentario
 */
const actualizarComentario = asyncHandler(async (req, res) => {
  const { idComentario } = req.params;
  const { calificacion, titulo, comentario } = req.body;
  const { id_usuario } = req.usuario;

  // Verificar que el comentario existe y pertenece al usuario
  const sqlVerificar = `
    SELECT id_usuario FROM comentarios WHERE id_comentario = ? LIMIT 1
  `;
  const comentarios = await ejecutarConsulta(sqlVerificar, [idComentario]);

  if (comentarios.length === 0) {
    throw crearError404('Comentario no encontrado');
  }

  if (comentarios[0].id_usuario !== id_usuario) {
    throw crearError403('No puedes editar comentarios de otros usuarios');
  }

  const datosActualizar = {};

  if (calificacion) {
    if (calificacion < 1 || calificacion > 5) {
      throw crearError400('La calificación debe estar entre 1 y 5');
    }
    datosActualizar.calificacion = calificacion;
  }

  if (titulo !== undefined) datosActualizar.titulo = titulo;
  if (comentario !== undefined) datosActualizar.comentario = comentario;

  // Si edita, necesita nueva aprobación
  if (Object.keys(datosActualizar).length > 0) {
    datosActualizar.aprobado = false;
  }

  if (Object.keys(datosActualizar).length === 0) {
    throw crearError400('No hay datos para actualizar');
  }

  await actualizar('comentarios', 'id_comentario', idComentario, datosActualizar);

  res.json({
    exito: true,
    mensaje: 'Comentario actualizado. Será revisado nuevamente antes de publicarse.'
  });
});

/**
 * Eliminar comentario
 * DELETE /api/comentarios/:idComentario
 */
const eliminarComentario = asyncHandler(async (req, res) => {
  const { idComentario } = req.params;
  const { id_usuario, rol } = req.usuario;

  // Verificar que el comentario existe
  const sqlVerificar = `
    SELECT id_usuario FROM comentarios WHERE id_comentario = ? LIMIT 1
  `;
  const comentarios = await ejecutarConsulta(sqlVerificar, [idComentario]);

  if (comentarios.length === 0) {
    throw crearError404('Comentario no encontrado');
  }

  // Solo el autor o un admin pueden eliminar
  if (comentarios[0].id_usuario !== id_usuario && rol !== 'admin') {
    throw crearError403('No tienes permiso para eliminar este comentario');
  }

  // Eliminar permanentemente
  const sql = `DELETE FROM comentarios WHERE id_comentario = ?`;
  await ejecutarConsulta(sql, [idComentario]);

  res.json({
    exito: true,
    mensaje: 'Comentario eliminado exitosamente'
  });
});

/**
 * Aprobar comentario (Empleado/Admin)
 * PUT /api/comentarios/:idComentario/aprobar
 */
const aprobarComentario = asyncHandler(async (req, res) => {
  const { idComentario } = req.params;

  const sqlVerificar = `
    SELECT id_comentario FROM comentarios WHERE id_comentario = ? LIMIT 1
  `;
  const comentarios = await ejecutarConsulta(sqlVerificar, [idComentario]);

  if (comentarios.length === 0) {
    throw crearError404('Comentario no encontrado');
  }

  await actualizar('comentarios', 'id_comentario', idComentario, {
    aprobado: true
  });

  res.json({
    exito: true,
    mensaje: 'Comentario aprobado exitosamente'
  });
});

/**
 * Responder a un comentario (Empleado/Admin)
 * POST /api/comentarios/:idComentario/responder
 */
const responderComentario = asyncHandler(async (req, res) => {
  const { idComentario } = req.params;
  const { respuesta } = req.body;

  if (!respuesta || respuesta.trim() === '') {
    throw crearError400('La respuesta no puede estar vacía');
  }

  const sqlVerificar = `
    SELECT id_usuario FROM comentarios WHERE id_comentario = ? LIMIT 1
  `;
  const comentarios = await ejecutarConsulta(sqlVerificar, [idComentario]);

  if (comentarios.length === 0) {
    throw crearError404('Comentario no encontrado');
  }

  await actualizar('comentarios', 'id_comentario', idComentario, {
    respuesta_hotel: respuesta,
    fecha_respuesta: new Date()
  });

  // Notificar al autor del comentario
  await insertar('notificaciones', {
    id_usuario: comentarios[0].id_usuario,
    tipo: 'sistema',
    titulo: 'Respuesta a tu Comentario',
    mensaje: 'El hotel ha respondido a tu comentario',
    datos_adicionales: JSON.stringify({ idComentario })
  });

  res.json({
    exito: true,
    mensaje: 'Respuesta publicada exitosamente'
  });
});

/**
 * Obtener comentarios pendientes de aprobación (Admin/Empleado)
 * GET /api/comentarios/pendientes/lista
 */
const obtenerComentariosPendientes = asyncHandler(async (req, res) => {
  const sql = `
    SELECT 
      c.id_comentario,
      c.tipo_comentario,
      c.calificacion,
      c.titulo,
      c.comentario,
      c.fecha_comentario,
      c.id_habitacion,
      u.nombre,
      u.apellido,
      u.email,
      h.numero_habitacion
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    LEFT JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    WHERE c.aprobado = FALSE
    ORDER BY c.fecha_comentario ASC
  `;

  const pendientes = await ejecutarConsulta(sql);

  res.json({
    exito: true,
    data: pendientes,
    total: pendientes.length
  });
});

/**
 * Obtener mis comentarios
 * GET /api/comentarios/mis-comentarios
 */
const obtenerMisComentarios = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `
    SELECT 
      c.id_comentario,
      c.tipo_comentario,
      c.calificacion,
      c.titulo,
      c.comentario,
      c.respuesta_hotel,
      c.fecha_comentario,
      c.aprobado,
      h.numero_habitacion,
      t.nombre as tipo_habitacion
    FROM comentarios c
    LEFT JOIN habitaciones h ON c.id_habitacion = h.id_habitacion
    LEFT JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE c.id_usuario = ?
    ORDER BY c.fecha_comentario DESC
  `;

  const comentarios = await ejecutarConsulta(sql, [id_usuario]);

  res.json({
    exito: true,
    data: comentarios,
    total: comentarios.length
  });
});

/**
 * Actualizar calificación promedio de habitación
 * Función auxiliar para actualizar la calificación promedio
 */
const actualizarCalificacionPromedio = async (idHabitacion) => {
  const sql = `
    SELECT 
      COUNT(*) as total,
      AVG(calificacion) as promedio
    FROM comentarios
    WHERE id_habitacion = ? AND aprobado = TRUE
  `;

  const [resultado] = await ejecutarConsulta(sql, [idHabitacion]);

  if (resultado[0].total > 0) {
    const sqlActualizar = `
      UPDATE habitaciones 
      SET calificacion_promedio = ?, total_reseñas = ?
      WHERE id_habitacion = ?
    `;
    await ejecutarConsulta(sqlActualizar, [resultado[0].promedio, resultado[0].total, idHabitacion]);
  }
};

/**
 * Agregar puntos al usuario por comentario
 * Función auxiliar
 */
const agregarPuntosUsuario = async (idUsuario, cantidad, concepto) => {
  try {
    // Actualizar puntos
    const sqlActualizar = `
      UPDATE usuarios 
      SET puntos_acumulados = puntos_acumulados + ?,
          total_reseñas = total_reseñas + 1
      WHERE id_usuario = ?
    `;
    await ejecutarConsulta(sqlActualizar, [cantidad, idUsuario]);

    // Registrar en historial
    const sqlHistorial = `
      INSERT INTO historial_puntos (id_usuario, cantidad, tipo, concepto)
      VALUES (?, ?, 'ganado', ?)
    `;
    await ejecutarConsulta(sqlHistorial, [idUsuario, cantidad, concepto]);
  } catch (error) {
    console.error('Error al agregar puntos:', error);
  }
};

/**
 * Responder comentario mejorado (admin solo)
 * PUT /api/comentarios/:idComentario/responder-admin
 */
const responderComentarioAdmin = asyncHandler(async (req, res) => {
  const { idComentario } = req.params;
  const { respuesta } = req.body;
  const { id_usuario: empleadoId, rol } = req.usuario;

  // Verificar que sea admin
  if (rol !== 'admin') {
    throw crearError403('Solo administradores pueden responder comentarios');
  }

  if (!respuesta || respuesta.trim() === '') {
    throw crearError400('La respuesta no puede estar vacía');
  }

  // Verificar que el comentario existe
  const sqlVerificar = `
    SELECT id_usuario, id_comentario FROM comentarios WHERE id_comentario = ?
  `;
  const [comentarios] = await ejecutarConsulta(sqlVerificar, [idComentario]);

  if (comentarios.length === 0) {
    throw crearError404('Comentario no encontrado');
  }

  const comentario = comentarios[0];

  // Actualizar comentario con respuesta
  const sqlActualizar = `
    UPDATE comentarios
    SET respuesta_hotel = ?,
        fecha_respuesta_hotel = NOW(),
        respondido_por = ?
    WHERE id_comentario = ?
  `;
  await ejecutarConsulta(sqlActualizar, [respuesta, empleadoId, idComentario]);

  // Notificar al usuario que comentó
  const sqlNotificacion = `
    INSERT INTO notificaciones (id_usuario, tipo, titulo, mensaje, datos_adicionales)
    VALUES (?, 'comentario', 'Respuesta a tu Comentario', 'El hotel ha respondido a tu comentario', ?)
  `;
  await ejecutarConsulta(sqlNotificacion, [
    comentario.id_usuario,
    JSON.stringify({ idComentario, tipo: 'respuesta_comentario' })
  ]);

  res.json({
    exito: true,
    mensaje: 'Respuesta agregada al comentario exitosamente',
    comentarioId: idComentario
  });
});

/**
 * Validar que usuario completó la reserva antes de comentar
 * GET /api/comentarios/validar-permiso/:idHabitacion
 */
const validarPermisoComentar = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const { id_usuario } = req.usuario;

  const sql = `
    SELECT r.id_reserva, r.numero_reserva
    FROM reservas r
    WHERE r.usuario_id = ? 
    AND r.habitacion_id = ? 
    AND r.estado = 'completada'
    LIMIT 1
  `;

  const [reservasCompletadas] = await ejecutarConsulta(sql, [id_usuario, idHabitacion]);

  if (reservasCompletadas.length === 0) {
    return res.json({
      exito: false,
      mensaje: 'No tienes una reserva completada en esta habitación',
      puedeComment: false
    });
  }

  // Verificar si ya comentó
  const sqlComentario = `
    SELECT id_comentario FROM comentarios
    WHERE id_usuario = ? AND id_habitacion = ?
    LIMIT 1
  `;

  const [comentariosExistentes] = await ejecutarConsulta(sqlComentario, [id_usuario, idHabitacion]);

  res.json({
    exito: true,
    puedeComment: comentariosExistentes.length === 0,
    mensaje: comentariosExistentes.length > 0 ? 'Ya has comentado esta habitación' : 'Puedes comentar esta habitación',
    reservaId: reservasCompletadas[0].id_reserva,
    numeroReserva: reservasCompletadas[0].numero_reserva
  });
});

/**
 * Obtener estadísticas de comentarios
 * GET /api/comentarios/estadisticas/general
 */
const obtenerEstadisticasComentarios = asyncHandler(async (req, res) => {
  const sqlGeneral = `
    SELECT 
      COUNT(*) as total_comentarios,
      SUM(CASE WHEN aprobado = TRUE THEN 1 ELSE 0 END) as aprobados,
      SUM(CASE WHEN aprobado = FALSE THEN 1 ELSE 0 END) as pendientes,
      AVG(calificacion) as calificacion_promedio,
      SUM(CASE WHEN calificacion = 5 THEN 1 ELSE 0 END) as cinco_estrellas,
      SUM(CASE WHEN calificacion = 4 THEN 1 ELSE 0 END) as cuatro_estrellas,
      SUM(CASE WHEN calificacion = 3 THEN 1 ELSE 0 END) as tres_estrellas,
      SUM(CASE WHEN calificacion = 2 THEN 1 ELSE 0 END) as dos_estrellas,
      SUM(CASE WHEN calificacion = 1 THEN 1 ELSE 0 END) as una_estrella
    FROM comentarios
    WHERE aprobado = TRUE
  `;

  const [estadisticasGeneral] = await ejecutarConsulta(sqlGeneral);

  // Habitaciones mejor calificadas
  const sqlMejores = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      AVG(c.calificacion) as promedio,
      COUNT(*) as total_comentarios
    FROM habitaciones h
    LEFT JOIN comentarios c ON h.id_habitacion = c.id_habitacion AND c.aprobado = TRUE
    GROUP BY h.id_habitacion
    HAVING COUNT(*) > 0
    ORDER BY promedio DESC
    LIMIT 5
  `;

  const [mejoresHabitaciones] = await ejecutarConsulta(sqlMejores);

  // Habitaciones peor calificadas
  const sqlPeores = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      AVG(c.calificacion) as promedio,
      COUNT(*) as total_comentarios
    FROM habitaciones h
    LEFT JOIN comentarios c ON h.id_habitacion = c.id_habitacion AND c.aprobado = TRUE
    GROUP BY h.id_habitacion
    HAVING COUNT(*) > 0
    ORDER BY promedio ASC
    LIMIT 5
  `;

  const [peoresHabitaciones] = await ejecutarConsulta(sqlPeores);

  res.json({
    exito: true,
    data: {
      estadisticasGeneral: estadisticasGeneral[0],
      mejoresHabitaciones: mejoresHabitaciones,
      peoresHabitaciones: peoresHabitaciones
    }
  });
});

module.exports = {
  obtenerComentariosHotel,
  obtenerComentariosHabitacion,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  aprobarComentario,
  responderComentario,
  obtenerComentariosPendientes,
  obtenerMisComentarios,
  responderComentarioAdmin,
  validarPermisoComentar,
  obtenerEstadisticasComentarios,
  actualizarCalificacionPromedio,
  agregarPuntosUsuario
};