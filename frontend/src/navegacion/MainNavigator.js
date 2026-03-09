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
import ContactoMainScreen from '../pantallas/contacto/ContactoMainScreen';

// Navbar
import NavbarModerna from '../componentes/comun/NavbarModerna';
import { useAuth } from '../contexto/AuthContext';
import { COLORES } from '../constantes/colores';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ===== STACKS INDIVIDUALES (sin Navbar) =====

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
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

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
      options={{ animationEnabled: true }}
    />
    <Stack.Screen 
      name="NuevaReserva" 
      component={NuevaReservaScreen}
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

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
      options={{ animationEnabled: true }}
    />
    <Stack.Screen 
      name="ReservaExitosa" 
      component={ReservaExitosaScreen}
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

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
      options={{ animationEnabled: true }}
    />
    <Stack.Screen 
      name="Favoritos" 
      component={FavoritosScreen}
      options={{ animationEnabled: true }}
    />
  </Stack.Navigator>
);

const ContactoStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="ContactoMain" component={ContactoMainScreen} />
  </Stack.Navigator>
);

// ===== WRAPPERS CON NAVBAR =====

const HomeWithNavbar = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <View style={{ flex: 1 }}>
        <HomeStack />
      </View>
    </View>
  );
};

const HabitacionesWithNavbar = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <View style={{ flex: 1 }}>
        <HabitacionesStack />
      </View>
    </View>
  );
};

const ReservasWithNavbar = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <View style={{ flex: 1 }}>
        <ReservasStack />
      </View>
    </View>
  );
};

const PerfilWithNavbar = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <View style={{ flex: 1 }}>
        <PerfilStack />
      </View>
    </View>
  );
};

const ContactoWithNavbar = () => {
  const { usuario, isAuthenticated, logout } = useAuth();
  return (
    <View style={{ flex: 1 }}>
      <NavbarModerna 
        usuario={usuario}
        isAuthenticated={isAuthenticated}
        onLogout={logout}
      />
      <View style={{ flex: 1 }}>
        <ContactoStack />
      </View>
    </View>
  );
};

/**
 * MainNavigator - Estructura principal
 * ✅ TabNavigator como raíz
 * ✅ NavbarModerna en cada tab
 */
const MainNavigator = () => {
  return (
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
        component={HomeWithNavbar}
        options={{ tabBarLabel: 'Inicio' }}
      />
      <Tab.Screen 
        name="Habitaciones" 
        component={HabitacionesWithNavbar}
        options={{ tabBarLabel: 'Habitaciones' }}
      />
      <Tab.Screen 
        name="Reservas" 
        component={ReservasWithNavbar}
        options={{ tabBarLabel: 'Mis Reservas' }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={PerfilWithNavbar}
        options={{ tabBarLabel: 'Perfil' }}
      />
      <Tab.Screen 
        name="Contacto" 
        component={ContactoWithNavbar}
        options={{ tabBarLabel: 'Contacto' }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;