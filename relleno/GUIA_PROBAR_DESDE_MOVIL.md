# 📱 GUÍA: PROBAR DESDE MÓVIL EN RED LOCAL

## ¿Qué es esto?
Necesitas probar que tu teléfono puede conectarse al backend que corre en tu PC.

---

## PASO 1: Obtener tu IP de la PC

### En Windows (PowerShell):
```powershell
ipconfig
```
Busca algo como:
```
IPv4 Address.  . . . . . . . . . . . : 192.168.1.100
```

**Anota tu IP**: `192.168.1.X` o `10.0.0.X`

### En Mac/Linux:
```bash
ifconfig
```
Busca `inet` y anota la IP.

---

## PASO 2: Verificar que backend corre en localhost

En tu PC, abre otra terminal:
```bash
curl http://localhost:3000/api/habitaciones
```

Deberías ver: `{"exito":true,"data":[...]}`

Si ves `404` o `Connection refused`, el backend no está corriendo.

---

## PASO 3: Probar desde el móvil EN LA MISMA RED WiFi

### Android (con Termux o Chrome):
1. Abre Chrome en tu teléfono
2. Escribe: `http://192.168.1.X:3000/api/habitaciones` (reemplaza X con tu IP)
3. Deberías ver el mismo JSON que en la PC

### iPhone:
1. Safari → `http://192.168.1.X:3000/api/habitaciones`

---

## PASO 4: Si funciona en el navegador pero NO en Expo Go

El problema es que el frontend no está usando la IP correcta.

Ve a `frontend/src/constantes/config.js` y verifica:
```javascript
BASE_URL: 'http://192.168.1.X:3000/api'  // Reemplaza X
```

---

## PASO 5: Escanear QR en Expo Go

Una vez que todo esté conectado:
1. Abre Expo Go en el móvil
2. Escanea el QR que aparece en la terminal del frontend
3. Debería cargar la app

---

## ⚠️ PROBLEMAS COMUNES

| Problema | Solución |
|----------|----------|
| No veo mi IP | `ipconfig` (Windows) o `ifconfig` (Mac/Linux) |
| No puedo acceder desde móvil | Mismo WiFi que la PC |
| Backend no responde | Verifica que `npm run dev` está corriendo |
| Expo Go dice "something wrong" | Verifica que la URL de API está correcta en config.js |
| 404 en `/api/habitaciones` | Backend no tiene esa ruta (verifica rutas) |

---

## 📝 CHECKLIST ANTES DE CONTINUAR

- [ ] Obtuve mi IP de la PC
- [ ] Backend responde en `http://localhost:3000/api/habitaciones`
- [ ] Backend responde desde móvil en `http://192.168.1.X:3000/api/habitaciones`
- [ ] Expo Go se conecta al QR
- [ ] Veo la app en el móvil

---

**Si todo funciona:** Continúa con el siguiente paso (Exportar BD)

**Si algo no funciona:** Verifica la sección "PROBLEMAS COMUNES"
