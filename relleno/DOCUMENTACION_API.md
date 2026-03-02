# 📚 Documentación de la API RESTful - Hotel Reservas

## 📋 Índice
1. [Base URL](#base-url)
2. [Autenticación](#autenticación)
3. [Códigos de Respuesta](#códigos-de-respuesta)
4. [Endpoints de Autenticación](#endpoints-de-autenticación)
5. [Endpoints de Habitaciones](#endpoints-de-habitaciones)
6. [Endpoints de Reservas](#endpoints-de-reservas)
7. [Endpoints de Comentarios](#endpoints-de-comentarios)
8. [Endpoints de Usuarios](#endpoints-de-usuarios)
9. [Manejo de Errores](#manejo-de-errores)
10. [Ejemplos de Uso](#ejemplos-de-uso)

---

## 🌐 Base URL

```
Desarrollo:  http://localhost:3000/api
Producción:  https://tu-dominio.com/api
```

---

## 🔐 Autenticación

### Token JWT
Todos los endpoints (excepto los públicos) requieren un header:

```http
Authorization: Bearer {token_jwt}
```

### Obtener Token
El token se retorna al hacer login exitoso. Guarda el token en `AsyncStorage`:

```javascript
AsyncStorage.setItem('authToken', token);
```

### Renovación de Token
El token expira en 7 días. Para renovar:

```http
POST /api/auth/refresh-token
```

---

## 📊 Códigos de Respuesta

| Código | Significado | Acción |
|--------|------------|--------|
| `200` | OK | Solicitud exitosa |
| `201` | Created | Recurso creado exitosamente |
| `204` | No Content | Solicitud exitosa, sin contenido |
| `400` | Bad Request | Error en los datos enviados |
| `401` | Unauthorized | Se requiere autenticación |
| `403` | Forbidden | No tiene permiso para acceder |
| `404` | Not Found | Recurso no encontrado |
| `500` | Server Error | Error del servidor |

---

## 🔐 Endpoints de Autenticación

### Registro de Usuario

```http
POST /api/auth/registro
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!",
  "telefono": "+34 666 555 444",
  "rol": "cliente"
}
```

**Respuesta exitosa (201):**
```json
{
  "exito": true,
  "mensaje": "Usuario registrado exitosamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol": "cliente",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Iniciar Sesión

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "juan@ejemplo.com",
  "password": "MiPassword123!"
}
```

**Respuesta exitosa (200):**
```json
{
  "exito": true,
  "mensaje": "Sesión iniciada correctamente",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com",
    "rol": "cliente",
    "avatar": "https://url-avatar.jpg",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d"
  }
}
```

---

### Cerrar Sesión

```http
POST /api/auth/logout
Authorization: Bearer {token}
```

**Respuesta (204 No Content):**
Sin cuerpo de respuesta.

---

### OAuth Google

```http
POST /api/auth/google
Content-Type: application/json

{
  "token": "google_oauth_token_aqui"
}
```

---

## 🏨 Endpoints de Habitaciones

### Listar todas las habitaciones

```http
GET /api/habitaciones?limit=10&offset=0&tipo=Estándar&precioMin=50&precioMax=200
```

**Parámetros opcionales:**
- `limit` - Número máximo de resultados (default: 10)
- `offset` - Saltar primeros N registros (default: 0)
- `tipo` - Filtrar por tipo
- `precioMin` - Precio mínimo
- `precioMax` - Precio máximo
- `capacidad` - Capacidad mínima de personas
- `disponible` - true/false
- `estado` - disponible/ocupado

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 1,
      "numero": "101",
      "tipo": "Estándar",
      "capacidad": 2,
      "numero_camas": 1,
      "tamaño_m2": 20,
      "precio_noche": 50.00,
      "estado": "disponible",
      "activo": true,
      "descripcion": "Habitación acogedora...",
      "imagen_principal": "https://...",
      "imagenes": ["https://...", "https://..."],
      "calificacion": 4.5,
      "resenas": 12
    },
    ...
  ],
  "total": 45,
  "pagina": 0,
  "porPagina": 10
}
```

---

### Obtener detalles de una habitación

```http
GET /api/habitaciones/:id
```

**Parámetro:**
- `id` - ID de la habitación (requerido)

**Respuesta (200):**
```json
{
  "exito": true,
  "data": {
    "id": 1,
    "numero": "101",
    "tipo": "Estándar",
    "capacidad": 2,
    "numero_camas": 1,
    "tamaño_m2": 20,
    "precio_noche": 50.00,
    "estado": "disponible",
    "activo": true,
    "descripcion": "Habitación acogedora...",
    "imagen_principal": "https://...",
    "imagenes": ["https://...", "https://..."],
    "calificacion": 4.5,
    "resenas": 12,
    "servicios": [
      {"icono": "wifi", "nombre": "WiFi gratuito"},
      {"icono": "television", "nombre": "TV HD"}
    ]
  }
}
```

---

### Obtener tipos de habitación

```http
GET /api/habitaciones/tipos/lista
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 1,
      "nombre": "Estándar",
      "descripcion": "Habitación básica..."
    },
    {
      "id": 2,
      "nombre": "Confort",
      "descripcion": "Habitación spaciosa..."
    },
    {
      "id": 3,
      "nombre": "Deluxe",
      "descripcion": "Suite lujosa..."
    },
    {
      "id": 4,
      "nombre": "Suite",
      "descripcion": "Suite presidencial..."
    }
  ]
}
```

---

### Obtener habitaciones populares

```http
GET /api/habitaciones?limit=8
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 1,
      "numero": "101",
      "tipo": "Estándar",
      "capacidad": 2,
      "precio_noche": 50.00,
      "estado": "disponible",
      "imagen_principal": "https://...",
      "calificacion": 4.5,
      "resenas": 12
    },
    ...
  ],
  "total": 8
}
```

---

### Guardar habitación como favorita

```http
POST /api/habitaciones/:id/favorito
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "mensaje": "Habitación añadida a favoritos"
}
```

---

### Obtener mis favoritos

```http
GET /api/habitaciones/favoritos/mis-favoritos
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    { "id": 1, "numero": "101", "tipo": "Estándar", ... },
    { "id": 5, "numero": "201", "tipo": "Confort", ... }
  ],
  "total": 2
}
```

---

## 📅 Endpoints de Reservas

### Crear nueva reserva

```http
POST /api/reservas
Authorization: Bearer {token}
Content-Type: application/json

{
  "habitacion_id": 1,
  "fecha_inicio": "2026-02-15",
  "fecha_fin": "2026-02-18",
  "cantidad_personas": 2,
  "observaciones": "Necesitamos una cuna para bebé"
}
```

**Validaciones:**
- `fecha_inicio` - Formato YYYY-MM-DD, no puede ser en el pasado
- `fecha_fin` - Debe ser después de fecha_inicio
- `cantidad_personas` - Debe ser <= capacidad de la habitación

**Respuesta (201):**
```json
{
  "exito": true,
  "mensaje": "Reserva creada exitosamente",
  "data": {
    "id": 42,
    "habitacion_id": 1,
    "usuario_id": 5,
    "fecha_inicio": "2026-02-15",
    "fecha_fin": "2026-02-18",
    "cantidad_personas": 2,
    "cantidad_noches": 3,
    "precio_total": 150.00,
    "estado": "confirmada",
    "observaciones": "Necesitamos una cuna para bebé",
    "fecha_reserva": "2026-01-30T10:30:00Z"
  }
}
```

---

### Obtener mis reservas

```http
GET /api/reservas/mis-reservas?estado=confirmada&ordenar=fecha_desc
Authorization: Bearer {token}
```

**Parámetros opcionales:**
- `estado` - confirmada/cancelada/completada
- `ordenar` - fecha_asc/fecha_desc/precio_asc/precio_desc

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 42,
      "habitacion": { "numero": "101", "tipo": "Estándar", ... },
      "fecha_inicio": "2026-02-15",
      "fecha_fin": "2026-02-18",
      "cantidad_personas": 2,
      "precio_total": 150.00,
      "estado": "confirmada"
    }
  ],
  "total": 5
}
```

---

### Actualizar reserva

```http
PUT /api/reservas/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "fecha_inicio": "2026-02-16",
  "fecha_fin": "2026-02-20",
  "cantidad_personas": 3,
  "observaciones": "Cambio de requerimientos"
}
```

**Solo puede modificar:**
- Invitados propios
- Si el estado es "confirmada"
- Máximo 7 días antes de la reserva

**Respuesta (200):**
```json
{
  "exito": true,
  "mensaje": "Reserva actualizada exitosamente"
}
```

---

### Cancelar reserva

```http
DELETE /api/reservas/:id
Authorization: Bearer {token}
```

**Política de cancelación:**
- Gratis: Más de 7 días antes
- 50% de reembolso: Entre 3 y 7 días
- Sin reembolso: Menos de 3 días

**Respuesta (204 No Content):**

---

### Calcular precio de reserva

```http
GET /api/reservas/calcular-precio?habitacion_id=1&fecha_inicio=2026-02-15&fecha_fin=2026-02-18&cantidad_personas=2
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": {
    "habitacion_id": 1,
    "precio_noche": 50.00,
    "cantidad_noches": 3,
    "subtotal": 150.00,
    "impuestos": 22.50,
    "descuento": 0,
    "precio_total": 172.50
  }
}
```

---

## 💬 Endpoints de Comentarios

### Obtener comentarios de una habitación

```http
GET /api/comentarios/habitacion/:habitacionId?limit=10&ordenar=fecha_desc
```

**Parámetros opcionales:**
- `limit` - Número máximo (default: 10)
- `ordenar` - fecha_desc/fecha_asc/calificacion_desc

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 1,
      "habitacion_id": 1,
      "usuario": {
        "id": 5,
        "nombre": "María García",
        "avatar": "https://..."
      },
      "calificacion": 5,
      "comentario": "¡Excelente habitación! Muy limpia y cómoda.",
      "fecha_creacion": "2026-01-28T14:30:00Z"
    }
  ],
  "total": 8
}
```

---

### Crear comentario

```http
POST /api/comentarios
Authorization: Bearer {token}
Content-Type: application/json

{
  "habitacion_id": 1,
  "calificacion": 5,
  "comentario": "¡Excelente habitación! Muy limpia y cómoda."
}
```

**Validaciones:**
- `calificacion` - Número entre 1 y 5
- `comentario` - Mínimo 10 caracteres, máximo 500
- Usuario debe tener una reserva completada en esa habitación

**Respuesta (201):**
```json
{
  "exito": true,
  "mensaje": "Comentario publicado exitosamente",
  "data": {
    "id": 9,
    "habitacion_id": 1,
    "usuario_id": 5,
    "calificacion": 5,
    "comentario": "¡Excelente habitación!",
    "fecha_creacion": "2026-01-30T10:30:00Z"
  }
}
```

---

### Obtener mis comentarios

```http
GET /api/comentarios/mis-comentarios
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": [
    {
      "id": 1,
      "habitacion": { "numero": "101", "tipo": "Estándar" },
      "calificacion": 5,
      "comentario": "Excelente...",
      "fecha_creacion": "2026-01-28T14:30:00Z"
    }
  ],
  "total": 3
}
```

---

## 👤 Endpoints de Usuarios

### Obtener perfil

```http
GET /api/usuarios/perfil
Authorization: Bearer {token}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "data": {
    "id": 5,
    "nombre": "María García",
    "email": "maria@ejemplo.com",
    "telefono": "+34 666 555 444",
    "avatar": "https://...",
    "rol": "cliente",
    "fecha_registro": "2025-12-15T10:30:00Z",
    "total_reservas": 8,
    "total_comentarios": 3
  }
}
```

---

### Actualizar perfil

```http
PUT /api/usuarios/perfil
Authorization: Bearer {token}
Content-Type: application/json

{
  "nombre": "María García López",
  "telefono": "+34 666 777 888",
  "avatar": "https://nueva-imagen.jpg"
}
```

**Respuesta (200):**
```json
{
  "exito": true,
  "mensaje": "Perfil actualizado exitosamente"
}
```

---

### Cambiar contraseña

```http
PUT /api/usuarios/cambiar-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "password_actual": "MiPassword123!",
  "password_nueva": "MiNuevaPassword456!"
}
```

**Validaciones:**
- Password actual debe ser correcto
- Password nueva debe tener al menos 8 caracteres

**Respuesta (200):**
```json
{
  "exito": true,
  "mensaje": "Contraseña actualizada exitosamente"
}
```

---

## ⚠️ Manejo de Errores

### Formato de Error

```json
{
  "exito": false,
  "error": "CODIGO_ERROR",
  "mensaje": "Descripción del error en español",
  "detalles": {
    "campo": "mensaje de validación"
  }
}
```

### Códigos de Error Comunes

| Código | Mensaje | Solución |
|--------|---------|----------|
| `EMAIL_EN_USO` | El email ya está registrado | Usa otro email o recupera tu contraseña |
| `CREDENCIALES_INVALIDAS` | Email o contraseña incorrectos | Verifica tus credenciales |
| `TOKEN_INVALIDO` | Token expirado o inválido | Vuelve a iniciar sesión |
| `HABITACION_NO_DISPONIBLE` | La habitación no está disponible | Elige otra habitación o fecha |
| `CONFLICTO_FECHAS` | Las fechas se solapan con otra reserva | Elige fechas diferentes |
| `VALIDACION_FALLIDA` | Error en los datos enviados | Revisa los campos requeridos |

---

## 📖 Ejemplos de Uso

### JavaScript/React Native

```javascript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Obtener habitaciones
export const obtenerHabitaciones = async (filtros = {}) => {
  try {
    const response = await axios.get(`${API_URL}/habitaciones`, { 
      params: filtros 
    });
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};

// Crear reserva (requiere token)
export const crearReserva = async (datosReserva, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/reservas`,
      datosReserva,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error:', error.response.data);
    throw error;
  }
};
```

### cURL

```bash
# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@ejemplo.com",
    "password": "Password123!"
  }'

# Crear reserva
curl -X POST http://localhost:3000/api/reservas \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "habitacion_id": 1,
    "fecha_inicio": "2026-02-15",
    "fecha_fin": "2026-02-18",
    "cantidad_personas": 2
  }'

# Obtener habitaciones
curl -X GET "http://localhost:3000/api/habitaciones?limit=10" \
  -H "Content-Type: application/json"
```

### Postman

1. Crear una colección "Hotel API"
2. Configurar variable de entorno: `baseUrl = http://localhost:3000/api`
3. Crear requests con `{{baseUrl}}/habitaciones`, etc.

---

## 🔍 Testing de Endpoints

### Herramientas Recomendadas
- **Postman** - GUI elegante
- **Insomnia** - Alternativa a Postman
- **Thunder Client** - Plugin VS Code
- **Rest Client** - Plugin VS Code

---

**Versión:** 1.0.0  
**Última actualización:** 30 de Enero, 2026
