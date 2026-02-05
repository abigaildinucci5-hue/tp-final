// src/rutas/rutasEmpleado.js - Rutas para operaciones de empleado/recepcionista

const express = require('express');
const router = express.Router();
const controladorEmpleado = require('../controladores/controladorEmpleado');
const { verificarAutenticacion } = require('../middlewares/middlewareAuth');
const { verificarRol } = require('../middlewares/middlewareVerificarRol');

// Middleware de autenticación para todas las rutas
router.use(verificarAutenticacion);

// ============================================================
// RESERVAS DEL DÍA
// ============================================================

/**
 * GET /api/empleado/reservas/hoy
 * Obtener todas las reservas del día actual
 * Permisos: empleado, admin
 */
router.get('/reservas/hoy',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.obtenerReservasHoy
);

// ============================================================
// CHECK-IN Y CHECK-OUT
// ============================================================

/**
 * POST /api/empleado/reservas/:id/check-in
 * Realizar check-in de una reserva
 * Permisos: empleado, admin
 * Body: { observaciones?, horaEntrada? }
 */
router.post('/reservas/:id/check-in',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.hacerCheckIn
);

/**
 * POST /api/empleado/reservas/:id/check-out
 * Realizar check-out de una reserva
 * Permisos: empleado, admin
 * Body: { observaciones?, horaSalida? }
 */
router.post('/reservas/:id/check-out',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.hacerCheckOut
);

// ============================================================
// GESTIÓN DE HABITACIONES
// ============================================================

/**
 * GET /api/empleado/habitaciones/estado
 * Obtener estado de todas las habitaciones
 * Permisos: empleado, admin
 */
router.get('/habitaciones/estado',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.obtenerEstadoHabitaciones
);

/**
 * PUT /api/empleado/habitaciones/:id/estado
 * Cambiar estado de una habitación
 * Permisos: empleado, admin
 * Body: { estado: 'disponible' | 'ocupada' | 'limpieza' | 'mantenimiento' }
 */
router.put('/habitaciones/:id/estado',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.cambiarEstadoHabitacion
);

// ============================================================
// SOLICITUDES DE HUÉSPEDES
// ============================================================

/**
 * GET /api/empleado/solicitudes/pendientes
 * Obtener solicitudes pendientes de huéspedes
 * Permisos: empleado, admin
 * Query: { estado? }
 */
router.get('/solicitudes/pendientes',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.obtenerSolicitudesPendientes
);

/**
 * POST /api/empleado/solicitudes
 * Crear una solicitud de huésped
 * Permisos: empleado, admin
 * Body: { idReserva, tipo, descripcion, prioridad? }
 */
router.post('/solicitudes',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.crearSolicitud
);

/**
 * POST /api/empleado/solicitudes/:id/resolver
 * Resolver una solicitud
 * Permisos: empleado, admin
 * Body: { observaciones? }
 */
router.post('/solicitudes/:id/resolver',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.resolverSolicitud
);

// ============================================================
// REPORTES Y ANÁLISIS
// ============================================================

/**
 * GET /api/empleado/reportes/huespedes
 * Obtener reporte de huéspedes
 * Permisos: empleado, admin
 * Query: { fechaDesde?, fechaHasta? }
 */
router.get('/reportes/huespedes',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.obtenerReporteHuespedes
);

/**
 * GET /api/empleado/huespedes/:usuarioId/historial
 * Obtener historial de un huésped específico
 * Permisos: empleado, admin
 */
router.get('/huespedes/:usuarioId/historial',
  verificarRol(['empleado', 'admin']),
  controladorEmpleado.obtenerHistorialHuesped
);

// ============================================================
// ERROR HANDLERS
// ============================================================

// Ruta no encontrada
router.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Endpoint de empleado no encontrado'
  });
});

module.exports = router;
