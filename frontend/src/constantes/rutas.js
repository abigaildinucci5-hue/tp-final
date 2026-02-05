// frontend/src/constantes/rutas.js

// Rutas de autenticación
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  REFRESH_TOKEN: '/auth/refresh-token',
  VERIFY_TOKEN: '/auth/verify-token'
};

// Rutas de usuarios
export const USER_ROUTES = {
  PROFILE: '/usuarios/perfil',
  UPDATE_PROFILE: '/usuarios/perfil',
  CHANGE_PASSWORD: '/usuarios/cambiar-password',
  UPLOAD_PHOTO: '/usuarios/foto',
  GET_BY_ID: (id) => `/usuarios/${id}`,
  LIST: '/usuarios',
  DELETE: (id) => `/usuarios/${id}`
};

// Rutas de habitaciones
export const HABITACION_ROUTES = {
  LIST: '/habitaciones',
  GET_BY_ID: (id) => `/habitaciones/${id}`,
  CREATE: '/habitaciones',
  UPDATE: (id) => `/habitaciones/${id}`,
  DELETE: (id) => `/habitaciones/${id}`,
  DISPONIBLES: '/habitaciones/disponibles',
  BUSCAR: '/habitaciones/buscar',
  CATEGORIAS: '/habitaciones/categorias',
  IMAGENES: (id) => `/habitaciones/${id}/imagenes`,
  UPLOAD_IMAGE: (id) => `/habitaciones/${id}/imagenes`,
  DELETE_IMAGE: (habitacionId, imagenId) => `/habitaciones/${habitacionId}/imagenes/${imagenId}`
};

// Rutas de reservas
export const RESERVA_ROUTES = {
  LIST: '/reservas',
  GET_BY_ID: (id) => `/reservas/${id}`,
  CREATE: '/reservas',
  UPDATE: (id) => `/reservas/${id}`,
  CANCEL: (id) => `/reservas/${id}/cancelar`,
  CONFIRMAR: (id) => `/reservas/${id}/confirmar`,
  CHECK_IN: (id) => `/reservas/${id}/check-in`,
  CHECK_OUT: (id) => `/reservas/${id}/check-out`,
  MIS_RESERVAS: '/reservas/mis-reservas',
  HISTORIAL: '/reservas/historial',
  VERIFICAR_DISPONIBILIDAD: '/reservas/verificar-disponibilidad',
  CALCULAR_PRECIO: '/reservas/calcular-precio'
};

// Rutas de comentarios
export const COMENTARIO_ROUTES = {
  LIST: '/comentarios',
  GET_BY_HABITACION: (habitacionId) => `/comentarios/habitacion/${habitacionId}`,
  CREATE: '/comentarios',
  UPDATE: (id) => `/comentarios/${id}`,
  DELETE: (id) => `/comentarios/${id}`,
  MIS_COMENTARIOS: '/comentarios/mis-comentarios'
};

// Rutas de notificaciones
export const NOTIFICACION_ROUTES = {
  LIST: '/notificaciones',
  GET_BY_ID: (id) => `/notificaciones/${id}`,
  MARCAR_LEIDA: (id) => `/notificaciones/${id}/leer`,
  MARCAR_TODAS_LEIDAS: '/notificaciones/leer-todas',
  DELETE: (id) => `/notificaciones/${id}`,
  COUNT_NO_LEIDAS: '/notificaciones/no-leidas/count'
};

// Rutas de favoritos
export const FAVORITO_ROUTES = {
  LIST: '/favoritos',
  ADD: '/favoritos',
  REMOVE: (habitacionId) => `/favoritos/${habitacionId}`,
  CHECK: (habitacionId) => `/favoritos/check/${habitacionId}`
};

// Rutas de estadísticas (Admin)
export const ESTADISTICA_ROUTES = {
  DASHBOARD: '/estadisticas/dashboard',
  RESERVAS_POR_MES: '/estadisticas/reservas-mes',
  HABITACIONES_POPULARES: '/estadisticas/habitaciones-populares',
  INGRESOS: '/estadisticas/ingresos',
  OCUPACION: '/estadisticas/ocupacion',
  CLIENTES_FRECUENTES: '/estadisticas/clientes-frecuentes'
};

// Rutas de pagos
export const PAGO_ROUTES = {
  CREATE: '/pagos',
  VERIFY: (id) => `/pagos/${id}/verificar`,
  LIST: '/pagos',
  GET_BY_RESERVA: (reservaId) => `/pagos/reserva/${reservaId}`,
  PROCESAR_MERCADOPAGO: '/pagos/mercadopago/procesar',
  WEBHOOK_MERCADOPAGO: '/pagos/mercadopago/webhook'
};

// Rutas de contacto
export const CONTACTO_ROUTES = {
  ENVIAR_MENSAJE: '/contacto/mensaje',
  SUSCRIBIR_NEWSLETTER: '/contacto/newsletter'
};

// Exportar todas las rutas
export const API_ROUTES = {
  AUTH: AUTH_ROUTES,
  USER: USER_ROUTES,
  HABITACION: HABITACION_ROUTES,
  RESERVA: RESERVA_ROUTES,
  COMENTARIO: COMENTARIO_ROUTES,
  NOTIFICACION: NOTIFICACION_ROUTES,
  FAVORITO: FAVORITO_ROUTES,
  ESTADISTICA: ESTADISTICA_ROUTES,
  PAGO: PAGO_ROUTES,
  CONTACTO: CONTACTO_ROUTES
};

export default API_ROUTES;