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

module.exports = {
  obtenerComentariosHotel,
  obtenerComentariosHabitacion,
  crearComentario,
  actualizarComentario,
  eliminarComentario,
  aprobarComentario,
  responderComentario,
  obtenerComentariosPendientes,
  obtenerMisComentarios
};