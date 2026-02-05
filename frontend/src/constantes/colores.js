/**
 * PALETA DE COLORES - HOTEL LUNA SERENA v2.0
 * Sistema centralizado mejorado con nomenclatura clara
 */

export const COLORES = {
  // ==========================================
  // COLORES PRINCIPALES - Identidad Visual
  // ==========================================
  PRIMARIO: '#2C2C2C',           // Navbar, headers oscuros (nuevo)
  SECUNDARIO: '#C9A961',         // Dorado principal (acentos, botones)
  ACENTO: '#F8F8F8',             // Fondos claros, textos alternos (nuevo)
  COMPLEMENTARIO: '#6B6B6B',     // Textos secundarios, bordes (nuevo)
  
  // Dorados (compatibilidad)
  dorado: '#C9A961',
  doradoClaro: '#E5D5A8',
  doradoOscuro: '#B8954D',
  doradoMuyClaro: '#F5EFE0',
  
  // ==========================================
  // COLORES NEUTROS - Elegancia
  // ==========================================
  NEGRO: '#1A1A1A',
  BLANCO: '#FFFFFF',
  blanco: '#FFFFFF',
  negroElegante: '#1A1A1A',
  grisOscuro: '#2C3E50',
  grisTexto: '#6C757D',
  grisClaro: '#F8F9FA',
  GRIS_CLARO: '#F5F5F5',
  GRIS_MEDIO: '#999999',
  GRIS_OSCURO: '#4A4A4A',
  grisBorde: '#E5E7EB',
  
  // ==========================================
  // COLORES DE FONDO
  // ==========================================
  fondo: '#FAFAFA',
  fondoTarjeta: '#FFFFFF',
  fondoInput: '#F8F9FA',
  fondoClaro: '#F5EFE0',
  
  // ==========================================
  // COLORES DE ESTADO
  // ==========================================
  EXITO: '#10B981',
  exito: '#10B981',
  exitoClaro: '#34D399',
  exitoOscuro: '#059669',
  
  ERROR: '#EF4444',
  error: '#EF4444',
  errorClaro: '#F87171',
  errorOscuro: '#DC2626',
  
  ADVERTENCIA: '#F59E0B',
  advertencia: '#F59E0B',
  advertenciaClaro: '#FBBF24',
  advertenciaOscuro: '#D97706',
  
  INFO: '#3B82F6',
  info: '#3B82F6',
  infoClaro: '#60A5FA',
  infoOscuro: '#2563EB',
  
  // Adicionales
  ORO: '#FFD700',
  DISABLED: '#CCCCCC',
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(255, 255, 255, 0.1)',
  
  // ==========================================
  // COLORES DE TEXTO
  // ==========================================
  textoOscuro: '#1A1A1A',      // Texto principal oscuro
  textoMedio: '#6C757D',       // Texto secundario
  textoClaro: '#9CA3AF',       // Texto terciario
  textoBlanco: '#FFFFFF',      // Texto sobre fondos oscuros
  textoPrincipal: '#2C3E50',   // Texto principal
  textoSecundario: '#6C757D',  // Texto secundario
  textoGris: '#9CA3AF',        // Texto gris claro
  textoGrisClaro: '#D1D5DB',   // Texto gris muy claro
  
  // ==========================================
  // COLORES ESPECÍFICOS DEL HOTEL
  // ==========================================
  primario: '#C9A961',         // = dorado (para compatibilidad)
  primarioClaro: '#E5D5A8',    // = doradoClaro
  primarioOscuro: '#B8954D',   // = doradoOscuro
  
  secundario: '#2C3E50',       // = grisOscuro
  secundarioClaro: '#6C757D',  // = grisTexto
  secundarioOscuro: '#1A1A1A', // = negroElegante
  
  // ==========================================
  // COLORES DE BORDE Y SOMBRA
  // ==========================================
  borde: '#E5E7EB',
  bordeOscuro: '#D1D5DB',
  bordeInput: '#E5E7EB',
  
  sombra: 'rgba(0, 0, 0, 0.1)',
  sombraOscura: 'rgba(0, 0, 0, 0.25)',
  sombraDorada: 'rgba(201, 169, 97, 0.2)',  // Sombra con tinte dorado
  sombraSuave: 'rgba(201, 169, 97, 0.1)',   // Sombra dorada muy suave
  
  // ==========================================
  // OVERLAYS
  // ==========================================
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayClaro: 'rgba(0, 0, 0, 0.3)',
  overlayOscuro: 'rgba(0, 0, 0, 0.7)',
  
  // ==========================================
  // GRADIENTES
  // ==========================================
  gradienteDorado: ['#C9A961', '#E5D5A8'],        // Dorado suave
  gradienteDoradoOscuro: ['#B8954D', '#C9A961'],  // Dorado más intenso
  gradienteNeutro: ['#F8F9FA', '#FFFFFF'],        // Gris muy suave
  gradienteOscuro: ['#2C3E50', '#1A1A1A'],        // Oscuro elegante
  
  // ==========================================
  // CATEGORÍAS DE HABITACIONES (con toque dorado)
  // ==========================================
  categorias: {
    estandar: '#6C757D',      // Gris
    deluxe: '#C9A961',        // Dorado
    suite: '#B8954D',         // Dorado oscuro
    presidencial: '#8B7355',  // Bronce elegante
    ejecutiva: '#A68B5B',     // Dorado medio
  },
  
  // ==========================================
  // ESTADOS DE RESERVA
  // ==========================================
  reservas: {
    pendiente: '#F59E0B',     // Naranja
    confirmada: '#10B981',    // Verde
    enCurso: '#3B82F6',       // Azul
    completada: '#6C757D',    // Gris
    cancelada: '#EF4444',     // Rojo
  },
  
  // ==========================================
  // COLORES OAUTH (para botones sociales)
  // ==========================================
  google: '#DB4437',          // Rojo Google
  googleHover: '#C33D2E',     // Rojo Google oscuro
  github: '#24292E',          // Negro GitHub
  githubHover: '#1B1F23',     // Negro GitHub oscuro
};

// Exportar por defecto también
export default COLORES;