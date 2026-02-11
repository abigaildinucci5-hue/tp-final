// src/rutas/rutasPuntos.js - Rutas del sistema de puntos
const express = require('express');
const router = express.Router();
const controladorPuntos = require('../controladores/controladorPuntos');
const { verificarAutenticacion } = require('../middlewares/middlewareAuth');

// Todas las rutas requieren autenticación
router.use(verificarAutenticacion);

/**
 * GET /api/puntos/saldo
 * Obtener saldo actual de puntos del usuario
 */
router.get('/saldo',
  controladorPuntos.obtenerSaldo
);

/**
 * GET /api/puntos/historial
 * Obtener historial de movimientos de puntos
 * Query: { limite?, pagina?, tipo? ('ganado'|'canjeado') }
 */
router.get('/historial',
  controladorPuntos.obtenerHistorial
);

/**
 * GET /api/puntos/estadisticas
 * Obtener estadísticas de puntos del usuario
 */
router.get('/estadisticas',
  controladorPuntos.obtenerEstadisticas
);

/**
 * GET /api/puntos/canjes-pendientes
 * Obtener canjes pendientes de aplicar
 */
router.get('/canjes-pendientes',
  controladorPuntos.obtenerCanjesPendientes
);

/**
 * POST /api/puntos/calcular-descuento
 * Calcular descuento por puntos
 * Body: { puntosAUtilizar, precioTotal }
 */
router.post('/calcular-descuento',
  controladorPuntos.calcularDescuento
);

/**
 * POST /api/puntos/redimir
 * Redimir puntos por descuento
 * Body: { puntosARedimir }
 */
router.post('/redimir',
  controladorPuntos.redimirPuntos
);

module.exports = router;
