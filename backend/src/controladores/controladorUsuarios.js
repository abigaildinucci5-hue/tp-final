// src/controladores/controladorUsuarios.js - Gestión de usuarios
const { ejecutarConsulta, actualizar, eliminar } = require('../config/baseDatos');
const { asyncHandler, crearError404, crearError400, crearError403 } = require('../middlewares/manejadorErrores');
const bcrypt = require('bcryptjs');

/**
 * Obtener todos los usuarios (Admin)
 * GET /api/usuarios
 */
const obtenerUsuarios = asyncHandler(async (req, res) => {
  const { rol, activo, busqueda, limite = 50, pagina = 1 } = req.query;
  const offset = (pagina - 1) * limite;

  let sql = `
    SELECT 
      id_usuario,
      nombre,
      apellido,
      email,
      telefono,
      rol,
      foto_perfil,
      verificado,
      activo,
      fecha_registro,
      ultimo_acceso
    FROM usuarios
    WHERE 1=1
  `;

  const parametros = [];

  if (rol) {
    sql += ` AND rol = ?`;
    parametros.push(rol);
  }

  if (activo !== undefined) {
    sql += ` AND activo = ?`;
    parametros.push(activo === 'true');
  }

  if (busqueda) {
    sql += ` AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)`;
    const busquedaParam = `%${busqueda}%`;
    parametros.push(busquedaParam, busquedaParam, busquedaParam);
  }

  sql += ` ORDER BY fecha_registro DESC LIMIT ? OFFSET ?`;
  parametros.push(parseInt(limite), offset);

  const usuarios = await ejecutarConsulta(sql, parametros);

  // Contar total
  let sqlTotal = `SELECT COUNT(*) as total FROM usuarios WHERE 1=1`;
  const totalParams = [];

  if (rol) {
    sqlTotal += ` AND rol = ?`;
    totalParams.push(rol);
  }

  if (activo !== undefined) {
    sqlTotal += ` AND activo = ?`;
    totalParams.push(activo === 'true');
  }

  if (busqueda) {
    sqlTotal += ` AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)`;
    const busquedaParam = `%${busqueda}%`;
    totalParams.push(busquedaParam, busquedaParam, busquedaParam);
  }

  const totalResult = await ejecutarConsulta(sqlTotal, totalParams);

  res.json({
    exito: true,
    data: usuarios,
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: totalResult[0].total
    }
  });
});

/**
 * Obtener usuario por ID
 * GET /api/usuarios/:idUsuario
 */
const obtenerUsuario = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;

  const sql = `
    SELECT 
      id_usuario,
      nombre,
      apellido,
      email,
      telefono,
      rol,
      foto_perfil,
      verificado,
      activo,
      fecha_registro,
      ultimo_acceso,
      google_id,
      facebook_id
    FROM usuarios
    WHERE id_usuario = ?
    LIMIT 1
  `;

  const usuarios = await ejecutarConsulta(sql, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  const usuario = usuarios[0];

  // Obtener estadísticas del usuario
  const sqlEstadisticas = `
    SELECT 
      (SELECT COUNT(*) FROM reservas WHERE id_usuario = ? AND estado = 'completada') as reservas_completadas,
      (SELECT COUNT(*) FROM reservas WHERE id_usuario = ? AND estado IN ('pendiente', 'confirmada')) as reservas_activas,
      (SELECT COUNT(*) FROM comentarios WHERE id_usuario = ?) as total_comentarios,
      (SELECT COUNT(*) FROM favoritos WHERE id_usuario = ?) as habitaciones_favoritas
  `;

  const estadisticas = await ejecutarConsulta(sqlEstadisticas, [
    idUsuario, idUsuario, idUsuario, idUsuario
  ]);

  usuario.estadisticas = estadisticas[0];

  res.json({
    exito: true,
    data: usuario
  });
});

/**
 * Actualizar usuario
 * PUT /api/usuarios/:idUsuario
 */
const actualizarUsuario = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { rol, id_usuario: idUsuarioActual } = req.usuario;
  const { nombre, apellido, telefono, fotoPerfil } = req.body;

  // Verificar que el usuario existe
  const sqlVerificar = `SELECT id_usuario FROM usuarios WHERE id_usuario = ? LIMIT 1`;
  const usuarios = await ejecutarConsulta(sqlVerificar, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  // Verificar permisos (solo el propietario o admin pueden actualizar)
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para actualizar este usuario');
  }

  const datosActualizar = {};

  if (nombre) datosActualizar.nombre = nombre;
  if (apellido) datosActualizar.apellido = apellido;
  if (telefono !== undefined) datosActualizar.telefono = telefono;
  if (fotoPerfil !== undefined) datosActualizar.foto_perfil = fotoPerfil;

  if (Object.keys(datosActualizar).length === 0) {
    throw crearError400('No hay datos para actualizar');
  }

  await actualizar('usuarios', 'id_usuario', idUsuario, datosActualizar);

  res.json({
    exito: true,
    mensaje: 'Usuario actualizado exitosamente'
  });
});

/**
 * Cambiar rol de usuario (Admin)
 * PUT /api/usuarios/:idUsuario/cambiar-rol
 */
const cambiarRol = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { nuevoRol } = req.body;

  if (!nuevoRol || !['cliente', 'empleado', 'admin'].includes(nuevoRol)) {
    throw crearError400('Rol inválido. Debe ser: cliente, empleado o admin');
  }

  const sqlVerificar = `SELECT id_usuario, rol FROM usuarios WHERE id_usuario = ? LIMIT 1`;
  const usuarios = await ejecutarConsulta(sqlVerificar, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  await actualizar('usuarios', 'id_usuario', idUsuario, { rol: nuevoRol });

  res.json({
    exito: true,
    mensaje: `Rol actualizado a ${nuevoRol}`,
    data: {
      idUsuario,
      nuevoRol
    }
  });
});

/**
 * Activar/Desactivar usuario (Admin)
 * PUT /api/usuarios/:idUsuario/toggle-activo
 */
const toggleActivo = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;

  const sqlVerificar = `SELECT id_usuario, activo FROM usuarios WHERE id_usuario = ? LIMIT 1`;
  const usuarios = await ejecutarConsulta(sqlVerificar, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  const nuevoEstado = !usuarios[0].activo;

  await actualizar('usuarios', 'id_usuario', idUsuario, { activo: nuevoEstado });

  // Si se desactiva, invalidar todas sus sesiones
  if (!nuevoEstado) {
    const sqlInvalidar = `UPDATE tokens_sesion SET activo = FALSE WHERE id_usuario = ?`;
    await ejecutarConsulta(sqlInvalidar, [idUsuario]);
  }

  res.json({
    exito: true,
    mensaje: `Usuario ${nuevoEstado ? 'activado' : 'desactivado'} exitosamente`,
    data: {
      idUsuario,
      activo: nuevoEstado
    }
  });
});

/**
 * Eliminar usuario (Soft delete)
 * DELETE /api/usuarios/:idUsuario
 */
const eliminarUsuario = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;

  // Verificar que no tenga reservas activas
  const sqlReservas = `
    SELECT id_reserva FROM reservas
    WHERE id_usuario = ? 
    AND estado IN ('pendiente', 'confirmada')
    AND fecha_salida > CURDATE()
    LIMIT 1
  `;
  const reservasActivas = await ejecutarConsulta(sqlReservas, [idUsuario]);

  if (reservasActivas.length > 0) {
    throw crearError400('No se puede eliminar un usuario con reservas activas');
  }

  const filasAfectadas = await eliminar('usuarios', 'id_usuario', idUsuario);

  if (filasAfectadas === 0) {
    throw crearError404('Usuario no encontrado');
  }

  // Invalidar todas las sesiones del usuario
  const sqlInvalidar = `UPDATE tokens_sesion SET activo = FALSE WHERE id_usuario = ?`;
  await ejecutarConsulta(sqlInvalidar, [idUsuario]);

  res.json({
    exito: true,
    mensaje: 'Usuario eliminado exitosamente'
  });
});

/**
 * Actualizar foto de perfil
 * PUT /api/usuarios/:idUsuario/foto-perfil
 */
const actualizarFotoPerfil = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { fotoPerfil } = req.body;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para actualizar esta foto');
  }

  if (!fotoPerfil) {
    throw crearError400('URL de foto de perfil es requerida');
  }

  await actualizar('usuarios', 'id_usuario', idUsuario, { foto_perfil: fotoPerfil });

  res.json({
    exito: true,
    mensaje: 'Foto de perfil actualizada',
    data: { fotoPerfil }
  });
});

/**
 * Obtener estadísticas de usuarios (Admin)
 * GET /api/usuarios/estadisticas/resumen
 */
const obtenerEstadisticasUsuarios = asyncHandler(async (req, res) => {
  const sqlEstadisticas = `
    SELECT 
      COUNT(*) as total_usuarios,
      SUM(CASE WHEN rol = 'cliente' THEN 1 ELSE 0 END) as clientes,
      SUM(CASE WHEN rol = 'empleado' THEN 1 ELSE 0 END) as empleados,
      SUM(CASE WHEN rol = 'admin' THEN 1 ELSE 0 END) as admins,
      SUM(CASE WHEN activo = TRUE THEN 1 ELSE 0 END) as activos,
      SUM(CASE WHEN activo = FALSE THEN 1 ELSE 0 END) as inactivos,
      SUM(CASE WHEN verificado = TRUE THEN 1 ELSE 0 END) as verificados,
      SUM(CASE WHEN verificado = FALSE THEN 1 ELSE 0 END) as no_verificados
    FROM usuarios
  `;

  const estadisticas = await ejecutarConsulta(sqlEstadisticas);

  // Usuarios registrados en el último mes
  const sqlUltimoMes = `
    SELECT COUNT(*) as nuevos_ultimo_mes
    FROM usuarios
    WHERE fecha_registro >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
  `;

  const ultimoMes = await ejecutarConsulta(sqlUltimoMes);

  // Usuarios más activos (por reservas)
  const sqlMasActivos = `
    SELECT 
      u.id_usuario,
      u.nombre,
      u.apellido,
      u.email,
      COUNT(r.id_reserva) as total_reservas
    FROM usuarios u
    JOIN reservas r ON u.id_usuario = r.id_usuario
    WHERE r.estado = 'completada'
    GROUP BY u.id_usuario
    ORDER BY total_reservas DESC
    LIMIT 10
  `;

  const masActivos = await ejecutarConsulta(sqlMasActivos);

  res.json({
    exito: true,
    data: {
      resumen: {
        ...estadisticas[0],
        nuevos_ultimo_mes: ultimoMes[0].nuevos_ultimo_mes
      },
      usuariosMasActivos: masActivos
    }
  });
});

/**
 * Buscar usuarios
 * GET /api/usuarios/buscar
 */
const buscarUsuarios = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim().length < 2) {
    throw crearError400('El término de búsqueda debe tener al menos 2 caracteres');
  }

  const sql = `
    SELECT 
      id_usuario,
      nombre,
      apellido,
      email,
      rol,
      foto_perfil,
      activo
    FROM usuarios
    WHERE (
      nombre LIKE ? OR 
      apellido LIKE ? OR 
      email LIKE ?
    )
    AND activo = TRUE
    LIMIT 20
  `;

  const busquedaParam = `%${query}%`;
  const usuarios = await ejecutarConsulta(sql, [busquedaParam, busquedaParam, busquedaParam]);

  res.json({
    exito: true,
    data: usuarios,
    total: usuarios.length
  });
});

/**
 * Obtener perfil completo del usuario
 * GET /api/usuarios/:idUsuario/perfil-completo
 */
const obtenerPerfilCompleto = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;

  // Verificar permisos (solo el propietario o admin)
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para ver este perfil');
  }

  // Datos del usuario
  const sqlUsuario = `
    SELECT 
      id_usuario,
      nombre,
      apellido,
      email,
      telefono,
      rol,
      foto_perfil,
      puntos_acumulados,
      total_reservas,
      total_reseñas,
      preferencias,
      fecha_registro
    FROM usuarios
    WHERE id_usuario = ?
  `;

  const [usuarios] = await ejecutarConsulta(sqlUsuario, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  const usuario = usuarios[0];

  // Historial de reservas
  const sqlReservas = `
    SELECT 
      r.id_reserva,
      r.numero_reserva,
      r.fecha_entrada,
      r.fecha_salida,
      r.estado,
      r.precio_total,
      h.numero_habitacion,
      h.imagen_principal,
      t.nombre as tipo_habitacion,
      c.calificacion,
      c.comentario
    FROM reservas r
    INNER JOIN habitaciones h ON r.id_habitacion = h.id_habitacion
    INNER JOIN tipos_habitacion t ON h.id_tipo = t.id_tipo
    LEFT JOIN comentarios c ON r.id_reserva = c.id_reserva
    WHERE r.id_usuario = ?
    ORDER BY r.fecha_entrada DESC
    LIMIT 10
  `;

  const [reservas] = await ejecutarConsulta(sqlReservas, [idUsuario]);

  // Métodos de pago guardados
  const sqlMetodosPago = `
    SELECT 
      id,
      tipo,
      nombre_titular,
      ultimos_4_digitos,
      mes_vencimiento,
      año_vencimiento,
      es_default,
      fecha_agregado
    FROM metodos_pago_usuarios
    WHERE id_usuario = ? AND es_activo = TRUE
  `;

  const [metodosPago] = await ejecutarConsulta(sqlMetodosPago, [idUsuario]);

  // Historial de puntos (últimos 10)
  const sqlHistorialPuntos = `
    SELECT 
      id,
      cantidad,
      tipo,
      concepto,
      fecha
    FROM historial_puntos
    WHERE id_usuario = ?
    ORDER BY fecha DESC
    LIMIT 10
  `;

  const [historialPuntos] = await ejecutarConsulta(sqlHistorialPuntos, [idUsuario]);

  res.json({
    exito: true,
    data: {
      usuario: {
        ...usuario,
        preferencias: usuario.preferencias ? JSON.parse(usuario.preferencias) : {}
      },
      reservas: reservas,
      metodosPago: metodosPago,
      historialPuntos: historialPuntos
    }
  });
});

/**
 * Agregar método de pago
 * POST /api/usuarios/:idUsuario/metodos-pago
 */
const agregarMetodoPago = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;
  const { tipo, nombreTitular, ultimos4Digitos, mesVencimiento, anioVencimiento, esDefault } = req.body;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para agregar métodos de pago a este usuario');
  }

  // Validar inputs
  if (!tipo || !nombreTitular || !ultimos4Digitos || !mesVencimiento || !anioVencimiento) {
    throw crearError400('Faltan datos requeridos para agregar método de pago');
  }

  // Si es default, quitar default de los demás
  if (esDefault) {
    const sqlQuitar = `UPDATE metodos_pago_usuarios SET es_default = FALSE WHERE id_usuario = ?`;
    await ejecutarConsulta(sqlQuitar, [idUsuario]);
  }

  const sqlInsertar = `
    INSERT INTO metodos_pago_usuarios 
    (id_usuario, tipo, nombre_titular, ultimos_4_digitos, mes_vencimiento, año_vencimiento, es_default)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const { insertId } = await ejecutarConsulta(sqlInsertar, [
    idUsuario, tipo, nombreTitular, ultimos4Digitos, mesVencimiento, anioVencimiento, esDefault || false
  ]);

  res.status(201).json({
    exito: true,
    mensaje: 'Método de pago agregado exitosamente',
    metodoId: insertId
  });
});

/**
 * Obtener métodos de pago del usuario
 * GET /api/usuarios/:idUsuario/metodos-pago
 */
const obtenerMetodosPago = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para ver estos métodos de pago');
  }

  const sql = `
    SELECT 
      id,
      tipo,
      nombre_titular,
      ultimos_4_digitos,
      mes_vencimiento,
      año_vencimiento,
      es_default,
      fecha_agregado,
      fecha_ultima_uso
    FROM metodos_pago_usuarios
    WHERE id_usuario = ? AND es_activo = TRUE
    ORDER BY es_default DESC, fecha_agregado DESC
  `;

  const [metodos] = await ejecutarConsulta(sql, [idUsuario]);

  res.json({
    exito: true,
    data: metodos
  });
});

/**
 * Eliminar método de pago
 * DELETE /api/usuarios/:idUsuario/metodos-pago/:metodoId
 */
const eliminarMetodoPago = asyncHandler(async (req, res) => {
  const { idUsuario, metodoId } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para eliminar este método de pago');
  }

  // Verificar que el método pertenece al usuario
  const sqlVerificar = `SELECT id_usuario FROM metodos_pago_usuarios WHERE id = ? AND id_usuario = ?`;
  const [metodos] = await ejecutarConsulta(sqlVerificar, [metodoId, idUsuario]);

  if (metodos.length === 0) {
    throw crearError404('Método de pago no encontrado');
  }

  // Marcar como inactivo en lugar de eliminarlo
  const sqlEliminar = `UPDATE metodos_pago_usuarios SET es_activo = FALSE WHERE id = ?`;
  await ejecutarConsulta(sqlEliminar, [metodoId]);

  res.json({
    exito: true,
    mensaje: 'Método de pago eliminado exitosamente'
  });
});

/**
 * Actualizar preferencias del usuario
 * PUT /api/usuarios/:idUsuario/preferencias
 */
const actualizarPreferencias = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;
  const preferencias = req.body;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para actualizar estas preferencias');
  }

  const sqlActualizar = `UPDATE usuarios SET preferencias = ? WHERE id_usuario = ?`;
  await ejecutarConsulta(sqlActualizar, [JSON.stringify(preferencias), idUsuario]);

  res.json({
    exito: true,
    mensaje: 'Preferencias actualizadas exitosamente',
    data: preferencias
  });
});

/**
 * Obtener historial de puntos
 * GET /api/usuarios/:idUsuario/historial-puntos
 */
const obtenerHistorialPuntos = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;
  const { limite = 50, pagina = 1 } = req.query;
  const offset = (pagina - 1) * limite;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para ver este historial');
  }

  const sql = `
    SELECT 
      id,
      cantidad,
      tipo,
      concepto,
      referencia_id,
      referencia_tipo,
      fecha
    FROM historial_puntos
    WHERE id_usuario = ?
    ORDER BY fecha DESC
    LIMIT ? OFFSET ?
  `;

  const [historial] = await ejecutarConsulta(sql, [idUsuario, parseInt(limite), offset]);

  // Contar total
  const sqlTotal = `SELECT COUNT(*) as total FROM historial_puntos WHERE id_usuario = ?`;
  const [totalResult] = await ejecutarConsulta(sqlTotal, [idUsuario]);

  res.json({
    exito: true,
    data: historial,
    paginacion: {
      paginaActual: parseInt(pagina),
      limite: parseInt(limite),
      total: totalResult[0].total
    }
  });
});

/**
 * Canjear puntos por descuento
 * POST /api/usuarios/:idUsuario/canjear-puntos
 */
const canjearPuntos = asyncHandler(async (req, res) => {
  const { idUsuario } = req.params;
  const { id_usuario: idUsuarioActual, rol } = req.usuario;
  const { puntosAcanjear } = req.body;

  // Verificar permisos
  if (parseInt(idUsuario) !== idUsuarioActual && rol !== 'admin') {
    throw crearError403('No tienes permiso para canjear puntos de este usuario');
  }

  if (!puntosAcanjear || puntosAcanjear <= 0) {
    throw crearError400('Cantidad de puntos inválida');
  }

  // Verificar que el usuario tiene suficientes puntos
  const sqlVerificar = `SELECT puntos_acumulados FROM usuarios WHERE id_usuario = ?`;
  const [usuarios] = await ejecutarConsulta(sqlVerificar, [idUsuario]);

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  if (usuarios[0].puntos_acumulados < puntosAcanjear) {
    throw crearError400('No tienes suficientes puntos para este canje');
  }

  // Calcular descuento (1 punto = 0.1 unidad de descuento)
  const descuentoObtenido = (puntosAcanjear * 0.1).toFixed(2);

  // Actualizar puntos del usuario
  const sqlActualizar = `UPDATE usuarios SET puntos_acumulados = puntos_acumulados - ? WHERE id_usuario = ?`;
  await ejecutarConsulta(sqlActualizar, [puntosAcanjear, idUsuario]);

  // Registrar canje
  const sqlInsertar = `
    INSERT INTO canje_puntos (id_usuario, puntos_canjeados, descuento_obtenido, estado)
    VALUES (?, ?, ?, 'pendiente')
  `;
  const { insertId } = await ejecutarConsulta(sqlInsertar, [idUsuario, puntosAcanjear, descuentoObtenido]);

  // Registrar en historial de puntos
  const sqlHistorial = `
    INSERT INTO historial_puntos (id_usuario, cantidad, tipo, concepto, referencia_id, referencia_tipo)
    VALUES (?, ?, 'canjeado', 'Canje de puntos', ?, 'canje')
  `;
  await ejecutarConsulta(sqlHistorial, [idUsuario, puntosAcanjear, insertId]);

  res.json({
    exito: true,
    mensaje: 'Puntos canjeados exitosamente',
    data: {
      puntosCanjeados: puntosAcanjear,
      descuentoObtenido: parseFloat(descuentoObtenido),
      canjeId: insertId
    }
  });
});

module.exports = {
  obtenerUsuarios,
  obtenerUsuario,
  actualizarUsuario,
  cambiarRol,
  toggleActivo,
  eliminarUsuario,
  actualizarFotoPerfil,
  obtenerEstadisticasUsuarios,
  buscarUsuarios,
  obtenerPerfilCompleto,
  agregarMetodoPago,
  obtenerMetodosPago,
  eliminarMetodoPago,
  actualizarPreferencias,
  obtenerHistorialPuntos,
  canjearPuntos
};