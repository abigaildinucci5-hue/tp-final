# File Tree: TP-final

**Generated:** 1/23/2026, 3:23:25 PM
**Root Path:** `d:\TP-final`

```
├── backend
│   ├── src
│   │   ├── config
│   │   │   ├── baseDatos.js
│   │   │   ├── jwt.js
│   │   │   └── oauth.js
│   │   ├── controladores
│   │   │   ├── controladorAuth.js
│   │   │   ├── controladorComentarios.js
│   │   │   ├── controladorHabitaciones.js
│   │   │   ├── controladorNotificaciones.js
│   │   │   ├── controladorReservas.js
│   │   │   └── controladorUsuarios.js
│   │   ├── middlewares
│   │   │   ├── manejadorErrores.js
│   │   │   └── middlewareAuth.js
│   │   ├── modelos
│   │   │   └── modeloUsuario.js
│   │   ├── rutas
│   │   │   ├── rutasAuth.js
│   │   │   ├── rutasComentarios.js
│   │   │   ├── rutasHabitaciones.js
│   │   │   ├── rutasNotificaciones.js
│   │   │   ├── rutasReservas.js
│   │   │   └── rutasUsuarios.js
│   │   ├── servicios
│   │   │   ├── servicioNotificaciones.js
│   │   │   └── servicioUpload.js
│   │   └── utils
│   │       ├── constantes.js
│   │       ├── helpers.js
│   │       └── validadores.js
│   ├── package-lock.json
│   ├── package.json
│   └── server.js
├── frontend
│   ├── constants
│   │   └── theme.ts
│   ├── hooks
│   │   ├── use-color-scheme.ts
│   │   ├── use-color-scheme.web.ts
│   │   └── use-theme-color.ts
│   ├── scripts
│   │   └── reset-project.js
│   ├── src
│   │   ├── assets
│   │   │   └── images
│   │   │       ├── android-icon-background.png
│   │   │       ├── android-icon-foreground.png
│   │   │       ├── android-icon-monochrome.png
│   │   │       ├── icon.png
│   │   │       ├── logo-blanco.png
│   │   │       ├── logo.png
│   │   │       ├── partial-react-logo.png
│   │   │       ├── placeholder-habitacion.png
│   │   │       ├── react-logo.png
│   │   │       ├── react-logo@2x.png
│   │   │       ├── react-logo@3x.png
│   │   │       ├── splash-icon.png
│   │   │       └── splash.png
│   │   ├── componentes
│   │   │   ├── auth
│   │   │   │   ├── GitHubButton.js
│   │   │   │   ├── GoogleButton.js
│   │   │   │   └── SocialButtons.js
│   │   │   ├── comentarios
│   │   │   │   ├── CardComentario.js
│   │   │   │   ├── EstrellaCalificacion.js
│   │   │   │   ├── FormComentario.js
│   │   │   │   └── ListaComentarios.js
│   │   │   ├── comun
│   │   │   │   ├── Boton.js
│   │   │   │   ├── Card.js
│   │   │   │   ├── ErrorMensaje.js
│   │   │   │   ├── HeaderApp.js
│   │   │   │   ├── Input.js
│   │   │   │   ├── Loading.js
│   │   │   │   ├── Modal.js
│   │   │   │   └── TabBar.js
│   │   │   ├── habitaciones
│   │   │   │   ├── BotonFavorito.js
│   │   │   │   ├── CardHabitacion.js
│   │   │   │   ├── CardHabitacion.styles.js
│   │   │   │   ├── DetalleHabitacion.js
│   │   │   │   ├── FiltrosHabitaciones.js
│   │   │   │   ├── GaleriaImagenes.js
│   │   │   │   └── ListaHabitaciones.js
│   │   │   ├── perfil
│   │   │   │   ├── CambiarPassword.js
│   │   │   │   ├── EditarPerfil.js
│   │   │   │   ├── FotoPerfil.js
│   │   │   │   └── InfoPerfil.js
│   │   │   └── reservas
│   │   │       ├── CalendarioReserva.js
│   │   │       ├── CardReserva.js
│   │   │       ├── FormularioReserva.js
│   │   │       ├── HistorialReservas.js
│   │   │       └── ResumenReserva.js
│   │   ├── constantes
│   │   │   ├── colores.js
│   │   │   ├── config.js
│   │   │   ├── estilos.js
│   │   │   ├── imagenes.js
│   │   │   └── rutas.js
│   │   ├── contexto
│   │   │   └── AuthContext.js
│   │   ├── hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useForm.js
│   │   │   ├── useHabitaciones.js
│   │   │   ├── useLocation.js
│   │   │   ├── useNotificaciones.js
│   │   │   └── useReservas.js
│   │   ├── navegacion
│   │   │   ├── AdminNavigator.js
│   │   │   ├── AppNavigator.js
│   │   │   ├── AuthNavigator.js
│   │   │   ├── MainNavigator.js
│   │   │   └── NavigationRef.js
│   │   ├── pantallas
│   │   │   ├── admin
│   │   │   │   ├── DashboardScreen.js
│   │   │   │   ├── EstadisticasScreen.js
│   │   │   │   ├── GestionHabitacionesScreen.js
│   │   │   │   ├── GestionReservasScreen.js
│   │   │   │   └── GestionUsuariosScreen.js
│   │   │   ├── auth
│   │   │   │   ├── LoginScreen.js
│   │   │   │   ├── RecuperarPasswordScreen.js
│   │   │   │   ├── RegistroScreen.js
│   │   │   │   └── VerficarEmailScreen.js
│   │   │   ├── habitaciones
│   │   │   │   ├── DetalleHabitacionScreen.js
│   │   │   │   ├── FavoritosScreen.js
│   │   │   │   └── ListaHabitacionesScreen.js
│   │   │   ├── home
│   │   │   │   ├── BuscarScreen.js
│   │   │   │   ├── HomeScreen.js
│   │   │   │   └── SplashScreen.js
│   │   │   ├── otros
│   │   │   │   ├── AcercaDeScreen.js
│   │   │   │   ├── ContactoScreen.js
│   │   │   │   ├── MapaScreen.js
│   │   │   │   └── OnboardingScreen.js
│   │   │   ├── perfil
│   │   │   │   ├── ConfiguracionScreen.js
│   │   │   │   ├── EditarPerfilScreen.js
│   │   │   │   ├── NotificacionesScreen.js
│   │   │   │   └── PerfilScreen.js
│   │   │   └── reservas
│   │   │       ├── ConfirmarReservaScreen.js
│   │   │       ├── DetalleReservaScreen.js
│   │   │       ├── HistorialScreen.js
│   │   │       ├── MisReservasScreen.js
│   │   │       └── NuevaReservaScreen.js
│   │   ├── redux
│   │   │   ├── slices
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── habitacionesSlice.js
│   │   │   │   ├── notificacionesSlice.js
│   │   │   │   ├── reservasSlice.js
│   │   │   │   └── uiSlice.js
│   │   │   ├── thunks
│   │   │   │   ├── habitacionesThunks.js
│   │   │   │   └── reservasThunks.js
│   │   │   └── store.js
│   │   ├── servicios
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── comentariosService.js
│   │   │   ├── habitacionesService.js
│   │   │   ├── notificacionesService.js
│   │   │   ├── reservasService.js
│   │   │   └── usuariosService.js
│   │   └── utils
│   │       ├── fechas.js
│   │       ├── formatters.js
│   │       ├── permisos.js
│   │       ├── storage.js
│   │       └── validaciones.js
│   ├── .gitignore
│   ├── App.js
│   ├── README.md
│   ├── app.json
│   ├── babel.config.js
│   ├── eslint.config.js
│   ├── metro.config.js
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── Estructura.txt
├── Prompt COMPLETO + imagenes.txt
├── Screenshot_20251021-162111_ChatGPT.jpg
├── Screenshot_20251021-162115_ChatGPT.jpg
├── Screenshot_20251021-162118_ChatGPT.jpg
├── Screenshot_20251021-162132_ChatGPT.jpg
├── anotaciones.txt
├── estructura completa.md
├── hotel_reservas.sql
└── usuarios de prueba.txt
```

---
*Generated by FileTree Pro Extension*