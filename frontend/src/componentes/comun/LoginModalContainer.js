// frontend/src/componentes/comun/LoginModalContainer.js
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useNavigationModal } from '../../contexto/NavigationContext';
import { useAuth } from '../../contexto/AuthContext';
import LoginModal from './LoginModal';

/**
 * Contenedor que maneja la lógica del modal de login
 * Se ubica dentro del NavigationContainer para poder acceder a useNavigation
 */
const LoginModalContainer = () => {
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const {
    loginModalVisible,
    setLoginModalVisible,
    pendingAction,
    clearPendingAction,
  } = useNavigationModal();

  // Ejecutar acción pendiente después de autenticar
  React.useEffect(() => {
    if (isAuthenticated && pendingAction && loginModalVisible) {
      const { action, params } = pendingAction;
      
      // Cerrar modal primero
      setLoginModalVisible(false);
      clearPendingAction();

      // Luego ejecutar la acción pendiente
      setTimeout(() => {
        switch (action) {
          case 'navigateTo':
            if (params?.screenName) {
              navigation.navigate(params.screenName, params.params);
            }
            break;
          // Otros casos de acciones pendientes se pueden agregar aquí
          default:
            break;
        }
      }, 300);
    }
  }, [isAuthenticated, pendingAction, loginModalVisible, clearPendingAction, setLoginModalVisible, navigation]);

  const handleLoginPress = () => {
    setLoginModalVisible(false);
    // Pequeño delay para que se cierre el modal antes de navegar
    setTimeout(() => {
      navigation.navigate('Auth', { screen: 'Login' });
    }, 300);
  };

  const handleRegisterPress = () => {
    setLoginModalVisible(false);
    // Pequeño delay para que se cierre el modal antes de navegar
    setTimeout(() => {
      navigation.navigate('Auth', { screen: 'Registro' });
    }, 300);
  };

  return (
    <LoginModal
      visible={loginModalVisible}
      onClose={() => setLoginModalVisible(false)}
      onLoginPress={handleLoginPress}
      onRegisterPress={handleRegisterPress}
      actionMessage="Para continuar, inicia sesión o crea una cuenta"
    />
  );
};

export default LoginModalContainer;
