# 📱 Sistema de Reservas Hotel - Guía de Instalación y Despliegue

## 📋 Tabla de Contenidos
1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Backend](#instalación-backend)
3. [Instalación Frontend](#instalación-frontend)
4. [Ejecución Local](#ejecución-local)
5. [Despliegue en Producción](#despliegue-en-producción)
6. [Generación de APK](#generación-de-apk)
7. [Estructura de Carpetas](#estructura-de-carpetas)
8. [Variables de Entorno](#variables-de-entorno)
9. [Solución de Problemas](#solución-de-problemas)

---

## 🛠️ Requisitos Previos

### Software Requerido
- **Node.js** v16+ ([descargar](https://nodejs.org))
- **npm** o **yarn** (incluido con Node.js)
- **MySQL** 5.7+ ([descargar](https://www.mysql.com/downloads/))
- **Git** ([descargar](https://git-scm.com))
- **Expo CLI** (para React Native)

### Hardware Recomendado
- RAM: Mínimo 4GB, recomendado 8GB+
- Espacio: 5GB libres para node_modules y bases de datos
- Puerto disponible: 3000 (backend), 8081 (frontend)

---

## 🔧 Instalación Backend

### 1. Clonar o descargar el repositorio

```bash
git clone <tu-repositorio>
cd TP-final/backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar base de datos

#### Crear la base de datos en MySQL

```bash
# Acceder a MySQL
mysql -u root -p

# Dentro de MySQL:
CREATE DATABASE hotel_reservas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hotel_reservas;

# Ejecutar el script de estructura (si existe)
source ./hotel_reservas.sql;
```

#### O ejecutar el script SQL

```bash
cd backend
mysql -u root -p123456 < ../hotel_reservas.sql
mysql -u root -p123456 < ../agregar_habitaciones_prueba.sql
```

### 4. Configurar variables de entorno

Crear archivo `.env` en la carpeta `backend/`:

```env
# Puerto del servidor
PORT=3000

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
DB_NAME=hotel_reservas
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_2024
JWT_EXPIRATION=7d

# OAuth (Google, Facebook)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret

FACEBOOK_APP_ID=tu_facebook_app_id
FACEBOOK_APP_SECRET=tu_facebook_app_secret

# URLs
FRONTEND_URL=http://localhost:8081
PRODUCTION_URL=https://tu-dominio.com

# Email (para notificaciones)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-app-password

# Modo
NODE_ENV=development
```

### 5. Iniciar servidor backend

```bash
npm start
```

**Esperado:**
```
✅ Servidor ejecutándose en http://localhost:3000
✅ Conectado a base de datos hotel_reservas
```

---

## 📱 Instalación Frontend

### 1. Instalar dependencias

```bash
cd ../frontend
npm install
```

### 2. Configurar variables de entorno

Crear archivo `.env.local` en la carpeta `frontend/`:

```env
# API
REACT_APP_API_URL=http://localhost:3000/api

# Modo
REACT_APP_ENV=development
```

O para Expo, crear `app.json` con:

```json
{
  "expo": {
    "extra": {
      "apiUrl": "http://localhost:3000/api"
    }
  }
}
```

### 3. Instalar Expo CLI (si no lo tienes)

```bash
npm install -g expo-cli
```

---

## 🚀 Ejecución Local

### Opción 1: Desarrollo con Expo

#### Terminal 1 - Backend
```bash
cd TP-final/backend
npm start
```

#### Terminal 2 - Frontend
```bash
cd TP-final/frontend
npm start
# O con Expo:
expo start
```

**Acceso:**
- Backend: `http://localhost:3000`
- Frontend Web: `http://localhost:19006` (con Expo Web)
- Frontend Mobile: Usar app Expo Go (iOS/Android) y escanear QR

### Opción 2: Ejecutar en Android Emulator

```bash
cd frontend
expo start --android
```

### Opción 3: Ejecutar en iOS Simulator (Mac)

```bash
cd frontend
expo start --ios
```

---

## 🌐 Despliegue en Producción

### Backend - Despliegue en Heroku

#### 1. Instalar Heroku CLI

```bash
# Windows (Chocolatey)
choco install heroku-cli

# Mac (Homebrew)
brew tap heroku/brew && brew install heroku

# Linux
curl https://cli-assets.heroku.com/install.sh | sh
```

#### 2. Crear app en Heroku

```bash
cd backend
heroku login
heroku create nombre-tu-hotel-api
```

#### 3. Configurar variables de entorno en Heroku

```bash
heroku config:set -a nombre-tu-hotel-api \
  DB_HOST=tu-mysql-host \
  DB_USER=tu_usuario \
  DB_PASSWORD=tu_contraseña \
  DB_NAME=hotel_reservas \
  JWT_SECRET=tu_clave_secreta_super_segura \
  NODE_ENV=production
```

#### 4. Desplegar

```bash
git push heroku main
# O si estás en otra rama:
git push heroku tu-rama:main
```

#### 5. Ver logs

```bash
heroku logs -a nombre-tu-hotel-api --tail
```

---

### Frontend - Despliegue en Vercel o Netlify

#### Con Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

cd frontend

# Desplegar
vercel

# Configurar variables de entorno en el panel de Vercel:
# REACT_APP_API_URL=https://nombre-tu-hotel-api.herokuapp.com/api
```

#### Con Netlify

```bash
# Instalar Netlify CLI
npm i -g netlify-cli

cd frontend

# Desplegar
netlify deploy

# Configurar variables:
# En el panel → Build & Deploy → Environment
# REACT_APP_API_URL=https://nombre-tu-hotel-api.herokuapp.com/api
```

---

## 📲 Generación de APK

### Prerequisitos para APK
- Tener Expo CLI instalado: `npm install -g expo-cli`
- Cuenta Expo: Crear en https://expo.dev
- Tener al menos 1GB de espacio libre

### Opción 1: Usar Expo Application Services (Recomendado)

```bash
cd frontend

# Login en Expo
expo login

# Generar APK
eas build --platform android

# Seguir los pasos interactivos
```

### Opción 2: Build local con EAS CLI

```bash
# Instalar EAS CLI
npm install -g eas-cli

cd frontend

# Configurar (ejecutar una sola vez)
eas build:configure

# Generar APK
eas build --platform android --local
```

### Opción 3: Build manual con Expo

```bash
cd frontend

# Generar paquete
expo build:android -t apk

# Monitorear progreso
# Recibirás un enlace de descarga por email
```

**El APK estará disponible en:**
- `./build/outputs/bundle/release/app-release.apk` (si es local)
- O descarga desde Expo Dashboard

### Instalación del APK

```bash
# En Android físico o emulador
adb install ./app.apk

# O transfiere el archivo .apk al dispositivo y toca para instalar
```

---

## 📁 Estructura de Carpetas

```
TP-final/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── baseDatos.js
│   │   │   ├── jwt.js
│   │   │   └── oauth.js
│   │   ├── controladores/
│   │   ├── middlewares/
│   │   ├── modelos/
│   │   ├── rutas/
│   │   ├── servicios/
│   │   └── utils/
│   ├── server.js
│   ├── package.json
│   └── .env (crear)
│
├── frontend/
│   ├── src/
│   │   ├── componentes/
│   │   ├── contexto/
│   │   ├── hooks/
│   │   ├── navegacion/
│   │   ├── pantallas/
│   │   ├── redux/
│   │   ├── servicios/
│   │   ├── utils/
│   │   ├── constantes/
│   │   └── assets/
│   ├── App.js
│   ├── package.json
│   ├── app.json
│   └── .env.local (crear)
│
├── hotel_reservas.sql (estructura DB)
├── agregar_habitaciones_prueba.sql (datos de prueba)
└── README.md (este archivo)
```

---

## 🔐 Variables de Entorno

### Backend (.env)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3000` |
| `DB_HOST` | Host de MySQL | `localhost` |
| `DB_USER` | Usuario de MySQL | `root` |
| `DB_PASSWORD` | Contraseña de MySQL | `123456` |
| `DB_NAME` | Nombre de la BD | `hotel_reservas` |
| `JWT_SECRET` | Clave para firmar tokens | `mi-clave-secreta` |
| `NODE_ENV` | Entorno | `development` o `production` |

### Frontend (.env.local)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `REACT_APP_API_URL` | URL de la API | `http://localhost:3000/api` |

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"

```bash
# Limpiar node_modules
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### Error: "MySQL connection refused"

```bash
# Verificar que MySQL está corriendo
mysql -u root -p

# Si no está instalado, instalar MySQL Community Server
```

### Error: "Expo CLI not found"

```bash
npm install -g expo-cli
expo --version
```

### Error: "Build APK failed"

```bash
# Limpiar caché de Expo
expo cache:clear

# Intentar de nuevo
eas build --platform android
```

### Frontend no se conecta al backend

1. Verificar que backend está corriendo: `http://localhost:3000/api/habitaciones`
2. Verificar URL en `.env.local`: `REACT_APP_API_URL`
3. Verificar CORS en `backend/server.js`

```javascript
// Debe incluir:
app.use(cors({
  origin: 'http://localhost:19006',
  credentials: true
}));
```

---

## 📊 Usuarios de Prueba

### Admin
- Email: `admin@hotel.com`
- Contraseña: `Admin123!`

### Cliente Regular
- Email: `cliente@hotel.com`
- Contraseña: `Cliente123!`

### Empleado
- Email: `empleado@hotel.com`
- Contraseña: `Empleado123!`

### Invitado
- No requiere credenciales
- Acceso limitado a la información de habitaciones

---

## 📖 Documentación de API

Endpoints principales:

### Autenticación
- `POST /api/auth/registro` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión

### Habitaciones
- `GET /api/habitaciones` - Listar todas las habitaciones
- `GET /api/habitaciones/:id` - Obtener detalles de una habitación
- `GET /api/habitaciones?limit=8` - Obtener habitaciones populares

### Reservas
- `POST /api/reservas` - Crear nueva reserva
- `GET /api/reservas/mis-reservas` - Obtener mis reservas
- `PUT /api/reservas/:id` - Actualizar reserva
- `DELETE /api/reservas/:id` - Cancelar reserva

### Comentarios
- `GET /api/comentarios/habitacion/:habitacionId` - Obtener comentarios
- `POST /api/comentarios` - Agregar comentario

---

## ✅ Checklist Final

Antes de pasar a producción:

- [ ] Base de datos creada y poblada
- [ ] Variables de entorno configuradas
- [ ] Backend corriendo sin errores
- [ ] Frontend conectado al backend
- [ ] Pruebas de login/registro completadas
- [ ] Pruebas de reserva completadas
- [ ] APK generado y probado en dispositivo
- [ ] Dominio configurado
- [ ] SSL/HTTPS habilitado
- [ ] Backup de base de datos programado

---

## 🆘 Contacto y Soporte

Para problemas o preguntas:
- Abrir un issue en GitHub
- Revisar logs: `npm run logs`
- Contactar al equipo de desarrollo

---

**Última actualización:** 30 de Enero, 2026
**Versión:** 1.0.0
