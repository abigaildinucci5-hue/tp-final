// ============================================
// PARTE 4: App.js actualizado
// frontend/App.js
// ============================================

import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from './src/contexto/AuthContext'; // 🆕 IMPORTANTE
import { NavigationProvider } from './src/contexto/NavigationContext'; // 🆕 IMPORTANTE
import { useGoogleAuthCallback } from './src/hooks/useGoogleAuthCallback'; // 🆕 IMPORTANTE

// Redux Store
import { store, persistor } from './src/redux/store';

// Navegación
import AppNavigator from './src/navegacion/AppNavigator';
import LoginModalContainer from './src/componentes/comun/LoginModalContainer';

// Componentes
import { PantallaCarga } from './src/componentes/comun/Loading';

if (typeof document !== 'undefined') {
  document.body.style.overflow = 'auto';
  // ← AGREGÁ ESTO justo abajo, dentro del mismo if
  const style = document.createElement('style');
  style.textContent = `::-webkit-scrollbar { display: none; } * { scrollbar-width: none; -ms-overflow-style: none; }`;
  document.head.appendChild(style);
}

// Prevenir que el splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

/**
 * Componente interno que usa el hook de Google Auth
 */
const AppContent = ({ appIsReady, onLayoutRootView }) => {
  // 🔥 Hook que captura tokens de Google OAuth
  useGoogleAuthCallback();

  if (!appIsReady) {
    return null;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<PantallaCarga />} persistor={persistor}>
        {/* 🆕 AuthProvider envuelve todo */}
        <AuthProvider>
          {/* 🆕 NavigationProvider para manejar el modal de login */}
          <NavigationProvider>
            <SafeAreaProvider>
              <View style={{ flex: 1 }}>
              <NavigationContainer onReady={onLayoutRootView}>
                <AppNavigator />
                {/* 🆕 LoginModalContainer DENTRO del NavigationContainer */}
                <LoginModalContainer />
                <StatusBar style="auto" />
              </NavigationContainer>
              </View>
            </SafeAreaProvider>
          </NavigationProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  );
};

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-cargar recursos
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Error al cargar recursos:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = React.useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return <AppContent appIsReady={appIsReady} onLayoutRootView={onLayoutRootView} />;
}