// frontend/src/pantallas/reservas/MisReservasScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import HistorialReservas from '../../componentes/reservas/HistorialReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';

const MisReservasScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const { misReservas, loading, cargarMisReservas } = useReservas();

  // Proteger acceso: redirigir si es invitado
  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });
    }
  }, [isAuthenticated, navigation]);

  useEffect(() => {
    cargarMisReservas();
  }, []);

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReserva', { id: reserva.id });
  };

  if (!isAuthenticated) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Mis Reservas"
        showNavigation={true}
        navigation={navigation}
        activeRoute="Reservas"
      />
        leftIcon="menu"
        onLeftPress={() => navigation.openDrawer?.()}
      />

      <HistorialReservas
        reservas={misReservas}
        loading={loading}
        onReservaPress={handleReservaPress}
        onRefresh={cargarMisReservas}
      />
    </View>
  );
};

export default MisReservasScreen;