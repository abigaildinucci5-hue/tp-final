import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { formatearDesdeAhora } from '../../utils/fechas';
import { obtenerIniciales } from '../../utils/formatters';

const CardComentario = ({ comentario }) => {
  const renderEstrellas = (calificacion) => {
    return (
      <View style={estilos.estrellasContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <MaterialCommunityIcons
            key={star}
            name={star <= calificacion ? 'star' : 'star-outline'}
            size={16}
            color={COLORES.secundario}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={estilos.card}>
      <View style={estilos.header}>
        <View style={estilos.avatar}>
          <Text style={estilos.avatarText}>
            {obtenerIniciales(comentario.usuario?.nombre || 'Usuario')}
          </Text>
        </View>
        
        <View style={estilos.headerInfo}>
          <Text style={estilos.nombre}>{comentario.usuario?.nombre || 'Usuario'}</Text>
          <Text style={estilos.fecha}>
            {formatearDesdeAhora(comentario.fecha_creacion)}
          </Text>
        </View>

        {renderEstrellas(comentario.calificacion)}
      </View>

      <Text style={estilos.comentario}>{comentario.comentario}</Text>
    </View>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.margin,
    borderWidth: 1,
    borderColor: COLORES.borde,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.primario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORES.textoBlanco,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  headerInfo: {
    flex: 1,
  },
  nombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  fecha: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoClaro,
  },
  estrellasContainer: {
    flexDirection: 'row',
    gap: 2,
  },
  comentario: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    lineHeight: TIPOGRAFIA.lineHeightRegular,
  },
});

export default CardComentario;