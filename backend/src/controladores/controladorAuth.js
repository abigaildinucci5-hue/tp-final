// backend/src/controladores/controladorAuth.js
// Controlador de Autenticación con soporte OAuth (Google + GitHub)

const bcrypt = require('bcryptjs');
const ModeloUsuario = require('../modelos/modeloUsuario');
const {
  generarAccessToken,
  generarRefreshToken,
  guardarToken,
  invalidarToken,
  invalidarTodosTokensUsuario,
  verificarRefreshToken
} = require('../config/jwt');
const {
  asyncHandler,
  crearError400,
  crearError401,
  crearError404,
  crearError409
} = require('../middlewares/manejadorErrores');
const { ejecutarConsulta, actualizar } = require('../config/baseDatos');

/**
 * ========================================
 * REGISTRO LOCAL (tradicional)
 * POST /api/auth/registro
 * ========================================
 */
const registrarUsuario = asyncHandler(async (req, res) => {
  const { nombre, apellido, email, password, telefono } = req.body;

  // Validaciones
  if (!nombre || !apellido || !email || !password) {
    throw crearError400('Todos los campos obligatorios deben ser completados');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw crearError400('Formato de email inválido');
  }

  if (password.length < 6) {
    throw crearError400('La contraseña debe tener al menos 6 caracteres');
  }

  // Verificar si el email ya existe
  const usuarioExistente = await ModeloUsuario.buscarPorEmail(email);
  if (usuarioExistente) {
    throw crearError409('El email ya está registrado');
  }

  // Crear usuario
  const idUsuario = await ModeloUsuario.crearLocal({
    nombre,
    apellido,
    email,
    password,
    telefono,
    rol: 'cliente'
  });

  // Obtener usuario creado
  const usuario = await ModeloUsuario.buscarPorId(idUsuario);

  // Generar tokens
  const payload = {
    id: usuario.id_usuario,
    email: usuario.email,
    rol: usuario.rol
  };

  const accessToken = generarAccessToken(payload);
  const refreshToken = generarRefreshToken(payload);

  await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
    dispositivo: req.body.dispositivo || 'unknown',
    ip: req.ip
  });

  res.status(201).json({
    exito: true,
    mensaje: 'Usuario registrado correctamente',
    data: {
      usuario: ModeloUsuario.convertirARespuesta(usuario),
      tokens: {
        accessToken,
        refreshToken,
        tipo: 'Bearer'
      }
    }
  });
});

/**
 * ========================================
 * LOGIN LOCAL (tradicional)
 * POST /api/auth/login
 * ========================================
 */
const iniciarSesion = asyncHandler(async (req, res) => {
  const { email, password, dispositivo } = req.body;

  if (!email || !password) {
    throw crearError400('Email y contraseña son requeridos');
  }

  // Buscar usuario
  const usuario = await ModeloUsuario.buscarPorEmail(email);

  if (!usuario) {
    throw crearError401('Credenciales incorrectas');
  }

  if (!usuario.activo) {
    throw crearError401('Usuario inactivo');
  }

  // Verificar que sea usuario local (no OAuth)
  if (usuario.auth_provider !== 'local') {
    throw crearError400(
      `Esta cuenta está vinculada con ${usuario.auth_provider}. Por favor inicia sesión con ${usuario.auth_provider}.`
    );
  }

  // Verificar contraseña
  const passwordValida = await ModeloUsuario.verificarPassword(password, usuario.password_hash);
  if (!passwordValida) {
    throw crearError401('Credenciales incorrectas');
  }

  // Generar tokens
  const payload = {
    id: usuario.id_usuario,
    email: usuario.email,
    rol: usuario.rol
  };

  const accessToken = generarAccessToken(payload);
  const refreshToken = generarRefreshToken(payload);

  await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
    dispositivo: dispositivo || 'unknown',
    ip: req.ip
  });

  // Actualizar último acceso
  await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

  res.json({
    exito: true,
    mensaje: 'Inicio de sesión exitoso',
    data: {
      usuario: ModeloUsuario.convertirARespuesta(usuario),
      tokens: {
        accessToken,
        refreshToken,
        tipo: 'Bearer'
      }
    }
  });
});

/**
 * ========================================
 * CALLBACK DE GOOGLE OAUTH (Web)
 * GET /api/auth/google/callback
 * ========================================
 */
const googleCallback = asyncHandler(async (req, res) => {
  try {
    console.log('🎯 Google OAuth Callback iniciado');

    const usuario = req.user;

    if (!usuario) {
      console.log('❌ No se encontró usuario en req.user');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=auth_failed`);
    }

    console.log('✅ Usuario autenticado:', {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
    });

    // Generar tokens
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
      dispositivo: 'web',
      ip: req.ip
    });

    // Actualizar último acceso
    await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

    console.log('🔑 Tokens generados correctamente');

    // Redirigir al frontend con los tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;

    console.log('🔗 Redirigiendo a frontend');
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error en Google callback:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=auth_error`);
  }
});

/**
 * ========================================
 * CALLBACK DE GITHUB OAUTH (Web)
 * GET /api/auth/github/callback
 * ========================================
 */
const githubCallback = asyncHandler(async (req, res) => {
  try {
    console.log('🎯 GitHub OAuth Callback iniciado');

    const usuario = req.user;

    if (!usuario) {
      console.log('❌ No se encontró usuario en req.user');
      return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=auth_failed`);
    }

    console.log('✅ Usuario autenticado:', {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol,
    });

    // Generar tokens
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
      dispositivo: 'web',
      ip: req.ip
    });

    // Actualizar último acceso
    await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

    console.log('🔑 Tokens generados correctamente');

    // Redirigir al frontend con los tokens
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;

    console.log('🔗 Redirigiendo a frontend');
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error en GitHub callback:', error);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=auth_error`);
  }
});

/**
 * ========================================
 * GOOGLE OAUTH MOBILE (desde React Native)
 * POST /api/auth/google/mobile
 * ========================================
 */
const googleMobileAuth = asyncHandler(async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    throw crearError400('Access token de Google requerido');
  }

  try {
    // Obtener información del usuario desde Google
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const googleUser = await response.json();

    if (!googleUser.email) {
      throw crearError400('No se pudo obtener el email de Google');
    }

    // Buscar o crear usuario
    let usuario = await ModeloUsuario.buscarPorGoogleId(googleUser.sub);

    if (!usuario) {
      usuario = await ModeloUsuario.buscarPorEmail(googleUser.email);

      if (usuario) {
        // Vincular cuenta de Google
        await ModeloUsuario.vincularGoogle(
          usuario.id_usuario,
          googleUser.sub,
          googleUser.picture
        );
        usuario = await ModeloUsuario.buscarPorId(usuario.id_usuario);
      } else {
        // Crear nuevo usuario
        const partesNombre = googleUser.name.split(' ');
        const idNuevoUsuario = await ModeloUsuario.crearConGoogle({
          nombre: partesNombre[0] || 'Usuario',
          apellido: partesNombre.slice(1).join(' ') || 'Google',
          email: googleUser.email,
          googleId: googleUser.sub,
          fotoPerfil: googleUser.picture
        });
        usuario = await ModeloUsuario.buscarPorId(idNuevoUsuario);
      }
    }

    // Generar tokens
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
      dispositivo: req.body.dispositivo || 'mobile',
      ip: req.ip
    });

    await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

    res.json({
      exito: true,
      mensaje: 'Autenticación con Google exitosa',
      data: {
        usuario: ModeloUsuario.convertirARespuesta(usuario),
        tokens: {
          accessToken,
          refreshToken,
          tipo: 'Bearer'
        }
      }
    });

  } catch (error) {
    console.error('Error en Google mobile auth:', error);
    throw crearError401('Error al autenticar con Google');
  }
});

/**
 * ========================================
 * GITHUB OAUTH MOBILE (desde React Native)
 * POST /api/auth/github/mobile
 * ========================================
 */
const githubMobileAuth = asyncHandler(async (req, res) => {
  const { access_token } = req.body;

  if (!access_token) {
    throw crearError400('Access token de GitHub requerido');
  }

  try {
    // Obtener información del usuario desde GitHub
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'Hotel-Luna-Serena'
      }
    });

    const githubUser = await userResponse.json();

    // Obtener emails del usuario
    const emailResponse = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'User-Agent': 'Hotel-Luna-Serena'
      }
    });

    const emails = await emailResponse.json();
    const primaryEmail = emails.find(e => e.primary)?.email || githubUser.email;

    if (!primaryEmail) {
      throw crearError400('No se pudo obtener el email de GitHub');
    }

    // Buscar o crear usuario
    let usuario = await ModeloUsuario.buscarPorGitHubId(githubUser.id.toString());

    if (!usuario) {
      usuario = await ModeloUsuario.buscarPorEmail(primaryEmail);

      if (usuario) {
        // Vincular cuenta de GitHub
        await ModeloUsuario.vincularGitHub(
          usuario.id_usuario,
          githubUser.id.toString(),
          githubUser.avatar_url
        );
        usuario = await ModeloUsuario.buscarPorId(usuario.id_usuario);
      } else {
        // Crear nuevo usuario
        const nombreCompleto = githubUser.name || githubUser.login;
        const partesNombre = nombreCompleto.split(' ');
        const idNuevoUsuario = await ModeloUsuario.crearConGitHub({
          nombre: partesNombre[0] || 'Usuario',
          apellido: partesNombre.slice(1).join(' ') || 'GitHub',
          email: primaryEmail,
          githubId: githubUser.id.toString(),
          fotoPerfil: githubUser.avatar_url
        });
        usuario = await ModeloUsuario.buscarPorId(idNuevoUsuario);
      }
    }

    // Generar tokens
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
      dispositivo: req.body.dispositivo || 'mobile',
      ip: req.ip
    });

    await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

    res.json({
      exito: true,
      mensaje: 'Autenticación con GitHub exitosa',
      data: {
        usuario: ModeloUsuario.convertirARespuesta(usuario),
        tokens: {
          accessToken,
          refreshToken,
          tipo: 'Bearer'
        }
      }
    });

  } catch (error) {
    console.error('Error en GitHub mobile auth:', error);
    throw crearError401('Error al autenticar con GitHub');
  }
});

/**
 * ========================================
 * LOGOUT
 * POST /api/auth/logout
 * ========================================
 */
const cerrarSesion = asyncHandler(async (req, res) => {
  await invalidarToken(req.token);
  res.json({ exito: true, mensaje: 'Sesión cerrada correctamente' });
});

/**
 * ========================================
 * LOGOUT ALL DEVICES
 * POST /api/auth/logout-all
 * ========================================
 */
const cerrarTodasSesiones = asyncHandler(async (req, res) => {
  await invalidarTodosTokensUsuario(req.usuario.id_usuario);
  res.json({ exito: true, mensaje: 'Todas las sesiones cerradas correctamente' });
});

/**
 * ========================================
 * REFRESH TOKEN
 * POST /api/auth/refresh
 * ========================================
 */
const refrescarToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    throw crearError400('Refresh token requerido');
  }

  const decoded = verificarRefreshToken(refreshToken);

  const tokens = await ejecutarConsulta(
    `SELECT id_token FROM tokens_sesion
     WHERE refresh_token = ? AND activo = TRUE AND fecha_expiracion > NOW()
     LIMIT 1`,
    [refreshToken]
  );

  if (tokens.length === 0) {
    throw crearError401('Refresh token inválido o expirado');
  }

  // Buscar el rol actual en la DB
  const usuarios = await ejecutarConsulta(
    'SELECT rol FROM usuarios WHERE id_usuario = ? LIMIT 1',
    [decoded.id]
  );

  if (usuarios.length === 0) {
    throw crearError401('Usuario no válido');
  }

  const nuevoAccessToken = generarAccessToken({
    id: decoded.id,
    email: decoded.email,
    rol: usuarios[0].rol
  });

  await actualizar('tokens_sesion', 'id_token', tokens[0].id_token, {
    token: nuevoAccessToken
  });

  res.json({
    exito: true,
    data: {
      accessToken: nuevoAccessToken,
      tipo: 'Bearer'
    }
  });
});

/**
 * ========================================
 * OBTENER PERFIL
 * GET /api/auth/perfil
 * ========================================
 */
const obtenerPerfil = asyncHandler(async (req, res) => {
  const usuario = await ModeloUsuario.buscarPorId(req.usuario.id_usuario);

  if (!usuario) {
    throw crearError404('Usuario no encontrado');
  }

  res.json({
    exito: true,
    data: ModeloUsuario.convertirARespuesta(usuario)
  });
});

/**
 * ========================================
 * CAMBIAR PASSWORD
 * POST /api/auth/cambiar-password
 * ========================================
 */
const cambiarPassword = asyncHandler(async (req, res) => {
  const { passwordActual, nuevaPassword } = req.body;

  if (!passwordActual || !nuevaPassword) {
    throw crearError400('Contraseña actual y nueva contraseña son requeridas');
  }

  if (nuevaPassword.length < 6) {
    throw crearError400('La nueva contraseña debe tener al menos 6 caracteres');
  }

  const usuario = await ModeloUsuario.buscarPorId(req.usuario.id_usuario);

  if (usuario.auth_provider !== 'local') {
    throw crearError400('No puedes cambiar la contraseña de una cuenta OAuth');
  }

  const passwordValida = await ModeloUsuario.verificarPassword(passwordActual, usuario.password_hash);
  if (!passwordValida) {
    throw crearError401('Contraseña actual incorrecta');
  }

  await ModeloUsuario.cambiarPassword(req.usuario.id_usuario, nuevaPassword);
  await invalidarTodosTokensUsuario(req.usuario.id_usuario);

  res.json({
    exito: true,
    mensaje: 'Contraseña actualizada correctamente. Por favor inicia sesión nuevamente.'
  });
});

module.exports = {
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
};