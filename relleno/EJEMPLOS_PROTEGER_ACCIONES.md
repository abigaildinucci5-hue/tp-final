// EJEMPLOS DE USO - Protegiendo acciones en otros componentes

## 1. PROTEGER BOTÓN DE FAVORITO (Ya implementado correctamente)

En BotonFavorito.js - Ejemplo de cómo se usa requireAuth:

```javascript
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

const BotonFavorito = ({ esFavorito, onPress }) => {
  const { requireAuth } = useAuthNavigation();

  const handlePress = () => {
    // Si el usuario no está autenticado, muestra el modal
    // Si está autenticado, ejecuta la función onPress
    requireAuth(() => {
      onPress && onPress();
    }, 'addFavorite', { habitacionId: habitacionId });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <MaterialCommunityIcons
        name={esFavorito ? 'heart' : 'heart-outline'}
        size={28}
        color={esFavorito ? COLORES.error : COLORES.textoBlanco}
      />
    </TouchableOpacity>
  );
};
```

## 2. PROTEGER BOTÓN DE RESERVAR

En DetalleHabitacionScreen.js o NuevaReservaScreen.js:

```javascript
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

const DetalleHabitacionScreen = ({ route, navigation }) => {
  const { requireAuth } = useAuthNavigation();
  const habitacionId = route.params?.id;

  const handleReservarsPress = () => {
    requireAuth(() => {
      navigation.navigate('NuevaReserva', { habitacionId });
    }, 'createReserva', { habitacionId });
  };

  return (
    <View>
      {/* Resto del contenido */}
      <TouchableOpacity 
        style={estilos.botonReserva}
        onPress={handleReservasPress}
      >
        <Text>Reservar Ahora</Text>
      </TouchableOpacity>
    </View>
  );
};
```

## 3. PROTEGER ACCESO A NOTIFICACIONES

En HeaderApp.js o PerfilScreen.js:

```javascript
const handleNotificacionesPress = () => {
  const { requireAuth } = useAuthNavigation();
  
  requireAuth(() => {
    navigation.navigate('Notificaciones');
  }, 'viewNotifications');
};
```

## 4. PROTEGER ACCESO AL PERFIL

En MainNavigator.js o cuando se navega al perfil:

```javascript
const handlePerfilPress = () => {
  const { requireAuth, navigateIfAuthenticated } = useAuthNavigation();
  
  // Opción 1: Usar navigateIfAuthenticated
  navigateIfAuthenticated('Perfil');
  
  // Opción 2: Usar requireAuth
  requireAuth(() => {
    navigation.navigate('Perfil');
  }, 'viewProfile');
};
```

## 5. PROTEGER COMENTARIOS

Si hay funcionalidad de comentarios:

```javascript
const handleAñadirComentario = (nuevoComentario) => {
  const { requireAuth } = useAuthNavigation();
  
  requireAuth(async () => {
    try {
      await comentariosService.crear(habitacionId, nuevoComentario);
      // Refrescar comentarios
      cargarComentarios();
    } catch (error) {
      console.error('Error al comentar:', error);
    }
  }, 'addComment', { habitacionId, comentario: nuevoComentario });
};
```

## 6. PROTEGER EDICIÓN DE PERFIL

En EditarPerfilScreen.js:

```javascript
const handleGuardarCambios = () => {
  const { requireAuth } = useAuthNavigation();
  
  requireAuth(async () => {
    try {
      await usuariosService.actualizarPerfil(datosPerfil);
      navigation.goBack();
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  }, 'updateProfile', { datosPerfil });
};
```

## 7. USAR EN COMPONENTES FUNCIONALES

Ejemplo genérico de componente que necesita protección:

```javascript
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { useAuthNavigation } from '../../hooks/useAuthNavigation';

const MiComponente = ({ onAccionProtegida }) => {
  const { requireAuth } = useAuthNavigation();

  const handleAccion = () => {
    requireAuth(() => {
      // Aquí va la lógica que requiere autenticación
      onAccionProtegida?.();
    }, 'miAccion', { param1: 'valor1' });
  };

  return (
    <TouchableOpacity onPress={handleAccion}>
      <Text>Hacer algo protegido</Text>
    </TouchableOpacity>
  );
};

export default MiComponente;
```

## PARÁMETROS DE requireAuth()

```javascript
requireAuth(
  callback,              // Función a ejecutar si está autenticado
  actionName,           // Nombre de la acción para debugging (opcional)
  actionParams          // Parámetros de la acción (opcional)
);
```

Ejemplos:
- requireAuth(() => reservar(), 'makeReservation', { roomId: 5 })
- requireAuth(() => addFavorite(), 'addFavorite', { roomId: 5 })
- requireAuth(() => viewProfile())

## PARÁMETROS DE navigateIfAuthenticated()

```javascript
navigateIfAuthenticated(
  screenName,           // Nombre de la pantalla
  params               // Parámetros de navegación (opcional)
);
```

Ejemplos:
- navigateIfAuthenticated('Perfil')
- navigateIfAuthenticated('Notificaciones', { unreadOnly: true })

## MENSAJES PERSONALIZADOS EN EL MODAL

Si quieres cambiar el mensaje que aparece en el modal, puedes:

Opción 1: Usar NavigationContext directamente
```javascript
const { showLoginModal } = useNavigationModal();

showLoginModal('addFavorite', { roomId: 5 }, 'Home');
```

Opción 2: Personalizar en LoginModalContainer.js
- Cambiar el mensaje dinámicamente según el actionName
- Ejemplo: si action === 'addFavorite', mostrar "Inicia sesión para añadir a favoritos"

## RESUMEN DE COMPONENTES QUE NECESITAN PROTECCIÓN

- [x] BotonFavorito (Ya protegido)
- [ ] Botón Reservar en DetalleHabitacion
- [ ] Acceso a Perfil desde Header
- [ ] Acceso a Notificaciones
- [ ] Acceso a Comentarios (si existe)
- [ ] Edición de Perfil
- [ ] Cancelación de Reserva
- [ ] Cualquier otra acción que requiera login

## TESTING CON DIFERENTES ESCENARIOS

### Escenario 1: Invitado intenta favorito
1. App abierta sin login
2. Buscar habitación
3. Presionar corazón
4. → LoginModal aparece
5. Presionar "Registrarse"
6. → Auth navigator abre Registro
7. Completar registro
8. → Volver a habitación automáticamente
9. Corazón ya marcado (acción ejecutada)

### Escenario 2: Autenticado intenta favorito
1. Usuario logueado
2. Buscar habitación
3. Presionar corazón
4. → Se ejecuta directamente (sin modal)
5. Corazón se marca
6. No hay redirección

### Escenario 3: Invitado cancela modal
1. App abierta sin login
2. Intenta acción protegida
3. LoginModal aparece
4. Presiona "Volver atrás" (X)
5. Modal se cierra
6. Usuario permanece en misma pantalla
7. No hay redirección

## DEBUGGING

Si necesitas debuggear las acciones pendientes:

En LoginModalContainer.js, añade logs:

```javascript
React.useEffect(() => {
  if (isAuthenticated && pendingAction && loginModalVisible) {
    console.log('🎯 Ejecutando acción pendiente:', pendingAction);
    // ... resto del código
  }
}, [isAuthenticated, pendingAction, loginModalVisible, ...]);
```

En useAuthNavigation.js, añade logs:

```javascript
const requireAuth = useCallback(
  (action, actionName = null, actionParams = null) => {
    if (!isAuthenticated) {
      console.log('🔐 Mostrando modal - Acción:', actionName, 'Params:', actionParams);
      showLoginModal(actionName, actionParams, navigation.getState()?.routes?.[0]?.name);
      return;
    }
    console.log('✅ Usuario autenticado, ejecutando acción:', actionName);
    action && action();
  },
  [isAuthenticated, navigation, showLoginModal]
);
```
