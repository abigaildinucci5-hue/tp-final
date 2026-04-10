// frontend/src/pantallas/empleado/GestionReservasEmpleadoScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { formatearFecha } from '../../utils/dateFormatter';
import { useFocusEffect } from '@react-navigation/native';
import reservasService from '../../servicios/reservasService';

const GestionReservasEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { reservas, loading, cargarReservas } = useReservas();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useFocusEffect(
  React.useCallback(() => {
    cargarReservas();
  }, [cargarReservas, filtroEstado])
);

  useEffect(() => {
    // Filtrar reservas según estado
    if (filtroEstado === 'todas') {
      setReservasFiltradas(reservas);
    } else {
      setReservasFiltradas(
        reservas.filter((r) => r.estado === filtroEstado)
      );
    }
  }, [reservas, filtroEstado]);

  const handleLogout = async () => {
    await logout();
  };

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReservaEmpleado', { reserva });
  };

  const handleEliminarReserva = async () => {
    setShowConfirmModal(false);
    setEliminando(true);
    try {
      await reservasService.eliminarReserva(reservaAEliminar.id_reserva);
      Alert.alert('Éxito', 'Reserva eliminada correctamente');
      setReservasFiltradas((prev) =>
        prev.filter((r) => r.id_reserva !== reservaAEliminar.id_reserva)
      );
      setReservaAEliminar(null);
    } catch (error) {
      Alert.alert('Error', error?.message || 'No se pudo eliminar la reserva');
    } finally {
      setEliminando(false);
    }
  };

  const abrirModalEliminar = (reserva) => {
    setReservaAEliminar(reserva);
    setShowConfirmModal(true);
  };

  const renderReserva = ({ item }) => (
    <View style={estilos.reservaCardContainer}>
      <TouchableOpacity
        style={estilos.reservaCard}
        onPress={() => handleReservaPress(item)}
        activeOpacity={0.7}
      >
        {/* Header con cliente y estado */}
        <View style={estilos.reservaHeader}>
          <View>
            <Text style={estilos.clienteNombre}>{`${item.nombre_usuario || ''} ${item.apellido_usuario || ''}`.trim() || 'Cliente'}</Text>
            <Text style={estilos.clienteEmail}>{item.email_usuario || 'N/A'}</Text>
          </View>
          <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(item.estado) + '20' }]}>
            <Text style={[estilos.estadoText, { color: getEstadoColor(item.estado) }]}>
              {item.estado?.toUpperCase() || 'PENDIENTE'}
            </Text>
          </View>
        </View>

        {/* Detalles de reserva */}
        <View style={estilos.reservaDetalles}>
          <View style={estilos.detalleRow}>
            <MaterialCommunityIcons name="bed" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>
              Hab. {item.numero_habitacion || 'N/A'} - {item.tipo_habitacion || 'Estándar'}
            </Text>
          </View>

          <View style={estilos.detalleRow}>
            <MaterialCommunityIcons name="calendar" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>
              {formatearFecha(item.fecha_entrada)} a {formatearFecha(item.fecha_salida)}
            </Text>
          </View>

          <View style={estilos.detalleRow}>
            <MaterialCommunityIcons name="account-circle" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>
              Huéspedes: {item.cantidad_huespedes || 1}
            </Text>
          </View>

          <View style={estilos.detalleRow}>
            <MaterialCommunityIcons name="clock" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>
              Reservado: {formatearFecha(item.fecha_creacion)}
            </Text>
          </View>

          <View style={[estilos.detalleRow, { marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: COLORES.borde }]}>
            <MaterialCommunityIcons name="cash" size={16} color={COLORES.primario} />
            <Text style={[estilos.detalleTexto, { fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.primario }]}>
              ${item.precio_total || 0}
            </Text>
          </View>
        </View>

        {/* Botón eliminar - esquina inferior derecha */}
        <TouchableOpacity
          style={estilos.btnEliminarReserva}
          onPress={() => abrirModalEliminar(item)}
        >
          <MaterialCommunityIcons
            name="delete"
            size={20}
            color={COLORES.error}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return COLORES.advertencia;
      case 'confirmada':
        return COLORES.exito;
      case 'cancelada':
        return COLORES.error;
      case 'completada':
        return COLORES.primario;
      default:
        return COLORES.textoMedio;
    }
  };

  const estados = ['todas', 'pendiente', 'confirmada', 'cancelada', 'completada'];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <View style={{ flex: 1 }}>
        <FlatList
          data={reservasFiltradas}
          renderItem={renderReserva}
          keyExtractor={(item) => item.id_reserva?.toString() || Math.random().toString()}
          contentContainerStyle={estilos.listContent}
          onRefresh={() => cargarReservas()}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* Hero Section */}
              <View style={estilos.heroSection}>
                <View>
                  <Text style={estilos.heroTitulo}>Gestión de Reservas</Text>
                  <Text style={estilos.heroSubtitulo}>
                    Visualiza y administra todas las reservas
                  </Text>
                </View>
                <View style={estilos.countBadge}>
                  <Text style={estilos.countText}>{reservasFiltradas.length}</Text>
                </View>
              </View>

              {/* Filtros en línea */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={estilos.filtrosContainer}
              >
                {estados.map((estado) => (
                  <TouchableOpacity
                    key={estado}
                    style={[
                      estilos.filtroBtn,
                      filtroEstado === estado && estilos.filtroBtnActivo,
                    ]}
                    onPress={() => setFiltroEstado(estado)}
                  >
                    <Text
                      style={[
                        estilos.filtroBtnTexto,
                        filtroEstado === estado && estilos.filtroBtnTextoActivo,
                      ]}
                    >
                      {estado.charAt(0).toUpperCase() + estado.slice(1)}
                    </Text>
                    {filtroEstado === estado && (
                      <View
                        style={[
                          estilos.filtroBtnDot,
                          { backgroundColor: getEstadoColor(estado) },
                        ]}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Botón crear reserva */}
              <TouchableOpacity
                style={estilos.crearBtn}
                onPress={() => navigation.navigate('CrearReservaEmpleado')}
              >
                <MaterialCommunityIcons name="plus" size={20} color={COLORES.textoBlanco} />
                <Text style={estilos.crearBtnText}>Crear Nueva Reserva</Text>
              </TouchableOpacity>
            </>
          }
          ListEmptyComponent={
            <View style={estilos.emptyContainer}>
              <MaterialCommunityIcons
                name="calendar-blank"
                size={48}
                color={COLORES.textoMedio}
              />
              <Text style={estilos.emptyText}>
                No hay reservas{filtroEstado !== 'todas' ? ` ${filtroEstado}` : ''}
              </Text>
              <Text style={estilos.emptySubtext}>
                Las reservas aparecerán aquí
              </Text>
            </View>
          }
        />
      </View>

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

            {reservaAEliminar && (
              <Text style={estilos.reservaInfo}>
                Habitación {reservaAEliminar.numero_habitacion} • {formatearFecha(reservaAEliminar.fecha_entrada)}
              </Text>
            )}

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
                onPress={handleEliminarReserva}
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
    </View>
  );
};

const estilos = StyleSheet.create({
  listContent: {
    padding: DIMENSIONES.padding,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: DIMENSIONES.padding,
    marginHorizontal: 0,
    marginBottom: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  heroSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  countBadge: {
    backgroundColor: COLORES.primario + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center',
  },
  countText: {
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    fontSize: TIPOGRAFIA.fontSizeDisplay,
  },
  filtrosContainer: {
    paddingVertical: DIMENSIONES.padding,
    paddingHorizontal: 0,
    gap: 8,
    marginBottom: DIMENSIONES.padding,
  },
  filtroBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: 20,
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  filtroBtnActivo: {
    backgroundColor: COLORES.primario + '15',
    borderColor: COLORES.primario,
  },
  filtroBtnTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  filtroBtnTextoActivo: {
    color: COLORES.primario,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  filtroBtnDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  crearBtn: {
    backgroundColor: COLORES.exito,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding,
  },
  crearBtnText: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    fontSize: TIPOGRAFIA.fontSizeBase,
  },
  reservaCard: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: DIMENSIONES.padding,
    marginBottom: 12,
    position: 'relative',
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  clienteNombre: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  clienteEmail: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  estadoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  reservaDetalles: {
    gap: 8,
  },
  detalleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detalleTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoOscuro,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },

  // Estilos para el botón eliminar
  reservaCardContainer: {
    position: 'relative',
    marginBottom: DIMENSIONES.margin,
  },
  btnEliminarReserva: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
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

export default GestionReservasEmpleadoScreen;
