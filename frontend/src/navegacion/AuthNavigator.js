// src/navegacion/AuthNavigator.js - Navegador de autenticación
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas
import LoginScreen from '../pantallas/auth/LoginScreen';
import RegistroScreen from '../pantallas/auth/RegistroScreen';
import RecuperarPasswordScreen from '../pantallas/auth/RecuperarPasswordScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registro" component={RegistroScreen} />
      <Stack.Screen name="RecuperarPassword" component={RecuperarPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;