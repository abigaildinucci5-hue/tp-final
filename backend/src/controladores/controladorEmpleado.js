// src/controladores/controladorEmpleado.js - Gestión de operaciones de empleado/recepcionista

const { ejecutarConsulta, insertar, actualizar, ejecutarTransaccion } = require('../config/baseDatos');
const { asyncHandler, crearError400, crearError403, crearError404 } = require('../middlewares/manejadorErrores');

// ============================================================
// OBTENER RESERVAS DEL DÍA
// ============================================================
exports.obtenerReservasHoy = asyncHandler(async (req, res) => {
  const empleadoId = req.usuario.id_usuario;
  const hoy = new Date().toISOString().split('T')[0];

  const sql = `
    SELECT 
      r.id_reserva,
      r.fecha_entrada,
      r.fecha_salida,
      r.hora_entrada,
      r.estado,
      r.numero_reserva,
      r.hora_llegada_estimada,
      r.solicitudes_especiales,
      h.numero_habitacion,
      h.capacidad,
      h.imagen_principal,
      t.nombre as tipo_habitacion,
      u.id_usuario,
      u.nombre as nombre_huesped,
      u.email as email_huesped,
      u.telefono,
      DATEDIFF(r.fecha_salida, r.fecha_entrada) as noches,
      rc.id as tiene_checkin
    FROM reservas r
    INNER JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    INNER JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN registro_checkin rc ON r.id_reserva = rc.id_reserva AND rc.tipo = 'check_in'
    WHERE DATE(r.fecha_entrada) = ?
      AND r.estado IN ('confirmada', 'en_curso')
    ORDER BY r.hora_llegada_estimada ASC, r.fecha_entrada ASC
  `;

  const [reservas] = await ejecutarConsulta(sql, [hoy]);

  res.json({
    exito: true,
    mensaje: `${reservas.length} reservas para hoy`,
    cantidad: reservas.length,
    reservas: reservas.map(r => ({
      ...r,
      tieneCheckin: r.tiene_checkin ? true : false
    }))
  });
});

// ============================================================
// REALIZAR CHECK-IN
// ============================================================
exports.hacerCheckIn = asyncHandler(async (req, res) => {
  const { id: reservaId } = req.params;
  const { observaciones, horaEntrada } = req.body;
  const empleadoId = req.usuario.id_usuario;

  // Validar inputs
  if (!reservaId) {
    throw crearError400('ID de reserva requerido');
  }

  // Verificar que la reserva existe
  const [reservas] = await ejecutarConsulta(
    'SELECT * FROM reservas WHERE id_reserva = ?',
    [reservaId]
  );

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada');
  }

  const reserva = reservas[0];

  // Iniciar transacción
  await ejecutarTransaccion(async (connection) => {
    // 1. Actualizar estado de reserva a 'en_curso'
    await actualizar('reservas', 
      { estado: 'en_curso', confirmado_por: empleadoId },
      { id_reserva: reservaId }
    );

    // 2. Registrar check-in
    await insertar('registro_checkin', {
      id_reserva: reservaId,
      tipo: 'check_in',
      realizado_por: empleadoId,
      observaciones: observaciones || null,
      hora_entrada: horaEntrada || null
    });

    // 3. Cambiar estado de habitación a 'ocupada'
    const estadoExistente = await ejecutarConsulta(
      'SELECT id FROM estados_habitaciones WHERE id_habitacion = ?',
      [reserva.id_habitacion]
    );

    if (estadoExistente[0].length > 0) {
      await actualizar('estados_habitaciones',
        { estado: 'ocupada', actualizado_por: empleadoId },
        { id_habitacion: reserva.id_habitacion }
      );
    } else {
      await insertar('estados_habitaciones', {
        id_habitacion: reserva.id_habitacion,
        estado: 'ocupada',
        actualizado_por: empleadoId
      });
    }

    // 4. Registrar en auditoría
    await insertar('auditoria', {
      id_usuario: empleadoId,
      tabla_afectada: 'reservas',
      tipo_accion: 'update',
      id_registro: reservaId,
      datos_nuevos: JSON.stringify({ estado: 'en_curso' })
    });
  });

  res.json({
    exito: true,
    mensaje: 'Check-in realizado exitosamente',
    reservaId: reservaId
  });
});

// ============================================================
// REALIZAR CHECK-OUT
// ============================================================
exports.hacerCheckOut = asyncHandler(async (req, res) => {
  const { id: reservaId } = req.params;
  const { observaciones, horaSalida } = req.body;
  const empleadoId = req.usuario.id_usuario;

  if (!reservaId) {
    throw crearError400('ID de reserva requerido');
  }

  // Verificar que la reserva existe y está en curso
  const [reservas] = await ejecutarConsulta(
    'SELECT * FROM reservas WHERE id_reserva = ? AND estado = "en_curso"',
    [reservaId]
  );

  if (reservas.length === 0) {
    throw crearError404('Reserva en curso no encontrada');
  }

  const reserva = reservas[0];

  await ejecutarTransaccion(async (connection) => {
    // 1. Actualizar estado de reserva a 'completada'
    await actualizar('reservas',
      { estado: 'completada' },
      { id_reserva: reservaId }
    );

    // 2. Registrar check-out
    await insertar('registro_checkin', {
      id_reserva: reservaId,
      tipo: 'check_out',
      realizado_por: empleadoId,
      observaciones: observaciones || null,
      hora_salida: horaSalida || null
    });

    // 3. Cambiar estado de habitación a 'limpieza'
    await actualizar('estados_habitaciones',
      { estado: 'limpieza', actualizado_por: empleadoId },
      { id_habitacion: reserva.id_habitacion }
    );

    // 4. Dar puntos al usuario por reserva completada
    const puntosGanados = 100;
    await actualizar('usuarios',
      { 
        puntos_acumulados: ejecutarConsulta(
          'SELECT puntos_acumulados + ? FROM usuarios WHERE id_usuario = ?',
          [puntosGanados, reserva.id_usuario]
        ),
        total_reservas: ejecutarConsulta(
          'SELECT total_reservas + 1 FROM usuarios WHERE id_usuario = ?',
          [, reserva.id_usuario]
        )
      },
      { id_usuario: reserva.id_usuario }
    );

    // Usar UPDATE directo para los puntos
    await ejecutarConsulta(
      'UPDATE usuarios SET puntos_acumulados = puntos_acumulados + ?, total_reservas = total_reservas + 1 WHERE id_usuario = ?',
      [puntosGanados, reserva.id_usuario]
    );

    // 5. Registrar en historial de puntos
    await insertar('historial_puntos', {
      id_usuario: reserva.id_usuario,
      cantidad: puntosGanados,
      tipo: 'ganado',
      concepto: 'Reserva completada',
      referencia_id: reservaId,
      referencia_tipo: 'reserva'
    });

    // 6. Registrar en auditoría
    await insertar('auditoria', {
      id_usuario: empleadoId,
      tabla_afectada: 'reservas',
      tipo_accion: 'update',
      id_registro: reservaId,
      datos_nuevos: JSON.stringify({ estado: 'completada' })
    });
  });

  res.json({
    exito: true,
    mensaje: 'Check-out realizado exitosamente',
    puntosGanados: 100,
    reservaId: reservaId
  });
});

// ============================================================
// CAMBIAR ESTADO DE HABITACIÓN
// ============================================================
exports.cambiarEstadoHabitacion = asyncHandler(async (req, res) => {
  const { id: habitacionId } = req.params;
  const { estado } = req.body;
  const empleadoId = req.usuario.id_usuario;

  // Validar inputs
  if (!habitacionId) {
    throw crearError400('ID de habitación requerido');
  }

  if (!estado || !['disponible', 'ocupada', 'limpieza', 'mantenimiento'].includes(estado)) {
    throw crearError400('Estado inválido. Debe ser: disponible, ocupada, limpieza o mantenimiento');
  }

  // Verificar que la habitación existe
  const [habitaciones] = await ejecutarConsulta(
    'SELECT * FROM habitaciones WHERE id_habitacion = ?',
    [habitacionId]
  );

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  // Actualizar o crear estado
  const [estadoExistente] = await ejecutarConsulta(
    'SELECT id FROM estados_habitaciones WHERE id_habitacion = ?',
    [habitacionId]
  );

  if (estadoExistente.length > 0) {
    await actualizar('estados_habitaciones',
      { 
        estado: estado,
        actualizado_por: empleadoId,
        fecha_actualizacion: new Date()
      },
      { id_habitacion: habitacionId }
    );
  } else {
    await insertar('estados_habitaciones', {
      id_habitacion: habitacionId,
      estado: estado,
      actualizado_por: empleadoId
    });
  }

  // Registrar en auditoría
  await insertar('auditoria', {
    id_usuario: empleadoId,
    tabla_afectada: 'estados_habitaciones',
    tipo_accion: 'update',
    id_registro: habitacionId,
    datos_nuevos: JSON.stringify({ estado: estado })
  });

  res.json({
    exito: true,
    mensaje: `Estado de habitación actualizado a: ${estado}`,
    habitacionId: habitacionId,
    nuevoEstado: estado
  });
});

// ============================================================
// OBTENER SOLICITUDES PENDIENTES
// ============================================================
exports.obtenerSolicitudesPendientes = asyncHandler(async (req, res) => {
  const { estado } = req.query;

  let sql = `
    SELECT 
      sh.id,
      sh.id_reserva,
      sh.tipo,
      sh.descripcion,
      sh.estado,
      sh.prioridad,
      sh.fecha_creacion,
      sh.fecha_resolucion,
      h.numero_habitacion,
      t.nombre as tipo_habitacion,
      u.nombre as nombre_huesped,
      u.email as email_huesped,
      u.telefono,
      r.numero_reserva,
      DATEDIFF(NOW(), sh.fecha_creacion) as minutos_espera
    FROM solicitudes_huespedes sh
    INNER JOIN reservas r ON sh.id_reserva = r.id_reserva
    INNER JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    INNER JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    INNER JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE 1=1
  `;

  const parametros = [];

  // Filtrar por estado si se proporciona
  if (estado) {
    sql += ' AND sh.estado = ?';
    parametros.push(estado);
  } else {
    sql += ' AND sh.estado IN ("pendiente", "en_proceso")';
  }

  sql += ' ORDER BY sh.prioridad DESC, sh.fecha_creacion ASC';

  const [solicitudes] = await ejecutarConsulta(sql, parametros);

  res.json({
    exito: true,
    cantidad: solicitudes.length,
    solicitudes: solicitudes
  });
});

// ============================================================
// RESOLVER SOLICITUD
// ============================================================
exports.resolverSolicitud = asyncHandler(async (req, res) => {
  const { id: solicitudId } = req.params;
  const { observaciones } = req.body;
  const empleadoId = req.usuario.id_usuario;

  if (!solicitudId) {
    throw crearError400('ID de solicitud requerido');
  }

  // Verificar que la solicitud existe
  const [solicitudes] = await ejecutarConsulta(
    'SELECT * FROM solicitudes_huespedes WHERE id = ?',
    [solicitudId]
  );

  if (solicitudes.length === 0) {
    throw crearError404('Solicitud no encontrada');
  }

  const solicitud = solicitudes[0];

  // Actualizar solicitud
  await actualizar('solicitudes_huespedes',
    {
      estado: 'resuelta',
      resuelto_por: empleadoId,
      fecha_resolucion: new Date(),
      observaciones: observaciones || null
    },
    { id: solicitudId }
  );

  // Registrar en auditoría
  await insertar('auditoria', {
    id_usuario: empleadoId,
    tabla_afectada: 'solicitudes_huespedes',
    tipo_accion: 'update',
    id_registro: solicitudId,
    datos_nuevos: JSON.stringify({ estado: 'resuelta' })
  });

  res.json({
    exito: true,
    mensaje: 'Solicitud resuelta exitosamente',
    solicitudId: solicitudId,
    tiempoResolucion: `${Math.round((new Date() - solicitud.fecha_creacion) / 60000)} minutos`
  });
});

// ============================================================
// OBTENER ESTADO DE HABITACIONES
// ============================================================
exports.obtenerEstadoHabitaciones = asyncHandler(async (req, res) => {
  const sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.capacidad,
      h.imagen_principal,
      t.nombre as tipo_habitacion,
      eh.estado,
      eh.actualizado_por,
      eh.fecha_actualizacion,
      (SELECT COUNT(*) FROM reservas r 
       WHERE r.id_habitacion = h.id_habitacion 
       AND r.estado NOT IN ('cancelada', 'completada')
       AND DATE(r.fecha_entrada) <= CURDATE()
       AND DATE(r.fecha_salida) > CURDATE()) as tiene_reserva_activa,
      (SELECT u.nombre FROM usuarios u WHERE u.id_usuario = eh.actualizado_por) as actualizado_por_nombre
    FROM habitaciones h
    LEFT JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    LEFT JOIN estados_habitaciones eh ON h.id_habitacion = eh.id_habitacion
    ORDER BY h.numero_habitacion ASC
  `;

  const [habitaciones] = await ejecutarConsulta(sql);

  // Agrupar por estado
  const habitacionesPorEstado = {
    disponible: [],
    ocupada: [],
    limpieza: [],
    mantenimiento: []
  };

  habitaciones.forEach(h => {
    const estado = h.estado || 'disponible';
    habitacionesPorEstado[estado].push(h);
  });

  res.json({
    exito: true,
    resumen: {
      disponible: habitacionesPorEstado.disponible.length,
      ocupada: habitacionesPorEstado.ocupada.length,
      limpieza: habitacionesPorEstado.limpieza.length,
      mantenimiento: habitacionesPorEstado.mantenimiento.length,
      total: habitaciones.length
    },
    habitacionesPorEstado: habitacionesPorEstado,
    detalles: habitaciones
  });
});

// ============================================================
// CREAR SOLICITUD (desde empleado)
// ============================================================
exports.crearSolicitud = asyncHandler(async (req, res) => {
  const { idReserva, tipo, descripcion, prioridad } = req.body;
  const empleadoId = req.usuario.id_usuario;

  // Validar inputs
  if (!idReserva || !tipo || !descripcion) {
    throw crearError400('Faltan datos requeridos: idReserva, tipo, descripcion');
  }

  // Verificar que la reserva existe
  const [reservas] = await ejecutarConsulta(
    'SELECT * FROM reservas WHERE id_reserva = ? AND estado IN ("confirmada", "en_curso")',
    [idReserva]
  );

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada o no está activa');
  }

  // Crear solicitud
  const [resultado] = await insertar('solicitudes_huespedes', {
    id_reserva: idReserva,
    tipo: tipo,
    descripcion: descripcion,
    prioridad: prioridad || 'media',
    estado: 'pendiente',
    creado_por: empleadoId
  });

  res.status(201).json({
    exito: true,
    mensaje: 'Solicitud creada exitosamente',
    solicitudId: resultado.insertId
  });
});

// ============================================================
// OBTENER REPORTE DE HUÉSPEDES
// ============================================================
exports.obtenerReporteHuespedes = asyncHandler(async (req, res) => {
  const { fechaDesde, fechaHasta } = req.query;

  let sql = `
    SELECT 
      u.id_usuario,
      u.nombre,
      u.email,
      u.telefono,
      COUNT(DISTINCT r.id_reserva) as total_reservas,
      SUM(r.precio_total) as gasto_total,
      AVG(c.calificacion) as calificacion_promedio,
      MAX(r.fecha_entrada) as ultima_visita,
      u.puntos_acumulados,
      u.total_reseñas
    FROM usuarios u
    LEFT JOIN reservas r ON u.id_usuario = r.id_usuario
    LEFT JOIN comentarios c ON u.id_usuario = c.id_usuario
    WHERE u.rol = 'usuario'
  `;

  const parametros = [];

  if (fechaDesde) {
    sql += ' AND r.fecha_entrada >= ?';
    parametros.push(fechaDesde);
  }

  if (fechaHasta) {
    sql += ' AND r.fecha_entrada <= ?';
    parametros.push(fechaHasta);
  }

  sql += ' GROUP BY u.id_usuario ORDER BY gasto_total DESC';

  const [huespedes] = await ejecutarConsulta(sql, parametros);

  res.json({
    exito: true,
    cantidad: huespedes.length,
    huespedes: huespedes
  });
});

// ============================================================
// OBTENER HISTORIAL DE USUARIO
// ============================================================
exports.obtenerHistorialHuesped = asyncHandler(async (req, res) => {
  const { usuarioId } = req.params;

  const sql = `
    SELECT 
      r.id_reserva,
      r.numero_reserva,
      r.fecha_entrada,
      r.fecha_salida,
      r.estado,
      h.numero_habitacion,
      t.nombre as tipo_habitacion,
      r.precio_total,
      c.calificacion,
      c.comentario,
      c.fecha as fecha_comentario
    FROM reservas r
    LEFT JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    LEFT JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    LEFT JOIN comentarios c ON r.id_reserva = c.id_reserva
    WHERE r.id_usuario = ?
    ORDER BY r.fecha_entrada DESC
  `;

  const [historial] = await ejecutarConsulta(sql, [usuarioId]);

  res.json({
    exito: true,
    cantidad: historial.length,
    historial: historial
  });
});

module.exports = exports;
