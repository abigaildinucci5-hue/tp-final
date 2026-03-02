// src/navegacion/MainNavigator.js
import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Pantallas
import HomeScreen from '../pantallas/home/HomeScreen';
import ListaHabitacionesScreen from '../pantallas/habitaciones/ListaHabitacionesScreen';
import DetalleHabitacionScreen from '../pantallas/habitaciones/DetalleHabitacionScreen';
import FavoritosScreen from '../pantallas/habitaciones/FavoritosScreen';
import MisReservasScreen from '../pantallas/reservas/MisReservasScreen';
import DetalleReservaScreen from '../pantallas/reservas/DetalleReservaScreen';
import ReservaExitosaScreen from '../pantallas/reservas/ReservaExitosaScreen';
import NuevaReservaScreen from '../pantallas/reservas/NuevaReservaScreen';
import PerfilScreen from '../pantallas/perfil/PerfilScreen';
import EditarPerfilScreen from '../pantallas/perfil/EditarPerfilScreen';

// Navbar
import NavbarModerna from '../componentes/comun/NavbarModerna';
import { useAuth } from '../contexto/AuthContext';
import { COLORES } from '../constantes/colores';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack de Home (sin DetalleHabitacion - va en HabitacionesStack)
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="HomeMain" component={HomeScreen} />
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
    <Stack.Screen 
      name="ReservaExitosa" 
      component={ReservaExitosaScreen}
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
      name="Favoritos" 
      component={FavoritosScreen}
      options={{
        animationEnabled: true,
      }}
    />
  </Stack.Navigator>
);

/**
 * MainNavigator - Estructura principal
 * ✅ Siempre visible - TabNavigator sin condiciones
 * ✅ Control de acceso a nivel de pantalla, no de estructura
 */
const MainNavigator = () => {
  const { usuario, isAuthenticated, logout } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: COLORES.fondoClaro }}>
      {/* NAVBAR */}
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      
      {/* TABS - Siempre visibles, control de acceso en pantallas individuales */}
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { display: 'none' },
          tabBarActiveTintColor: COLORES.dorado,
          tabBarInactiveTintColor: COLORES.grisClaro,
        }}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeStack}
          options={{ tabBarLabel: 'Inicio' }}
        />
        <Tab.Screen 
          name="Habitaciones" 
          component={HabitacionesStack}
          options={{ tabBarLabel: 'Habitaciones' }}
        />
        <Tab.Screen 
          name="Reservas" 
          component={ReservasStack}
          options={{ tabBarLabel: 'Mis Reservas' }}
        />
        <Tab.Screen 
          name="Perfil" 
          component={PerfilStack}
          options={{ tabBarLabel: 'Perfil' }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default MainNavigator;