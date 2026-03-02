# 🎬 VISUALIZACIÓN - HOMESCREEN V2.0

## 📱 LAYOUT VISUAL

```
┌─────────────────────────────┐
│   HEADER APP (Dorado)       │  ← Existente, sin cambios
├─────────────────────────────┤
│                             │
│   [◄─ HERO CAROUSEL ─►]     │  ← 420px altura
│   - Slide 1: Bienvenida     │  ← Imagen de fondo + overlay oscuro
│   - Slide 2: Habitaciones   │  ← Texto elegante centrado
│   - Slide 3: Servicios      │  ← Indicadores interactivos
│                             │
├─────────────────────────────┤
│ 🔍 Buscar habitaciones...  │  ← Barra búsqueda minimalista
├─────────────────────────────┤
│                             │
│  ┌─────────┐    ┌─────────┐ │  ← Quick Access (lado a lado)
│  │   ☎️    │    │   📍    │ │  ← Ícono en círculo dorado
│  │Contacto │    │Ubicación│ │  ← Divisor dorado
│  │Estamos..│    │Encuént..│ │  ← Título + subtítulo
│  └─────────┘    └─────────┘ │
│                             │
├─────────────────────────────┤
│                             │
│   NUESTRAS HABITACIONES     │  ← Título centrado
│   ─────────────────         │  ← Subrayado dorado
│                             │
│  ┌─────────────────────┐    │  ← 75% ancho pantalla
│  │      [IMAGEN]       │    │  ← 280px alto
│  │  [DISPONIBLE badge] │    │  ← Badge verde
│  │                     │    │
│  │ ESTÁNDAR            │    │  ← Categoría (dorado)
│  │ Habitación 101      │    │  ← Título
│  │ 👥 2 personas       │    │  ← Capacidad
│  │ ─────────────────── │    │  ← Línea separadora
│  │ Desde  $50/noche    │    │  ← Precio + botón "Ver"
│  │        [→ Ver]      │    │
│  └─────────────────────┘    │
│  (Scroll para más...)       │
│                             │
├─────────────────────────────┤
│   ¿Por qué elegir?          │  ← Sección informativa
│   ⭐ Excelente servicio     │  ← Mantener
│   🛡️  100% seguro          │
│   🎧 Soporte 24/7          │
├─────────────────────────────┤
│                 [Espacio]   │
└─────────────────────────────┘
```

---

## 🎨 COMPONENTES DETALLADOS

### 1️⃣ HERO CAROUSEL

```
┌─────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │  ← Imagen de fondo
│  ▓▓▓▓▓▓ [Overlay oscuro] ▓▓▓▓▓▓  │     (Splash image)
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│                                 │
│          BIENVENIDO A           │  ← pequeño texto, 14px
│           ─────────             │  ← divisor dorado (50px)
│    HOTEL LUNA SERENA            │  ← título grande (36px, serif)
│   Experimenta lujo y elegancia  │  ← descripción (15px)
│                                 │
│  ● ● ○                          │  ← indicadores de página
│                                 │
└─────────────────────────────────┘

Altura: 420px
Scroll: Horizontal
Indicadores: Interactivos (tap para ir a slide)
```

### 2️⃣ SEARCH BAR

```
┌─────────────────────────────────┐
│ 🔍 Buscar habitaciones...   ✕   │  ← Input minimalista
│                                 │  ← Ícono búsqueda (gris)
│                                 │  ← X para limpiar (cuando hay texto)
└─────────────────────────────────┘

Fondo: Gris claro (#F8F9FA)
Borde: Gris claro (#E5E7EB)
Al enfocar: Borde dorado (#C9A961)
Altura: 44px (aprox)
```

### 3️⃣ QUICK ACCESS CARDS

```
┌─────────────────────┬─────────────────────┐
│                     │                     │
│        ◯ ☎️ ◯        │      ◯ 📍 ◯         │  ← Ícono en círculo
│                     │                     │  ← Fondo: dorado muy claro
│       ────────      │      ────────       │  ← Divisor dorado
│                     │                     │
│      Contacto       │      Ubicación      │  ← Título (serif)
│  Estamos para...    │  Encuéntranos...   │  ← Subtítulo (sans)
│                     │                     │
└─────────────────────┴─────────────────────┘

Layout: Flex row, 48% + 48% ancho
Borde: 1px gris claro
Padding: 25px
Sombra: Leve (elevation: 2)
```

### 4️⃣ ROOMS CAROUSEL

```
NUESTRAS HABITACIONES       ← Título centrado (serif, 24px)
─────────────────           ← Subrayado dorado (60px)
         Ver Todas →        ← Link interactivo

┌──────────────────────────────────────────┐
│                                          │
│    ┌──────────────────────────────────┐  │
│    │        [IMAGEN 280px]            │  │
│    │     [DISPONIBLE] (badge verde)   │  │
│    ├──────────────────────────────────┤  │ ← 75% ancho
│    │                                  │  │   (277px en 369px screen)
│    │ ESTÁNDAR                         │  │
│    │ Habitación 101                   │  │
│    │ 👥 2 personas                    │  │
│    │ ────────────────────────────── │  │
│    │ Desde  $50      [→ Ver]         │  │
│    │      / noche                    │  │
│    └──────────────────────────────────┘  │
│    (Scroll → para más cards)             │
│                                          │
└──────────────────────────────────────────┘

Margen: 10px entre cards
Snap: Auto-scroll con paging
Card Height: ~360px (280px img + 80px content)
```

---

## 🎯 PALETA DE COLORES EN ACCIÓN

```
┌─ DORADO PRINCIPAL ──────────────────┐
│ #C9A961                             │
│ • Divisores en hero carousel        │
│ • Subrayado del título habitaciones │
│ • Ícono en quick access cards       │
│ • Botón "Ver" en room cards         │
│ • "Ver Todas" link                  │
│ • Categoría en room cards           │
└─────────────────────────────────────┘

┌─ NEGRO SOFISTICADO ─────────────────┐
│ #1A1A1A (textoOscuro)               │
│ • Títulos principales (serif)       │
│ • Textos de tarjetas                │
│ • Números de habitación             │
└─────────────────────────────────────┘

┌─ BLANCO LIMPIO ─────────────────────┐
│ #FFFFFF                             │
│ • Fondo general de cards            │
│ • Texto sobre fondos oscuros        │
│ • Fondo de inputs                   │
└─────────────────────────────────────┘

┌─ GRISES COMPLEMENTARIOS ────────────┐
│ #F8F9FA (grisClaro) - Fondos        │
│ #E5E7EB (grisBorde) - Bordes        │
│ #6C757D (textoMedio) - Textos 2do   │
└─────────────────────────────────────┘

┌─ ESTADO DISPONIBLE ─────────────────┐
│ #10B981 (Verde)                     │
│ • Badge "DISPONIBLE" en cards       │
└─────────────────────────────────────┘
```

---

## 📏 TIPOGRAFÍAS

```
SERIFS (Merriweather - Elegante):
┌──────────────────────────┐
│ BIENVENIDO A             │ ← 14px, 300 Light
│ ────                     │
│ HOTEL LUNA SERENA        │ ← 36px, 700 Bold
│ Descripción...           │ ← 15px, 300 Light
│                          │
│ NUESTRAS HABITACIONES    │ ← 24px, 700 Bold
│ Habitación 101           │ ← 20px, 700 Bold
└──────────────────────────┘

SANS-SERIF (Montserrat - Moderno):
┌──────────────────────────┐
│ Buscar habitaciones...   │ ← 14px, 400 Regular
│ ESTÁNDAR                 │ ← 11px, 500 Medium
│ 👥 2 personas           │ ← 12px, 300 Light
│ Desde $50/noche         │ ← 11px-24px, 300-700 Mixed
└──────────────────────────┘
```

---

## 🎬 INTERACTIVIDAD

```
HERO CAROUSEL:
  1. Swipe left/right → cambiar slide
  2. Tap en indicador → ir a slide específico
  3. Auto-scroll deshabilitado (manual)

SEARCH BAR:
  1. Tap → enfoque (borde dorado)
  2. Type → actualizar estado
  3. X → limpiar búsqueda
  4. Return → buscar

QUICK ACCESS:
  1. Tap Contacto → handleContactPress()
  2. Tap Ubicación → handleLocationPress()
  3. Efecto opacity: 0.85 on press

ROOMS CAROUSEL:
  1. Swipe left/right → scroll cards
  2. Tap en card → navegar a detalle
  3. Tap "Ver" → navegar a detalle
  4. Tap "Ver Todas" → navegar a lista completa
```

---

## 📊 RESPONSIVE DESIGN

```
IPHONE SE (375px):
┌─────────┐
│ Hero    │ ← 375px × 420px
├─────────┤
│ Search  │ ← 335px (375 - 40px padding)
├─────────┤
│ QA      │ ← 2 cards: 160px each
├─────────┤
│ Rooms   │ ← 75% = 281px wide cards
├─────────┤
│ Info    │ ← 335px (375 - 40px padding)
└─────────┘

IPHONE 12 (390px):
┌─────────┐
│ Hero    │ ← 390px × 420px
├─────────┤
│ Search  │ ← 350px (390 - 40px padding)
├─────────┤
│ QA      │ ← 2 cards: 170px each
├─────────┤
│ Rooms   │ ← 75% = 292px wide cards
├─────────┤
│ Info    │ ← 350px (390 - 40px padding)
└─────────┘

IPAD (768px):
┌──────────────────┐
│ Hero             │ ← 768px × 420px
├──────────────────┤
│ Search           │ ← 728px (768 - 40px padding)
├──────────────────┤
│ QA QA            │ ← 2 cards: 354px each
├──────────────────┤
│ Rooms carousel   │ ← 75% = 576px wide cards
├──────────────────┤
│ Info             │ ← 728px (768 - 40px padding)
└──────────────────┘
```

---

## 🎨 ESTADOS Y TRANSICIONES

```
HERO CAROUSEL:
  Normal      → Opacity 1.0
  Transitioning → Smooth scroll
  Indicator clicked → Animated scroll to index

SEARCH BAR:
  Unfocused   → Borde gris, Ícono gris
  Focused     → Borde dorado, Ícono dorado
  Text entered → Mostrar botón X

QUICK ACCESS:
  Normal      → Opacity 1.0
  Pressed     → Opacity 0.85
  Completed   → Popup/Modal

ROOMS CARD:
  Normal      → Opacity 1.0
  Pressed     → Opacity 0.9
  Loading     → Spinner
  Empty       → Mensaje "No hay habitaciones"

SECTION INFO:
  Normal      → Fondo dorado muy claro
  Visible     → Fade in suave
```

---

## ✅ VALIDACIÓN VISUAL

Cuando abras HomeScreen v2.0, deberías ver:

1. ✓ Header app (dorado/blanco)
2. ✓ Hero carousel con 3 slides hermosos
3. ✓ Indicadores de página en la base
4. ✓ Barra búsqueda minimalista
5. ✓ 2 cards de quick access (contacto/ubicación)
6. ✓ Título "NUESTRAS HABITACIONES" centrado
7. ✓ Carrusel de habitaciones con cards hermosas
8. ✓ Badges verdes "DISPONIBLE"
9. ✓ Precios destacados en cada card
10. ✓ Sección "¿Por qué elegir?" al final

---

**Todos los elementos deben verse profesionales, elegantes y coherentes con la paleta dorada/negra/blanca.**

Si algo no se ve así, revisa los imports de colores o el archivo CSS de estilos.
