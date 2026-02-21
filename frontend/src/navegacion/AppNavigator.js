// ============================================
// PARTE 5: AppNavigator.js actualizado
// frontend/src/navegacion/AppNavigator.js
// ============================================

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexto/AuthContext'; // 🆕 IMPORTANTE
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import { COLORES } from '../constantes/colores';

const Stack = createNativeStackNavigator();

const AppNavigatorContent = () => {
  const { isAuthenticated, loading, esAdmin } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORES.fondoClaro }}>
        <ActivityIndicator size="large" color={COLORES.dorado} />
      </View>
    );
  }

  // Si es admin, mostrar navegación de admin
  if (esAdmin) {
    return <AdminNavigator />;
  }

  // Navegación condicional según autenticación
  // Se usa un Stack Navigator para permitir navegar entre Auth y Main
  // Auth siempre está disponible para que usuarios puedan loguearse desde cualquier punto
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isAuthenticated ? (
        // Usuario autenticado ve MainNavigator
        <Stack.Screen
          name="MainStack"
          component={MainNavigator}
          options={{
            animationEnabled: false,
          }}
        />
      ) : (
        // Usuario no autenticado (guest) ve MainNavigator pero con Auth accesible
        <Stack.Screen
          name="MainStack"
          component={MainNavigator}
          options={{
            animationEnabled: false,
          }}
        />
      )}
      {/* Auth siempre disponible para login desde cualquier punto */}
      <Stack.Screen
        name="Auth"
        component={AuthNavigator}
        options={{
          animationAnimation: 'fade_from_bottom',
          cardStyle: { backgroundColor: 'white' },
        }}
      />
    </Stack.Navigator>
  );
};

/**
 * AppNavigator wrapper
 */
const AppNavigator = () => {
  return <AppNavigatorContent />;
};

export default AppNavigator;