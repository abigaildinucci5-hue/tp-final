// frontend/src/hooks/useGoogleAuthCallback.js
import { useEffect } from 'react';
import storage from '../utils/storage';
import { API_CONFIG } from '../constantes/config';

/**
 * Hook que captura tokens de OAuth en la URL
 * Funciona para Google, GitHub y cualquier proveedor que use el mismo flujo
 * Captura parámetros: ?token=...&refresh=...&error=...
 */
export const useGoogleAuthCallback = () => {
  useEffect(() => {
    const procesarCallbackOAuth = async () => {
      try {
        // 🔥 En Expo Web, la URL se accede desde window.location
        if (typeof window === 'undefined') return;

        const url = new URL(window.location.href);
        const token = url.searchParams.get('token');
        const refreshToken = url.searchParams.get('refresh');
        const error = url.searchParams.get('error');

        // Detectar qué proveedor se usó (opcional, para logging)
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
        
        // 1️⃣ Guardar tokens usando la utilidad de almacenamiento
        console.log('💾 Guardando tokens...');
        await storage.set('accessToken', token);
        await storage.set('refreshToken', refreshToken);
        console.log('✅ Tokens guardados');
        
        // 2️⃣ Obtener datos del usuario del backend
        console.log('👤 Obteniendo datos del usuario...');
        try {
          const apiUrl = API_CONFIG.BASE_URL || 'https://tp-final-production-9e41.up.railway.app/api';
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
              // Guardar usuario en almacenamiento
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

        // 3️⃣ Limpiar URL para evitar resubmisiones
        console.log('🧹 Limpiando parámetros de URL');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // 4️⃣ Recargar la página para que AuthContext lea los datos guardados
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
