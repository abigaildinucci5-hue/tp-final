# 🎯 CÓMO INICIAR GOOGLE OAUTH CON DEEP LINKING

**Documento:** Implementación práctica del botón Google Login  
**Fecha:** 23 Feb 2026

---

## 🔌 OPCIÓN 1: Usa WebBrowser (Más simple - Recomendado)

### En LoginScreen

```javascript
// frontend/src/pantallas/auth/LoginScreen.js
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

const LoginScreen = () => {
  // ...

  const handleGoogleLogin = async () => {
    try {
      // Detectar si es web o mobile
      const isWeb = typeof window !== 'undefined';
      
      let googleAuthUrl;
      
      if (isWeb) {
        // Web: sin ?platform=mobile
        googleAuthUrl = 'http://localhost:3000/api/auth/google';
      } else {
        // Mobile: agregar ?platform=mobile
        const backendUrl = 'http://localhost:3000'; // Local dev
        // O en producción: 'https://tu-backend.com'
        googleAuthUrl = `${backendUrl}/api/auth/google?platform=mobile`;
      }

      // Abrir navegador embebido
      await WebBrowser.openBrowserAsync(googleAuthUrl);
      
    } catch (error) {
      console.error('Error al abrir Google OAuth:', error);
    }
  };

  return (
    // JSX
    <TouchableOpacity onPress={handleGoogleLogin}>
      <Text>Inicia sesión con Google</Text>
    </TouchableOpacity>
  );
};
```

---

## 🔌 OPCIÓN 2: Usa expo-auth-session (Más robusto)

### En LoginScreen

```javascript
// frontend/src/pantallas/auth/LoginScreen.js
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

// Necesita estar fuera del componente
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = () => {
  const discovery = useAutoDiscovery('https://accounts.google.com');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'TU_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      redirectUrl: AuthSession.makeRedirectUrl({
        scheme: 'hotelunaserenamobile',
        path: 'auth',
      }),
      scopes: ['openid', 'profile', 'email'],
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { access_token } = response.params;
      // Enviar access_token a tu backend para intercambiar
      // por accessToken y refreshToken
      console.log('Code:', response.params.code);
    }
  }, [response]);

  return (
    <TouchableOpacity 
      onPress={() => promptAsync()}
      disabled={!request}
    >
      <Text>Inicia sesión con Google</Text>
    </TouchableOpacity>
  );
};
```

---

## 🔌 OPCIÓN 3: URL Manual (Simple, funciona siempre)

### En LoginScreen

```javascript
// frontend/src/pantallas/auth/LoginScreen.js
import * as Linking from 'expo-linking';

const LoginScreen = () => {
  const handleGoogleLogin = async () => {
    try {
      // Construir URL de OAuth con ?platform=mobile
      const scheme = Linking.createURL('/');
      const backendUrl = 'http://localhost:3000'; // O tu URL
      
      const googleAuthUrl = `${backendUrl}/api/auth/google?platform=mobile`;
      
      // Abrir en navegador
      await Linking.openURL(googleAuthUrl);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleGoogleLogin}>
      <Text>Google Login</Text>
    </TouchableOpacity>
  );
};
```

---

## 🔴 IMPORTANTE: Diferencia Web vs Mobile

### Web
```javascript
// EN WEB (browser):
const googleAuthUrl = 'http://localhost:3000/api/auth/google';
// ❌ NO incluir ?platform=mobile
// El backend redirige a: http://localhost:8081?token=...
```

### Mobile
```javascript
// EN MOBILE (Expo/APK):
const googleAuthUrl = 'http://localhost:3000/api/auth/google?platform=mobile';
// ✅ INCLUIR ?platform=mobile
// El backend redirige a: hotelunaserenamobile://auth?token=...
```

### Código que lo detecta automáticamente:
```javascript
const isWeb = typeof window !== 'undefined';

const googleAuthUrl = isWeb
  ? 'http://localhost:3000/api/auth/google'
  : 'http://localhost:3000/api/auth/google?platform=mobile';

await Linking.openURL(googleAuthUrl);
```

---

## 🎬 FLUJO COMPLETO (QUÉ PASA DETRÁS)

### PASO 1: Usuario hace click
```javascript
// LoginScreen.js
const handleGoogleLogin = async () => {
  const url = 'http://localhost:3000/api/auth/google?platform=mobile';
  await Linking.openURL(url);
};
```

### PASO 2: Backend inicia Passport
```javascript
// backend/rutasAuth.js (GET /api/auth/google)
router.get('/google', 
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// 🔴 IMPORTANTE: Los query params (?platform=mobile) 
// se pierden en el redirect de Passport
// Solución: Guardar en session o header
```

### PASO 3: Google redirige a callback
```javascript
// Google redirige a:
// http://localhost:3000/api/auth/google/callback?code=...&state=...
// (¡el ?platform=mobile se perdió!)
```

### PASO 4: Backend recibe callback sin platform
```javascript
// El req.query.platform ya no existe 😞
// porque Google lo encapsuló en ?code= 

// PROBLEMA: ¿Cómo sabe el backend si es mobile?
```

---

## 🔧 SOLUCIÓN: Pasar platform a través de session/cookies

### Opción A: Guardar en session antes de OAuth

```javascript
// backend/rutasAuth.js
router.get('/google', (req, res, next) => {
  // Guardar platform en session
  if (req.query.platform === 'mobile') {
    req.session.oauthPlatform = 'mobile';
  } else {
    req.session.oauthPlatform = 'web';
  }
  
  // Continuar con OAuth
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

// En googleCallback:
const isMobile = req.session.oauthPlatform === 'mobile';
// ✅ Ahora funciona!
```

### Opción B: Usar state parameter (Recomendado)

```javascript
// backend/rutasAuth.js
router.get('/google', (req, res, next) => {
  const state = Date.now().toString();
  
  // Guardar platform con state como clave
  stateToPlataform[state] = req.query.platform || 'web';
  
  // Pasar state en OAuth
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state: state
  })(req, res, next);
});

// En googleCallback:
const state = req.query.state;
const isMobile = stateToPlataform[state] === 'mobile';
// ✅ Limpio y seguro!
```

---

## ⚠️ PROBLEMA CON QUERY PARAMS EN OAUTH

La razón por la que `?platform=mobile` se pierde:

```
1. Frontend: http://localhost:3000/api/auth/google?platform=mobile
2. Backend /api/auth/google: 
   - Recibe: req.query.platform = 'mobile' ✅
   - Luego redirige a Google

3. Google: Maneja el redirect y redirige de vuelta a CALLBACK URL
   - Redirige a: /api/auth/google/callback?code=...&state=...
   - ❌ El ?platform=mobile se perdió!

4. Backend /api/auth/google/callback:
   - Recibe: req.query.platform = undefined ❌
```

---

## ✅ SOLUCIÓN CORRECTA: Usar session o redis

### Implementación en backend:

```javascript
// backend/rutasAuth.js
const router = require('express').Router();

router.get('/google', (req, res, next) => {
  console.log('📱 Detectado platform:', req.query.platform);
  
  // Guardar en session
  req.session.oauthPlatform = req.query.platform || 'web';
  req.session.save();
  
  // Continuar con OAuth
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});

router.get('/google/callback',
  (req, res, next) => {
    console.log('📱 oauthPlatform recuperado:', req.session.oauthPlatform);
    next();
  },
  passport.authenticate('google', { session: false }),
  googleCallback
);

// En googleCallback:
const googleCallback = asyncHandler(async (req, res) => {
  const usuario = req.user;
  
  // ✅ Recupera el platform desde session
  const isMobile = req.session.oauthPlatform === 'mobile';
  
  let redirectUrl;
  if (isMobile) {
    redirectUrl = `hotelunaserenamobile://auth?token=${token}&refresh=${refresh}`;
  } else {
    redirectUrl = `http://localhost:8081?token=${token}&refresh=${refresh}`;
  }
  
  res.redirect(redirectUrl);
});
```

---

## 📋 CAMBIOS A HACER EN BACKEND

### Modificar rutasAuth.js

```javascript
// ANTES:
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

// DESPUÉS:
router.get('/google', (req, res, next) => {
  req.session.oauthPlatform = req.query.platform || 'web';
  req.session.save();
  
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
});
```

### Modificar googleCallback en controladorAuth.js

```javascript
// ANTES:
const isMobile = req.query.platform === 'mobile';

// DESPUÉS:
const isMobile = req.session.oauthPlatform === 'mobile';
```

---

## 🎯 RESUMEN: QUÉ HACER AHORA

### ✅ Ya hecho (Backend):
- [x] googleCallback bifurca redirect web/mobile
- [x] githubCallback bifurca redirect web/mobile

### ⏳ Pendiente (Backend):
- [ ] Guardar `platform` en session en GET /api/auth/google
- [ ] Recuperar `platform` desde session en googleCallback

### ✅ Ya hecho (Frontend):
- [x] App.js configure deep linking
- [x] useGoogleAuthCallback captura tokens
- [x] Hook guarda en AsyncStorage
- [x] Hook navega a MainStack

### ⏳ Pendiente (Frontend):
- [ ] Implementar botón Google OAuth en LoginScreen
- [ ] Agregar `?platform=mobile` a la URL en mobile
- [ ] Probar en Expo Go

---

## 🚀 SIGUIENTE: Actualizar Backend para session

¿Quieres que modifique el backend para guardar platform en session?
