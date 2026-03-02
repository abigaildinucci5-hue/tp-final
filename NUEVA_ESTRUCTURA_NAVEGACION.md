/**
 * ============================================
 * ESTRUCTURA NUEVA DE NAVEGACIÓN
 * ============================================
 * 
 * El usuario ha pedido:
 * - Que la app funcione en modo invitado
 * - Que las pantallas protegidas muestren modal de login, no rompan navegación
 * - Que el TabNavigator siempre esté visible
 * - Que Admin sea accesible sin cambiar estructura
 * 
 * ============================================
 * ARCHIVOS MOD IFICADOS
 * ============================================
 */

// 1. frontend/src/navegacion/AppNavigator.js
// CAMBIO: RootStack siempre muestra MainNavigator
// Auth es un Modal (presentation: 'modal')
// Admin es un Modal (solo si esAdmin)

// Antes:
// - if (isAuthenticated) → MainNavigator : AuthNavigator
// - if (esAdmin) → AdminNavigator

// Ahora:
// MainStack (siempre)
//   ├─ NavbarModerna (siempre)
//   └─ TabNavigator con Home, Habitaciones, Reservas, Perfil
//
// AuthModal (Stack.Group modal)
//   └─ AuthNavigator (login/registro)
//
// AdminStack (Stack.Group modal, solo si esAdmin)
//   └─ AdminNavigator


/**
 * ============================================
 * CÓMO USAR: PROTEGER PANTALLAS
 * ============================================
 */

// Opción 1: Usar hook directamente en pantalla
// Ejemplo: frontend/src/pantallas/reservas/MisReservasScreen.js

import { useRequireAuth } from '../../hooks/useRequireAuth';

const MisReservasScreen = ({ navigation }) => {
  const { isAuthenticated, requireAuth } = useRequireAuth();

  if (!isAuthenticated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Requiere autenticación</Text>
        <TouchableOpacity onPress={requireAuth}>
          <Text>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <YourContent />;
};

// Opción 2: Usar HOC WithProtection
// import { WithProtection } from '../../componentes/comun/WithProtection';
// export default WithProtection(MisReservasScreen);

// Opción 3: Usar ProtectedScreen component
// <ProtectedScreen Component={MisReservasScreen} />


/**
 * ============================================
 * CÓMO INTERCEPTAR BOTÓN "RESERVAR"
 * ============================================
 */

// En NuevaReservaScreen.js o donde se crea la reserva:

import { useRequireAuth } from '../../hooks/useRequireAuth';

const NuevaReservaScreen = ({ navigation, route }) => {
  const { isAuthenticated, requireAuth } = useRequireAuth();
  const { habitacionId } = route.params;

  const handleCrearReserva = async () => {
    // ✅ Verificar autenticación sin romper navegación
    if (!isAuthenticated) {
      await requireAuth();
      return; // No continuar si no está autenticado
    }

    // El usuario está autenticado, proceder
    // ... crear reserva ...
  };

  return (
    <View>
      {/* Otros campos del formulario */}
      <TouchableOpacity 
        style={styles.botonReservar}
        onPress={handleCrearReserva}
      >
        <Text>Confirmar Reserva</Text>
      </TouchableOpacity>
    </View>
  );
};


/**
 * ============================================
 * CÓMO NAVEGAR A LOGIN MODAL
 * ============================================
 */

// useRequireAuth() automáticamente navega a AuthModal
// Pero también puedes hacerlo manualmente:

const handleNeedLogin = () => {
  navigation.navigate('AuthModal'); // Abre el modal de login
};

// Para cerrar el modal desde dentro de Auth:
const handleModalDismiss = () => {
  navigation.goBack(); // Cierra el modal
};


/**
 * ============================================
 * MANEJO DE 401 EN AXIOS
 * ============================================
 */

// frontend/src/servicios/api.js

// El interceptor ahora:
// 1. Intenta refrescar el token si es 401
// 2. SI el refresh falla → borra tokens e indica sesión expirada
// 3. NO borra tokens por cualquier error

// Los errores ahora retornan:
// {
//   message: string,
//   status: number,
//   data: object,
// }

// En tu componente:
try {
  const res = await api.get('/mis-reservas');
  setReservas(res);
} catch (error) {
  if (error.status === 401) {
    // Sesión expirada
    navigation.navigate('AuthModal');
  } else {
    // Otro error (500, red, etc)
    showErrorMessage(error.message);
  }
}


/**
 * ============================================
 * PARA ADMIN: ACCEDER AL ADMIN PANEL
 * ============================================
 */

// El AdminNavigator está disponible como modal si esAdmin=true
// Navega así desde MainTabs:

const handleGoToAdmin = () => {
  navigation.navigate('AdminStack');
};

// Para cerrar el AdminStack:
const handleExitAdmin = () => {
  navigation.goBack();
};

// El rol NO determina qué TabNavigator se muestra
// El control es a nivel de pantalla


/**
 * ============================================
 * RESUMEN DE CAMBIOS TÉCNICOS
 * ============================================
 */

/*
✅ ELIMMINADO:
- jumpTo en Tab.Navigator
- navigation.reset() para hacer logout
- Distintos screens en Stack según isAuthenticated
- forwardRef en TabNavigator
- Logout automático ante cualquier 401

✅ AGREGADO:
- useRequireAuth() hook
- WithProtection HOC
- ProtectedScreen component
- AuthModal como presentation: 'modal'
- AdminStack como presentation: 'modal'
- MainNavigator SIEMPRE visible
- Control de acceso a nivel de pantalla

✅ MEJORADO:
- Axios interceptor maneja 401 inteligentemente
- La navegación no se rompe al cambiar isAuthenticated
- Los usuarios invitados pueden navegar libremente
- Modal de login sin perder estado anterior
*/


/**
 * ============================================
 * FLUJOS DE USUARIO
 * ============================================
 */

// FLUJO 1: Usuario Invitado
// 1. Entra a la app → Ve MainNavigator
// 2. Accede a Home → Funciona ✅
// 3. Accede a Habitaciones → Funciona ✅
// 4. Intenta crear reserva → Modal login → Crea cuenta/login → Vuelve a la pantalla de reserva

// FLUJO 2: Usuario Logueado (Huésped)
// 1. Entra a app → Ve MainNavigator
// 2. Puede acceder a todas las tabs
// 3. Intenta acceder a Perfil de Admin → Bloqueado visualmente

// FLUJO 3: Usuario Admin
// 1. Entra a app → Ve MainNavigator
// 2. Botón en Navbar abre AdminStack (modal)
// 3. Cierra modal → Vuelve al MainNavigator
// 4. Su rol NO cambia qué TabNavigator ve
