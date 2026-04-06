import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import Boton from './Boton';

const ModalConfirmacion = ({
  visible = false,
  titulo = 'Confirmar',
  mensaje = '¿Estás seguro?',
  iconName = 'alert-circle',
  iconColor = COLORES.advertencia,
  labelConfirmar = 'Confirmar',
  labelCancelar = 'Cancelar',
  variant = 'default', // 'default' o 'destructive'
  loading = false,
  compact = false,
  confirmButtonStyle = {},
  cancelButtonStyle = {},
  cancelTextStyle = {},
  onConfirmar = () => {},
  onCancelar = () => {},
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancelar}
    >
      <View style={estilos.modalOverlay}>
        <View style={[estilos.modalContainer, compact && estilos.modalContainerCompact]}>
          {/* Header con ícono */}
          <View style={estilos.headerContainer}>
            <MaterialCommunityIcons
              name={iconName}
              size={44}
              color={iconColor}
            />
          </View>

          {/* Contenido */}
          <Text style={estilos.titulo}>{titulo}</Text>
          <Text style={estilos.mensaje}>{mensaje}</Text>

          {/* Botones */}
          <View style={estilos.botonesContainer}>
            {labelCancelar && (
              <Boton
                variant="outline"
                onPress={onCancelar}
                disabled={loading}
                fullWidth
                style={[estilos.cancelButton, cancelButtonStyle]}
                textStyle={[estilos.cancelButtonText, cancelTextStyle]}
              >
                {labelCancelar}
              </Boton>
            )}
            <Boton
              variant={variant === 'destructive' ? 'danger' : 'primary'}
              onPress={onConfirmar}
              loading={loading}
              disabled={loading}
              fullWidth
              style={confirmButtonStyle}
            >
              {!loading && labelConfirmar}
            </Boton>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const estilos = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius * 1.5,
    paddingVertical: DIMENSIONES.padding * 1.5,
    paddingHorizontal: DIMENSIONES.padding,
    width: '85%',
    maxWidth: 400,
    alignItems: 'center',
  },
  headerContainer: {
    marginBottom: DIMENSIONES.padding,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    textAlign: 'center',
    marginBottom: DIMENSIONES.padding / 2,
  },
  mensaje: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: DIMENSIONES.padding * 1.5,
  },
  botonesContainer: {
    width: '100%',
    gap: 12,
  },
  modalContainerCompact: {
    width: '82%',
    paddingVertical: DIMENSIONES.padding,
    paddingHorizontal: DIMENSIONES.padding,
  },
  cancelButton: {
    backgroundColor: COLORES.blanco,
    borderColor: COLORES.borde,
  },
  cancelButtonText: {
    color: COLORES.textoOscuro,
  },
});

export default ModalConfirmacion;
