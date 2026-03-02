// frontend/src/pantallas/reservas/MisReservasScreen.js

import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { COLORES } from '../../constantes/colores';

// 🔥 IMPORTANTE: ajustá la ruta si hace falta
import HistorialReservas from '../../componentes/reservas/HistorialReservas';

const MisReservasScreen = ({ navigation }) => {
  const { isAuthenticated } = useAuth();
  const { requireAuth } = useRequireAuth();
  const { reservas, loading, cargarReservas } = useReservas();

  useEffect(() => {
    if (isAuthenticated) {
      cargarReservas();
    }
  }, [isAuthenticated]);

  const handleReservaPress = (reserva) => {
    navigation.navigate('DetalleReserva', { id: reserva.id_reserva || reserva.id });
  };

  // 🔐 Si no está logueado
  if (!isAuthenticated) {
    return (
      <View
        style={[
          ESTILOS_GLOBALES.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: COLORES.NEGRO,
            marginBottom: 20,
            textAlign: 'center',
          }}
        >
          Mis Reservas
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: COLORES.grisTexto,
            marginBottom: 30,
            textAlign: 'center',
            paddingHorizontal: 20,
          }}
        >
          Inicia sesión para ver tus reservas
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: COLORES.SECUNDARIO,
            paddingHorizontal: 30,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={requireAuth}
        >
          <Text
            style={{
              color: COLORES.PRIMARIO,
              fontWeight: '600',
              fontSize: 14,
            }}
          >
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 👇 Si está autenticado
  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HistorialReservas
        reservas={reservas || []}
        loading={loading}
        onReservaPress={handleReservaPress}
        onRefresh={() => cargarReservas()}
      />
    </View>
  );
};

export default MisReservasScreen;