# 📸 GUÍA COMPLETA: CÓMO AGREGAR IMÁGENES A HOTEL LUNA SERENA

## 1. ESTRUCTURA DE CARPETAS DE IMÁGENES

```
frontend/src/
├── assets/
│   └── images/
│       ├── banner-hero.png          ← Banner principal inicio
│       ├── logo.png                 ← Logo del hotel
│       ├── splash.png               ← Pantalla de carga
│       ├── habitaciones/            ← Carpeta para fotos de habitaciones
│       │   ├── habitacion-101.jpg
│       │   ├── habitacion-102.jpg
│       │   ├── habitacion-103.jpg
│       │   └── ...
│       └── servicios/               ← Opcional: fotos de servicios
│           ├── restaurant.jpg
│           └── spa.jpg
```

---

## 2. CÓMO AGREGAR IMÁGENES DEL BANNER PRINCIPAL (Hero Carousel)

### Paso 1: Preparar la imagen
1. Descarga o crea una imagen de **1920x1080px** mínimo
2. Optimiza el tamaño (recomendado: 100-200KB máx)
3. Formatos soportados: **JPG, PNG, WebP**
4. Guarda como: `banner-hero-1.png` (ejemplo)

### Paso 2: Copiar la imagen
```bash
# Copia la imagen a la carpeta
cp ruta/a/mi/imagen.png frontend/src/assets/images/banner-hero-1.png
```

### Paso 3: Actualizar HomeScreen.js
Abre: `frontend/src/pantallas/home/HomeScreen.js`

Encuentra esta sección:
```javascript
<HeroCarousel
  slides={[
    {
      image: require('../../assets/images/placeholder-habitacion.png'),
      smallText: 'BIENVENIDO A',
      title: 'Hotel Luna Serena',
      description: 'Experimenta lujo, confort y elegancia en cada detalle',
    },
    ...
```

Reemplaza `placeholder-habitacion.png` con tu imagen:
```javascript
image: require('../../assets/images/banner-hero-1.png'),
```

### Ejemplo Completo:
```javascript
<HeroCarousel
  slides={[
    {
      image: require('../../assets/images/banner-exterior.png'),
      smallText: 'BIENVENIDO A',
      title: 'Hotel Luna Serena',
      description: 'Experimenta lujo, confort y elegancia en cada detalle',
    },
    {
      image: require('../../assets/images/banner-habitacion.png'),
      smallText: 'DESCUBRE',
      title: 'Habitaciones Premium',
      description: 'Espacios diseñados para tu máximo confort y descanso',
    },
    {
      image: require('../../assets/images/banner-servicios.png'),
      smallText: 'EXPERIMENTA',
      title: 'Servicios de Lujo',
      description: 'Atención personalizada y servicios exclusivos para ti',
    },
  ]}
/>
```

---

## 3. CÓMO AGREGAR LOGO DEL HOTEL

### Paso 1: Preparar el logo
- Tamaño recomendado: **200x200px** (mínimo)
- Formato: **PNG con fondo transparente**
- Nombre: `logo.png`

### Paso 2: Reemplazar en assets
```bash
# Reemplaza el logo existente
cp ruta/a/mi/logo.png frontend/src/assets/images/logo.png
```

### Paso 3: Agregar logo a HeaderApp (Barra superior)
Abre: `frontend/src/componentes/comun/HeaderApp.js`

En el JSX, busca dónde mostrar el logo y agrega:
```javascript
{showLogo && logoSource && (
  <Image
    source={logoSource}
    style={{
      width: 40,
      height: 40,
      resizeMode: 'contain',
      marginRight: 12,
    }}
  />
)}
```

En HomeScreen.js, actualiza:
```javascript
<HeaderApp
  title="Hotel Luna Serena"
  showLogo={true}
  logoSource={require('../../assets/images/logo.png')}
  // ... otros props
/>
```

---

## 4. CÓMO AGREGAR IMÁGENES A HABITACIONES

### Paso 1: Preparar las imágenes
- Crea una carpeta: `frontend/src/assets/images/habitaciones/`
- Prepara 3-4 fotos por habitación
- Tamaño recomendado: **1200x900px**
- Formatos: **JPG, PNG**
- Nombres claros: `habitacion-101-1.jpg`, `habitacion-101-2.jpg`, etc.

### Paso 2: Copiar imágenes
```bash
# Copia todas las imágenes a la carpeta
cp ruta/a/mis/fotos/* frontend/src/assets/images/habitaciones/
```

### Opción A: Imágenes locales (En la app)

En `DetalleHabitacionScreen.js`, actualiza el array de imágenes:
```javascript
const mockData = {
  id_habitacion: habitacionId,
  numero_habitacion: '101',
  tipo_habitacion: 'Suite Deluxe',
  precio_base: 150,
  estado: 'disponible',
  capacidad_personas: 2,
  imagen_principal: require('../../assets/images/habitaciones/habitacion-101-1.jpg'),
  galeria_imagenes: JSON.stringify([
    require('../../assets/images/habitaciones/habitacion-101-1.jpg'),
    require('../../assets/images/habitaciones/habitacion-101-2.jpg'),
    require('../../assets/images/habitaciones/habitacion-101-3.jpg'),
  ]),
  // ... resto de datos
};
```

### Opción B: Imágenes desde URL (Desde internet - RECOMENDADO)

Más fácil de cambiar sin recompilar la app:
```javascript
const mockData = {
  id_habitacion: habitacionId,
  numero_habitacion: '101',
  tipo_habitacion: 'Suite Deluxe',
  precio_base: 150,
  estado: 'disponible',
  capacidad_personas: 2,
  imagen_principal: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
  galeria_imagenes: JSON.stringify([
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop',
  ]),
  // ... resto de datos
};
```

### Paso 3: Actualizar en la base de datos (Producción)

Cuando uses la API real, actualiza la tabla `habitaciones`:
```sql
UPDATE habitaciones 
SET imagen_principal = 'https://url-de-imagen-1.jpg',
    galeria_imagenes = '["https://url-1.jpg","https://url-2.jpg","https://url-3.jpg"]'
WHERE id_habitacion = 101;
```

---

## 5. USAR IMÁGENES DE UNSPLASH (GRATUITO - FÁCIL)

### Opción recomendada para testing/demo:

Sitios gratuitos de imágenes:
- **Unsplash**: https://unsplash.com (Mejor para hoteles)
- **Pexels**: https://pexels.com
- **Pixabay**: https://pixabay.com

### Ejemplo con Unsplash:
```javascript
// Busca imágenes de habitaciones de hotel
// https://unsplash.com/search/hotel+room

// Copia la URL de imagen y úsala:
imagen_principal: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&h=900&fit=crop',
```

---

## 6. GUÍA RÁPIDA DE CAMBIOS

### Para cambiar el banner del inicio:
**Archivo**: `frontend/src/pantallas/home/HomeScreen.js`

Líneas aprox. 110-140: Cambia las URLs o rutas de imágenes en `HeroCarousel`

### Para cambiar el logo:
**Archivo**: `frontend/src/assets/images/logo.png`

Simplemente reemplaza el archivo con tu logo

### Para cambiar imágenes de habitaciones:
**Archivo**: `frontend/src/pantallas/habitaciones/DetalleHabitacionScreen.js`

Líneas aprox. 35-50: Actualiza `mockData` con nuevas imágenes

---

## 7. OPTIMIZACIÓN DE IMÁGENES

### Tamaños recomendados:
```
Banner/Hero:        1920x1080px (100-200KB)
Logo:              200x200px    (30-50KB)
Habitación:        1200x900px   (80-150KB)
Thumbnail:         400x300px    (40-80KB)
```

### Cómo optimizar en línea:
1. **TinyPNG**: https://tinypng.com
2. **ImageOptim**: Para Mac
3. **FileSize**: Reduce tamaño manteniendo calidad

### Comando para optimizar localmente:
```bash
# Con ImageMagick
convert entrada.jpg -quality 85 -resize 1200x900 salida.jpg
```

---

## 8. AGREGAR FOTOS DESDE EL DISPOSITIVO (APP MÓVIL)

Para permitir que los usuarios suban fotos (Fase siguiente):

```javascript
import * as ImagePicker from 'expo-image-picker';

const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
  });

  if (!result.cancelled) {
    setSelectedImage(result.uri);
  }
};
```

---

## 9. CAMBIAR IMÁGENES DESDE FIREBASE (CLOUD - AVANZADO)

Para producción, usa Firebase Storage:

```javascript
// Subir imagen
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase/app';
import 'firebase/storage';

const uploadImage = async (uri, path) => {
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(new TypeError('Network request failed'));
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase.storage().ref(path);
  const snapshot = await ref.put(blob);
  return await snapshot.ref.getDownloadURL();
};
```

---

## 10. CHECKLIST DE IMPLEMENTACIÓN

- [ ] Crear carpeta `frontend/src/assets/images/habitaciones/`
- [ ] Descargar imágenes de Unsplash o tus propias fotos
- [ ] Optimizar tamaño de imágenes
- [ ] Actualizar rutas en HomeScreen.js (banner)
- [ ] Actualizar rutas en DetalleHabitacionScreen.js (habitaciones)
- [ ] Reemplazar logo.png
- [ ] Probar en dispositivo
- [ ] Validar que las imágenes cargan correctamente

---

## 📝 EJEMPLO PRÁCTICO COMPLETO

### 1. Descarga 3 fotos de una habitación de Unsplash:
```
https://unsplash.com/search/hotel+bedroom
```

### 2. Copia las URLs de las imágenes

### 3. Abre `DetalleHabitacionScreen.js` línea ~35

### 4. Reemplaza en mockData:
```javascript
const mockData = {
  id_habitacion: habitacionId,
  numero_habitacion: '101',
  tipo_habitacion: 'Suite Deluxe',
  precio_base: 150,
  imagen_principal: 'https://images.unsplash.com/photo-XXXXXXXXX?w=800',
  galeria_imagenes: JSON.stringify([
    'https://images.unsplash.com/photo-AAAAAAAAAA?w=800',
    'https://images.unsplash.com/photo-BBBBBBBBBB?w=800',
    'https://images.unsplash.com/photo-CCCCCCCCCC?w=800',
  ]),
  // ... resto
};
```

### 5. Guarda y ejecuta la app
```bash
cd frontend
npx expo start
```

¡Listo! Las imágenes deberían aparecer en la app.

---

**¡Cualquier duda, avísame!** 🎉
