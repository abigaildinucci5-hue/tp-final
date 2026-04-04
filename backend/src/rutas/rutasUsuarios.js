// src/rutas/rutasUsuarios.js - Rutas de gestión de usuarios
const express = require('express');
const router = express.Router();
const { verificarAutenticacion, verificarAdmin, verificarEmpleado, verificarPropietarioOAdmin } = require('../middlewares/middlewareAuth');
const { obtenerUsuarios, obtenerUsuario, actualizarUsuario, eliminarUsuario, eliminarMiCuenta } = require('../controladores/controladorUsuarios');

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios (admin y empleado)
 * @access  Privado (Admin/Empleado)
 */
router.get('/', verificarAutenticacion, verificarEmpleado, obtenerUsuarios);

/**
 * @route   GET /api/usuarios/:idUsuario
 * @desc    Obtener usuario por ID
 * @access  Privado (Propietario o Admin)
 */
router.get('/:idUsuario', verificarAutenticacion, verificarPropietarioOAdmin(), obtenerUsuario);

/**
 * @route   PUT /api/usuarios/:idUsuario
 * @desc    Actualizar usuario
 * @access  Privado (Propietario o Admin)
 */
router.put('/:idUsuario', verificarAutenticacion, verificarPropietarioOAdmin(), actualizarUsuario);

/**
 * @route   DELETE /api/usuarios/:idUsuario
 * @desc    Eliminar usuario (soft delete)
 * @access  Privado (Admin)
 */
router.delete('/:idUsuario', verificarAutenticacion, verificarAdmin, eliminarUsuario);

/**
 * @route   DELETE /api/usuarios/cuenta
 * @desc    Eliminar la propia cuenta del usuario autenticado
 * @access  Privado (Autenticado)
 */
router.delete('/cuenta', verificarAutenticacion, eliminarMiCuenta);

module.exports = router;