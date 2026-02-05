// src/componentes/comun/Modal.js
import React from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Boton from './Boton';
import { COLORES } from '../../constantes/colores';
import { ESPACIADO, RADIOS, FUENTES, SOMBRAS } from '../../constantes/estilos';

const { height: ALTO_PANTALLA } = Dimensions.get('window');

const Modal = ({
  visible,
  onClose,
  titulo,
  children,
  mostrarBotonCerrar = true,
  tipo = 'default', // default, confirmacion, alerta, exito, error
  textoBotonPrincipal,
  textoBotonSecundario,
  onPressPrincipal,
  onPressSecundario,
  cargando = false,
  maxHeight = ALTO_PANTALLA * 0.8,
  animationType = 'slide',
}) => {
  const obtenerIconoTipo = () => {
    switch (tipo) {
      case 'confirmacion':
        return { nombre: 'help-circle', color: COLORES.info };
      case 'alerta':
        return { nombre: 'alert-circle', color: COLORES.advertencia };
      case 'exito':
        return { nombre: 'check-circle', color: COLORES.exito };
      case 'error':
        return { nombre: 'close-circle', color: COLORES.error };
      default:
        return null;
    }
  };

  const icono = obtenerIconoTipo();

  return (
    <RNModal
      visible={visible}
      transparent
      animationType={animationType}
      onRequestClose={onClose}
    >
      <View style={estilos.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={onClose}
        />

        <View style={[estilos.contenedor, { maxHeight }]}>
          {/* Header */}
          <View style={estilos.header}>
            {icono && (
              <View style={estilos.iconoContenedor}>
                <MaterialCommunityIcons
                  name={icono.nombre}
                  size={32}
                  color={icono.color}
                />
              </View>
            )}

            {titulo && (
              <Text style={estilos.titulo} numberOfLines={2}>
                {titulo}
              </Text>
            )}

            {mostrarBotonCerrar && (
              <TouchableOpacity
                style={estilos.botonCerrar}
                onPress={onClose}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLORES.textoGris}
                />
              </TouchableOpacity>
            )}
          </View>

          {/* Contenido */}
          <ScrollView
            style={estilos.scrollView}
            contentContainerStyle={estilos.contenido}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>

          {/* Botones */}
          {(textoBotonPrincipal || textoBotonSecundario) && (
            <View style={estilos.footer}>
              {textoBotonSecundario && (
                <Boton
                  tipo="outline"
                  onPress={onPressSecundario || onClose}
                  estilo={estilos.botonSecundario}
                  deshabilitado={cargando}
                >
                  {textoBotonSecundario}
                </Boton>
              )}

              {textoBotonPrincipal && (
                <Boton
                  tipo={
                    tipo === 'error'
                      ? 'primario'
                      : tipo === 'exito'
                      ? 'secundario'
                      : 'primario'
                  }
                  onPress={onPressPrincipal}
                  estilo={estilos.botonPrincipal}
                  cargando={cargando}
                  deshabilitado={cargando}
                >
                  {textoBotonPrincipal}
                </Boton>
              )}
            </View>
          )}
        </View>
      </View>
    </RNModal>
  );
};

// Componente de confirmación rápida
export const ModalConfirmacion = ({
  visible,
  onClose,
  titulo = '¿Estás seguro?',
  mensaje,
  textoConfirmar = 'Confirmar',
  textoCancelar = 'Cancelar',
  onConfirmar,
  tipo = 'confirmacion',
  cargando = false,
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      titulo={titulo}
      tipo={tipo}
      textoBotonPrincipal={textoConfirmar}
      textoBotonSecundario={textoCancelar}
      onPressPrincipal={onConfirmar}
      onPressSecundario={onClose}
      cargando={cargando}
    >
      <Text style={estilos.mensaje}>{mensaje}</Text>
    </Modal>
  );
};

// Componente de alerta rápida
export const ModalAlerta = ({
  visible,
  onClose,
  titulo,
  mensaje,
  textoBoton = 'Entendido',
  tipo = 'alerta',
}) => {
  return (
    <Modal
      visible={visible}
      onClose={onClose}
      titulo={titulo}
      tipo={tipo}
      textoBotonPrincipal={textoBoton}
      onPressPrincipal={onClose}
    >
      <Text style={estilos.mensaje}>{mensaje}</Text>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: COLORES.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: ESPACIADO.lg,
  },

  contenedor: {
    width: '100%',
    backgroundColor: COLORES.fondoTarjeta,
    borderRadius: RADIOS.lg,
    overflow: 'hidden',
    ...SOMBRAS.xl,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ESPACIADO.lg,
    paddingTop: ESPACIADO.lg,
    paddingBottom: ESPACIADO.md,
  },

  iconoContenedor: {
    marginRight: ESPACIADO.sm,
  },

  titulo: {
    flex: 1,
    fontSize: FUENTES.xxl,
    fontWeight: 'bold',
    color: COLORES.textoOscuro,
  },

  botonCerrar: {
    padding: ESPACIADO.xs,
  },

  scrollView: {
    maxHeight: ALTO_PANTALLA * 0.6,
  },

  contenido: {
    paddingHorizontal: ESPACIADO.lg,
    paddingVertical: ESPACIADO.md,
  },

  mensaje: {
    fontSize: FUENTES.md,
    color: COLORES.textoGris,
    lineHeight: 24,
    textAlign: 'center',
  },

  footer: {
    flexDirection: 'row',
    paddingHorizontal: ESPACIADO.lg,
    paddingVertical: ESPACIADO.lg,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    gap: ESPACIADO.md,
  },

  botonSecundario: {
    flex: 1,
  },

  botonPrincipal: {
    flex: 1,
  },
});

export default Modal;
