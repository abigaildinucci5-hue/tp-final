// frontend/src/componentes/habitaciones/BotonFavorito.js
import React from 'react';
import { TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

const BotonFavorito = ({ esFavorito, onPress, size = 28, style }) => {
  const scaleValue = new Animated.Value(1);
  const { requireAuth } = useAuthNavigation();

  const handlePress = () => {
    // Validar autenticación y ejecutar acción
    requireAuth(() => {
      // Animación al presionar
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 1.3,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();

      onPress && onPress();
    });
  };

  return (
    <TouchableOpacity
      style={[estilos.button, style]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <MaterialCommunityIcons
          name={esFavorito ? 'heart' : 'heart-outline'}
          size={size}
          color={esFavorito ? COLORES.error : COLORES.textoBlanco}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  button: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 8,
    borderRadius: 20,
  },
});

export default BotonFavorito;