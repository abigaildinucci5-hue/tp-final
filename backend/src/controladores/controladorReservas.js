// src/controladores/controladorReservas.js - Gestión de reservas
const { ejecutarConsulta, insertar, actualizar, ejecutarTransaccion } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError400, crearError403 } = require('../middlewares/manejadorErrores');
const { enviarEmailConfirmacionReserva, enviarEmailCancelacionReserva } = require('../servicios/servicioEmail');

/**
 * Calcular precio total de reserva
 */
const calcularPrecioReserva = (precioBase, precioEmpleado, fechaEntrada, fechaSalida, esEmpleado) => {
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
  
  const precioPorNoche = esEmpleado ? precioEmpleado : precioBase;
  const precioTotal = precioPorNoche * noches;
  const descuento = esEmpleado ? (precioBase - precioEmpleado) * noches : 0;

  return {
    noches,
    precioPorNoche,
    precioTotal,
    descuento
  };
};

/**
 * Obtener reservas del usuario o todas (admin/empleado)
 * GET /api/reservas
 */
const obtenerReservas = asyncHandler(async (req, res) => {
  const { rol, id_usuario } = req.usuario;
  const { estado, fechaDesde, fechaHasta } = req.query;

  let sql = `
    SELECT 
      r.id_reserva,
      r.fecha_entrada,
      r.fecha_salida,
      r.hora_entrada,
      r.hora_salida,
      r.numero_huespedes,
      r.precio_total,
      r.descuento_aplicado,
      r.estado,
      r.notas_especiales,
      r.fecha_creacion,
      h.numero_habitacion,
      h.imagen_principal,
      t.nombre as tipo_habitacion,
      u.nombre as nombre_usuario,
      u.apellido as apellido_usuario,
      u.email as email_usuario
    FROM reservas r
    JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    WHERE 1=1
  `;

  const parametros = [];

  // Si es cliente, solo sus reservas
  if (rol === 'cliente') {
    sql += ` AND r.id_usuario = ?`;
    parametros.push(id_usuario);
  }

  // Filtros opcionales
  if (estado) {
    sql += ` AND r.estado = ?`;
    parametros.push(estado);
  }

  if (fechaDesde) {
    sql += ` AND r.fecha_entrada >= ?`;
    parametros.push(fechaDesde);
  }

  if (fechaHasta) {
    sql += ` AND r.fecha_salida <= ?`;
    parametros.push(fechaHasta);
  }

  sql += ` ORDER BY r.fecha_creacion DESC`;

  const reservas = await ejecutarConsulta(sql, parametros);

  res.json({
    exito: true,
    data: reservas,
    total: reservas.length
  });
});

/**
 * Obtener detalles de una reserva
 * GET /api/reservas/:idReserva
 */
const obtenerReserva = asyncHandler(async (req, res) => {
  const { idReserva } = req.params;
  const { rol, id_usuario } = req.usuario;

  const sql = `
    SELECT 
      r.*,
      h.numero_habitacion,
      h.descripcion_detallada,
      h.imagen_principal,
      h.vista,
      t.nombre as tipo_habitacion,
      t.descripcion as tipo_descripcion,
      t.capacidad_personas,
      t.metros_cuadrados,
      u.nombre as nombre_usuario,
      u.apellido as apellido_usuario,
      u.email as email_usuario,
      u.telefono as telefono_usuario,
      confirma.nombre as confirmado_por_nombre
    FROM reservas r
    JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    LEFT JOIN usuarios confirma ON r.confirmada_por = confirma.id_usuario
    WHERE r.id_reserva = ?
    LIMIT 1
  `;

  const reservas = await ejecutarConsulta(sql, [idReserva]);

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada');
  }

  const reserva = reservas[0];

  // Verificar permisos: cliente solo puede ver sus propias reservas
  if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
    throw crearError403('No tienes permiso para ver esta reserva');
  }

  res.json({
    exito: true,
    data: reserva
  });
});

/**
 * Crear nueva reserva
 * POST /api/reservas
 */
const crearReserva = asyncHandler(async (req, res) => {
  const {
    idHabitacion,
    fechaEntrada,
    fechaSalida,
    numeroHuespedes,
    notasEspeciales
  } = req.body;

  const { id_usuario, rol } = req.usuario;

  // Validaciones
  if (!idHabitacion || !fechaEntrada || !fechaSalida || !numeroHuespedes) {
    throw crearError400('Todos los campos son requeridos');
  }

  // Validar fechas
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (entrada < hoy) {
    throw crearError400('La fecha de entrada no puede ser anterior a hoy');
  }

  if (salida <= entrada) {
    throw crearError400('La fecha de salida debe ser posterior a la fecha de entrada');
  }

  // Obtener información de la habitación
  const sqlHabitacion = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.estado,
      t.nombre,
      t.capacidad_personas,
      t.precio_base,
      t.precio_empleado
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.id_habitacion = ? AND h.activo = TRUE
    LIMIT 1
  `;

  const habitaciones = await ejecutarConsulta(sqlHabitacion, [idHabitacion]);

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  const habitacion = habitaciones[0];

  // Verificar capacidad
  if (numeroHuespedes > habitacion.capacidad_personas) {
    throw crearError400(`La habitación solo admite ${habitacion.capacidad_personas} personas`);
  }

  // Verificar disponibilidad
  const sqlDisponibilidad = `
    SELECT id_reserva FROM reservas
    WHERE id_habitacion = ?
    AND estado IN ('pendiente', 'confirmada')
    AND (
      (fecha_entrada <= ? AND fecha_salida > ?)
      OR (fecha_entrada < ? AND fecha_salida >= ?)
      OR (fecha_entrada >= ? AND fecha_salida <= ?)
    )
    LIMIT 1
  `;

  const conflictos = await ejecutarConsulta(sqlDisponibilidad, [
    idHabitacion,
    fechaEntrada, fechaEntrada,
    fechaSalida, fechaSalida,
    fechaEntrada, fechaSalida
  ]);

  if (conflictos.length > 0) {
    throw crearError400('La habitación no está disponible para las fechas seleccionadas');
  }

  // Calcular precio
  const esEmpleado = rol === 'empleado';
  const { precioTotal, descuento } = calcularPrecioReserva(
    habitacion.precio_base,
    habitacion.precio_empleado,
    fechaEntrada,
    fechaSalida,
    esEmpleado
  );

  // Crear reserva
  const datosReserva = {
    id_usuario,
    id_habitacion: idHabitacion,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    numero_huespedes: numeroHuespedes,
    precio_total: precioTotal,
    descuento_aplicado: descuento,
    estado: 'pendiente',
    notas_especiales: notasEspeciales || null
  };

  const idReserva = await insertar('reservas', datosReserva);

  // Obtener datos del usuario para el email
  const sqlUsuario = `
    SELECT nombre, apellido, email FROM usuarios WHERE id_usuario = ?
  `;
  const usuarios = await ejecutarConsulta(sqlUsuario, [id_usuario]);
  const usuario = usuarios[0];

  // Enviar email de confirmación
  try {
    await enviarEmailConfirmacionReserva({
      destinatario: usuario.email,
      nombre: usuario.nombre,
      numeroReserva: idReserva,
      habitacion: habitacion.nombre,
      fechaEntrada,
      fechaSalida,
      precioTotal,
      numeroHuespedes
    });
  } catch (error) {
    console.error('Error al enviar email de confirmación:', error);
  }

  // Crear notificación
  await insertar('notificaciones', {
    id_usuario,
    tipo: 'confirmacion_reserva',
    titulo: 'Reserva Creada',
    mensaje: `Tu reserva #${idReserva} ha sido creada exitosamente`,
    datos_adicionales: JSON.stringify({ idReserva })
  });

  res.status(201).json({
    exito: true,
    mensaje: 'Reserva creada exitosamente',
    data: {
      idReserva,
      numeroReserva: idReserva,
      precioTotal,
      descuento,
      estado: 'pendiente'
    }
  });
});

/**
 * Modificar reserva
 * PUT /api/reservas/:idReserva
 */
const modificarReserva = asyncHandler(async (req, res) => {
  const { idReserva } = req.params;
  const { rol, id_usuario } = req.usuario;
  const { fechaEntrada, fechaSalida, numeroHuespedes, notasEspeciales } = req.body;

  // Obtener reserva actual
  const sqlReserva = `
    SELECT r.*, h.id_tipo, t.precio_base, t.precio_empleado, t.capacidad_personas
    FROM reservas r
    JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE r.id_reserva = ?
    LIMIT 1
  `;

  const reservas = await ejecutarConsulta(sqlReserva, [idReserva]);

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada');
  }

  const reserva = reservas[0];

  // Verificar permisos
  if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
    throw crearError403('No tienes permiso para modificar esta reserva');
  }

  // Solo se pueden modificar reservas pendientes o confirmadas
  if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
    throw crearError400('Esta reserva no se puede modificar');
  }

  const datosActualizar = {};

  // Si se modifican fechas, recalcular precio
  if (fechaEntrada || fechaSalida) {
    const nuevaEntrada = fechaEntrada || reserva.fecha_entrada;
    const nuevaSalida = fechaSalida || reserva.fecha_salida;

    // Validar fechas
    const entrada = new Date(nuevaEntrada);
    const salida = new Date(nuevaSalida);

    if (salida <= entrada) {
      throw crearError400('La fecha de salida debe ser posterior a la de entrada');
    }

    // Verificar disponibilidad (excluyendo la reserva actual)
    const sqlDisponibilidad = `
      SELECT id_reserva FROM reservas
      WHERE id_habitacion = ?
      AND id_reserva != ?
      AND estado IN ('pendiente', 'confirmada')
      AND (
        (fecha_entrada <= ? AND fecha_salida > ?)
        OR (fecha_entrada < ? AND fecha_salida >= ?)
        OR (fecha_entrada >= ? AND fecha_salida <= ?)
      )
      LIMIT 1
    `;

    const conflictos = await ejecutarConsulta(sqlDisponibilidad, [
      reserva.id_habitacion,
      idReserva,
      nuevaEntrada, nuevaEntrada,
      nuevaSalida, nuevaSalida,
      nuevaEntrada, nuevaSalida
    ]);

    if (conflictos.length > 0) {
      throw crearError400('La habitación no está disponible para las nuevas fechas');
    }

    // Recalcular precio
    const esEmpleado = rol === 'empleado';
    const { precioTotal, descuento } = calcularPrecioReserva(
      reserva.precio_base,
      reserva.precio_empleado,
      nuevaEntrada,
      nuevaSalida,
      esEmpleado
    );

    datosActualizar.fecha_entrada = nuevaEntrada;
    datosActualizar.fecha_salida = nuevaSalida;
    datosActualizar.precio_total = precioTotal;
    datosActualizar.descuento_aplicado = descuento;
  }

  if (numeroHuespedes) {
    if (numeroHuespedes > reserva.capacidad_personas) {
      throw crearError400(`La habitación solo admite ${reserva.capacidad_personas} personas`);
    }
    datosActualizar.numero_huespedes = numeroHuespedes;
  }

  if (notasEspeciales !== undefined) {
    datosActualizar.notas_especiales = notasEspeciales;
  }

  if (Object.keys(datosActualizar).length === 0) {
    throw crearError400('No hay datos para actualizar');
  }

  await actualizar('reservas', 'id_reserva', idReserva, datosActualizar);

  res.json({
    exito: true,
    mensaje: 'Reserva modificada exitosamente'
  });
});

/**
 * Cancelar reserva
 * DELETE /api/reservas/:idReserva
 */
const cancelarReserva = asyncHandler(async (req, res) => {
  const { idReserva } = req.params;
  const { rol, id_usuario } = req.usuario;

  // Obtener reserva
  const sqlReserva = `
    SELECT r.*, u.nombre, u.apellido, u.email, h.numero_habitacion, t.nombre as tipo_habitacion
    FROM reservas r
    JOIN usuarios u ON r.id_usuario = u.id_usuario
    JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE r.id_reserva = ?
    LIMIT 1
  `;

  const reservas = await ejecutarConsulta(sqlReserva, [idReserva]);

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada');
  }

  const reserva = reservas[0];

  // Verificar permisos
  if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
    throw crearError403('No tienes permiso para cancelar esta reserva');
  }

  // Solo se pueden cancelar reservas pendientes o confirmadas
  if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
    throw crearError400('Esta reserva no se puede cancelar');
  }

  // Calcular si aplica reembolso (48 horas antes)
  const ahora = new Date();
  const fechaEntrada = new Date(reserva.fecha_entrada);
  const horasHastaEntrada = (fechaEntrada - ahora) / (1000 * 60 * 60);

  const montoReembolso = horasHastaEntrada >= 48 ? reserva.precio_total : 0;

  // Actualizar reserva
  await actualizar('reservas', 'id_reserva', idReserva, {
    estado: 'cancelada',
    fecha_cancelacion: new Date()
  });

  // Enviar email de cancelación
  try {
    await enviarEmailCancelacionReserva({
      destinatario: reserva.email,
      nombre: reserva.nombre,
      numeroReserva: idReserva,
      habitacion: reserva.tipo_habitacion,
      fechaEntrada: reserva.fecha_entrada,
      montoReembolso
    });
  } catch (error) {
    console.error('Error al enviar email de cancelación:', error);
  }

  // Crear notificación
  await insertar('notificaciones', {
    id_usuario: reserva.id_usuario,
    tipo: 'cancelacion',
    titulo: 'Reserva Cancelada',
    mensaje: `Tu reserva #${idReserva} ha sido cancelada`,
    datos_adicionales: JSON.stringify({ idReserva, montoReembolso })
  });

  res.json({
    exito: true,
    mensaje: 'Reserva cancelada exitosamente',
    data: {
      montoReembolso,
      aplicaReembolso: montoReembolso > 0
    }
  });
});

/**
 * Confirmar reserva (Empleado/Admin)
 * PUT /api/reservas/:idReserva/confirmar
 */
const confirmarReserva = asyncHandler(async (req, res) => {
  const { idReserva } = req.params;
  const { id_usuario } = req.usuario;

  const sqlReserva = `SELECT estado FROM reservas WHERE id_reserva = ? LIMIT 1`;
  const reservas = await ejecutarConsulta(sqlReserva, [idReserva]);

  if (reservas.length === 0) {
    throw crearError404('Reserva no encontrada');
  }

  if (reservas[0].estado !== 'pendiente') {
    throw crearError400('Solo se pueden confirmar reservas pendientes');
  }

  await actualizar('reservas', 'id_reserva', idReserva, {
    estado: 'confirmada',
    confirmada_por: id_usuario
  });

  res.json({
    exito: true,
    mensaje: 'Reserva confirmada exitosamente'
  });
});

/**
 * Obtener historial de reservas del usuario
 * GET /api/reservas/usuario/historial
 */
const obtenerHistorial = asyncHandler(async (req, res) => {
  const { id_usuario } = req.usuario;

  const sql = `
    SELECT 
      r.id_reserva,
      r.fecha_entrada,
      r.fecha_salida,
      r.precio_total,
      r.estado,
      r.fecha_creacion,
      h.numero_habitacion,
      h.imagen_principal,
      t.nombre as tipo_habitacion
    FROM reservas r
    JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE r.id_usuario = ?
    ORDER BY r.fecha_creacion DESC
  `;

  const historial = await ejecutarConsulta(sql, [id_usuario]);

  // Separar por estado
  const activas = historial.filter(r => ['pendiente', 'confirmada'].includes(r.estado));
  const pasadas = historial.filter(r => r.estado === 'completada');
  const canceladas = historial.filter(r => r.estado === 'cancelada');

  res.json({
    exito: true,
    data: {
      activas,
      pasadas,
      canceladas,
      total: historial.length
    }
  });
});

/**
 * Crear reserva con sistema de puntos mejorado
 * POST /api/reservas/crear-con-puntos
 */
const crearReservaConPuntos = asyncHandler(async (req, res) => {
  const {
    idHabitacion,
    fechaEntrada,
    fechaSalida,
    numeroHuespedes,
    horaLlegadaEstimada,
    solicitudesEspeciales,
    metodoPago,
    opcionesAdicionales,
    usarPuntos,
    idCanjeoPuntos
  } = req.body;

  const { id_usuario, rol } = req.usuario;

  // Validaciones básicas
  if (!idHabitacion || !fechaEntrada || !fechaSalida || !numeroHuespedes) {
    throw crearError400('Todos los campos requeridos deben estar presentes');
  }

  // Obtener información de la habitación
  const sqlHabitacion = `
    SELECT h.id_habitacion, h.numero_habitacion, t.precio_base, t.precio_empleado, t.capacidad_personas
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.id_habitacion = ? AND h.activo = TRUE
  `;

  const [habitaciones] = await ejecutarConsulta(sqlHabitacion, [idHabitacion]);

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  const habitacion = habitaciones[0];

  // Verificar capacidad
  if (numeroHuespedes > habitacion.capacidad_personas) {
    throw crearError400(`La habitación solo admite ${habitacion.capacidad_personas} personas`);
  }

  // Verificar disponibilidad
  const sqlDisponibilidad = `
    SELECT id_reserva FROM reservas
    WHERE id_habitacion = ? AND estado IN ('confirmada', 'en_curso')
    AND ((fecha_entrada <= ? AND fecha_salida > ?) 
         OR (fecha_entrada < ? AND fecha_salida >= ?) 
         OR (fecha_entrada >= ? AND fecha_salida <= ?))
    LIMIT 1
  `;

  const [conflictos] = await ejecutarConsulta(sqlDisponibilidad, [
    idHabitacion,
    fechaEntrada, fechaEntrada,
    fechaSalida, fechaSalida,
    fechaEntrada, fechaSalida
  ]);

  if (conflictos.length > 0) {
    throw crearError400('La habitación no está disponible para esas fechas');
  }

  // Calcular desglose de precios
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
  
  const precioPorNoche = rol === 'empleado' ? habitacion.precio_empleado : habitacion.precio_base;
  const precioTotal = precioPorNoche * noches;
  const impuestos = Math.round(precioTotal * 0.21 * 100) / 100; // IVA 21%
  const precioFinal = precioTotal + impuestos;

  // Aplicar canje de puntos si existe
  let descuentoPuntos = 0;
  let idCanjeUsado = null;
  
  if (usarPuntos && idCanjeoPuntos) {
    const sqlCanje = `
      SELECT descuento_obtenido FROM canje_puntos
      WHERE id = ? AND id_usuario = ? AND estado = 'pendiente'
    `;
    const [canjes] = await ejecutarConsulta(sqlCanje, [idCanjeoPuntos, id_usuario]);
    
    if (canjes.length > 0) {
      descuentoPuntos = canjes[0].descuento_obtenido;
      idCanjeUsado = idCanjeoPuntos;
    }
  }

  const precioAbonar = precioFinal - descuentoPuntos;

  // Desglose de precio
  const desglosePrecios = {
    precioPorNoche: precioPorNoche,
    noches: noches,
    subtotal: precioTotal,
    impuestos: impuestos,
    descuentoPuntos: descuentoPuntos,
    total: precioAbonar
  };

  // Generar número de reserva único
  const numeroReserva = `LU${Date.now()}${Math.floor(Math.random() * 1000)}`;

  // Crear reserva
  const datosReserva = {
    id_usuario: id_usuario,
    id_habitacion: idHabitacion,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    numero_huespedes: numeroHuespedes,
    precio_total: precioAbonar,
    descuento_aplicado: descuentoPuntos,
    estado: metodoPago === 'transferencia' ? 'pendiente_pago' : 'confirmada',
    numero_reserva: numeroReserva,
    hora_llegada_estimada: horaLlegadaEstimada || null,
    solicitudes_especiales: solicitudesEspeciales || null,
    metodo_pago: metodoPago || 'tarjeta',
    opciones_adicionales: JSON.stringify(opcionesAdicionales || {}),
    desglose_precio: JSON.stringify(desglosePrecios),
    puntos_ganados: Math.floor(precioAbonar / 10) // 1 punto por cada 10 unidades gastadas
  };

  const [resultado] = await insertar('reservas', datosReserva);

  // Si usó puntos, actualizar canje
  if (idCanjeUsado) {
    const sqlActualizarCanje = `UPDATE canje_puntos SET estado = 'aplicado', aplicado_a_reserva = ? WHERE id = ?`;
    await ejecutarConsulta(sqlActualizarCanje, [resultado.insertId, idCanjeUsado]);
  }

  // Agregar puntos ganados
  const sqlPuntos = `
    INSERT INTO historial_puntos (id_usuario, cantidad, tipo, concepto, referencia_id, referencia_tipo)
    VALUES (?, ?, 'ganado', 'Puntos por reserva', ?, 'reserva')
  `;
  await ejecutarConsulta(sqlPuntos, [id_usuario, datosReserva.puntos_ganados, resultado.insertId]);

  res.status(201).json({
    exito: true,
    mensaje: 'Reserva creada exitosamente',
    data: {
      reservaId: resultado.insertId,
      numeroReserva: numeroReserva,
      desglose: desglosePrecios,
      puntosGanados: datosReserva.puntos_ganados,
      estado: datosReserva.estado
    }
  });
});

/**
 * Verificar disponibilidad de habitación
 * GET /api/reservas/disponibilidad/:idHabitacion
 */
const verificarDisponibilidad = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const { fechaEntrada, fechaSalida } = req.query;

  if (!fechaEntrada || !fechaSalida) {
    throw crearError400('Fechas de entrada y salida son requeridas');
  }

  const sql = `
    SELECT COUNT(*) as conflictos FROM reservas
    WHERE id_habitacion = ? AND estado IN ('confirmada', 'en_curso')
    AND ((fecha_entrada <= ? AND fecha_salida > ?)
         OR (fecha_entrada < ? AND fecha_salida >= ?)
         OR (fecha_entrada >= ? AND fecha_salida <= ?))
  `;

  const [resultado] = await ejecutarConsulta(sql, [
    idHabitacion,
    fechaEntrada, fechaEntrada,
    fechaSalida, fechaSalida,
    fechaEntrada, fechaSalida
  ]);

  const disponible = resultado[0].conflictos === 0;

  res.json({
    exito: true,
    disponible: disponible,
    mensaje: disponible ? 'Habitación disponible' : 'Habitación no disponible'
  });
});

/**
 * Obtener precio estimado de reserva
 * POST /api/reservas/precio-estimado
 */
const obtenerPrecioEstimado = asyncHandler(async (req, res) => {
  const { idHabitacion, fechaEntrada, fechaSalida } = req.body;
  const { rol } = req.usuario;

  if (!idHabitacion || !fechaEntrada || !fechaSalida) {
    throw crearError400('ID de habitación y fechas son requeridos');
  }

  // Obtener precio de la habitación
  const sqlHabitacion = `
    SELECT t.precio_base, t.precio_empleado
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.id_habitacion = ?
  `;

  const [habitaciones] = await ejecutarConsulta(sqlHabitacion, [idHabitacion]);

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  const habitacion = habitaciones[0];
  
  // Calcular noches
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

  const precioPorNoche = rol === 'empleado' ? habitacion.precio_empleado : habitacion.precio_base;
  const subtotal = precioPorNoche * noches;
  const impuestos = Math.round(subtotal * 0.21 * 100) / 100;
  const total = subtotal + impuestos;

  res.json({
    exito: true,
    data: {
      precioPorNoche: precioPorNoche,
      noches: noches,
      subtotal: subtotal,
      impuestos: impuestos,
      total: total,
      esEmpleado: rol === 'empleado'
    }
  });
});

/**
 * Procesar pago de reserva (simulado)
 * POST /api/reservas/procesar-pago
 */
const procesarPago = asyncHandler(async (req, res) => {
  const {
    habitacionId,
    fechaEntrada,
    fechaSalida,
    numeroHuespedes,
    metodoPago,
    opcionesAdicionales,
    puntosAUtilizar
  } = req.body;

  const usuarioId = req.usuario.id_usuario;

  // Validar inputs
  if (!habitacionId || !fechaEntrada || !fechaSalida || !numeroHuespedes || !metodoPago) {
    throw crearError400('Faltan datos requeridos para procesar el pago');
  }

  // ====== OBTENER DATOS DE LA HABITACIÓN ======
  const [habitaciones] = await ejecutarConsulta(
    `SELECT h.*, t.precio_base FROM habitaciones h 
     INNER JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo 
     WHERE h.id_habitacion = ?`,
    [habitacionId]
  );

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  const habitacion = habitaciones[0];

  // ====== CALCULAR PRECIO ======
  const entrada = new Date(fechaEntrada);
  const salida = new Date(fechaSalida);
  const diasEstancia = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));

  if (diasEstancia <= 0) {
    throw crearError400('Las fechas de entrada y salida no son válidas');
  }

  let precioBase = habitacion.precio_base * diasEstancia;
  let precioAdicionales = 0;

  // Calcular opciones adicionales
  if (opcionesAdicionales) {
    if (opcionesAdicionales.desayuno) {
      precioAdicionales += 15 * numeroHuespedes * diasEstancia;
    }
    if (opcionesAdicionales.camaExtra) {
      precioAdicionales += 20 * diasEstancia;
    }
    if (opcionesAdicionales.transporte) {
      precioAdicionales += 25;
    }
  }

  // Impuestos (21%)
  const impuestosBase = (precioBase + precioAdicionales) * 0.21;
  let precioTotal = precioBase + precioAdicionales + impuestosBase;

  // ====== APLICAR DESCUENTO POR PUNTOS ======
  let descuentoPuntos = 0;
  let puntosCanjeados = 0;
  const controladorPuntos = require('./controladorPuntos');

  if (puntosAUtilizar && puntosAUtilizar > 0) {
    try {
      // Canjear puntos
      const resultadoCanje = await controladorPuntos.canjearPuntos(
        usuarioId,
        puntosAUtilizar,
        'Descuento en reserva'
      );

      // Calcular descuento (1 punto = 0.05 dólares)
      descuentoPuntos = puntosAUtilizar * 0.05;
      puntosCanjeados = puntosAUtilizar;

      precioTotal = Math.max(0, precioTotal - descuentoPuntos);
    } catch (error) {
      console.error('Error canjeando puntos:', error.message);
      // Continuar sin descuento si hay error
    }
  }

  // ====== GENERAR NÚMERO DE CONFIRMACIÓN ======
  const numeroConfirmacion = 'RES' + Date.now().toString().slice(-10);

  // ====== SIMULAR PROCESAMIENTO DE PAGO ======
  // En una aplicación real, aquí se integraría con un gateway de pago
  const numeroProceso = 'TRX' + Math.random().toString(36).substring(2, 15).toUpperCase();

  // ====== CREAR RESERVA EN LA BASE DE DATOS ======
  const [resultado] = await insertar('reservas', {
    id_usuario: usuarioId,
    id_habitacion: habitacionId,
    fecha_entrada: fechaEntrada,
    fecha_salida: fechaSalida,
    numero_huespedes: numeroHuespedes,
    precio_total: precioTotal,
    descuento_aplicado: descuentoPuntos,
    metodo_pago: metodoPago,
    opciones_adicionales: JSON.stringify(opcionesAdicionales || {}),
    desglose_precio: JSON.stringify({
      precioBase: precioBase,
      adiciones: precioAdicionales,
      impuestos: impuestosBase,
      descuento_puntos: descuentoPuntos,
      total: precioTotal
    }),
    numero_confirmacion: numeroConfirmacion,
    puntos_utilizados: puntosCanjeados,
    estado: 'confirmada',
    notas_especiales: req.body.notasEspeciales || null
  });

  // ====== REGISTRAR TRANSACCIÓN DE PAGO ======
  await insertar('transacciones_pago', {
    id_reserva: resultado.insertId,
    id_usuario: usuarioId,
    monto: precioTotal,
    metodo_pago: metodoPago,
    estado: 'procesada',
    numero_transaccion: numeroProceso,
    respuesta_pago: JSON.stringify({
      estatus: 'aprobado',
      numero_transaccion: numeroProceso,
      moneda: 'USD',
      timestamp: new Date().toISOString()
    })
  });

  // ====== AGREGAR PUNTOS POR NUEVA RESERVA ======
  // El usuario gana 100 puntos por cada reserva completada
  await controladorPuntos.agregarPuntos(
    usuarioId,
    100,
    'Reserva completada',
    resultado.insertId
  );

  // ====== RESPUESTA EXITOSA ======
  res.status(201).json({
    exito: true,
    mensaje: 'Pago procesado y reserva confirmada exitosamente',
    data: {
      reservaId: resultado.insertId,
      numeroConfirmacion: numeroConfirmacion,
      numeroTransaccion: numeroProceso,
      resumen: {
        precioBase: precioBase,
        adiciones: precioAdicionales,
        impuestos: impuestosBase,
        descuentoPuntos: descuentoPuntos,
        puntosUtilizados: puntosCanjeados,
        puntosGanados: 100,
        precioFinal: precioTotal
      },
      detalles: {
        habitacionId: habitacionId,
        fechaEntrada: fechaEntrada,
        fechaSalida: fechaSalida,
        diasEstancia: diasEstancia,
        numeroHuespedes: numeroHuespedes,
        metodoPago: metodoPago,
        opcionesAdicionales: opcionesAdicionales
      },
      fechaProcesamiento: new Date().toISOString()
    }
  });
});

module.exports = {
  obtenerReservas,
  obtenerReserva,
  crearReserva,
  modificarReserva,
  cancelarReserva,
  confirmarReserva,
  obtenerHistorial,
  crearReservaConPuntos,
  verificarDisponibilidad,
  obtenerPrecioEstimado,
  procesarPago
};