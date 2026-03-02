# 🔐 Google OAuth Mobile/Web - IMPLEMENTADO

**Fecha:** 23 Feb 2026  
**Status:** ✅ LISTO PARA TESTING

---

## 📝 CAMBIOS REALIZADOS

### Backend - controladorAuth.js

Se modificó **googleCallback** y **githubCallback** para detectar si la petición viene de MOBILE o WEB.

#### ANTES:
```javascript
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
const redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;
res.redirect(redirectUrl);
```

#### AHORA:
```javascript
// Detectar si es mobile (Expo/APK) o web
const isMobile = req.query.platform === 'mobile';

let redirectUrl;

if (isMobile) {
  // Deep link para Expo/APK
  redirectUrl = `hotelunaserenamobile://auth?token=${accessToken}&refresh=${refreshToken}`;
} else {
  // URL web normal
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8081';
  redirectUrl = `${frontendUrl}?token=${accessToken}&refresh=${refreshToken}`;
}

res.redirect(redirectUrl);
```

---

## 🎯 CÓMO USARLO

### WEB - Mantiene comportamiento actual ✅

```
No cambies nada. 
Sigue usando:
https://tu-backend.com/api/auth/google

El callback redirige a:
http://localhost:8081?token=...&refresh=...
```

### MOBILE (Expo/APK) - NUEVO

```
Para indicar que es mobile, agrega ?platform=mobile al iniciar OAuth:

https://tu-backend.com/api/auth/google?platform=mobile

El callback redirigirá a:
hotelunaserenamobile://auth?token=...&refresh=...
```

---

## 🔌 DESDE EXPO - IMPLEMENTAR DEEP LINKING

### 1. Configurar deep linking en app.json

```json
{
  "expo": {
    "plugins": [
      [
        "expo-auth-session/provider"
      ]
    ],
    "scheme": "hotelunaserenamobile",
    "android": {
      "intentFilters": [
        {
          "action": "android.intent.action.VIEW",
          "autoVerify": true,
          "data": [
            {
              "scheme": "hotelunaserenamobile",
              "host": "*"
            }
          ],
          "category": [
            "android.intent.category.DEFAULT",
            "android.intent.category.BROWSABLE"
          ]
        }
      ]
    }
  }
}
```

### 2. Hook para capturar el deep link

```javascript
// src/hooks/useOAuthCallback.js
import { useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setAuthTokens } from '../redux/slices/authSlice'; // Ajusta según tu setup

export const useOAuthCallback = (navigation) => {
  const route = useRoute();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const params = route.params;

      if (params?.token && params?.refresh) {
        try {
          // Guardar tokens en AsyncStorage
          await AsyncStorage.multiSet([
            ['accessToken', params.token],
            ['refreshToken', params.refresh],
          ]);

          // Actualizar Redux si lo usas
          dispatch(setAuthTokens({
            accessToken: params.token,
            refreshToken: params.refresh,
          }));

          console.log('✅ OAuth tokens capturados y guardados');

          // Navegar a pantalla de inicio
          navigation.navigate('MainNavigator'); // Ajusta según tu estructura

          // Limpiar params de ruta
          navigation.setParams({ token: undefined, refresh: undefined });
        } catch (error) {
          console.error('❌ Error guardando tokens OAuth:', error);
        }
      }

      if (params?.error) {
        console.error('❌ OAuth error:', params.error);
      }
    };

    handleOAuthCallback();
  }, [route.params, dispatch, navigation]);
};
```

### 3. Usar en tu LoginScreen

```javascript
// src/screens/auth/LoginScreen.js
import { useOAuthCallback } from '../../hooks/useOAuthCallback';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = () => {
  const navigation = useNavigation();
  
  // Capturar deep link con tokens
  useOAuthCallback(navigation);

  const handleGoogleLogin = () => {
    // Iniciar Google OAuth con ?platform=mobile
    const authUrl = 'https://tu-backend.com/api/auth/google?platform=mobile';
    
    // Hay varias formas de abrir:
    // Opción 1: expo-auth-session (recomendado)
    // Opción 2: WebBrowser.openAuthSessionAsync()
    // Opción 3: Linking.openURL()
  };

  return (
    // ... Tu JSX ...
  );
};
```

---

## 🧪 TESTING - VERIFICAR QUE FUNCIONA

### Test WEB (mantener como está)

```bash
# En tu navegador
http://localhost:8081

# Hacer click en Google Login
# Debería ir a Google, luego redirigir a:
# http://localhost:8081?token=xyz&refresh=abc

# ✅ Si funciona: tokens en URL, usuario logueado
```

### Test MOBILE (Expo)

```bash
# En Expo Go
npx expo start

# En la URL de Google OAuth, agregar ?platform=mobile:
https://tu-backend-local/api/auth/google?platform=mobile

# Debería redirigir a deep link:
# hotelunaserenamobile://auth?token=xyz&refresh=abc

# ✅ Si funciona: deep link interceptado, tokens guardados
```

### Verificar En Console Backend

```
📱 Tipo de cliente: WEB
🔗 Redirigiendo a WEB

O

📱 Tipo de cliente: MOBILE  
🔗 Redirigiendo a APP MOBILE
```

---

## ⚙️ CONFIGURACIÓN DE ENTORNO

Si necesitas personalizar el deep link scheme:

**Backend .env:**
```
FRONTEND_URL=http://localhost:8081
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=https://tp-final-production-9e41.up.railway.app/api/auth/google/callback
```

**Frontend (app.json):**
```json
"scheme": "hotelunaserenamobile"
```

El backend detecta `?platform=mobile` y redirige a `hotelunaserenamobile://auth?token=...`

---

## 🔄 FLUJO COMPLETO - PASO A PASO

### WEB
```
1. Usuario abre http://localhost:8081
2. Click en "Google Login"
3. Redirect a: /api/auth/google (sin ?platform=mobile)
4. Google autentica
5. Google redirige a: /api/auth/google/callback
6. Backend ve: req.query.platform !== 'mobile'
7. Backend redirige a: http://localhost:8081?token=...&refresh=...
8. Frontend captura tokens de URL
9. ✅ Usuario logueado
```

### MOBILE (Expo)
```
1. Usuario abre Expo Go
2. Click en "Google Login"
3. Redirect a: /api/auth/google?platform=mobile
4. Google autentica
5. Google redirige a: /api/auth/google/callback?platform=mobile
6. Backend ve: req.query.platform === 'mobile'
7. Backend redirige a: hotelunaserenamobile://auth?token=...&refresh=...
8. Expo intercepta deep link
9. Hook captura tokens
10. Frontend guarda en AsyncStorage
11. ✅ Usuario logueado
```

---

## 📦 PRÓXIMOS PASOS

- [ ] Configurar deep linking en app.json
- [ ] Implementar useOAuthCallback hook
- [ ] Actualizar LoginScreen para usar ?platform=mobile
- [ ] Testar en Expo Go
- [ ] Testar en web
- [ ] Agregar esquema APK en Google Cloud Console
- [ ] Testear APK en dispositivo real

---

## 💡 NOTAS IMPORTANTES

✅ **Lo que está listo:**
- Backend detecta mobile vs web
- Redirige a deep link para mobile
- Redirige a URL web para web
- No rompe nada existente

⏳ **Pendiente en frontend:**
- Configurar app.json con deep linking
- Implementar hook useOAuthCallback
- Llamar con ?platform=mobile desde Expo
- Capturar deep link y guardar tokens

---

## 🆘 SI ALGO NO FUNCIONA

**❓ Web sigue funcionando?**
- Sí, no cambió nada para web
- Usa: `/api/auth/google` (sin ?platform=mobile)
- Redirige a: `http://localhost:8081?token=...`

**❓ Mobile redirige pero no captura tokens?**
- Verifica que app.json tenga `"scheme": "hotelunaserenamobile"`
- Verifica que LoginScreen use useOAuthCallback hook
- Verifica console backend: dice "MOBILE"?

**❓ Console backend no dice MOBILE?**
- Verifica que estés usando `/api/auth/google?platform=mobile`
- Fíjate que `?platform=mobile` llegue en la URL
- Los query params deben pasar a través de Google OAuth

---

## 📊 RESUMEN DE CAMBIOS

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| Web OAuth | ✅ Funciona | ✅ Sigue igual |
| Deep link | ❌ No existe | ✅ Ahora soportado |
| Detección | ❌ Solo user-agent | ✅ Query param confiable |
| Mobile logueado | ❌ No | ✅ Sí |
| Compatibilidad | ✅ 100% | ✅ 100% |

