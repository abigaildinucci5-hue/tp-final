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

/**
 * Componente HeroBanner para pantalla de inicio
 * Muestra una imagen de fondo con contenido superpuesto y botones de CTA
 */
const HeroBanner = ({
  backgroundImage,
  title,
  subtitle,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  logoIcon = 'hotel',
  logoColor = COLORES.dorado,
}) => {
  return (
    <ImageBackground
      source={backgroundImage}
      style={estilos.banner}
      imageStyle={estilos.backgroundImage}
    >
      {/* Overlay oscuro para mejor legibilidad */}
      <View style={estilos.overlay} />

      {/* Contenido del banner */}
      <View style={estilos.content}>
        {/* Logo flotante circular */}
        <View style={estilos.logoContainer}>
          <View style={estilos.logoBg}>
            <MaterialCommunityIcons
              name={logoIcon}
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

        {/* Botones de llamada a la acción */}
        <View style={estilos.buttonsContainer}>
          {primaryButtonText && (
            <TouchableOpacity
              style={estilos.primaryButton}
              onPress={onPrimaryPress}
              activeOpacity={0.8}
            >
              <Text style={estilos.primaryButtonText}>
                {primaryButtonText}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color={COLORES.fondoBlanco}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>
          )}

          {secondaryButtonText && (
            <TouchableOpacity
              style={estilos.secondaryButton}
              onPress={onSecondaryPress}
              activeOpacity={0.8}
            >
              <Text style={estilos.secondaryButtonText}>
                {secondaryButtonText}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

const estilos = StyleSheet.create({
  banner: {
    width: '100%',
    height: 480,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    marginBottom: 24,
  },
  backgroundImage: {
    resizeMode: 'cover',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  content: {
    paddingHorizontal: DIMENSIONES.padding,
    alignItems: 'flex-start',
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
    opacity: 0.9,
    textAlign: 'center',
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
  },
  primaryButtonText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.fondoBlanco,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
});

export default HeroBanner;
