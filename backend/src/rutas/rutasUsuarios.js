// src/rutas/rutasUsuarios.js - Rutas de gestión de usuarios
const express = require('express');
const router = express.Router();
const controladorUsuarios = require('../controladores/controladorUsuarios');
const { verificarAutenticacion, verificarAdmin, verificarPropietarioOAdmin } = require('../middlewares/middlewareAuth');
const { verificarRol } = require('../middlewares/middlewareVerificarRol');

// ============================================================
// RUTAS BÁSICAS DE USUARIO
// ============================================================

/**
 * @route   GET /api/usuarios
 * @desc    Obtener todos los usuarios con paginación y filtros
 * @access  Privado (Admin)
 * @query   {String} rol - Filtrar por rol
 * @query   {Boolean} activo - Filtrar activos/inactivos
 * @query   {String} busqueda - Buscar por nombre/email
 * @query   {Number} limite - Items por página (default: 50)
 * @query   {Number} pagina - Número de página (default: 1)
 */
router.get('/', 
  verificarAutenticacion, 
  verificarRol(['admin']),
  controladorUsuarios.obtenerUsuarios
);

/**
 * @route   GET /api/usuarios/buscar
 * @desc    Buscar usuarios por término
 * @access  Privado
 * @query   {String} query - Término de búsqueda
 */
router.get('/buscar',
  verificarAutenticacion,
  controladorUsuarios.buscarUsuarios
);

/**
 * @route   GET /api/usuarios/:idUsuario
 * @desc    Obtener usuario por ID (perfil básico)
 * @access  Privado (Propietario o Admin)
 */
router.get('/:idUsuario',
  verificarAutenticacion,
  controladorUsuarios.obtenerUsuario
);

/**
 * @route   GET /api/usuarios/:idUsuario/perfil-completo
 * @desc    Obtener perfil completo del usuario con historial
 * @access  Privado (Propietario o Admin)
 */
router.get('/:idUsuario/perfil-completo',
  verificarAutenticacion,
  controladorUsuarios.obtenerPerfilCompleto
);

/**
 * @route   PUT /api/usuarios/:idUsuario
 * @desc    Actualizar datos del usuario
 * @access  Privado (Propietario o Admin)
 */
router.put('/:idUsuario',
  verificarAutenticacion,
  controladorUsuarios.actualizarUsuario
);

/**
 * @route   PUT /api/usuarios/:idUsuario/foto-perfil
 * @desc    Actualizar foto de perfil
 * @access  Privado (Propietario o Admin)
 */
router.put('/:idUsuario/foto-perfil',
  verificarAutenticacion,
  controladorUsuarios.actualizarFotoPerfil
);

/**
 * @route   DELETE /api/usuarios/:idUsuario
 * @desc    Eliminar usuario (soft delete)
 * @access  Privado (Admin)
 */
router.delete('/:idUsuario',
  verificarAutenticacion,
  verificarRol(['admin']),
  controladorUsuarios.eliminarUsuario
);

// ============================================================
// RUTAS DE ROLES Y ESTADO
// ============================================================

/**
 * @route   PUT /api/usuarios/:idUsuario/rol
 * @desc    Cambiar rol del usuario (solo admin)
 * @access  Privado (Admin)
 * @body    {String} rol - 'cliente', 'empleado', 'admin'
 */
router.put('/:idUsuario/rol',
  verificarAutenticacion,
  verificarRol(['admin']),
  controladorUsuarios.cambiarRol
);

/**
 * @route   PUT /api/usuarios/:idUsuario/toggle-activo
 * @desc    Activar/desactivar usuario
 * @access  Privado (Admin)
 */
router.put('/:idUsuario/toggle-activo',
  verificarAutenticacion,
  verificarRol(['admin']),
  controladorUsuarios.toggleActivo
);

// ============================================================
// RUTAS ADMIN - ESTADÍSTICAS Y REPORTES
// ============================================================

/**
 * @route   GET /api/usuarios/admin/estadisticas
 * @desc    Obtener estadísticas generales de usuarios
 * @access  Privado (Admin)
 */
router.get('/admin/estadisticas',
  verificarAutenticacion,
  verificarRol(['admin']),
  controladorUsuarios.obtenerEstadisticasUsuarios
);

// ============================================================
// RUTAS DE PUNTOS
// ============================================================

/**
 * @route   GET /api/usuarios/:idUsuario/historial-puntos
 * @desc    Obtener historial de puntos del usuario
 * @access  Privado (Propietario o Admin)
 * @query   {Number} limite - Items por página (default: 50)
 * @query   {Number} pagina - Número de página (default: 1)
 */
router.get('/:idUsuario/historial-puntos',
  verificarAutenticacion,
  controladorUsuarios.obtenerHistorialPuntos
);

/**
 * @route   POST /api/usuarios/:idUsuario/canjear-puntos
 * @desc    Canjear puntos por descuento
 * @access  Privado (Propietario o Admin)
 * @body    {Number} puntosAcanjear - Cantidad de puntos a canjear
 */
router.post('/:idUsuario/canjear-puntos',
  verificarAutenticacion,
  controladorUsuarios.canjearPuntos
);

// ============================================================
// RUTAS DE MÉTODOS DE PAGO
// ============================================================

/**
 * @route   GET /api/usuarios/:idUsuario/metodos-pago
 * @desc    Obtener métodos de pago del usuario
 * @access  Privado (Propietario o Admin)
 */
router.get('/:idUsuario/metodos-pago',
  verificarAutenticacion,
  controladorUsuarios.obtenerMetodosPago
);

/**
 * @route   POST /api/usuarios/:idUsuario/metodos-pago
 * @desc    Agregar nuevo método de pago
 * @access  Privado (Propietario o Admin)
 * @body    {String} tipo - 'visa', 'mastercard', 'mercadopago', 'paypal'
 * @body    {String} nombreTitular - Nombre del titular
 * @body    {String} ultimos4Digitos - Últimos 4 dígitos
 * @body    {Number} mesVencimiento - Mes de vencimiento
 * @body    {Number} anioVencimiento - Año de vencimiento
 * @body    {Boolean} esDefault - Si es el método predeterminado
 */
router.post('/:idUsuario/metodos-pago',
  verificarAutenticacion,
  controladorUsuarios.agregarMetodoPago
);

/**
 * @route   DELETE /api/usuarios/:idUsuario/metodos-pago/:metodoId
 * @desc    Eliminar método de pago
 * @access  Privado (Propietario o Admin)
 */
router.delete('/:idUsuario/metodos-pago/:metodoId',
  verificarAutenticacion,
  controladorUsuarios.eliminarMetodoPago
);

// ============================================================
// RUTAS DE PREFERENCIAS
// ============================================================

/**
 * @route   PUT /api/usuarios/:idUsuario/preferencias
 * @desc    Actualizar preferencias del usuario
 * @access  Privado (Propietario o Admin)
 */
router.put('/:idUsuario/preferencias',
  verificarAutenticacion,
  controladorUsuarios.actualizarPreferencias
);

module.exports = router;