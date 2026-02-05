// server.js - Servidor principal del backend con OAuth
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('./src/config/oauth'); // 🆕 IMPORTANTE: Importar configuración OAuth

// Importar rutas
const rutasAuth = require('./src/rutas/rutasAuth');
const rutasUsuarios = require('./src/rutas/rutasUsuarios');
const rutasHabitaciones = require('./src/rutas/rutasHabitaciones');
const rutasReservas = require('./src/rutas/rutasReservas');
const rutasComentarios = require('./src/rutas/rutasComentarios');
const rutasNotificaciones = require('./src/rutas/rutasNotificaciones');
const rutasEmpleado = require('./src/rutas/rutasEmpleado');

// Importar middleware de errores
const { manejadorErrores } = require('./src/middlewares/manejadorErrores');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// MIDDLEWARES GLOBALES
// ============================

// Seguridad con Helmet
app.use(helmet());

// CORS - Permitir peticiones desde el frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Compresión de respuestas
app.use(compression());

// Logging de peticiones en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Parser de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 🆕 INICIALIZAR PASSPORT (OAuth)
app.use(passport.initialize());
console.log('✅ Passport OAuth inicializado');

// Rate limiting - Protección contra ataques de fuerza bruta
const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite de 100 peticiones por ventana
  message: 'Demasiadas peticiones desde esta IP, por favor intenta de nuevo más tarde.',
  standardHeaders: true,
  legacyHeaders: false,
});

const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Límite de 5 intentos de login por ventana
  message: 'Demasiados intentos de inicio de sesión, por favor intenta de nuevo más tarde.',
  skipSuccessfulRequests: true
});

// Aplicar rate limiting
app.use('/api/', limitadorGeneral);
app.use('/api/auth/login', limitadorAuth);
app.use('/api/auth/registro', limitadorAuth);

// 🆕 MIDDLEWARE ANTI-CACHÉ - Desabilitar caché HTTP para todos los endpoints /api
app.use('/api/', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// ============================
// RUTAS DE LA API
// ============================

// Ruta de health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    mensaje: 'Servidor funcionando correctamente',
    oauth_enabled: {
      google: !!process.env.GOOGLE_CLIENT_ID,
      github: !!process.env.GITHUB_CLIENT_ID
    },
    timestamp: new Date().toISOString()
  });
});

// Rutas principales
app.use('/api/auth', rutasAuth);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/habitaciones', rutasHabitaciones);
app.use('/api/reservas', rutasReservas);
app.use('/api/comentarios', rutasComentarios);
app.use('/api/notificaciones', rutasNotificaciones);
app.use('/api/empleado', rutasEmpleado);

// Ruta para servir imágenes estáticas
app.use('/uploads', express.static('uploads'));

// ============================
// MANEJO DE ERRORES
// ============================

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

// Middleware de manejo de errores global
app.use(manejadorErrores);

// ============================
// INICIAR SERVIDOR
// ============================

// Verificar conexión a la base de datos antes de iniciar
const { verificarConexionDB } = require('./src/config/baseDatos');

const iniciarServidor = async () => {
  try {
    // Verificar conexión a la base de datos
    await verificarConexionDB();
    console.log('✅ Conexión a la base de datos establecida');

    // Verificar configuración de OAuth
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      console.log('✅ Google OAuth configurado');
    } else {
      console.log('⚠️  Google OAuth NO configurado (revisa .env)');
    }

    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      console.log('✅ GitHub OAuth configurado');
    } else {
      console.log('⚠️  GitHub OAuth NO configurado (revisa .env)');
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('🏨 ============================================');
      console.log('   HOTEL LUNA SERENA - BACKEND');
      console.log('   ============================================');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`🏥 Health: http://localhost:${PORT}/health`);
      console.log(`🔐 Auth Test: http://localhost:${PORT}/api/auth/test`);
      console.log('============================================');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de errores no capturados
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
  process.exit(1);
});

// Iniciar el servidor
iniciarServidor();

module.exports = app;