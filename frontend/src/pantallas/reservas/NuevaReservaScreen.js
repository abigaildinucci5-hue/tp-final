// frontend/src/pantallas/reservas/NuevaReservaScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ResumenReserva from '../../componentes/reservas/ResumenReserva';
import Boton from '../../componentes/comun/Boton';
import Loading from '../../componentes/comun/Loading';
import ErrorMensaje from '../../componentes/comun/ErrorMensaje';

const NuevaReservaScreen = ({ navigation, route }) => {
  const { isAuthenticated } = useAuth();
  const { habitacion, fechaInicio, fechaFin, cantidadPersonas } = route.params;
  const { calcularPrecioReserva, loading } = useReservas();
  
  const [precioTotal, setPrecioTotal] = useState(0);
  const [error, setError] = useState(null);

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
    calcularPrecio();
  }, []);

  const calcularPrecio = async () => {
    const result = await calcularPrecioReserva(
      habitacion.id,
      fechaInicio,
      fechaFin,
      cantidadPersonas
    );
    
    if (result.success) {
      setPrecioTotal(result.data.precio_total);
    } else {
      setError(result.error);
    }
  };

  const handleContinuar = () => {
    navigation.navigate('ConfirmarReserva', {
      habitacion,
      fechaInicio,
      fechaFin,
      cantidadPersonas,
      precioTotal,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Nueva Reserva"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        variant="transparent"
      />

      <ScrollView style={estilos.scrollView}>
        <ResumenReserva
          habitacion={habitacion}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          cantidadPersonas={cantidadPersonas}
          precioTotal={precioTotal}
        />

        {error && (
          <View style={estilos.errorContainer}>
            <ErrorMensaje mensaje={error} tipo="error" />
          </View>
        )}
      </ScrollView>

      <View style={estilos.footer}>
        <Boton onPress={handleContinuar} fullWidth disabled={!precioTotal || error}>
          Continuar
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  errorContainer: {
    padding: DIMENSIONES.padding,
  },
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default NuevaReservaScreen;