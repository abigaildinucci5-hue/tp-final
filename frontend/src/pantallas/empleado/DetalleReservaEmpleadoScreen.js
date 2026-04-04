import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View, StyleSheet, ScrollView, Text,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { formatearFecha } from '../../utils/dateFormatter';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';
import {
  confirmarReserva,
  completarReserva,
  cancelarReservaEmpleado,
  obtenerReserva,
} from '../../servicios/reservasService';

const DetalleReservaEmpleadoScreen = ({ navigation, route }) => {
  const { usuario, logout } = useAuth();
  const initialReserva = route.params?.reserva || {};

  const [reserva, setReserva] = useState(initialReserva);
  const [estado, setEstado] = useState(initialReserva?.estado || 'pendiente');
  const [cargando, setCargando] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [accionPendiente, setAccionPendiente] = useState(null);

  const cargarReserva = useCallback(async () => {
    if (!initialReserva?.id_reserva) return;
    try {
      const datos = await obtenerReserva(initialReserva.id_reserva);
      if (datos) {
        setReserva(datos);
        setEstado(datos.estado);
      }
    } catch (error) {
      console.error('❌ Error al refrescar datos:', error);
    }
  }, [initialReserva?.id_reserva]);

  useFocusEffect(useCallback(() => { cargarReserva(); }, [cargarReserva]));

  const ejecutarCambioEstado = async () => {
    if (!accionPendiente) return;
    setCargando(true);
    setModalVisible(false);
    try {
      if (accionPendiente.estado === 'confirmada') await confirmarReserva(reserva.id_reserva);
      else if (accionPendiente.estado === 'completada') await completarReserva(reserva.id_reserva);
      else if (accionPendiente.estado === 'cancelada') await cancelarReservaEmpleado(reserva.id_reserva);

      setEstado(accionPendiente.estado);
      setReserva(prev => ({ ...prev, estado: accionPendiente.estado }));
      setAccionPendiente(null);
    } catch (error) {
      const msgError = error?.message || 'Error de conexión.';
      console.error('❌ Error API:', error);
      setAccionPendiente({
        esError: true,
        titulo: 'Error',
        mensaje: msgError,
      });
      setModalVisible(true);
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarEstado = (nuevoEstado) => {
    if (estado === nuevoEstado || cargando) return;

    const config = {
      confirmada: {
        estado: 'confirmada',
        titulo: 'Confirmar Reserva',
        mensaje: '¿Deseas confirmar esta reserva?',
        icono: 'check-circle',
        color: COLORES.exito,
      },
      completada: {
        estado: 'completada',
        titulo: 'Completar Reserva',
        mensaje: '¿Marcar como completada? El huésped finalizó su estadía.',
        icono: 'flag-checkered',
        color: COLORES.primario,
      },
      cancelada: {
        estado: 'cancelada',
        titulo: 'Dar de Baja',
        mensaje: '¿Seguro que deseas dar de baja esta reserva? Esta acción no se puede deshacer.',
        icono: 'alert-circle',
        color: COLORES.error,
      },
    };

    setAccionPendiente(config[nuevoEstado]);
    setModalVisible(true);
  };

  const getEstadoColor = (est) => {
    switch (est) {
      case 'pendiente':  return COLORES.advertencia;
      case 'confirmada': return COLORES.exito;
      case 'cancelada':  return COLORES.error;
      case 'completada': return COLORES.primario;
      default:           return COLORES.textoMedio;
    }
  };

  // ✅ FIX: solo mostrar transiciones válidas según el estado actual
  // - pendiente  → puede confirmar o cancelar
  // - confirmada → puede completar o cancelar
  // - completada / cancelada → sin acciones
  const accionesValidas = (() => {
    switch (estado) {
      case 'pendiente':  return ['confirmada', 'cancelada'];
      case 'confirmada': return ['completada', 'cancelada'];
      default:           return [];
    }
  })();

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado
        usuario={usuario}
        onLogout={async () => await logout()}
        navigation={navigation}
      />

      <ScrollView style={estilos.scroll} contentContainerStyle={estilos.content}>
        <TouchableOpacity style={estilos.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORES.primario} />
          <Text style={estilos.backText}>Volver a Gestión</Text>
        </TouchableOpacity>

        {/* Huésped */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Datos del Huésped</Text>
          <View style={estilos.card}>
            <InfoRow icon="account" label="Nombre" value={`${reserva?.nombre_usuario || ''} ${reserva?.apellido_usuario || ''}`} />
            <InfoRow icon="email" label="Email" value={reserva?.email_usuario || 'No especificado'} />
            <InfoRow icon="phone" label="Teléfono" value={reserva?.telefono_usuario || 'No especificado'} isLast />
          </View>
        </View>

        {/* Estancia */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Resumen de Estancia</Text>
          <View style={estilos.card}>
            <InfoRow icon="bed" label="Habitación" value={`N° ${reserva?.numero_habitacion || '?'} (${reserva?.tipo_habitacion || 'N/A'})`} />
            <InfoRow icon="calendar-check" label="Entrada" value={formatearFecha(reserva?.fecha_entrada)} />
            <InfoRow icon="calendar-remove" label="Salida" value={formatearFecha(reserva?.fecha_salida)} />
            <InfoRow icon="cash-multiple" label="Precio Total" value={`$${reserva?.precio_total || 0}`} color={COLORES.primario} isLast />
          </View>
        </View>

        {/* Estado y acciones */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Estado Actual</Text>
          <View style={[estilos.statusContainer, { backgroundColor: getEstadoColor(estado) + '15' }]}>
            <Text style={[estilos.statusLabel, { color: getEstadoColor(estado) }]}>
              {estado.toUpperCase()}
            </Text>
          </View>

          {/* ✅ FIX: solo renderiza botones de transiciones válidas */}
          {accionesValidas.length > 0 && (
            <View style={estilos.btnGrid}>
              {accionesValidas.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={[
                    estilos.actionBtn,
                    { borderColor: getEstadoColor(item) },
                    estado === item && { backgroundColor: getEstadoColor(item) },
                    (cargando || estado === item) && { opacity: 0.6 },
                  ]}
                  onPress={() => handleCambiarEstado(item)}
                  disabled={cargando || estado === item}
                >
                  {cargando && accionPendiente?.estado === item ? (
                    <ActivityIndicator size="small" color={estado === item ? '#FFF' : getEstadoColor(item)} />
                  ) : (
                    <Text style={[
                      estilos.btnText,
                      { color: getEstadoColor(item) },
                      estado === item && { color: '#FFF' },
                    ]}>
                      {item === 'confirmada' ? 'Confirmar' : item === 'completada' ? 'Completar' : 'Baja'}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Mensaje cuando no hay acciones disponibles */}
          {accionesValidas.length === 0 && (
            <View style={estilos.sinAcciones}>
              <MaterialCommunityIcons name="information" size={18} color={COLORES.textoMedio} />
              <Text style={estilos.sinAccionesTexto}>
                Esta reserva no admite más cambios de estado
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de confirmación / error — sin cambios */}
      {accionPendiente && (
        <ModalConfirmacion
          visible={modalVisible}
          titulo={accionPendiente.titulo}
          mensaje={accionPendiente.mensaje}
          iconName={accionPendiente.icono || 'alert-circle'}
          iconColor={accionPendiente.color || COLORES.advertencia}
          labelConfirmar={accionPendiente.esError ? 'Cerrar' : (accionPendiente.estado === 'cancelada' ? 'Dar de Baja' : accionPendiente.estado === 'completada' ? 'Completar' : 'Confirmar')}
          labelCancelar="Cancelar"
          variant={accionPendiente.estado === 'cancelada' ? 'destructive' : 'default'}
          loading={cargando}
          onConfirmar={accionPendiente.esError ? () => { setModalVisible(false); setAccionPendiente(null); } : ejecutarCambioEstado}
          onCancelar={() => { setModalVisible(false); setAccionPendiente(null); }}
        />
      )}
    </View>
  );
};

const InfoRow = ({ icon, label, value, color, isLast }) => (
  <View style={[estilos.row, !isLast && estilos.borderBottom]}>
    <MaterialCommunityIcons name={icon} size={20} color={color || COLORES.textoMedio} />
    <View style={estilos.rowTxtContainer}>
      <Text style={estilos.label}>{label}</Text>
      <Text style={[estilos.value, color && { color, fontWeight: 'bold' }]}>{value}</Text>
    </View>
  </View>
);

const estilos = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#F8F9FA' },
  content: { padding: 20, paddingBottom: 50 },
  backBtn: { flexDirection: 'row', alignItems: 'center', marginBottom: 25, gap: 5 },
  backText: { fontSize: 16, fontWeight: 'bold', color: COLORES.primario },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: COLORES.textoOscuro, marginBottom: 15 },
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: 16,
    borderWidth: 1, borderColor: '#EEE',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 5,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 15, paddingVertical: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  rowTxtContainer: { flex: 1 },
  label: { fontSize: 10, color: '#999', textTransform: 'uppercase', marginBottom: 2 },
  value: { fontSize: 15, color: '#333', fontWeight: '500' },
  statusContainer: {
    paddingVertical: 20, borderRadius: 15, alignItems: 'center',
    borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(0,0,0,0.1)', marginBottom: 20,
  },
  statusLabel: { fontSize: 24, fontWeight: '900', letterSpacing: 1.5 },
  btnGrid: { flexDirection: 'row', gap: 10 },
  actionBtn: {
    flex: 1, height: 48, borderRadius: 12, borderWidth: 2,
    justifyContent: 'center', alignItems: 'center',
  },
  btnText: { fontSize: 12, fontWeight: 'bold' },
  sinAcciones: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORES.borde + '40',
    borderRadius: 10,
  },
  sinAccionesTexto: {
    fontSize: 13,
    color: COLORES.textoMedio,
    fontStyle: 'italic',
  },
});

export default DetalleReservaEmpleadoScreen;