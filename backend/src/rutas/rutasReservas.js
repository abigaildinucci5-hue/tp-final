// src/rutas/rutasReservas.js - Rutas de gestión de reservas
const express = require('express');
const router = express.Router();
const controladorReservas = require('../controladores/controladorReservas');
const { verificarAutenticacion, verificarEmpleado, verificarCliente } = require('../middlewares/middlewareAuth');
const { verificarRol } = require('../middlewares/middlewareVerificarRol');

/**
 * @route   GET /api/reservas
 * @desc    Obtener todas las reservas (Admin/Empleado: todas, Cliente: solo las suyas)
 * @access  Privado
 */
router.get('/',
  verificarAutenticacion,
  controladorReservas.obtenerReservas
);

/**
 * @route   GET /api/reservas/:idReserva
 * @desc    Obtener detalles de una reserva
 * @access  Privado
 */
router.get('/:idReserva',
  verificarAutenticacion,
  controladorReservas.obtenerReserva
);

/**
 * @route   POST /api/reservas
 * @desc    Crear nueva reserva
 * @access  Privado (Cliente)
 */
router.post('/',
  verificarAutenticacion,
  controladorReservas.crearReserva
);

/**
 * @route   POST /api/reservas/procesar-pago
 * @desc    Procesar pago y crear reserva (simulado)
 * @access  Privado (Cliente)
 * @body    {Number} habitacionId - ID de la habitación
 * @body    {String} fechaEntrada - Fecha de entrada (YYYY-MM-DD)
 * @body    {String} fechaSalida - Fecha de salida (YYYY-MM-DD)
 * @body    {Number} numeroHuespedes - Número de huéspedes
 * @body    {String} metodoPago - Método de pago ('visa', 'mastercard', 'mercadopago', 'paypal', 'transferencia')
 * @body    {Object} opcionesAdicionales - Opciones adicionales ({ desayuno, camaExtra, transporte })
 * @body    {Number} puntosAUtilizar - Puntos a utilizar para descuento (opcional)
 * @body    {String} notasEspeciales - Notas especiales (opcional)
 */
router.post('/procesar-pago',
  verificarAutenticacion,
  controladorReservas.procesarPago
);

/**
 * @route   PUT /api/reservas/:idReserva
 * @desc    Modificar reserva
 * @access  Privado
 */
router.put('/:idReserva',
  verificarAutenticacion,
  controladorReservas.modificarReserva
);

/**
 * @route   DELETE /api/reservas/:idReserva
 * @desc    Cancelar reserva
 * @access  Privado
 */
router.delete('/:idReserva',
  verificarAutenticacion,
  controladorReservas.cancelarReserva
);

/**
 * @route   PUT /api/reservas/:idReserva/confirmar
 * @desc    Confirmar reserva (solo empleado/admin)
 * @access  Privado (Empleado/Admin)
 */
router.put('/:idReserva/confirmar',
  verificarAutenticacion,
  verificarRol(['empleado', 'admin']),
  controladorReservas.confirmarReserva
);

/**
 * @route   GET /api/reservas/usuario/historial
 * @desc    Obtener historial de reservas del usuario
 * @access  Privado
 */
router.get('/usuario/historial',
  verificarAutenticacion,
  controladorReservas.obtenerHistorial
);

/**
 * @route   POST /api/reservas/verificar-disponibilidad
 * @desc    Verificar disponibilidad de una habitación en fechas específicas
 * @access  Público
 * @body    {Number} habitacionId - ID de la habitación
 * @body    {String} fechaEntrada - Fecha de entrada (YYYY-MM-DD)
 * @body    {String} fechaSalida - Fecha de salida (YYYY-MM-DD)
 */
router.post('/verificar-disponibilidad',
  controladorReservas.verificarDisponibilidad
);

/**
 * @route   POST /api/reservas/precio-estimado
 * @desc    Obtener precio estimado de una reserva
 * @access  Público
 * @body    {Number} habitacionId - ID de la habitación
 * @body    {String} fechaEntrada - Fecha de entrada (YYYY-MM-DD)
 * @body    {String} fechaSalida - Fecha de salida (YYYY-MM-DD)
 */
router.post('/precio-estimado',
  controladorReservas.obtenerPrecioEstimado
);

module.exports = router;