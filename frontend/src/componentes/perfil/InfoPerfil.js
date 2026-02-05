// frontend/src/componentes/perfil/InfoPerfil.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { obtenerIniciales, formatearRol } from '../../utils/formatters';
import { obtenerImagenUsuario } from '../../constantes/imagenes';

const InfoPerfil = ({ usuario, onEditarFoto, editable = false }) => {
  const imagenUrl = usuario?.foto ? obtenerImagenUsuario(usuario.foto) : null;

  return (
    <View style={estilos.container}>
      {/* Foto de perfil */}
      <View style={estilos.fotoContainer}>
        {imagenUrl ? (
          <Image source={{ uri: imagenUrl }} style={estilos.foto} />
        ) : (
          <View style={estilos.fotoPlaceholder}>
            <Text style={estilos.inicialesTexto}>
              {obtenerIniciales(usuario?.nombre || 'Usuario')}
            </Text>
          </View>
        )}
        
        {editable && (
          <TouchableOpacity style={estilos.editarFotoButton} onPress={onEditarFoto}>
            <MaterialCommunityIcons name="camera" size={20} color={COLORES.textoBlanco} />
          </TouchableOpacity>
        )}
      </View>

      {/* Información del usuario */}
      <View style={estilos.infoContainer}>
        <Text style={estilos.nombre}>{usuario?.nombre || 'Usuario'}</Text>
        <Text style={estilos.email}>{usuario?.email || ''}</Text>
        
        {usuario?.rol && (
          <View style={estilos.rolBadge}>
            <Text style={estilos.rolTexto}>{formatearRol(usuario.rol)}</Text>
          </View>
        )}
      </View>

      {/* Estadísticas */}
      <View style={estilos.estadisticasContainer}>
        <View style={estilos.estadistica}>
          <Text style={estilos.estadisticaNumero}>
            {usuario?.total_reservas || 0}
          </Text>
          <Text style={estilos.estadisticaLabel}>Reservas</Text>
        </View>
        
        <View style={estilos.divisor} />
        
        <View style={estilos.estadistica}>
          <Text style={estilos.estadisticaNumero}>
            {usuario?.total_comentarios || 0}
          </Text>
          <Text style={estilos.estadisticaLabel}>Reseñas</Text>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.paddingLarge,
    alignItems: 'center',
    ...SOMBRAS.medium,
  },
  fotoContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  foto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  fotoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORES.primario,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inicialesTexto: {
    fontSize: 36,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoBlanco,
  },
  editarFotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORES.primario,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SOMBRAS.small,
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  nombre: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  email: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    marginBottom: 8,
  },
  rolBadge: {
    backgroundColor: COLORES.primario,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  rolTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoBlanco,
  },
  estadisticasContainer: {
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  estadistica: {
    flex: 1,
    alignItems: 'center',
  },
  estadisticaNumero: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  estadisticaLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginTop: 4,
  },
  divisor: {
    width: 1,
    backgroundColor: COLORES.borde,
  },
});

export default InfoPerfil;