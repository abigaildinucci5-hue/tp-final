// src/rutas/rutasUsuarios.js - Rutas de gestión de usuarios
const express = require('express');
const router = express.Router();
const { verificarAutenticacion, verificarAdmin, verificarPropietarioOAdmin } = require('../middlewares/middlewareAuth');

// Aquí irán los controladores cuando los creemos
// const controladorUsuarios = require('../controladores/controladorUsuarios');

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios (solo admin)
 * @access  Privado (Admin)
 */
router.get('/', verificarAutenticacion, verificarAdmin, (req, res) => {
  res.json({ mensaje: 'Ruta de usuarios - GET all' });
});

/**
 * @route   GET /api/usuarios/:idUsuario
 * @desc    Obtener usuario por ID
 * @access  Privado (Propietario o Admin)
 */
router.get('/:idUsuario', verificarAutenticacion, verificarPropietarioOAdmin(), (req, res) => {
  res.json({ mensaje: 'Ruta de usuarios - GET por ID' });
});

/**
 * @route   PUT /api/usuarios/:idUsuario
 * @desc    Actualizar usuario
 * @access  Privado (Propietario o Admin)
 */
router.put('/:idUsuario', verificarAutenticacion, verificarPropietarioOAdmin(), (req, res) => {
  res.json({ mensaje: 'Ruta de usuarios - PUT' });
});

/**
 * @route   DELETE /api/usuarios/:idUsuario
 * @desc    Eliminar usuario (soft delete)
 * @access  Privado (Admin)
 */
router.delete('/:idUsuario', verificarAutenticacion, verificarAdmin, (req, res) => {
  res.json({ mensaje: 'Ruta de usuarios - DELETE' });
});

module.exports = router;