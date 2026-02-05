// src/rutas/rutasNotificaciones.js - Rutas de notificaciones
const express = require('express');
const router = express.Router();
const { verificarAutenticacion } = require('../middlewares/middlewareAuth');

/**
 * @route   GET /api/notificaciones
 * @desc    Obtener notificaciones del usuario
 * @access  Privado
 */
router.get('/', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Obtener notificaciones del usuario' });
});

/**
 * @route   GET /api/notificaciones/no-leidas
 * @desc    Obtener notificaciones no leídas
 * @access  Privado
 */
router.get('/no-leidas', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Obtener notificaciones no leídas' });
});

/**
 * @route   GET /api/notificaciones/cantidad-no-leidas
 * @desc    Obtener cantidad de notificaciones no leídas
 * @access  Privado
 */
router.get('/cantidad-no-leidas', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Cantidad de notificaciones no leídas' });
});

/**
 * @route   PUT /api/notificaciones/:idNotificacion/marcar-leida
 * @desc    Marcar notificación como leída
 * @access  Privado
 */
router.put('/:idNotificacion/marcar-leida', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Marcar notificación como leída' });
});

/**
 * @route   PUT /api/notificaciones/marcar-todas-leidas
 * @desc    Marcar todas las notificaciones como leídas
 * @access  Privado
 */
router.put('/marcar-todas-leidas', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Marcar todas como leídas' });
});

/**
 * @route   DELETE /api/notificaciones/:idNotificacion
 * @desc    Eliminar notificación
 * @access  Privado
 */
router.delete('/:idNotificacion', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Eliminar notificación' });
});

/**
 * @route   DELETE /api/notificaciones/limpiar-todas
 * @desc    Eliminar todas las notificaciones del usuario
 * @access  Privado
 */
router.delete('/limpiar-todas', verificarAutenticacion, (req, res) => {
  res.json({ mensaje: 'Eliminar todas las notificaciones' });
});

module.exports = router;