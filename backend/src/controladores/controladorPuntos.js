// src/controladores/controladorPuntos.js - Gestión del sistema de puntos
const { ejecutarConsulta, insertar } = require('../config/baseDatos');
const { asyncHandler, crearError400, crearError404 } = require('../middlewares/manejadorErrores');

/**
 * Agregar puntos a un usuario
 * Función auxiliar (no es un endpoint, se llama desde otros controladores)
 * @param {Number} usuarioId - ID del usuario
 * @param {Number} cantidad - Cantidad de puntos
 * @param {String} concepto - Concepto (Reserva completada, Reseña publicada, etc)
 * @param {Number} reservaId - ID de la reserva (opcional)
 * @returns {Promise<Boolean>}
 */
exports.agregarPuntos = async (usuarioId, cantidad, concepto, reservaId = null) => {
  try {
    if (!usuarioId || !cantidad || cantidad <= 0) {
      throw new Error('Parámetros inválidos para agregar puntos');
    }

    // Iniciar en una transacción para garantizar integridad
    const sqlAgregate = `
      INSERT INTO historial_puntos 
      (id_usuario, cantidad, tipo, concepto, referencia_id, referencia_tipo)
      VALUES (?, ?, 'ganado', ?, ?, 'reserva')
    `;

    const resultHistorial = await insertar(
      'historial_puntos',
      {
        id_usuario: usuarioId,
        cantidad: cantidad,
        tipo: 'ganado',
        concepto: concepto,
        referencia_id: reservaId,
        referencia_tipo: 'reserva'
      }
    );

    // Actualizar total de puntos del usuario
    await ejecutarConsulta(
      'UPDATE usuarios SET puntos_acumulados = puntos_acumulados + ? WHERE id_usuario = ?',
      [cantidad, usuarioId]
    );

    console.log(`✅ Puntos agregados: ${cantidad} puntos a usuario ${usuarioId} (${concepto})`);
    return true;
  } catch (error) {
    console.error('❌ Error agregando puntos:', error.message);
    return false;
  }
};

/**
 * Canjear puntos de un usuario
 * Función auxiliar (no es un endpoint)
 * @param {Number} usuarioId - ID del usuario
 * @param {Number} cantidad - Cantidad de puntos a canjear
 * @param {String} concepto - Concepto del canje
 * @param {Number} reservaId - ID de la reserva donde se aplica (opcional)
 * @returns {Promise<Object|null>}
 */
exports.canjearPuntos = async (usuarioId, cantidad, concepto, reservaId = null) => {
  try {
    if (!usuarioId || !cantidad || cantidad <= 0) {
      throw new Error('Parámetros inválidos para canjear puntos');
    }

    // Verificar que el usuario tiene suficientes puntos
    const [usuarios] = await ejecutarConsulta(
      'SELECT puntos_acumulados FROM usuarios WHERE id_usuario = ?',
      [usuarioId]
    );

    if (usuarios.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    if (usuarios[0].puntos_acumulados < cantidad) {
      throw new Error(`Puntos insuficientes. Tienes ${usuarios[0].puntos_acumulados} puntos`);
    }

    // Registrar en historial
    const resultHistorial = await insertar(
      'historial_puntos',
      {
        id_usuario: usuarioId,
        cantidad: cantidad,
        tipo: 'canjeado',
        concepto: concepto,
        referencia_id: reservaId,
        referencia_tipo: 'reserva'
      }
    );

    // Restar puntos
    await ejecutarConsulta(
      'UPDATE usuarios SET puntos_acumulados = puntos_acumulados - ? WHERE id_usuario = ?',
      [cantidad, usuarioId]
    );

    console.log(`✅ Puntos canjeados: ${cantidad} puntos de usuario ${usuarioId} (${concepto})`);

    return {
      success: true,
      historialId: resultHistorial.insertId,
      puntosCanjeados: cantidad,
      concepto: concepto
    };
  } catch (error) {
    console.error('❌ Error canjeando puntos:', error.message);
    throw error;
  }
};

/**
 * Obtener saldo de puntos del usuario
 * GET /api/puntos/saldo
 */
exports.obtenerSaldo = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;

  const [usuarios] = await ejecutarConsulta(
    'SELECT puntos_acumulados FROM usuarios WHERE id_usuario = ?',
    [usuarioId]
  );

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  res.json({
    exito: true,
    data: {
      usuarioId: usuarioId,
      puntosAcumulados: usuarios[0].puntos_acumulados,
      valoresConversion: {
        puntosPorDolar: 20, // 1 dólar = 20 puntos
        descuentoMaximo: usuarios[0].puntos_acumulados * 0.05 // 5 centavos por punto
      }
    }
  });
});

/**
 * Obtener historial de puntos del usuario
 * GET /api/puntos/historial
 */
exports.obtenerHistorial = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;
  const { limite = 20, pagina = 1, tipo } = req.query;
  const offset = (pagina - 1) * limite;

  let sql = `
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
  `;

  const parametros = [usuarioId];

  if (tipo && ['ganado', 'canjeado'].includes(tipo)) {
    sql += ' AND tipo = ?';
    parametros.push(tipo);
  }

  sql += ' ORDER BY fecha DESC LIMIT ? OFFSET ?';
  parametros.push(parseInt(limite), offset);

  const [historial] = await ejecutarConsulta(sql, parametros);

  // Contar total
  let sqlTotal = 'SELECT COUNT(*) as total FROM historial_puntos WHERE id_usuario = ?';
  const totalParams = [usuarioId];

  if (tipo) {
    sqlTotal += ' AND tipo = ?';
    totalParams.push(tipo);
  }

  const [totalResult] = await ejecutarConsulta(sqlTotal, totalParams);

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
 * Obtener canjes pendientes del usuario
 * GET /api/puntos/canjes-pendientes
 */
exports.obtenerCanjesPendientes = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;

  const [canjes] = await ejecutarConsulta(
    `SELECT 
      id,
      puntos_canjeados,
      descuento_obtenido,
      estado,
      id_reserva,
      fecha_canje,
      fecha_aplicacion
    FROM canje_puntos
    WHERE id_usuario = ? AND estado IN ('pendiente', 'aplicado')
    ORDER BY fecha_canje DESC`,
    [usuarioId]
  );

  res.json({
    exito: true,
    cantidad: canjes.length,
    data: canjes
  });
});

/**
 * Calcular descuento por puntos
 * POST /api/puntos/calcular-descuento
 */
exports.calcularDescuento = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;
  const { puntosAUtilizar, precioTotal } = req.body;

  if (!puntosAUtilizar || !precioTotal) {
    throw crearError400('Puntos y precio total son requeridos');
  }

  // Obtener saldo de puntos
  const [usuarios] = await ejecutarConsulta(
    'SELECT puntos_acumulados FROM usuarios WHERE id_usuario = ?',
    [usuarioId]
  );

  if (usuarios.length === 0) {
    throw crearError404('Usuario no encontrado');
  }

  const puntosDisponibles = usuarios[0].puntos_acumulados;

  if (puntosAUtilizar > puntosDisponibles) {
    throw crearError400(`Solo tienes ${puntosDisponibles} puntos disponibles`);
  }

  // Calcular descuento (1 punto = 0.05 dólares)
  const descuento = (puntosAUtilizar * 0.05).toFixed(2);
  const precioFinal = Math.max(0, (precioTotal - descuento).toFixed(2));

  res.json({
    exito: true,
    data: {
      puntosAUtilizar: puntosAUtilizar,
      descuentoAplicado: parseFloat(descuento),
      puntosDisponibles: puntosDisponibles,
      precioOriginal: parseFloat(precioTotal),
      precioFinal: parseFloat(precioFinal),
      ahorroTotal: parseFloat(descuento)
    }
  });
});

/**
 * Redimir puntos (cambiar por descuento)
 * POST /api/puntos/redimir
 */
exports.redimirPuntos = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;
  const { puntosARedimir } = req.body;

  if (!puntosARedimir || puntosARedimir <= 0) {
    throw crearError400('Cantidad de puntos inválida');
  }

  // Intentar canjear puntos
  const resultado = await exports.canjearPuntos(
    usuarioId,
    puntosARedimir,
    'Redención de puntos por descuento'
  );

  // Crear registro en tabla de canjes
  const [canjeResult] = await insertar(
    'canje_puntos',
    {
      id_usuario: usuarioId,
      puntos_canjeados: puntosARedimir,
      descuento_obtenido: (puntosARedimir * 0.05).toFixed(2),
      estado: 'pendiente'
    }
  );

  res.json({
    exito: true,
    mensaje: 'Puntos redimidos exitosamente',
    data: {
      puntosRedimidos: puntosARedimir,
      descuentoOtorgado: (puntosARedimir * 0.05).toFixed(2),
      canjeId: canjeResult.insertId
    }
  });
});

/**
 * Estadísticas de puntos del usuario
 * GET /api/puntos/estadisticas
 */
exports.obtenerEstadisticas = asyncHandler(async (req, res) => {
  const usuarioId = req.usuario.id_usuario;

  // Total de puntos acumulados
  const [puntosTotal] = await ejecutarConsulta(
    `SELECT 
      SUM(CASE WHEN tipo = 'ganado' THEN cantidad ELSE 0 END) as puntos_ganados,
      SUM(CASE WHEN tipo = 'canjeado' THEN cantidad ELSE 0 END) as puntos_canjeados
    FROM historial_puntos
    WHERE id_usuario = ?`,
    [usuarioId]
  );

  // Saldo actual
  const [usuariosData] = await ejecutarConsulta(
    'SELECT puntos_acumulados FROM usuarios WHERE id_usuario = ?',
    [usuarioId]
  );

  const puntosActuales = usuariosData[0]?.puntos_acumulados || 0;

  // Últimas transacciones
  const [ultimasTransacciones] = await ejecutarConsulta(
    `SELECT 
      tipo,
      cantidad,
      concepto,
      fecha
    FROM historial_puntos
    WHERE id_usuario = ?
    ORDER BY fecha DESC
    LIMIT 5`,
    [usuarioId]
  );

  res.json({
    exito: true,
    data: {
      resumen: {
        puntosActuales: puntosActuales,
        puntosGanados: puntosTotal[0]?.puntos_ganados || 0,
        puntosCanjeados: puntosTotal[0]?.puntos_canjeados || 0,
        dineroEquivalente: (puntosActuales * 0.05).toFixed(2)
      },
      ultimasTransacciones: ultimasTransacciones
    }
  });
});

module.exports = exports;
