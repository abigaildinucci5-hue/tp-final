// frontend/src/utils/rolesPermisos.js - Sistema de permisos por rol de usuario

/**
 * Permisos para rol CLIENTE
 */
export const PERMISOS_CLIENTE = {
  // Reservas
  verMisReservas: true,
  crearReserva: true,
  modificarReservaPropia: true,
  cancelarReservaPropia: true,
  verDetalleReserva: true,

  // Habitaciones
  verHabitaciones: true,
  filtrarHabitaciones: true,
  verDetalleHabitacion: true,

  // Comentarios
  crearComentario: true,
  editarComentarioPropio: true,
  eliminarComentarioPropio: true,
  verComentarios: true,

  // Puntos
  verPuntos: true,
  canjearPuntos: true,
  verHistorialPuntos: true,

  // Favoritos
  agregarFavoritos: true,
  verFavoritos: true,
  eliminarFavoritos: true,

  // Perfil
  verPerfilPropio: true,
  editarPerfilPropio: true,
  actualizarFoto: true,
  cambiarPassword: true,

  // Notificaciones
  verNotificaciones: true,
  marcarComoLeida: true,

  // Métodos de pago
  agregarMetodoPago: true,
  verMetodosPago: true,
  eliminarMetodo: true,

  // Dashboard cliente
  verDashboardPersonal: true,
  verResumenReservas: true,
  verResumenPuntos: true,
};

/**
 * Permisos para rol EMPLEADO (Recepcionista)
 */
export const PERMISOS_EMPLEADO = {
  // Reservas
  verReservasDelDia: true,
  verTodasLasReservas: true,
  hacerCheckIn: true,
  hacerCheckOut: true,
  verDetalleReserva: true,
  modificarReserva: false,
  cancelarReserva: false,
  asignarHabitacion: true,

  // Habitaciones
  verEstadoHabitaciones: true,
  cambiarEstadoHabitacion: true,
  marcarEnMantenimiento: true,
  marcarEnLimpieza: true,
  marcarDisponible: true,
  editarHabitacion: false,
  crearHabitacion: false,
  eliminarHabitacion: false,
  verOcupacionTiempoReal: true,

  // Huéspedes
  verDatosHuespedes: true,
  contactarHuespedes: true,
  verHistorialHuesped: true,
  verReservasHuesped: true,

  // Solicitudes especiales
  verSolicitudesPendientes: true,
  crearSolicitud: true,
  resolverSolicitud: true,
  cambiarPrioridadSolicitud: true,

  // Comentarios
  verComentariosPendientes: true,
  aprobarComentarios: true,
  rechazarComentarios: true,
  responderComentarios: true,
  verTodosLosComentarios: true,

  // Usuarios
  verListaUsuarios: false,
  cambiarRolesUsuarios: false,
  desactivarUsuarios: false,

  // Dashboard empleado
  verDashboardEmpleado: true,
  verReservasDelDia: true,
  verSolicitudesPendientes: true,
  verEstadoHabitaciones: true,
  verCalendarioDisponibilidad: true,

  // Descuentos personal
  descuentoReservaPropia: 0.30, // 30% de descuento para empleados
  prioridadReservaPropia: true,
};

/**
 * Permisos para rol ADMIN
 */
export const PERMISOS_ADMIN = {
  // Usuarios
  verListaUsuarios: true,
  verDetalleUsuario: true,
  crearUsuario: true,
  cambiarRolesUsuarios: true,
  modificarUsuarios: true,
  desactivarUsuarios: true,
  suspenderUsuarios: true,
  verHistorialUsuario: true,

  // Habitaciones
  crearHabitacion: true,
  editarHabitacion: true,
  eliminarHabitacion: true,
  subirFotos: true,
  editarFotos: true,
  cambiarPrecios: true,
  cambiarDisponibilidad: true,
  marcarMantenimiento: true,
  verOcupacionTiempoReal: true,

  // Reservas
  verTodasLasReservas: true,
  filtrarReservas: true,
  modificarReserva: true,
  cancelarReserva: true,
  cambiarEstadoReserva: true,
  exportarReseñasReservas: true,

  // Comentarios
  verTodosLosComentarios: true,
  aprobarComentarios: true,
  rechazarComentarios: true,
  responderComentarios: true,
  eliminarComentarios: true,

  // Solicitudes
  verTodasLasSolicitudes: true,
  resolverSolicitudes: true,
  asignarSolicitudes: true,
  cambiarPrioridad: true,

  // Finanzas
  verIngresosLíquidos: true,
  verIngresosProyectados: true,
  verReporteFinanciero: true,
  exportarReportesFinancieros: true,
  verComisiones: true,

  // Puntos
  verHistorialPuntosTodos: true,
  modificarPuntosUsuarios: true,
  crearPromociones: true,

  // Dashboard Admin
  verDashboardCompleto: true,
  verGráficoOcupación: true,
  verHabitacionesMásReservadas: true,
  verIngresosPorMes: true,
  verReseñasPromedio: true,
  verUsuariosRegistrados: true,
  verEstadísticasGenerales: true,

  // Sistema
  verLogsActividad: true,
  verAuditoria: true,
  respaldarDatos: true,
  configurarSistema: true,
};

/**
 * Función para verificar si un usuario tiene un permiso específico
 * @param {String} rol - Rol del usuario ('cliente', 'empleado', 'admin')
 * @param {String} permiso - Nombre del permiso a verificar
 * @returns {Boolean}
 */
export const tienePermiso = (rol, permiso) => {
  const permisosMap = {
    cliente: PERMISOS_CLIENTE,
    empleado: PERMISOS_EMPLEADO,
    admin: PERMISOS_ADMIN,
  };

  const permisosDelRol = permisosMap[rol];

  if (!permisosDelRol) {
    console.warn(`Rol desconocido: ${rol}`);
    return false;
  }

  return permisosDelRol[permiso] === true;
};

/**
 * Función para obtener el valor de un permiso (ej: descuentos)
 * @param {String} rol - Rol del usuario
 * @param {String} permiso - Nombre del permiso
 * @returns {Any}
 */
export const obtenerValorPermiso = (rol, permiso) => {
  const permisosMap = {
    cliente: PERMISOS_CLIENTE,
    empleado: PERMISOS_EMPLEADO,
    admin: PERMISOS_ADMIN,
  };

  const permisosDelRol = permisosMap[rol];

  if (!permisosDelRol) {
    return null;
  }

  return permisosDelRol[permiso] || null;
};

/**
 * Hook para verificar permisos en componentes React Native
 */
export const usePermisos = (userRol) => {
  return {
    tienePermiso: (permiso) => tienePermiso(userRol, permiso),
    obtenerValor: (permiso) => obtenerValorPermiso(userRol, permiso),
    permisos: {
      cliente: PERMISOS_CLIENTE,
      empleado: PERMISOS_EMPLEADO,
      admin: PERMISOS_ADMIN,
    }[userRol] || {},
  };
};

/**
 * Mapeo de rutas según rol
 */
export const RUTAS_POR_ROL = {
  cliente: [
    { nombre: 'Inicio', ruta: 'Home', icon: 'home' },
    { nombre: 'Explorar', ruta: 'Habitaciones', icon: 'grid' },
    { nombre: 'Reservas', ruta: 'MisReservas', icon: 'calendar' },
    { nombre: 'Puntos', ruta: 'MisPuntos', icon: 'star' },
    { nombre: 'Perfil', ruta: 'Perfil', icon: 'user' },
  ],
  empleado: [
    { nombre: 'Dashboard', ruta: 'PanelEmpleado', icon: 'dashboard' },
    { nombre: 'Reservas Hoy', ruta: 'ReservasDelDia', icon: 'calendar' },
    { nombre: 'Habitaciones', ruta: 'EstadoHabitaciones', icon: 'home' },
    { nombre: 'Solicitudes', ruta: 'SolicitudesPendientes', icon: 'alert-circle' },
    { nombre: 'Perfil', ruta: 'Perfil', icon: 'user' },
  ],
  admin: [
    { nombre: 'Dashboard', ruta: 'DashboardAdmin', icon: 'dashboard' },
    { nombre: 'Usuarios', ruta: 'GestionUsuarios', icon: 'users' },
    { nombre: 'Habitaciones', ruta: 'GestionHabitaciones', icon: 'home' },
    { nombre: 'Reservas', ruta: 'GestionReservas', icon: 'calendar' },
    { nombre: 'Comentarios', ruta: 'GestionComentarios', icon: 'message-square' },
    { nombre: 'Reportes', ruta: 'Reportes', icon: 'bar-chart-2' },
    { nombre: 'Perfil', ruta: 'Perfil', icon: 'user' },
  ],
};

export default {
  tienePermiso,
  obtenerValorPermiso,
  usePermisos,
  RUTAS_POR_ROL,
  PERMISOS_CLIENTE,
  PERMISOS_EMPLEADO,
  PERMISOS_ADMIN,
};
