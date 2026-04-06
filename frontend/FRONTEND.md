Backend:

# File Tree: backend

**Generated:** 3/23/2026, 7:41:58 PM
**Root Path:** `d:\TP-final\backend`

```
├── src
│   ├── config
│   │   ├── baseDatos.js
│   │   ├── jwt.js
│   │   └── oauth.js
│   ├── controladores
│   │   ├── controladorAuth.js
│   │   ├── controladorComentarios.js
│   │   ├── controladorEmpleado.js
│   │   ├── controladorHabitaciones.js
│   │   ├── controladorPuntos.js
│   │   ├── controladorReservas.js
│   │   └── controladorUsuarios.js
│   ├── middlewares
│   │   ├── manejadorErrores.js
│   │   ├── middlewareAuth.js
│   │   └── middlewareVerificarRol.js
│   ├── modelos
│   │   └── modeloUsuario.js
│   ├── rutas
│   │   ├── rutasAuth.js
│   │   ├── rutasComentarios.js
│   │   ├── rutasEmpleado.js
│   │   ├── rutasHabitaciones.js
│   │   ├── rutasPuntos.js
│   │   ├── rutasReservas.js
│   │   └── rutasUsuarios.js
│   ├── servicios
│   │   └── servicioUpload.js
│   └── utils
│       ├── constantes.js
│       ├── helpers.js
│       └── validadores.js
├── hash.js
├── package-lock.json
├── package.json
├── roles.js
├── server.js
└── test-habitaciones.js
```

# File Tree: frontend

**Generated:** 4/6/2026, 12:53:14 PM
**Root Path:** `d:\TP-final\frontend`

```
├── constants
│   └── theme.ts
├── hooks
│   ├── use-color-scheme.ts
│   ├── use-color-scheme.web.ts
│   └── use-theme-color.ts
├── scripts
│   └── reset-project.js
├── src
│   ├── assets
│   │   └── images
│   │       ├── habitaciones
│   │       ├── banner-hero.jpg
│   │       ├── icon.png
│   │       ├── logo-blanco.png
│   │       ├── logo.png
│   │       ├── partial-react-logo.png
│   │       ├── placeholder-habitacion.png
│   │       ├── react-logo.png
│   │       ├── react-logo@2x.png
│   │       ├── react-logo@3x.png
│   │       ├── splash-icon.png
│   │       └── splash.png
│   ├── componentes
│   │   ├── admin
│   │   │   └── AdminDropdownMenu.js
│   │   ├── auth
│   │   │   ├── GitHubButton.js
│   │   │   ├── GoogleButton.js
│   │   │   └── SocialButtons.js
│   │   ├── comentarios
│   │   │   ├── CardComentario.js
│   │   │   ├── EstrellaCalificacion.js
│   │   │   ├── FormComentario.js
│   │   │   └── ListaComentarios.js
│   │   ├── comun
│   │   │   ├── Boton.js
│   │   │   ├── Card.js
│   │   │   ├── ErrorMensaje.js
│   │   │   ├── Footer.js
│   │   │   ├── HeaderApp.js
│   │   │   ├── HeroBanner.js
│   │   │   ├── HeroBannerHome.js
│   │   │   ├── HeroCarousel.js
│   │   │   ├── Input.js
│   │   │   ├── Loading.js
│   │   │   ├── LoginModal.js
│   │   │   ├── LoginModalContainer.js
│   │   │   ├── Modal.js
│   │   │   ├── ModalConfirmacion.js
│   │   │   ├── ModernSearchBar.js
│   │   │   ├── NavbarModerna.js
│   │   │   ├── ProtectedScreen.js
│   │   │   └── WithProtection.js
│   │   ├── empleado
│   │   │   └── NavbarEmpleado.js
│   │   ├── habitaciones
│   │   │   ├── AutoScrollCarousel.js
│   │   │   ├── BotonFavorito.js
│   │   │   ├── CardHabitacionRN.js
│   │   │   ├── CarruselHabitaciones.js
│   │   │   ├── DetalleHabitacion.js
│   │   │   ├── FiltrosAvanzados.js
│   │   │   ├── FiltrosHabitaciones.js
│   │   │   ├── FiltrosRapidos.js
│   │   │   ├── GaleriaImagenes.js
│   │   │   └── ListaHabitaciones.js
│   │   ├── perfil
│   │   │   ├── EditarPerfil.js
│   │   │   ├── FotoPerfil.js
│   │   │   └── InfoPerfil.js
│   │   └── reservas
│   │       ├── CalendarioReserva.js
│   │       ├── CardReserva.js
│   │       ├── FormularioReserva.js
│   │       ├── HistorialReservas.js
│   │       └── ResumenReserva.js
│   ├── constantes
│   │   ├── colores.js
│   │   ├── config.js
│   │   ├── estilos.js
│   │   ├── imagenes.js
│   │   └── rutas.js
│   ├── contexto
│   │   ├── AuthContext.js
│   │   ├── NavigationContext.js
│   │   └── TabNavigationContext.js
│   ├── hooks
│   │   ├── useAuth.js
│   │   ├── useAuthNavigation.js
│   │   ├── useEmpleado.js
│   │   ├── useForm.js
│   │   ├── useGoogleAuthCallback.js
│   │   ├── useHabitaciones.js
│   │   ├── useLocation.js
│   │   ├── useMobileAuthCallback.js
│   │   ├── useRequireAuth.js
│   │   └── useReservas.js
│   ├── navegacion
│   │   ├── AdminNavigator.js
│   │   ├── AppNavigator.js
│   │   ├── AuthNavigator.js
│   │   ├── EmpleadoNavigator.js
│   │   ├── EmployeeNavigator.js
│   │   ├── MainNavigator.js
│   │   └── NavigationRef.js
│   ├── pantallas
│   │   ├── admin
│   │   │   ├── CrearHabitacionScreen.js
│   │   │   ├── DashboardScreen.js
│   │   │   ├── DetalleReservaAdminScreen.js
│   │   │   ├── DetalleUsuarioScreen.js
│   │   │   ├── EditarHabitacionScreen.js
│   │   │   ├── EstadisticasScreen.js
│   │   │   ├── GestionHabitacionesScreen.js
│   │   │   ├── GestionReservasScreen.js
│   │   │   └── GestionUsuariosScreen.js
│   │   ├── auth
│   │   │   ├── LoginScreen.js
│   │   │   └── RegistroScreen.js
│   │   ├── contacto
│   │   │   └── ContactoMainScreen.js
│   │   ├── empleado
│   │   │   ├── CheckInOutScreen.js
│   │   │   ├── ClientesScreen.js
│   │   │   ├── CrearReservaEmpleadoScreen.js
│   │   │   ├── DashboardEmpleadoScreen.js
│   │   │   ├── DetalleReservaEmpleadoScreen.js
│   │   │   ├── GestionHabitacionesEmpleadoScreen.js
│   │   │   ├── GestionReservasEmpleadoScreen.js
│   │   │   ├── PanelRecepcionistaScreen.js
│   │   │   └── PerfilEmpleadoScreen.js
│   │   ├── habitaciones
│   │   │   ├── DetalleHabitacionScreen.js
│   │   │   ├── FavoritosScreen.js
│   │   │   └── ListaHabitacionesScreen.js
│   │   ├── home
│   │   │   └── HomeScreen.js
│   │   ├── otros
│   │   │   ├── AcercaDeScreen.js
│   │   │   ├── ContactoScreen.js
│   │   │   └── MapaScreen.js
│   │   ├── perfil
│   │   │   ├── EditarPerfilScreen.js
│   │   │   └── PerfilScreen.js
│   │   └── reservas
│   │       ├── ConfirmarReservaScreen.js
│   │       ├── DetalleReservaScreen.js
│   │       ├── HistorialScreen.js
│   │       ├── MisReservasScreen.js
│   │       ├── NuevaReservaScreen.js
│   │       └── ReservaExitosaScreen.js
│   ├── redux
│   │   ├── slices
│   │   │   ├── authSlice.js
│   │   │   ├── habitacionesSlice.js
│   │   │   ├── reservasSlice.js
│   │   │   └── uiSlice.js
│   │   ├── thunks
│   │   │   ├── habitacionesThunks.js
│   │   │   └── reservasThunks.js
│   │   └── store.js
│   ├── servicios
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── comentariosService.js
│   │   ├── habitacionesService.js
│   │   ├── reservasService.js
│   │   └── usuariosService.js
│   └── utils
│       ├── dateFormatter.js
│       ├── fechas.js
│       ├── formatters.js
│       ├── imageProxy.js
│       ├── permisos.js
│       ├── storage.js
│       └── validaciones.js
├── .gitignore
├── App.js
├── FRONTEND.md
├── README.md
├── app.json
├── babel.config.js
├── eslint.config.js
├── metro.config.js
├── package-lock.json
├── package.json
└── tsconfig.json
```

---
*Generated by FileTree Pro Extension*