// frontend/src/pantallas/admin/GestionReservasScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Modal, Alert } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import AdminDropdownMenu from '../../componentes/admin/AdminDropdownMenu';
import HistorialReservas from '../../componentes/reservas/HistorialReservas';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { useFocusEffect } from '@react-navigation/native';

const GestionReservasScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { reservas, loading, cargarReservas } = useReservas();
  const [filtroEstado, setFiltroEstado] = useState('todas');
  const [showFiltroModal, setShowFiltroModal] = useState(false);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);

 useFocusEffect(
  React.useCallback(() => {
    cargarTodasReservas();
  }, [filtroEstado])
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

  const cargarTodasReservas = async () => {
    const params = filtroEstado !== 'todas' ? { estado: filtroEstado } : {};
    await cargarReservas(params);
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReservaAdmin', { reserva });
  };

  const handleEliminarReserva = async (idReserva) => {
    // Eliminar la reserva del estado local
    setReservasFiltradas((prev) => 
      prev.filter((r) => r.id_reserva !== idReserva)
    );
  };

  const estados = [
    { id: 'todas', label: 'Todas', color: COLORES.textoMedio },
    { id: 'pendiente', label: 'Pendientes', color: COLORES.advertencia },
    { id: 'confirmada', label: 'Confirmadas', color: COLORES.exito },
    { id: 'cancelada', label: 'Canceladas', color: COLORES.error },
  ];

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <AdminDropdownMenu usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      {/* Lista de Reservas - FlatList toma todo el espacio */}
      <View style={{ flex: 1 }}>
        <HistorialReservas
          reservas={reservasFiltradas}
          loading={loading}
          onReservaPress={handleReservaPress}
          onRefresh={cargarTodasReservas}
          refreshing={loading}
          userRole={usuario?.rol || 'empleado'}
          onEliminarReserva={handleEliminarReserva}
          ListHeaderComponent={
          <>
            {/* Hero Section dentro del FlatList */}
            <View style={estilos.heroSection}>
              <View>
                <Text style={estilos.heroTitulo}>Mis Reservas</Text>
                <Text style={estilos.heroSubtitulo}>
                  Administra todas las reservas del hotel
                </Text>
              </View>
              <View style={estilos.countBadge}>
                <Text style={estilos.countText}>{reservasFiltradas.length}</Text>
              </View>
            </View>

            {/* Filtros en línea dentro del FlatList */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={estilos.filtrosContainer}
            >
              {estados.map((estado) => (
                <TouchableOpacity
                  key={estado.id}
                  style={[
                    estilos.filtroBtn,
                    filtroEstado === estado.id && estilos.filtroBtnActivo,
                  ]}
                  onPress={() => setFiltroEstado(estado.id)}
                >
                  <Text
                    style={[
                      estilos.filtroBtnTexto,
                      filtroEstado === estado.id && estilos.filtroBtnTextoActivo,
                    ]}
                  >
                    {estado.label}
                  </Text>
                  {filtroEstado === estado.id && (
                    <View
                      style={[
                        estilos.filtroBtnDot,
                        { backgroundColor: estado.color },
                      ]}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
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
              {filtroEstado === 'todas'
                ? 'No hay reservas'
                : `No hay reservas ${estados.find(e => e.id === filtroEstado)?.label.toLowerCase() || filtroEstado} aún`}
            </Text>
            <Text style={estilos.emptySubtext}>
              Las nuevas reservas aparecerán aquí
            </Text>
          </View>
        }
      />
      </View>

      {/* Modal de Filtros */}
      <Modal
        visible={showFiltroModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFiltroModal(false)}
      >
        <View style={estilos.modalContainer}>
          <View style={estilos.modalContent}>
            <View style={estilos.modalHeader}>
              <Text style={estilos.modalTitle}>Opciones de Filtro</Text>
              <TouchableOpacity
                onPress={() => setShowFiltroModal(false)}
              >
                <MaterialCommunityIcons
                  name="close"
                  size={24}
                  color={COLORES.textoOscuro}
                />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={estilos.modalBody}>
              <Text style={estilos.modalLabel}>Por Estado</Text>
              {estados.map((estado) => (
                <TouchableOpacity
                  key={estado.id}
                  style={[
                    estilos.modalOption,
                    filtroEstado === estado.id && estilos.modalOptionActivo,
                  ]}
                  onPress={() => {
                    setFiltroEstado(estado.id);
                    setShowFiltroModal(false);
                  }}
                >
                  <View
                    style={[
                      estilos.optionRadio,
                      filtroEstado === estado.id && estilos.optionRadioActivo,
                    ]}
                  >
                    {filtroEstado === estado.id && (
                      <View style={estilos.optionRadioDot} />
                    )}
                  </View>
                  <Text style={estilos.modalOptionTexto}>{estado.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: DIMENSIONES.padding,
    marginHorizontal: DIMENSIONES.padding,
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
    paddingHorizontal: DIMENSIONES.padding,
    gap: 8,
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
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoMedio,
  },
  filtroBtnTextoActivo: {
    color: COLORES.primario,
  },
  filtroBtnDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORES.fondoBlanco,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: DIMENSIONES.padding,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  modalTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  modalBody: {
    padding: DIMENSIONES.padding,
  },
  modalLabel: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: DIMENSIONES.padding,
    gap: 12,
  },
  modalOptionActivo: {
    backgroundColor: COLORES.primario + '10',
    paddingHorizontal: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORES.primario,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
  },
  optionRadioActivo: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario + '10',
  },
  optionRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORES.primario,
  },
  modalOptionTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
    marginTop: 40,
  },
  emptyText: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtext: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  listaContainer: {
    flex: 1,
  },
});

export default GestionReservasScreen;