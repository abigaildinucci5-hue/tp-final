import { useCallback } from 'react';
import { useNavigation as useNavigationReact } from '@react-navigation/native';
import { useAuth } from './useAuth';
import { useNavigationModal } from '../contexto/NavigationContext';

/**
 * Hook para manejar redirecciones condicionales basadas en autenticación
 * Usado para proteger acciones sensibles en modo guest
 * 🆕 Ahora muestra un modal en lugar de redirigir directamente
 */
export const useAuthNavigation = () => {
  const navigation = useNavigationReact();
  const { isAuthenticated } = useAuth();
  const { showLoginModal } = useNavigationModal();

  /**
   * Ejecuta una acción solo si el usuario está autenticado
   * Si no está autenticado, muestra modal de login
   * @param {Function} action - Acción a ejecutar si autenticado
   * @param {string} actionName - Nombre de la acción para persistencia (ej: 'addFavorite', 'createReserva')
   * @param {object} actionParams - Parámetros de la acción
   */
  const requireAuth = useCallback(
    (action, actionName = null, actionParams = null) => {
      if (!isAuthenticated) {
        // 🆕 Mostrar modal en lugar de redirigir
        showLoginModal(actionName, actionParams, navigation.getState()?.routes?.[0]?.name);
        return;
      }
      action && action();
    },
    [isAuthenticated, navigation, showLoginModal]
  );

  /**
   * Navega a una pantalla específica solo si está autenticado
   * Si no está autenticado, muestra modal de login
   * @param {string} screenName - Nombre de la pantalla
   * @param {object} params - Parámetros de navegación
   */
  const navigateIfAuthenticated = useCallback(
    (screenName, params = {}) => {
      if (!isAuthenticated) {
        // 🆕 Mostrar modal en lugar de redirigir
        showLoginModal('navigateTo', { screenName, params }, navigation.getState()?.routes?.[0]?.name);
        return;
      }
      navigation.navigate(screenName, params);
    },
    [isAuthenticated, navigation, showLoginModal]
  );

  return {
    requireAuth,
    navigateIfAuthenticated,
    isAuthenticated,
  };
};
