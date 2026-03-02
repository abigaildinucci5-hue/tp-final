import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRequireAuth } from '../hooks/useRequireAuth';
import { COLORES } from '../constantes/colores';

/**
 * ProtectedScreen - Wrapper para pantallas que requieren autenticación
 * Muestra un mensaje y redirecciona al login modal si es necesario
 */
export const ProtectedScreen = ({ 
  children, 
  Component,
  requiredRole = null,
  fallbackComponent = null
}) => {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const [canAccess, setCanAccess] = React.useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const hasAuth = await requireAuth();
      setCanAccess(hasAuth);
    };
    
    checkAuth();
  }, [requireAuth]);

  // Si no está autenticado y debe estarlo
  if (!isAuthenticated) {
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORES.fondoClaro }}>
        <Text style={{ color: COLORES.grisTexto, fontSize: 16 }}>
          Requiere autenticación
        </Text>
      </View>
    );
  }

  // Renderizar el contenido
  if (Component) {
    return <Component />;
  }

  return children;
};

/**
 * Hook version para usar en componentes funcionales
 */
export const useProtectedScreen = (options = {}) => {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const [isRestricted, setIsRestricted] = React.useState(!isAuthenticated);

  useEffect(() => {
    setIsRestricted(!isAuthenticated);
  }, [isAuthenticated]);

  return {
    isRestricted,
    isAuthenticated,
    requireAuth,
  };
};
