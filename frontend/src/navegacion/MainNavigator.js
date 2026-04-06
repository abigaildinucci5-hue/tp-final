// src/navegacion/MainNavigator.js
import React, { useState, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

// Pantallas
import HomeScreen from '../pantallas/home/HomeScreen';
import ListaHabitacionesScreen from '../pantallas/habitaciones/ListaHabitacionesScreen';
import DetalleHabitacionScreen from '../pantallas/habitaciones/DetalleHabitacionScreen';
import FavoritosScreen from '../pantallas/habitaciones/FavoritosScreen';
import MisReservasScreen from '../pantallas/reservas/MisReservasScreen';
import DetalleReservaScreen from '../pantallas/reservas/DetalleReservaScreen';
import NuevaReservaScreen from '../pantallas/reservas/NuevaReservaScreen';
import ReservaExitosaScreen from '../pantallas/reservas/ReservaExitosaScreen';
import PerfilScreen from '../pantallas/perfil/PerfilScreen';
import EditarPerfilScreen from '../pantallas/perfil/EditarPerfilScreen';


import { COLORES } from '../constantes/colores';
import { FUENTES } from '../constantes/estilos';
import NavbarModerna from '../componentes/comun/NavbarModerna';
import { useAuth } from '../contexto/AuthContext';
import ContactoMainScreen from '../pantallas/contacto/ContactoMainScreen';

const Stack = createNativeStackNavigator();

// Stack de Home
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="DetalleHabitacion" component={DetalleHabitacionScreen} />
    <Stack.Screen name="NuevaReserva" component={NuevaReservaScreen} />
    <Stack.Screen name="ReservaExitosa" component={ReservaExitosaScreen} />
  </Stack.Navigator>
);

// Stack de Habitaciones
const HabitacionesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ListaHabitaciones" component={ListaHabitacionesScreen} />
    <Stack.Screen name="DetalleHabitacion" component={DetalleHabitacionScreen} />
    <Stack.Screen name="NuevaReserva" component={NuevaReservaScreen} />
    <Stack.Screen name="ReservaExitosa" component={ReservaExitosaScreen} />
  </Stack.Navigator>
);

// Stack de Reservas
const ReservasStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MisReservas" component={MisReservasScreen} />
    <Stack.Screen name="DetalleReserva" component={DetalleReservaScreen} />
  </Stack.Navigator>
);

// Stack de Perfil
const PerfilStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PerfilMain" component={PerfilScreen} />
    <Stack.Screen name="EditarPerfil" component={EditarPerfilScreen} />
    <Stack.Screen name="Favoritos" component={FavoritosScreen} />
  </Stack.Navigator>
);


const MainNavigator = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  return (
    <Stack.Navigator
      screenOptions={{
        header: () => (
          <NavbarModerna
            usuario={usuario}
            isAuthenticated={isAuthenticated}
            onLogout={logout}
          />
        )
      }}
    >
      <Stack.Screen name="Home" component={HomeStack} />
      <Stack.Screen name="Habitaciones" component={HabitacionesStack} />
      <Stack.Screen name="Reservas" component={ReservasStack} />
      <Stack.Screen name="Perfil" component={PerfilStack} />
      <Stack.Screen name="Contacto" component={ContactoMainScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;