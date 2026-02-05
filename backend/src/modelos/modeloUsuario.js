// backend/src/modelos/modeloUsuario.js
// Modelo de Usuario con métodos para OAuth y autenticación local

const { ejecutarConsulta } = require('../config/baseDatos');
const bcrypt = require('bcryptjs');

/**
 * ========================================
 * MODELO DE USUARIO
 * ========================================
 */
class ModeloUsuario {
  
  /**
   * Buscar usuario por ID
   */
  static async buscarPorId(idUsuario) {
    const usuarios = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE id_usuario = ? LIMIT 1',
      [idUsuario]
    );
    return usuarios.length > 0 ? usuarios[0] : null;
  }

  /**
   * Buscar usuario por email
   */
  static async buscarPorEmail(email) {
    const usuarios = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE email = ? LIMIT 1',
      [email]
    );
    return usuarios.length > 0 ? usuarios[0] : null;
  }

  /**
   * Buscar usuario por Google ID
   */
  static async buscarPorGoogleId(googleId) {
    const usuarios = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE google_id = ? LIMIT 1',
      [googleId]
    );
    return usuarios.length > 0 ? usuarios[0] : null;
  }

  /**
   * Buscar usuario por GitHub ID
   */
  static async buscarPorGitHubId(githubId) {
    const usuarios = await ejecutarConsulta(
      'SELECT * FROM usuarios WHERE github_id = ? LIMIT 1',
      [githubId]
    );
    return usuarios.length > 0 ? usuarios[0] : null;
  }

  /**
   * Crear usuario local (con contraseña)
   */
  static async crearLocal(datos) {
    const { nombre, apellido, email, password, telefono, rol = 'cliente' } = datos;

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await ejecutarConsulta(
      `INSERT INTO usuarios (nombre, apellido, email, password_hash, telefono, rol, auth_provider, verificado) 
       VALUES (?, ?, ?, ?, ?, ?, 'local', TRUE)`,
      [nombre, apellido, email, passwordHash, telefono || null, rol]
    );

    return resultado.insertId;
  }

  /**
   * Crear usuario con Google OAuth
   */
  static async crearConGoogle(datos) {
    const { nombre, apellido, email, googleId, fotoPerfil } = datos;

    const resultado = await ejecutarConsulta(
      `INSERT INTO usuarios (nombre, apellido, email, google_id, auth_provider, foto_perfil, verificado, rol) 
       VALUES (?, ?, ?, ?, 'google', ?, TRUE, 'cliente')`,
      [nombre, apellido, email, googleId, fotoPerfil]
    );

    return resultado.insertId;
  }

  /**
   * Crear usuario con GitHub OAuth
   */
  static async crearConGitHub(datos) {
    const { nombre, apellido, email, githubId, fotoPerfil } = datos;

    const resultado = await ejecutarConsulta(
      `INSERT INTO usuarios (nombre, apellido, email, github_id, auth_provider, foto_perfil, verificado, rol) 
       VALUES (?, ?, ?, ?, 'github', ?, TRUE, 'cliente')`,
      [nombre, apellido, email, githubId, fotoPerfil]
    );

    return resultado.insertId;
  }

  /**
   * Vincular cuenta de Google a usuario existente
   */
  static async vincularGoogle(idUsuario, googleId, fotoPerfil) {
    await ejecutarConsulta(
      'UPDATE usuarios SET google_id = ?, foto_perfil = ? WHERE id_usuario = ?',
      [googleId, fotoPerfil, idUsuario]
    );
  }

  /**
   * Vincular cuenta de GitHub a usuario existente
   */
  static async vincularGitHub(idUsuario, githubId, fotoPerfil) {
    await ejecutarConsulta(
      'UPDATE usuarios SET github_id = ?, foto_perfil = ? WHERE id_usuario = ?',
      [githubId, fotoPerfil, idUsuario]
    );
  }

  /**
   * Verificar contraseña
   */
  static async verificarPassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }

  /**
   * Actualizar último acceso
   */
  static async actualizarUltimoAcceso(idUsuario) {
    await ejecutarConsulta(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id_usuario = ?',
      [idUsuario]
    );
  }

  /**
   * Actualizar datos del usuario
   */
  static async actualizar(idUsuario, datos) {
    const campos = [];
    const valores = [];

    if (datos.nombre) {
      campos.push('nombre = ?');
      valores.push(datos.nombre);
    }
    if (datos.apellido) {
      campos.push('apellido = ?');
      valores.push(datos.apellido);
    }
    if (datos.telefono !== undefined) {
      campos.push('telefono = ?');
      valores.push(datos.telefono);
    }
    if (datos.foto_perfil) {
      campos.push('foto_perfil = ?');
      valores.push(datos.foto_perfil);
    }

    if (campos.length === 0) return;

    valores.push(idUsuario);

    await ejecutarConsulta(
      `UPDATE usuarios SET ${campos.join(', ')} WHERE id_usuario = ?`,
      valores
    );
  }

  /**
   * Cambiar contraseña
   */
  static async cambiarPassword(idUsuario, nuevaPassword) {
    const passwordHash = await bcrypt.hash(nuevaPassword, 10);
    await ejecutarConsulta(
      'UPDATE usuarios SET password_hash = ? WHERE id_usuario = ?',
      [passwordHash, idUsuario]
    );
  }

  /**
   * Cambiar rol
   */
  static async cambiarRol(idUsuario, nuevoRol) {
    await ejecutarConsulta(
      'UPDATE usuarios SET rol = ? WHERE id_usuario = ?',
      [nuevoRol, idUsuario]
    );
  }

  /**
   * Activar/Desactivar usuario
   */
  static async cambiarEstadoActivo(idUsuario, activo) {
    await ejecutarConsulta(
      'UPDATE usuarios SET activo = ? WHERE id_usuario = ?',
      [activo, idUsuario]
    );
  }

  /**
   * Obtener todos los usuarios (para admin)
   */
  static async obtenerTodos() {
    return await ejecutarConsulta(
      `SELECT id_usuario, nombre, apellido, email, telefono, rol, auth_provider, 
              foto_perfil, activo, verificado, fecha_registro, ultimo_acceso 
       FROM usuarios 
       ORDER BY fecha_registro DESC`
    );
  }

  /**
   * Convertir a respuesta segura (sin password)
   */
  static convertirARespuesta(usuario) {
    return {
      id: usuario.id_usuario,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      authProvider: usuario.auth_provider,
      fotoPerfil: usuario.foto_perfil,
      activo: usuario.activo,
      verificado: usuario.verificado,
      fechaRegistro: usuario.fecha_registro,
      ultimoAcceso: usuario.ultimo_acceso,
    };
  }
}

module.exports = ModeloUsuario;