# 🎨 Visualización Completa - Footer & DetalleHabitación V2.0

## 📐 Arquitectura Visual Completa

### HomeScreen (Con Footer Integrado)

```
╔═══════════════════════════════════════════════╗
║                  HEADER APP                   ║
║         Hotel Luna Serena | Mar del Plata    ║
║      [Perfil] [Login] [Registro] [Logout]    ║
╠═══════════════════════════════════════════════╣
║                 HERO CAROUSEL                 ║
║  ┌─────────────────────────────────────────┐ ║
║  │                                         │ ║
║  │  BIENVENIDO A Hotel Luna Serena        │ ║
║  │  "Experimenta lujo, confort y elegancia"│ ║
║  │  [◆ ◇ ◇]          ← Pagination dots     │ ║
║  │                                         │ ║
║  └─────────────────────────────────────────┘ ║
╠═══════════════════════════════════════════════╣
║           MODERN SEARCH BAR                   ║
║  ┌─────────────────────────────────┬───┐    ║
║  │ 🔍 Buscar habitaciones...       │ ✕ │    ║
║  └─────────────────────────────────┴───┘    ║
╠═══════════════════════════════════════════════╣
║        QUICK ACCESS SECTION                   ║
║  ┌──────────────────┬──────────────────┐    ║
║  │   ☎️ CONTACTO    │  📍 UBICACIÓN   │    ║
║  │                  │                  │    ║
║  │  Teléfono/Email  │  Mar del Plata  │    ║
║  │  ────────────────────────────       │    ║
║  │  ✓ Disponible    │  ✓ En línea     │    ║
║  └──────────────────┴──────────────────┘    ║
╠═══════════════════════════════════════════════╣
║       MODERN ROOMS CAROUSEL                   ║
║        NUESTRAS HABITACIONES                  ║
║  ┌─────────────────────────────────────┐    ║
║  │  ┌─────────────────┐ ┌─────────────┐│   ║
║  │  │   [IMAGEN]      │ │ [IMAGEN]   ││    ║
║  │  │ Estándar        │ │ Doble      ││    ║
║  │  │ Habitación 101  │ │ Habitación ││    ║
║  │  │ 👥 2 personas   │ │ 👥 2 pers. ││    ║
║  │  │ 💰 $50/noche   │ │ 💰 $80     ││    ║
║  │  │ [VER] ✓Disponible  [VER]      ││    ║
║  │  └─────────────────┘ └─────────────┘│   ║
║  │  [◄ Ver todas ►]                    │    ║
║  └─────────────────────────────────────┘    ║
╠═══════════════════════════════════════════════╣
║            🏨 FOOTER SECTION 🏨              ║
╠════════════════╦════════════════╦════════════╣
║  RESERVA AHORA ║ ENLACES RÁPIDOS║ H. L. SERENA
╠════════════════╬════════════════╬════════════╣
║ ☎️ Teléfono    ║ 🏠 Inicio      ║ Descripción
║ +54 223...     ║ ► navigate()   ║ del hotel en
║                ║                ║ 2-3 líneas
║ 📧 Email       ║ 🛏️ Habitaciones║
║ info@...       ║ ► navigate()   ║ ⭐ Excelente
║                ║                ║    servicio
║ 📍 Ubicación   ║ 📅 Mis Reservas║
║ Mar del Plata  ║ ► navigate()   ║ 🛡️ 100%
║ Argentina      ║                ║    seguro
║                ║ 💬 Contacto    ║
║ 📱 Sociales:   ║ ► navigate()   ║ 🎧 Soporte
║ ✓ Facebook     ║                ║    24/7
║ ✓ Instagram    ║ ℹ️ Sobre Noso. ║
║ ✓ Twitter      ║ ► navigate()   ║
╠════════════════╩════════════════╩════════════╣
║ © 2026 Hotel Luna Serena - Derechos Reservad║
║         TÉRMINOS | PRIVACIDAD               ║
╚═══════════════════════════════════════════════╝
```

---

## 🏨 Footer - Desglose por Columna

### Columna 1: RESERVA AHORA
```
┌─────────────────────────┐
│   RESERVA AHORA         │  ← Merriweather 700, 16px, dorado
├─────────────────────────┤
│                         │
│ ☎️ TELÉFONO             │  ← Montserrat 500, 11px, mayúsculas
│ +54 223 123-4567        │  ← Montserrat 400, 13px, gris
│ (tappable con Linking)  │
│                         │
│ 📧 EMAIL                │  ← Montserrat 500, 11px, mayúsculas
│ info@hotellunaserena... │  ← Montserrat 400, 13px, gris
│ (tappable con Linking)  │
│                         │
│ 📍 UBICACIÓN            │  ← Montserrat 500, 11px, mayúsculas
│ Mar del Plata, Argentina│  ← Montserrat 400, 13px, gris
│                         │
│ REDES SOCIALES          │  ← Montserrat 500, 11px, mayúsculas
│ ⓞ ⓞ ⓞ                  │  ← Iconos circulares, dorado
│                         │
└─────────────────────────┘

Ancho: 33.33% de pantalla
Padding: 15px horizontal, 20px vertical
```

### Columna 2: ENLACES RÁPIDOS
```
┌─────────────────────────┐
│   ENLACES RÁPIDOS       │  ← Merriweather 700, 16px, dorado
├─────────────────────────┤
│                         │
│ 🏠 INICIO ►             │  ← Montserrat 500, 13px + chevron-right
│    navigate('Home')     │
│                         │
│ 🛏️ HABITACIONES ►       │  ← Montserrat 500, 13px + chevron-right
│    navigate('ListaH...')│
│                         │
│ 📅 MIS RESERVAS ►       │  ← Montserrat 500, 13px + chevron-right
│    navigate('MisRese...')
│                         │
│ 💬 CONTACTO ►           │  ← Montserrat 500, 13px + chevron-right
│    navigate('Contacto') │
│                         │
│ ℹ️ SOBRE NOSOTROS ►     │  ← Montserrat 500, 13px + chevron-right
│    navigate('SobreNoso')│
│                         │
└─────────────────────────┘

Ancho: 33.33% de pantalla
Padding: 15px horizontal, 20px vertical
Gap entre items: 12px
```

### Columna 3: HOTEL LUNA SERENA + ¿POR QUÉ ELEGIRNOS?
```
┌─────────────────────────┐
│ HOTEL LUNA SERENA       │  ← Merriweather 700, 16px, dorado
├─────────────────────────┤
│ Descripción del hotel   │  ← Montserrat 300, 13px, gris
│ en 2 a 3 líneas        │  ← line-height: 20
│ explicando lo que       │
│ somos...                │
│                         │
│ ¿POR QUÉ ELEGIRNOS?     │  ← Montserrat 600, 12px, mayúsculas, dorado
│                         │
│ ⭐ Excelente servicio   │  ← Icon + Montserrat 400, 13px
│ 🛡️ 100% seguro          │  ← Icon + Montserrat 400, 13px
│ 🎧 Soporte 24/7         │  ← Icon + Montserrat 400, 13px
│                         │
└─────────────────────────┘

Ancho: 33.33% de pantalla
Padding: 15px horizontal, 20px vertical
Gap entre items: 12px
```

---

## 📱 DetalleHabitacionScreen - Layout Completo

```
╔═════════════════════════════════════════════╗
║  ← (ATRÁS)                    ♡ (FAVORITO) ║  ← Custom Top Nav
║  (arrow-left)               (heart outline) ║     (semi-transparent 95%)
╠═════════════════════════════════════════════╣
║                                             ║
║         [IMAGEN PRINCIPAL GRANDE]           ║
║              (SCREEN_WIDTH)                 ║
║            (Height: 350px)                  ║
║                                             ║
║              • • • • •                      ║
║           (Dots: dorado cuando activo)     ║
║                                             ║
║         [T1] [T2] [T3] [T4]                ║
║      (Thumbnails 80x80, border dorado)    ║
╠═════════════════════════════════════════════╣
║ ESTÁNDAR                          DESDE      ║
║ Habitación 101                    $50        ║
║                                  / noche    ║
║ ✓ Disponible                                ║
╠═════════════════════════════════════════════╣
║ WiFi gratis  │  TV HD  │  Aire AC  │ 2 pers
║    (icono)   │ (icono) │ (icono)   │(icono)
║    fondo gris│  gris   │  gris     │  gris
╠═════════════════════════════════════════════╣
║ DESCRIPCIÓN                                 ║
║                                             ║
║ Habitación estándar acogedora con cama      ║
║ doble, baño privado y escritorio. Perfecta  ║
║ para parejas. Incluye WiFi, TV por cable y  ║
║ aire acondicionado.                         ║
╠═════════════════════════════════════════════╣
║ SERVICIOS INCLUIDOS                         ║
║                                             ║
║ ✓ WiFi gratis        │ ✓ TV por cable      ║
║ ✓ Aire acondicionado │ ✓ Baño privado     ║
║ ✓ Caja fuerte        │ ✓ Minibar           ║
╠═════════════════════════════════════════════╣
║ CHECK-IN    │  CHECK-OUT    │  TAMAÑO      ║
║  14:00      │    11:00      │   25 m²      ║
╠═════════════════════════════════════════════╣
║                                             ║
║        ┌─────────────────────────────┐     ║
║        │  [RESERVAR AHORA →]         │     ║  ← Floating button
║        │  (Dorado, shadow elevation) │     ║     (bottom 80px)
║        └─────────────────────────────┘     ║
║                                             ║
╠═════════════════════════════════════════════╣
║ 🏠 INICIO  │  🛏️ HABITAC.  │  📅 RESERVAS │ ║ ← Custom Bottom Nav
║ (home)    │  (bed)        │  (calendar) ║ ║   (NO hay icono izq)
║                      👤 USUARIO          ║ ║   (Usuario a derecha)
╚═════════════════════════════════════════════╝
```

---

## 🎯 Custom Navigation Bars

### Top Navigation Bar
```
┌────────────────────────────────────────┐
│ [←] SPACE                      [♡]      │
│ (40x40)                       (40x40)   │
│ Fondo gris F5F5F5             gris     │
│ Icono negro                   rojo/dorado
│ Tappable (0.7 opacity)        Tappable │
│                                        │
│ Posición: Absoluta                    │
│ Top: 0, zIndex: 10                    │
│ padding-top: 40 (SafeArea)            │
│ BackgroundColor: rgba(255,255,255,0.95)
│ BorderBottom: 1px, gris (#E0E0E0)    │
└────────────────────────────────────────┘
```

### Bottom Navigation Bar
```
┌────────────────────────────────────────┐
│ 🏠          🛏️            📅        👤 │
│ INICIO     HABITACIONES   RESERVAS  USUARIO
│ (home)     (bed)         (calendar) (account)
│ 22px       22px          22px       24px
│                                     (44x44 circle)
│
│ Gap entre botones: 25px
│ User icon gap: separado
│ BackgroundColor: White
│ BorderTop: 1px gris
│ Elevation: 8
│ Padding: 10px vertical, 20px horizontal
│
│ Funciones:
│ - Inicio: navigate('Home')
│ - Habitaciones: navigate('ListaHabitaciones')
│ - Reservas: navigate('MisReservas')
│ - Usuario: navigate('Perfil')
└────────────────────────────────────────┘
```

---

## 🎨 Color Scheme - Aplicado en Todos Lados

```
┌──────────────────────────────────────┐
│ Color Primario (Acentos)             │
│ #C9A961 - Dorado                     │
│ ─ Títulos                            │
│ ─ Links                              │
│ ─ Botones (Reserve, etc.)           │
│ ─ Icons resaltados                   │
├──────────────────────────────────────┤
│ Color Texto Principal                │
│ #1A1A1A - Negro                      │
│ ─ Títulos principales                │
│ ─ Texto del cuerpo                   │
├──────────────────────────────────────┤
│ Color Fondo                          │
│ #FFFFFF - Blanco                     │
│ ─ Fondos de cards                    │
│ ─ Fondos de secciones                │
├──────────────────────────────────────┤
│ Color Secundario (Texto)             │
│ #666666 - Gris Oscuro                │
│ ─ Subtítulos                         │
│ ─ Descripciones                      │
│ ─ Labels pequeños                    │
├──────────────────────────────────────┤
│ Color Borde                          │
│ #E0E0E0 - Gris Claro                 │
│ ─ Líneas divisoras                   │
│ ─ Bordes de cards                    │
├──────────────────────────────────────┤
│ Color Fondo Secundario               │
│ #F5F5F5 - Gris Muy Claro            │
│ ─ Fondos de inputs                   │
│ ─ Fondos de botones nav              │
├──────────────────────────────────────┤
│ Estado: Disponible                   │
│ #2ECC71 - Verde                      │
│ ─ Badges de disponibilidad           │
├──────────────────────────────────────┤
│ Estado: Favorito                     │
│ #EF4444 - Rojo                       │
│ ─ Icono de corazón lleno            │
└──────────────────────────────────────┘
```

---

## 📏 Especificaciones de Spacing

```
Padding Base:        20px
Margin Base:         25px
Gap entre items:     8-15px (depende del contexto)

Secciones:
├─ Padding horizontal: 20px
├─ Padding vertical:   25px
└─ Border bottom:      1px #F0F0F0

Cards:
├─ Border radius:     8px
├─ Padding:          12-16px
└─ Gap entre cards:   15px

Botones:
├─ Padding vertical:   16px
├─ Padding horizontal: 24px
├─ Border radius:      8px
└─ Gap con icono:      10px
```

---

## 🔤 Tipografía Exacta

```
TÍTULOS PRINCIPALES (H1)
├─ Font:        Merriweather_700Bold
├─ Size:        24px
├─ Line Height: 32px
├─ Letter Sp.:  0.5px
└─ Color:       #1A1A1A

TÍTULOS SECUNDARIOS (H2)
├─ Font:        Merriweather_700Bold
├─ Size:        18px
├─ Line Height: 24px
├─ Letter Sp.:  0.5px
└─ Color:       #1A1A1A

TEXTO PRINCIPAL
├─ Font:        Montserrat_300Light / 400Regular
├─ Size:        14px
├─ Line Height: 22px
├─ Color:       #666666

TEXTO SECUNDARIO
├─ Font:        Montserrat_400Regular
├─ Size:        13px
├─ Color:       #666666

LABELS / CATEGORÍAS
├─ Font:        Montserrat_500Medium / 600Semibold
├─ Size:        11-12px
├─ Letter Sp.:  1-2px
├─ Transform:   UPPERCASE
└─ Color:       #C9A961 (dorado) o #999999 (gris)

PEQUEÑO
├─ Font:        Montserrat_300Light
├─ Size:        11px
├─ Color:       #999999
```

---

## ✨ Elementos Especiales

### Pagination Dots
```
Inactivo:  8x8px, borderRadius 4, rgba(255,255,255,0.5)
Activo:    24x8px, borderRadius 4, #C9A961 (dorado)
Gap:       8px
Position:  Absoluta, bottom 80px
```

### Thumbnail Selection
```
Normal:  80x80px, borderRadius 8, border 2px transparent
Activo:  80x80px, borderRadius 8, border 2px #C9A961
Gap:     10px horizontal
```

### Badge "Disponible"
```
Fondo:      #E8F8F0 (verde claro)
Icono:      check-circle, #2ECC71
Texto:      "Disponible", 12px, #2ECC71
Padding:    6px vertical, 12px horizontal
Radius:     20px (pill shape)
```

---

## 🎬 Animaciones

```
Scroll Carousel:
├─ scrollViewRef.current?.scrollTo()
├─ animated: true
└─ Auto-index on scroll

Dot Transition:
├─ Width: 8px → 24px (when active)
└─ Color: rgba(255,255,255,0.5) → #C9A961

Touch Feedback:
├─ activeOpacity: 0.7 (botones)
└─ Haptic feedback: opcional
```

---

Diagrama completo que muestra cómo todo encaja perfectamente en la aplicación Hotel Luna Serena. 🏨✨
