import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';

const EstrellaCalificacion = ({
  calificacion = 0,
  onChange,
  size = 32,
  readonly = false,
  color = COLORES.secundario,
}) => {
  const handlePress = (value) => {
    if (!readonly && onChange) {
      onChange(value);
    }
  };

  return (
    <View style={estilos.container}>
      {[1, 2, 3, 4, 5].map((star) => {
        const Wrapper = readonly ? View : TouchableOpacity;
        
        return (
          <Wrapper
            key={star}
            onPress={() => handlePress(star)}
            disabled={readonly}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={star <= calificacion ? 'star' : 'star-outline'}
              size={size}
              color={color}
            />
          </Wrapper>
        );
      })}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
  },
});

export default EstrellaCalificacion;