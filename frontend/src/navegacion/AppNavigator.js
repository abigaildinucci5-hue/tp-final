// ============================================
// AppNavigator.js - Restructured
// frontend/src/navegacion/AppNavigator.js
// 
// Estructura:
// RootStack
//  ├── MainStack (clientes)
//  ├── EmployeeStack (empleados/recepcionistas)
//  ├── AdminStack (admin)
//  └── AuthModal (login para todos)
// ============================================

import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexto/AuthContext';
import MainNavigator from './MainNavigator';
import EmployeeNavigator from './EmployeeNavigator';
import AdminNavigator from './AdminNavigator';
import AuthNavigator from './AuthNavigator';
import { COLORES } from '../constantes/colores';

const Stack = createNativeStackNavigator();

/**
 * RootStack - Estructura que mantiene el navegador correcto según el rol
 */
const RootStack = () => {
  const { isAuthenticated, loading, esAdmin, esEmpleado, usuario } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORES.fondoClaro }}>
        <ActivityIndicator size="large" color={COLORES.dorado} />
      </View>
    );
  }

  // ✅ Determinar qué navegador mostrar
  let NavigatorComponent = MainNavigator; // Por defecto, cliente
  
  if (isAuthenticated) {
    if (esAdmin) {
      // Admin tiene acceso a todo (prioridad máxima)
      NavigatorComponent = AdminNavigator;
    } else if (esEmpleado) {
      // Empleado/Recepcionista
      NavigatorComponent = EmployeeNavigator;
    }
    // Si no es admin ni empleado, es cliente → MainNavigator
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {isAuthenticated ? (
        // ✅ Si está autenticado, mostrar navegador principal según el rol
        <Stack.Screen 
          name="App" 
          component={NavigatorComponent}
          options={{
            animationEnabled: false,
            gestureEnabled: false,
          }}
        />
      ) : (
        // 🔐 Si NO está autenticado, mostrar solo Auth
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{
            animationEnabled: true,
            gestureEnabled: false,
          }}
        />
      )}
    </Stack.Navigator>
  );
};

/**
 * AppNavigator wrapper
 */
const AppNavigator = () => {
  return <RootStack />;
};

export default AppNavigator;