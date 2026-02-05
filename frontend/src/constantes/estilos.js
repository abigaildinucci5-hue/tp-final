// frontend/src/constantes/estilos.js
import { StyleSheet, Dimensions } from 'react-native';
import COLORES from './colores';

const { width, height } = Dimensions.get('window');

/* ============================================================
   DIMENSIONES
   Uso: paddings, margins, tamaños de pantalla
============================================================ */
export const DIMENSIONES = {
  width,
  height,

  padding: 16,
  paddingSmall: 8,
  paddingLarge: 24,

  margin: 16,
  marginSmall: 8,
  marginLarge: 24,

  borderRadius: 12,
  borderRadiusSmall: 6,
  borderRadiusLarge: 20,
};

/* ============================================================
   ESPACIADO  
   (esto faltaba)
   Uso: espaciar componentes con uniformidad
============================================================ */
export const ESPACIADO = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/* ============================================================
   RADIOS  
   (esto faltaba)
   Uso: bordes redondeados
============================================================ */
export const RADIOS = {
  none: 0,
  sm: 6,
  md: 12,
  lg: 20,
  full: 999, // círculos perfectos
};

/* ============================================================
   TIPOGRAFIA
============================================================ */
export const TIPOGRAFIA = {
  // Tamaños de fuente
  fontSizeExtraSmall: 10,
  fontSizeSmall: 12,
  fontSizeRegular: 14,
  fontSizeMedium: 16,
  fontSizeLarge: 18,
  fontSizeExtraLarge: 20,
  fontSizeHeading: 24,
  fontSizeTitle: 28,
  fontSizeDisplay: 32,

  // Pesos
  fontWeightLight: '300',
  fontWeightRegular: '400',
  fontWeightMedium: '500',
  fontWeightSemiBold: '600',
  fontWeightBold: '700',
  fontWeightExtraBold: '800',

  // Line-height
  lineHeightSmall: 16,
  lineHeightRegular: 20,
  lineHeightMedium: 24,
  lineHeightLarge: 28,
};

/* ============================================================
   FUENTES
   (esto faltaba)
   Por si algún componente espera estos nombres
============================================================ */
export const FUENTES = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  extraBold: 'System',
};

/* ============================================================
   SOMBRAS
============================================================ */
export const SOMBRAS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

/* ============================================================
   ESTILOS GLOBALES
============================================================ */
export const ESTILOS_GLOBALES = StyleSheet.create({
  // Contenedores
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  containerPadding: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    padding: DIMENSIONES.padding,
  },
  containerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.fondo,
  },

  // Cards
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    ...SOMBRAS.medium,
  },
  cardSmall: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadiusSmall,
    padding: DIMENSIONES.paddingSmall,
    ...SOMBRAS.small,
  },

  // Textos
  textoTitulo: {
    fontSize: TIPOGRAFIA.fontSizeTitle,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.marginSmall,
  },
  textoSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.marginSmall,
  },
  textoHeading: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  textoNormal: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightRegular,
    color: COLORES.textoMedio,
    lineHeight: TIPOGRAFIA.lineHeightRegular,
  },
  textoSecundario: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightRegular,
    color: COLORES.textoClaro,
  },

  // Botones
  boton: {
    backgroundColor: COLORES.primario,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: DIMENSIONES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonTexto: {
    color: COLORES.textoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  botonSecundario: {
    backgroundColor: COLORES.secundario,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: DIMENSIONES.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 2,
    borderColor: COLORES.primario,
    alignItems: 'center',
    justifyContent: 'center',
  },
  botonOutlineTexto: {
    color: COLORES.primario,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },

  // Inputs
  input: {
    backgroundColor: COLORES.fondoBlanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: DIMENSIONES.borderRadius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoOscuro,
  },
  inputFocus: { borderColor: COLORES.primario },
  inputError: { borderColor: COLORES.error },

  // Filas y columnas
  fila: { flexDirection: 'row', alignItems: 'center' },
  filaEntre: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  columna: { flexDirection: 'column' },

  // Espaciado extra
  marginTop: { marginTop: DIMENSIONES.margin },
  marginBottom: { marginBottom: DIMENSIONES.margin },
  marginVertical: { marginVertical: DIMENSIONES.margin },
  marginHorizontal: { marginHorizontal: DIMENSIONES.margin },

  // Divisor
  divisor: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: DIMENSIONES.margin,
  },

  // Badge
  badge: {
    backgroundColor: COLORES.primario,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeTexto: {
    color: COLORES.textoBlanco,
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },

  // Estados
  exitoTexto: { color: COLORES.exito },
  errorTexto: { color: COLORES.error },
  advertenciaTexto: { color: COLORES.advertencia },
  infoTexto: { color: COLORES.info },
});

/* ============================================================
   EXPORT DEFAULT
============================================================ */
export default {
  DIMENSIONES,
  ESPACIADO,
  RADIOS,
  TIPOGRAFIA,
  FUENTES,
  SOMBRAS,
  ESTILOS_GLOBALES,
};
