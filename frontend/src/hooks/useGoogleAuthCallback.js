// frontend/src/hooks/useGoogleAuthCallback.js
import { useEffect } from 'react';
import storage from '../utils/storage';
import { API_CONFIG } from '../constantes/config';

export const useGoogleAuthCallback = () => {
  useEffect(() => {
    const procesarCallbackOAuth = async () => {
      try {
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const refreshToken = url.searchParams.get('refresh');
        const error = url.searchParams.get('error');

        let provider = 'OAuth';
        if (window.location.href.includes('google')) provider = 'Google';
        if (window.location.href.includes('github')) provider = 'GitHub';

        console.log(`🔍 useOAuthCallback: Procesando callback de ${provider}`, {
          tieneToken: !!token,
          tieneRefresh: !!refreshToken,
          tieneError: !!error,
        });

        if (error) {
          console.error(`❌ Error en ${provider} OAuth:`, error);
          window.history.replaceState({}, document.title, '/');
          return;
        }

        if (!token || !refreshToken) {
          console.log('ℹ️ No hay tokens en URL, ignorando');
          return;
        }

        console.log(`✅ Tokens de ${provider} encontrados en URL`);

        // ✅ Limpiar sesión anterior antes de guardar la nueva
        await storage.remove('auth_token');
        await storage.remove('refreshToken');
        await storage.remove('user_data');
        await new Promise(resolve => setTimeout(resolve, 100));

        // ✅ Guardar nuevos tokens
        await storage.set('auth_token', token);
        await storage.set('refreshToken', refreshToken);
        console.log('✅ Tokens guardados');

        try {
          const apiUrl = API_CONFIG.BASE_URL;
          const response = await fetch(`${apiUrl}/auth/perfil`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            if (data.exito && data.data) {
              console.log(`✅ Datos del usuario de ${provider} obtenidos:`, data.data.email);
              await storage.set('user_data', JSON.stringify(data.data));
              console.log('💾 Usuario guardado');
            } else {
              console.warn('⚠️ Respuesta no contiene datos válidos:', data);
            }
          } else {
            console.warn('⚠️ Error al obtener perfil:', response.status, response.statusText);
          }
        } catch (fetchError) {
          console.error('❌ Error fetching perfil:', fetchError.message);
        }

        console.log('🧹 Limpiando parámetros de URL');
        window.history.replaceState({}, document.title, window.location.pathname);

        console.log('🔄 Recargando página para sincronizar sesión...');
        setTimeout(() => {
          window.location.reload();
        }, 300);

      } catch (error) {
        console.error('❌ Error en useOAuthCallback:', error);
      }
    };

    procesarCallbackOAuth();
  }, []);
};

export default useGoogleAuthCallback;