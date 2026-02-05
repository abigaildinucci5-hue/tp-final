// src/middlewares/middlewareVerificarRol.js - Middleware para verificar roles y permisos

/**
 * Middleware para verificar que el usuario tiene el rol requerido
 * @param {Array<string>} rolesPermitidos - Array con los roles que pueden acceder
 */
const verificarRol = (rolesPermitidos = []) => {
  return (req, res, next) => {
    try {
      // Verificar que existe el usuario en la request
      if (!req.usuario) {
        return res.status(401).json({
          exito: false,
          mensaje: 'Usuario no autenticado'
        });
      }

      // Obtener rol del usuario
      const rolUsuario = req.usuario.rol || 'invitado';

      // Verificar que el rol está en los permitidos
      if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUsuario)) {
        return res.status(403).json({
          exito: false,
          mensaje: `Acceso denegado. Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}`
        });
      }

      // Usuario autorizado, continuar
      next();
    } catch (error) {
      console.error('Error en middlewareVerificarRol:', error.message);
      return res.status(500).json({
        exito: false,
        mensaje: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Middleware para verificar permisos específicos
 * @param {string} permiso - Nombre del permiso a verificar
 */
const verificarPermiso = (permiso) => {
  return (req, res, next) => {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          exito: false,
          mensaje: 'Usuario no autenticado'
        });
      }

      // Aquí puedes agregar lógica más compleja de permisos
      // Por ahora, solo verificamos el rol
      const permisosUsuario = obtenerPermisosUsuario(req.usuario.rol);
      
      if (!permisosUsuario[permiso]) {
        return res.status(403).json({
          exito: false,
          mensaje: `No tienes permiso para: ${permiso}`
        });
      }

      next();
    } catch (error) {
      console.error('Error en verificarPermiso:', error.message);
      return res.status(500).json({
        exito: false,
        mensaje: 'Error al verificar permisos'
      });
    }
  };
};

/**
 * Obtener permisos basado en el rol del usuario
 * @param {string} rol - Rol del usuario
 * @returns {Object} Objeto con permisos del usuario
 */
const obtenerPermisosUsuario = (rol) => {
  const permisos = {
    invitado: {
      verHabitaciones: true,
      buscarHabitaciones: true,
      verDetalleHabitacion: true,
      verComentarios: true
    },
    usuario: {
      verHabitaciones: true,
      buscarHabitaciones: true,
      verDetalleHabitacion: true,
      hacerReserva: true,
      verMisReservas: true,
      cancelarMisReservas: true,
      comentarHabitacion: true,
      verComentarios: true,
      verPerfil: true,
      editarPerfil: true
    },
    empleado: {
      // Permisos de usuario
      verHabitaciones: true,
      buscarHabitaciones: true,
      verDetalleHabitacion: true,
      verMisReservas: true,
      verComentarios: true,
      
      // Permisos específicos de empleado
      verReservasDelDia: true,
      hacerCheckIn: true,
      hacerCheckOut: true,
      verDetalleReserva: true,
      verEstadoHabitaciones: true,
      cambiarEstadoLimpieza: true,
      marcarMantenimiento: true,
      verDatosHuespedes: true,
      contactarHuespedes: true,
      verHistorialHuesped: true,
      verSolicitudes: true,
      resolverSolicitudes: true,
      crearSolicitud: true
    },
    admin: {
      // Acceso total
      verHabitaciones: true,
      buscarHabitaciones: true,
      verDetalleHabitacion: true,
      hacerReserva: true,
      verMisReservas: true,
      cancelarMisReservas: true,
      comentarHabitacion: true,
      verComentarios: true,
      verPerfil: true,
      editarPerfil: true,
      verReservasDelDia: true,
      hacerCheckIn: true,
      hacerCheckOut: true,
      verDetalleReserva: true,
      modificarReserva: true,
      cancelarReserva: true,
      verEstadoHabitaciones: true,
      cambiarEstadoLimpieza: true,
      marcarMantenimiento: true,
      editarHabitacion: true,
      eliminarHabitacion: true,
      verDatosHuespedes: true,
      contactarHuespedes: true,
      verHistorialHuesped: true,
      verSolicitudes: true,
      resolverSolicitudes: true,
      crearSolicitud: true,
      responderComentarios: true,
      verTodasReservas: true,
      gestionarUsuarios: true,
      verReportes: true,
      gestionarHabitaciones: true
    }
  };

  return permisos[rol] || permisos.invitado;
};

/**
 * Middleware que solo permite al usuario acceder a sus propios datos
 */
const verificarAccesoPropio = (req, res, next) => {
  try {
    if (!req.usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no autenticado'
      });
    }

    const usuarioIdParam = parseInt(req.params.usuarioId);
    const usuarioIdToken = req.usuario.id_usuario;

    // Admin puede acceder a cualquier usuario
    if (req.usuario.rol === 'admin') {
      return next();
    }

    // Otros usuarios solo pueden acceder a sus propios datos
    if (usuarioIdParam !== usuarioIdToken) {
      return res.status(403).json({
        exito: false,
        mensaje: 'No tienes permiso para acceder a estos datos'
      });
    }

    next();
  } catch (error) {
    console.error('Error en verificarAccesoPropio:', error.message);
    return res.status(500).json({
      exito: false,
      mensaje: 'Error al verificar acceso'
    });
  }
};

module.exports = {
  verificarRol,
  verificarPermiso,
  obtenerPermisosUsuario,
  verificarAccesoPropio
};
