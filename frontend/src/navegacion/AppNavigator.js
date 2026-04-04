// ============================================
// PARTE 5: AppNavigator.js actualizado
// frontend/src/navegacion/AppNavigator.js
// ============================================

import React, { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../contexto/AuthContext';
import MainNavigator from './MainNavigator';
import AdminNavigator from './AdminNavigator';
import EmpleadoNavigator from './EmpleadoNavigator';
import { COLORES } from '../constantes/colores';

const Stack = createStackNavigator();

const AppNavigatorContent = () => {
  const { isAuthenticated, loading, esAdmin, esEmpleado, usuario } = useAuth();

  // 1. EL HOOK SIEMPRE PRIMERO (Arregla el error de Hooks)
  useEffect(() => {
    console.log("AUTH STATE:", {
      isAuthenticated,
      loading,
      usuario,
      rol: usuario?.rol
    });
  }, [isAuthenticated, loading, usuario]);

  // 2. DESPUÉS LAS CONDICIONES DE CARGA
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORES.fondoClaro }}>
        <ActivityIndicator size="large" color={COLORES.dorado} />
      </View>
    );
  }

  // 3. LOGICA DE NAVEGACIÓN
  if (esAdmin) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Admin" component={AdminNavigator} />
      </Stack.Navigator>
    );
  }

  // Mostrar EmpleadoNavigator si es empleado pero NO admin
  if (esEmpleado && usuario?.rol === 'empleado') {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Empleado" component={EmpleadoNavigator} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* TIP: Si NO está autenticado, lo ideal es mostrar primero el AuthStack
         pero si permites ver la Home antes de loguearse, deja el MainStack primero.
      */}
      <Stack.Screen name="MainStack" component={MainNavigator} />
      
      {!isAuthenticated && (
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator} 
          options={{ animation: 'fade_from_bottom' }}
        />
      )}
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