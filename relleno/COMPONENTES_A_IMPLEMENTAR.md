# 📋 COMPONENTES A IMPLEMENTAR - HOTEL LUNA SERENA

## ✅ CHECKLIST DE IMPLEMENTACIÓN

### 🎨 CONSTANTS & STYLES
- [ ] `frontend/src/constants/colores.js` - Paleta de colores del sistema
- [ ] `frontend/src/constants/styles.js` - Estilos compartidos (responsive, paddings, etc)

### 🧭 COMPONENTES PRINCIPALES

#### Navbar
- [ ] `frontend/src/components/Navbar.js`
  - Logo + Hotel name
  - Navigation links (Home, Habitaciones, Reservas)
  - User profile / Login button
  - User menu dropdown (si authenticated)

#### Home Screen
- [ ] `frontend/src/screens/HomeScreen.js`
  - Quick search section (check-in, check-out, guests)
  - Benefits grid (WiFi, Restaurante, Gimnasio, etc)
  - Testimonials carousel
  - FAQs accordion
  - Footer integration

#### Room Details Screen
- [ ] `frontend/src/screens/RoomDetailsScreen.js`
  - Room images carousel
  - Date selectors (check-in, check-out)
  - Guest counter (+/-)
  - Availability indicator
  - Price summary with taxes
  - Reviews section with filters
  - Hotel response to reviews
  - Sticky reservation button

#### Profile Screen
- [ ] `frontend/src/screens/ProfileScreen.js`
  - User header with avatar
  - Stats (reservations, reviews, points)
  - Points progress bar
  - Rewards unlocked/locked
  - Reservation history with filters
  - Edit profile button

#### Payment Screen
- [ ] `frontend/src/screens/PaymentScreen.js`
  - Card number input
  - Cardholder name input
  - Expiry + CVV inputs
  - Order summary
  - Secure payment button
  - Processing state

### 📦 COMPONENTES REUTILIZABLES

- [ ] `frontend/src/components/BenefitCard.js`
  - Icon + title + description
  
- [ ] `frontend/src/components/ReviewCard.js`
  - User avatar
  - Name + date
  - Star rating
  - Review text
  - Hotel response (si existe)

- [ ] `frontend/src/components/ReservationCard.js`
  - Room image
  - Room name
  - Check-in / Check-out dates
  - Total price
  - Status badge

- [ ] `frontend/src/components/Accordion.js`
  - Expandable items
  - Icon rotation animation

- [ ] `frontend/src/components/Carousel.js`
  - Auto-scroll testimonials
  - Pagination dots

- [ ] `frontend/src/components/DatePicker.js`
  - Calendar modal
  - Date selection

- [ ] `frontend/src/components/GuestCounter.js`
  - +/- buttons
  - Display current count

### 🎯 FUNCIONALIDAD CORE

#### Navegación
- [ ] Stack Navigator setup (Home, RoomDetails, Payment, Profile)
- [ ] Tab Navigator setup (si aplica)
- [ ] Navigation utils

#### Redux (si aplica)
- [ ] User slice (login, profile, points)
- [ ] Reservation slice (search, filters, history)
- [ ] UI slice (navbar menu state, etc)

#### APIs Integration
- [ ] API calls para habitaciones
- [ ] API calls para reservas
- [ ] API calls para pagos
- [ ] API calls para comentarios

#### Validaciones
- [ ] Card number validation (Luhn algorithm)
- [ ] Date validation (check-out > check-in)
- [ ] Email validation
- [ ] Form validations

---

## 📊 ESTADO GENERAL

| Categoría | Total | Completado | %  |
|-----------|-------|-----------|-----|
| Constants | 2     | 0         | 0%  |
| Pantallas | 5     | 0         | 0%  |
| Componentes | 8   | 0         | 0%  |
| Funcionalidad | 4  | 0         | 0%  |
| **TOTAL** | **19** | **0** | **0%** |

---

## 🚀 PRIORIDAD DE IMPLEMENTACIÓN

1. **FASE 1** (Base): Colores, estilos, Navbar, Home
2. **FASE 2** (Core): Room Details, Profile, Checkout
3. **FASE 3** (Detalles): Componentes reutilizables, validaciones
4. **FASE 4** (Integración): Redux, APIs, navegación avanzada

---

## 📝 NOTAS
- Usar StyleSheet.create() para todos los estilos
- Responsive design con Dimensions
- Convenciones: variables en camelCase español
- Importar colores desde constantes
- Componentes deben ser reutilizables cuando sea posible
