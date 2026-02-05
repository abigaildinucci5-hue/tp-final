// frontend/src/pantallas/admin/GestionHabitacionesScreen.js
import React, { useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ListaHabitaciones from '../../componentes/habitaciones/ListaHabitaciones';
import Boton from '../../componentes/comun/Boton';
import { DIMENSIONES } from '../../constantes/estilos';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GestionHabitacionesScreen = ({ navigation }) => {
  const { habitaciones, loading, cargarHabitaciones } = useHabitaciones();

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleEditarHabitacion = (habitacion) => {
    navigation.navigate('EditarHabitacion', { habitacion });
  };

  const handleEliminarHabitacion = (habitacion) => {
    Alert.alert(
      'Eliminar Habitación',
      `¿Estás seguro que deseas eliminar "${habitacion.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            // Implementar eliminación
          },
        },
      ]
    );
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Gestión de Habitaciones"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ListaHabitaciones
        habitaciones={habitaciones}
        loading={loading}
        onHabitacionPress={handleEditarHabitacion}
        onRefresh={cargarHabitaciones}
      />

      <View style={estilos.footer}>
        <Boton
          onPress={() => navigation.navigate('CrearHabitacion')}
          icon={<MaterialCommunityIcons name="plus" size={20} color={COLORES.textoBlanco} />}
          fullWidth
        >
          Nueva Habitación
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default GestionHabitacionesScreen;