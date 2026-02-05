import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const ErrorMensaje = ({ mensaje, tipo = 'error', visible = true, style }) => {
  if (!visible || !mensaje) return null;

  const getIconName = () => {
    switch (tipo) {
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert';
      case 'info':
        return 'information';
      case 'success':
        return 'check-circle';
      default:
        return 'alert-circle';
    }
  };

  const getColor = () => {
    switch (tipo) {
      case 'error':
        return COLORES.error;
      case 'warning':
        return COLORES.advertencia;
      case 'info':
        return COLORES.info;
      case 'success':
        return COLORES.exito;
      default:
        return COLORES.error;
    }
  };

  const getBackgroundColor = () => {
    switch (tipo) {
      case 'error':
        return COLORES.errorClaro + '20';
      case 'warning':
        return COLORES.advertenciaClaro + '20';
      case 'info':
        return COLORES.infoClaro + '20';
      case 'success':
        return COLORES.exitoClaro + '20';
      default:
        return COLORES.errorClaro + '20';
    }
  };

  return (
    <View
      style={[
        estilos.container,
        { backgroundColor: getBackgroundColor() },
        style,
      ]}
    >
      <MaterialCommunityIcons name={getIconName()} size={20} color={getColor()} />
      <Text style={[estilos.texto, { color: getColor() }]}>{mensaje}</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DIMENSIONES.paddingSmall,
    borderRadius: DIMENSIONES.borderRadiusSmall,
    gap: 8,
    marginVertical: 8,
  },
  texto: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightRegular,
  },
});

export default ErrorMensaje;