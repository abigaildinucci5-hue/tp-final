# 🎯 INSTRUCCIONES INMEDIATAS - Ejecutar la App

## El Problema (¿Qué pasó?)
Tu app no iniciaba porque:
1. **Bug crítico:** `AuthContext.js` usaba `AsyncStorage` sin importarlo
2. **Metro no sabía transpile bien:** Faltaba configuración en `metro.config.js`
3. **Babel incompleto:** Le faltaban plugins necesarios
4. **URL de API conflictiva:** Hay dos URLs de Railway diferentes en el código

## La Solución (Ya está hecha)
He reparado los 4 archivos principales. Ahora necesitas hacer lo siguiente:

---

## ⚡ PASOS A SEGUIR (En orden)

### Paso 1: Detener Expo (si está corriendo)
```powershell
# Presiona Ctrl + C en la terminal donde corre Expo
```

### Paso 2: Limpiar caché
```powershell
cd d:\TP-final\frontend
npx expo start --clear
```

### Paso 3: Cuando te pregunte, selecciona WEB
```
? Select an app to open... (Use arrow keys)
❯ web
  android
  ios
```

### Paso 4: Esperar loading
La primera carga tarda ~30 segundos. Verás:
```
[dev] Connected to React Native bundler
...
(esperando)
```

### Paso 5: Si abre el navegador
✅ **Éxito:** Si ves la app (aunque sea con pantalla blanca), vamos bien

---

## 🐛 Troubleshooting: Si SIGUE sin funcionar

### Problema 1: Sigue viendo pantalla blanca
**Solución:**
1. Abre DevTools (F12)
2. Ve a **Console**
3. Busca errores en rojo
4. Copia el primer error y envíamelo

### Problema 2: Error "Failed to start watch mode"
**Solución:**
```powershell
# Kill todos los procesos node
taskkill /F /IM node.exe
cd d:\TP-final\frontend
npm install
npx expo start --clear
```

### Problema 3: Error CORS o "Cannot reach backend"
**Solución:**
- Verifica que Railway esté activo: https://tp-final-production-a1f6.up.railway.app/ping
- Si dice "pong", el backend está bien
- Si no, el backend en Railway está caído

### Problema 4: Error de tipo "AsyncStorage is undefined"
✅ **Ya está solucionado** en AuthContext.js

---

## 📍 URLs Importantes

| Servicio | URL |
|----------|-----|
| API Backend | https://tp-final-production-a1f6.up.railway.app/api |
| Ping del backend | https://tp-final-production-a1f6.up.railway.app/api/ping |
| Expo Local (debe estar corriendo) | http://localhost:8081 |

---

## 💾 Archivos Modificados (para tu referencia)

```
frontend/
├── src/
│   ├── contexto/
│   │   └── AuthContext.js ✏️ (Línea 45: AsyncStorage → storage.set)
│   └── hooks/
│       └── useGoogleAuthCallback.js ✏️ (Línea 56: URL simplificada)
├── babel.config.js ✏️ (Agregados plugins)
└── metro.config.js ✏️ (Configuración mejorada)
```

---

## ✅ Checklist Final

- [ ] Detuve Expo (Ctrl+C)
- [ ] Ejecuté `npx expo start --clear`
- [ ] Seleccioné "web"
- [ ] El navegador intentó abrir (aunque sea con error)
- [ ] Abrí DevTools (F12) para ver errores específicos
- [ ] Probé ping al backend: https://tp-final-production-a1f6.up.railway.app/api/ping

---

**Si sigues teniendo problemas, ejecuta esto y envíame la pantalla:**
```powershell
cd d:\TP-final\frontend
npm start
# Espera 30 segundos
# Si hay error, copia todo lo que sale en rojo
```
