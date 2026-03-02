// frontend/src/contexto/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import storage from '../utils/storage';
import { authService } from '../servicios/authService';
import { STORAGE_KEYS } from '../constantes/config';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    cargarDatosAlmacenados();
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!usuario && !!accessToken);
  }, [usuario, accessToken]);

  const cargarDatosAlmacenados = async () => {
    try {
      console.log('🔍 AuthContext: Cargando datos almacenados...');

      const storedToken = await storage.get(STORAGE_KEYS.TOKEN);
      const storedRefresh = await storage.get(STORAGE_KEYS.REFRESH_TOKEN);
      const storedUser = await storage.get(STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        console.log('✅ Datos encontrados en almacenamiento');
        
        const parsedUser = JSON.parse(storedUser);
        
        setAccessToken(storedToken);
        setRefreshToken(storedRefresh);
        setUsuario(parsedUser); // ✅ IMPORTANTE: Setear el usuario

        try {
          const response = await authService.obtenerPerfil(storedToken);
          if (response.exito && response.data) {
            console.log('✅ Token válido, actualizando datos');
            setUsuario(response.data);
            await storage.set(STORAGE_KEYS.USER, JSON.stringify(response.data));
          } else {
            console.log('⚠️ Token inválido, limpiando...');
            await limpiarStorage();
          }
        } catch (error) {
          console.log('⚠️ Error verificando token:', error.message);
        }
      } else {
        console.log('ℹ️ No hay datos almacenados');
      }
    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarStorage = async () => {
    console.log('🧹 Limpiando almacenamiento...');
    try {
      await storage.multiRemove([
        STORAGE_KEYS.TOKEN,
        STORAGE_KEYS.REFRESH_TOKEN,
        STORAGE_KEYS.USER,
      ]);
      console.log('✅ Storage limpiado');
    } catch (error) {
      console.error('⚠️ Error limpiando storage:', error);
    }
    
    // Fuerza actualizar estado
    setUsuario(null);
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    console.log('✅ Estado local limpiado');
  };

  const login = async (email, password) => {
    try {
      console.log('🔐 Intentando login local...');
      const response = await authService.loginLocal(email, password);

      if (response.exito && response.data) {
        console.log('✅ Login exitoso');
        console.log('👤 Usuario:', response.data.usuario); // ✅ DEBUG

        const { usuario: userData, tokens } = response.data;

        // ✅ IMPORTANTE: Primero guardar en almacenamiento
        await storage.set(STORAGE_KEYS.TOKEN, tokens.accessToken);
        await storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        await storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));

        console.log('✅ Datos guardados en almacenamiento');

        // ✅ LUEGO actualizar el estado (esto dispara el re-render)
        setUsuario(userData);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);

        console.log('✅ Estado actualizado:', userData.nombre); // ✅ DEBUG

        return { exito: true };
      } else {
        console.log('❌ Login fallido:', response.mensaje);
        return { exito: false, mensaje: response.mensaje };
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      return { exito: false, mensaje: 'Error inesperado en login' };
    }
  };

  const registro = async (nombre, apellido, email, password, telefono) => {
    try {
      console.log('📝 Intentando registro...');
      const response = await authService.registroLocal({
        nombre,
        apellido,
        email,
        password,
        telefono,
      });

      if (response.exito && response.data) {
        console.log('✅ Registro exitoso');

        const { usuario: userData, tokens } = response.data;

        // Guardar en almacenamiento
        await storage.set(STORAGE_KEYS.TOKEN, tokens.accessToken);
        await storage.set(STORAGE_KEYS.REFRESH_TOKEN, tokens.refreshToken);
        await storage.set(STORAGE_KEYS.USER, JSON.stringify(userData));

        console.log('✅ Datos guardados en almacenamiento');

        // Actualizar estado
        setUsuario(userData);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);

        return { exito: true };
      } else {
        console.log('❌ Registro fallido:', response.mensaje);
        return { exito: false, mensaje: response.mensaje };
      }
    } catch (error) {
      console.error('❌ Error en registro:', error);
      return { exito: false, mensaje: 'Error inesperado en registro' };
    }
  };

  const loginConGoogle = async (googleAccessToken) => {
    try {
      console.log('🔐 Intentando login con Google...');
      const response = await authService.googleMobileAuth(googleAccessToken);

      if (response.exito && response.data) {
        console.log('✅ Login con Google exitoso');

        const { usuario: userData, tokens } = response.data;

        await storage.set('accessToken', tokens.accessToken);
        await storage.set('refreshToken', tokens.refreshToken);
        await storage.set('usuario', JSON.stringify(userData));

        setUsuario(userData);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);

        return { exito: true };
      } else {
        return { exito: false, mensaje: response.mensaje };
      }
    } catch (error) {
      console.error('❌ Error en login con Google:', error);
      return { exito: false, mensaje: 'Error inesperado al autenticar con Google' };
    }
  };

  const loginConGitHub = async (githubAccessToken) => {
    try {
      console.log('🔐 Intentando login con GitHub...');
      const response = await authService.githubMobileAuth(githubAccessToken);

      if (response.exito && response.data) {
        console.log('✅ Login con GitHub exitoso');

        const { usuario: userData, tokens } = response.data;

        await storage.set('accessToken', tokens.accessToken);
        await storage.set('refreshToken', tokens.refreshToken);
        await storage.set('usuario', JSON.stringify(userData));

        setUsuario(userData);
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);

        return { exito: true };
      } else {
        return { exito: false, mensaje: response.mensaje };
      }
    } catch (error) {
      console.error('❌ Error en login con GitHub:', error);
      return { exito: false, mensaje: 'Error inesperado al autenticar con GitHub' };
    }
  };

  const logout = async () => {
    try {
      console.log('👋 Iniciando logout...');
      console.log('📱 isAuthenticated antes:', isAuthenticated);
      
      // Paso 1: Limpiar estado inmediatamente (sin esperar)
      console.log('🔄 Limpiando estado...');
      setIsAuthenticated(false);
      setUsuario(null);
      setAccessToken(null);
      setRefreshToken(null);
      console.log('✅ Estado limpiado');

      // Paso 2: Limpiar storage (en background, no bloquear)
      console.log('🧹 Limpiando storage...');
      (async () => {
        try {
          await storage.multiRemove([
            STORAGE_KEYS.TOKEN,
            STORAGE_KEYS.REFRESH_TOKEN,
            STORAGE_KEYS.USER,
          ]);
          console.log('✅ Storage limpiado');
        } catch (err) {
          console.error('⚠️ Error limpiando storage:', err);
        }
      })();

      // Paso 3: Intentar invalidar token en backend (no bloquear si falla)
      if (accessToken) {
        (async () => {
          try {
            await authService.logout(accessToken);
            console.log('✅ Token invalidado en backend');
          } catch (error) {
            console.log('⚠️ Error invalidando token en backend:', error.message);
          }
        })();
      }

      console.log('✅ Logout completado');
    } catch (error) {
      console.error('❌ Error crítico en logout:', error);
      // Forzar limpieza incluso si hay errores
      setIsAuthenticated(false);
      setUsuario(null);
      setAccessToken(null);
      setRefreshToken(null);
    }
  };

  const refrescarDatos = async () => {
    if (!accessToken) return;

    try {
      console.log('🔄 Refrescando datos del usuario...');
      const response = await authService.obtenerPerfil(accessToken);
      
      if (response.exito && response.data) {
        console.log('✅ Datos refrescados');
        setUsuario(response.data);
        await storage.set('usuario', JSON.stringify(response.data));
      }
    } catch (error) {
      console.error('❌ Error al refrescar datos:', error);
    }
  };

  const esAdmin = () => {
    return usuario?.rol === 'admin';
  };

  const esEmpleado = () => {
    return usuario?.rol === 'empleado' || usuario?.rol === 'admin';
  };

  const value = {
    usuario,
    accessToken,
    refreshToken,
    loading,
    isAuthenticated,
    esAdmin: esAdmin(),
    esEmpleado: esEmpleado(),
    login,
    registro,
    loginConGoogle,
    loginConGitHub,
    logout,
    refrescarDatos,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;