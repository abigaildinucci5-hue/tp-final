// frontend/src/navegacion/AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardScreen from '../pantallas/admin/DashboardScreen';
import GestionHabitacionesScreen from '../pantallas/admin/GestionHabitacionesScreen';
import GestionReservasScreen from '../pantallas/admin/GestionReservasScreen';
import GestionUsuariosScreen from '../pantallas/admin/GestionUsuariosScreen';
import EstadisticasScreen from '../pantallas/admin/EstadisticasScreen';
import CrearHabitacionScreen from '../pantallas/admin/CrearHabitacionScreen';
import EditarHabitacionScreen from '../pantallas/admin/EditarHabitacionScreen';
import DetalleReservaAdminScreen from '../pantallas/admin/DetalleReservaAdminScreen';
import DetalleUsuarioScreen from '../pantallas/admin/DetalleUsuarioScreen';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="GestionHabitaciones" component={GestionHabitacionesScreen} />
      <Stack.Screen name="GestionReservas" component={GestionReservasScreen} />
      <Stack.Screen name="GestionUsuarios" component={GestionUsuariosScreen} />
      <Stack.Screen name="Estadisticas" component={EstadisticasScreen} />
      <Stack.Screen name="CrearHabitacion" component={CrearHabitacionScreen} />
      <Stack.Screen name="EditarHabitacion" component={EditarHabitacionScreen} />
      <Stack.Screen name="DetalleReservaAdmin" component={DetalleReservaAdminScreen} />
      <Stack.Screen name="DetalleUsuario" component={DetalleUsuarioScreen} />
    </Stack.Navigator>
  );
};

export default AdminNavigator;