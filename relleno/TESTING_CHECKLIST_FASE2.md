# 🧪 CHECKLIST DE TESTING - FASE 2: LISTA DE HABITACIONES

## 📋 RESUMEN
Este checklist verifica que la FASE 2 (ListaHabitacionesScreen con filtros) funcione correctamente. Incluye pruebas manuales y validación de parámetros.

---

## ✅ TESTING BÁSICO

### 1. Navegación desde HomeScreen
- [ ] En HomeScreen, llenar el buscador con:
  - Fecha Check-in: 15 de marzo
  - Fecha Check-out: 18 de marzo
  - Huéspedes: 4
- [ ] Clickear botón "Buscar"
- [ ] **Esperado:** Redirige a ListaHabitacionesScreen
- [ ] **Verificar:** Los parámetros llegan correctamente en route.params

### 2. Visualización de Chips (Filtros Aplicados)
- [ ] Chips deben mostrar:
  - [ ] "15 Mar - 18 Mar" (fechas recibidas)
  - [ ] "4 pers." (número de huéspedes)
- [ ] Cada chip tiene un ícono de cerrar (X)
- [ ] Clickear X en chip de fecha → **Resultado:** Las fechas se borran, lista se actualiza
- [ ] Clickear X en chip de personas → **Resultado:** Filtro se borra, lista se actualiza

### 3. Visualización de Habitaciones
- [ ] Se cargan habitaciones de prueba (si API falla)
- [ ] **Esperado:** Mínimo 5 habitaciones visibles
- [ ] Cada habitación muestra:
  - [ ] Número de habitación (ej: "Hab. 101")
  - [ ] Tipo (Estándar, Premium, Suite, Deluxe)
  - [ ] Descripción
  - [ ] Precio por noche
  - [ ] Badge de capacidad (# personas)
  - [ ] Número de reservas (si aplica)
- [ ] Contador dice "X habitaciones encontradas"

---

## 🔍 TESTING DE FILTROS

### 4. Filtro de Precio
- [ ] Abrir modal de filtros
- [ ] Observar sliders de "Mínimo" y "Máximo"
- [ ] Mover slider mínimo a $200
- [ ] Mover slider máximo a $400
- [ ] Clickear "Mostrar X habitaciones"
- [ ] **Esperado:** Solo habitaciones entre $200-$400 se muestran
- [ ] Verificar precios mostrados están en rango

### 5. Filtro de Tipo de Habitación
- [ ] Abrir modal de filtros
- [ ] En picker "Tipo de habitación" seleccionar "Premium"
- [ ] Clickear "Mostrar X habitaciones"
- [ ] **Esperado:** Solo habitaciones Premium se muestran
- [ ] Todos los cards dicen "Premium" en el tipo
- [ ] Seleccionar "Suite" → **Esperado:** Solo suites
- [ ] Seleccionar "Todas" → **Esperado:** Vuelven todas

### 6. Filtro por Capacidad de Personas
- [ ] Del buscador (o chip) tener 4 personas en filtro
- [ ] Abrir filtros
- [ ] **Esperado:** Solo se muestran habitaciones con capacidad ≥ 4
- [ ] Cambiar número de personas en home → lista se actualiza

### 7. Ordenar Por
- [ ] Abrir filtros
- [ ] Seleccionar "Precio: Menor a Mayor"
- [ ] **Esperado:** Habitaciones ordenadas de menor a mayor precio
- [ ] Cambiar a "Precio: Mayor a Menor"
- [ ] **Esperado:** Invertido
- [ ] Probar "Capacidad: Menor a Mayor" → orden correcto
- [ ] Probar "Más Populares" → ordenadas por # de reservas

---

## 🔄 TESTING DE COMBINACIONES

### 8. Múltiples Filtros Simultáneos
- [ ] Aplicar precio $100-$200 + Tipo "Estándar" + 2 personas
- [ ] **Esperado:** Solo habitaciones Estándar entre $100-$200 con capacidad ≥ 2
- [ ] Todos los filtros tienen chips visibles
- [ ] Contador dice cantidad correcta

### 9. Limpiar Filtros
- [ ] Aplicar múltiples filtros
- [ ] En modal, clickear "Limpiar todo"
- [ ] **Esperado:** Todos los sliders/pickers reset a valores por defecto
- [ ] Mostrar todas las habitaciones nuevamente
- [ ] En chips, aparece solo info del home si aplica

---

## 🎯 TESTING DE NAVEGACIÓN A DETALLE

### 10. Ir a Detalle de Habitación
- [ ] Clickear en una habitación de la lista
- [ ] **Esperado:** Navega a DetalleHabitacionScreen
- [ ] **Verificar en consola:** route.params contiene:
  - [ ] `id` o `habitacionId` (coincide con habitación clickeada)
  - [ ] `fechaCheckIn` (igual a la del home)
  - [ ] `fechaCheckOut` (igual a la del home)
  - [ ] `numHuespedes` (igual a la del home)
- [ ] Información de parámetros puede ser visible en DetalleHabitacion

---

## ⚠️ TESTING DE CASOS EXTREMOS

### 11. Sin Resultados
- [ ] Aplicar filtros que no coincidan (ej: $50-$70 cuando mínimo es $80)
- [ ] **Esperado:** Pantalla "No se encontraron habitaciones"
- [ ] Botón "Limpiar filtros" visible
- [ ] Clickear "Limpiar filtros" → vuelven todas

### 12. Múltiples Aperturas de Modal
- [ ] Abrir modal de filtros
- [ ] Cerrar sin cambios
- [ ] Abrir nuevamente
- [ ] Cambiar slider
- [ ] Cerrar sin aplicar
- [ ] **Esperado:** Cambios no persistieron
- [ ] Abrir → aplicar cambios → cerrar
- [ ] **Esperado:** Cambios sí persisten

### 13. Scroll en Lista Larga
- [ ] Con muchas habitaciones, scroll hacia abajo
- [ ] **Esperado:** Carga suave, sin lag
- [ ] Llegar al final de la lista
- [ ] Volver al top scrolleando

---

## 📱 TESTING DE RESPONSIVE

### 14. Diferentes Tamaños de Pantalla
- [ ] Probar en teléfono vertical (simulador)
- [ ] [ ] Probar en teléfono horizontal (landscape)
- [ ] **Verificar:** Todos los elementos son visibles
- [ ] Cards no se recortan
- [ ] Botones son clickeables
- [ ] Chips scrollean horizontalmente si hay muchos

---

## 🐛 TESTING DE ERRORES

### 15. API Fallida
- [ ] Desconectar WiFi o cambiar IP inválida en fetch
- [ ] Abrir ListaHabitacionesScreen
- [ ] **Esperado:** Se muestran datos de prueba
- [ ] Mensaje de error amigable (si aplica)
- [ ] App no crashea

### 16. Parámetros Faltantes
- [ ] Navegar a ListaHabitaciones sin route.params
- [ ] **Esperado:** App no crashea
- [ ] Se muestran todas las habitaciones
- [ ] Filtros por defecto se aplican

### 17. Parámetros Inválidos
- [ ] route.params con fechas nulas
- [ ] route.params con numHuespedes = 0
- [ ] **Esperado:** App maneja gracefully
- [ ] Se muestran todas las habitaciones
- [ ] Chips solo muestran filtros válidos

---

## 📊 TESTING DE PERFORMANCE

### 18. Carga Rápida
- [ ] Abrir ListaHabitacionesScreen
- [ ] **Esperado:** Spinner de carga visible
- [ ] Habitaciones aparecen en < 3 segundos
- [ ] Spinner desaparece

### 19. Rendimiento de Filtros
- [ ] Mover slider suavemente
- [ ] **Esperado:** UI responde sin lag
- [ ] Lista se actualiza en tiempo real
- [ ] No hay freezes

### 20. Memoria
- [ ] Abrir y cerrar modal varias veces
- [ ] Navegar a otra pantalla y volver
- [ ] **Esperado:** No hay memory leaks
- [ ] App mantiene rendimiento

---

## 🎨 TESTING DE UI/UX

### 21. Colores y Estilos
- [ ] Color dorado (#C9A961) en:
  - [ ] Botón de filtros
  - [ ] Precio de habitación
  - [ ] Slider track
  - [ ] Botón "Mostrar X habitaciones"
- [ ] Cards tienen sombra/elevation
- [ ] Badges de capacidad son dorados con texto blanco
- [ ] Chips tienen fondo gris claro

### 22. Tipografía
- [ ] Títulos en bold
- [ ] Descripciones en color gris
- [ ] Precios bien legibles (grande)
- [ ] Labels claros

### 23. Espaciado
- [ ] Cards tienen padding consistente
- [ ] Gaps entre elementos son uniformes
- [ ] No hay elementos muy pegados
- [ ] Scrolleable sin que se amontone

---

## ✨ TESTING DE FUNCIONALIDADES AVANZADAS

### 24. Integración con HomeScreen
- [ ] En home cambiar número de huéspedes
- [ ] Buscar
- [ ] En ListaHabitaciones verifica chip con el número correcto
- [ ] Cambiar filtro en ListaHabitaciones
- [ ] Volver al home con botón atrás
- [ ] Números se mantienen
- [ ] Buscar nuevamente
- [ ] **Esperado:** Nuevos parámetros sobrescriben viejos en ListaHabitaciones

### 25. Persistencia de Filtros
- [ ] Aplicar filtros
- [ ] Navegar a DetalleHabitacion
- [ ] Volver a ListaHabitacionesScreen
- [ ] **Esperado:** Filtros se mantienen aplicados
- [ ] Chips siguen visibles
- [ ] Lista sigue filtrada

---

## 📋 TESTING FINAL (ANTES DE ENTREGA)

### 26. Checklist Completo
- [ ] Todos los tests anteriores pasaron ✅
- [ ] No hay console.log de errores rojos
- [ ] No hay warnings importantes
- [ ] App es estable y no crashea

### 27. Documentación
- [ ] README updated con instrucciones de uso
- [ ] Funciones comentadas en código
- [ ] Estilos organizados

### 28. Código Limpio
- [ ] Sin console.logs de debug
- [ ] Sin imports no usados
- [ ] Sin variables sin usar
- [ ] Estilos bien organizados

---

## 🚀 NOTAS PARA TESTING

**Cómo ejecutar:**
```bash
cd d:\TP-final\frontend
npm install @react-native-community/slider  # Si no está instalado
npm start
```

**Datos de prueba:**
- Habitaciones: 5 (101, 102, 201, 202, 103)
- Precios: $80-$300
- Capacidades: 2-4 personas
- Tipos: Estándar, Premium, Suite, Deluxe

**Rutas:**
- Home → HomeScreen
- Habitaciones → ListaHabitacionesScreen
- Click en habitación → DetalleHabitacionScreen

**Expected Parameters Flow:**
```
HomeScreen (selecciona fechas/personas)
  ↓
  navigate('Habitaciones', { fechaCheckIn, fechaCheckOut, numHuespedes })
  ↓
ListaHabitacionesScreen (recibe en route.params)
  ↓
  Aplica filtros automáticamente
  ↓
  Click en habitación
  ↓
navigate('DetalleHabitacion', { habitacionId, fechaCheckIn, fechaCheckOut, numHuespedes })
```

---

## 📝 RESULTADOS

**Última Actualización:** [Fecha]
**Estado:** 🟢 Listo para Testing
**Problemas Encontrados:** (Documentar aquí)
**Fixes Aplicados:** (Documentar aquí)

---

**✅ TODOS LOS TESTS COMPLETOS → FASE 2 LISTA PARA PRODUCCIÓN**
