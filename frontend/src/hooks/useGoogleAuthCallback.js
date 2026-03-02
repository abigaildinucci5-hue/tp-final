// frontend/src/hooks/useGoogleAuthCallback.js
import { useEffect } from 'react';
import storage from '../utils/storage';
import { API_CONFIG } from '../constantes/config';

/**
 * Hook SOLO PARA WEB que captura tokens de OAuth desde URL
 * Se ejecuta una sola vez al cargar la app
 * 
 * Para mobile, el hook de deep link se maneja en el Login screen
 */
export const useGoogleAuthCallback = () => {

  useEffect(() => {
    // Solo ejecutar en WEB
    if (typeof window === 'undefined') return;

    const procesarCallbackOAuth = async () => {
      try {
        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const refreshToken = url.searchParams.get('refresh');
        const error = url.searchParams.get('error');

        // Detectar proveedor
        let provider = 'OAuth';
        if (window.location.href.includes('google')) provider = 'Google';
        if (window.location.href.includes('github')) provider = 'GitHub';

        console.log(`🌐 [WEB] Procesando callback de ${provider}`, {
          tieneToken: !!token,
          tieneRefresh: !!refreshToken,
          tieneError: !!error,
        });

        if (error) {
          console.error(`❌ Error en ${provider} OAuth:`, error);
          window.history.replaceState({}, document.title, '/');
          return;
        }

        if (token && refreshToken) {
          console.log(`✅ Tokens de ${provider} encontrados`);
          
          // 1️⃣ Guardar tokens
          console.log('💾 Guardando tokens...');
          await storage.set('accessToken', token);
          await storage.set('refreshToken', refreshToken);
          console.log('✅ Tokens guardados');

          // 2️⃣ Obtener datos del usuario del backend
          console.log('👤 Obteniendo datos del usuario...');
          try {
            const apiUrl = `${API_CONFIG.BASE_URL}`;
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
                await storage.set('usuario', JSON.stringify(data.data));
                console.log('💾 Usuario guardado en almacenamiento');
              } else {
                console.warn('⚠️ Respuesta no contiene datos válidos:', data);
              }
            } else {
              console.warn('⚠️ Error al obtener perfil:', response.status, response.statusText);
            }
          } catch (fetchError) {
            console.error('❌ Error fetching perfil:', fetchError.message);
          }

          // 3️⃣ Limpiar URL
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('🔄 Página recargando en 300ms...');
          setTimeout(() => {
            window.location.reload();
          }, 300);
        }
      } catch (error) {
        console.error('❌ Error en useGoogleAuthCallback:', error);
      }
    };

    procesarCallbackOAuth();
  }, []);
};

export default useGoogleAuthCallback;
