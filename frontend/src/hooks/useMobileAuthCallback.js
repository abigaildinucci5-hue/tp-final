import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';
import { useAuth } from '../contexto/AuthContext';

/**
 * Hook que maneja callbacks de OAuth en mobile
 * Escucha deep links y procesa tokens de autenticación
 */
export const useMobileAuthCallback = () => {
  const { loginConGoogle, loginConGitHub } = useAuth();

  useEffect(() => {
    // Solo ejecutar en plataformas móviles reales
    if (Platform.OS !== 'ios' && Platform.OS !== 'android') {
      return;
    }

    const handleDeepLink = async (url) => {
      console.log('🔗 Deep link recibido:', url);

      try {
        const parsed = Linking.parse(url);
        const { path, queryParams } = parsed;

        // Extraer token o código de la URL
        const token = queryParams?.token;
        const code = queryParams?.code;
        const provider = queryParams?.provider;

        if (path?.includes('auth/callback')) {
          if (provider === 'google' && token) {
            console.log('✅ Token de Google recibido');
            await loginConGoogle(token);
          } else if (provider === 'github' && (token || code)) {
            console.log('✅ Token/Código de GitHub recibido');
            await loginConGitHub(token || code);
          }
        }
      } catch (error) {
        console.error('❌ Error procesando deep link:', error);
      }
    };

    // Escuchar deep links entrantes
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url);
    });

    // Verificar si hay un deep link pendiente al montar el componente
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loginConGoogle, loginConGitHub]);
};
