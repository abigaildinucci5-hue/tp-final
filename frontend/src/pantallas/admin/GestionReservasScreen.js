// frontend/src/pantallas/admin/GestionReservasScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import HistorialReservas from '../../componentes/reservas/HistorialReservas';

const GestionReservasScreen = ({ navigation }) => {
  const { reservas, loading, cargarReservas } = useReservas();
  const [filtroEstado, setFiltroEstado] = useState('todas');

  useEffect(() => {
    cargarTodasReservas();
  }, [filtroEstado]);

  const cargarTodasReservas = async () => {
    const params = filtroEstado !== 'todas' ? { estado: filtroEstado } : {};
    await cargarReservas(params);
  };

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReservaAdmin', { reserva });
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Gestión de Reservas"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        rightIcon="filter"
        onRightPress={() => {
          // Abrir modal de filtros
        }}
      />

      <HistorialReservas
        reservas={reservas}
        loading={loading}
        onReservaPress={handleReservaPress}
        onRefresh={cargarTodasReservas}
      />
    </View>
  );
};

export default GestionReservasScreen;