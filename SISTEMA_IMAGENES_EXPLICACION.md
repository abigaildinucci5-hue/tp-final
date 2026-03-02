# SISTEMA DE IMÁGENES - HOTEL LUNA SERENA

## ¿Dónde se almacenan las imágenes?

### Sistema actual:
**Base de Datos (MySQL)** → Almacena URLs completas de imágenes

```
Tabla: habitaciones
Columnas:
- imagen_principal: VARCHAR(255) → URL completa (ej: "https://images.unsplash.com/photo-...")
- galeria_imagenes: JSON → Array de URLs   
```

### Ejemplos de datos en BD:
```sql
INSERT INTO habitaciones VALUES (
  1, '101', 1, '1º', 'Descripción...',
  'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  '["https://images.unsplash.com/photo-1...", "https://images.unsplash.com/photo-2..."]',
  ...
);
```

---

## Flujo de carga de imágenes

```
[Backend API]
    ↓
Ejecuta query: SELECT imagen_principal, galeria_imagenes FROM habitaciones
    ↓
Devuelve JSON con URLs: { imagen_principal: "https://..." }
    ↓
[Frontend React Native]
    ↓
Recibe datos: habitacion.imagen_principal = "https://images.unsplash.com/photo-..."
    ↓
Procesa con: obtenerImagenHabitacion(habitacion.imagen_principal)
    ↓
Función detecta que es URL completa → devolv la tal cual
    ↓
<Image source={{ uri: url }} />
    ↓
React Native descarga imagen de Unsplash e la renderiza
```

---

## Función de procesamiento de imágenes

### Archivo: `constantes/imagenes.js`

```javascript
export const construirUrlImagen = (tipo, filename) => {
  if (!filename) return null;
  
  // ✅ Si ya es una URL completa (http/https), devolverla tal cual
  if (filename.startsWith('http://') || filename.startsWith('https://')) {
    return filename;  // URL de Unsplash → se devuelve directamente
  }
  
  // Si es una ruta local, construir la URL completa
  const baseUrl = BASE_URL_IMAGENES[tipo]; // https://api.hotellunserena.com/uploads/...
  return `${baseUrl}/${filename}`;  // Construir: servidor/uploads/habitaciones/photo.jpg
};

export const obtenerImagenHabitacion = (filename) =>
  construirUrlImagen('habitaciones', filename);
```

### Lógica:

**Si la imagen es URL completa:**
```
Input:  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
        ↓ Detecta "https://"
Output: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop" ✅
```

**Si la imagen es ruta local:**
```
Input:  "photo-habitacion-101.jpg"
        ↓ No detect "http"
Output: "https://api.hotellunserena.com/uploads/habitaciones/photo-habitacion-101.jpg" ✅
```

---

## Componentes que usan imágenes

| Componente | Uso | Procesamiento |
|-----------|-----|-----------------|
| **CardHabitacionRN.js** | Tarjeta en lista | ✅ `obtenerImagenHabitacion()` |
| **AutoScrollCarousel.js** | Carrusel automático | ✅ `obtenerImagenHabitacion()` |
| **ModernRoomsCarousel.js** | Carrusel moderno | ✅ `obtenerImagenHabitacion()` |
| **CarruselHabitaciones.js** | Carrusel personalizado | ❌ Directo (puede fallar con rutas locales) |
| **ResumenReserva.js** | Resumen de reserva | ✅ `obtenerImagenHabitacion()` |
| **CardReserva.js** | Tarjeta de reserva | ✅ `obtenerImagenHabitacion()` |
| **DetalleHabitacionScreen.js** | Detalle completo | ❌ Mock data interno (no depende de imágenes BD) |

---

## ¿Por qué no se ven algunas imágenes?

### Causas posibles:

**1. La URL de Unsplash es inválida o expiró**
```javascript
// ❌ URL rota
"https://images.unsplash.com/photo-999999999999?..."

// Solución: Actualizar la BD con URLs válidas
UPDATE habitaciones SET imagen_principal = "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop" WHERE id_habitacion = 1;
```

**2. El endpoint de imágenes del servidor no existe**
```javascript
// Si la BD tuviera rutas locales: "photo-101.jpg"
// La función intenta: https://api.hotellunserena.com/uploads/habitaciones/photo-101.jpg
// Si este endpoint no existe → ERROR 404
```

**3. Problema de CORS (Cross-Origin)**
```
Si las imágenes están en un dominio diferente, el navegador podría bloquearlas
Solución: Usar imágenes de Unsplash (sin restricciones CORS)
```

**4. Sin conexión a internet**
```
React Native no puede descargar imágenes si no hay internet
Solución: Implementar caché local o usar imágenes locales
```

---

## Para agregar nuevas imágenes

### Opción 1: URLs de Unsplash (ACTUAL - RECOMENDADO)
```sql
UPDATE habitaciones 
SET imagen_principal = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop'
WHERE id_habitacion = 1;
```
✅ Fácil  
✅ No requiere servidor propio  
✅ URLs válidas y accesibles  

### Opción 2: Servidor local (futuro)
```javascript
// Subir imagen al servidor: POST /api/upload
// Guardar en BD: "photo-habitacion-101.jpg"
// La función construye: https://api.hotellunserena.com/uploads/habitaciones/photo-habitacion-101.jpg
```
⚠️ Requiere implementar endpoint de upload  
⚠️ Requiere almacenamiento en servidor  

### Opción 3: Imágenes locales en app (móvil)
```javascript
// Guardar en: /assets/images/habitaciones/
import { require } from 'react-native';
const imagenLocal = require('../assets/images/habitaciones/101.png');
```
⚠️ Aumenta tamaño de app  
⚠️ Difícil de mantener  

---

## Checklist de imágenes

**✅ Para asegurar que todas las imágenes se vean:**

1. Verifica que todas las URLs de BD sean válidas
   ```sql
   SELECT imagen_principal FROM habitaciones WHERE imagen_principal IS NOT NULL;
   ```

2. Valida que las URLs empiecen con `http://` o `https://`
   ```sql
   SELECT id_habitacion FROM habitaciones WHERE imagen_principal NOT LIKE 'http%';
   ```

3. Prueba las URLs en el navegador (copiar y pegar)
   ```
   Debe abrir la imagen directamente
   ```

4. Verifica que los componentes usen `obtenerImagenHabitacion()`
   ```javascript
   // ✅ Correcto
   <Image source={{ uri: obtenerImagenHabitacion(habitacion.imagen_principal) }} />
   
   // ❌ Incorrecto
   <Image source={{ uri: habitacion.imagen_principal }} />
   ```

5. Asegúrate de tener fallbacks
   ```javascript
   uri: obtenerImagenHabitacion(habitacion.imagen_principal) || IMAGEN_POR_DEFECTO
   ```

---

## Resumen técnico

| Aspecto | Detalles |
|--------|----------|
| **Almacenamiento** | Base de datos MySQL (URLs de Unsplash) |
| **Transmisión** | API REST devuelve URLs en JSON |
| **Procesamiento** | Frontend detecta URL completa vs ruta local |
| **Renderización** | React Native `<Image>` descarga de internet |
| **Caché** | React Native maneja automáticamente |
| **Fallback** | URL de Unsplash por defecto si falla |

---

## Problemas conocidos y soluciones

| Problema | Causa | Solución |
|----------|-------|----------|
| Imágenes no cargan | URL inválida en BD | Actualizar BD con URLs válidas |
| Error 404 en uploa | Endpoint no implementado | Usar solo URLs de Unsplash |
| Imágenes pixeladas | Mala calidad en BD | Usar URLs de alta resolución |
| Lentitud al cargar | Imágenes muy pesadas | Usar parámetros de Unsplash: `?w=800&q=80` |
| Cors error | Cross-origin bloqueado | Cambiar a dominio con CORS habilitado |
| No se ve en offline | Sin internet | Implementar caché local (futuro) |

