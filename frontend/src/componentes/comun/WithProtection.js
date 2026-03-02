import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { COLORES } from '../../constantes/colores';

/**
 * WithProtection - Higher Order Component para proteger pantallas
 * 
 * Uso:
 * const ProtectedScreen = WithProtection(MyScreenComponent);
 * 
 * Cuando el usuario no está autenticado:
 * - Muestra un mensaje
 * - Botón para ir al login modal
 */
export const WithProtection = (ScreenComponent) => {
  return function ProtectedScreenWrapper(props) {
    const { isAuthenticated, requireAuth } = useRequireAuth();

    if (!isAuthenticated) {
      return (
        <View style={{ 
          flex: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          backgroundColor: COLORES.fondoClaro,
          paddingHorizontal: 20,
        }}>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600',
            color: COLORES.NEGRO,
            marginBottom: 20,
            textAlign: 'center',
          }}>
            Requiere autenticación
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: COLORES.grisTexto,
            marginBottom: 30,
            textAlign: 'center',
          }}>
            Inicia sesión para acceder a esta función
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: COLORES.SECUNDARIO,
              paddingHorizontal: 30,
              paddingVertical: 12,
              borderRadius: 8,
            }}
            onPress={requireAuth}
          >
            <Text style={{ 
              color: COLORES.PRIMARIO, 
              fontWeight: '600',
              fontSize: 14,
            }}>
              Iniciar Sesión
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return <ScreenComponent {...props} />;
  };
};
