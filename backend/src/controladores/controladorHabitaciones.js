// src/controladores/controladorHabitaciones.js - Gestión de habitaciones
const { ejecutarConsulta, insertar, actualizar, eliminar } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError400 } = require('../middlewares/manejadorErrores');

/**
 * Obtener habitaciones populares (para el home)
 * GET /api/habitaciones?limite=8 o ?limit=8
 */
const obtenerHabitacionesPopulares = asyncHandler(async (req, res) => {
  // Desabilitar caché
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  // Soportar ambos: "limite" y "limit"
  const limit = parseInt(req.query.limite || req.query.limit) || 8;

  const sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.descripcion_detallada,
      h.imagen_principal,
      h.galeria_imagenes,
      h.amenidades,
      h.vista,
      h.piso,
      h.estado,
      t.id_tipo,
      t.nombre as tipo_nombre,
      t.descripcion as tipo_descripcion,
      t.capacidad_personas,
      t.precio_base,
      t.precio_empleado,
      t.metros_cuadrados
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.activo = TRUE AND h.estado = 'disponible'
    ORDER BY h.id_habitacion DESC
    LIMIT ?
  `;

  const habitaciones = await ejecutarConsulta(sql, [limit]);

  // Si el usuario está autenticado, verificar favoritos
  if (req.usuario) {
    const sqlFavoritos = `
      SELECT id_habitacion FROM favoritos WHERE id_usuario = ?
    `;
    const favoritos = await ejecutarConsulta(sqlFavoritos, [req.usuario.id_usuario]);
    const idsFavoritos = favoritos.map(f => f.id_habitacion);

    habitaciones.forEach(h => {
      h.es_favorito = idsFavoritos.includes(h.id_habitacion);
    });
  }

  // Formatear respuesta para el frontend
  const datosFormateados = habitaciones.map(h => {
    try {
      return {
        id: h.id_habitacion,
        id_habitacion: h.id_habitacion,
        numero: h.numero_habitacion,
        numero_habitacion: h.numero_habitacion,
        tipo: h.tipo_nombre,
        tipo_nombre: h.tipo_nombre,
        imagen: h.imagen_principal,
        imagen_principal: h.imagen_principal,
        precio: parseFloat(h.precio_base),
        precio_base: parseFloat(h.precio_base),
        estado: h.estado,
        vista: h.vista,
        piso: h.piso,
        capacidad: h.capacidad_personas,
        amenidades: h.amenidades ? (typeof h.amenidades === 'string' ? JSON.parse(h.amenidades) : h.amenidades) : [],
        galeria_imagenes: h.galeria_imagenes ? (typeof h.galeria_imagenes === 'string' ? JSON.parse(h.galeria_imagenes) : h.galeria_imagenes) : [],
        es_favorito: h.es_favorito || false
      };
    } catch (error) {
      console.error('Error formateando habitación:', h.id_habitacion, error);
      return {
        id: h.id_habitacion,
        id_habitacion: h.id_habitacion,
        numero: h.numero_habitacion,
        numero_habitacion: h.numero_habitacion,
        tipo: h.tipo_nombre,
        imagen: h.imagen_principal,
        precio: parseFloat(h.precio_base),
        estado: h.estado,
        amenidades: [],
        galeria_imagenes: [],
        es_favorito: false
      };
    }
  });

  res.json({
    exito: true,
    data: datosFormateados,
    total: datosFormateados.length
  });
});

/**
 * Obtener todas las habitaciones disponibles
 * GET /api/habitaciones
 */

const obtenerHabitaciones = asyncHandler(async (req, res) => {
  // Desabilitar caché
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

  const { tipo, precioMin, precioMax, capacidad, disponible, vista } = req.query;
  
  let sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.descripcion_detallada,
      h.imagen_principal,
      h.galeria_imagenes,
      h.amenidades,
      h.vista,
      h.piso,
      h.estado,
      t.nombre as tipo_nombre,
      t.descripcion as tipo_descripcion,
      t.capacidad_personas,
      t.precio_base,
      t.precio_empleado,
      t.metros_cuadrados
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.activo = TRUE
  `;

  const parametros = [];

  // Filtros opcionales
  if (tipo) {
    sql += ` AND t.id_tipo = ?`;
    parametros.push(tipo);
  }

  if (capacidad) {
    sql += ` AND t.capacidad_personas >= ?`;
    parametros.push(capacidad);
  }

  if (vista) {
    sql += ` AND h.vista = ?`;
    parametros.push(vista);
  }

  if (precioMin) {
    sql += ` AND t.precio_base >= ?`;
    parametros.push(precioMin);
  }

  if (precioMax) {
    sql += ` AND t.precio_base <= ?`;
    parametros.push(precioMax);
  }

  if (disponible === 'true') {
    sql += ` AND h.estado = 'disponible'`;
  }

  sql += ` ORDER BY t.precio_base ASC`;

  const habitaciones = await ejecutarConsulta(sql, parametros);

  // Si el usuario está autenticado, verificar favoritos
  if (req.usuario) {
    const sqlFavoritos = `
      SELECT id_habitacion FROM favoritos WHERE id_usuario = ?
    `;
    const favoritos = await ejecutarConsulta(sqlFavoritos, [req.usuario.id_usuario]);
    const idsFavoritos = favoritos.map(f => f.id_habitacion);

    habitaciones.forEach(h => {
      h.es_favorito = idsFavoritos.includes(h.id_habitacion);
    });
  }

  res.json({
    exito: true,
    data: habitaciones,
    total: habitaciones.length
  });
});

/**
 * Obtener detalles de una habitación
 * GET /api/habitaciones/:idHabitacion
 */
const obtenerHabitacion = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;

  const sql = `
    SELECT 
      h.*,
      t.nombre as tipo_nombre,
      t.descripcion as tipo_descripcion,
      t.capacidad_personas,
      t.precio_base,
      t.precio_empleado,
      t.metros_cuadrados
    FROM habitaciones h
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE h.id_habitacion = ? AND h.activo = TRUE
    LIMIT 1
  `;

  const habitaciones = await ejecutarConsulta(sql, [idHabitacion]);

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  const habitacion = habitaciones[0];

  // Verificar si es favorito (si está autenticado)
  if (req.usuario) {
    const sqlFavorito = `
      SELECT id_favorito FROM favoritos 
      WHERE id_usuario = ? AND id_habitacion = ?
      LIMIT 1
    `;
    const favorito = await ejecutarConsulta(sqlFavorito, [req.usuario.id_usuario, idHabitacion]);
    habitacion.es_favorito = favorito.length > 0;
  }

  // Obtener comentarios aprobados
  const sqlComentarios = `
    SELECT 
      c.id_comentario,
      c.calificacion,
      c.titulo,
      c.comentario,
      c.respuesta_hotel,
      c.fecha_comentario,
      u.nombre,
      u.apellido
    FROM comentarios c
    JOIN usuarios u ON c.id_usuario = u.id_usuario
    WHERE c.id_habitacion = ? AND c.aprobado = TRUE
    ORDER BY c.fecha_comentario DESC
    LIMIT 10
  `;
  const comentarios = await ejecutarConsulta(sqlComentarios, [idHabitacion]);

  // Calcular promedio de calificación
  if (comentarios.length > 0) {
    const suma = comentarios.reduce((acc, c) => acc + c.calificacion, 0);
    habitacion.calificacion_promedio = (suma / comentarios.length).toFixed(1);
  } else {
    habitacion.calificacion_promedio = null;
  }

  habitacion.comentarios = comentarios;

  res.json({
    exito: true,
    data: habitacion
  });
});

/**
 * Verificar disponibilidad de una habitación
 * GET /api/habitaciones/:idHabitacion/disponibilidad?fechaEntrada=YYYY-MM-DD&fechaSalida=YYYY-MM-DD
 */
const verificarDisponibilidad = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const { fechaEntrada, fechaSalida } = req.query;

  if (!fechaEntrada || !fechaSalida) {
    throw crearError400('Fechas de entrada y salida son requeridas');
  }

  // Verificar que la habitación existe
  const sqlHabitacion = `
    SELECT id_habitacion, estado FROM habitaciones 
    WHERE id_habitacion = ? AND activo = TRUE
    LIMIT 1
  `;
  const habitaciones = await ejecutarConsulta(sqlHabitacion, [idHabitacion]);

  if (habitaciones.length === 0) {
    throw crearError404('Habitación no encontrada');
  }

  // Verificar si hay reservas en conflicto
  const sqlReservas = `
    SELECT id_reserva
    FROM reservas
    WHERE id_habitacion = ?
    AND estado IN ('pendiente', 'confirmada')
    AND (
      (fecha_entrada <= ? AND fecha_salida > ?)
      OR (fecha_entrada < ? AND fecha_salida >= ?)
      OR (fecha_entrada >= ? AND fecha_salida <= ?)
    )
    LIMIT 1
  `;
  
  const reservasConflicto = await ejecutarConsulta(sqlReservas, [
    idHabitacion,
    fechaEntrada, fechaEntrada,
    fechaSalida, fechaSalida,
    fechaEntrada, fechaSalida
  ]);

  const disponible = reservasConflicto.length === 0 && habitaciones[0].estado === 'disponible';

  res.json({
    exito: true,
    data: {
      disponible,
      fechaEntrada,
      fechaSalida,
      estadoHabitacion: habitaciones[0].estado
    }
  });
});

/**
 * Crear nueva habitación (Admin)
 * POST /api/habitaciones
 */
const crearHabitacion = asyncHandler(async (req, res) => {
  const {
    numeroHabitacion,
    idTipo,
    piso,
    descripcionDetallada,
    imagenPrincipal,
    galeriaImagenes,
    amenidades,
    vista
  } = req.body;

  // Validaciones
  if (!numeroHabitacion || !idTipo) {
    throw crearError400('Número de habitación y tipo son requeridos');
  }

  // Verificar que el número de habitación no exista
  const sqlVerificar = `
    SELECT id_habitacion FROM habitaciones WHERE numero_habitacion = ?
  `;
  const existe = await ejecutarConsulta(sqlVerificar, [numeroHabitacion]);

  if (existe.length > 0) {
    throw crearError400('El número de habitación ya existe');
  }

  const datosHabitacion = {
    numero_habitacion: numeroHabitacion,
    id_tipo: idTipo,
    piso: piso || null,
    descripcion_detallada: descripcionDetallada || null,
    imagen_principal: imagenPrincipal || null,
    galeria_imagenes: galeriaImagenes ? JSON.stringify(galeriaImagenes) : null,
    amenidades: amenidades ? JSON.stringify(amenidades) : null,
    vista: vista || null,
    estado: 'disponible'
  };

  const idHabitacion = await insertar('habitaciones', datosHabitacion);

  // Notificar a usuarios sobre nueva habitación
  // (implementar después con el servicio de notificaciones)

  res.status(201).json({
    exito: true,
    mensaje: 'Habitación creada exitosamente',
    data: {
      idHabitacion,
      numeroHabitacion
    }
  });
});

/**
 * Actualizar habitación (Admin/Empleado)
 * PUT /api/habitaciones/:idHabitacion
 */
const actualizarHabitacion = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const datosActualizar = {};

  // Campos permitidos para actualizar
  const camposPermitidos = [
    'descripcion_detallada', 'imagen_principal', 'galeria_imagenes',
    'amenidades', 'vista', 'estado', 'piso'
  ];

  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      // Convertir a snake_case
      const campoSnake = campo.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      if (['galeria_imagenes', 'amenidades'].includes(campoSnake) && typeof req.body[campo] === 'object') {
        datosActualizar[campoSnake] = JSON.stringify(req.body[campo]);
      } else {
        datosActualizar[campoSnake] = req.body[campo];
      }
    }
  });

  if (Object.keys(datosActualizar).length === 0) {
    throw crearError400('No hay datos para actualizar');
  }

  const filasAfectadas = await actualizar('habitaciones', 'id_habitacion', idHabitacion, datosActualizar);

  if (filasAfectadas === 0) {
    throw crearError404('Habitación no encontrada');
  }

  res.json({
    exito: true,
    mensaje: 'Habitación actualizada exitosamente'
  });
});

/**
 * Eliminar habitación (Admin)
 * DELETE /api/habitaciones/:idHabitacion
 */
const eliminarHabitacion = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;

  // Verificar que no tenga reservas activas
  const sqlReservas = `
    SELECT id_reserva FROM reservas
    WHERE id_habitacion = ? 
    AND estado IN ('pendiente', 'confirmada')
    AND fecha_salida > CURDATE()
    LIMIT 1
  `;
  const reservasActivas = await ejecutarConsulta(sqlReservas, [idHabitacion]);

  if (reservasActivas.length > 0) {
    throw crearError400('No se puede eliminar una habitación con reservas activas');
  }

  const filasAfectadas = await eliminar('habitaciones', 'id_habitacion', idHabitacion);

  if (filasAfectadas === 0) {
    throw crearError404('Habitación no encontrada');
  }

  res.json({
    exito: true,
    mensaje: 'Habitación eliminada exitosamente'
  });
});

/**
 * Obtener tipos de habitación
 * GET /api/habitaciones/tipos/lista
 */
const obtenerTiposHabitacion = asyncHandler(async (req, res) => {
  const sql = `
    SELECT * FROM tipos_habitacion
    WHERE activo = TRUE
    ORDER BY precio_base ASC
  `;

  const tipos = await ejecutarConsulta(sql);

  res.json({
    exito: true,
    data: tipos
  });
});

/**
 * Agregar/quitar habitación de favoritos
 * POST /api/habitaciones/:idHabitacion/favorito
 */
const toggleFavorito = asyncHandler(async (req, res) => {
  const { idHabitacion } = req.params;
  const idUsuario = req.usuario.id_usuario;

  // Verificar si ya es favorito
  const sqlVerificar = `
    SELECT id_favorito FROM favoritos
    WHERE id_usuario = ? AND id_habitacion = ?
    LIMIT 1
  `;
  const favoritos = await ejecutarConsulta(sqlVerificar, [idUsuario, idHabitacion]);

  if (favoritos.length > 0) {
    // Quitar de favoritos
    const sqlEliminar = `DELETE FROM favoritos WHERE id_favorito = ?`;
    await ejecutarConsulta(sqlEliminar, [favoritos[0].id_favorito]);

    return res.json({
      exito: true,
      mensaje: 'Habitación quitada de favoritos',
      esFavorito: false
    });
  } else {
    // Agregar a favoritos
    await insertar('favoritos', {
      id_usuario: idUsuario,
      id_habitacion: idHabitacion
    });

    return res.json({
      exito: true,
      mensaje: 'Habitación agregada a favoritos',
      esFavorito: true
    });
  }
});

/**
 * Obtener habitaciones favoritas del usuario
 * GET /api/habitaciones/favoritos/mis-favoritos
 */
const obtenerFavoritos = asyncHandler(async (req, res) => {
  const idUsuario = req.usuario.id_usuario;

  const sql = `
    SELECT 
      h.id_habitacion,
      h.numero_habitacion,
      h.descripcion_detallada,
      h.imagen_principal,
      h.vista,
      t.nombre as tipo_nombre,
      t.precio_base,
      t.capacidad_personas,
      f.fecha_agregado
    FROM favoritos f
    JOIN habitaciones h ON f.id_habitacion = h.id_habitacion
    JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    WHERE f.id_usuario = ? AND h.activo = TRUE
    ORDER BY f.fecha_agregado DESC
  `;

  const favoritos = await ejecutarConsulta(sql, [idUsuario]);

  res.json({
    exito: true,
    data: favoritos,
    total: favoritos.length
  });
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