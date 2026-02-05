// src/rutas/rutasComentarios.js - Rutas de comentarios y reseñas
const express = require('express');
const router = express.Router();
const { autenticacionOpcional, verificarAutenticacion, verificarEmpleado } = require('../middlewares/middlewareAuth');

/**
 * @route   GET /api/comentarios/hotel
 * @desc    Obtener comentarios del hotel
 * @access  Público
 */
router.get('/hotel', autenticacionOpcional, (req, res) => {
  res.json({ mensaje: 'Comentarios del hotel' });
});

/**
 * @route   GET /api/comentarios/habitacion/:idHabitacion
 * @desc    Obtener comentarios de una habitación
 * @access  Público
 */
router.get('/habitacion/:idHabitacion', autenticacionOpcional, (req, res) => {
  res.json({ mensaje: 'Comentarios de habitación' });
});

/**
 * @route   POST /api/comentarios
 * @desc    Crear nuevo comentario
 * @access  Privado
 */
router.post('/', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Crear comentario' });
});

/**
 * @route   PUT /api/comentarios/:idComentario
 * @desc    Actualizar comentario
 * @access  Privado (solo el autor)
 */
router.put('/:idComentario', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Actualizar comentario' });
});

/**
 * @route   DELETE /api/comentarios/:idComentario
 * @desc    Eliminar comentario
 * @access  Privado (autor o admin)
 */
router.delete('/:idComentario', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Eliminar comentario' });
});

/**
 * @route   PUT /api/comentarios/:idComentario/aprobar
 * @desc    Aprobar comentario
 * @access  Privado (Empleado/Admin)
 */
router.put('/:idComentario/aprobar', verificarAutenticacion, verificarEmpleado, (req, res) => {
  res.json({ mensaje: 'Aprobar comentario' });
});

/**
 * @route   POST /api/comentarios/:idComentario/responder
 * @desc    Responder a un comentario (hotel)
 * @access  Privado (Empleado/Admin)
 */
router.post('/:idComentario/responder', verificarAutenticacion, verificarEmpleado, (req, res) => {
  res.json({ mensaje: 'Responder comentario' });
});

module.exports = router;