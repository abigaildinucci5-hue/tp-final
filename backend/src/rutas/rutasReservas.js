// src/rutas/rutasReservas.js - Rutas de gestión de reservas
const express = require('express');
const router = express.Router();
const { verificarAutenticacion, verificarEmpleado, verificarCliente } = require('../middlewares/middlewareAuth');

/**
 * @route   GET /api/reservas
 * @desc    Obtener todas las reservas (Admin/Empleado: todas, Cliente: solo las suyas)
 * @access  Privado
 */
router.get('/', verificarAutenticacion, verificarCliente, (req, res) => {
  res.json({ mensaje: 'Obtener reservas del usuario' });
});

/**
 * @route   GET /api/reservas/:idReserva
 * @desc    Obtener detalles de una reserva
 * @access  Privado
 */
router.get('/:idReserva', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Detalles de reserva' });
});

/**
 * @route   POST /api/reservas
 * @desc    Crear nueva reserva
 * @access  Privado (Cliente)
 */
router.post('/', verificarAutenticacion, verificarCliente, (req, res) => {
  res.json({ mensaje: 'Crear reserva' });
});

/**
 * @route   PUT /api/reservas/:idReserva
 * @desc    Modificar reserva
 * @access  Privado
 */
router.put('/:idReserva', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Modificar reserva' });
});

/**
 * @route   DELETE /api/reservas/:idReserva
 * @desc    Cancelar reserva
 * @access  Privado
 */
router.delete('/:idReserva', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Cancelar reserva' });
});

/**
 * @route   PUT /api/reservas/:idReserva/confirmar
 * @desc    Confirmar reserva (solo empleado/admin)
 * @access  Privado (Empleado/Admin)
 */
router.put('/:idReserva/confirmar', verificarAutenticacion, verificarEmpleado, (req, res) => {
  res.json({ mensaje: 'Confirmar reserva' });
});

/**
 * @route   GET /api/reservas/usuario/historial
 * @desc    Obtener historial de reservas del usuario
 * @access  Privado
 */
router.get('/usuario/historial', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Historial de reservas' });
});

module.exports = router;