// src/rutas/rutasHabitaciones.js - Rutas de gestión de habitaciones
const express = require('express');
const router = express.Router();
const controladorHabitaciones = require('../controladores/controladorHabitaciones');
const { autenticacionOpcional, verificarAutenticacion, verificarAdmin, verificarEmpleado } = require('../middlewares/middlewareAuth');

/**
 * @route   GET /api/habitaciones/tipos/lista
 * @desc    Obtener todos los tipos de habitación
 * @access  Público
 */
router.get('/tipos/lista', controladorHabitaciones.obtenerTiposHabitacion);

/**
 * @route   GET /api/habitaciones/favoritos/mis-favoritos
 * @desc    Obtener habitaciones favoritas del usuario
 * @access  Privado (Usuario autenticado)
 */
router.get('/favoritos/mis-favoritos', verificarAutenticacion, controladorHabitaciones.obtenerFavoritos);

/**
 * @route   GET /api/habitaciones
 * @desc    Obtener todas las habitaciones disponibles (soporta populares con query)
 * @access  Público (pero puede mostrar info extra si está autenticado)
 */
router.get('/', autenticacionOpcional, (req, res, next) => {
  // Si viene con parámetro "limite", es una petición de populares
  if (req.query.limite || req.query.limit) {
    return controladorHabitaciones.obtenerHabitacionesPopulares(req, res, next);
  }
  // Si no, obtener todas con filtros
  return controladorHabitaciones.obtenerHabitaciones(req, res, next);
});

/**
 * @route   GET /api/habitaciones/:idHabitacion
 * @desc    Obtener detalles de una habitación
 * @access  Público
 */
router.get('/:idHabitacion', autenticacionOpcional, controladorHabitaciones.obtenerHabitacion);

/**
 * @route   GET /api/habitaciones/:idHabitacion/disponibilidad
 * @desc    Verificar disponibilidad de una habitación
 * @access  Público
 */
router.get('/:idHabitacion/disponibilidad', controladorHabitaciones.verificarDisponibilidad);

/**
 * @route   POST /api/habitaciones
 * @desc    Crear nueva habitación
 * @access  Privado (Admin)
 */
router.post('/', verificarAutenticacion, verificarAdmin, controladorHabitaciones.crearHabitacion);

/**
 * @route   PUT /api/habitaciones/:idHabitacion
 * @desc    Actualizar habitación
 * @access  Privado (Admin o Empleado)
 */
router.put('/:idHabitacion', verificarAutenticacion, verificarEmpleado, controladorHabitaciones.actualizarHabitacion);

/**
 * @route   DELETE /api/habitaciones/:idHabitacion
 * @desc    Eliminar habitación
 * @access  Privado (Admin)
 */
router.delete('/:idHabitacion', verificarAutenticacion, verificarAdmin, controladorHabitaciones.eliminarHabitacion);

/**
 * @route   POST /api/habitaciones/:idHabitacion/favorito
 * @desc    Agregar/quitar habitación de favoritos
 * @access  Privado (Usuario autenticado)
 */
router.post('/:idHabitacion/favorito', verificarAutenticacion, controladorHabitaciones.toggleFavorito);

module.exports = router;