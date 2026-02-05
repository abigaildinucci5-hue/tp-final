// frontend/src/pantallas/reservas/DetalleReservaScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ResumenReserva from '../../componentes/reservas/ResumenReserva';
import Boton from '../../componentes/comun/Boton';
import Loading from '../../componentes/comun/Loading';

const DetalleReservaScreen = ({ navigation, route }) => {
  const { id } = route.params;
  const { reservaSeleccionada, loading, cargarReservaPorId, cancelarReserva } = useReservas();

  useEffect(() => {
    cargarReservaPorId(id);
  }, [id]);

  const handleCancelar = () => {
    Alert.alert(
      'Cancelar Reserva',
      '¿Estás seguro que deseas cancelar esta reserva?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí, cancelar',
          style: 'destructive',
          onPress: async () => {
            const result = await cancelarReserva(id);
            if (result.success) {
              navigation.goBack();
            }
          },
        },
      ]
    );
  };

  if (loading || !reservaSeleccionada) {
    return <Loading />;
  }

  const puedeCancel = reservaSeleccionada.estado === 'pendiente' || 
                        reservaSeleccionada.estado === 'confirmada';

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Detalle de Reserva"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        variant="transparent"
      />

      <ScrollView style={estilos.scrollView}>
        <ResumenReserva
          habitacion={reservaSeleccionada.habitacion}
          fechaInicio={reservaSeleccionada.fecha_inicio}
          fechaFin={reservaSeleccionada.fecha_fin}
          cantidadPersonas={reservaSeleccionada.cantidad_personas}
          precioTotal={reservaSeleccionada.precio_total}
        />
      </ScrollView>

      {puedeCancel && (
        <View style={estilos.footer}>
          <Boton variant="danger" onPress={handleCancelar} fullWidth>
            Cancelar Reserva
          </Boton>
        </View>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default DetalleReservaScreen;