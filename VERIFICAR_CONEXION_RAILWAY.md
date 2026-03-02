# Verificación de Conexión con Railway

## 📋 Pasos para Verificar la Conexión

### 1️⃣ Verificar que el Backend está en ejecución en Railway

Accede a tu dashboard de Railway:
```
https://railway.app/dashboard
```

**Verifica:**
- ✅ El servicio está "UP" (verde)
- ✅ Los logs no muestran errores críticos
- ✅ La URL del servicio es: `https://tp-final-production-a1f6.up.railway.app`

### 2️⃣ Probar la Conexión Directa con cURL

Abre una terminal y prueba:

```bash
# Test básico del servidor
curl -i https://tp-final-production-a1f6.up.railway.app/api/habitaciones?limit=1

# Test con timeout
curl --max-time 10 https://tp-final-production-a1f6.up.railway.app/api/habitaciones?limit=1
```

**Resultado esperado:**
- Status 200 OK
- JSON con datos de habitaciones

### 3️⃣ Verificar MySQL en Railway

1. En el dashboard de Railway, ve a tu base de datos MySQL
2. Verifica la pestaña "Logs" - no debe haber errores
3. Comprueba las credenciales en "Variables"
4. Usa MySQL Workbench para conectar:

```
Host: [Obtener de Railway Variables]
Username: [user]
Password: [password]
Database: [db]
Port: 3306
```

### 4️⃣ Verificar CORS en el Backend

El error `CORB blocked a cross-origin response` significa que el servidor NO está enviando headers CORS correctos.

**Backend debe tener habilitado CORS:**

```javascript
// En server.js del backend
const cors = require('cors');
app.use(cors({
  origin: ['http://localhost:8081', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));
```

### 5️⃣ Prueba en la App

Después de verificar, reinicia el Expo server:

```bash
cd frontend
npx expo start -c  # -c para limpiar caché
```

Luego prueba estas acciones:
- ✅ Cargar página de inicio (debe mostrar carrusel de habitaciones)
- ✅ Navegar a "Habitaciones"
- ✅ Enviar búsqueda de fechas
- ✅ Intentar registrarse

## 🔍 Debugging Avanzado

### Ver Errores en Consola del Navegador (Web)

1. Abre DevTools: `F12` o `Ctrl+Shift+I`
2. Ve a la pestaña "Network"
3. Filtra por requests a Railway
4. Busca response 200 exitosas or errores 4xx/5xx

### Logs de Redis/App en Railway

```bash
# Ver logs en tiempo real
railway logs --service api

# Buscar errores
railway logs --service api | grep ERROR
```

### Verificar Variables de Entorno

En Railway, asegúrate que estas variables existan:
- `DATABASE_URL` (MySQL)
- `JWT_SECRET`
- `NODE_ENV=production`
- `PORT=3000` (o el puerto que uses)

## 📱 Si Todo Funciona

Deberías ver:
- ✅ Carrusel de habitaciones en Home con 8 opciones
- ✅ No hay errores de `ERROR_DESCONOCIDO` en consola
- ✅ No hay `CORB` errors
- ✅ Puedes reservar habitaciones sin errores de conexión

## ❌ Si Sigue Fallando

Revisa:

1. **Base de datos caída?**
   - Comprueba Railway MySQL logs
   - Verifica credenciales en .env del backend

2. **API offline?**
   - Chequea Railway service status
   - Busca errores en logs

3. **CORS bloqueado?**
   - Backend debe tener `cors()` habilitado
   - Verifica que la URL base sea exacta

4. **Timeout de conexión?**
   - La app espera 30 segundos (configurable en `src/constantes/config.js`)
   - Railway podría estar tardío en responder

## 📞 Comandos Útiles

```bash
# Conectar a Railroad CLI
railway login

# Ver estado del servicio
railway status

# Redeploy manual
railway deploy

# Monitor en tiempo real
railway monitor
```

---

**Última actualización:** Feb 2026
**Estado de la conexión:** Configurada para Railway Production
**URL API:** `https://tp-final-production-a1f6.up.railway.app/api`
