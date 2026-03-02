# 🚂 GUÍA RAILWAY: DE CERO A HOSTEADO (Paso a Paso)

## 📌 PRERREQUISITOS
- [ ] BD exportada (`hotel_reservas_export.sql`)
- [ ] Cuenta en GitHub (necesaria para Railway)
- [ ] Backend en GitHub (si no lo está, hazlo ahora)

---

## PARTE 1: CREAR CUENTA EN RAILWAY

1. Ve a: https://railway.app
2. Click en **"Start a new project"**
3. Selecciona **"Deploy from GitHub"**
4. Autoriza a Railway a acceder a tu GitHub
5. Selecciona el repositorio `TP-final` (o el que uses)

---

## PARTE 2: CREAR BD MYSQL EN RAILWAY

### Paso 1: Agregar servicio de BD

1. En Railway dashboard → **"New"** (botón +)
2. Selecciona **"MySQL"**
3. Se crea automáticamente una instancia MySQL

### Paso 2: Obtener credenciales

1. Click en el servicio MySQL
2. Pestaña **"Variables"**
3. Verás algo como:
   ```
   MYSQLHOST: us-east-1.proxy.railway.internal
   MYSQLPORT: 3306
   MYSQLUSER: root
   MYSQLPASSWORD: xyz123...
   MYSQLDATABASE: railway
   ```
4. **COPIA Y GUARDA ESTO** (lo necesitarás)

### Paso 3: Conectar a BD desde tu PC (para importar dump)

En terminal de tu PC:
```bash
mysql -h us-east-1.proxy.railway.internal -u root -p
```
Luego ingresas el password (la Railway te lo da).

O usa Workbench/DBeaver:
1. New Connection
2. Host: `us-east-1.proxy.railway.internal`
3. Port: `3306`
4. User: `root`
5. Password: (el de Railway)
6. Database: `railway`

### Paso 4: Importar dump en Railway

#### Opción A: Desde MySQL CLI
```bash
mysql -h us-east-1.proxy.railway.internal -u root -p railway < hotel_reservas_export.sql
```
(Reemplaza `railway` por el nombre de DB que Railway te asignó)

#### Opción B: Desde phpMyAdmin/DBeaver
1. Abre DBeaver
2. Conéctate a Railway
3. Import SQL
4. Selecciona `hotel_reservas_export.sql`
5. Execute

#### Opción C: Dashboard Railway
1. Ve a consola Railway (icono terminal)
2. Pega el contenido del SQL
3. Execute

---

## PARTE 3: DESPLEGAR BACKEND EN RAILWAY

### Paso 1: Conectar backend a BD de Railway

En tu proyecto (`d:\TP-final\backend\.env`):

**ANTES** (localhost):
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hotel_reservas
```

**AHORA** (Railway):
```env
DB_HOST=us-east-1.proxy.railway.internal
DB_USER=root
DB_PASSWORD=xyz123...
DB_NAME=railway
PORT=3000
NODE_ENV=production
```

### Paso 2: Commit a GitHub
```bash
cd d:\TP-final\backend
git add .
git commit -m "Update DB connection for Railway"
git push
```

### Paso 3: Agregar servicio Node.js en Railway

1. En Railway dashboard → **"New"** (+)
2. Selecciona **"GitHub Repo"**
3. Selecciona **TP-final**
4. Elige carpeta: **backend** ← IMPORTANTE

### Paso 4: Configurar variables en Railway (Node.js)

1. Click en servicio Node.js
2. Pestaña **"Variables"**
3. Agrega todas las del `.env`:
   ```
   DB_HOST=us-east-1.proxy.railway.internal
   DB_USER=root
   DB_PASSWORD=(tu password)
   DB_NAME=railway
   DB_PORT=3306
   JWT_SECRET=tu_clave_super_secreta_aqui
   GOOGLE_CLIENT_ID=251632903609-lbbcnb5ja0aqalmrphv0u7qs2u8oiu0g.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   GITHUB_CLIENT_ID=Iv23licLxm4gYzIBVba0
   GITHUB_CLIENT_SECRET=9f7cb66c8a57c27895cb14990ae3d60c0b7981a4
   FRONTEND_URL=http://localhost:8081
   NODE_ENV=production
   PORT=3000
   ```

### Paso 5: Deploy automático

1. Railway auto-detecta `package.json`
2. Instala dependencias
3. Ejecuta `npm start` (o lo que tengas en package.json)
4. En 5-10 minutos está hosteado

---

## PARTE 4: VERIFICAR QUE FUNCIONA

### Paso 1: Obtener URL pública de Railway

1. Click en servicio Node.js
2. Pestaña **"Settings"**
3. Busca **"Public URL"** o similar
4. Algo como: `https://tp-final-prod-abc123.up.railway.app`

### Paso 2: Probar endpoint
```bash
curl https://tp-final-prod-abc123.up.railway.app/api/habitaciones
```

Deberías ver: `{"exito":true,"data":[...]}`

### Paso 3: Verificar Google/GitHub OAuth

Los endpoints deben estar disponibles:
```
https://tp-final-prod-abc123.up.railway.app/api/auth/google
https://tp-final-prod-abc123.up.railway.app/api/auth/github
```

---

## PARTE 5: ACTUALIZAR FRONTEND

En `d:\TP-final\frontend\src\constantes\config.js`:

**ANTES**:
```javascript
BASE_URL: 'http://localhost:3000/api'
```

**AHORA**:
```javascript
BASE_URL: 'https://tp-final-prod-abc123.up.railway.app/api'
```

Commit y push:
```bash
git add .
git commit -m "Update API URL for Railway production"
git push
```

---

## ✅ CHECKLIST RAILWAY

- [ ] BD MySQL creada en Railway
- [ ] Dump importado en BD de Railway
- [ ] Variables de BD verificadas
- [ ] Backend conectado a BD de Railway
- [ ] Backend deployado en Railway
- [ ] Backend respondiendo públicamente
- [ ] Frontend actualizado con URL de Railway
- [ ] Google OAuth funciona
- [ ] GitHub OAuth funciona

---

## 🚨 PROBLEMAS COMUNES

| Error | Solución |
|-------|----------|
| `Connection refused` | BD no está corriendo. Verifica en Railway. |
| `Unknown database` | El dump no importó. Reimporta. |
| `PORT already in use` | Railway asigna puerto automático (no uses 3000). |
| `404 Not found` | Backend no tiene esa ruta. Verifica backend. |
| `Google OAuth fails` | Verificar GOOGLE_CLIENT_ID en Railway. |

---

## 💡 TIPS FINALES

1. **Guarda la URL pública** (la necesitarás para el APK)
2. **No borres la BD local** hasta el final
3. **Revisa Railway logs** si algo falla (icono terminal)
4. **Railway es gratis** pero necesita tarjeta (sin cargos iniciales)

---

**TIEMPO ESTIMADO**: 2-3 horas todo esto.

**PRÓXIMO PASO**: Actualizar frontend y probar desde Expo Go.
