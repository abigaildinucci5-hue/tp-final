// frontend/src/componentes/comun/HeroBannerHome.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';

/**
 * Componente HeroBannerHome para pantalla de inicio
 * Versión mejorada con comportamiento dinámico según autenticación
 * 
 * @param {Object} props
 * @param {Object} props.backgroundImage - Source de la imagen de fondo
 * @param {string} props.title - Título principal
 * @param {string} props.subtitle - Subtítulo
 * @param {Function} props.onExplorePress - Callback cuando se presiona "Explorar Habitaciones"
 * @param {Function} props.onLoginPress - Callback cuando se presiona "Iniciar Sesión"
 * @param {Function} props.onRegisterPress - Callback cuando se presiona "Registrarse"
 * @param {string} props.logoIcon - Ícono del logo (default: 'building-outline')
 * @param {string} props.logoColor - Color del logo (default: dorado)
 */
const HeroBannerHome = ({
  backgroundImage,
  title = 'Bienvenido a Nuestro Hotel',
  subtitle = 'Descubre el lujo y la comodidad',
  onExplorePress,
  onLoginPress,
  onRegisterPress,
  logoIcon = 'building-outline',
  logoColor = COLORES.dorado,
}) => {
  const { isAuthenticated, usuario } = useAuth();

  return (
    <ImageBackground
      source={backgroundImage}
      style={estilos.banner}
      imageStyle={estilos.backgroundImage}
      resizeMode="cover"
    >
      {/* Overlay oscuro para mejor legibilidad */}
      <View style={estilos.overlay} />

      {/* Contenido del banner */}
      <View style={estilos.content}>
        {/* Logo flotante circular */}
        <View style={estilos.logoContainer}>
          <View style={estilos.logoBg}>
            <MaterialCommunityIcons
              name={logoIcon || 'building-outline'}
              size={48}
              color={logoColor}
            />
          </View>
        </View>

        {/* Texto principal */}
        <View style={estilos.textContainer}>
          <Text style={estilos.title}>{title}</Text>
          {subtitle && <Text style={estilos.subtitle}>{subtitle}</Text>}
        </View>

        {/* Espacio reservado para llamadas a la acción (eliminadas por diseño) */}
      </View>
    </ImageBackground>
  );
};

const estilos = StyleSheet.create({
  banner: {
    width: '100%',
    height: Platform.OS === 'web' ? 500 : 480,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    marginBottom: 24,
  },
  backgroundImage: {
    // resizeMode is now a prop
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.40)',
  },
  content: {
    paddingHorizontal: DIMENSIONES.padding,
    alignItems: 'flex-start',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 32,
    alignSelf: 'center',
  },
  logoBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    marginBottom: 24,
    width: '100%',
  },
  title: {
    fontSize: TIPOGRAFIA.fontSizeHeading + 4,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.fondoBlanco,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.fondoBlanco,
    opacity: 0.95,
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: COLORES.primario,
    paddingVertical: 14,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  secondaryButtonText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  registerButton: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  registerButtonText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.exito,
    gap: 8,
  },
  welcomeText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
});

export default HeroBannerHome;
