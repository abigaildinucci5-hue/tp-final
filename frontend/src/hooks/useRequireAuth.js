import { useCallback } from 'react';
import { useAuth } from '../contexto/AuthContext';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook para proteger pantallas que requieren autenticación
 * En lugar de romper la navegación, muestra un modal de login
 */
export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth();
  const navigation = useNavigation();

  const requireAuth = useCallback(async () => {
    if (!isAuthenticated) {
      // Mostrar modal de login sin romper navegación
      navigation.navigate('AuthModal');
      return false;
    }
    return true;
  }, [isAuthenticated, navigation]);

  return { isAuthenticated, requireAuth };
};

/**
 * Hook para autorización por rol
 */
export const useRequireRole = (requiredRole) => {
  const { usuario } = useAuth();
  
  const hasRole = usuario?.rol === requiredRole;
  
  return { hasRole, userRole: usuario?.rol };
};
