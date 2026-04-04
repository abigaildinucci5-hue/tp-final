// src/controladores/controladorHabitaciones.js - Gestión de habitaciones
const { ejecutarConsulta, insertar, actualizar, eliminar } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError400 } = require('../middlewares/manejadorErrores');

/**
 * Obtener habitaciones populares (para el home)
 * GET /api/habitaciones?limite=8 o ?limit=8
 */
const obtenerHabitacionesPopulares = asyncHandler(async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  let limit = req.query.limite ?? req.query.limit;
  limit = Number.isInteger(Number(limit)) && Number(limit) > 0 ? Number(limit) : 8;

  const sql = `
    SELECT 
      h.*, t.nombre as tipo_nombre, t.descripcion as tipo_descripcion,
      t.capacidad_personas, t.precio_base, t.precio_empleado, t.metros_cuadrados
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.activo = TRUE AND h.estado = 'disponible'
    ORDER BY h.id_habitacion DESC
    LIMIT ?
  `;

  const habitaciones = await ejecutarConsulta(sql, [limit]);

  if (req.usuario) {
    const sqlFavoritos = `SELECT id_habitacion FROM favoritos WHERE id_usuario = ?`;
    const favoritos = await ejecutarConsulta(sqlFavoritos, [req.usuario.id_usuario]);
    const idsFavoritos = favoritos.map(f => f.id_habitacion);
    habitaciones.forEach(h => { h.es_favorito = idsFavoritos.includes(h.id_habitacion); });
  }

  const datosFormateados = habitaciones.map(h => {
    let amenidades = [];
    let galeria_imagenes = [];
    try {
      amenidades = typeof h.amenidades === 'string' ? JSON.parse(h.amenidades) : (h.amenidades || []);
      galeria_imagenes = typeof h.galeria_imagenes === 'string' ? JSON.parse(h.galeria_imagenes) : (h.galeria_imagenes || []);
    } catch (e) {}

    return {
      id: h.id_habitacion,
      id_habitacion: h.id_habitacion,
      numero: h.numero_habitacion,
      numero_habitacion: h.numero_habitacion,
      habitacion_numero: h.numero_habitacion,
      tipo: h.tipo_nombre,
      tipo_habitacion: h.tipo_nombre,
      tipo_nombre: h.tipo_nombre,
      imagen: h.imagen_principal,
      precio: parseFloat(h.precio_base),
      precio_base: parseFloat(h.precio_base),
      precio_noche: parseFloat(h.precio_base),
      estado: h.estado,
      capacidad: h.capacidad_personas,
      capacidad_personas: h.capacidad_personas,
      amenidades,
      galeria_imagenes,
      es_favorito: h.es_favorito || false
    };
  });

  // ✅ res.json DENTRO del asyncHandler
  res.json({ exito: true, data: datosFormateados, total: datosFormateados.length });
});

/**
 * Obtener todas las habitaciones disponibles (con filtros)
 * GET /api/habitaciones
 */
const obtenerHabitaciones = asyncHandler(async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const { tipo, precioMin, precioMax, capacidad, disponible, vista } = req.query;
  let sql = `
    SELECT h.*, t.nombre as tipo_nombre, t.capacidad_personas, t.precio_base
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.activo = TRUE
  `;
  const parametros = [];

  if (tipo) { sql += ` AND t.id_tipo = ?`; parametros.push(tipo); }
  if (capacidad) { sql += ` AND t.capacidad_personas >= ?`; parametros.push(capacidad); }
  if (vista) { sql += ` AND h.vista = ?`; parametros.push(vista); }
  if (precioMin) { sql += ` AND t.precio_base >= ?`; parametros.push(precioMin); }
  if (precioMax) { sql += ` AND t.precio_base <= ?`; parametros.push(precioMax); }
  if (disponible === 'true') { sql += ` AND h.estado = 'disponible'`; }

  sql += ` ORDER BY t.precio_base ASC`;
  const habitaciones = await ejecutarConsulta(sql, parametros);

  const datosFormateados = habitaciones.map(h => ({
    ...h,
    precio: parseFloat(h.precio_base),
    precio_noche: parseFloat(h.precio_base),
    habitacion_numero: h.numero_habitacion,
    tipo_habitacion: h.tipo_nombre
  }));

  res.json({ exito: true, data: datosFormateados, total: datosFormateados.length });
});

/**
 * Obtener detalles de una habitación
 * GET /api/habitaciones/:idHabitacion
 */
const obtenerHabitacion = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const sql = `
    SELECT h.*, t.nombre as tipo_nombre, t.descripcion as tipo_descripcion,
           t.capacidad_personas, t.precio_base, t.precio_empleado, t.metros_cuadrados
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.id_habitacion = ? AND h.activo = TRUE
    LIMIT 1
  `;

  const habitaciones = await ejecutarConsulta(sql, [idHabitacion]);
  if (habitaciones.length === 0) throw crearError404('Habitación no encontrada');

  const habitacion = habitaciones[0];
  habitacion.precio = parseFloat(habitacion.precio_base);
  habitacion.precio_noche = parseFloat(habitacion.precio_base);
  habitacion.habitacion_numero = habitacion.numero_habitacion;
  habitacion.tipo_habitacion = habitacion.tipo_nombre;

  const sqlComentarios = `
    SELECT c.*, u.nombre, u.apellido FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_habitacion = ? AND c.aprobado = TRUE
    ORDER BY c.fecha_comentario DESC LIMIT 10
  `;
  habitacion.comentarios = await ejecutarConsulta(sqlComentarios, [idHabitacion]);

  res.json({ exito: true, data: habitacion });
});

/**
 * Verificar disponibilidad
 */
const verificarDisponibilidad = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const { fechaEntrada, fechaSalida } = req.query;

  if (!fechaEntrada || !fechaSalida) throw crearError400('Fechas requeridas');

  const sqlReservas = `
    SELECT id_reserva FROM reservas
    WHERE id_habitacion = ? AND estado IN ('pendiente', 'confirmada')
    AND ((fecha_entrada <= ? AND fecha_salida > ?) OR (fecha_entrada < ? AND fecha_salida >= ?))
    LIMIT 1
  `;

  const conflicto = await ejecutarConsulta(sqlReservas, [idHabitacion, fechaEntrada, fechaEntrada, fechaSalida, fechaSalida]);
  res.json({ exito: true, data: { disponible: conflicto.length === 0 } });
});

/**
 * Crear habitación (Admin)
 */
const crearHabitacion = asyncHandler(async (req, res) => {
  const { numero_habitacion, id_tipo, descripcion_detallada, piso, estado, vista } = req.body;

  if (!numero_habitacion || !id_tipo) {
    throw crearError400('Número de habitación y tipo son requeridos');
  }

  const id = await insertar('habitaciones', {
    numero_habitacion,
    id_tipo,
    descripcion_detallada: descripcion_detallada || '',
    piso: piso || 1,
    estado: estado || 'disponible',
    vista: vista || 'ciudad',
    activo: true,
  });

  res.status(201).json({ exito: true, idHabitacion: id });
});

/**
 * Actualizar habitación (Admin/Empleado)
 * Campos de habitaciones se actualizan en tabla habitaciones.
 * precio_base y precio_empleado se actualizan en tipos_habitacion.
 */
const actualizarHabitacion = asyncHandler(async (req, res) => {
  const { precio_base, precio_empleado, ...datosHabitacion } = req.body;

  console.log('[actualizarHabitacion] id:', req.params.idHabitacion);
  console.log('[DEBUG] precio_base recibido:', precio_base, typeof precio_base);
  console.log('[DEBUG] datosHabitacion:', datosHabitacion);

  // Actualizar campos de la tabla habitaciones
  if (Object.keys(datosHabitacion).length > 0) {
    const filasHabitacion = await actualizar(
      'habitaciones',
      'id_habitacion',
      req.params.idHabitacion,
      datosHabitacion
    );
    console.log('[DEBUG] filas habitaciones actualizadas:', filasHabitacion);
  }

  // Actualizar precio en tipos_habitacion si viene en el body
  if (precio_base !== undefined || precio_empleado !== undefined) {
    const rows = await ejecutarConsulta(
      'SELECT id_tipo FROM habitaciones WHERE id_habitacion = ?',
      [req.params.idHabitacion]
    );
    console.log('[DEBUG] rows habitacion:', rows);
    console.log('[DEBUG] id_tipo encontrado:', rows[0]?.id_tipo);

    if (rows.length > 0) {
      const datosTipo = {};
      if (precio_base !== undefined) datosTipo.precio_base = precio_base;
      if (precio_empleado !== undefined) datosTipo.precio_empleado = precio_empleado;
      console.log('[DEBUG] datosTipo a actualizar en tipos_habitacion:', datosTipo);

      const filasTipo = await actualizar(
        'tipos_habitacion',
        'id_tipo',
        rows[0].id_tipo,
        datosTipo
      );
      console.log('[DEBUG] filas tipos_habitacion actualizadas:', filasTipo);
    }
  }

  res.json({ exito: true, mensaje: 'Actualizada' });
});

/**
 * Eliminar habitación (soft delete)
 */
const eliminarHabitacion = asyncHandler(async (req, res) => {
  await eliminar('habitaciones', 'id_habitacion', req.params.idHabitacion);
  res.json({ exito: true, mensaje: 'Eliminada' });
});

/**
 * Obtener tipos de habitación
 */
const obtenerTiposHabitacion = asyncHandler(async (req, res) => {
  const tipos = await ejecutarConsulta('SELECT * FROM tipos_habitacion WHERE activo = TRUE');
  res.json({ exito: true, data: tipos });
});

/**
 * Toggle favorito
 */
const toggleFavorito = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const idUsuario = req.usuario.id_usuario;
  const existe = await ejecutarConsulta(
    'SELECT id_favorito FROM favoritos WHERE id_usuario = ? AND id_habitacion = ?',
    [idUsuario, idHabitacion]
  );

  if (existe.length > 0) {
    await ejecutarConsulta('DELETE FROM favoritos WHERE id_favorito = ?', [existe[0].id_favorito]);
    res.json({ exito: true, esFavorito: false });
  } else {
    await insertar('favoritos', { id_usuario: idUsuario, id_habitacion: idHabitacion });
    res.json({ exito: true, esFavorito: true });
  }
});

/**
 * Obtener favoritos del usuario
 */
const obtenerFavoritos = asyncHandler(async (req, res) => {
  const favs = await ejecutarConsulta(
    `SELECT h.*, t.nombre as tipo_nombre 
     FROM favoritos f 
     JOIN habitaciones h ON f.id_habitacion = h.id_habitacion 
     JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo 
     WHERE f.id_usuario = ?`,
    [req.usuario.id_usuario]
  );
  res.json({ exito: true, data: favs });
});

module.exports = {
  obtenerHabitaciones,
  obtenerHabitacionesPopulares,
  obtenerHabitacion,
  verificarDisponibilidad,
  crearHabitacion,
  actualizarHabitacion,
  eliminarHabitacion,
  obtenerTiposHabitacion,
  toggleFavorito,
  obtenerFavoritos
};