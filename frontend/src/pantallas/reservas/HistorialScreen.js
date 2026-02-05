// frontend/src/pantallas/reservas/HistorialScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import HistorialReservas from '../../componentes/reservas/HistorialReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';

const HistorialScreen = ({ navigation }) => {
  const { misReservas, loading, cargarMisReservas } = useReservas();

  useEffect(() => {
    cargarMisReservas({ incluir_completadas: true, incluir_canceladas: true });
  }, []);

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReserva', { id: reserva.id });
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Historial de Reservas"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <HistorialReservas
        reservas={misReservas}
        loading={loading}
        onReservaPress={handleReservaPress}
        onRefresh={() => cargarMisReservas({ incluir_completadas: true, incluir_canceladas: true })}
      />
    </View>
  );
};

export default HistorialScreen;