// frontend/src/navegacion/EmpleadoNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DashboardEmpleadoScreen from '../pantallas/empleado/DashboardEmpleadoScreen';
import GestionReservasEmpleadoScreen from '../pantallas/empleado/GestionReservasEmpleadoScreen';
import GestionHabitacionesEmpleadoScreen from '../pantallas/empleado/GestionHabitacionesEmpleadoScreen';
import CheckInOutScreen from '../pantallas/empleado/CheckInOutScreen';
import DetalleReservaEmpleadoScreen from '../pantallas/empleado/DetalleReservaEmpleadoScreen';
import CrearReservaEmpleadoScreen from '../pantallas/empleado/CrearReservaEmpleadoScreen';
import PerfilEmpleadoScreen from '../pantallas/empleado/PerfilEmpleadoScreen';

const Stack = createStackNavigator();

const EmpleadoNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DashboardEmpleado" component={DashboardEmpleadoScreen} />
      <Stack.Screen name="GestionReservasEmpleado" component={GestionReservasEmpleadoScreen} />
      <Stack.Screen name="GestionHabitacionesEmpleado" component={GestionHabitacionesEmpleadoScreen} />
      <Stack.Screen name="CheckInOut" component={CheckInOutScreen} />
      <Stack.Screen name="DetalleReservaEmpleado" component={DetalleReservaEmpleadoScreen} />
      <Stack.Screen name="CrearReservaEmpleado" component={CrearReservaEmpleadoScreen} />
      <Stack.Screen name="PerfilEmpleado" component={PerfilEmpleadoScreen} />
    </Stack.Navigator>
  );
};

export default EmpleadoNavigator;
