/**
 * PALETA DE COLORES - HOTEL LUNA SERENA
 * Sistema centralizado de colores para toda la aplicación
 */

export const COLORES = {
  // Colores principales
  PRIMARIO: '#2C2C2C',           // Navbar, headers oscuros
  SECUNDARIO: '#C9A961',         // Dorado, acentos, botones
  ACENTO: '#F8F8F8',             // Fondos claros, textos alternativos
  COMPLEMENTARIO: '#6B6B6B',     // Textos secundarios, bordes

  // Colores neutros
  NEGRO: '#1A1A1A',              // Texto principal
  BLANCO: '#FFFFFF',             // Fondos claros, texto sobre oscuro
  GRIS_CLARO: '#F5F5F5',         // Backgrounds alternos
  GRIS_MEDIO: '#999999',         // Placeholders, textos deshabilitados
  GRIS_OSCURO: '#4A4A4A',        // Bordes, separadores

  // Colores semánticos
  EXITO: '#10B981',              // Disponible, confirmado, check
  ERROR: '#EF4444',              // No disponible, error, cancelado
  ADVERTENCIA: '#F59E0B',        // Alertas, avisos
  INFO: '#3B82F6',               // Información, tips

  // Colores adicionales
  ORO: '#FFD700',                // Stars, premium
  ROJO_CLARO: '#FCA5A5',         // Errores suaves
  VERDE_CLARO: '#A7F3D0',        // Éxito suave
  AMARILLO_CLARO: '#FEF3C7',     // Advertencia suave
  AZUL_CLARO: '#DBEAFE',         // Info suave

  // Estados
  DISABLED: '#CCCCCC',           // Elementos deshabilitados
  HOVER: 'rgba(201, 169, 97, 0.1)', // Hover dorado
  FOCUS: 'rgba(60, 60, 60, 0.1)',   // Focus primario

  // Transparencias
  OVERLAY_DARK: 'rgba(0, 0, 0, 0.5)',
  OVERLAY_LIGHT: 'rgba(255, 255, 255, 0.1)',
};

/**
 * TIPOGRAFÍA
 */
export const TIPOGRAFIA = {
  // Tamaños
  H1: 32,    // Títulos principales
  H2: 28,    // Subtítulos
  H3: 24,    // Secciones
  H4: 20,    // Subsecciones
  BODY_L: 16, // Texto principal
  BODY_M: 14, // Texto secundario
  BODY_S: 12, // Etiquetas, hints
  CAPTION: 10, // Muy pequeño

  // Pesos
  LIGHT: '300',
  NORMAL: '400',
  MEDIUM: '500',
  SEMIBOLD: '600',
  BOLD: '700',
};

/**
 * ESPACIADO (Padding/Margin)
 */
export const ESPACIADO = {
  XS: 4,
  S: 8,
  M: 12,
  L: 16,
  XL: 20,
  XXL: 24,
  XXXL: 32,
};

/**
 * BORDER RADIUS
 */
export const BORDER_RADIUS = {
  SMALL: 4,
  MEDIUM: 8,
  LARGE: 12,
  XLARGE: 16,
  ROUND: 999,
};

/**
 * SOMBRAS - Compatible con React Native e Expo Web
 */
export const SOMBRAS = {
  SMALL: {
    // Para React Native
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    // Para Web (Expo web)
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  },
  MEDIUM: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
  },
  LARGE: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
  NAVBAR: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.25)',
  },
};
