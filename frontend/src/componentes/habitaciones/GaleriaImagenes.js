// frontend/src/componentes/habitaciones/GaleriaImagenes.js
import React, { useState } from 'react';
import { View, Image, StyleSheet, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';

const { width, height } = Dimensions.get('window');

const GaleriaImagenes = ({ imagenes = [] }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  const abrirImagen = (index) => {
    setImagenSeleccionada(index);
    setModalVisible(true);
  };

  return (
    <View style={estilos.container}>
      {/* Imagen principal */}
      {imagenes.length > 0 && (
        <TouchableOpacity
          style={estilos.imagenPrincipalContainer}
          onPress={() => abrirImagen(0)}
        >
          <Image
            source={{ uri: imagenes[0] }}
            style={estilos.imagenPrincipal}
            resizeMode="cover"
          />
        </TouchableOpacity>
      )}

      {/* Miniaturas */}
      {imagenes.length > 1 && (
        <View style={estilos.miniaturasContainer}>
          {imagenes.slice(1, 5).map((imagen, index) => (
            <TouchableOpacity
              key={index}
              style={estilos.miniaturaContainer}
              onPress={() => abrirImagen(index + 1)}
            >
              <Image
                source={{ uri: imagen }}
                style={estilos.miniatura}
                resizeMode="cover"
              />
              {index === 3 && imagenes.length > 5 && (
                <View style={estilos.masImagenesOverlay}>
                  <MaterialCommunityIcons
                    name="image-multiple"
                    size={24}
                    color={COLORES.textoBlanco}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal de imagen completa */}
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={estilos.modalContainer}>
          <TouchableOpacity
            style={estilos.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <MaterialCommunityIcons
              name="close"
              size={30}
              color={COLORES.textoBlanco}
            />
          </TouchableOpacity>

          <Image
            source={{ uri: imagenes[imagenSeleccionada] }}
            style={estilos.imagenModal}
            resizeMode="contain"
          />
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  imagenPrincipalContainer: {
    width: width,
    height: 300,
  },
  imagenPrincipal: {
    width: '100%',
    height: '100%',
  },
  miniaturasContainer: {
    flexDirection: 'row',
    padding: 4,
    gap: 4,
  },
  miniaturaContainer: {
    flex: 1,
    height: 80,
    position: 'relative',
  },
  miniatura: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  masImagenesOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  imagenModal: {
    width: width,
    height: height,
  },
});

export default GaleriaImagenes;
