# 🚀 GUÍA RÁPIDA - SISTEMA IMPLEMENTADO

## 📋 Checklist de Instalación

### 1. Ejecutar Migraciones SQL
```sql
-- Opción A: Línea de comandos
mysql -u tu_usuario -p tu_base_datos < MIGRACIONES_SISTEMA_COMPLETO.sql

-- Opción B: Desde gestor MySQL (phpMyAdmin, Workbench, etc.)
-- Copiar contenido de MIGRACIONES_SISTEMA_COMPLETO.sql y ejecutar
```

### 2. Verificar Backend
```bash
cd backend
npm install  # Si falta alguna dependencia
npm start    # Debe mostrar "✅ Servidor funcionando"
```

### 3. Verificar Rutas
```bash
# Probar endpoint de salud
curl http://localhost:3000/health

# Respuesta esperada:
# { "status": "OK", "mensaje": "Servidor funcionando correctamente" }
```

---

## 🔐 Crear Usuario de Prueba (SQL)

```sql
-- Crear usuario empleado de prueba
INSERT INTO usuarios (
  nombre, apellido, email, contraseña, rol, 
  verificado, activo, puntos_acumulados
) VALUES (
  'Juan', 'García', 'juan@hotel.com', 
  SHA2('password123', 256),  -- Usar bcrypt en producción
  'empleado', 
  1, 1, 0
);

-- Crear usuario admin
INSERT INTO usuarios (
  nombre, apellido, email, contraseña, rol, 
  verificado, activo
) VALUES (
  'Admin', 'Sistema', 'admin@hotel.com', 
  SHA2('admin123', 256), 
  'admin', 1, 1
);

-- Crear usuario cliente
INSERT INTO usuarios (
  nombre, apellido, email, contraseña, rol, 
  verificado, activo, puntos_acumulados
) VALUES (
  'Carlos', 'López', 'carlos@email.com', 
  SHA2('client123', 256), 
  'usuario', 1, 1, 50
);
```

---

## 📱 Pruebas rápidas con cURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@hotel.com",
    "contraseña": "password123"
  }'
```

### Ver Reservas del Día (Empleado)
```bash
curl -X GET http://localhost:3000/api/empleado/reservas/hoy \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Ver Estado de Habitaciones
```bash
curl -X GET http://localhost:3000/api/empleado/habitaciones/estado \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Realizar Check-in
```bash
curl -X POST http://localhost:3000/api/empleado/reservas/1/check-in \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "observaciones": "Cliente llegó sin problemas",
    "horaEntrada": "14:30"
  }'
```

### Realizar Check-out
```bash
curl -X POST http://localhost:3000/api/empleado/reservas/1/check-out \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "observaciones": "Todo en orden",
    "horaSalida": "11:00"
  }'
```

### Cambiar Estado de Habitación
```bash
curl -X PUT http://localhost:3000/api/empleado/habitaciones/1/estado \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"estado": "limpieza"}'
```

### Ver Solicitudes Pendientes
```bash
curl -X GET http://localhost:3000/api/empleado/solicitudes/pendientes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Resolver Solicitud
```bash
curl -X POST http://localhost:3000/api/empleado/solicitudes/1/resolver \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"observaciones": "Problema resuelto"}'
```

### Obtener Perfil Completo
```bash
curl -X GET http://localhost:3000/api/usuarios/1/perfil-completo \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Ver Historial de Puntos
```bash
curl -X GET http://localhost:3000/api/usuarios/1/historial-puntos \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### Canjear Puntos
```bash
curl -X POST http://localhost:3000/api/usuarios/1/canjear-puntos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{"puntosAcanjear": 100}'
```

### Crear Reserva con Puntos
```bash
curl -X POST http://localhost:3000/api/reservas/crear-con-puntos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -d '{
    "idHabitacion": 1,
    "fechaEntrada": "2026-02-15",
    "fechaSalida": "2026-02-17",
    "numeroHuespedes": 2,
    "horaLlegadaEstimada": "15:00",
    "solicitudesEspeciales": "Cama extra",
    "metodoPago": "tarjeta",
    "usarPuntos": true,
    "idCanjeoPuntos": 1
  }'
```

---

## 🎯 Permisos por Rol (Frontend)

### Importar Utilidades
```javascript
import {
  tienePermiso,
  tienePermisos,
  esEmpleadoOSuperior,
  esAdmin
} from '@/utils/permisosRoles';
```

### Ejemplos de Uso
```javascript
// Verificar un permiso
if (tienePermiso(usuario.rol, 'hacerCheckIn')) {
  // Mostrar botón de check-in
}

// Verificar múltiples permisos (requiere todos)
if (tienePermisos(usuario.rol, ['verReservasDelDia', 'hacerCheckIn'])) {
  // Mostrar panel de empleado
}

// Verificar si es empleado o superior
if (esEmpleadoOSuperior(usuario.rol)) {
  // Mostrar funciones de operación
}

// Verificar si es admin
if (esAdmin(usuario.rol)) {
  // Mostrar opciones de administración
}
```

---

## 📊 Tablas de Base de Datos Creadas

| Tabla | Descripción | Registros Iniciales |
|-------|-------------|-------------------|
| `estados_habitaciones` | Estado actual de habitaciones | 0 |
| `solicitudes_huespedes` | Solicitudes de servicio | 0 |
| `registro_checkin` | Log de check-in/out | 0 |
| `metodos_pago_usuarios` | Métodos de pago guardados | 0 |
| `historial_puntos` | Historial de puntos | 0 |
| `canje_puntos` | Registro de canjes | 0 |
| `promociones` | Códigos promocionales | 0 |
| `auditoria` | Registro de cambios | 0 |

---

## 🔑 Campos Nuevos Agregados

### Tabla `usuarios`
```sql
puntos_acumulados INT DEFAULT 0
total_reservas INT DEFAULT 0
total_reseñas INT DEFAULT 0
preferencias JSON
notificaciones JSON
```

### Tabla `reservas`
```sql
numero_reserva VARCHAR(20) UNIQUE
hora_llegada_estimada VARCHAR(10)
solicitudes_especiales TEXT
metodo_pago ENUM('tarjeta', 'paypal', 'mercadopago', 'transferencia')
opciones_adicionales JSON
desglose_precio JSON
puntos_ganados INT DEFAULT 0
```

### Tabla `comentarios`
```sql
respuesta_hotel TEXT NULL
fecha_respuesta_hotel TIMESTAMP NULL
respondido_por INT NULL (FK usuarios)
id_reserva INT NULL (FK reservas)
```

---

## ⚙️ Configuración Recomendada

### .env Backend
```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=hotel_luna_serena

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRY=24h

# Email (opcional)
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_contraseña_app

# OAuth (opcional)
GOOGLE_CLIENT_ID=tu_id
GOOGLE_CLIENT_SECRET=tu_secret
```

---

## 🧪 Casos de Prueba Recomendados

### 1. Flow de Empleado
- [ ] Login como empleado
- [ ] Ver reservas del día
- [ ] Hacer check-in
- [ ] Ver estado de habitaciones
- [ ] Cambiar estado a limpieza
- [ ] Ver solicitudes pendientes
- [ ] Resolver solicitud
- [ ] Hacer check-out (gana 100 puntos)

### 2. Flow de Usuario
- [ ] Registro/Login
- [ ] Ver disponibilidad
- [ ] Crear reserva
- [ ] Ver desglose de precio
- [ ] Canjear puntos
- [ ] Agregar método de pago
- [ ] Ver perfil completo
- [ ] Comentar reserva completada

### 3. Flow de Admin
- [ ] Ver todas las reservas
- [ ] Modificar reserva
- [ ] Responder comentarios
- [ ] Ver reportes
- [ ] Ver auditoría
- [ ] Cambiar rol de usuario

---

## 🐛 Troubleshooting

### Error: "Tabla no existe"
```sql
-- Ejecutar migraciones completas
SOURCE MIGRACIONES_SISTEMA_COMPLETO.sql;
```

### Error: "Permiso denegado"
- Verificar que el middleware de autenticación se ejecuta
- Verificar que el token es válido
- Verificar que el rol tiene el permiso

### Error: "No es un validador"
- Importar correctamente: `const { verificarRol } = require(...)`
- No olvidar los paréntesis al llamar

### Error: "JSON parse error"
- Verificar que el body está en JSON válido
- Usar headers: `Content-Type: application/json`

---

## 📞 Comando Útil de Debug

```javascript
// En controlador
console.log('Usuario:', req.usuario);
console.log('Rol:', req.usuario.rol);
console.log('ID:', req.usuario.id_usuario);
console.log('Body:', req.body);
console.log('Params:', req.params);
```

---

## ✅ Checklist Final

- [ ] Migraciones SQL ejecutadas
- [ ] Backend iniciado sin errores
- [ ] Usuarios de prueba creados
- [ ] Pruebas con cURL exitosas
- [ ] Frontend importa permisosRoles.js
- [ ] Guardias de rutas configuradas
- [ ] Paneles por rol funcionan
- [ ] Notificaciones activas
- [ ] Reportes generando datos

---

**¡Sistema listo para producción! 🎉**
