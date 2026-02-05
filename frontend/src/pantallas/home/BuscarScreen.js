// frontend/src/pantallas/home/BuscarScreen.js
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import COLORES from '../../constantes/colores';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import FormularioReserva from '../../componentes/reservas/FormularioReserva';
import ListaHabitaciones from '../../componentes/habitaciones/ListaHabitaciones';
import HeaderApp from '../../componentes/comun/HeaderApp';

const BuscarScreen = ({ navigation }) => {
  const [fechaInicio, setFechaInicio] = useState(null);
  const [fechaFin, setFechaFin] = useState(null);
  const [cantidadPersonas, setCantidadPersonas] = useState(2);
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const { habitacionesDisponibles, loading, buscarDisponibles } = useHabitaciones();

  const handleBuscar = async () => {
    const result = await buscarDisponibles(fechaInicio, fechaFin, cantidadPersonas);
    if (result.success) {
      setMostrarResultados(true);
    }
  };

  const handleHabitacionPress = (habitacion) => {
    navigation.navigate('DetalleHabitacion', {
      id: habitacion.id,
      fechaInicio,
      fechaFin,
      cantidadPersonas,
    });
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Buscar Habitaciones"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      {!mostrarResultados ? (
        <FormularioReserva
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          cantidadPersonas={cantidadPersonas}
          onCambiarFechaInicio={() => {
            // Abrir modal de calendario
            navigation.navigate('SeleccionarFecha', {
              tipo: 'inicio',
              onSelect: setFechaInicio,
            });
          }}
          onCambiarFechaFin={() => {
            navigation.navigate('SeleccionarFecha', {
              tipo: 'fin',
              onSelect: setFechaFin,
            });
          }}
          onCambiarCantidadPersonas={setCantidadPersonas}
          onBuscar={handleBuscar}
          loading={loading}
        />
      ) : (
        <ListaHabitaciones
          habitaciones={habitacionesDisponibles}
          loading={loading}
          onHabitacionPress={handleHabitacionPress}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
});

export default BuscarScreen;