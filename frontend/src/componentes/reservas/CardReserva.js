// frontend/src/componentes/reservas/CardReserva.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { formatearFecha, formatearNoches } from '../../utils/fechas';
import { formatearPrecio, formatearEstadoReserva } from '../../utils/formatters';
import { obtenerImagenHabitacion } from '../../constantes/imagenes';
import reservasService from '../../servicios/reservasService';

const CardReserva = ({ reserva, onPress, userRole = 'cliente', onEliminar = null }) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const mostrarEstado = userRole !== 'cliente';
  const esEmpleadoOAdmin = userRole === 'empleado' || userRole === 'admin';

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return COLORES.advertencia;
      case 'confirmada':
        return COLORES.exito;
      case 'en_curso':
        return COLORES.info;
      case 'completada':
        return COLORES.textoMedio;
      case 'cancelada':
        return COLORES.error;
      default:
        return COLORES.textoMedio;
    }
  };

  const imagenUrl = reserva.imagen_principal
    ? obtenerImagenHabitacion(reserva.imagen_principal)
    : null;

  const noches = formatearNoches(reserva.fecha_entrada, reserva.fecha_salida);

  const handleEliminar = async () => {
    setShowConfirmModal(false);
    setEliminando(true);
    try {
      await reservasService.eliminarReserva(reserva.id_reserva);
      Alert.alert('Éxito', 'Reserva eliminada correctamente');
      onEliminar && onEliminar(reserva.id_reserva);
    } catch (error) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar la reserva');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={estilos.card} 
        onPress={onPress} 
        activeOpacity={0.8} 
        disabled={reserva.estado === 'eliminada'}
      >
        <View style={estilos.row}>
          {/* Imagen */}
          <Image
            source={imagenUrl ? { uri: imagenUrl } : require('../../assets/images/placeholder-habitacion.png')}
            style={[estilos.imagen, reserva.estado === 'eliminada' && { opacity: 0.5 }]}
          />

          {/* Información */}
          <View style={estilos.infoContainer}>
            <View style={estilos.headerRow}>
              <Text style={estilos.habitacionNombre} numberOfLines={1}>
                {reserva.tipo_habitacion || 'Habitación'} #{reserva.numero_habitacion}
              </Text>
              {mostrarEstado && (
                <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(reserva.estado) }]}>
                  <Text style={estilos.estadoTexto}>
                    {formatearEstadoReserva(reserva.estado)}
                  </Text>
                </View>
              )}
            </View>

            <View style={estilos.detalle}>
              <MaterialCommunityIcons name="calendar-outline" size={16} color={COLORES.textoMedio} />
              <Text style={estilos.detalleTexto}>
                {formatearFecha(reserva.fecha_entrada)} - {formatearFecha(reserva.fecha_salida)}
              </Text>
            </View>

            <View style={estilos.detalle}>
              <MaterialCommunityIcons name="weather-night" size={16} color={COLORES.textoMedio} />
              <Text style={estilos.detalleTexto}>{noches}</Text>
            </View>

            {reserva.estado === 'eliminada' && userRole === 'cliente' ? (
              <Text style={estilos.mensajeEliminada}>
                ⚠️ Tu reserva fue dada de baja. Comunícate con nuestro personal.
              </Text>
            ) : (
              <Text style={estilos.precio}>{formatearPrecio(reserva.precio_total)}</Text>
            )}
          </View>
        </View>

        {/* Botón eliminar (solo para empleado/admin) - esquina inferior derecha */}
        {esEmpleadoOAdmin && (
          <TouchableOpacity
            style={estilos.btnEliminar}
            onPress={() => setShowConfirmModal(true)}
            disabled={eliminando}
          >
            <MaterialCommunityIcons
              name="delete"
              size={20}
              color={COLORES.error}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>

      {/* Modal de Confirmación */}
      <Modal
        visible={showConfirmModal}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View style={estilos.modalOverlay}>
          <View style={estilos.modalContent}>
            <View style={estilos.modalIconContainer}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={48}
                color={COLORES.error}
              />
            </View>

            <Text style={estilos.modalTitle}>
              Eliminar Reserva
            </Text>

            <Text style={estilos.modalMessage}>
              ¿Estás seguro de que deseas eliminar esta reserva permanentemente? Esta acción no se puede deshacer.
            </Text>

            <Text style={estilos.reservaInfo}>
              Habitación {reserva.numero_habitacion} • {formatearFecha(reserva.fecha_entrada)}
            </Text>

            <View style={estilos.modalButtonsContainer}>
              <TouchableOpacity
                style={[estilos.modalButton, estilos.modalButtonCancel]}
                onPress={() => setShowConfirmModal(false)}
                disabled={eliminando}
              >
                <Text style={estilos.modalButtonCancelText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[estilos.modalButton, estilos.modalButtonConfirm]}
                onPress={handleEliminar}
                disabled={eliminando}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={18}
                  color={COLORES.textoBlanco}
                  style={{ marginRight: 6 }}
                />
                <Text style={estilos.modalButtonConfirmText}>
                  {eliminando ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.margin,
    ...SOMBRAS.medium,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
    alignItems: 'flex-start',
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: DIMENSIONES.borderRadiusSmall,
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  habitacionNombre: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  estadoBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  estadoTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoBlanco,
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detalleTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  precio: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginTop: 4,
  },
  mensajeEliminada: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    marginTop: 4,
    fontStyle: 'italic',
  },
  btnEliminar: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 8,
    right: 8,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  modalIconContainer: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  reservaInfo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.primario,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    marginBottom: 20,
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  modalButtonCancel: {
    backgroundColor: COLORES.fondoGris,
  },
  modalButtonCancelText: {
    color: COLORES.textoOscuro,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  modalButtonConfirm: {
    backgroundColor: COLORES.error,
  },
  modalButtonConfirmText: {
    color: COLORES.textoBlanco,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
});

export default CardReserva;