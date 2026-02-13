// src/servicios/servicioUpload.js - Servicio de upload de imágenes
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const crypto = require('crypto');

// Directorio base de uploads
const DIRECTORIO_BASE = path.join(__dirname, '../../uploads');

// Crear directorios si no existen
const crearDirectorios = async () => {
  const directorios = [
    DIRECTORIO_BASE,
    path.join(DIRECTORIO_BASE, 'habitaciones'),
    path.join(DIRECTORIO_BASE, 'usuarios'),
    path.join(DIRECTORIO_BASE, 'temporal'),
  ];

  for (const dir of directorios) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
};

// Inicializar directorios
crearDirectorios();

// Tipos de archivo permitidos
const TIPOS_PERMITIDOS = {
  imagen: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  documento: ['application/pdf'],
};

// Tamaños máximos (en bytes)
const TAMANOS_MAXIMOS = {
  imagen: 5 * 1024 * 1024, // 5MB
  documento: 10 * 1024 * 1024, // 10MB
};

/**
 * Generar nombre único para archivo
 */
const generarNombreUnico = (nombreOriginal) => {
  const extension = path.extname(nombreOriginal);
  const hash = crypto.randomBytes(16).toString('hex');
  const timestamp = Date.now();
  return `${timestamp}-${hash}${extension}`;
};

/**
 * Configuración de almacenamiento para habitaciones
 */
const storageHabitaciones = multer.diskStorage({
  destination: async (req, file, cb) => {
    const directorio = path.join(DIRECTORIO_BASE, 'habitaciones');
    cb(null, directorio);
  },
  filename: (req, file, cb) => {
    const nombreUnico = generarNombreUnico(file.originalname);
    cb(null, nombreUnico);
  },
});

/**
 * Configuración de almacenamiento para usuarios
 */
const storageUsuarios = multer.diskStorage({
  destination: async (req, file, cb) => {
    const directorio = path.join(DIRECTORIO_BASE, 'usuarios');
    cb(null, directorio);
  },
  filename: (req, file, cb) => {
    const nombreUnico = generarNombreUnico(file.originalname);
    cb(null, nombreUnico);
  },
});

/**
 * Filtro de archivos - Solo imágenes
 */
const filtroImagenes = (req, file, cb) => {
  if (TIPOS_PERMITIDOS.imagen.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo se permiten imágenes JPEG, PNG y WEBP.'), false);
  }
};

/**
 * Middleware de upload para habitaciones
 */
const uploadHabitacion = multer({
  storage: storageHabitaciones,
  fileFilter: filtroImagenes,
  limits: {
    fileSize: TAMANOS_MAXIMOS.imagen,
    files: 10, // Máximo 10 archivos por vez
  },
});

/**
 * Middleware de upload para foto de perfil
 */
const uploadPerfil = multer({
  storage: storageUsuarios,
  fileFilter: filtroImagenes,
  limits: {
    fileSize: TAMANOS_MAXIMOS.imagen,
    files: 1, // Solo 1 archivo
  },
});

/**
 * Obtener URL pública de un archivo
 */
const obtenerUrlPublica = (nombreArchivo, carpeta) => {
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'https://tp-final-production-9e41.up.railway.app/api/auth/github/callback';
  return `${baseUrl}/uploads/${carpeta}/${nombreArchivo}`;
};

/**
 * Eliminar archivo del sistema
 */
const eliminarArchivo = async (rutaArchivo) => {
  try {
    await fs.unlink(rutaArchivo);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
    return false;
  }
};

/**
 * Eliminar archivo por URL
 */
const eliminarArchivoPorUrl = async (url) => {
  try {
    // Extraer ruta del archivo de la URL
    const urlObj = new URL(url);
    const rutaRelativa = urlObj.pathname.replace('/uploads/', '');
    const rutaCompleta = path.join(DIRECTORIO_BASE, rutaRelativa);
    
    await eliminarArchivo(rutaCompleta);
    return true;
  } catch (error) {
    console.error('Error al eliminar archivo por URL:', error);
    return false;
  }
};

/**
 * Obtener información de un archivo
 */
const obtenerInfoArchivo = async (rutaArchivo) => {
  try {
    const stats = await fs.stat(rutaArchivo);
    return {
      tamano: stats.size,
      fechaCreacion: stats.birthtime,
      fechaModificacion: stats.mtime,
    };
  } catch (error) {
    console.error('Error al obtener info del archivo:', error);
    return null;
  }
};

/**
 * Limpiar archivos temporales antiguos (más de 24 horas)
 */
const limpiarTemporales = async () => {
  try {
    const directorioTemporal = path.join(DIRECTORIO_BASE, 'temporal');
    const archivos = await fs.readdir(directorioTemporal);
    
    const ahora = Date.now();
    const unDiaEnMs = 24 * 60 * 60 * 1000;
    
    for (const archivo of archivos) {
      const rutaArchivo = path.join(directorioTemporal, archivo);
      const stats = await fs.stat(rutaArchivo);
      
      if (ahora - stats.mtimeMs > unDiaEnMs) {
        await eliminarArchivo(rutaArchivo);
        console.log(`🗑️ Archivo temporal eliminado: ${archivo}`);
      }
    }
  } catch (error) {
    console.error('Error al limpiar temporales:', error);
  }
};

/**
 * Validar imagen (dimensiones, formato, etc.)
 */
const validarImagen = async (rutaArchivo) => {
  try {
    // Aquí podrías usar sharp o jimp para validar dimensiones
    // Por ahora solo validamos que exista
    await fs.access(rutaArchivo);
    return { valido: true };
  } catch (error) {
    return { valido: false, error: error.message };
  }
};

/**
 * Redimensionar imagen (requiere sharp)
 * npm install sharp
 */
const redimensionarImagen = async (rutaEntrada, rutaSalida, ancho, alto) => {
  try {
    // Descomentar si instalas sharp
    // const sharp = require('sharp');
    // await sharp(rutaEntrada)
    //   .resize(ancho, alto, { fit: 'cover' })
    //   .toFile(rutaSalida);
    
    console.log('Redimensionamiento deshabilitado. Instala sharp para habilitar.');
    return true;
  } catch (error) {
    console.error('Error al redimensionar:', error);
    return false;
  }
};

/**
 * Procesar múltiples archivos subidos
 */
const procesarArchivosSubidos = (archivos, carpeta) => {
  return archivos.map(archivo => ({
    nombreOriginal: archivo.originalname,
    nombreGuardado: archivo.filename,
    mimetype: archivo.mimetype,
    tamano: archivo.size,
    url: obtenerUrlPublica(archivo.filename, carpeta),
    ruta: archivo.path,
  }));
};

/**
 * Middleware para manejar errores de multer
 */
const manejarErrorUpload = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        exito: false,
        mensaje: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
        codigo: 'FILE_TOO_LARGE',
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        exito: false,
        mensaje: 'Demasiados archivos. Máximo: 10 archivos',
        codigo: 'TOO_MANY_FILES',
      });
    }
    return res.status(400).json({
      exito: false,
      mensaje: `Error en upload: ${error.message}`,
      codigo: 'UPLOAD_ERROR',
    });
  }
  
  if (error) {
    return res.status(400).json({
      exito: false,
      mensaje: error.message,
      codigo: 'UPLOAD_ERROR',
    });
  }
  
  next();
};

// Limpiar archivos temporales cada hora
setInterval(() => {
  limpiarTemporales().catch(error => {
    console.error('Error en limpieza automática:', error);
  });
}, 60 * 60 * 1000);

module.exports = {
  uploadHabitacion,
  uploadPerfil,
  obtenerUrlPublica,
  eliminarArchivo,
  eliminarArchivoPorUrl,
  obtenerInfoArchivo,
  limpiarTemporales,
  validarImagen,
  redimensionarImagen,
  procesarArchivosSubidos,
  manejarErrorUpload,
  DIRECTORIO_BASE,
};