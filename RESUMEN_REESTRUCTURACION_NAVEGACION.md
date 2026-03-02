/**
 * ============================================
 * RESUMEN: REESTRUCTURACIÓN DE NAVEGACIÓN
 * ============================================
 * Proyecto: TP-final - Hotel Luna Serena
 * Fecha: 2026-02-24
 * Objetivo: Hacer la app funcionar en modo invitado
 */

/**
 * ============================================
 * ARCHIVOS CREADOS
 * ============================================
 */

// 1. frontend/src/hooks/useRequireAuth.js
//    - Hook para proteger pantallas
//    - useRequireAuth() retorna { isAuthenticated, requireAuth }
//    - requireAuth() abre AuthModal sin romper navegación

// 2. frontend/src/componentes/comun/ProtectedScreen.js
//    - Componente wrapper para pantallas protegidas
//    - HOC: WithProtection(Component)
//    - Hook: useProtectedScreen()

// 3. frontend/src/componentes/comun/WithProtection.js
//    - Higher Order Component para proteger pantallas
//    - Uso: const Protected = WithProtection(MyScreen)

// 4. frontend/src/contexto/TabNavigationContext.js
//    - Context para pasar navigation
//    - TabNavigationProvider wrapper
//    - useTabNavigation hook

/**
 * ============================================
 * ARCHIVOS MODIFICADOS
 * ============================================
 */

// 1. frontend/src/navegacion/AppNavigator.js
//    ANTES: if (isAuthenticated) → MainNavigator : AuthNavigator
//           if (esAdmin) → AdminNavigator
//    AHORA: 
//    - RootStack siempre muestra MainStack
//    - AuthModal es un Stack.Group modal (presentation: 'modal')
//    - AdminStack es un Stack.Group modal (solo si esAdmin)

// 2. frontend/src/navegacion/MainNavigator.js
//    ANTES: TabNavigatorWithNav con jumpTo refs
//    AHORA:
//    - Eliminado refs y jumpTo
//    - TabNavigator sin condiciones
//    - NavbarModerna siempre visible
//    - Control de acceso a nivel de pantalla

// 3. frontend/src/componentes/comun/NavbarModerna.js
//    ANTES: Recibía onTabChange callback
//    AHORA:
//    - Simplificación: navigateTo usa navigation.navigate
//    - Sin condiciones, navega a todos lados
//    - Pantallas deciden si requieren auth

// 4. frontend/src/servicios/api.js
//    ANTES: Logout automático ante cualquier 401
//    AHORA:
//    - Intenta refrescar token antes de fallar
//    - Solo borra tokens si refresh falla realmente
//    - Retorna errores con status/message claros

// 5. frontend/src/pantallas/reservas/MisReservasScreen.js
//    ANTES: navigation.reset() para logout
//    AHORA:
//    - Muestra UI de "Requiere autenticación"
//    - Botón "Iniciar Sesión" abre AuthModal
//    - No se rompe navegación

// 6. frontend/src/pantallas/perfil/PerfilScreen.js
//    ANTES: navigation.reset() para logout
//    AHORA:
//    - UI similar a MisReservasScreen
//    - Opción de login sin romper navegación

/**
 * ============================================
 * ESTRUCTURA NUEVA DEL ROUTER
 * ============================================
 */

// RootStack (AppNavigator)
// │
// ├── MainStack (SIEMPRE VISIBLE)
// │   └── MainNavigator
// │       ├── NavbarModerna
// │       └── TabNavigator
// │           ├── Home Stack
// │           ├── Habitaciones Stack
// │           ├── Reservas Stack (protegida visualmente)
// │           └── Perfil Stack (protegida visualmente)
// │
// ├── AuthModal (Stack.Group presentation: modal)
// │   └── AuthNavigator (Login/Registro)
// │
// └── AdminStack (Stack.Group presentation: modal, if esAdmin)
//     └── AdminNavigator (Panel Admin)

/**
 * ============================================
 * CÓMO ESTÁ PROTEGIDO CADA FLUJO
 * ============================================
 */

// 1. USUARIO INVITADO
//    - ✅ Puede: Home, Habitaciones, Contacto, Detalle de habitación
//    - ❌ No puede: Crear reserva, Ver Mis reservas, Ver Perfil
//    - Cuando intenta: Ve UI + botón "Iniciar Sesión"
//    - Efecto: Abre AuthModal (presentation: modal)
//    - Flujo: Login → Vuelve a la pantalla anterior

// 2. USUARIO LOGUEADO (Rol: Huésped)
//    - ✅ Puede: Toda la navegación normal
//    - Puede ver: Mis reservas, Perfil, etc.

// 3. USUARIO ADMIN
//    - ✅ Puede: Todo lo anterior + AdminStack
//    - Acceso: Botón en Navbar abre AdminStack como modal
//    - AdminStack es modal, no reemplaza MainNavigator

/**
 * ============================================
 * INTEGRACIÓN EN AXIOS: MANEJO 401
 * ============================================
 */

// api.interceptors.response.use(...)
// 
// Cuando ocurre un 401:
// 1. Intenta refrescar el token
// 2. Si el refresh es exitoso:
//    - Actualiza el token
//    - Reintenta la petición original
//    - Devuelve resultado exitoso
// 
// 3. Si el refresh falla:
//    - Borra los tokens del almacenamiento
//    - Retorna error con status: 401
//
// En tu componente:
// try {
//   const res = await api.get('/url');
// } catch (error) {
//   if (error.status === 401) {
//     // Token expirado, pedir login
//     requireAuth();
//   }
// }

/**
 * ============================================
 * CÓMO USAR EN TUS PANTALLAS
 * ============================================
 */

// OPCIÓN A: Directamente en el componente
// ─────────────────────────────────────────
// import { useRequireAuth } from '../../hooks/useRequireAuth';
// 
// const MyScreen = () => {
//   const { isAuthenticated, requireAuth } = useRequireAuth();
//   
//   if (!isAuthenticated) {
//     return (
//       <View>
//         <Text>Requiere login</Text>
//         <Button onPress={requireAuth} title="Iniciar Sesión" />
//       </View>
//     );
//   }
//   
//   return <MyContent />;
// };

// OPCIÓN B: Con HOC (Higher Order Component)
// ─────────────────────────────────────────
// import { WithProtection } from '../../componentes/comun/WithProtection';
// 
// const MyScreenContent = () => {
//   // Este contenido solo se renderiza si está autenticado
//   return <MyContent />;
// };
// 
// export default WithProtection(MyScreenContent);

// OPCIÓN C: En una acción específica (Botón)
// ─────────────────────────────────────────
// const handleCrearReserva = async () => {
//   const { isAuthenticated, requireAuth } = useRequireAuth();
//   
//   if (!isAuthenticated) {
//     await requireAuth(); // Abre AuthModal
//     return;
//   }
//   
//   // Continuar con la reserva
// };

/**
 * ============================================
 * PRÓXIMOS PASOS
 * ============================================
 */

// 1. ✅ Prueba que la navegación funciona
//    - Entra como invitado
//    - Navega entre Home, Habitaciones, Contacto
//    - Verifica que MisReservas y Perfil muestren UI bloqueada
//    - Haz clic en "Iniciar sesión" → Debe abrir AuthModal

// 2. ✅ Prueba que AuthModal funciona
//    - Haz login dentro del modal
//    - Cuando se cierre → Debe volver a la pantalla donde estabas
//    - El estado debe mantenerse

// 3. ✅ Prueba acciones protegidas
//    - Intenta crear una reserva siendo invitado
//    - Debe pedir login
//    - Login → Vuelve a la pantalla de reserva
//    - Los datos no se perdieron → Puede confirmar

// 4. ✅ Prueba en otras pantallas protegidas
//    - Implementa useRequireAuth() en:
//      • Editar Perfil
//      • Favoritos
//      • Otros botones que requieran auth

// 5. ✅ Test con token expirado
//    - Si expira el token → API retorna 401
//    - interceptor intenta refrescar
//    - Si no puede → mustrar AuthModal
//    - Usuario hace login nuevamente

// 6. ✅ Test de Admin
//    - Login como admin
//    - Debe ver AdminStack disponible
//    - Abre AdminStack (modal) → No afecta MainNavigator
//    - Cierra AdminStack → Vuelve al MainNavigator

/**
 * ============================================
 * DIFERENCIAS CLAVE CON ANTERIOR
 * ============================================
 */

// ANTES                              AHORA
// ─────────────────────────────────────────────────
// Stack condicional por role        Stack siempre igual
// navigation.reset()                useRequireAuth()
// jumpTo en tabs                    navigation.navigate()
// Logout automático 401             Intenta refresh primero
// AuthNavigator bloquea main        AuthModal sobre main
// Props: tabNavRef, onTabChange     Props: simples
// Refs en Tab.Navigator             Sin refs en navigator
// Estado se perdía                  Estado se mantiene

/**
 * ============================================
 * CHECKLIST FINAL
 * ============================================
 */

// [ ] AppNavigator.js actualizado con Stack.Group modales
// [ ] MainNavigator.js sin jumpTo
// [ ] NavbarModerna sin callbacks de tabs
// [ ] useRequireAuth() hook creado
// [ ] WithProtection HOC disponible
// [ ] api.js interceptor mejorado
// [ ] MisReservasScreen actualizada
// [ ] PerfilScreen actualizada
// [ ] AuthModal abre correctamente
// [ ] AdminStack accesible solo como admin
// [ ] Estado de pantalla se mantiene al login
// [ ] Invitados pueden navegar libremente
// [ ] Protecciones funcionan en todas las pantallas

/**
 * ============================================
 * DOCUMENTACIÓN AUXILIAR
 * ============================================
 */

// Ver archivos:
// - frontend/NUEVA_ESTRUCTURA_NAVEGACION.md
// - frontend/EJEMPLO_CREAR_RESERVA.js
// 
// Estos contienen ejemplos detallados de uso

/**
 * FIN DEL RESUMEN
 */
