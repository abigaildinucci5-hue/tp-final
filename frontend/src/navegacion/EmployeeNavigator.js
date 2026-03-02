// frontend/src/navegacion/EmployeeNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PanelRecepcionistaScreen from '../pantallas/empleado/PanelRecepcionistaScreen';
import DetalleReservaScreen from '../pantallas/reservas/DetalleReservaScreen';
import DetalleHabitacionScreen from '../pantallas/habitaciones/DetalleHabitacionScreen';

const Stack = createNativeStackNavigator();

/**
 * EmployeeNavigator - Navegación para empleados/recepcionistas
 * Muestra el panel de recepcionista como pantalla principal
 */
const EmployeeNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen 
        name="PanelRecepcionista" 
        component={PanelRecepcionistaScreen}
        options={{
          animationEnabled: false,
        }}
      />
      <Stack.Screen 
        name="DetalleReserva"
        component={DetalleReservaScreen}
        options={{
          animationEnabled: true,
        }}
      />
      <Stack.Screen 
        name="DetalleHabitacion"
        component={DetalleHabitacionScreen}
        options={{
          animationEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
};

export default EmployeeNavigator;
