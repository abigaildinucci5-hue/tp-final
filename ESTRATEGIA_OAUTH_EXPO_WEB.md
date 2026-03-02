# 🔐 ESTRATEGIA GOOGLE OAUTH - EXPO SDK 54 + WEB + APK

**Fecha:** Febrero 23, 2026  
**Versión:** Expo SDK 54  
**Objetivo:** OAuth funcional en Web, Expo Go, y APK final

---

## 📊 1. ESTADO ACTUAL - AUDITORÍA COMPLETADA

### ✅ Backend - CORRECTO y LISTO

**Archivo:** `backend/server.js` (Línea 31)
```javascript
app.set('trust proxy', 1);  // ✅ YA CONFIGURADO
```
**Estado:** CORRECTO - No hay problemas con Railway proxy

---

**Archivo:** `backend/src/rutas/rutasAuth.js` (Líneas 94-107)
```javascript
// GET /api/auth/google/callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:8081'}?error=google_auth_failed`
  }),
  googleCallback  // ← Controlador que maneja la respuesta
);
```

**Archivo:** `backend/src/controladores/controladorAuth.js` (Líneas 169-219)
```javascript
const googleCallback = asyncHandler(async (req, res) => {
  try {
    const usuario = req.user;

    if (!usuario) {
      return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);
    }

    // Generar tokens (accessToken + refreshToken)
    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);
    
    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {...});

    // ✅ MÉTODO ACTUAL: REDIRECT CON QUERY PARAMS
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;
    
    res.redirect(redirectUrl);  // ← FUNCIONA EN WEB
  } catch (error) {
    res.redirect(`${frontendUrl}?error=auth_error`);
  }
});
```

**Status:** ✅ FUNCIONAL PARA WEB (redirect funciona)

---

### 🔑 Configuración OAuth en config/oauth.js

```javascript
new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 
      'https://tp-final-production-9e41.up.railway.app/api/auth/google/callback',
    passReqToCallback: true,
  },
  // ... lógica de obtener/crear usuario ...
);
```

**Status:** ✅ CORRECTO - Tiene fallback a Railway URL

---

## 🎯 2. PROBLEMA CON EXPO

En Expo/React Native NO podemos hacer un `res.redirect()` HTTP tradicional porque:

1. **No hay navegador** - El redirect HTTP se pierde
2. **No hay ventana emergente** - No se captura el flujo
3. **Deep linking requerido** - Necesitamos usar esquema personalizado

### Soluciones disponibles:

#### ❌ Opción 1: Mantener actual (solo web)
- Web funciona ✅
- Expo no funciona ❌
- APK no funciona ❌

#### ⚠️ Opción 2: Usar expo-auth-session (sin backend)
- Expone cliente secret al frontend ❌
- Backend no es fuente de verdad ❌
- Más riesgoso para seguridad ❌

#### ✅ Opción 3: Mantener backend + adaptar para Expo (RECOMENDADO)
- Backend como fuente de verdad ✅
- Web funciona igual ✅
- Expo funciona con deep linking ✅
- Más seguro ✅

---

## 💡 3. ESTRATEGIA RECOMENDADA - HYBRID

### Cómo Funciona

#### WEB (Actual):
```
1. Usuario hace click en "Google Login"
2. Frontend redirige a: /api/auth/google
3. Google redirige a callback: /api/auth/google/callback
4. Backend genera tokens y hace: res.redirect(frontend_url?token=...&refresh=...)
5. Frontend captura en URL y guarda tokens
```

#### EXPO/APK (Nueva):
```
1. Usuario hace click en "Google Login"
2. expo-auth-session abre navegador embebido
3. Usuario enlaza con Google
4. Google redirige a: exp://... o hotellunaserena://
5. Nativo intercepta el deep link
6. Frontend extrae token de URL
7. Guarda token en AsyncStorage
```

### Cambios Necesarios en Backend

**Detectar si es mobile y devolver diferente:**

```javascript
const googleCallback = asyncHandler(async (req, res) => {
  // ... generar tokens ...

  // ✅ NUEVO: Detectar si es mobile
  const isMobile = req.headers['user-agent']?.includes('Expo') || 
                   req.query.platform === 'mobile';

  if (isMobile) {
    // Para Expo: devolver tokens en query params de deep link
    const deepLinkUrl = `exp://localhost:8081/--/auth?token=${accessToken}&refresh=${refreshToken}`;
    // O en producción: `hotellunaserena://auth?token=${accessToken}&refresh=${refreshToken}`
    res.redirect(deepLinkUrl);
  } else {
    // Para web: mantener igual
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
    const redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;
    res.redirect(redirectUrl);
  }
});
```

---

## 🛠️ 4. IMPLEMENTACIÓN ESPECÍFICA PARA EXPO SDK 54

### Frontend - React Navigation Deep Linking

**Archivo:** `frontend/src/contexto/NavigationContext.js` (O similar)

```javascript
// Configurar deep linking para capturar tokens de OAuth
export const linking = {
  prefixes: ['exp://localhost:8081', 'exp://', 'hotellunaserena://'],
  config: {
    screens: {
      auth: 'auth?token=:token&refresh=:refresh',
      // ... otras rutas
    },
  },
};
```

**Archivo:** `frontend/App.js` (En NavigationContainer)

```javascript
<NavigationContainer linking={linking}>
  <AppNavigator />
</NavigationContainer>
```

**Archivo:** `frontend/src/pantallas/auth/LoginScreen.js`

```javascript
export const screenOptions = ({ route, navigation }) => {
  // Interceptar deep link con tokens
  React.useEffect(() => {
    const params = route.params;
    if (params?.token && params?.refresh) {
      // OAuth exitoso - guardar tokens
      dispatch(setAuthTokens({
        accessToken: params.token,
        refreshToken: params.refresh,
      }));
      // Limpiar params
      navigation.setParams({ token: undefined, refresh: undefined });
    }
  }, [route.params, dispatch, navigation]);
};
```

---

## 📱 5. GOOGLE CLOUD CONSOLE - CONFIGURACIÓN REQUERIDA

### Authorized Redirect URIs necesarios:

```
✅ https://tp-final-production-9e41.up.railway.app/api/auth/google/callback
✅ http://localhost:3000/api/auth/google/callback
✅ http://127.0.0.1:3000/api/auth/google/callback
✅ exp://localhost:8081
✅ exp://localhost:8081/--/auth
✅ hotellunaserena://auth (cuando generates APK)
```

### Verificar en Google Cloud Console:

1. Ir a: Cloud Console → OAuth 2.0 Client IDs
2. Buscar: "Hotel Luna Serena" (o tu app)
3. Click en aplicación
4. Scroll a "Authorized redirect URIs"
5. Agregar URLs si faltan
6. **Guardar cambios**

### Authorized JavaScript Origins:

```
✅ http://localhost:3000
✅ http://localhost:8081
✅ http://127.0.0.1:3000
✅ http://127.0.0.1:8081
✅ https://tp-final-production-9e41.up.railway.app
```

---

## 🚀 6. COMANDO APK - SHA-1 PARA GOOGLE OAUTH

Para que OAuth funcione en APK, necesitas registrar el certificado SHA-1:

```bash
# Generar SHA-1 del debug certificate
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Para producción (después de build con EAS):
eas build --platform android

# Luego, en Google Cloud:
# 1. Ir a: Project Settings → App (Android)
# 2. SHA-1 certificate fingerprint → Pegar el SHA-1
# 3. Guardar
```

---

## 📋 7. CHECKLIST DE IMPLEMENTACIÓN

### Backend
- [x] `app.set('trust proxy', 1)` ya configurado
- [x] googleCallback genera tokens correctamente
- [ ] **Modificar googleCallback para detectar mobile** (TODO)
- [ ] **Agregar ruta alternativa: POST /api/auth/google/mobile** (TODO)
- [ ] Verificar env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET

### Frontend
- [ ] Configurar linking en NavigationContainer
- [ ] Crear unidad para capturar tokens desde deep link
- [ ] Implementar login con expo-auth-session
- [ ] Guardar tokens en AsyncStorage o Redux
- [ ] Manejar errores de OAuth

### Google Cloud
- [ ] Agregar todos los Redirect URIs
- [ ] Agregar todos los JavaScript Origins
- [ ] (Después de APK) Agregar SHA-1 fingerprint

### Testing
- [ ] [ ] Probar en web (http://localhost:8081)
- [ ] Probar en Expo Go (exp://localhost:8081)
- [ ] Probar APK en dispositivo real
- [ ] Verificar tokens se guardan correctamente
- [ ] Verificar que se puede acceder a pantalla de usuario

---

## 💾 8. EJEMPLO COMPLETO - FLUJO EN CÓDIGO

### Backend - googleCallback MEJORADO

```javascript
const googleCallback = asyncHandler(async (req, res) => {
  try {
    console.log('🎯 Google OAuth Callback');
    const usuario = req.user;

    if (!usuario) {
      const errorUrl = `${process.env.FRONTEND_URL}?error=auth_failed`;
      return res.redirect(errorUrl);
    }

    // Generar tokens
    const payload = {
      id: usuario.id_usuario,
      email: usuario.email,
      rol: usuario.rol
    };

    const accessToken = generarAccessToken(payload);
    const refreshToken = generarRefreshToken(payload);

    await guardarToken(usuario.id_usuario, accessToken, refreshToken, {
      dispositivo: 'web',
      ip: req.ip
    });

    await ModeloUsuario.actualizarUltimoAcceso(usuario.id_usuario);

    // ✅ NUEVO: Detectar if is mobile
    const userAgent = req.headers['user-agent'] || '';
    const isMobileApp = userAgent.includes('Expo') || 
                        userAgent.includes('React Native') ||
                        req.query.platform === 'mobile';

    // Construir URL de redirección
    let redirectUrl;
    
    if (isMobileApp) {
      // Deep link para Expo/APK
      const scheme = process.env.EXPO_SCHEME || 'exp://localhost:8081';
      redirectUrl = `${scheme}/--/login?token=${accessToken}&refresh=${refreshToken}`;
    } else {
      // URL web normal
      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
      redirectUrl = `${frontendUrl}/login?token=${accessToken}&refresh=${refreshToken}`;
    }

    console.log(`🔗 Redirigiendo a: ${redirectUrl}`);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error('❌ Error en Google callback:', error);
    const errorUrl = `${process.env.FRONTEND_URL}?error=auth_error`;
    res.redirect(errorUrl);
  }
});
```

### Frontend - useOAuthCallback Hook

```javascript
// frontend/src/hooks/useOAuthCallback.js
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAuthTokens } from '../redux/slices/authSlice';

export const useOAuthCallback = () => {
  const route = useRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = route.params;
      
      if (params?.token && params?.refresh) {
        try {
          // Guardar tokens
          await AsyncStorage.multiSet([
            ['accessToken', params.token],
            ['refreshToken', params.refresh],
          ]);

          // Actualizar Redux
          dispatch(setAuthTokens({
            accessToken: params.token,
            refreshToken: params.refresh,
          }));

          console.log('✅ OAuth tokens guardados');

          // Limpiar params
          route.params = {};
        } catch (error) {
          console.error('❌ Error guardando tokens:', error);
        }
      }

      if (params?.error) {
        console.error('❌ OAuth error:', params.error);
      }
    };

    handleOAuthCallback();
  }, [route.params, dispatch]);
};
```

---

## 🎯 9. RESUMEN - QUÉ HACER AHORA

### OPCIÓN A: Mantener como está (Solo Web)
- ✅ Rápido (0 cambios)
- ❌ Expo/APK no funciona

### OPCIÓN B: Implementar full Expo support (RECOMENDADO)
1. Modificar `googleCallback` en backend (agregar detección mobile)
2. Configurar deep linking en `NavigationContainer`
3. Implementar `useOAuthCallback` en frontend
4. Agregar redirect URIs en Google Cloud
5. Testar en Expo Go
6. Generar APK y probar

### Tiempo estimado: 2-3 horas

---

## 📞 CONCLUSIÓN

**Status actual:**
- ✅ Backend está PERFECTO y listo
- ✅ Trust proxy ya configurado
- ✅ Tokens se generan correctamente
- ⚠️ Solo falta adaptación para mobile

**Recomendación:**
Implementar Opción B (Hybrid) - es mínimo cambio, máximo beneficio.

El backend no necesita gran refactorización, solo detectar mobile en callback y cambiar URL de redirect.

Frontend solo necesita interceptar deep link y guardar tokens.

