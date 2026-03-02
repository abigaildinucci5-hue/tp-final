import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { COLORES } from '../../constantes/colores';
import { obtenerReserva, cancelarReserva } from '../../servicios/reservasService';

const MOTIVOS_CANCELACION = [
  'Me equivoqué de habitación',
  'No me gustó el servicio',
  'Cambio de planes',
  'Problema personal',
  'Otra razón',
];

const POLITICA_CANCELACION = `
Política de Cancelación:

• Cancelación gratuita: Hasta 48h antes de la entrada
• Reembolso parcial: 50% entre 24-48h antes
• Sin reembolso: Menos de 24h antes

Contacta nuestro equipo ante cualquier problema.
`;

const DetalleReservaScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [reserva, setReserva] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelando, setCancelando] = useState(false);
  const [showMotivoModal, setShowMotivoModal] = useState(false);
  const [motivoSeleccionado, setMotivoSeleccionado] = useState('');
  const [motivoPersonalizado, setMotivoPersonalizado] = useState('');
  const [otroMotivo, setOtroMotivo] = useState(false);

  useEffect(() => {
    cargarReserva();
  }, [id]);

  const cargarReserva = async () => {
    try {
      setLoading(true);
      const response = await obtenerReserva(id);
      console.log('📋 Reserva cargada:', response.data || response);
      setReserva(response.data || response);
    } catch (error) {
      console.error('❌ Error al cargar reserva:', error);
      Alert.alert('Error', 'No se pudo cargar la reserva');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return '-';
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const calcularDias = (checkIn, checkOut) => {
    if (!checkIn || !checkOut) return '-';
    const inicio = new Date(checkIn);
    const fin = new Date(checkOut);
    const diferencia = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24));
    return diferencia;
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'confirmada':
      case 'confirmed':
        return COLORES.EXITO;
      case 'pendiente':
      case 'pending':
        return COLORES.ADVERTENCIA;
      case 'cancelada':
      case 'cancelled':
        return COLORES.ERROR;
      default:
        return COLORES.grisTexto;
    }
  };

  const handleCancelarReserva = () => {
    Alert.alert(
      '¿Estás seguro?',
      '¡Atención! Una vez cancelada, no podrás recuperarla.',
      [
        { text: 'No, volver', onPress: () => {}, style: 'cancel' },
        {
          text: 'Sí, cancelar',
          onPress: () => setShowMotivoModal(true),
          style: 'destructive',
        },
      ]
    );
  };

  const procesarCancelacion = async () => {
    if (!motivoSeleccionado && !motivoPersonalizado) {
      Alert.alert('Error', 'Por favor selecciona o indica un motivo');
      return;
    }

    try {
      setCancelando(true);
      console.log('🚫 Cancelando reserva:', id);
      
      const response = await cancelarReserva(id);
      console.log('✅ Reserva cancelada:', response);

      Alert.alert(
        '✅ Cancelación completada',
        'Tu reserva ha sido cancelada exitosamente',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowMotivoModal(false);
              setMotivoSeleccionado('');
              setMotivoPersonalizado('');
              setOtroMotivo(false);
              navigation.goBack();
            },
          },
        ]
      );
    } catch (error) {
      console.error('❌ Error al cancelar:', error);
      Alert.alert('Error', 'No se pudo cancelar la reserva. Intenta nuevamente.');
    } finally {
      setCancelando(false);
    }
  };

  if (loading) {
    return (
      <View style={[ESTILOS_GLOBALES.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORES.PRIMARIO} />
      </View>
    );
  }

  if (!reserva) {
    return (
      <View style={[ESTILOS_GLOBALES.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 16, color: COLORES.grisTexto }}>
          No se encontró la reserva
        </Text>
      </View>
    );
  }

  const estado = reserva.estado || 'pendiente';
  const diasReserva = calcularDias(reserva.fecha_check_in, reserva.fecha_check_out);

  return (
    <>
      <ScrollView style={ESTILOS_GLOBALES.container} showsVerticalScrollIndicator={false}>
        {/* Header con estado */}
        <View style={styles.header}>
          <View>
            <Text style={styles.reservaNumbero}>
              Reserva #{reserva.id_reserva || reserva.id}
            </Text>
            <View
              style={[
                styles.estadoBadge,
                { backgroundColor: getEstadoColor(estado) },
              ]}
            >
              <Text style={styles.estadoText}>
                {estado.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Información principal - Fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📅 Fechas</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>CHECK-IN:</Text>
            <Text style={styles.value}>
              {formatFecha(reserva.fecha_check_in)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>CHECK-OUT:</Text>
            <Text style={styles.value}>
              {formatFecha(reserva.fecha_check_out)}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>DURACIÓN:</Text>
            <Text style={styles.value}>{diasReserva} noche(s)</Text>
          </View>
        </View>

        {/* Habitación */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🏨 Habitación</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>NÚMERO/TIPO:</Text>
            <Text style={styles.value}>
              {reserva.numero_habitacion ||
                reserva.id_habitacion ||
                'Habitación'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>HUÉSPEDES:</Text>
            <Text style={styles.value}>{reserva.cantidad_huespedes || 1}</Text>
          </View>
        </View>

        {/* Pago */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💳 Pago</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>MÉTODO:</Text>
            <Text style={styles.value}>
              {reserva.metodo_pago || 'No especificado'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.label}>PRECIO:</Text>
            <Text style={styles.valueBig}>
              ${reserva.precio_total || '0.00'}
            </Text>
          </View>
        </View>

        {/* Política de Cancelación */}
        <View style={[styles.section, { backgroundColor: COLORES.FONDO_CLARO }]}>
          <Text style={styles.sectionTitle}>📋 Política de Cancelación</Text>
          <Text style={styles.politicaText}>{POLITICA_CANCELACION.trim()}</Text>
        </View>

        {/* Acciones - Solo si está confirmada o pendiente */}
        {(estado.toLowerCase() === 'confirmada' ||
          estado.toLowerCase() === 'pending' ||
          estado.toLowerCase() === 'confirmed') && (
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.salirButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.salirButtonText}>← Salir</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, styles.cancelarButton]}
              onPress={handleCancelarReserva}
            >
              <Text style={styles.cancelarButtonText}>🗑️ Cancelar</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Mensaje si ya está cancelada */}
        {estado.toLowerCase() === 'cancelada' && (
          <View style={styles.canceladaContainer}>
            <Text style={styles.canceladaText}>
              ✅ Esta reserva ya ha sido cancelada
            </Text>
            <TouchableOpacity
              style={[styles.actionButton, styles.salirButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.salirButtonText}>← Volver</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Modal para motivo de cancelación */}
      <Modal
        visible={showMotivoModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMotivoModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMotivoModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>¿Por qué cancelas?</Text>
              <View />
            </View>

            {/* Opciones flotantes */}
            <ScrollView style={styles.motivosContainer}>
              {MOTIVOS_CANCELACION.map((motivo, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.motivoTag,
                    motivoSeleccionado === motivo &&
                      !otroMotivo && {
                        backgroundColor: COLORES.PRIMARIO,
                        borderColor: COLORES.PRIMARIO,
                      },
                  ]}
                  onPress={() => {
                    setMotivoSeleccionado(motivo);
                    setOtroMotivo(false);
                    setMotivoPersonalizado('');
                  }}
                >
                  <Text
                    style={[
                      styles.motivoTagText,
                      motivoSeleccionado === motivo &&
                        !otroMotivo && { color: COLORES.BLANCO },
                    ]}
                  >
                    {motivo}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Input para otro motivo */}
            <View style={styles.otroMotivoContainer}>
              <TouchableOpacity
                style={[
                  styles.motivoTag,
                  otroMotivo && {
                    backgroundColor: COLORES.PRIMARIO,
                    borderColor: COLORES.PRIMARIO,
                  },
                ]}
                onPress={() => setOtroMotivo(!otroMotivo)}
              >
                <Text
                  style={[
                    styles.motivoTagText,
                    otroMotivo && { color: COLORES.BLANCO },
                  ]}
                >
                  Escribir otro motivo
                </Text>
              </TouchableOpacity>

              {otroMotivo && (
                <TextInput
                  style={styles.motivoInput}
                  placeholder="Cuéntanos tu motivo..."
                  placeholderTextColor={COLORES.grisTexto}
                  value={motivoPersonalizado}
                  onChangeText={setMotivoPersonalizado}
                  multiline={true}
                  numberOfLines={3}
                />
              )}
            </View>

            {/* Contacto */}
            <Text style={styles.contactoText}>
              Ante cualquier problema, contacta a nuestro equipo
            </Text>

            {/* Botones de confirmación */}
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowMotivoModal(false)}
              >
                <Text style={styles.modalButtonText}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalConfirmButton,
                  (cancelando ||
                    (!motivoSeleccionado && !motivoPersonalizado)) && {
                    opacity: 0.6,
                  },
                ]}
                onPress={procesarCancelacion}
                disabled={cancelando || (!motivoSeleccionado && !motivoPersonalizado)}
              >
                {cancelando ? (
                  <ActivityIndicator color={COLORES.BLANCO} />
                ) : (
                  <Text style={styles.modalConfirmButtonText}>
                    Confirmar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = {
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: COLORES.FONDO_CLARO,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },
  reservaNumbero: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORES.PRIMARIO,
    marginBottom: 8,
  },
  estadoBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  estadoText: {
    color: COLORES.BLANCO,
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORES.NEGRO,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORES.grisTexto,
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORES.NEGRO,
    flex: 1,
    textAlign: 'right',
  },
  valueBig: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORES.PRIMARIO,
    flex: 1,
    textAlign: 'right',
  },
  politicaText: {
    fontSize: 13,
    color: COLORES.grisTexto,
    lineHeight: 20,
  },
  actionsContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    gap: 12,
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  salirButton: {
    backgroundColor: COLORES.BLANCO,
    borderWidth: 2,
    borderColor: COLORES.grisClaro,
  },
  salirButtonText: {
    color: COLORES.NEGRO,
    fontWeight: '700',
    fontSize: 14,
  },
  cancelarButton: {
    backgroundColor: COLORES.ERROR,
  },
  cancelarButtonText: {
    color: COLORES.BLANCO,
    fontWeight: '700',
    fontSize: 14,
  },
  canceladaContainer: {
    marginHorizontal: 16,
    marginVertical: 20,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
  },
  canceladaText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.EXITO,
    marginBottom: 16,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORES.BLANCO,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },
  closeButton: {
    fontSize: 24,
    color: COLORES.grisTexto,
    fontWeight: '600',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORES.NEGRO,
  },
  motivosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxHeight: 200,
  },
  motivoTag: {
    backgroundColor: COLORES.FONDO_CLARO,
    borderWidth: 1,
    borderColor: COLORES.grisClaro,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  motivoTagText: {
    color: COLORES.NEGRO,
    fontSize: 13,
    fontWeight: '500',
  },
  otroMotivoContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  motivoInput: {
    backgroundColor: COLORES.FONDO_CLARO,
    borderWidth: 1,
    borderColor: COLORES.grisClaro,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 8,
    color: COLORES.NEGRO,
    fontSize: 13,
  },
  contactoText: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORES.grisTexto,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  modalButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORES.grisClaro,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: COLORES.FONDO_CLARO,
  },
  modalConfirmButton: {
    backgroundColor: COLORES.ERROR,
  },
  modalButtonText: {
    color: COLORES.NEGRO,
    fontWeight: '600',
    fontSize: 13,
  },
  modalConfirmButtonText: {
    color: COLORES.BLANCO,
    fontWeight: '600',
    fontSize: 13,
  },
};

export default DetalleReservaScreen;