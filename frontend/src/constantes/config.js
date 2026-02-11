/**
 * Constantes de configuración de la aplicación
 */

// Configuración de la API
export const API_CONFIG = {
  // Para development en web: usar localhost
  // Para production: usar la URL de railway
  BASE_URL: 'https://tp-final-production-a1f6.up.railway.app/api',
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000 // 1 segundo
};

// Endpoints de la API
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    VERIFY: '/auth/verify'
  },
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
    DELETE: '/users/delete'
  },
  // Agrega más endpoints según tu aplicación
};

// Claves de almacenamiento local
export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user_data',
  PREFERENCES: 'user_preferences',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
  SESSION: 'session_data'
};

// Configuración de sesión
export const SESSION_CONFIG = {
  TIMEOUT: 30 * 60 * 1000, // 30 minutos
  WARNING_TIME: 5 * 60 * 1000, // 5 minutos antes de expirar
  CHECK_INTERVAL: 60 * 1000 // Verificar cada minuto
};

// Configuración de paginación
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100
};

// Estados de carga
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
};

// Tipos de notificación
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Duración de notificaciones (en ms)
export const NOTIFICATION_DURATION = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 10000
};

// Roles de usuario
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest',
  MODERATOR: 'moderator'
};

// Permisos
export const PERMISSIONS = {
  READ: 'read',
  WRITE: 'write',
  DELETE: 'delete',
  UPDATE: 'update',
  ADMIN: 'admin'
};

// Formatos de fecha
export const DATE_FORMATS = {
  SHORT: 'DD/MM/YYYY',
  LONG: 'DD de MMMM de YYYY',
  WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  TIME_ONLY: 'HH:mm:ss'
};

// Idiomas disponibles
export const LANGUAGES = {
  ES: 'es',
  EN: 'en',
  PT: 'pt'
};

// Temas
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto'
};

// Expresiones regulares comunes
export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^\d+$/,
  ALPHA: /^[a-zA-Z]+$/
};

// Mensajes de error comunes
export const ERROR_MESSAGES = {
  NETWORK: 'Error de conexión. Por favor, verifica tu conexión a internet.',
  SERVER: 'Error del servidor. Por favor, intenta más tarde.',
  UNAUTHORIZED: 'No autorizado. Por favor, inicia sesión nuevamente.',
  FORBIDDEN: 'No tienes permisos para realizar esta acción.',
  NOT_FOUND: 'Recurso no encontrado.',
  VALIDATION: 'Error de validación. Por favor, verifica los datos ingresados.',
  TIMEOUT: 'La solicitud ha tardado demasiado. Por favor, intenta nuevamente.',
  GENERIC: 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.'
};

// Mensajes de éxito comunes
export const SUCCESS_MESSAGES = {
  SAVE: 'Guardado exitosamente',
  UPDATE: 'Actualizado exitosamente',
  DELETE: 'Eliminado exitosamente',
  CREATE: 'Creado exitosamente',
  SEND: 'Enviado exitosamente',
  LOGIN: 'Sesión iniciada correctamente',
  LOGOUT: 'Sesión cerrada correctamente',
  REGISTER: 'Registro exitoso'
};

// Límites de validación
export const VALIDATION_LIMITS = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
  MIN_USERNAME_LENGTH: 3,
  MAX_USERNAME_LENGTH: 30,
  MAX_EMAIL_LENGTH: 255,
  MAX_TEXT_LENGTH: 500,
  MAX_DESCRIPTION_LENGTH: 2000,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_IMAGE_SIZE: 2 * 1024 * 1024 // 2MB
};

export const VALIDACIONES = {
  EMAIL_REGEX: REGEX.EMAIL,
  TELEFONO_REGEX: REGEX.PHONE,
  DNI_REGEX: REGEX.NUMERIC,

  PASSWORD_MIN_LENGTH: VALIDATION_LIMITS.MIN_PASSWORD_LENGTH,
  PASSWORD_MAX_LENGTH: VALIDATION_LIMITS.MAX_PASSWORD_LENGTH,

  NOMBRE_MIN_LENGTH: 2,
  NOMBRE_MAX_LENGTH: 50,
};

// Tipos de archivo permitidos
export const ALLOWED_FILE_TYPES = {
  IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  SPREADSHEETS: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  ALL: ['*/*']
};

// Configuración de desarrollo
// Configuración de OAuth
export const OAUTH_CONFIG = {
  GOOGLE_CLIENT_ID: process.env.NODE_ENV === 'production'
    ? 'TU_GOOGLE_CLIENT_ID_PROD'
    : 'TU_GOOGLE_CLIENT_ID_LOCAL',
  GOOGLE_REDIRECT_URI: process.env.NODE_ENV === 'production'
    ? 'https://tp-final-production-a1f6.up.railway.app/auth/google/callback'
    : 'http://localhost:3000/auth/google/callback',
  GITHUB_CLIENT_ID: process.env.NODE_ENV === 'production'
    ? 'TU_GITHUB_CLIENT_ID_PROD'
    : 'TU_GITHUB_CLIENT_ID_LOCAL',
  GITHUB_REDIRECT_URI: process.env.NODE_ENV === 'production'
    ? 'https://tp-final-production-a1f6.up.railway.app/auth/github/callback'
    : 'http://localhost:3000/auth/github/callback',
};
export const DEV_CONFIG = {
  DEBUG: process.env.NODE_ENV === 'development',
  LOG_LEVEL: process.env.REACT_APP_LOG_LEVEL || 'info',
  MOCK_API: process.env.REACT_APP_MOCK_API === 'true'
};

// Rutas de navegación
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  NOT_FOUND: '/404'
};

// Códigos de estado HTTP
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503
};

// Configuración por defecto
export const DEFAULT_CONFIG = {
  language: LANGUAGES.ES,
  theme: THEMES.LIGHT,
  notifications: true,
  pageSize: PAGINATION.DEFAULT_PAGE_SIZE
};

// Información del hotel usada en pantallas
export const HOTEL_INFO = {
  nombre: 'Hotel Luna Serena',
  direccion: 'Calle Principal 123, Ciudad',
  telefono: '+1234567890',
  email: 'info@hotellunaserena.com',
  sitioWeb: 'www.hotellunaserena.com',
  coordenadas: {
    latitud: -34.6037, // Buenos Aires como ejemplo
    longitud: -58.3816
  }
};

export default {
  API_CONFIG,
  API_ENDPOINTS,
  STORAGE_KEYS,
  SESSION_CONFIG,
  PAGINATION,
  LOADING_STATES,
  NOTIFICATION_TYPES,
  NOTIFICATION_DURATION,
  USER_ROLES,
  PERMISSIONS,
  DATE_FORMATS,
  LANGUAGES,
  THEMES,
  REGEX,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_LIMITS,
  ALLOWED_FILE_TYPES,
  DEV_CONFIG,
  ROUTES,
  HTTP_STATUS,
  DEFAULT_CONFIG,
  HOTEL_INFO
};