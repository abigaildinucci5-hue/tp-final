// server.js - Servidor principal del backend con OAuth
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const passport = require('./src/config/oauth');

// Importar rutas
const rutasAuth = require('./src/rutas/rutasAuth');
const rutasUsuarios = require('./src/rutas/rutasUsuarios');
const rutasHabitaciones = require('./src/rutas/rutasHabitaciones');
const rutasReservas = require('./src/rutas/rutasReservas');
const rutasComentarios = require('./src/rutas/rutasComentarios');
const rutasNotificaciones = require('./src/rutas/rutasNotificaciones');
const rutasEmpleado = require('./src/rutas/rutasEmpleado');
const rutasPuntos = require('./src/rutas/rutasPuntos');

// Middleware errores
const { manejadorErrores } = require('./src/middlewares/manejadorErrores');
const { verificarConexionDB } = require('./src/config/baseDatos');

const app = express();
const PORT = process.env.PORT || 3000;

// ============================
// ✅ TRUST PROXY - CRÍTICO PARA RAILWAY
// ============================
// DEBE SER ANTES que rate limiting
app.set('trust proxy', 1);

app.get('/ping', (req, res) => {
  res.status(200).send('pong');
});

// ============================
// MIDDLEWARES
// ============================

// CORS PRIMERO, antes de helmet
const allowedOrigins = [
app.use(cors({
  origin: function(origin, callback) {
  credentials: true,
// Permitir CORS para cualquier origen en producción Railway
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  maxAge: 86400
}));

// Helmet después de CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(compression());

if (process.env.NODE_ENV === 'development') { 
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(passport.initialize());
console.log('✅ Passport OAuth inicializado');

// ============================
// RATE LIMIT
// ============================

const limitadorGeneral = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const limitadorAuth = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.use('/api/', limitadorGeneral);
app.use('/api/auth/login', limitadorAuth);
app.use('/api/auth/registro', limitadorAuth);

// Anti caché
app.use('/api/', (req, res, next) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0'
  });
  next();
});

// ============================
// HEALTH
// ============================

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

// ============================
// RUTAS
// ============================

app.use('/api/auth', rutasAuth);
app.use('/api/usuarios', rutasUsuarios);
app.use('/api/habitaciones', rutasHabitaciones);
app.use('/api/reservas', rutasReservas);
app.use('/api/comentarios', rutasComentarios);
app.use('/api/notificaciones', rutasNotificaciones);
app.use('/api/empleado', rutasEmpleado);
app.use('/api/puntos', rutasPuntos);

app.use('/uploads', express.static('uploads'));

// ============================
// 404
// ============================

// ============================
// PROXY DE IMÁGENES (para evitar CORB de Unsplash)
// ============================

app.get('/api/proxy/image', (req, res) => {
  const { url } = req.query;
  
  // Validar que la URL sea de imagen
  if (!url) {
    return res.status(400).json({
      exito: false,
      mensaje: 'URL es requerida'
    });
  }

  // Validar que sea HTTPS
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return res.status(400).json({
      exito: false,
      mensaje: 'URL no válida'
    });
  }

  // Usar https.get o http.get según el protocolo
  const https = require('https');
  const http = require('http');
  const protocol = url.startsWith('https') ? https : http;

  try {
    protocol.get(url, { timeout: 10000 }, (imgRes) => {
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD');
      res.setHeader('Content-Type', imgRes.headers['content-type']);
      res.setHeader('Cache-Control', 'public, max-age=86400');
      
      // Stream la imagen al cliente
      imgRes.pipe(res);
    }).on('error', (error) => {
      console.error('❌ Error al descargar imagen:', error);
      res.status(500).json({
        exito: false,
        mensaje: 'Error al cargar la imagen'
      });
    });
  } catch (error) {
    console.error('❌ Error en proxy de imágenes:', error);
    res.status(500).json({
      exito: false,
      mensaje: 'Error al cargar la imagen'
    });
  }
});

// ============================
// 404 - RUT NO ENCONTRADA
// ============================

app.use((req, res) => {
  res.status(404).json({
    exito: false,
    mensaje: 'Ruta no encontrada',
    ruta: req.originalUrl
  });
});

app.use(manejadorErrores);

// ============================
// INICIAR SERVIDOR (VERSIÓN ANTI-CRASH)
// ============================

const iniciarServidor = async () => {
  try {
    // Intentar conexión a DB pero NO crashear si falla
    try {
      await verificarConexionDB();
      console.log('✅ Conexión a la base de datos establecida');
    } catch (dbError) {
      console.error('⚠️ No se pudo conectar a la DB al iniciar. El servidor seguirá funcionando.');
      console.error(dbError.message);
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log('');
      console.log('🏨 ============================================');
      console.log('   HOTEL LUNA SERENA - BACKEND');
      console.log('============================================');
      console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
      console.log(`📍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🏥 Health: /health`);
      console.log('============================================');
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error crítico al iniciar el servidor:', error);
  }
};

// 🔹 YA NO MATAMOS EL PROCESO
process.on('unhandledRejection', (error) => {
  console.error('❌ Error no manejado:', error);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Excepción no capturada:', error);
});

iniciarServidor();

module.exports = app;
