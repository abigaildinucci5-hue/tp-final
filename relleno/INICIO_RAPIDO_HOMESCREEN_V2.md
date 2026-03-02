# ⚡ INICIO RÁPIDO - HOMESCREEN V2.0

## 🚀 COMIENZA AQUÍ

### Paso 1: Verificar la compilación
```bash
cd frontend
npm start
# O
npx expo start
```

### Paso 2: Probar en la aplicación
- Abre la pantalla Home
- Deberías ver:
  1. **Hero Carousel** - 3 slides con imágenes
  2. **Barra de búsqueda** - Input minimalista
  3. **Quick Access** - 2 cards (Contacto/Ubicación)
  4. **Carrusel Habitaciones** - Cards elegantes
  5. **¿Por qué elegir?** - Sección de beneficios

### Paso 3: Navegar y probar
- 📸 Swipea en el hero carousel
- 🔍 Escribe en la barra de búsqueda
- 🏠 Toca una habitación para ver detalles
- 👆 Toca "Ver Todas" para ver lista completa

---

## 📁 ARCHIVOS NUEVOS (SOLO LECTURA)

```
✨ RECIÉN CREADOS:
  ├── HeroCarousel.js           (componentes/comun/)
  ├── ModernSearchBar.js        (componentes/comun/)
  ├── QuickAccessSection.js     (componentes/comun/)
  ├── ModernRoomsCarousel.js    (componentes/habitaciones/)
  ├── GUIA_HOMESCREEN_RENOVADO_V2.md
  └── RESUMEN_HOMESCREEN_V2.0.md
```

---

## 🎨 LO VISUAL

### Paleta de Colores
- 🟡 **Dorado**: `#C9A961` (acentos, botones)
- ⚫ **Negro**: `#1A1A1A` (textos principales)
- ⚪ **Blanco**: `#FFFFFF` (fondos claros)
- 🔘 **Grises**: `#F8F9FA`, `#6C757D` (backgrounds, textos secundarios)

### Tipografías
- **Títulos**: Merriweather (serif elegante)
- **Cuerpo**: Montserrat (sans-serif moderno)

---

## ⚙️ CONFIGURACIÓN (Si necesitas)

### Si falta Expo Font (para tipografías)
```bash
expo install @expo-google-fonts/montserrat @expo-google-fonts/merriweather expo-font
```

### Luego en App.js:
```javascript
import * as Font from 'expo-font';

// Asegúrate de cargar las fuentes antes de renderizar la app
```

---

## 🔍 VERIFICACIÓN RÁPIDA

En consola, NO deberías ver:
- ❌ Errores de compilación
- ❌ Imports no encontrados
- ❌ Warnings sobre props
- ❌ Errores de tipografía

---

## 💡 PRÓXIMOS PASOS OPCIONALES

### Para personalizarlo:
1. Cambiar imágenes del hero carousel
2. Cambiar textos de los slides
3. Implementar funciones de contacto/ubicación
4. Agregar más slides si quieres

---

## 📞 AYUDA RÁPIDA

**"El hero carousel no se ve"**
- Verifica que las imágenes existen en `assets/images/`
- Revisa el path en los `require()`

**"Los textos se ven pixelados"**
- Instala las fuentes de Google Fonts
- Recarga la app (Ctrl+R)

**"Las habitaciones no cargan"**
- Verifica que el API está corriendo en backend
- Revisa la consola para errores de API

**"Los colores no son dorados"**
- Revisa `COLORES.dorado` en `constantes/colores.js`
- Debería ser `#C9A961`

---

## 📚 DOCUMENTACIÓN COMPLETA

Para información detallada:
👉 Abre [GUIA_HOMESCREEN_RENOVADO_V2.md](GUIA_HOMESCREEN_RENOVADO_V2.md)

Para resumen ejecutivo:
👉 Abre [RESUMEN_HOMESCREEN_V2.0.md](RESUMEN_HOMESCREEN_V2.0.md)

---

## ✅ CHECKLIST RÁPIDO

- [ ] Ejecuté `npm start` sin errores
- [ ] Veo el hero carousel con 3 slides
- [ ] La barra de búsqueda funciona
- [ ] Las tarjetas de contacto/ubicación se ven bien
- [ ] El carrusel de habitaciones muestra data
- [ ] Puedo navegar a detalles de una habitación
- [ ] Los colores se ven profesionales
- [ ] Las fuentes se ven correctas

---

**¡Listo! Tu HomeScreen está renovado. ¡Disfruta! 🎉**

Para cualquier duda, revisa la documentación completa o verifica los archivos de componentes.
