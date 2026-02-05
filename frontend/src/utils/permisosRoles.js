/**
 * frontend/src/utils/permisosRoles.js
 * Sistema de permisos y roles para Hotel Luna Serena
 */

// ============================================================
// DEFINICIÓN DE ROLES
// ============================================================

export const ROLES = {
  INVITADO: 'invitado',
  USUARIO: 'usuario',
  EMPLEADO: 'empleado',
  ADMIN: 'admin'
};

// ============================================================
// PERMISOS POR ROL - INVITADO
// ============================================================

export const PERMISOS_INVITADO = {
  // Navegación
  verHabitaciones: true,
  buscarHabitaciones: true,
  verDetalleHabitacion: true,
  verComentarios: true,
  
  // Reservas
  hacerReserva: false,
  verMisReservas: false,
  
  // Perfil
  verPerfil: false,
  editarPerfil: false,
  
  // Comentarios
  comentarHabitacion: false,
  
  // Puntos
  verPuntos: false,
  canjearPuntos: false,
  
  // Otras acciones
  contactarSoporte: true
};

// ============================================================
// PERMISOS POR ROL - USUARIO
// ============================================================

export const PERMISOS_USUARIO = {
  // Navegación
  verHabitaciones: true,
  buscarHabitaciones: true,
  verDetalleHabitacion: true,
  verComentarios: true,
  
  // Reservas
  hacerReserva: true,
  verMisReservas: true,
  cancelarMisReservas: true,
  modificarMisReservas: true,
  
  // Perfil
  verPerfil: true,
  editarPerfil: true,
  verHistorialCompleto: true,
  agregarMetodosPago: true,
  verMetodosPago: true,
  editarPreferencias: true,
  
  // Comentarios
  comentarHabitacion: true,
  editarMisComentarios: true,
  
  // Puntos
  verPuntos: true,
  canjearPuntos: true,
  verHistorialPuntos: true,
  
  // Otras acciones
  contactarSoporte: true,
  verNotificaciones: true
};

// ============================================================
// PERMISOS POR ROL - EMPLEADO
// ============================================================

export const PERMISOS_EMPLEADO = {
  // Permisos básicos de usuario
  verHabitaciones: true,
  buscarHabitaciones: true,
  verDetalleHabitacion: true,
  verComentarios: true,
  hacerReserva: true,
  verMisReservas: true,
  comentarHabitacion: true,
  
  // Check-in / Check-out
  verReservasDelDia: true,
  hacerCheckIn: true,
  hacerCheckOut: true,
  verDetalleReserva: true,
  
  // Gestión de habitaciones
  verEstadoHabitaciones: true,
  cambiarEstadoLimpieza: true,
  cambiarEstadoMantenimiento: true,
  marcarMantenimiento: true,
  
  // Gestión de huéspedes
  verDatosHuespedes: true,
  contactarHuespedes: true,
  verHistorialHuesped: true,
  
  // Solicitudes
  verSolicitudes: true,
  resolverSolicitudes: true,
  crearSolicitud: true,
  
  // Reportes básicos
  verReporteHuespedes: true,
  
  // Descuento especial
  descuentoReservaPropia: 0.30, // 30% de descuento en propias reservas
  prioridadReserva: true,
  
  // Restricciones
  modificarReserva: false,
  cancelarReserva: false,
  eliminarHabitacion: false,
  editarHabitacion: false
};

// ============================================================
// PERMISOS POR ROL - ADMIN
// ============================================================

export const PERMISOS_ADMIN = {
  // Todos los permisos
  verHabitaciones: true,
  buscarHabitaciones: true,
  verDetalleHabitacion: true,
  hacerReserva: true,
  verMisReservas: true,
  cancelarMisReservas: true,
  modificarMisReservas: true,
  verPerfil: true,
  editarPerfil: true,
  verHistorialCompleto: true,
  agregarMetodosPago: true,
  verMetodosPago: true,
  editarPreferencias: true,
  comentarHabitacion: true,
  editarMisComentarios: true,
  verPuntos: true,
  canjearPuntos: true,
  verHistorialPuntos: true,
  
  // Operaciones de empleado
  verReservasDelDia: true,
  hacerCheckIn: true,
  hacerCheckOut: true,
  verDetalleReserva: true,
  verEstadoHabitaciones: true,
  cambiarEstadoLimpieza: true,
  cambiarEstadoMantenimiento: true,
  marcarMantenimiento: true,
  verDatosHuespedes: true,
  contactarHuespedes: true,
  verHistorialHuesped: true,
  verSolicitudes: true,
  resolverSolicitudes: true,
  crearSolicitud: true,
  
  // Operaciones de admin
  gestionarUsuarios: true,
  cambiarRolUsuario: true,
  activarDesactivarUsuario: true,
  eliminarUsuario: true,
  verTodasReservas: true,
  modificarReserva: true,
  cancelarReserva: true,
  gestionarHabitaciones: true,
  crearHabitacion: true,
  editarHabitacion: true,
  eliminarHabitacion: true,
  responderComentarios: true,
  aprobarComentarios: true,
  verReportes: true,
  verReporteFinanzas: true,
  verReportePerfil: true,
  gestionarDescuentos: true,
  verAuditoria: true,
  configurarSistema: true
};

// ============================================================
// MAPA DE PERMISOS POR ROL
// ============================================================

export const MAPA_PERMISOS = {
  [ROLES.INVITADO]: PERMISOS_INVITADO,
  [ROLES.USUARIO]: PERMISOS_USUARIO,
  [ROLES.EMPLEADO]: PERMISOS_EMPLEADO,
  [ROLES.ADMIN]: PERMISOS_ADMIN
};

// ============================================================
// FUNCIONES DE UTILIDAD
// ============================================================

/**
 * Verificar si un usuario tiene un permiso específico
 * @param {string} rol - Rol del usuario
 * @param {string} permiso - Nombre del permiso
 * @returns {boolean} True si tiene el permiso
 */
export const tienePermiso = (rol, permiso) => {
  const permisos = MAPA_PERMISOS[rol];
  if (!permisos) return false;
  return permisos[permiso] === true;
};

/**
 * Verificar si un usuario tiene múltiples permisos (AND)
 * @param {string} rol - Rol del usuario
 * @param {string[]} permisos - Array de permisos
 * @returns {boolean} True si tiene todos los permisos
 */
export const tienePermisos = (rol, permisos = []) => {
  return permisos.every(permiso => tienePermiso(rol, permiso));
};

/**
 * Verificar si un usuario tiene al menos un permiso (OR)
 * @param {string} rol - Rol del usuario
 * @param {string[]} permisos - Array de permisos
 * @returns {boolean} True si tiene al menos uno
 */
export const tieneAlgunPermiso = (rol, permisos = []) => {
  return permisos.some(permiso => tienePermiso(rol, permiso));
};

/**
 * Obtener todos los permisos de un rol
 * @param {string} rol - Rol del usuario
 * @returns {Object} Objeto con todos los permisos del rol
 */
export const obtenerPermisos = (rol) => {
  return MAPA_PERMISOS[rol] || MAPA_PERMISOS[ROLES.INVITADO];
};

/**
 * Verificar si el usuario es empleado o superior
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esEmpleadoOSuperior = (rol) => {
  return [ROLES.EMPLEADO, ROLES.ADMIN].includes(rol);
};

/**
 * Verificar si el usuario es admin
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esAdmin = (rol) => {
  return rol === ROLES.ADMIN;
};

/**
 * Verificar si el usuario es usuario registrado (no invitado)
 * @param {string} rol - Rol del usuario
 * @returns {boolean}
 */
export const esUsuarioRegistrado = (rol) => {
  return rol !== ROLES.INVITADO;
};

/**
 * Obtener nombre legible del rol
 * @param {string} rol - Rol del usuario
 * @returns {string} Nombre del rol en formato legible
 */
export const obtenerNombreRol = (rol) => {
  const nombres = {
    [ROLES.INVITADO]: 'Invitado',
    [ROLES.USUARIO]: 'Usuario',
    [ROLES.EMPLEADO]: 'Empleado/Recepcionista',
    [ROLES.ADMIN]: 'Administrador'
  };
  return nombres[rol] || 'Desconocido';
};

/**
 * Obtener descripción del rol
 * @param {string} rol - Rol del usuario
 * @returns {string} Descripción del rol
 */
export const obtenerDescripcionRol = (rol) => {
  const descripciones = {
    [ROLES.INVITADO]: 'Puede ver habitaciones pero necesita registrarse para hacer reservas',
    [ROLES.USUARIO]: 'Usuario registrado con acceso a todas las funciones de cliente',
    [ROLES.EMPLEADO]: 'Personal del hotel con acceso a operaciones de recepción y reportes',
    [ROLES.ADMIN]: 'Administrador del sistema con acceso total a todas las funciones'
  };
  return descripciones[rol] || 'Rol desconocido';
};

/**
 * Validar acceso a una ruta
 * @param {string} rol - Rol del usuario
 * @param {string|string[]} rolesPermitidos - Roles permitidos
 * @returns {boolean}
 */
export const validarAccesoRuta = (rol, rolesPermitidos) => {
  if (Array.isArray(rolesPermitidos)) {
    return rolesPermitidos.includes(rol);
  }
  return rol === rolesPermitidos;
};

// ============================================================
// CONSTANTES DE ACCIONES
// ============================================================

export const ACCIONES_EMPLEADO = {
  CHECKIN: 'hacerCheckIn',
  CHECKOUT: 'hacerCheckOut',
  CAMBIAR_ESTADO_HABITACION: 'cambiarEstadoHabitacion',
  RESOLVER_SOLICITUD: 'resolverSolicitud',
  VER_SOLICITUDES: 'verSolicitudes'
};

export const ACCIONES_ADMIN = {
  RESPONDER_COMENTARIO: 'responderComentarios',
  APROBAR_COMENTARIO: 'aprobarComentarios',
  GESTIONAR_USUARIOS: 'gestionarUsuarios',
  VER_REPORTES: 'verReportes',
  GESTIONAR_DESCUENTOS: 'gestionarDescuentos',
  VER_AUDITORIA: 'verAuditoria'
};

// ============================================================
// ESTADOS DE HABITACIÓN
// ============================================================

export const ESTADOS_HABITACION = {
  DISPONIBLE: 'disponible',
  OCUPADA: 'ocupada',
  LIMPIEZA: 'limpieza',
  MANTENIMIENTO: 'mantenimiento'
};

// ============================================================
// ESTADOS DE RESERVA
// ============================================================

export const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  PENDIENTE_PAGO: 'pendiente_pago',
  CONFIRMADA: 'confirmada',
  EN_CURSO: 'en_curso',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

// ============================================================
// TIPOS DE SOLICITUD
// ============================================================

export const TIPOS_SOLICITUD = {
  SERVICIO_HABITACION: 'servicio_habitacion',
  CAMA_EXTRA: 'cama_extra',
  HIGIENE: 'higiene',
  TOALLAS: 'toallas',
  PROBLEMA_TECNICO: 'problema_tecnico',
  OTRO: 'otro'
};

export const ETIQUETAS_TIPOS_SOLICITUD = {
  servicio_habitacion: 'Servicio a la Habitación',
  cama_extra: 'Cama Extra',
  higiene: 'Higiene',
  toallas: 'Toallas',
  problema_tecnico: 'Problema Técnico',
  otro: 'Otro'
};

export default {
  ROLES,
  PERMISOS_INVITADO,
  PERMISOS_USUARIO,
  PERMISOS_EMPLEADO,
  PERMISOS_ADMIN,
  MAPA_PERMISOS,
  tienePermiso,
  tienePermisos,
  tieneAlgunPermiso,
  obtenerPermisos,
  esEmpleadoOSuperior,
  esAdmin,
  esUsuarioRegistrado,
  obtenerNombreRol,
  obtenerDescripcionRol,
  validarAccesoRuta,
  ACCIONES_EMPLEADO,
  ACCIONES_ADMIN,
  ESTADOS_HABITACION,
  ESTADOS_RESERVA,
  TIPOS_SOLICITUD,
  ETIQUETAS_TIPOS_SOLICITUD
};
