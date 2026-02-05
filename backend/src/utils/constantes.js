// src/utils/constantes.js - Constantes de la aplicación

// ====================================
// ROLES DE USUARIO
// ====================================
const ROLES = {
  CLIENTE: 'cliente',
  EMPLEADO: 'empleado',
  ADMIN: 'admin',
};

const PERMISOS_POR_ROL = {
  [ROLES.CLIENTE]: [
    'ver_habitaciones',
    'crear_reserva',
    'ver_mis_reservas',
    'cancelar_mi_reserva',
    'modificar_mi_reserva',
    'crear_comentario',
    'ver_mi_perfil',
    'editar_mi_perfil',
    'agregar_favoritos',
  ],
  [ROLES.EMPLEADO]: [
    'ver_habitaciones',
    'crear_reserva',
    'ver_todas_reservas',
    'confirmar_reserva',
    'ver_comentarios_pendientes',
    'aprobar_comentario',
    'responder_comentario',
    'descuento_empleado',
  ],
  [ROLES.ADMIN]: [
    'gestionar_usuarios',
    'gestionar_habitaciones',
    'gestionar_reservas',
    'gestionar_comentarios',
    'ver_estadisticas',
    'enviar_notificaciones_masivas',
    'acceso_completo',
  ],
};

// ====================================
// ESTADOS
// ====================================
const ESTADOS_RESERVA = {
  PENDIENTE: 'pendiente',
  CONFIRMADA: 'confirmada',
  CANCELADA: 'cancelada',
  COMPLETADA: 'completada',
  NO_SHOW: 'no_show',
};

const ESTADOS_HABITACION = {
  DISPONIBLE: 'disponible',
  OCUPADA: 'ocupada',
  MANTENIMIENTO: 'mantenimiento',
  LIMPIEZA: 'limpieza',
};

const ESTADOS_PAGO = {
  PENDIENTE: 'pendiente',
  PAGADO: 'pagado',
  REEMBOLSADO: 'reembolsado',
  FALLIDO: 'fallido',
};

// ====================================
// TIPOS
// ====================================
const TIPOS_COMENTARIO = {
  HOTEL: 'hotel',
  HABITACION: 'habitacion',
};

const TIPOS_NOTIFICACION = {
  NUEVA_HABITACION: 'nueva_habitacion',
  CONFIRMACION_RESERVA: 'confirmacion_reserva',
  RECORDATORIO: 'recordatorio',
  CANCELACION: 'cancelacion',
  OFERTA: 'oferta',
  SISTEMA: 'sistema',
};

const TIPOS_VISTA = {
  MAR: 'mar',
  CIUDAD: 'ciudad',
  JARDIN: 'jardin',
  MONTANA: 'montaña',
};

// ====================================
// LÍMITES Y VALIDACIONES
// ====================================
const LIMITES = {
  // Reservas
  MAX_DIAS_RESERVA: 30,
  MIN_DIAS_RESERVA: 1,
  MAX_HUESPEDES: 10,
  MIN_HUESPEDES: 1,
  DIAS_CANCELACION_GRATIS: 2, // 48 horas antes
  
  // Comentarios
  MIN_LONGITUD_COMENTARIO: 10,
  MAX_LONGITUD_COMENTARIO: 1000,
  MIN_LONGITUD_TITULO: 5,
  MAX_LONGITUD_TITULO: 200,
  MIN_CALIFICACION: 1,
  MAX_CALIFICACION: 5,
  
  // Usuarios
  MIN_LONGITUD_PASSWORD: 6,
  MAX_LONGITUD_PASSWORD: 50,
  MIN_LONGITUD_NOMBRE: 2,
  MAX_LONGITUD_NOMBRE: 50,
  
  // Archivos
  MAX_TAMANO_IMAGEN: 5 * 1024 * 1024, // 5MB
  MAX_IMAGENES_POR_HABITACION: 10,
  
  // Paginación
  DEFAULT_LIMITE_PAGINA: 20,
  MAX_LIMITE_PAGINA: 100,
  
  // API
  MAX_INTENTOS_LOGIN: 5,
  TIEMPO_BLOQUEO_LOGIN: 15 * 60 * 1000, // 15 minutos
};

// ====================================
// DESCUENTOS
// ====================================
const DESCUENTOS = {
  EMPLEADO: 30, // 30% de descuento
  TEMPORADA_BAJA: 15, // 15% en temporada baja
  ESTADIA_LARGA: 10, // 10% más de 7 noches
  CLIENTE_FRECUENTE: 5, // 5% después de 5 reservas
};

// ====================================
// HORARIOS
// ====================================
const HORARIOS = {
  CHECKIN: '15:00',
  CHECKOUT: '11:00',
  APERTURA_RECEPCION: '00:00', // 24 horas
  CIERRE_RECEPCION: '23:59',
};

// ====================================
// MENSAJES ESTÁNDAR
// ====================================
const MENSAJES = {
  // Éxito
  EXITO_GENERAL: 'Operación realizada exitosamente',
  EXITO_REGISTRO: 'Usuario registrado exitosamente',
  EXITO_LOGIN: 'Inicio de sesión exitoso',
  EXITO_LOGOUT: 'Sesión cerrada exitosamente',
  EXITO_RESERVA_CREADA: 'Reserva creada exitosamente',
  EXITO_RESERVA_CANCELADA: 'Reserva cancelada exitosamente',
  EXITO_COMENTARIO_CREADO: 'Comentario enviado. Será visible una vez aprobado.',
  
  // Error
  ERROR_GENERAL: 'Ha ocurrido un error. Por favor intenta nuevamente.',
  ERROR_AUTENTICACION: 'Credenciales incorrectas',
  ERROR_NO_AUTORIZADO: 'No tienes permisos para realizar esta acción',
  ERROR_NO_ENCONTRADO: 'Recurso no encontrado',
  ERROR_EMAIL_EXISTENTE: 'El email ya está registrado',
  ERROR_HABITACION_NO_DISPONIBLE: 'La habitación no está disponible para las fechas seleccionadas',
  ERROR_RESERVA_NO_MODIFICABLE: 'Esta reserva no puede ser modificada',
  ERROR_TOKEN_INVALIDO: 'Token inválido o expirado',
  ERROR_EMAIL_NO_VERIFICADO: 'Debes verificar tu email antes de continuar',
  
  // Validación
  VALIDACION_CAMPO_REQUERIDO: 'Este campo es requerido',
  VALIDACION_EMAIL_INVALIDO: 'Email inválido',
  VALIDACION_PASSWORD_DEBIL: 'La contraseña debe tener al menos 6 caracteres',
  VALIDACION_FECHA_INVALIDA: 'Fecha inválida',
  VALIDACION_RANGO_FECHA_INVALIDO: 'El rango de fechas es inválido',
};

// ====================================
// CONFIGURACIÓN DE EMAIL
// ====================================
const CONFIG_EMAIL = {
  ASUNTOS: {
    BIENVENIDA: '¡Bienvenido a Hotel Luna Serena!',
    VERIFICACION: 'Verifica tu email - Hotel Luna Serena',
    RECUPERACION: 'Recuperación de contraseña - Hotel Luna Serena',
    CONFIRMACION_RESERVA: 'Confirmación de Reserva',
    CANCELACION_RESERVA: 'Cancelación de Reserva',
    RECORDATORIO_CHECKIN: 'Recordatorio: Tu estadía comienza pronto',
    NUEVA_HABITACION: '¡Nueva habitación disponible!',
  },
  REMITENTE: '"Hotel Luna Serena" <no-reply@hotellunaserena.com>',
};

// ====================================
// URLS Y RUTAS
// ====================================
const RUTAS_API = {
  AUTH: '/api/auth',
  USUARIOS: '/api/usuarios',
  HABITACIONES: '/api/habitaciones',
  RESERVAS: '/api/reservas',
  COMENTARIOS: '/api/comentarios',
  NOTIFICACIONES: '/api/notificaciones',
};

const RUTAS_FRONTEND = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRO: '/registro',
  PERFIL: '/perfil',
  HABITACIONES: '/habitaciones',
  DETALLE_HABITACION: '/habitaciones/:id',
  RESERVAS: '/reservas',
  DETALLE_RESERVA: '/reservas/:id',
  FAVORITOS: '/favoritos',
  NOTIFICACIONES: '/notificaciones',
  ADMIN: '/admin',
};

// ====================================
// CONFIGURACIÓN DE REDIS (OPCIONAL)
// ====================================
const CACHE_TTL = {
  HABITACIONES: 5 * 60, // 5 minutos
  TIPOS_HABITACION: 60 * 60, // 1 hora
  USUARIO: 30 * 60, // 30 minutos
  COMENTARIOS: 10 * 60, // 10 minutos
};

// ====================================
// CONFIGURACIÓN DE RATE LIMITING
// ====================================
const RATE_LIMITS = {
  GENERAL: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // 100 peticiones por ventana
  },
  AUTH: {
    windowMs: 15 * 60 * 1000,
    max: 5, // 5 intentos de login
  },
  API: {
    windowMs: 60 * 1000, // 1 minuto
    max: 60, // 60 peticiones por minuto
  },
};

// ====================================
// CÓDIGOS DE ERROR PERSONALIZADOS
// ====================================
const CODIGOS_ERROR = {
  // Autenticación (1000-1999)
  TOKEN_INVALIDO: 1001,
  TOKEN_EXPIRADO: 1002,
  CREDENCIALES_INCORRECTAS: 1003,
  EMAIL_NO_VERIFICADO: 1004,
  USUARIO_BLOQUEADO: 1005,
  
  // Validación (2000-2999)
  DATOS_INVALIDOS: 2001,
  CAMPO_REQUERIDO: 2002,
  FORMATO_INVALIDO: 2003,
  
  // Recursos (3000-3999)
  RECURSO_NO_ENCONTRADO: 3001,
  RECURSO_YA_EXISTE: 3002,
  RECURSO_NO_DISPONIBLE: 3003,
  
  // Permisos (4000-4999)
  PERMISO_DENEGADO: 4001,
  ROL_INSUFICIENTE: 4002,
  
  // Negocio (5000-5999)
  RESERVA_NO_DISPONIBLE: 5001,
  CAPACIDAD_EXCEDIDA: 5002,
  FECHA_INVALIDA: 5003,
  CANCELACION_NO_PERMITIDA: 5004,
  
  // Sistema (9000-9999)
  ERROR_SERVIDOR: 9001,
  ERROR_BASE_DATOS: 9002,
  ERROR_EXTERNO: 9003,
};

// ====================================
// CONFIGURACIÓN DEL HOTEL
// ====================================
const INFO_HOTEL = {
  NOMBRE: 'Hotel Luna Serena',
  DIRECCION: 'Av. Costanera 1234, Mar del Plata, Buenos Aires',
  TELEFONO: '+54 223 123-4567',
  EMAIL: 'info@hotellunaserena.com',
  WEBSITE: 'https://hotellunaserena.com',
  UBICACION: {
    latitud: -38.0054771,
    longitud: -57.5426106,
  },
  REDES_SOCIALES: {
    FACEBOOK: 'https://facebook.com/hotellunaserena',
    INSTAGRAM: 'https://instagram.com/hotellunaserena',
    TWITTER: 'https://twitter.com/hotellunaserena',
  },
};

// ====================================
// AMENIDADES Y SERVICIOS
// ====================================
const AMENIDADES = {
  BASICAS: [
    'WiFi gratuito',
    'Aire acondicionado',
    'Calefacción',
    'TV por cable',
    'Caja fuerte',
  ],
  BANO: [
    'Secador de pelo',
    'Amenities premium',
    'Toallas',
    'Ducha',
    'Bañera',
  ],
  SERVICIOS: [
    'Room service 24hs',
    'Servicio de limpieza',
    'Desayuno incluido',
    'Estacionamiento gratuito',
    'Gimnasio',
    'Piscina',
    'Spa',
    'Restaurante',
    'Bar',
  ],
};

// ====================================
// FORMATOS DE FECHA
// ====================================
const FORMATOS_FECHA = {
  COMPLETO: 'DD/MM/YYYY HH:mm:ss',
  CORTO: 'DD/MM/YYYY',
  HORA: 'HH:mm',
  ISO: 'YYYY-MM-DD',
  LARGO: 'dddd, D [de] MMMM [de] YYYY',
};

// ====================================
// REGEX ÚTILES
// ====================================
const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  TELEFONO_ARG: /^(\+54|54)?[\s\-]?(\(?\d{2,4}\)?)[\s\-]?\d{3,4}[\s\-]?\d{4}$/,
  PASSWORD_SEGURA: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/,
  SOLO_NUMEROS: /^\d+$/,
  SOLO_LETRAS: /^[a-záéíóúñA-ZÁÉÍÓÚÑ\s]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// ====================================
// EXPORTAR TODO
// ====================================
module.exports = {
  ROLES,
  PERMISOS_POR_ROL,
  ESTADOS_RESERVA,
  ESTADOS_HABITACION,
  ESTADOS_PAGO,
  TIPOS_COMENTARIO,
  TIPOS_NOTIFICACION,
  TIPOS_VISTA,
  LIMITES,
  DESCUENTOS,
  HORARIOS,
  MENSAJES,
  CONFIG_EMAIL,
  RUTAS_API,
  RUTAS_FRONTEND,
  CACHE_TTL,
  RATE_LIMITS,
  CODIGOS_ERROR,
  INFO_HOTEL,
  AMENIDADES,
  FORMATOS_FECHA,
  REGEX,
};