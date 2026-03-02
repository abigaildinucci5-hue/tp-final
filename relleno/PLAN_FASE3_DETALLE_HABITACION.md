# 🚀 PLAN FASE 3: DETALLE HABITACION Y RESERVA

## 📋 OBJETIVO

Implementar pantalla **DetalleHabitacionScreen** con:
- ✅ Información completa de la habitación
- ✅ Galería de imágenes
- ✅ Amenidades detalladas
- ✅ Sistema de comentarios
- ✅ Selector de reserva (fecha, turno, servicios)
- ✅ Cálculo de precio total
- ✅ Botón "Reservar"

---

## 🎯 FUNCIONALIDADES FASE 3

### 1. Vista de Detalle Completa

#### Galería de Imágenes
```javascript
// Top: Carousel de imágenes de la habitación
<HabitacionCarousel
  images={habitacion.imagenes}  // Array de URLs
/>

// Funcionalidad:
// - Swipe horizontal entre imágenes
// - Punto actual en la galería (1/5)
// - Tap para ver full screen
// - Botón volver al detalle
```

#### Información Principal
```javascript
<View>
  <View style={estilos.headerInfo}>
    <Text style={estilos.numero}>Habitación {habitacion.numero}</Text>
    <View style={estilos.ratingContainer}>
      <Ionicons name="star" color="#FFD700" size={16} />
      <Text>4.8/5.0</Text>
      <Text>(68 reviews)</Text>
    </View>
  </View>

  <Text style={estilos.tipo}>{habitacion.tipo}</Text>
  <Text style={estilos.descripcion}>{habitacion.descripcion_larga}</Text>

  <View style={estilos.capacidad}>
    <Ionicons name="people" />
    <Text>Capacidad: {habitacion.capacidad} personas</Text>
  </View>

  <Text style={estilos.precio}>${habitacion.precio_por_noche}/noche</Text>
</View>
```

### 2. Amenidades

```javascript
<ScrollView horizontal>
  {habitacion.amenidades.map(amenidad => (
    <View key={amenidad.id} style={estilos.amenidadCard}>
      <Ionicons name={amenidad.icono} size={32} color="#C9A961" />
      <Text>{amenidad.nombre}</Text>
    </View>
  ))}
</ScrollView>

// Amenidades esperadas:
// - WiFi gratis
// - Aire acondicionado
// - TV pantalla plana
// - Escritorio
// - Minibar
// - Desayuno incluido
// - Baño privado
// - Jacuzzi
```

### 3. Selector de Reserva

```javascript
<View style={estilos.selectorReserva}>
  <Text style={estilos.titulo}>Opciones de Reserva</Text>

  {/* Fechas automáticas del search */}
  <View style={estilos.fila}>
    <Text>Check-in:</Text>
    <Text>{formatearFecha(fechaCheckIn)}</Text>
  </View>
  <View style={estilos.fila}>
    <Text>Check-out:</Text>
    <Text>{formatearFecha(fechaCheckOut)}</Text>
  </View>

  {/* Número de personas */}
  <View style={estilos.fila}>
    <Text>Huéspedes:</Text>
    <Text>{numHuespedes}</Text>
  </View>

  {/* Turno (completo, día, noche) */}
  <View style={estilos.fila}>
    <Text>Turno:</Text>
    <Picker selectedValue={turno} onValueChange={setTurno}>
      <Picker.Item label="Completo (24h)" value="completo" />
      <Picker.Item label="Día (8h)" value="dia" />
      <Picker.Item label="Noche (8h)" value="noche" />
    </Picker>
  </View>

  {/* Servicios adicionales */}
  <View>
    <Text>Servicios Adicionales:</Text>
    <CheckBox label="Desayuno ($10)" value={desayuno} onValueChange={setDesayuno} />
    <CheckBox label="Parking ($8)" value={parking} onValueChange={setParking} />
    <CheckBox label="Late checkout ($15)" value={lateCheckout} onValueChange={setLateCheckout} />
  </View>
</View>
```

### 4. Cálculo de Precio

```javascript
// Estados
const [turno, setTurno] = useState('completo');
const [desayuno, setDesayuno] = useState(false);
const [parking, setParking] = useState(false);
const [lateCheckout, setLateCheckout] = useState(false);

// Cálculo
const calcularPrecio = () => {
  const noches = calcularNoches(fechaCheckIn, fechaCheckOut);
  
  let precioBase = habitacion.precio_por_noche * noches;
  
  // Ajustar por turno
  if (turno === 'dia' || turno === 'noche') {
    precioBase = precioBase / 3; // 1/3 del precio
  }
  
  // Servicios adicionales
  let precioServicios = 0;
  if (desayuno) precioServicios += 10 * noches;
  if (parking) precioServicios += 8 * noches;
  if (lateCheckout) precioServicios += 15;
  
  const subtotal = precioBase + precioServicios;
  const impuestos = subtotal * 0.10; // 10% taxes
  const total = subtotal + impuestos;
  
  return { precioBase, precioServicios, subtotal, impuestos, total };
};

// Mostrar desglose
<View style={estilos.desglose}>
  <View style={estilos.fila}>
    <Text>Habitación ({noches} noches):</Text>
    <Text>${precioBase}</Text>
  </View>
  {precioServicios > 0 && (
    <View style={estilos.fila}>
      <Text>Servicios adicionales:</Text>
      <Text>${precioServicios}</Text>
    </View>
  )}
  <View style={estilos.fila}>
    <Text>Impuestos (10%):</Text>
    <Text>${impuestos}</Text>
  </View>
  <View style={estilos.separador} />
  <View style={estilos.filaBold}>
    <Text>Total a Pagar:</Text>
    <Text>${total}</Text>
  </View>
</View>
```

### 5. Comentarios/Reviews

```javascript
<View style={estilos.seccionComentarios}>
  <View style={estilos.headerComentarios}>
    <Text style={estilos.titulo}>Comentarios de Huéspedes</Text>
    <Text style={estilos.cantidad}>({comentarios.length})</Text>
  </View>

  {comentarios.map(comentario => (
    <View key={comentario.id} style={estilos.comentarioCard}>
      <View style={estilos.headerComentario}>
        <Text style={estilos.usuario}>{comentario.usuario}</Text>
        <View style={estilos.rating}>
          <Ionicons name="star" color="#FFD700" size={16} />
          <Text>{comentario.calificacion}/5</Text>
        </View>
      </View>
      
      <Text style={estilos.fecha}>{formatearFecha(comentario.fecha)}</Text>
      <Text style={estilos.textoComentario}>{comentario.texto}</Text>
      
      {/* Indicador: Puede dejar comentario si se quedó aquí */}
      {comentario.puedeComentarAhora && (
        <TouchableOpacity onPress={() => abrirFormComentario()}>
          <Text style={estilos.linkComentario}>Dejar comentario</Text>
        </TouchableOpacity>
      )}
    </View>
  ))}

  {comentarios.length === 0 && (
    <Text style={estilos.sinComentarios}>Sin comentarios aún</Text>
  )}
</View>
```

---

## 🔄 FLUJO DE NAVEGACIÓN

```
ListaHabitacionesScreen (Click en habitación)
    │
    ├─ Parámetros:
    │  ├─ habitacionId: 1
    │  ├─ fechaCheckIn: '2024-03-15'
    │  ├─ fechaCheckOut: '2024-03-18'
    │  └─ numHuespedes: 4
    │
    ▼
DetalleHabitacionScreen
    │
    ├─ Cargar datos de habitación por ID
    ├─ Mostrar galería, info, amenidades
    ├─ Usuario selecciona:
    │  ├─ Turno (completo/día/noche)
    │  └─ Servicios adicionales
    │
    ├─ Mostrar precio total
    │
    └─ Click "RESERVAR"
       │
       ├─ Validar usuario está autenticado
       │  ├─ NO → Redirigir a Login (pass habitacionId en route)
       │  └─ SI → Continuar
       │
       └─ navigate('ConfirmarReserva', {
          habitacionId,
          fechaCheckIn,
          fechaCheckOut,
          numHuespedes,
          turno,
          servicios: { desayuno, parking, lateCheckout },
          precioTotal
          })
```

---

## 📊 ESTRUCTURA DE DATOS ESPERADA

### Habitación (Detalle)
```javascript
{
  id: 1,
  numero: '101',
  tipo: 'Estándar',
  capacidad: 2,
  precio_por_noche: 80,
  descripcion: 'Habitación acogedora...',
  descripcion_larga: 'Descripción más detallada...',
  
  // Nuevos campos para detalle
  imagenes: [
    'https://api.com/images/hab101_1.jpg',
    'https://api.com/images/hab101_2.jpg',
    // ...
  ],
  
  amenidades: [
    { id: 1, nombre: 'WiFi gratis', icono: 'wifi' },
    { id: 2, nombre: 'TV pantalla plana', icono: 'tv' },
    // ...
  ],
  
  total_reservas: 45,
  calificacion: 4.8,
  disponible: true,
  
  // Campos opcionales
  tamaño_m2: 25,
  piso: 1,
  vista: 'Jardín'
}
```

### Comentario
```javascript
{
  id: 1,
  habitacion_id: 1,
  usuario: 'Juan García',
  usuario_id: 5,
  calificacion: 5,
  texto: 'Excelente habitación, muy limpia y cómoda...',
  fecha: '2024-02-15',
  puedeComentarAhora: false  // true si usuario está registrado y se quedó aquí
}
```

---

## 🔗 ENDPOINTS NECESARIOS

### GET /api/habitaciones/:id
Obtener detalle completo de una habitación
```json
{
  "id": 1,
  "numero": "101",
  "tipo": "Estándar",
  "capacidad": 2,
  "precio_por_noche": 80,
  "descripcion": "...",
  "descripcion_larga": "...",
  "imagenes": [...],
  "amenidades": [...],
  "total_reservas": 45,
  "calificacion": 4.8,
  "disponible": true
}
```

### GET /api/habitaciones/:id/disponibilidad?checkIn=2024-03-15&checkOut=2024-03-18
Verificar disponibilidad en rango de fechas
```json
{
  "disponible": true,
  "fechas_ocupadas": ["2024-03-20", "2024-03-21"],
  "proxima_disponibilidad": "2024-03-22"
}
```

### GET /api/habitaciones/:id/comentarios
Obtener comentarios de la habitación
```json
[
  {
    "id": 1,
    "usuario": "Juan García",
    "calificacion": 5,
    "texto": "Excelente...",
    "fecha": "2024-02-15"
  },
  // ...
]
```

### GET /api/comentarios/puede-comentar/:habitacionId
Verificar si usuario actual puede comentar (estuvo aquí)
```json
{
  "puedeComentarAhora": true,
  "fechas_reserva": {
    "checkIn": "2024-02-10",
    "checkOut": "2024-02-15"
  }
}
```

---

## 🧪 TESTING FASE 3

### Verificaciones Básicas
- [ ] Detalle carga correctamente
- [ ] Imágenes se muestran
- [ ] Amenidades visibles
- [ ] Comentarios se cargan
- [ ] Selector de turno funciona
- [ ] Checkboxes de servicios funcionan
- [ ] Precio se recalcula en tiempo real

### Cálculos
- [ ] Precio base = precio_por_noche × noches
- [ ] Día/noche = precio_base / 3
- [ ] Servicios se suma a total
- [ ] Impuestos se calcula (10%)
- [ ] Desglose se muestra correctamente

### Navegación
- [ ] Botón "Reservar" → Valida usuario
- [ ] Si no autenticado → Redirige a Login
- [ ] Si autenticado → Va a ConfirmarReserva
- [ ] Parámetros se pasan correctamente

### Edge Cases
- [ ] Habitación sin imágenes → Muestra placeholder
- [ ] Sin comentarios → Mensaje "Sin comentarios aún"
- [ ] Usuario no puede comentar → Botón no aparece
- [ ] Habitación no disponible → Mostrar mensaje

---

## 📱 COMPONENTES A CREAR/MODIFICAR

### Crear
- [ ] `DetalleHabitacionScreen.js` (400-500 líneas)
- [ ] `HabitacionCarousel.js` (componente reutilizable)
- [ ] `ComentarioCard.js` (componente reutilizable)
- [ ] `PrecioDesglose.js` (componente reutilizable)

### Modificar
- [ ] `ListaHabitacionesScreen.js` → Pasar params correctamente
- [ ] `NavigationStack` → Registrar DetalleHabitacionScreen

---

## ⚙️ LÓGICA PRINCIPAL

### calcularNoches()
```javascript
const calcularNoches = (checkIn, checkOut) => {
  const fecha1 = new Date(checkIn);
  const fecha2 = new Date(checkOut);
  const diferencia = fecha2 - fecha1;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24));
};
```

### actualizarPrecio()
```javascript
const actualizarPrecio = useCallback(() => {
  const noches = calcularNoches(fechaCheckIn, fechaCheckOut);
  let precioBase = habitacion.precio_por_noche * noches;
  
  if (turno !== 'completo') precioBase = precioBase / 3;
  
  let precioServicios = 0;
  if (desayuno) precioServicios += 10 * noches;
  if (parking) precioServicios += 8 * noches;
  if (lateCheckout) precioServicios += 15;
  
  const subtotal = precioBase + precioServicios;
  const impuestos = subtotal * 0.10;
  const total = subtotal + impuestos;
  
  setPrecioTotal({ precioBase, precioServicios, subtotal, impuestos, total });
}, [fechaCheckIn, fechaCheckOut, turno, desayuno, parking, lateCheckout, habitacion]);
```

### manejarReserva()
```javascript
const manejarReserva = async () => {
  // 1. Validar autenticación
  const { usuario } = useAuth();
  if (!usuario) {
    navigation.navigate('Auth', { screen: 'Login', params: { habitacionId } });
    return;
  }

  // 2. Preparar datos
  const datosReserva = {
    habitacionId,
    fechaCheckIn,
    fechaCheckOut,
    numHuespedes,
    turno,
    servicios: { desayuno, parking, lateCheckout },
    precioTotal: precioTotal.total,
    usuarioId: usuario.id,
    estado: 'pendiente_confirmacion'
  };

  // 3. Navegar a confirmación
  navigation.navigate('HabitacionesStack', {
    screen: 'ConfirmarReserva',
    params: datosReserva
  });
};
```

---

## 🎨 ESTILOS PRINCIPALES

```javascript
const estilos = StyleSheet.create({
  // Galería
  carousel: {
    height: 300,
    backgroundColor: '#F8F8F8'
  },

  // Info principal
  headerInfo: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  numero: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A'
  },
  tipo: {
    fontSize: 16,
    color: '#C9A961',
    fontWeight: '600'
  },
  precio: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#C9A961',
    marginTop: 10
  },

  // Selector de reserva
  selectorReserva: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },

  // Desglose de precio
  desglose: {
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 15
  },

  // Comentarios
  comentarioCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#C9A961',
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 6
  },

  // Botón reservar
  botonReservar: {
    backgroundColor: '#C9A961',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 12,
    alignItems: 'center'
  },
  textoBotonReservar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
```

---

## 📝 RESUMEN

| Aspecto | Detalle |
|---------|---------|
| **Pantalla** | DetalleHabitacionScreen |
| **Líneas de Código** | 500-600 |
| **Componentes Nuevos** | 3-4 |
| **Endpoints Necesarios** | 4 |
| **Estados** | 10-12 |
| **Funciones Principales** | 5 |
| **Testing Points** | 25+ |

---

## 🚀 SIGUIENTE: FASE 4

Después de Fase 3, implementar:
- [ ] ConfirmarReservaScreen (resumen y confirmación)
- [ ] Integración con backend (POST /api/reservas)
- [ ] Email de confirmación
- [ ] MisReservasScreen (listar reservas del usuario)

