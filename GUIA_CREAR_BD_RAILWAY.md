# 🚀 GUÍA: CREAR BD MYSQL EN RAILWAY (Paso a Paso)

## 📌 REQUISITOS
- [ ] Tienes cuenta en Railway (con GitHub)
- [ ] Tienes proyecto `TP-final` conectado a Railway

---

## PASO 1: ABRIR RAILWAY DASHBOARD

1. Ve a: **https://railway.app**
2. Click en **"Dashboard"**
3. Deberías ver tu proyecto `TP-final` listado

---

## PASO 2: AGREGAR SERVICIO MYSQL

1. En el dashboard, busca botón **"New"** (+ azul arriba a la derecha)
2. Click en **"New"**
3. Se abre un menú, busca **"MySQL"**
4. Click en **"MySQL"**
5. Railway comienza a crear la BD automáticamente (~30 segundos)

**Verás**: Un recuadro nuevo que dice "MySQL" con estado "Running" ✅

---

## PASO 3: OBTENER CREDENCIALES

1. Click en el recuadro de **"MySQL"** que acabas de crear
2. Se abre a la derecha una ventana con los detalles
3. Click en pestaña **"Variables"**

**Verás algo como esto**:
```
MYSQLHOST=us-east-1.proxy.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=xyz123abc456...
MYSQLDATABASE=railway
```

---

## PASO 4: COPIAR Y GUARDAR LAS CREDENCIALES

**IMPORTANTE**: Copia exactamente estas 5 líneas en un archivo de texto seguro:

```
MYSQLHOST=us-east-1.proxy.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=(lo que te muestre Railway)
MYSQLDATABASE=(el nombre que te asigne)
```

**Ejemplo real**:
```
MYSQLHOST=us-east-1.proxy.railway.internal
MYSQLPORT=3306
MYSQLUSER=root
MYSQLPASSWORD=abc123xyz456def789ghi000
MYSQLDATABASE=railway
```

**Guarda esto en un archivo**: `d:\TP-final\railway_credentials.txt`

---

## PASO 5: VERIFICAR QUE LA BD ESTÁ CORRIENDO

En la ventana de Railway (pestaña "MySQL"):
- ¿Ves estado **"Running"**? → ✅ BD lista
- ¿Ves estado **"Deploying"**? → Espera 1-2 minutos

---

## ✅ CHECKLIST

- [ ] Cuenta Railway con GitHub
- [ ] Proyecto `TP-final` visible en dashboard
- [ ] BD MySQL creada (status = Running)
- [ ] Credenciales copiadas en archivo seguro
- [ ] Tienes el MYSQLHOST
- [ ] Tienes el MYSQLPASSWORD
- [ ] Tienes el MYSQLDATABASE

---

## 🚨 PROBLEMAS COMUNES

| Problema | Solución |
|----------|----------|
| No veo botón "New" | Asegúrate de estar en el proyecto correcto |
| No aparece MySQL en opciones | Scroll en el menú de servicios |
| Status dice "Deploying" | Espera 2-3 minutos, actualiza la página |
| No puedo copiar credenciales | Haz click en el texto, debería seleccionar |

---

## 📝 PRÓXIMO PASO

Una vez tengas esto, necesitamos:
1. **Importar el dump** (`hotel_reservas.sql`) en esta BD de Railway
2. **Configurar el backend** con estas credenciales en Railway

Me avisas cuando tengas las credenciales guardadas y continuamos 👍

---

**TIEMPO**: 3-5 minutos

Generated: Feb 5, 2026
