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

import React, { useEffect } from 'react';
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

  useEffect(() => {
    console.log("AUTH STATE:", {
      isAuthenticated,
      loading,
      usuario
    });
  }, [isAuthenticated, loading, usuario]);

  // ✅ Determinar qué navegador mostrar
  let NavigatorComponent = MainNavigator; // Por defecto, cliente (invitado o autenticado)
  
  if (isAuthenticated) {
    if (esAdmin) {
      // Admin tiene acceso a todo (prioridad máxima)
      NavigatorComponent = AdminNavigator;
    } else if (esEmpleado) {
      // Empleado/Recepcionista
      NavigatorComponent = EmployeeNavigator;
    }
    // Si no es admin ni empleado, es cliente → MainNavigator (incluso autenticado)
  }
  // Si NO está autenticado → MainNavigator (como invitado)

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <ActivityIndicator size="large" color={COLORES.SECUNDARIO} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      {/* ✅ SIEMPRE mostrar MainNavigator (invitado o cliente autenticado) */}
      <Stack.Screen 
        name="MainApp" 
        component={NavigatorComponent}
        options={{
          animationEnabled: false,
          gestureEnabled: false,
        }}
      />

      {/* 🔐 Modal de Auth disponible para cualquier usuario */}
      <Stack.Group
        screenOptions={{
          presentation: 'modal',
          animationEnabled: true,
        }}
      >
        <Stack.Screen
          name="AuthModal"
          component={AuthNavigator}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Group>
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