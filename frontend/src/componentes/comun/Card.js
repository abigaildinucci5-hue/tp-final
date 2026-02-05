// frontend/src/componentes/comun/Card.js
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES, SOMBRAS } from '../../constantes/estilos';

const Card = ({
  children,
  onPress,
  style,
  variant = 'elevated', // 'elevated', 'outlined', 'flat'
  padding = true,
  margin = false,
}) => {
  const getCardStyle = () => {
    const styles = [estilos.cardBase];

    // Variantes
    switch (variant) {
      case 'elevated':
        styles.push(estilos.cardElevated);
        break;
      case 'outlined':
        styles.push(estilos.cardOutlined);
        break;
      case 'flat':
        styles.push(estilos.cardFlat);
        break;
    }

    if (padding) {
      styles.push(estilos.cardPadding);
    }

    if (margin) {
      styles.push(estilos.cardMargin);
    }

    if (style) {
      styles.push(style);
    }

    return styles;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={getCardStyle()}>{children}</View>;
};

const estilos = StyleSheet.create({
  cardBase: {
    borderRadius: DIMENSIONES.borderRadius,
    backgroundColor: COLORES.fondoBlanco,
  },
  cardElevated: {
    ...SOMBRAS.medium,
  },
  cardOutlined: {
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  cardFlat: {
    backgroundColor: COLORES.fondoGris,
  },
  cardPadding: {
    padding: DIMENSIONES.padding,
  },
  cardMargin: {
    margin: DIMENSIONES.margin,
  },
});

export default Card;