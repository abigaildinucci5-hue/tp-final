# 🚀 GUÍA RÁPIDA - Referencia para Desarrollo

## 📍 ARCHIVOS NUEVOS (Ubicaciones)

```
frontend/src/
├── contexto/
│   └── NavigationContext.js ⭐
├── componentes/
│   ├── comun/
│   │   ├── LoginModal.js ⭐
│   │   ├── LoginModalContainer.js ⭐
│   │   └── HeroBannerHome.js ⭐
│   └── habitaciones/
│       ├── CarruselHabitaciones.js ⭐
│       └── FiltrosRapidos.js ⭐
├── hooks/
│   └── useAuthNavigation.js 🔄 (MODIFICADO)
├── navegacion/
│   └── AppNavigator.js 🔄 (MODIFICADO)
└── pantallas/
    └── home/
        └── HomeScreen.js 🔄 (MODIFICADO)

App.js 🔄 (MODIFICADO)
```

## 🎯 USAR EN COMPONENTES

### 1️⃣ Importar el Hook
```javascript
import { useAuthNavigation } from '../../hooks/useAuthNavigation';
```

### 2️⃣ Usar en Componente
```javascript
const MiComponente = () => {
  const { requireAuth } = useAuthNavigation();
  
  const handleAccion = () => {
    requireAuth(
      () => { /* lógica aquí */ },
      'nombreAccion',    // opcional
      { param: 'valor' } // opcional
    );
  };
};
```

### 3️⃣ Ejemplos Reales

**Favorito:**
```javascript
const handleToggleFavorito = () => {
  requireAuth(
    () => addFavorite(habitacionId),
    'addFavorite',
    { roomId: habitacionId }
  );
};
```

**Reserva:**
```javascript
const handleReservar = () => {
  requireAuth(
    () => navigation.navigate('NuevaReserva', { id }),
    'createReserva',
    { roomId: id }
  );
};
```

**Perfil:**
```javascript
const handlePerfilPress = () => {
  const { navigateIfAuthenticated } = useAuthNavigation();
  navigateIfAuthenticated('Perfil');
};
```

## 🧠 FLUJO MENTAL

```
Usuario Invitado intenta acción protegida
    ↓
useAuthNavigation() detecta !isAuthenticated
    ↓
showLoginModal(action, params)
    ↓
LoginModal aparece (no redirecciona)
    ↓
Usuario presiona "Login"
    ↓
LoginModalContainer ejecuta login
    ↓
Después de login → ejecuta acción pendiente
    ↓
Modal se cierra automáticamente
    ↓
Acción se ejecuta (ej: toggleFavorito)
```

## 📦 COMPONENTES DISPONIBLES

### LoginModal
```javascript
<LoginModal
  visible={boolean}
  onClose={() => {}}
  onLoginPress={() => {}}
  onRegisterPress={() => {}}
  actionMessage="Mensaje personalizado"
/>
```

### HeroBannerHome
```javascript
<HeroBannerHome
  backgroundImage={require('...')}
  title="Bienvenido"
  subtitle="Descubre..."
  onExplorePress={() => {}}
  onLoginPress={() => {}}
  onRegisterPress={() => {}}
  logoIcon="hotel"
  logoColor={COLORES.dorado}
/>
```

### CarruselHabitaciones
```javascript
<CarruselHabitaciones
  habitaciones={[...]}
  loading={false}
  onHabitacionPress={(item) => {}}
  maxCards={6}
/>
```

### FiltrosRapidos
```javascript
<FiltrosRapidos
  opciones={[...]}
  seleccionado="todas"
  onSelect={(valor) => {}}
/>
```

## 🔑 HOOKS DISPONIBLES

### useAuthNavigation
```javascript
const {
  requireAuth,           // Ejecutar si autenticado
  navigateIfAuthenticated, // Navegar si autenticado
  isAuthenticated
} = useAuthNavigation();
```

### useNavigationModal
```javascript
const {
  loginModalVisible,
  setLoginModalVisible,
  showLoginModal,
  closeLoginModal,
  pendingAction,
  getPendingAction,
  clearPendingAction
} = useNavigationModal();
```

### useAuth (Ya existente)
```javascript
const {
  usuario,
  accessToken,
  isAuthenticated,
  login,
  registro,
  logout,
  loading
} = useAuth();
```

## 🎨 CONSTANTES CLAVE

```javascript
// src/constantes/colores.js
COLORES.primario      // Color principal
COLORES.dorado        // Dorado
COLORES.error         // Rojo
COLORES.exito         // Verde
COLORES.fondoBlanco   // Blanco
COLORES.fondoGris     // Gris claro
COLORES.textoOscuro   // Texto dark

// src/constantes/estilos.js
TIPOGRAFIA.fontSizeHeading    // Título
TIPOGRAFIA.fontSizeMedium     // Texto normal
TIPOGRAFIA.fontWeightBold     // Bold
DIMENSIONES.padding           // Padding estándar
DIMENSIONES.borderRadius      // Border radius
```

## 🔍 DEBUG

### Ver acciones pendientes
```javascript
// En LoginModalContainer.js
console.log('🎯 Acción pendiente:', pendingAction);
```

### Verificar modal
```javascript
// En useAuthNavigation.js
console.log('🔐 showLoginModal llamado:', actionName);
```

### Logs en HomeScreen
```javascript
useEffect(() => {
  console.log('🏠 HomeScreen montado');
  console.log('👤 Autenticado:', isAuthenticated);
  console.log('💬 Usuario:', usuario?.nombre);
}, [isAuthenticated, usuario]);
```

## 🚨 ERRORES COMUNES

| Error | Solución |
|-------|----------|
| "useNavigationModal is not a function" | Verifica NavigationProvider en App.js |
| Modal no aparece | Verifica showLoginModal se llama en requireAuth |
| Acción no se ejecuta | Revisa clearPendingAction en LoginModalContainer |
| componente no existe | Verifica path del import (../../ correctamente) |
| isAuthenticated siempre false | Espera a que loading === false en App.js |

## 📝 ESTRUCTURA APP.JS

```javascript
<Provider store={store}>
  <PersistGate>
    <AuthProvider>              ← Aquí está el usuario
      <NavigationProvider>      ← Aquí está el modal
        <SafeAreaProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </NavigationProvider>
    </AuthProvider>
  </PersistGate>
</Provider>
```

## 🔄 MODIFICACIONES MÍNIMAS

Si necesitas proteger una acción:

```javascript
// ANTES
const handleAccion = () => {
  // hacer algo
};

// DESPUÉS
const handleAccion = () => {
  const { requireAuth } = useAuthNavigation();
  requireAuth(() => {
    // hacer algo
  }, 'miAccion');
};
```

Solo 3 líneas de cambio.

## 🧪 TEST RÁPIDO

1. **Test modo invitado:**
   ```bash
   npm start
   # No hacer login, navegar por app
   # Intentar favorito → debe mostrar modal
   ```

2. **Test modo autenticado:**
   ```bash
   npm start
   # Hacer login
   # Navegar por app
   # Intentar acción → debe ejecutarse directo
   ```

3. **Test acción pendiente:**
   ```bash
   npm start
   # Invitado intenta favorito
   # LoginModal aparece
   # Presiona "Registrarse"
   # Completar registro
   # Volver a habitación → favorito guardado
   ```

## 📞 REFERENCIAS RÁPIDAS

| Necesito | Archivo |
|----------|---------|
| Cambiar texto modal | `LoginModal.js` |
| Cambiar imagen hero | `HeroBannerHome.js` línea 25 |
| Añadir filtros | `FiltrosRapidos.js` opcionesDefault |
| Personalizar colores | `constantes/colores.js` |
| Ver flujo navegación | `AppNavigator.js` |
| Lógica autenticación | `contexto/AuthContext.js` |
| Contextoimpresas | `contexto/NavigationContext.js` |

## 💾 GUARDAR CAMBIOS

```bash
# Si uses git
git add .
git commit -m "Feat: Modo invitado y UI mejorada"
git push

# Si modificas:
# - Colores → actualiza en constantes/colores.js
# - Tipografía → actualiza en constantes/estilos.js
# - Rutas → actualiza en navegacion/
# - Servicios → No tocar (backend intacto)
```

## 🎯 OBJETIVOS CUMPLIDOS

- ✅ Invitados navegan sin login
- ✅ Modal no invasivo
- ✅ Acciones persistentes
- ✅ UI profesional
- ✅ Responsive
- ✅ Documentado
- ✅ Sin breaking changes
- ✅ Listo para producción

---

**Última actualización:** Enero 28, 2026
**Estado:** ✅ Completado
**Mantenedor:** Tu Equipo
