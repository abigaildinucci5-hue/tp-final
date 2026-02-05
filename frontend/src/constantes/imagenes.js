// frontend/src/constantes/imagenes.js

export const IMAGENES_LOCALES = {
  // Logos y branding
  logo: require('../assets/images/logo.png'),
  logoBlanco: require('../assets/images/logo-blanco.png'),
  splash: require('../assets/images/splash.png'),
  icon: require('../assets/images/icon.png'),

  // React logos
  reactLogo: require('../assets/images/react-logo.png'),
  partialReactLogo: require('../assets/images/partial-react-logo.png'),

  // Splash icon
  splashIcon: require('../assets/images/splash-icon.png'),
};

// URLs base para imágenes del servidor
export const BASE_URL_IMAGENES = {
  habitaciones: 'https://api.hotellunserena.com/uploads/habitaciones',
  usuarios: 'https://api.hotellunserena.com/uploads/usuarios',
  general: 'https://api.hotellunserena.com/uploads/general',
};

// Función helper
export const construirUrlImagen = (tipo, filename) => {
  if (!filename) return null;
  const baseUrl = BASE_URL_IMAGENES[tipo] || BASE_URL_IMAGENES.general;
  return `${baseUrl}/${filename}`;
};

// Helpers
export const obtenerImagenHabitacion = (filename) =>
  construirUrlImagen('habitaciones', filename);

export const obtenerImagenUsuario = (filename) =>
  construirUrlImagen('usuarios', filename);

export default IMAGENES_LOCALES;
