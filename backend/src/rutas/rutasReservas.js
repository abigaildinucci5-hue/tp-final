// src/rutas/rutasReservas.js - Rutas de gestión de reservas
const express = require('express');
const router = express.Router();
const controladorReservas = require('../controladores/controladorReservas');
const { verificarAutenticacion, verificarEmpleado, verificarCliente } = require('../middlewares/middlewareAuth');

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
 * @route   DELETE /api/reservas/:idReserva
 * @desc    Cancelar una reserva
 * @access  Privado
 */
router.delete('/:idReserva', verificarAutenticacion, controladorReservas.cancelarReserva);

/**
 * @route   PUT /api/reservas/:idReserva/confirmar
 * @desc    Confirmar reserva (solo empleado/admin)
 * @access  Privado (Empleado/Admin)
 */
router.put('/:idReserva/confirmar', verificarAutenticacion, verificarEmpleado, controladorReservas.confirmarReserva);

module.exports = router;