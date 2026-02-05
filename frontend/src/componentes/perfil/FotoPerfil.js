// frontend/src/componentes/perfil/FotoPerfil.js
import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { mostrarOpcionesImagen } from '../../utils/permisos';
import Boton from '../comun/Boton';

const FotoPerfil = ({ fotoActual, onSubir, loading = false }) => {
  const [imagenSeleccionada, setImagenSeleccionada] = useState(null);

  const seleccionarImagen = async () => {
    const imagen = await mostrarOpcionesImagen();
    if (imagen) {
      setImagenSeleccionada(imagen);
    }
  };

  const handleSubir = () => {
    if (imagenSeleccionada) {
      onSubir(imagenSeleccionada);
      setImagenSeleccionada(null);
    }
  };

  const imagenMostrar = imagenSeleccionada?.uri || fotoActual;

  return (
    <View style={estilos.container}>
      <TouchableOpacity style={estilos.fotoContainer} onPress={seleccionarImagen}>
        {imagenMostrar ? (
          <Image source={{ uri: imagenMostrar }} style={estilos.foto} />
        ) : (
          <View style={estilos.fotoPlaceholder}>
            <MaterialCommunityIcons name="account" size={60} color={COLORES.textoClaro} />
          </View>
        )}

        <View style={estilos.editButton}>
          <MaterialCommunityIcons name="camera" size={20} color={COLORES.textoBlanco} />
        </View>
      </TouchableOpacity>

      <Text style={estilos.ayuda}>Toca para cambiar tu foto de perfil</Text>

      {imagenSeleccionada && (
        <View style={estilos.botonesContainer}>
          <Boton
            variant="outline"
            onPress={() => setImagenSeleccionada(null)}
            style={estilos.boton}
          >
            Cancelar
          </Boton>
          <Boton onPress={handleSubir} loading={loading} style={estilos.boton}>
            Subir Foto
          </Boton>
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: DIMENSIONES.paddingLarge,
  },
  fotoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  foto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 4,
    borderColor: COLORES.primario,
  },
  fotoPlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: COLORES.fondoGris,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORES.borde,
    borderStyle: 'dashed',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORES.primario,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORES.fondoBlanco,
  },
  ayuda: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 20,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  boton: {
    flex: 1,
  },
});

export default FotoPerfil;