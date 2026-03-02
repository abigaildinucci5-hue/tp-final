# 🏗️ ARQUITECTURA FASE 2 - DIAGRAMA VISUAL

## 📊 FLUJO COMPLETO DE DATOS

```
┌─────────────────────────────────────────────────────────────────┐
│                        HOME SCREEN                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Buscador Rápido                                          │  │
│  │                                                          │  │
│  │  Fecha Check-in: [15 de Mar] ◄──── Modal Calendar     │  │
│  │  Fecha Check-out: [18 de Mar] ◄──── Modal Calendar    │  │
│  │  Huéspedes: 4 [+] [-]                                  │  │
│  │                                                          │  │
│  │  [   BUSCAR HABITACIONES   ]                           │  │
│  │        ║                                               │  │
│  │        ║ navigate('Habitaciones', {                   │  │
│  │        ║   fechaCheckIn: '2024-03-15',               │  │
│  │        ║   fechaCheckOut: '2024-03-18',              │  │
│  │        ║   numHuespedes: 4                            │  │
│  │        ║ })                                            │  │
│  │        ║                                               │  │
│  └────────╫──────────────────────────────────────────────┘  │
│           ║                                                   │
└───────────╫───────────────────────────────────────────────────┘
            ║
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 LISTA HABITACIONES SCREEN                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ CHIPS (Filtros Activos)                                  │  │
│  │                                                          │  │
│  │  [📅 15 Mar - 18 Mar ✕]  [👥 4 pers ✕]  [🏠 Premium ✕]│  │
│  │  (Cada ✕ remueve ese filtro)                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Header                          [🔍 Filtros]            │  │
│  │ 5 habitaciones encontradas                              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ LISTA DE HABITACIONES (FlatList)                         │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │ [👥 2]          HAB. 101                       │    │  │
│  │  │ Estándar        Habitación acogedora...       │➜  │  │
│  │  │ $80/noche       68 reservas                    │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │         ║                                               │  │
│  │         ║ Click → navigate('DetalleHabitacion', {      │  │
│  │         ║   habitacionId: 1,                           │  │
│  │         ║   fechaCheckIn: '2024-03-15',               │  │
│  │         ║   fechaCheckOut: '2024-03-18',              │  │
│  │         ║   numHuespedes: 4                            │  │
│  │         ║ })                                            │  │
│  │         ║                                               │  │
│  │  ┌─────▼──────────────────────────────────────────────┐    │
│  │  │ [👥 2]          HAB. 102                       │    │  │
│  │  │ Premium         Elegante con balcón...         │➜  │  │
│  │  │ $150/noche      45 reservas                    │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────┐    │  │
│  │  │ [👥 4]          HAB. 201                       │    │  │
│  │  │ Suite           Suite de lujo...               │➜  │  │
│  │  │ $300/noche      92 reservas                    │    │  │
│  │  └────────────────────────────────────────────────┘    │  │
│  │                                                          │  │
│  │  (... más habitaciones)                               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
            ║
            ║ (Click en habitación)
            ▼
┌─────────────────────────────────────────────────────────────────┐
│                   DETALLE HABITACION SCREEN                      │
│                       (FASE 3 - TBD)                            │
└─────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────┐
│                    MODAL FILTROS (Overlay)                       │
│                                                                 │
│  [✕] Filtros                                   [Limpiar todo]  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Precio por noche                                         │  │
│  │ $100  -  $250                                            │  │
│  │ Mínimo:   [═════════════════════════════════]           │  │
│  │ Máximo:   [════════════════════════════════════════]   │  │
│  │                                                          │  │
│  │ Tipo de habitación                                       │  │
│  │ [▼ Todas ▼]                                             │  │
│  │   ├─ Todas                                              │  │
│  │   ├─ Estándar                                          │  │
│  │   ├─ Premium                                           │  │
│  │   ├─ Suite                                             │  │
│  │   └─ Deluxe                                            │  │
│  │                                                          │  │
│  │ Ordenar por                                              │  │
│  │ [▼ Precio: Menor a Mayor ▼]                            │  │
│  │   ├─ Precio: Menor a Mayor                             │  │
│  │   ├─ Precio: Mayor a Menor                             │  │
│  │   ├─ Capacidad: Menor a Mayor                          │  │
│  │   ├─ Capacidad: Mayor a Menor                          │  │
│  │   └─ Más Populares                                     │  │
│  │                                                          │  │
│  │       [  Mostrar 3 habitaciones  ]                     │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 ESTADO MANAGEMENT

### States Principales
```javascript
// Parámetros del Home (lectura del route.params)
fechaCheckIn      → string o null
fechaCheckOut     → string o null
numHuespedes      → number o null

// Datos
habitaciones      → Array de objetos (completo)
habitacionesFiltradas → Array (después de filtros)
cargando          → boolean (para spinner)

// Filtros Activos
precioMin         → number (0-500)
precioMax         → number (0-500)
tipoHabitacion    → string ('todas' | 'estandar' | 'premium' | ...)
ordenarPor        → string ('precio_asc' | 'precio_desc' | ...)

// UI
mostrarFiltros    → boolean (modal visible)
```

### Flujo de Cambio de Estado
```
┌─────────────────────────────────────────────────────────┐
│ Usuario interactúa en Modal                             │
│ (Mueve slider / Selecciona picker)                      │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
         setState (precio, tipo, etc)
                 │
                 ▼
         useEffect → aplicarFiltros()
                 │
    ┌────────────┼────────────┐
    ▼            ▼            ▼
Filtra por   Filtra por   Ordena
precio       tipo/capacidad resultados
    │            │            │
    └────────────┴────────────┘
                 │
                 ▼
         setHabitacionesFiltradas()
                 │
                 ▼
         FlatList re-renderiza
                 │
                 ▼
         Usuario ve cambios en tiempo real
```

---

## 🎨 ESTRUCTURA DE COMPONENTES

```
ListaHabitacionesScreen
│
├─ HeaderApp (componente reutilizable)
│  └─ Título "Habitaciones"
│
├─ Chips Container (ScrollView horizontal)
│  ├─ Chip Fechas
│  ├─ Chip Personas
│  └─ Chip Tipo
│
├─ Header con Botón Filtros
│  └─ Contador de resultados
│
├─ FlatList (Lista de Habitaciones)
│  ├─ renderHabitacionCard (iteración)
│  │  └─ TouchableOpacity (clickeable)
│  │     ├─ Badge de capacidad
│  │     ├─ Número y tipo
│  │     ├─ Descripción
│  │     ├─ Precio
│  │     └─ Reservas
│  │
│  └─ Empty State (si 0 resultados)
│     ├─ Ícono
│     ├─ Mensaje
│     └─ Botón "Limpiar filtros"
│
└─ Modal Filtros
   ├─ Header Close
   └─ ScrollView
      ├─ Sección Precio
      │  ├─ Display $100 - $250
      │  ├─ Slider Min
      │  └─ Slider Max
      │
      ├─ Sección Tipo
      │  └─ Picker
      │
      ├─ Sección Ordenar
      │  └─ Picker
      │
      └─ Botón Aplicar
```

---

## 📈 DATOS ESPERADOS

### Estructura de Habitación (del API)
```javascript
{
  id: 1,
  numero: '101',
  tipo: 'Estándar',              // 'Estándar' | 'Premium' | 'Suite' | 'Deluxe'
  capacidad: 2,                  // número de personas
  precio_por_noche: 80,          // número (moneda)
  descripcion: 'Acogedora...',   // string
  total_reservas: 45             // número (para "Más populares")
}
```

### Estructura de route.params
```javascript
route.params = {
  fechaCheckIn: '2024-03-15',    // formato ISO
  fechaCheckOut: '2024-03-18',   // formato ISO
  numHuespedes: 4                // número
}
```

---

## 🧬 LÓGICA DE FILTROS

### Filtro 1: Precio
```javascript
resultado = resultado.filter(hab => 
  hab.precio_por_noche >= precioMin && 
  hab.precio_por_noche <= precioMax
);
```

**Ejemplo:**
```
precioMin = $100, precioMax = $200
┌─────────────────────────────────────┐
│ Hab 101 ($80)  → ❌ Eliminado       │
│ Hab 102 ($150) → ✅ Incluido        │
│ Hab 201 ($300) → ❌ Eliminado       │
└─────────────────────────────────────┘
```

### Filtro 2: Tipo de Habitación
```javascript
if (tipoHabitacion !== 'todas') {
  resultado = resultado.filter(hab => 
    hab.tipo.toLowerCase() === tipoHabitacion.toLowerCase()
  );
}
```

**Ejemplo:**
```
tipoHabitacion = 'Premium'
┌─────────────────────────────────────┐
│ Hab 101 (Estándar)  → ❌ Eliminado  │
│ Hab 102 (Premium)   → ✅ Incluido   │
│ Hab 201 (Suite)     → ❌ Eliminado  │
└─────────────────────────────────────┘
```

### Filtro 3: Capacidad
```javascript
if (numHuespedes) {
  resultado = resultado.filter(hab => 
    hab.capacidad >= numHuespedes
  );
}
```

**Ejemplo:**
```
numHuespedes = 4
┌─────────────────────────────────────┐
│ Hab 101 (cap. 2) → ❌ Eliminado     │
│ Hab 102 (cap. 2) → ❌ Eliminado     │
│ Hab 201 (cap. 4) → ✅ Incluido      │
│ Hab 202 (cap. 3) → ❌ Eliminado     │
└─────────────────────────────────────┘
```

### Ordenamiento
```javascript
switch (ordenarPor) {
  case 'precio_asc':
    resultado.sort((a, b) => a.precio_por_noche - b.precio_por_noche);
    // $80, $90, $150, $200, $300
    break;
    
  case 'precio_desc':
    resultado.sort((a, b) => b.precio_por_noche - a.precio_por_noche);
    // $300, $200, $150, $90, $80
    break;
    
  case 'popularidad':
    resultado.sort((a, b) => (b.total_reservas || 0) - (a.total_reservas || 0));
    // 92 reservas, 78 reservas, 68 reservas, ...
    break;
}
```

---

## 🔀 COMBINACIÓN DE FILTROS

Todos se aplican en secuencia:

```
Habitaciones Originales (5)
    ↓
├─ Filtro Precio: $100-$200
│  Resultado: 3 habitaciones
│    ↓
├─ Filtro Tipo: Premium
│  Resultado: 2 habitaciones
│    ↓
├─ Filtro Capacidad: >= 2 personas
│  Resultado: 2 habitaciones
│    ↓
├─ Ordenar por Precio (menor a mayor)
│  Resultado: [Hab 102 ($150), Hab 201 ($300)]  ← ❌ 201 sobrepasa max
│
└─ Final: 1 habitación mostrada ✅
```

---

## 🌐 NAVEGACIÓN STACK

```
MainNavigator
├─ HomeStack
│  └─ HomeScreen
│
├─ HabitacionesStack (FASE 2)
│  ├─ ListaHabitacionesScreen ◄── Navegamos aquí desde Home
│  └─ DetalleHabitacionScreen (FASE 3)
│
├─ ReservasStack (FASE 4)
│  ├─ MisReservasScreen
│  └─ ConfirmarReservaScreen
│
└─ ... Otros stacks
```

---

## ⚡ RENDIMIENTO

### Optimizaciones Implementadas
1. **useCallback** en `aplicarFiltros()`
   - Evita re-crear función en cada render
   - Dependencies: [habitaciones, precioMin, precioMax, numHuespedes, ...]

2. **FlatList optimizado**
   - keyExtractor: usa id único (id.toString())
   - removeClippedSubviews: mejora scroll
   - No renderiza items fuera de viewport

3. **Filtrado client-side**
   - Rápido para listas pequeñas (< 100 items)
   - Si API crece, pasar filtrado al backend

---

## 📱 RESPONSIVE DESIGN

### Mobile (320px - 480px)
- Cards ocupan 100% del ancho menos padding
- Chips scrollean horizontalmente
- Modal ocupa 100% de pantalla
- Botones tienen altura mínima de 48px

### Tablet (481px - 1024px)
- Cards se ajustan automáticamente
- Grid podría optimizarse (fase posterior)
- Modal ancla mejor

---

## ✅ CHECKLIST DE VALIDACIÓN RÁPIDA

- [ ] Parámetros llegan desde Home
- [ ] Chips muestran filtros del home
- [ ] Filtros funcionan (precio, tipo, capacidad)
- [ ] Ordenamiento funciona
- [ ] Modal abre y cierra
- [ ] Limpiar filtros resetea todo
- [ ] Navega a detalle con parámetros
- [ ] Sin parámetros no crashea
- [ ] API falla → datos de prueba
- [ ] 0 resultados → empty state

---

## 🎓 CONCEPTOS CLAVE

**Filtraje Progresivo:** Cada filtro se aplica al resultado anterior, no al original
**Estado Compartido:** route.params actúan como "lecturas" no como "escrituras"
**Renderizado Condicional:** Empty state, loading, lista según estado
**Performance:** useCallback + FlatList optimization

---

## 📊 RESUMEN VISUAL

```
          🔍 FILTROS (Modal)
              │
    ┌─────────┼─────────┐
    ▼         ▼         ▼
  Precio    Tipo    Ordenar
    │         │         │
    └─────────┼─────────┘
              │
              ▼
    aplicarFiltros()
              │
        Filtra en memoria
              │
              ▼
  setHabitacionesFiltradas()
              │
              ▼
    FlatList renderiza
              │
              ▼
    Usuario ve resultados
```

