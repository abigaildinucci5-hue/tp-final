# 📋 Guía Completa: Cómo Agregar Habitaciones

## 1. ESTRUCTURA DE LA BASE DE DATOS

### Tabla `tipos_habitacion` (Tipos de Habitación)
```sql
id_tipo (INT) - ID único
nombre (VARCHAR) - Ej: "Habitación Doble", "Suite Ejecutiva"
descripcion (TEXT) - Descripción del tipo
capacidad_personas (INT) - Cuántas personas caben
precio_base (DECIMAL) - Precio base
precio_empleado (DECIMAL) - Precio especial empleados
metros_cuadrados (DECIMAL) - Tamaño del área
activo (BOOLEAN) - Activo o no
```

### Tabla `habitaciones` (Habitaciones Individuales)
```sql
id_habitacion (INT) - ID único
numero_habitacion (VARCHAR) - Ej: "101", "205"
id_tipo (INT) - Referencia al tipo de habitación
piso (INT) - Número de piso
descripcion_detallada (TEXT) - Descripción larga
imagen_principal (VARCHAR) - URL de la imagen principal
galeria_imagenes (JSON) - Array de URLs de imágenes
amenidades (JSON) - Array de amenidades
vista (ENUM) - 'mar', 'ciudad', 'jardin', 'montaña'
estado (ENUM) - 'disponible', 'ocupada', 'mantenimiento', 'limpieza'
activo (BOOLEAN) - Activa o no
```

---

## 2. PASO 1: CREAR TIPO DE HABITACIÓN (SQL)

### Opción A: Agregar directamente a la BD

```sql
INSERT INTO tipos_habitacion 
(nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados, activo)
VALUES 
('Habitación Doble', 'Habitación confortable para parejas', 2, 150.00, 100.00, 35, TRUE),
('Suite Ejecutiva', 'Suite con todos los servicios premium', 2, 300.00, 200.00, 60, TRUE),
('Habitación Triple', 'Ideal para familias pequeñas', 3, 200.00, 130.00, 45, TRUE);
```

---

## 3. PASO 2: CREAR HABITACIONES ESPECÍFICAS

```sql
INSERT INTO habitaciones 
(numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, amenidades, vista, estado, activo)
VALUES 
(
  '101',
  1,
  1,
  'Hermosa habitación doble con vista al jardín. Equipada con TV smart, WiFi de alta velocidad, baño completo con ducha lluvia y amenities premium.',
  'https://ejemplo.com/img-habitacion-101.jpg',
  JSON_ARRAY('WiFi Gratis', 'Smart TV', 'Aire Acondicionado', 'Baño Privado', 'Minibar', 'Caja Fuerte'),
  'jardin',
  'disponible',
  TRUE
),
(
  '201',
  2,
  2,
  'Suite ejecutiva de lujo con sala de estar separada. Vistas panorámicas, jacuzzi privado, servicio room service 24h.',
  'https://ejemplo.com/img-suite-201.jpg',
  JSON_ARRAY('WiFi Premium', 'Smart TV 4K', 'Jacuzzi', 'Sala de Estar', 'Minibar Premium', 'Caja Fuerte', 'Bata y Zapatillas'),
  'mar',
  'disponible',
  TRUE
);
```

---

## 4. COMPONENTES EN FRONTEND

### CarruselHabitaciones.js
Ubicación: `frontend/src/componentes/habitaciones/CarruselHabitaciones.js`

**Propiedades que espera:**
```javascript
{
  id_habitacion: 1,
  numero: "101",
  tipo: "Habitación Doble",
  precio: 150,
  imagen: "https://...",
  estado: "disponible",
  rating: 4.5,
  calificaciones: 24,
  amenidades: ["WiFi", "TV Smart", ...],
  capacidad: 2
}
```

---

## 5. AGREGAR ICONOS Y BANNERS

### A. ICONOS DE AMENIDADES

En los componentes, usa Material Community Icons:

```javascript
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Ejemplos de iconos disponibles:
const iconosAmenidades = {
  'WiFi': 'wifi',
  'Smart TV': 'television-classic',
  'Aire Acondicionado': 'air-conditioner',
  'Baño Privado': 'shower-head',
  'Minibar': 'bottle-wine',
  'Caja Fuerte': 'safe',
  'Jacuzzi': 'hot-tub',
  'Balcón': 'balcony',
  'Cocina': 'pot-mix',
  'Estacionamiento': 'parking',
  'Desayuno': 'food',
  'Room Service': 'room-service',
  'Piscina': 'pool',
  'Gimnasio': 'dumbbell',
  'Mascotas': 'paw'
};

// Renderizar en JSX:
<MaterialCommunityIcons name="wifi" size={20} color={COLORES.primario} />
```

### B. BANNERS DE FONDO

#### Opción 1: Imagen de fondo en componente
```javascript
import { ImageBackground } from 'react-native';

<ImageBackground 
  source={{ uri: 'https://ejemplo.com/banner.jpg' }}
  style={estilos.bannerContainer}
>
  <View style={estilos.bannerOverlay}>
    <Text style={estilos.bannerTitle}>Nuestras Habitaciones</Text>
  </View>
</ImageBackground>

// Estilos:
const estilos = StyleSheet.create({
  bannerContainer: {
    width: '100%',
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORES.fondoBlanco,
  }
});
```

#### Opción 2: Gradient banner
```javascript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={[COLORES.primario, COLORES.primario + '80']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={estilos.gradientBanner}
>
  <Text style={estilos.bannerTitle}>Nuestras Habitaciones</Text>
</LinearGradient>
```

---

## 6. COMPONENTE CARD DE HABITACIÓN CON ICONO Y BANNER

```javascript
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const HabitacionCard = ({ habitacion, onPress }) => {
  return (
    <TouchableOpacity style={estilos.card} onPress={onPress}>
      {/* Banner con imagen */}
      <View style={estilos.imageBanner}>
        <Image
          source={{ uri: habitacion.imagen }}
          style={estilos.imagen}
          resizeMode="cover"
        />
        
        {/* Badge de disponibilidad */}
        {habitacion.estado === 'disponible' && (
          <View style={estilos.badgeDisponible}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#fff" />
            <Text style={estilos.badgeText}>Disponible</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View style={estilos.contenido}>
        <Text style={estilos.tipo}>{habitacion.tipo}</Text>
        <Text style={estilos.numero}>Habitación {habitacion.numero}</Text>
        
        {/* Amenidades con iconos */}
        <View style={estilos.amenidades}>
          {habitacion.amenidades?.slice(0, 3).map((amenidad, idx) => (
            <View key={idx} style={estilos.amenidadItem}>
              <MaterialCommunityIcons 
                name={getIconoAmenidad(amenidad)} 
                size={14} 
                color={COLORES.primario} 
              />
              <Text style={estilos.amenidadText}>{amenidad}</Text>
            </View>
          ))}
        </View>

        {/* Precio */}
        <View style={estilos.footer}>
          <Text style={estilos.precio}>${habitacion.precio}</Text>
          <Text style={estilos.noche}>/noche</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    marginBottom: 16,
  },
  imageBanner: {
    position: 'relative',
    height: 200,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  badgeDisponible: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  contenido: {
    padding: 16,
  },
  tipo: {
    fontSize: 14,
    color: '#666',
  },
  numero: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenidades: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  amenidadItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenidadText: {
    fontSize: 11,
    color: '#666',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  precio: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
  noche: {
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
});

function getIconoAmenidad(amenidad) {
  const mapa = {
    'WiFi': 'wifi',
    'Smart TV': 'television-classic',
    'Aire Acondicionado': 'air-conditioner',
    'Baño Privado': 'shower-head',
    'Minibar': 'bottle-wine',
    'Caja Fuerte': 'safe',
    'Jacuzzi': 'hot-tub',
  };
  return mapa[amenidad] || 'check';
}

export default HabitacionCard;
```

---

## 7. FLUJO COMPLETO: AGREGAR UNA HABITACIÓN

### Paso 1: Base de datos (SQL)
```sql
-- 1. Crear tipo de habitación (si no existe)
INSERT INTO tipos_habitacion 
(nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados)
VALUES ('Habitación Estándar', 'Habitación confortable', 2, 120.00, 80.00, 30);

-- 2. Obtener el id_tipo (SELECT id_tipo FROM tipos_habitacion WHERE nombre = 'Habitación Estándar')
-- Asumamos que id_tipo = 1

-- 3. Crear habitación
INSERT INTO habitaciones 
(numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, amenidades, vista, estado)
VALUES 
(
  '102',
  1,
  1,
  'Habitación estándar con cama queen, baño con ducha, TV y WiFi',
  'https://tu-servidor.com/imagenes/habitacion-102.jpg',
  JSON_ARRAY('WiFi', 'Smart TV', 'Aire Acondicionado', 'Baño Privado'),
  'jardin',
  'disponible'
);
```

### Paso 2: Frontend (Automático)
El frontend obtiene los datos via API:
```
GET /api/habitaciones
```

Los datos fluyen automáticamente a través de:
1. `habitacionesService.js` → obtiene datos
2. `CarruselHabitaciones.js` → muestra en lista
3. `DetalleHabitacion.js` → muestra detalles

---

## 8. AGREGAR IMAGEN DE FONDO AL CARRUSEL

En [CarruselHabitaciones.js](CarruselHabitaciones.js):

```javascript
import { ImageBackground } from 'react-native';

// Agregar banner al inicio del carrusel:
return (
  <>
    {/* Banner con imagen de fondo */}
    <ImageBackground
      source={{ uri: 'https://ejemplo.com/banner-habitaciones.jpg' }}
      style={estilos.banner}
    >
      <View style={estilos.bannerOverlay}>
        <Text style={estilos.bannerTitle}>Nuestras Habitaciones</Text>
        <Text style={estilos.bannerSubtitle}>Lujo y comodidad te esperan</Text>
      </View>
    </ImageBackground>

    {/* Carrusel */}
    <FlatList
      data={habitacionesLimitadas}
      renderItem={renderCard}
      keyExtractor={(item) => item.id_habitacion?.toString() || Math.random().toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + 16}
      decelerationRate="fast"
    />
  </>
);

// Agregar estilos:
banner: {
  width: '100%',
  height: 200,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
},
bannerOverlay: {
  backgroundColor: 'rgba(0,0,0,0.4)',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
},
bannerTitle: {
  fontSize: 28,
  fontWeight: 'bold',
  color: COLORES.fondoBlanco,
},
bannerSubtitle: {
  fontSize: 14,
  color: COLORES.fondoBlanco,
  marginTop: 8,
},
```

---

## 9. LISTA DE ICONOS DISPONIBLES

Material Community Icons (v6+):
- `wifi` - WiFi
- `television-classic` - TV
- `air-conditioner` - Aire Acondicionado
- `shower-head` - Baño
- `bottle-wine` - Minibar
- `safe` - Caja Fuerte
- `hot-tub` - Jacuzzi
- `balcony` - Balcón
- `pot-mix` - Cocina
- `parking` - Estacionamiento
- `food` - Desayuno
- `room-service` - Room Service
- `pool` - Piscina
- `dumbbell` - Gimnasio
- `paw` - Mascotas
- `king-bed` - Cama King
- `bed-double` - Cama Doble
- `bed` - Cama
- `sofa` - Sofá
- `lamp` - Lámpara
- `door` - Puerta

---

## 10. EJEMPLO COMPLETO: AGREGAR 3 HABITACIONES

```sql
-- Tipos de habitación
INSERT INTO tipos_habitacion (nombre, descripcion, capacidad_personas, precio_base, precio_empleado, metros_cuadrados) VALUES
('Doble Estándar', 'Habitación confortable para parejas', 2, 150, 100, 35),
('Suite Ejecutiva', 'Suite de lujo con todos los servicios', 2, 300, 200, 60),
('Familia', 'Amplia habitación para familias', 4, 250, 150, 50);

-- Habitaciones
INSERT INTO habitaciones (numero_habitacion, id_tipo, piso, descripcion_detallada, imagen_principal, amenidades, vista, estado) VALUES
('101', 1, 1, 'Cómoda habitación con cama queen', 'https://ejemplo.com/h101.jpg', 
 JSON_ARRAY('WiFi', 'Smart TV', 'Aire Acondicionado', 'Baño Privado'), 'jardin', 'disponible'),
 
('201', 2, 2, 'Suite ejecutiva con jacuzzi privado', 'https://ejemplo.com/h201.jpg',
 JSON_ARRAY('WiFi Premium', 'Smart TV 4K', 'Jacuzzi', 'Sala de Estar', 'Room Service 24h'), 'mar', 'disponible'),
 
('301', 3, 3, 'Perfecta para familias pequeñas', 'https://ejemplo.com/h301.jpg',
 JSON_ARRAY('WiFi', 'Smart TV', 'Aire Acondicionado', 'Cocina Completa', 'Balcón'), 'montaña', 'disponible');
```

---

## 11. RESUMEN RÁPIDO

| Tarea | Ubicación |
|-------|-----------|
| 📝 Agregar datos BD | `hotel_reservas.sql` - INSERT en tablas |
| 🎨 Componente card | `frontend/src/componentes/habitaciones/` |
| 📷 Imágenes | URLs externas (Cloudinary, tu servidor, etc) |
| 🏷️ Iconos | Material Community Icons |
| 🖼️ Banner fondo | ImageBackground o LinearGradient |
| 🔄 Ver cambios | El frontend trae datos automáticamente via API |

¿Necesitas ayuda con algún paso específico?
