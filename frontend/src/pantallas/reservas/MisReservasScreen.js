import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import HistorialReservas from '../../componentes/reservas/HistorialReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Loading from '../../componentes/comun/Loading';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';

const MisReservasScreen = ({ navigation }) => {
  const { isAuthenticated, usuario } = useAuth();
  const { historial, loading, cargarHistorial } = useReservas();
  const [isLoadingHistorial, setIsLoadingHistorial] = useState(false);
  const isLoadingHistorialRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });
    }
  }, [isAuthenticated, navigation]);

  useFocusEffect(
    React.useCallback(() => {
      if (!isLoadingHistorialRef.current) {
        isLoadingHistorialRef.current = true;
        setIsLoadingHistorial(true);
        cargarHistorial().finally(() => {
          isLoadingHistorialRef.current = false;
          setIsLoadingHistorial(false);
        });
      }
    }, [cargarHistorial])
  );

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReserva', { id: reserva.id_reserva });
  };

  // Con el slice normalizado, historial ya tiene la forma correcta
  const activas   = historial?.activas   || [];
  const pasadas   = historial?.pasadas   || [];
  const canceladas = historial?.canceladas || [];

  // El cliente solo ve activas y pasadas, no las canceladas en la lista
  const todasLasReservas = [...activas, ...pasadas];
  const tieneCanceladas  = canceladas.length > 0;

  if (!isAuthenticated) return <Loading />;

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp title="Mis Reservas" variant="transparent" />

      {/* Banner de reserva cancelada */}
      {tieneCanceladas && (
        <View style={estilos.bannerCancelada}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#fff" />
          <Text style={estilos.bannerTexto}>
            {canceladas.length === 1
              ? 'Tu reserva fue cancelada. Por favor comunicate con el personal.'
              : `Tenés ${canceladas.length} reservas canceladas. Por favor comunicate con el personal.`}
          </Text>
        </View>
      )}

      <HistorialReservas
        reservas={todasLasReservas}
        loading={loading || isLoadingHistorial}
        onReservaPress={handleReservaPress}
        onRefresh={() => {
          if (!isLoadingHistorialRef.current) {
            isLoadingHistorialRef.current = true;
            setIsLoadingHistorial(true);
            cargarHistorial().finally(() => {
              isLoadingHistorialRef.current = false;
              setIsLoadingHistorial(false);
            });
          }
        }}
        refreshing={loading || isLoadingHistorial}
        userRole={usuario?.rol || 'cliente'}
      />
    </View>
  );
};

const estilos = StyleSheet.create({
  bannerCancelada: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E53935',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 10,
  },
  bannerTexto: {
    flex: 1,
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});

export default MisReservasScreen;