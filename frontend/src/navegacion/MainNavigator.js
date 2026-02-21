// src/navegacion/MainNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { selectCantidadNoLeidas } from '../redux/slices/notificacionesSlice';
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

// Configuración común para botones de back
const backButtonConfig = (navigation) => ({
  headerShown: false,
  headerLeft: () => (
    <TouchableOpacity
      onPress={() => navigation?.goBack()}
      style={{ paddingHorizontal: 16 }}
    >
      <MaterialCommunityIcons name="chevron-left" size={28} color={COLORES.PRIMARIO} />
    </TouchableOpacity>
  ),
});

// Stack de Home
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen 
      name="DetalleHabitacion" 
      component={DetalleHabitacionScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
    <Stack.Screen 
      name="NuevaReserva" 
      component={NuevaReservaScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
  </Stack.Navigator>
);

// Stack de Habitaciones
const HabitacionesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ListaHabitaciones" component={ListaHabitacionesScreen} />
    <Stack.Screen 
      name="DetalleHabitacion" 
      component={DetalleHabitacionScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
    <Stack.Screen 
      name="NuevaReserva" 
      component={NuevaReservaScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
  </Stack.Navigator>
);

// Stack de Reservas
const ReservasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MisReservas" component={MisReservasScreen} />
    <Stack.Screen 
      name="DetalleReserva" 
      component={DetalleReservaScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
  </Stack.Navigator>
);

// Stack de Perfil
const PerfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerfilMain" component={PerfilScreen} />
    <Stack.Screen 
      name="EditarPerfil" 
      component={EditarPerfilScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
    <Stack.Screen 
      name="Notificaciones" 
      component={NotificacionesScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
    <Stack.Screen 
      name="Favoritos" 
      component={FavoritosScreen}
      options={({ navigation }) => backButtonConfig(navigation)}
    />
  </Stack.Navigator>
);

// Stack de Contacto
const ContactoStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ContactoMain" component={ContactoScreen} />
  </Stack.Navigator>
);

// Stack de Mapa
const MapaStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MapaMain" component={MapaScreen} />
  </Stack.Navigator>
);

const MainNavigator = ({ navigation }) => {
  const cantidadNoLeidas = useSelector(selectCantidadNoLeidas);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="Habitaciones" component={HabitacionesStack} />
      <Stack.Screen name="Reservas" component={ReservasStack} />
      <Stack.Screen name="Perfil" component={PerfilStack} />
      <Stack.Screen name="Contacto" component={ContactoStack} />
      <Stack.Screen name="Mapa" component={MapaStack} />
    </Stack.Navigator>
  );
};

export default MainNavigator;