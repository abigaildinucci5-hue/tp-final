// frontend/src/contexto/NavigationContext.js
import React, { createContext, useState, useCallback } from 'react';

const NavigationContext = createContext(null);

export const NavigationProvider = ({ children }) => {
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [previousRoute, setPreviousRoute] = useState(null);

  /**
   * Mostrar modal de login y guardar la acción pendiente y ruta anterior
   * @param {string} action - Tipo de acción (addFavorite, createReserva, etc)
   * @param {object} params - Parámetros de la acción
   * @param {string} previousRouteName - Nombre de la ruta anterior
   */
  const showLoginModal = useCallback((action, params = null, previousRouteName = null) => {
    setPendingAction({ action, params });
    setPreviousRoute(previousRouteName);
    setLoginModalVisible(true);
  }, []);

  /**
   * Cerrar modal de login y limpiar estado pendiente
   */
  const closeLoginModal = useCallback(() => {
    setLoginModalVisible(false);
    setPendingAction(null);
    setPreviousRoute(null);
  }, []);

  /**
   * Ejecutar la acción pendiente después de autenticar
   * Retorna la acción y parámetros para que el componente pueda ejecutarla
   */
  const getPendingAction = useCallback(() => {
    return pendingAction;
  }, [pendingAction]);

  /**
   * Limpiar la acción pendiente después de ejecutarla
   */
  const clearPendingAction = useCallback(() => {
    setPendingAction(null);
  }, []);

  const value = {
    loginModalVisible,
    setLoginModalVisible,
    pendingAction,
    previousRoute,
    showLoginModal,
    closeLoginModal,
    getPendingAction,
    clearPendingAction,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

/**
 * Hook para usar el contexto de navegación y acciones pendientes
 */
export const useNavigationModal = () => {
  const context = React.useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigationModal debe usarse dentro de NavigationProvider');
  }
  return context;
};

export default NavigationContext;
