import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Boton from '../../componentes/comun/Boton';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';
import reservasService from '../../servicios/reservasService';
import { formatearFecha, formatearHora } from '../../utils/dateFormatter';

// Modal de feedback simple (éxito o error)
const ModalFeedback = ({ visible, tipo, titulo, mensaje, onClose }) => (
  <ModalConfirmacion
    visible={visible}
    titulo={titulo}
    mensaje={mensaje}
    iconName={tipo === 'exito' ? 'check-circle' : 'alert-circle'}
    iconColor={tipo === 'exito' ? COLORES.exito : COLORES.error}
    labelConfirmar="OK"
    labelCancelar=""
    onConfirmar={onClose}
    onCancelar={onClose}
  />
);

const DetalleReservaAdminScreen = ({ navigation, route }) => {
  const { reserva: reservaInicial } = route.params;

  const [reserva, setReserva] = useState(reservaInicial);
  const [loading, setLoading] = useState(false);

  // Modales de confirmación
  const [modalConfirmar, setModalConfirmar] = useState(false);
  const [modalCompletar, setModalCompletar] = useState(false);
  const [modalBaja, setModalBaja] = useState(false);
  const [modalEliminar, setModalEliminar] = useState(false);

  // Modal de feedback
  const [modalFeedback, setModalFeedback] = useState(null);

  const mostrarFeedback = (tipo, titulo, mensaje, onClose) => {
    setModalFeedback({ tipo, titulo, mensaje, onClose: onClose || (() => setModalFeedback(null)) });
  };

  // ── Confirmar ──────────────────────────────────────────────────────────────
  const procederConfirmar = async () => {
    setModalConfirmar(false);
    try {
      setLoading(true);
      await reservasService.confirmar(reserva.id_reserva);
      setReserva(prev => ({ ...prev, estado: 'confirmada' }));
      mostrarFeedback('exito', 'Reserva Confirmada', 'La reserva fue confirmada correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo confirmar: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // ── Completar ──────────────────────────────────────────────────────────────
  const procederCompletar = async () => {
    setModalCompletar(false);
    try {
      setLoading(true);
      await reservasService.completarReserva(reserva.id_reserva);
      setReserva(prev => ({ ...prev, estado: 'completada' }));
      mostrarFeedback('exito', 'Reserva Completada', 'La reserva fue marcada como completada', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo completar: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  // ── Dar de baja / Cancelar ─────────────────────────────────────────────────
  const procederDarDeBaja = async () => {
    setModalBaja(false);
    try {
      setLoading(true);
      await reservasService.cancelarReserva(reserva.id_reserva);
      setReserva(prev => ({ ...prev, estado: 'cancelada' }));
      mostrarFeedback('exito', 'Reserva Cancelada', 'La reserva fue dada de baja correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo dar de baja: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const procederEliminar = async () => {
    setModalEliminar(false);
    try {
      setLoading(true);
      await reservasService.eliminarReserva(reserva.id_reserva);
      mostrarFeedback('exito', 'Reserva Eliminada', 'La reserva fue eliminada correctamente', () => {
        setModalFeedback(null);
        navigation.goBack();
      });
    } catch (error) {
      mostrarFeedback('error', 'Error', 'No se pudo eliminar: ' + (error.message || 'Error desconocido'));
    } finally {
      setLoading(false);
    }
  };

  const getEstadoBadgeColor = () => {
    switch (reserva?.estado) {
      case 'confirmada': return COLORES.exito;
      case 'pendiente':  return COLORES.advertencia;
      case 'cancelada':  return COLORES.error;
      case 'completada': return COLORES.primario;
      default:           return COLORES.primario;
    }
  };

  const diasEstancia = Math.ceil(
    (new Date(reserva?.fecha_salida) - new Date(reserva?.fecha_entrada)) / (1000 * 60 * 60 * 24)
  );

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Detalle de Reserva"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      {loading ? (
        <ActivityIndicator size="large" color={COLORES.primario} style={{ marginTop: 20 }} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          scrollEnabled
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: DIMENSIONES.padding, paddingVertical: DIMENSIONES.padding, paddingBottom: 150 }}
        >
          {/* Estado */}
          <View style={estilos.headerSection}>
            <View style={estilos.statusBadge}>
              <View style={[estilos.statusDot, { backgroundColor: getEstadoBadgeColor() }]} />
              <Text style={estilos.statusTexto}>{reserva?.estado?.toUpperCase()}</Text>
            </View>
            <Text style={estilos.reservaId}>Reserva #{reserva?.id_reserva}</Text>
          </View>

          {/* Huésped */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Información del Huésped</Text>
            <View style={estilos.card}>
              <View style={estilos.row}>
                <MaterialCommunityIcons name="account" size={24} color={COLORES.primario} />
                <View style={estilos.rowInfo}>
                  <Text style={estilos.label}>Nombre</Text>
                  <Text style={estilos.value}>{reserva?.nombre_usuario} {reserva?.apellido_usuario}</Text>
                </View>
              </View>
              <View style={estilos.row}>
                <MaterialCommunityIcons name="email" size={24} color={COLORES.primario} />
                <View style={estilos.rowInfo}>
                  <Text style={estilos.label}>Email</Text>
                  <Text style={estilos.value}>{reserva?.email_usuario}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Habitación */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Habitación</Text>
            <View style={estilos.card}>
              {reserva?.imagen_principal && (
                <Image source={{ uri: String(reserva.imagen_principal) }} style={estilos.imagenHabitacion} />
              )}
              <View style={estilos.habitacionInfo}>
                <View>
                  <Text style={estilos.habitacionNumero}>Habitación {reserva?.numero_habitacion}</Text>
                  <Text style={estilos.habitacionTipo}>{reserva?.tipo_habitacion}</Text>
                </View>
                <Text style={estilos.habitacionCapacidad}>{reserva?.numero_huespedes} huésped(es)</Text>
              </View>
            </View>
          </View>

          {/* Fechas */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Fechas y Horarios</Text>
            <View style={estilos.card}>
              <View style={estilos.row}>
                <MaterialCommunityIcons name="calendar-check" size={24} color={COLORES.exito} />
                <View style={estilos.rowInfo}>
                  <Text style={estilos.label}>Entrada</Text>
                  <Text style={estilos.value}>{formatearFecha(reserva?.fecha_entrada)} - {formatearHora(reserva?.hora_entrada)}</Text>
                </View>
              </View>
              <View style={estilos.row}>
                <MaterialCommunityIcons name="calendar-remove" size={24} color={COLORES.error} />
                <View style={estilos.rowInfo}>
                  <Text style={estilos.label}>Salida</Text>
                  <Text style={estilos.value}>{formatearFecha(reserva?.fecha_salida)} - {formatearHora(reserva?.hora_salida)}</Text>
                </View>
              </View>
              <View style={estilos.diasEstancia}>
                <Text style={estilos.diasTexto}>{diasEstancia} noche{diasEstancia !== 1 ? 's' : ''}</Text>
              </View>
            </View>
          </View>

          {/* Precio */}
          <View style={estilos.section}>
            <Text style={estilos.sectionTitle}>Costo</Text>
            <View style={[estilos.card, estilos.precioCard]}>
              <View style={estilos.row_precio}>
                <Text style={estilos.precioLabel}>Precio Total</Text>
                <Text style={estilos.precioValor}>${parseFloat(reserva?.precio_total || 0).toFixed(2)}</Text>
              </View>
              {reserva?.descuento_aplicado > 0 && (
                <View style={[estilos.row_precio, estilos.descuentoRow]}>
                  <Text style={estilos.precioLabel}>Descuento</Text>
                  <Text style={estilos.descuentoValor}>-${parseFloat(reserva.descuento_aplicado).toFixed(2)}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Notas */}
          {reserva?.notas_especiales && (
            <View style={estilos.section}>
              <Text style={estilos.sectionTitle}>Notas Especiales</Text>
              <View style={[estilos.card, estilos.notasCard]}>
                <Text style={estilos.notasTexto}>{reserva.notas_especiales}</Text>
              </View>
            </View>
          )}

          {/* Acciones */}
          <View style={{ marginTop: 24, gap: 12 }}>
            {reserva?.estado === 'pendiente' && (
              <Boton onPress={() => setModalConfirmar(true)} loading={loading} fullWidth>
                Confirmar Reserva
              </Boton>
            )}
            {reserva?.estado === 'confirmada' && (
              <Boton onPress={() => setModalCompletar(true)} loading={loading} fullWidth>
                Marcar como Completada
              </Boton>
            )}
            {reserva?.estado !== 'cancelada' && reserva?.estado !== 'completada' && (
              <Boton onPress={() => setModalBaja(true)} loading={loading} fullWidth variant="destructive">
                Dar de Baja
              </Boton>
            )}
            {reserva?.estado === 'cancelada' && (
              <Boton onPress={() => setModalEliminar(true)} loading={loading} fullWidth variant="destructive">
                Eliminar Reserva
              </Boton>
            )}
          </View>
        </ScrollView>
      )}

      {/* Modal: confirmar reserva */}
      <ModalConfirmacion
        visible={modalConfirmar}
        titulo="Confirmar Reserva"
        mensaje="¿Estás seguro que querés confirmar esta reserva?"
        iconName="check-circle"
        iconColor={COLORES.exito}
        labelConfirmar="Confirmar"
        labelCancelar="Cancelar"
        loading={loading}
        onConfirmar={procederConfirmar}
        onCancelar={() => setModalConfirmar(false)}
      />

      {/* Modal: completar reserva */}
      <ModalConfirmacion
        visible={modalCompletar}
        titulo="Completar Reserva"
        mensaje="¿Marcar esta reserva como completada? El huésped finalizó su estadía."
        iconName="flag-checkered"
        iconColor={COLORES.primario}
        labelConfirmar="Completar"
        labelCancelar="Cancelar"
        loading={loading}
        onConfirmar={procederCompletar}
        onCancelar={() => setModalCompletar(false)}
      />

      {/* Modal: dar de baja */}
      <ModalConfirmacion
        visible={modalBaja}
        titulo="Dar de Baja Reserva"
        mensaje="La reserva será cancelada. Esta acción no se puede deshacer."
        iconName="alert-circle"
        iconColor={COLORES.error}
        labelConfirmar="Dar de Baja"
        labelCancelar="Cancelar"
        variant="destructive"
        loading={loading}
        onConfirmar={procederDarDeBaja}
        onCancelar={() => setModalBaja(false)}
      />

      <ModalConfirmacion
        visible={modalEliminar}
        titulo="Eliminar Reserva"
        mensaje="¿Estás seguro? Esta acción eliminará la reserva permanentemente."
        iconName="delete-alert"
        iconColor={COLORES.error}
        labelConfirmar="Eliminar"
        labelCancelar="Cancelar"
        variant="destructive"
        loading={loading}
        onConfirmar={procederEliminar}
        onCancelar={() => setModalEliminar(false)}
      />

      {/* Modal: feedback éxito/error */}
      {modalFeedback && (
        <ModalFeedback
          visible={!!modalFeedback}
          tipo={modalFeedback.tipo}
          titulo={modalFeedback.titulo}
          mensaje={modalFeedback.mensaje}
          onClose={modalFeedback.onClose}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  headerSection: { marginBottom: DIMENSIONES.padding * 1.5 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORES.fondoSecundario, marginBottom: DIMENSIONES.padding },
  statusDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  statusTexto: { fontWeight: TIPOGRAFIA.fontWeightBold, fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoOscuro },
  reservaId: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoMedio },
  section: { marginBottom: DIMENSIONES.padding * 1.5 },
  sectionTitle: { fontSize: TIPOGRAFIA.fontSizeMedium, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.textoOscuro, marginBottom: DIMENSIONES.padding },
  card: { backgroundColor: COLORES.fondoBlanco, borderRadius: DIMENSIONES.borderRadius, padding: DIMENSIONES.padding, borderWidth: 1, borderColor: COLORES.borde },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 12 },
  rowInfo: { flex: 1 },
  label: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoMedio, marginBottom: 2 },
  value: { fontSize: TIPOGRAFIA.fontSizeBase, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoOscuro },
  imagenHabitacion: { width: '100%', height: 180, borderRadius: DIMENSIONES.borderRadius, marginBottom: DIMENSIONES.padding },
  habitacionInfo: { flex: 1, justifyContent: 'space-between' },
  habitacionNumero: { fontSize: TIPOGRAFIA.fontSizeMedium, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.textoOscuro },
  habitacionTipo: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoMedio, marginTop: 4 },
  habitacionCapacidad: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.primario, fontWeight: TIPOGRAFIA.fontWeightSemiBold },
  diasEstancia: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORES.primario + '10', paddingHorizontal: 12, paddingVertical: 8, borderRadius: DIMENSIONES.borderRadius, marginTop: 8 },
  diasTexto: { fontSize: TIPOGRAFIA.fontSizeSmall, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.primario },
  precioCard: { backgroundColor: COLORES.fondoSecundario + '30' },
  row_precio: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  precioLabel: { fontSize: TIPOGRAFIA.fontSizeBase, color: COLORES.textoMedio },
  precioValor: { fontSize: TIPOGRAFIA.fontSizeLarge, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.primario },
  descuentoRow: { marginBottom: 0, marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORES.borde },
  descuentoValor: { fontSize: TIPOGRAFIA.fontSizeBase, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.exito },
  notasCard: { backgroundColor: COLORES.fondoSecundario + '20' },
  notasTexto: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoOscuro, lineHeight: 20 },
});

export default DetalleReservaAdminScreen;