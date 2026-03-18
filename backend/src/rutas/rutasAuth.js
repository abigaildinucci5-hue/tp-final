// backend/src/rutas/rutasAuth.js
// Rutas de autenticación con soporte OAuth (Google + GitHub)

const express = require('express');
const router = express.Router();
const passport = require('../config/oauth');
const { verificarAutenticacion } = require('../middlewares/middlewareAuth'); // ✅ CORREGIDO
const {
  registrarUsuario,
  iniciarSesion,
  googleCallback,
  githubCallback,
  googleMobileAuth,
  githubMobileAuth,
  cerrarSesion,
  cerrarTodasSesiones,
  refrescarToken,
  obtenerPerfil,
  cambiarPassword
} = require('../controladores/controladorAuth');

/**
 * ========================================
 * RUTAS DE AUTENTICACIÓN LOCAL
 * ========================================
 */

/**
 * POST /api/auth/registro
 * Registro de usuario con email y contraseña
 */
router.post('/registro', registrarUsuario);

/**
 * POST /api/auth/login
 * Login de usuario con email y contraseña
 */
router.post('/login', iniciarSesion);

/**
 * POST /api/auth/logout
 * Cerrar sesión actual
 * Requiere autenticación
 */
router.post('/logout', verificarAutenticacion, cerrarSesion); // ✅ CORREGIDO

/**
 * POST /api/auth/logout-all
 * Cerrar todas las sesiones del usuario
 * Requiere autenticación
 */
router.post('/logout-all', verificarAutenticacion, cerrarTodasSesiones); // ✅ CORREGIDO

/**
 * POST /api/auth/refresh
 * Refrescar access token usando refresh token
 */
router.post('/refresh', refrescarToken);

/**
 * GET /api/auth/perfil
 * Obtener perfil del usuario autenticado
 * Requiere autenticación
 */
router.get('/perfil', verificarAutenticacion, obtenerPerfil); // ✅ CORREGIDO

/**
 * POST /api/auth/cambiar-password
 * Cambiar contraseña del usuario
 * Requiere autenticación
 */
router.post('/cambiar-password', verificarAutenticacion, cambiarPassword); // ✅ CORREGIDO

/**
 * ========================================
 * RUTAS DE GOOGLE OAUTH
 * ========================================
 */

/**
 * GET /api/auth/google
 * Iniciar flujo de autenticación con Google (WEB)
 * Redirige al usuario a la página de login de Google
 */
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false
  })
);

/**
 * GET /api/auth/google/callback
 * Callback de Google OAuth (WEB)
 * Google redirige aquí después de que el usuario autoriza
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=google_auth_failed`
  }),
  googleCallback
);

/**
 * POST /api/auth/google/mobile
 * Autenticación con Google desde React Native
 * Body: { access_token: "token_de_google" }
 */
router.post('/google/mobile', googleMobileAuth);

/**
 * ========================================
 * RUTAS DE GITHUB OAUTH
 * ========================================
 */

/**
 * GET /api/auth/github
 * Iniciar flujo de autenticación con GitHub (WEB)
 * Redirige al usuario a la página de login de GitHub
 */
router.get(
  '/github',
  passport.authenticate('github', {
    scope: ['user:email'],
    session: false
  })
);

/**
 * GET /api/auth/github/callback
 * Callback de GitHub OAuth (WEB)
 * GitHub redirige aquí después de que el usuario autoriza
 */
router.get(
  '/github/callback',
  passport.authenticate('github', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=github_auth_failed`
  }),
  githubCallback
);

/**
 * POST /api/auth/github/mobile
 * Autenticación con GitHub desde React Native
 * Body: { access_token: "token_de_github" }
 */
router.post('/github/mobile', githubMobileAuth);

/**
 * ========================================
 * RUTA DE PRUEBA (DESARROLLO)
 * ========================================
 */

/**
 * GET /api/auth/test
 * Verificar que las rutas de auth están funcionando
 */
router.get('/test', (req, res) => {
  res.json({
    exito: true,
    mensaje: 'Rutas de autenticación funcionando correctamente',
    rutas_disponibles: {
      local: [
        'POST /api/auth/registro',
        'POST /api/auth/login',
        'POST /api/auth/logout',
        'POST /api/auth/refresh',
        'GET /api/auth/perfil',
        'POST /api/auth/cambiar-password'
      ],
      google: [
        'GET /api/auth/google (web)',
        'GET /api/auth/google/callback (web)',
        'POST /api/auth/google/mobile (mobile)'
      ],
      github: [
        'GET /api/auth/github (web)',
        'GET /api/auth/github/callback (web)',
        'POST /api/auth/github/mobile (mobile)'
      ]
    }
  });
});

module.exports = router;