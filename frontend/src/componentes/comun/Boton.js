// frontend/src/componentes/comun/Boton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const Boton = ({
  children,
  onPress,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'text', 'danger'
  size = 'medium', // 'small', 'medium', 'large'
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left', // 'left' o 'right'
}) => {
  const getButtonStyle = () => {
    const styles = [estilos.botonBase];

    // Variantes
    switch (variant) {
      case 'primary':
        styles.push(estilos.botonPrimary);
        break;
      case 'secondary':
        styles.push(estilos.botonSecondary);
        break;
      case 'outline':
        styles.push(estilos.botonOutline);
        break;
      case 'text':
        styles.push(estilos.botonText);
        break;
      case 'danger':
        styles.push(estilos.botonDanger);
        break;
    }

    // Tamaños
    switch (size) {
      case 'small':
        styles.push(estilos.botonSmall);
        break;
      case 'medium':
        styles.push(estilos.botonMedium);
        break;
      case 'large':
        styles.push(estilos.botonLarge);
        break;
    }

    if (fullWidth) {
      styles.push(estilos.botonFullWidth);
    }

    if (disabled) {
      styles.push(estilos.botonDisabled);
    }

    if (style) {
      styles.push(style);
    }

    return styles;
  };

  const getTextStyle = () => {
    const styles = [estilos.textoBase];

    switch (variant) {
      case 'primary':
        styles.push(estilos.textoPrimary);
        break;
      case 'secondary':
        styles.push(estilos.textoSecondary);
        break;
      case 'outline':
        styles.push(estilos.textoOutline);
        break;
      case 'text':
        styles.push(estilos.textoText);
        break;
      case 'danger':
        styles.push(estilos.textoDanger);
        break;
    }

    switch (size) {
      case 'small':
        styles.push(estilos.textoSmall);
        break;
      case 'medium':
        styles.push(estilos.textoMedium);
        break;
      case 'large':
        styles.push(estilos.textoLarge);
        break;
    }

    if (textStyle) {
      styles.push(textStyle);
    }

    return styles;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'text' ? COLORES.primario : COLORES.textoBlanco}
          size="small"
        />
      );
    }

    if (icon) {
      return (
        <>
          {iconPosition === 'left' && icon}
          <Text style={getTextStyle()}>{children}</Text>
          {iconPosition === 'right' && icon}
        </>
      );
    }

    return <Text style={getTextStyle()}>{children}</Text>;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  botonBase: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: DIMENSIONES.borderRadius,
    gap: 8,
  },
  
  // Variantes
  botonPrimary: {
    backgroundColor: COLORES.primario,
  },
  botonSecondary: {
    backgroundColor: COLORES.secundario,
  },
  botonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORES.primario,
  },
  botonText: {
    backgroundColor: 'transparent',
  },
  botonDanger: {
    backgroundColor: COLORES.error,
  },
  
  // Tamaños
  botonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  botonMedium: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  botonLarge: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  
  // Otros estados
  botonFullWidth: {
    width: '100%',
  },
  botonDisabled: {
    opacity: 0.5,
  },
  
  // Textos
  textoBase: {
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  textoPrimary: {
    color: COLORES.textoBlanco,
  },
  textoSecondary: {
    color: COLORES.textoBlanco,
  },
  textoOutline: {
    color: COLORES.primario,
  },
  textoText: {
    color: COLORES.primario,
  },
  textoDanger: {
    color: COLORES.textoBlanco,
  },
  textoSmall: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
  },
  textoMedium: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
  },
  textoLarge: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
  },
});

export default Boton;