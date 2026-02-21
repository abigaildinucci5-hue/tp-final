// frontend/src/pantallas/home/HomeScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { format, isAfter, isBefore } from 'date-fns';
import { Calendar } from 'react-native-calendars';
import COLORES from '../../constantes/colores';
import {
  TIPOGRAFIA,
  DIMENSIONES,
  ESTILOS_GLOBALES,
} from '../../constantes/estilos';
import { useAuth } from '../../contexto/AuthContext';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import HeaderApp from '../../componentes/comun/HeaderApp';
import HeroCarousel from '../../componentes/comun/HeroCarousel';
import AutoScrollCarousel from '../../componentes/habitaciones/AutoScrollCarousel';
import Footer from '../../componentes/comun/Footer';
import Loading from '../../componentes/comun/Loading';
import config from '../../constantes/config';

const HomeScreen = ({ navigation }) => {
  const { usuario, loading: authLoading, isAuthenticated, logout } = useAuth();
  const { habitacionesPopulares, loading, cargarPopulares } = useHabitaciones();

  // Estados para buscador y FAQs
  const [fechaCheckIn, setFechaCheckIn] = useState(null);
  const [fechaCheckOut, setFechaCheckOut] = useState(null);
  const [numHuespedes, setNumHuespedes] = useState(2);
  const [mostrarCalendario, setMostrarCalendario] = useState(null);
  const [faqAbierto, setFaqAbierto] = useState(null);

  useEffect(() => {
    const loadPopulares = async () => {
      try {
        const result = await cargarPopulares(8);
        // No hacer console.warn aquí, el thunk ya lo maneja
        if (!result.success) {
          console.log('Usando datos de demostración');
        }
      } catch (error) {
        console.error('Error en cargarPopulares:', error);
      }
    };
    loadPopulares();
  }, []);

  const formatearFecha = (fecha) => {
    if (!fecha) return 'Seleccionar';
    try {
      return format(new Date(fecha), 'dd MMM yyyy', { locale: require('date-fns/locale/es') });
    } catch {
      return 'Seleccionar';
    }
  };

  const handleBuscarHabitaciones = () => {
    if (!fechaCheckIn || !fechaCheckOut) {
      Alert.alert('Fechas requeridas', 'Por favor selecciona las fechas de check-in y check-out');
      return;
    }

    navigation.navigate('Habitaciones', {
      screen: 'ListaHabitaciones',
      params: {
        fechaCheckIn,
        fechaCheckOut,
        numHuespedes,
      },
    });
  };

  const renderModalCalendario = () => (
    <Modal
      visible={mostrarCalendario !== null}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setMostrarCalendario(null)}
    >
      <View style={estilos.modalOverlay}>
        <View style={estilos.modalCalendario}>
          <View style={estilos.headerModal}>
            <Text style={estilos.tituloModal}>
              {mostrarCalendario === 'checkIn' ? 'Selecciona Check-in' : 'Selecciona Check-out'}
            </Text>
            <TouchableOpacity onPress={() => setMostrarCalendario(null)}>
              <Ionicons name="close" size={28} color="#1A1A1A" />
            </TouchableOpacity>
          </View>

          <Calendar
            minDate={new Date().toISOString().split('T')[0]}
            maxDate={new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
            onDayPress={(day) => {
              if (mostrarCalendario === 'checkIn') {
                setFechaCheckIn(day.dateString);
                setFechaCheckOut(null);
                setMostrarCalendario('checkOut');
              } else {
                if (fechaCheckIn && day.dateString > fechaCheckIn) {
                  setFechaCheckOut(day.dateString);
                  setMostrarCalendario(null);
                } else {
                  Alert.alert('Error', 'El check-out debe ser después del check-in');
                }
              }
            }}
            markedDates={{
              ...(fechaCheckIn && {
                [fechaCheckIn]: {
                  selected: true,
                  selectedColor: '#C9A961',
                  selectedTextColor: '#FFFFFF',
                },
              }),
              ...(fechaCheckOut && {
                [fechaCheckOut]: {
                  selected: true,
                  selectedColor: '#C9A961',
                  selectedTextColor: '#FFFFFF',
                },
              }),
            }}
            theme={{
              todayTextColor: '#C9A961',
              selectedDayBackgroundColor: '#C9A961',
              selectedDayTextColor: '#FFFFFF',
              arrowColor: '#C9A961',
              monthTextColor: '#1A1A1A',
            }}
          />

          <View style={estilos.botonesModal}>
            <TouchableOpacity
              style={estilos.botonCancelarModal}
              onPress={() => setMostrarCalendario(null)}
            >
              <Text style={estilos.textoBotonCancelar}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  if (authLoading) {
    return <Loading />;
  }

  const handleProfilePress = () => {
    navigation.navigate('Perfil', {
      screen: 'PerfilMain',
    });
  };

  const handleLoginPress = () => {
    navigation.navigate('Auth', {
      screen: 'Login',
    });
  };

  const handleRegisterPress = () => {
    navigation.navigate('Auth', {
      screen: 'Registro',
    });
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleHabitacionPress = (habitacion) => {
    const habitacionId = habitacion.id_habitacion || habitacion.id;
    navigation.navigate('Home', {
      screen: 'DetalleHabitacion',
      params: { habitacionId },
    });
  };

  const handleContactPress = () => {
    navigation.navigate('Contacto', {
      screen: 'ContactoMain',
    });
  };

  const handleLocationPress = () => {
    navigation.navigate('Mapa', {
      screen: 'MapaMain',
    });
  };

  const handleViewAllHabitaciones = () => {
    navigation.navigate('Habitaciones', {
      screen: 'ListaHabitaciones',
    });
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      {renderModalCalendario()}
      
      {/* Header con navegación integrada */}
      <HeaderApp
        title="Hotel Luna Serena"
        subtitle="Bienvenido a nuestro hotel"
        showLogo={false}
        showNavigation={true}
        navigation={navigation}
        activeRoute="Home"
        onProfilePress={handleProfilePress}
        onLoginPress={handleLoginPress}
        onRegisterPress={handleRegisterPress}
        onLogoutPress={handleLogout}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={estilos.scrollContent}
      >
        {/* 1. HERO CAROUSEL */}
        <HeroCarousel
          slides={[
            {
              image: require('../../assets/images/banner-hero.jpg'),
              smallText: 'BIENVENIDO A',
              title: 'Hotel Luna Serena',
              description: 'Experimenta lujo, confort y elegancia en cada detalle',
            },
            {
              image: require('../../assets/images/placeholder-habitacion.png'),
              smallText: 'DESCUBRE',
              title: 'Habitaciones Premium',
              description: 'Espacios diseñados para tu máximo confort y descanso',
            },
            {
              image: require('../../assets/images/placeholder-habitacion.png'),
              smallText: 'EXPERIMENTA',
              title: 'Servicios de Lujo',
              description: 'Atención personalizada y servicios exclusivos para ti',
            },
          ]}
        />

        {/* 2. BUSCADOR RÁPIDO */}
        <View style={estilos.seccionBusqueda}>
          <Text style={estilos.tituloBusqueda}>Encuentra tu habitación ideal</Text>

          <View style={estilos.buscadorContainer}>
            {/* Input Check-in */}
            <TouchableOpacity style={estilos.inputFecha} onPress={() => setMostrarCalendario('checkIn')}>
              <Ionicons name="calendar-outline" size={20} color="#C9A961" />
              <View style={estilos.textoFecha}>
                <Text style={estilos.labelFecha}>Check-in</Text>
                <Text style={estilos.valorFecha}>{formatearFecha(fechaCheckIn)}</Text>
              </View>
            </TouchableOpacity>

            {/* Input Check-out */}
            <TouchableOpacity style={estilos.inputFecha} onPress={() => setMostrarCalendario('checkOut')}>
              <Ionicons name="calendar-outline" size={20} color="#C9A961" />
              <View style={estilos.textoFecha}>
                <Text style={estilos.labelFecha}>Check-out</Text>
                <Text style={estilos.valorFecha}>{formatearFecha(fechaCheckOut)}</Text>
              </View>
            </TouchableOpacity>

            {/* Selector Huéspedes */}
            <View style={estilos.inputHuespedes}>
              <Ionicons name="people-outline" size={20} color="#C9A961" />
              <View style={estilos.contadorHuespedes}>
                <TouchableOpacity onPress={() => setNumHuespedes(Math.max(1, numHuespedes - 1))}>
                  <Ionicons name="remove-circle-outline" size={28} color="#C9A961" />
                </TouchableOpacity>
                <Text style={estilos.numeroHuespedes}>{numHuespedes}</Text>
                <TouchableOpacity onPress={() => setNumHuespedes(Math.min(8, numHuespedes + 1))}>
                  <Ionicons name="add-circle-outline" size={28} color="#C9A961" />
                </TouchableOpacity>
              </View>
              <Text style={estilos.labelHuespedes}>Huéspedes</Text>
            </View>

            {/* Botón Buscar */}
            <TouchableOpacity
              style={estilos.botonBuscar}
              onPress={handleBuscarHabitaciones}
            >
              <Text style={estilos.textoBuscar}>Buscar</Text>
              <Ionicons name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. ¿POR QUÉ ELEGIRNOS? */}
        <View style={estilos.seccionPorQueElegirnos}>
          <Text style={estilos.tituloSeccion}>¿Por Qué Elegir Luna Serena?</Text>
          <Text style={estilos.subtituloSeccion}>Tu comodidad es nuestra prioridad</Text>

          <View style={estilos.gridBeneficios}>
            {/* Beneficio 1 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="wifi" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>WiFi de Alta Velocidad</Text>
              <Text style={estilos.descripcionBeneficio}>Conexión gratuita en todas las habitaciones</Text>
            </View>

            {/* Beneficio 2 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="restaurant" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>Restaurante Gourmet</Text>
              <Text style={estilos.descripcionBeneficio}>Cocina internacional y local de primer nivel</Text>
            </View>

            {/* Beneficio 3 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="fitness" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>Gimnasio 24/7</Text>
              <Text style={estilos.descripcionBeneficio}>Equipamiento de última generación</Text>
            </View>

            {/* Beneficio 4 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="water" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>Spa & Wellness</Text>
              <Text style={estilos.descripcionBeneficio}>Relájate con nuestros tratamientos</Text>
            </View>

            {/* Beneficio 5 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="car" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>Parking Gratuito</Text>
              <Text style={estilos.descripcionBeneficio}>Estacionamiento seguro incluido</Text>
            </View>

            {/* Beneficio 6 */}
            <View style={estilos.beneficioCard}>
              <View style={estilos.iconoBeneficio}>
                <Ionicons name="headset" size={32} color="#C9A961" />
              </View>
              <Text style={estilos.tituloBeneficio}>Atención 24/7</Text>
              <Text style={estilos.descripcionBeneficio}>Estamos siempre para ayudarte</Text>
            </View>
          </View>
        </View>

        {/* 4. CARRUSEL DE HABITACIONES CON AUTO-SCROLL */}
        <AutoScrollCarousel
          habitaciones={habitacionesPopulares}
          loading={loading}
          onRoomPress={handleHabitacionPress}
          onViewAllPress={handleViewAllHabitaciones}
          title="HABITACIONES DESTACADAS"
          autoScrollInterval={4000}
        />

        {/* 5. TESTIMONIOS DESTACADOS - VERTICAL CENTERED */}
        <View style={estilos.seccionTestimonios}>
          <Text style={estilos.tituloSeccion}>Lo Que Dicen Nuestros Huéspedes</Text>

          <View style={estilos.calificacionGeneral}>
            <Ionicons name="star" size={32} color="#FFD700" />
            <Text style={estilos.numeroCalificacion}>4.8</Text>
            <Text style={estilos.textoCalificacion}>basado en 1,247 reseñas</Text>
          </View>

          <View style={estilos.testimoniosContainer}>
            {/* Testimonio 1 */}
            <View style={estilos.testimonioCard}>
              <View style={estilos.headerTestimonio}>
                <View style={estilos.avatarTestimonio}>
                  <Text style={estilos.inicialAvatar}>M</Text>
                </View>
                <View style={estilos.infoHuesped}>
                  <Text style={estilos.nombreHuesped}>María García</Text>
                  <View style={estilos.estrellasTestimonio}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons key={i} name="star" size={16} color="#FFD700" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={estilos.textoTestimonio}>
                "Excelente habitación, muy limpia y cómoda. El personal fue muy amable. Definitivamente volvería a reservar."
              </Text>
              <View style={estilos.footerTestimonio}>
                <Text style={estilos.fechaTestimonio}>Hace 2 semanas</Text>
                <Text style={estilos.separadorTestimonio}>•</Text>
                <Text style={estilos.habitacionTestimonio}>Suite Deluxe</Text>
              </View>
            </View>

            {/* Testimonio 2 */}
            <View style={estilos.testimonioCard}>
              <View style={estilos.headerTestimonio}>
                <View style={estilos.avatarTestimonio}>
                  <Text style={estilos.inicialAvatar}>J</Text>
                </View>
                <View style={estilos.infoHuesped}>
                  <Text style={estilos.nombreHuesped}>Juan López</Text>
                  <View style={estilos.estrellasTestimonio}>
                    {[1, 2, 3, 4].map((i) => (
                      <Ionicons key={i} name="star" size={16} color="#FFD700" />
                    ))}
                    <Ionicons name="star-outline" size={16} color="#FFD700" />
                  </View>
                </View>
              </View>
              <Text style={estilos.textoTestimonio}>
                "Buena ubicación y cómoda. La única observación es que el WiFi fue un poco lento en las noches."
              </Text>
              <View style={estilos.footerTestimonio}>
                <Text style={estilos.fechaTestimonio}>Hace 1 mes</Text>
                <Text style={estilos.separadorTestimonio}>•</Text>
                <Text style={estilos.habitacionTestimonio}>Habitación Estándar</Text>
              </View>
            </View>

            {/* Testimonio 3 */}
            <View style={estilos.testimonioCard}>
              <View style={estilos.headerTestimonio}>
                <View style={estilos.avatarTestimonio}>
                  <Text style={estilos.inicialAvatar}>C</Text>
                </View>
                <View style={estilos.infoHuesped}>
                  <Text style={estilos.nombreHuesped}>Carolina Ruiz</Text>
                  <View style={estilos.estrellasTestimonio}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Ionicons key={i} name="star" size={16} color="#FFD700" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={estilos.textoTestimonio}>
                "¡Increíble experiencia! La vista al mar es espectacular y el desayuno delicioso. Volveremos seguro."
              </Text>
              <View style={estilos.footerTestimonio}>
                <Text style={estilos.fechaTestimonio}>Hace 3 semanas</Text>
                <Text style={estilos.separadorTestimonio}>•</Text>
                <Text style={estilos.habitacionTestimonio}>Habitación Premium</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 7. CTA PARA REGISTRARSE (solo invitados) */}
        {!isAuthenticated && (
          <View style={estilos.seccionCTA}>
            <View style={estilos.ctaCard}>
              <Ionicons name="gift" size={48} color="#C9A961" />
              <Text style={estilos.ctaTitulo}>¡Regístrate y Obtén Beneficios!</Text>
              <View style={estilos.listaBeneficios}>
                <View style={estilos.beneficioCTA}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={estilos.textoBeneficioCTA}>10% de descuento en tu primera reserva</Text>
                </View>
                <View style={estilos.beneficioCTA}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={estilos.textoBeneficioCTA}>Acumula puntos por cada estadía</Text>
                </View>
                <View style={estilos.beneficioCTA}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={estilos.textoBeneficioCTA}>Acceso a ofertas exclusivas</Text>
                </View>
                <View style={estilos.beneficioCTA}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={estilos.textoBeneficioCTA}>Check-in prioritario</Text>
                </View>
              </View>
              <TouchableOpacity
                style={estilos.botonRegistroCTA}
                onPress={() => navigation.navigate('Auth', { screen: 'Registro' })}
              >
                <Text style={estilos.textoBotonRegistro}>Crear Cuenta Gratis</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 8. PREGUNTAS FRECUENTES */}
        <View style={estilos.seccionFAQ}>
          <Text style={estilos.tituloSeccion}>Preguntas Frecuentes</Text>

          {/* FAQ 1 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 1 ? null : 1)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿A qué hora es el check-in y check-out?</Text>
              <Ionicons
                name={faqAbierto === 1 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 1 && (
              <Text style={estilos.faqRespuesta}>
                El check-in es a partir de las 14:00 horas y el check-out hasta las 11:00 horas.
                Si necesitas un check-in temprano o check-out tardío, contáctanos con anticipación.
              </Text>
            )}
          </TouchableOpacity>

          {/* FAQ 2 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 2 ? null : 2)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿Aceptan mascotas?</Text>
              <Ionicons
                name={faqAbierto === 2 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 2 && (
              <Text style={estilos.faqRespuesta}>
                Sí, aceptamos mascotas pequeñas (hasta 10 kg) con un cargo adicional de $15 por noche.
                Por favor, infórmanos al momento de hacer la reserva.
              </Text>
            )}
          </TouchableOpacity>

          {/* FAQ 3 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 3 ? null : 3)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿Tienen estacionamiento?</Text>
              <Ionicons
                name={faqAbierto === 3 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 3 && (
              <Text style={estilos.faqRespuesta}>
                Sí, contamos con estacionamiento gratuito y seguro para todos nuestros huéspedes.
                Disponible las 24 horas del día.
              </Text>
            )}
          </TouchableOpacity>

          {/* FAQ 4 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 4 ? null : 4)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿Puedo cancelar mi reserva?</Text>
              <Ionicons
                name={faqAbierto === 4 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 4 && (
              <Text style={estilos.faqRespuesta}>
                Puedes cancelar sin cargo hasta 48 horas antes del check-in. Las cancelaciones entre
                24-48 horas tienen un reembolso del 50%. Menos de 24 horas no tiene reembolso.
              </Text>
            )}
          </TouchableOpacity>

          {/* FAQ 5 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 5 ? null : 5)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿Ofrecen servicio de transporte?</Text>
              <Ionicons
                name={faqAbierto === 5 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 5 && (
              <Text style={estilos.faqRespuesta}>
                Sí, ofrecemos servicio de shuttle al aeropuerto por $25 por trayecto.
                También contamos con servicio de taxi disponible las 24 horas.
              </Text>
            )}
          </TouchableOpacity>

          {/* FAQ 6 */}
          <TouchableOpacity
            style={estilos.faqItem}
            onPress={() => setFaqAbierto(faqAbierto === 6 ? null : 6)}
          >
            <View style={estilos.faqPregunta}>
              <Text style={estilos.textoPregunta}>¿El desayuno está incluido?</Text>
              <Ionicons
                name={faqAbierto === 6 ? "chevron-up" : "chevron-down"}
                size={24}
                color="#C9A961"
              />
            </View>
            {faqAbierto === 6 && (
              <Text style={estilos.faqRespuesta}>
                El desayuno no está incluido en la tarifa base, pero puedes agregarlo por $15 por
                persona por día. Incluye buffet completo de 7:00 a 11:00 am.
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 9. FOOTER */}
        <Footer navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollContent: {
    paddingBottom: DIMENSIONES.padding,
  },
  
  // BUSCADOR RÁPIDO
  seccionBusqueda: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#FFFFFF',
  },
  tituloBusqueda: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  buscadorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputFecha: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  textoFecha: {
    marginLeft: 10,
    flex: 1,
  },
  labelFecha: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  valorFecha: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  inputHuespedes: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contadorHuespedes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginVertical: 5,
  },
  numeroHuespedes: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    minWidth: 30,
    textAlign: 'center',
  },
  labelHuespedes: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  botonBuscar: {
    flex: 1,
    minWidth: 150,
    backgroundColor: '#C9A961',
    borderRadius: 12,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  textoBuscar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // ¿POR QUÉ ELEGIRNOS?
  seccionPorQueElegirnos: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#F8F8F8',
  },
  tituloSeccion: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtituloSeccion: {
    fontSize: 16,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 30,
  },
  gridBeneficios: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 10,
  },
  beneficioCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
  },
  iconoBeneficio: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  tituloBeneficio: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 8,
  },
  descripcionBeneficio: {
    fontSize: 13,
    color: '#6B6B6B',
    textAlign: 'center',
    lineHeight: 18,
  },

  // GALERÍA DE AMENIDADES
  seccionAmenidades: {
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  scrollAmenidades: {
    paddingHorizontal: 20,
    gap: 15,
  },
  amenidadCard: {
    width: 280,
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  overlayAmenidad: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
  },
  tituloAmenida: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  descripcionAmenida: {
    fontSize: 14,
    color: '#F8F8F8',
  },
  tituloAmenidad: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  descripcionAmenidad: {
    fontSize: 14,
    color: '#F8F8F8',
  },

  // TESTIMONIOS
  seccionTestimonios: {
    paddingVertical: 40,
    backgroundColor: '#F8F8F8',
  },
  calificacionGeneral: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 10,
  },
  numeroCalificacion: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  textoCalificacion: {
    fontSize: 14,
    color: '#6B6B6B',
  },
  scrollTestimonios: {
    paddingHorizontal: 20,
    gap: 15,
  },
  testimoniosContainer: {
    width: '100%',
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 15,
  },
  testimonioCard: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTestimonio: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 12,
  },
  avatarTestimonio: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C9A961',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inicialAvatar: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  infoHuesped: {
    flex: 1,
  },
  nombreHuesped: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  estrellasTestimonio: {
    flexDirection: 'row',
    gap: 2,
  },
  textoTestimonio: {
    fontSize: 14,
    color: '#1A1A1A',
    lineHeight: 20,
    marginBottom: 15,
  },
  footerTestimonio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fechaTestimonio: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  separadorTestimonio: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  habitacionTestimonio: {
    fontSize: 12,
    color: '#C9A961',
    fontWeight: '600',
  },

  // CTA REGISTRO
  seccionCTA: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  ctaCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#C9A961',
  },
  ctaTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 15,
    marginBottom: 20,
  },
  listaBeneficios: {
    width: '100%',
    marginBottom: 25,
    gap: 12,
  },
  beneficioCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoBeneficioCTA: {
    fontSize: 16,
    color: '#1A1A1A',
    flex: 1,
  },
  botonRegistroCTA: {
    backgroundColor: '#C9A961',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoBotonRegistro: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },

  // FAQs
  seccionFAQ: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    backgroundColor: '#FFFFFF',
  },
  faqItem: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  faqPregunta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textoPregunta: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    flex: 1,
    marginRight: 10,
  },
  faqRespuesta: {
    fontSize: 14,
    color: '#6B6B6B',
    lineHeight: 20,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  // MODAL CALENDARIO
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCalendario: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  headerModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  botonesModal: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  botonCancelarModal: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
  },
  textoBotonCancelar: {
    color: '#1A1A1A',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;