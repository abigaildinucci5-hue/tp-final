/**
 * ============================================
 * QUICK REFERENCE - Guía Rápida
 * ============================================
 * Copia y pega estas secciones en tus pantallas
 */

/**
 * ============================================
 * 1. PROTEGER UNA PANTALLA COMPLETA
 * ============================================
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { COLORES } from '../../constantes/colores';

const MyProtectedScreen = () => {
  const { isAuthenticated, requireAuth } = useRequireAuth();

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 16, marginBottom: 20 }}>
          Requiere autenticación
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORES.SECUNDARIO,
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 8,
          }}
          onPress={requireAuth}
        >
          <Text style={{ color: COLORES.PRIMARIO, fontWeight: '600' }}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Tu contenido protegido aquí */}
    </View>
  );
};

/**
 * ============================================
 * 2. PROTEGER UN BOTÓN
 * ============================================
 */

import { useRequireAuth } from '../../hooks/useRequireAuth';

const MyScreenWithButton = () => {
  const { isAuthenticated, requireAuth } = useRequireAuth();

  const handleProtectedAction = async () => {
    if (!isAuthenticated) {
      await requireAuth(); // Abre AuthModal
      return;
    }

    // Hacer la acción
    console.log('Acción ejecutada');
  };

  return (
    <TouchableOpacity onPress={handleProtectedAction}>
      <Text>
        {isAuthenticated ? 'Hacer Acción' : 'Requiere Login'}
      </Text>
    </TouchableOpacity>
  );
};

/**
 * ============================================
 * 3. PROTEGER CON HOC (Higher Order Component)
 * ============================================
 */

import { WithProtection } from '../../componentes/comun/WithProtection';

// Tu componente
const MyScreenContent = () => (
  <View>
    {/* Este contenido solo se muestra si autenticado */}
  </View>
);

// Exportar protegido
export default WithProtection(MyScreenContent);

/**
 * ============================================
 * 4. MANEJAR ERRORES DE API (401)
 * ============================================
 */

import api from '../../servicios/api';
import { useRequireAuth } from '../../hooks/useRequireAuth';

const handleAPICall = async () => {
  const { requireAuth } = useRequireAuth();

  try {
    const response = await api.get('/mi-endpoint');
    // Éxito
    console.log(response);
  } catch (error) {
    if (error.status === 401) {
      // Sesión expirada
      await requireAuth();
    } else if (error.status === 400) {
      // Error de validación
      alert(error.message);
    } else {
      // Otro error
      alert('Algo salió mal: ' + error.message);
    }
  }
};

/**
 * ============================================
 * 5. NAVEGAR A AUTHMODAL MANUALMENTE
 * ============================================
 */

import { useNavigation } from '@react-navigation/native';

const MyComponent = () => {
  const navigation = useNavigation();

  const handleOpenLogin = () => {
    navigation.navigate('AuthModal'); // Abre modal de login
  };

  return (
    <TouchableOpacity onPress={handleOpenLogin}>
      <Text>Abrir Login</Text>
    </TouchableOpacity>
  );
};

/**
 * ============================================
 * 6. NAVEGAR A ADMIN STACK
 * ============================================
 */

const handleOpenAdmin = () => {
  navigation.navigate('AdminStack'); // Es modal, solo si esAdmin
};

/**
 * ============================================
 * 7. CERRAR AUTHMODAL DESDE DENTRO
 * ============================================
 */

// Dentro de AuthNavigator (Login/Registro):
const handleLoginSuccess = () => {
  // AuthContext automáticamente actualiza isAuthenticated
  // El modal se cierra autom áticamente con goBack
  navigation.goBack();
};

/**
 * ============================================
 * 8. MANTENER ESTADO AL ABRIR LOGIN MODAL
 * ============================================
 */

const CrearReservaScreen = () => {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const [fechaEntrada, setFechaEntrada] = React.useState(null);
  const [fechaSalida, setFechaEntrada] = React.useState(null);

  const handleConfirmar = async () => {
    // Si no está autenticado:
    // 1. requireAuth() abre AuthModal
    // 2. Usuario hace login
    // 3. Modal se cierra
    // 4. Vuelve a esta pantalla con estado intacto
    // 5. fechaEntrada y fechaSalida siguen en state
    if (!isAuthenticated) {
      await requireAuth();
      return;
    }

    // Confirmar la reserva
    console.log(fechaEntrada, fechaSalida);
  };

  return (
    <TouchableOpacity onPress={handleConfirmar}>
      <Text>Confirmar Reserva</Text>
    </TouchableOpacity>
  );
};

/**
 * ============================================
 * REFERENCIAS RÁPIDAS
 * ============================================
 */

// Abrir login modal sin romper navegación:
requireAuth()

// Verificar si está autenticado:
if (!isAuthenticated) { ... }

// Navegar a cualquier pantalla:
navigation.navigate('NombrePantalla')

// Cerrar modal/pantalla actual:
navigation.goBack()

// Abrir AdminStack:
navigation.navigate('AdminStack')

// Hacer API request con token automático:
const res = await api.get('/url')

// Manejar 401 en API:
if (error.status === 401) { requireAuth() }

// Proteger componente con HOC:
export default WithProtection(MyComponent)

// Usar hook en componente:
const { isAuthenticated, requireAuth } = useRequireAuth()

/**
 * ============================================
 * ERRORES COMUNES Y SOLUCIONES
 * ============================================
 */

// ❌ PROBLEMA: "Cannot read property 'navigate' of undefined"
// ✅ SOLUCIÓN: Asegúrate que el componente está dentro del NavigationContainer

// ❌ PROBLEMA: "AuthModal no abre"
// ✅ SOLUCIÓN: Verifica que AppNavigator tiene Stack.Group para AuthModal

// ❌ PROBLEMA: "Datos se pierden al abrir login"
// ✅ SOLUCIÓN: Normal si useEffect recarga. Usa useFocusEffect para proteger

// ❌ PROBLEMA: "AdminStack no aparece"
// ✅ SOLUCIÓN: Verifica que esAdmin es true en AuthContext

// ❌ PROBLEMA: "401 hace logout automático"
// ✅ SOLUCIÓN: Configurado ahora, solo borra tokens si refresh falla

/**
 * ============================================
 * FLUJOS TÍPICOS DE USUARIO
 * ============================================
 */

// 1. INVITADO INTENTA CREAR RESERVA:
//    Home → DetalleHabitación → Crear Reserva
//    [ Click "Confirmar" ] 
//    → if (!isAuthenticated) → requireAuth()
//    → AuthModal abre
//    → Usuario hace login
//    → AuthModal cierra
//    → Vuelve a Crear Reserva con datos intactos
//    → [ Click "Confirmar" nuevamente ]
//    → Crea reserva exitosamente

// 2. USER LOGUEADO, TOKEN EXPIRA DURANTE API CALL:
//    Usuario en Mis Reservas
//    → API request para cargar reservas
//    → Servidor retorna 401 (token expirado)
//    → Interceptor intenta refrescar
//    → Refresh falló
//    → Retorna error status 401
//    → catch block abre AuthModal
//    → Usuario hace login
//    → Cierra AuthModal
//    → Puede reintentar la acción

/**
 * FIN QUICK REFERENCE
 */
