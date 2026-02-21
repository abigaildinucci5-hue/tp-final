// src/navegacion/MainNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

// Pantallas
import HomeScreen from '../pantallas/home/HomeScreen';
import ListaHabitacionesScreen from '../pantallas/habitaciones/ListaHabitacionesScreen';
import DetalleHabitacionScreen from '../pantallas/habitaciones/DetalleHabitacionScreen';
import FavoritosScreen from '../pantallas/habitaciones/FavoritosScreen';
import MisReservasScreen from '../pantallas/reservas/MisReservasScreen';
import DetalleReservaScreen from '../pantallas/reservas/DetalleReservaScreen';
import NuevaReservaScreen from '../pantallas/reservas/NuevaReservaScreen';
import PerfilScreen from '../pantallas/perfil/PerfilScreen';
import NotificacionesScreen from '../pantallas/perfil/NotificacionesScreen';
import EditarPerfilScreen from '../pantallas/perfil/EditarPerfilScreen';
import ContactoScreen from '../pantallas/otros/ContactoScreen';
import MapaScreen from '../pantallas/otros/MapaScreen';

import { COLORES } from '../constantes/colores';
import { FUENTES } from '../constantes/estilos';

const Stack = createNativeStackNavigator();

// Stack de Home
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen 
      name="DetalleHabitacion" 
      component={DetalleHabitacionScreen}
      options={{
        animationEnabled: true,
      }}
    />
    <Stack.Screen 
      name="NuevaReserva" 
      component={NuevaReservaScreen}
      options={{
        animationEnabled: true,
      }}
    />
  </Stack.Navigator>
);

// Stack de Habitaciones
const HabitacionesStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="ListaHabitacionList" component={ListaHabitacionesScreen} />
    <Stack.Screen 
      name="DetalleHabitacion" 
      component={DetalleHabitacionScreen}
      options={{
        animationEnabled: true,
      }}
    />
    <Stack.Screen 
      name="NuevaReserva" 
      component={NuevaReservaScreen}
      options={{
        animationEnabled: true,
      }}
    />
  </Stack.Navigator>
);

// Stack de Reservas
const ReservasStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="MisReservasList" component={MisReservasScreen} />
    <Stack.Screen 
      name="DetalleReserva" 
      component={DetalleReservaScreen}
      options={{
        animationEnabled: true,
      }}
    />
  </Stack.Navigator>
);

// Stack de Perfil
const PerfilStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="PerfilMain" component={PerfilScreen} />
    <Stack.Screen 
      name="EditarPerfil" 
      component={EditarPerfilScreen}
      options={{
        animationEnabled: true,
      }}
    />
    <Stack.Screen 
      name="Notificaciones" 
      component={NotificacionesScreen}
      options={{
        animationEnabled: true,
      }}
    />
    <Stack.Screen 
      name="Favoritos" 
      component={FavoritosScreen}
      options={{
        animationEnabled: true,
      }}
    />
  </Stack.Navigator>
);

const MainNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="HomeTab" component={HomeStack} />
      <Stack.Screen name="HabitacionesTab" component={HabitacionesStack} />
      <Stack.Screen name="ReservasTab" component={ReservasStack} />
      <Stack.Screen name="PerfilTab" component={PerfilStack} />
      <Stack.Screen name="ContactoUnique" component={ContactoScreen} />
      <Stack.Screen name="MapaUnique" component={MapaScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;