// src/rutas/rutasReservas.js - Rutas de gestión de reservas
const express = require('express');
const router = express.Router();
const controladorReservas = require('../controladores/controladorReservas');
const { asyncHandler, crearError404, crearError403, crearError400 } = require('../middlewares/manejadorErrores');
const { verificarAutenticacion, verificarEmpleado, verificarCliente } = require('../middlewares/middlewareAuth');
const { ejecutarConsulta, actualizar } = require('../config/baseDatos');

// --- 1. RUTAS FIJAS (Sin parámetros dinámicos) ---

/**
 * @route   GET /api/reservas/usuario/historial
 * @desc    Obtener historial de reservas del usuario (Activas, Pasadas, Canceladas)
 * @access  Privado
 */
router.get('/usuario/historial', verificarAutenticacion, controladorReservas.obtenerHistorial);

/**
 * @route   GET /api/reservas
 * @desc    Obtener todas las reservas (Filtra por usuario si es cliente)
 * @access  Privado
 */
router.get('/', verificarAutenticacion, controladorReservas.obtenerReservas);

/**
 * @route   POST /api/reservas
 * @desc    Crear nueva reserva
 * @access  Privado (Cliente)
 */
router.post('/', verificarAutenticacion, verificarCliente, controladorReservas.crearReserva);


// --- 2. RUTAS CON PARÁMETROS DINÁMICOS (/:idReserva) ---
// ⚠️ IMPORTANTE: Las rutas ESPECÍFICAS deben ir ANTES de /:idReserva

/**
 * @route   PUT /api/reservas/:idReserva/confirmar
 * @desc    Confirmar reserva (solo empleado/admin)
 * @access  Privado (Empleado/Admin)
 */
router.put('/:idReserva/confirmar', verificarAutenticacion, verificarEmpleado, controladorReservas.confirmarReserva);

/**
 * @route   GET /api/reservas/:idReserva
 * @desc    Obtener detalles de una reserva específica
 * @access  Privado
 */
router.get('/:idReserva', verificarAutenticacion, controladorReservas.obtenerReserva);

/**
 * @route   PUT /api/reservas/:idReserva
 * @desc    Modificar datos de una reserva
 * @access  Privado
 */
router.put('/:idReserva', verificarAutenticacion, controladorReservas.modificarReserva);

/**
 * @route   DELETE /api/reservas/:idReserva/eliminar
 * @desc    Eliminar una reserva permanentemente
 * @access  Privado
 */
router.delete('/:idReserva/eliminar', verificarAutenticacion, controladorReservas.eliminarReserva);

/**
 * @route   DELETE /api/reservas/:idReserva
 * @desc    Cancelar una reserva o eliminar permanentemente si se pasa ?accion=eliminar
 * @access  Privado
 */
router.delete('/:idReserva', verificarAutenticacion, asyncHandler(async (req, res) => {
  try {
    const accionEliminar = req.query.accion === 'eliminar' || req.query.eliminar === 'true';
    const { idReserva } = req.params;
    const { rol, id_usuario } = req.usuario;

    console.log(`🗑️ DELETE /reservas/${idReserva} - accion: ${accionEliminar ? 'eliminar' : 'cancelar'}`);

    // Obtener reserva SIMPLE (sin múltiples JOINs que puedan fallar)
    const sqlReserva = `SELECT * FROM reservas WHERE id_reserva = ? LIMIT 1`;
    const reservas = await ejecutarConsulta(sqlReserva, [idReserva]);

    if (reservas.length === 0) {
      throw crearError404('Reserva no encontrada');
    }

    const reserva = reservas[0];

    // Verificar permisos
    if (rol === 'cliente' && reserva.id_usuario !== id_usuario) {
      throw crearError403('No tienes permiso para modificar esta reserva');
    }

    if (accionEliminar) {
      // 🗑️ ELIMINAR PERMANENTEMENTE
      console.log(`✅ Eliminando reserva ${idReserva} permanentemente`);
      await ejecutarConsulta('DELETE FROM reservas WHERE id_reserva = ?', [idReserva]);
      
      return res.json({ 
        exito: true, 
        mensaje: 'Reserva eliminada correctamente',
        data: { id_reserva: idReserva }
      });
    }

    // ❌ CANCELAR RESERVA (cambiar estado)
    if (!['pendiente', 'confirmada'].includes(reserva.estado)) {
      throw crearError400('Esta reserva no se puede cancelar. Estado actual: ' + reserva.estado);
    }

    // Calcular si aplica reembolso (48 horas antes)
    const ahora = new Date();
    const fechaEntrada = new Date(reserva.fecha_entrada);
    const horasHastaEntrada = (fechaEntrada - ahora) / (1000 * 60 * 60);
    const montoReembolso = horasHastaEntrada >= 48 ? reserva.precio_total : 0;

    // Actualizar reserva a cancelada
    console.log(`✅ Cancelando reserva ${idReserva}`);
    await actualizar('reservas', 'id_reserva', idReserva, {
      estado: 'cancelada',
      fecha_cancelacion: new Date()
    });

    res.json({
      exito: true,
      mensaje: 'Reserva cancelada exitosamente',
      data: {
        montoReembolso,
        aplicaReembolso: montoReembolso > 0
      }
    });

  } catch (error) {
    console.error('❌ Error en DELETE /reservas/:idReserva -', error);
    throw error;
  }
}));

module.exports = router;