# 🎨 VISUAL REFERENCE - HOTEL LUNA SERENA V2.1

**Descripciones visuales de la interfaz actualizada**

---

## 📱 HomeScreen - Pantalla Principal

```
┌─────────────────────────────────┐
│                                 │
│  ☰  HOTEL LUNA SERENA  ⓘ 👤   │  ← HeaderApp (dorado)
│                                 │
├─────────────────────────────────┤
│                                 │
│     [HERO CAROUSEL]             │
│     Banner de bienvenida        │
│     con 3 slides                │
│     (Imagen de fondo)           │
│                                 │
│  BIENVENIDO A                   │
│  Hotel Luna Serena              │
│  ─────────────────              │
│                                 │
├─────────────────────────────────┤
│                                 │
│  [Quick Access Cards]           │
│  ☎️ Contacto  📍 Ubicación      │
│                                 │
├─────────────────────────────────┤
│                                 │
│  HABITACIONES DESTACADAS        │ ← Título
│  ───────────────────────        │
│  Ver Todas →                    │
│                                 │
│  ┌──────────────────┐           │
│  │ [Imagen Suite]   │◄─ Auto   │
│  │ SUITE DELUXE ▲   │  scroll  │
│  │ Habitación 101   │  c/4seg  │
│  │ $150/noche       │           │
│  │ 👥2  ✓Disponible│           │
│  └──────────────────┘           │
│  ● ● ◉ ● ← Indicadores        │
│                                 │
├─────────────────────────────────┤
│                                 │
│  ⓘ Hotel Luna Serena            │
│                                 │
│  RESERVA AHORA │ ENLACES │HOTEL│
│  ☎️ Tel        │🏠 Inicio │⭐⭐⭐│
│  📧 Email      │🛏️ Habit │     │
│  📍 Ubicación  │📅 Reserv │"¿Por│
│  📱 Sociales   │💬 Contact│qué?"│
│                │ℹ️ Sobre  │     │
│                                 │
│  © 2026 | Términos | Privacidad │
│                                 │
└─────────────────────────────────┘
│                                 │
│ 🏠 INICIO  🛏️ HABIT  📅 RESERVAS │ ← CustomNavBar (dorado)
│                              👤│
└─────────────────────────────────┘
```

---

## 📋 ListaHabitacionesScreen - Búsqueda con Filtros

```
┌─────────────────────────────────┐
│                                 │
│  ← NUESTRAS HABITACIONES   👤   │ ← HeaderApp
│                                 │
├─────────────────────────────────┤
│                                 │
│  [Filtros] 🔍    [✕ Limpiar]   │ ← Barra de filtros
│   ↓ activos                     │
│                                 │
├─────────────────────────────────┤
│                                 │
│  Habitaciones encontradas: 8    │
│                                 │
│  ┌─────────────────────────┐    │
│  │[Img Habitación 101]     │    │
│  │SUITE DELUXE             │    │
│  │Habitación 101           │    │
│  │$150 /noche             │    │
│  │👥 2 personas            │    │
│  │✓ Disponible             │    │
│  │━━━━━━━━━━━━━━━━━━━━━   │    │
│  │ ♡ Más información       │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │[Img Habitación 102]     │    │
│  │ESTÁNDAR                 │    │
│  │Habitación 102           │    │
│  │$75 /noche              │    │
│  │👥 2 personas            │    │
│  │✓ Disponible             │    │
│  │━━━━━━━━━━━━━━━━━━━━━   │    │
│  │ ♡ Más información       │    │
│  └─────────────────────────┘    │
│                                 │
│  ... más habitaciones           │
│                                 │
└─────────────────────────────────┘
│                                 │
│ 🏠 INICIO  🛏️ HABIT  📅 RESERVAS │ ← CustomNavBar
│                              👤│
└─────────────────────────────────┘
```

---

## 🔍 Modal de Filtros - FiltrosAvanzados

```
┌─────────────────────────────────┐
│                                 │
│ ← Filtrar Habitaciones       ✕  │ ← Header dorado
│                                 │
├─────────────────────────────────┤
│                                 │
│ 👥 CAPACIDAD DE PERSONAS       │
│                                 │
│    [════════●════════════]     │
│              4 Personas        │
│                                 │
├─────────────────────────────────┤
│                                 │
│ 💰 RANGO DE PRECIO             │
│                                 │
│    Mín: $0      |  Máx: $300   │
│                                 │
│    Precio Mínimo:              │
│    [════════●════════════]     │
│              $50               │
│                                 │
│    Precio Máximo:              │
│    [════════════●═════════]    │
│                  $300          │
│                                 │
├─────────────────────────────────┤
│                                 │
│ ⭐ SERVICIOS Y COMODIDADES     │
│                                 │
│ [🚪] Suite Privada        [OFF] │
│                                 │
│ [🏠] Balcón               [ON] ✓ │
│                                 │
│ [🌊] Vista al Mar         [OFF] │
│                                 │
│ [🛁] Baño Privado         [ON] ✓ │
│                                 │
│ [❄️] Aire Acondicionado   [ON] ✓ │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [⟲ LIMPIAR]  [✓ APLICAR]       │
│                                 │
└─────────────────────────────────┘
```

---

## 🏨 DetalleHabitacionScreen - Detalle de Habitación

```
┌─────────────────────────────────┐
│                                 │
│ ← Atrás                  ♡ Fav │ ← Nav personalizada
│                                 │
├─────────────────────────────────┤
│                                 │
│    [IMAGEN GRANDE]              │
│    [Foto de habitación]         │
│                                 │
│    [T1] [T2] [T3]              │ ← Miniaturas
│    ━━━━━━━━━━━━━━━━━━          │
│    ● ● ◉ ● ← Indicadores      │
│                                 │
├─────────────────────────────────┤
│                                 │
│ CATEGORÍA                  $150 │
│ Habitación 101            /noche
│ ✓ Disponible                   │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [🌐] WiFi  [📺] TV  [❄️] AC [👥]2pers
│                                 │
├─────────────────────────────────┤
│                                 │
│ DESCRIPCIÓN                     │
│ ───────────────────────────     │
│ Habitación acogedora con vistas │
│ al mar. Incluye servicio de     │
│ limpieza diaria y wifi gratis.  │
│                                 │
├─────────────────────────────────┤
│                                 │
│ SERVICIOS INCLUIDOS             │
│ ───────────────────────────     │
│ ✓ WiFi gratis    ✓ Baño privado│
│ ✓ TV por cable   ✓ Caja fuerte │
│ ✓ Aire acond.    ✓ Minibar     │
│                                 │
├─────────────────────────────────┤
│                                 │
│ CHECK-IN   │  CHECK-OUT  │ TAMAÑO
│  14:00     │   11:00     │ 25 m²
│                                 │
│                  [RESERVAR →]   │ ← Botón flotante
│                                 │
└─────────────────────────────────┘
│                                 │
│ 🏠 INICIO  🛏️ HABIT  📅 RESERVAS │ ← Nav personalizada
│                              👤│
└─────────────────────────────────┘
```

---

## 👤 Modal de Usuario/Perfil

### Cuando está autenticado:

```
┌─────────────────────────────────┐
│                                 │
│         👤                       │
│     Juan Pérez                  │
│  juan@example.com               │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [📝] Mi Perfil                 │
│                                 │
│ [🔔] Notificaciones             │
│                                 │
│ [♡] Favoritos                  │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [🚪] Cerrar Sesión (en rojo)   │
│                                 │
│                             ✕ │ ← Cerrar
│                                 │
└─────────────────────────────────┘
```

### Cuando NO está autenticado:

```
┌─────────────────────────────────┐
│                                 │
│         ❓                       │
│  Bienvenido a Hotel Luna Serena │
│  Inicia sesión para acceder a   │
│  todas las funciones            │
│                                 │
├─────────────────────────────────┤
│                                 │
│ [🔑] INICIAR SESIÓN             │
│ (Botón dorado)                  │
│                                 │
│ [👤] CREAR CUENTA               │
│ (Botón con borde dorado)        │
│                                 │
│                             ✕ │
│                                 │
└─────────────────────────────────┘
```

---

## 🎨 PALETA DE COLORES APLICADA

```
┌─────────────────────────────────────┐
│                                     │
│  DORADO (Primario)                  │
│  ██████████████████████████  #C9A961│
│  Usado en: Barra nav, botones,      │
│           acentos, iconos           │
│                                     │
│  NEGRO (Texto Principal)            │
│  ██████████████████████████  #1A1A1A│
│  Usado en: Títulos, cuerpo          │
│                                     │
│  BLANCO (Fondos)                    │
│  ██████████████████████████  #FFFFFF│
│  Usado en: Cards, modales, fondos   │
│                                     │
│  GRIS (Texto Secundario)            │
│  ██████████████████████████  #666666│
│  Usado en: Subtítulos, detalles     │
│                                     │
└─────────────────────────────────────┘
```

---

## 📐 DIMENSIONES CLAVE

```
BARRA DE NAVEGACIÓN
├── Altura: 60px
├── Padding vertical: 12px
├── Padding horizontal: 20px
└── Botones: 24px icono, 10px fuente

CARDS DE HABITACIÓN
├── Ancho: 75% del screen
├── Alto: 300px
├── Border Radius: 16px
├── Margin derecha: 16px
└── Sombra: Elevation 5

HERO CAROUSEL
├── Alto: 420px
├── Border Radius: 12px
├── Padding: 20px
└── Overlay: rgba(0,0,0,0.3)

FOOTER
├── Padding: 24px
├── Gap entre columnas: 20px
├── Ancho por columna: 33.33%
└── Border top: 1px gris claro
```

---

## 🔄 FLUJO DE NAVEGACIÓN VISUAL

```
                    ┌──────────────┐
                    │  HomeScreen  │
                    │  (Principal) │
                    └──────┬───────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
    ┌───────────────┐  ┌─────────┐  ┌──────────────┐
    │AutoScroll     │  │QuickCard│  │Footer Links  │
    │Habitaciones   │  │Contact/ │  │Navegación    │
    │              │  │Location │  │Información   │
    └───────┬───────┘  └────┬────┘  └──────┬───────┘
            │                │              │
            └────────┬───────┴──────┬───────┘
                     │              │
              [Ver Todas]    [CustomNavBar]
                     │              │
                     ▼              ▼
          ┌──────────────────┐  ┌─────────┐
          │ListaHabitaciones │  │ Menú    │
          │ + Filtros        │  │ Usuario │
          └────────┬─────────┘  └────┬────┘
                   │                 │
          ┌────────┴─────┬──────┐    │
          │              │      │    │
          ▼              ▼      ▼    ▼
    ┌──────────────┐ ┌──────────┐ ┌──────────┐
    │DetalleHabit. │ │ Filtros  │ │ Perfil   │
    │+ Galería     │ │ Avanzados│ │ / Login  │
    └──────────────┘ └──────────┘ └──────────┘
           │
           ▼
    ┌──────────────┐
    │NuevaReserva  │
    │(Reservar)    │
    └──────────────┘
```

---

## 🌟 PUNTOS DESTACADOS DEL DISEÑO

```
✨ Barra de navegación dorada en la parte superior
   - Elegante
   - Accesible
   - Profesional

✨ Auto-scroll lento de habitaciones
   - Mantiene la atención
   - Mostrece ofertas automáticamente
   - Se pausa al tocar

✨ Sistema de filtros completo
   - 7 tipos diferentes
   - Interfaz intuitiva
   - Resultados en tiempo real

✨ Modal de usuario profesional
   - Textos visibles (no transparente)
   - Opciones claras
   - Buena UX

✨ Tipografía consistente
   - Merriweather para títulos (elegante)
   - Montserrat para cuerpo (limpio)

✨ Imágenes optimizadas
   - Carga rápida
   - Calidad visual
   - Responsive

✨ Paleta de colores premium
   - Dorado (lujo)
   - Negro (elegancia)
   - Blanco (limpieza)
```

---

## 📸 MOCK-UP FINAL

```
    ┌─────────────────┐
    │ HOTEL LUNA      │
    │ SERENA V2.1     │  ← Versión actual
    │                 │
    │ ✨ Premium      │
    │ ✨ Elegante     │
    │ ✨ Profesional  │
    │                 │
    │ 🚀 Producción   │
    └─────────────────┘
```

---

**Hotel Luna Serena**
*Lujo, Confort y Elegancia* ✨

Versión: 2.1.0
Status: ✅ COMPLETADO
