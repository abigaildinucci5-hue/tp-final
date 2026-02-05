/**
 * HOME SCREEN - HOTEL LUNA SERENA
 * Pantalla principal con buscador, beneficios, testimonios y FAQs
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORES, TIPOGRAFIA, ESPACIADO, BORDER_RADIUS, SOMBRAS } from '../constants/colores';

const { width, height } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [fechaCheckIn, setFechaCheckIn] = useState(null);
  const [fechaCheckOut, setFechaCheckOut] = useState(null);
  const [huespedes, setHuespedes] = useState(1);

  const handleBuscar = () => {
    if (fechaCheckIn && fechaCheckOut) {
      // Navegar a pantalla de búsqueda o habitaciones
      navigation?.navigate('Habitaciones', {
        fechaCheckIn,
        fechaCheckOut,
        huespedes,
      });
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* HERO BANNER */}
      <View style={styles.heroBanner}>
        <Image
          source={require('../assets/hero-banner.jpg')}
          style={styles.heroBannerImg}
          defaultSource={require('../assets/hero-placeholder.jpg')}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitulo}>Bienvenido a Hotel Luna Serena</Text>
          <Text style={styles.heroSubtitulo}>Lujo y confort bajo las estrellas</Text>
        </View>
      </View>

      {/* BUSCADOR RÁPIDO */}
      <View style={styles.buscadorContainer}>
        <Text style={styles.seccionTitulo}>Buscar Habitación</Text>

        <View style={styles.buscadorGrid}>
          {/* Check-in */}
          <TouchableOpacity
            style={styles.buscadorInput}
            onPress={() => {
              setMostrarCalendario(true);
              // Aquí implementar modal de calendario
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORES.SECUNDARIO} />
            <View style={styles.buscadorTexto}>
              <Text style={styles.buscadorLabel}>Check-in</Text>
              <Text style={styles.buscadorValor}>
                {fechaCheckIn || 'Seleccionar fecha'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Check-out */}
          <TouchableOpacity
            style={styles.buscadorInput}
            onPress={() => {
              setMostrarCalendario(true);
              // Aquí implementar modal de calendario
            }}
          >
            <Ionicons name="calendar-outline" size={20} color={COLORES.SECUNDARIO} />
            <View style={styles.buscadorTexto}>
              <Text style={styles.buscadorLabel}>Check-out</Text>
              <Text style={styles.buscadorValor}>
                {fechaCheckOut || 'Seleccionar fecha'}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Huéspedes */}
          <View style={styles.buscadorInput}>
            <Ionicons name="people-outline" size={20} color={COLORES.SECUNDARIO} />
            <View style={styles.buscadorTexto}>
              <Text style={styles.buscadorLabel}>Huéspedes</Text>
              <View style={styles.contadorHuespedes}>
                <TouchableOpacity onPress={() => setHuespedes(Math.max(1, huespedes - 1))}>
                  <Ionicons name="remove-outline" size={18} color={COLORES.SECUNDARIO} />
                </TouchableOpacity>
                <Text style={styles.contadorValor}>{huespedes}</Text>
                <TouchableOpacity onPress={() => setHuespedes(huespedes + 1)}>
                  <Ionicons name="add-outline" size={18} color={COLORES.SECUNDARIO} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.botonBuscar}
          onPress={handleBuscar}
          disabled={!fechaCheckIn || !fechaCheckOut}
        >
          <Ionicons name="search-outline" size={20} color={COLORES.BLANCO} />
          <Text style={styles.botonBuscarTexto}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* BENEFICIOS */}
      <View style={styles.beneficiosContainer}>
        <Text style={styles.seccionTitulo}>Nuestros Servicios</Text>

        <FlatList
          data={BENEFICIOS}
          renderItem={({ item }) => (
            <BeneficioCard
              icono={item.icono}
              titulo={item.titulo}
              descripcion={item.descripcion}
            />
          )}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          numColumns={2}
          columnWrapperStyle={styles.beneficiosGrid}
        />
      </View>

      {/* TESTIMONIOS CAROUSEL */}
      <View style={styles.testimoniosContainer}>
        <Text style={styles.seccionTitulo}>Lo que dicen nuestros huéspedes</Text>

        <FlatList
          data={TESTIMONIOS}
          renderItem={({ item }) => <TestimonioCard testimonial={item} />}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={width - ESPACIADO.L * 2}
          decelerationRate="fast"
          scrollEventThrottle={16}
        />
      </View>

      {/* FAQs ACCORDION */}
      <View style={styles.faqContainer}>
        <Text style={styles.seccionTitulo}>Preguntas Frecuentes</Text>

        <FlatList
          data={FAQS}
          renderItem={({ item }) => <AccordionItem item={item} />}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
        />
      </View>

      {/* LLAMADA A ACCIÓN */}
      <View style={styles.ctaContainer}>
        <Text style={styles.ctaTitulo}>¿Listo para tu próxima aventura?</Text>
        <Text style={styles.ctaSubtitulo}>
          Reserva ahora y disfruta de una experiencia inolvidable
        </Text>

        <TouchableOpacity
          style={styles.botonCTA}
          onPress={() => navigation?.navigate('Habitaciones')}
        >
          <Text style={styles.botonCTATexto}>Explorar Habitaciones</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORES.BLANCO} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

/**
 * Componente BeneficioCard
 */
const BeneficioCard = ({ icono, titulo, descripcion }) => (
  <View style={styles.beneficioCard}>
    <View style={styles.beneficioIcono}>
      <Ionicons name={icono} size={40} color={COLORES.SECUNDARIO} />
    </View>
    <Text style={styles.beneficioTitulo}>{titulo}</Text>
    <Text style={styles.beneficioDescripcion}>{descripcion}</Text>
  </View>
);

/**
 * Componente TestimonioCard
 */
const TestimonioCard = ({ testimonial }) => (
  <View style={styles.testimonioCard}>
    <View style={styles.testimonioStars}>
      {[...Array(testimonial.rating)].map((_, i) => (
        <Ionicons
          key={i}
          name="star"
          size={18}
          color={COLORES.ORO}
        />
      ))}
    </View>

    <Text style={styles.testimonioTexto}>"{testimonial.texto}"</Text>

    <View style={styles.testimonioAutor}>
      <Image
        source={{ uri: testimonial.avatar }}
        style={styles.testimonioAvatar}
        defaultSource={require('../assets/avatar-placeholder.jpg')}
      />
      <View>
        <Text style={styles.testimonioNombre}>{testimonial.nombre}</Text>
        <Text style={styles.testimonioFecha}>{testimonial.fecha}</Text>
      </View>
    </View>
  </View>
);

/**
 * Componente AccordionItem
 */
const AccordionItem = ({ item }) => {
  const [expandido, setExpandido] = useState(false);

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => setExpandido(!expandido)}
      >
        <Text style={styles.accordionTitulo}>{item.pregunta}</Text>
        <Ionicons
          name={expandido ? 'chevron-up' : 'chevron-down'}
          size={24}
          color={COLORES.SECUNDARIO}
        />
      </TouchableOpacity>

      {expandido && (
        <View style={styles.accordionContenido}>
          <Text style={styles.accordionRespuesta}>{item.respuesta}</Text>
        </View>
      )}
    </View>
  );
};

// DATOS MOCK
const BENEFICIOS = [
  {
    id: '1',
    icono: 'wifi-outline',
    titulo: 'WiFi Alta Velocidad',
    descripcion: 'Gratis en todas las habitaciones',
  },
  {
    id: '2',
    icono: 'restaurant-outline',
    titulo: 'Restaurante Gourmet',
    descripcion: 'Cocina internacional',
  },
  {
    id: '3',
    icono: 'fitness-outline',
    titulo: 'Gimnasio 24/7',
    descripcion: 'Equipamiento moderno',
  },
  {
    id: '4',
    icono: 'water-outline',
    titulo: 'Piscina Olímpica',
    descripcion: 'Agua temperada todo el año',
  },
  {
    id: '5',
    icono: 'car-outline',
    titulo: 'Estacionamiento',
    descripcion: 'Seguro y cubierto',
  },
  {
    id: '6',
    icono: 'spa-outline',
    titulo: 'Spa y Sauna',
    descripcion: 'Relajación total',
  },
];

const TESTIMONIOS = [
  {
    id: '1',
    nombre: 'María García',
    avatar: 'https://via.placeholder.com/50',
    rating: 5,
    texto: 'Excelente hotel, personal muy atento y habitaciones cómodas. Volveremos seguro.',
    fecha: '15 ene 2026',
  },
  {
    id: '2',
    nombre: 'Carlos López',
    avatar: 'https://via.placeholder.com/50',
    rating: 5,
    texto: 'Las vistas al atardecer son increíbles. La mejor experiencia de hospedaje.',
    fecha: '10 ene 2026',
  },
  {
    id: '3',
    nombre: 'Ana Martínez',
    avatar: 'https://via.placeholder.com/50',
    rating: 4,
    texto: 'Buena relación precio-calidad. El desayuno buffet es muy completo.',
    fecha: '5 ene 2026',
  },
];

const FAQS = [
  {
    id: '1',
    pregunta: '¿Cuál es el horario de check-in y check-out?',
    respuesta: 'El check-in es a partir de las 14:00 y el check-out hasta las 12:00 del mediodía. Contacta recepción para early check-in o late checkout según disponibilidad.',
  },
  {
    id: '2',
    pregunta: '¿Se aceptan mascotas?',
    respuesta: 'Sí, aceptamos mascotas en nuestras habitaciones pet-friendly. Hay un cargo adicional de $15 USD por noche.',
  },
  {
    id: '3',
    pregunta: '¿El WiFi es gratis?',
    respuesta: 'Sí, WiFi de alta velocidad está incluido sin costo en todas nuestras habitaciones y áreas comunes.',
  },
  {
    id: '4',
    pregunta: '¿Hay transporte al aeropuerto?',
    respuesta: 'Sí, ofrecemos servicio de transfer al aeropuerto. Costo: $30 USD ida y vuelta. Contacta con recepción.',
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.ACENTO,
  },

  // HERO BANNER
  heroBanner: {
    height: 300,
    backgroundColor: COLORES.PRIMARIO,
    position: 'relative',
    overflow: 'hidden',
  },

  heroBannerImg: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ESPACIADO.L,
  },

  heroTitulo: {
    fontSize: TIPOGRAFIA.H2,
    color: COLORES.BLANCO,
    fontWeight: TIPOGRAFIA.BOLD,
    textAlign: 'center',
    marginBottom: ESPACIADO.M,
  },

  heroSubtitulo: {
    fontSize: TIPOGRAFIA.BODY_L,
    color: COLORES.SECUNDARIO,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // BUSCADOR
  buscadorContainer: {
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.XL,
    marginTop: -50,
    marginHorizontal: ESPACIADO.L,
    backgroundColor: COLORES.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    ...SOMBRAS.LARGE,
    zIndex: 10,
  },

  seccionTitulo: {
    fontSize: TIPOGRAFIA.H3,
    fontWeight: TIPOGRAFIA.BOLD,
    color: COLORES.NEGRO,
    marginBottom: ESPACIADO.L,
  },

  buscadorGrid: {
    gap: ESPACIADO.M,
    marginBottom: ESPACIADO.L,
  },

  buscadorInput: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
    paddingHorizontal: ESPACIADO.M,
    paddingVertical: ESPACIADO.M,
    backgroundColor: COLORES.GRIS_CLARO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.SECUNDARIO,
  },

  buscadorTexto: {
    flex: 1,
  },

  buscadorLabel: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
  },

  buscadorValor: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.NEGRO,
    fontWeight: TIPOGRAFIA.MEDIUM,
    marginTop: ESPACIADO.XS,
  },

  contadorHuespedes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.S,
    marginTop: ESPACIADO.XS,
  },

  contadorValor: {
    fontSize: TIPOGRAFIA.BODY_L,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.NEGRO,
    minWidth: 30,
    textAlign: 'center',
  },

  botonBuscar: {
    backgroundColor: COLORES.SECUNDARIO,
    paddingVertical: ESPACIADO.M,
    borderRadius: BORDER_RADIUS.MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: ESPACIADO.S,
  },

  botonBuscarTexto: {
    fontSize: TIPOGRAFIA.BODY_L,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.BLANCO,
  },

  // BENEFICIOS
  beneficiosContainer: {
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.XL,
  },

  beneficiosGrid: {
    gap: ESPACIADO.L,
  },

  beneficioCard: {
    flex: 1,
    backgroundColor: COLORES.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: ESPACIADO.L,
    alignItems: 'center',
    ...SOMBRAS.MEDIUM,
  },

  beneficioIcono: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(201, 169, 97, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ESPACIADO.M,
  },

  beneficioTitulo: {
    fontSize: TIPOGRAFIA.BODY_L,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.NEGRO,
    textAlign: 'center',
    marginBottom: ESPACIADO.S,
  },

  beneficioDescripcion: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    textAlign: 'center',
  },

  // TESTIMONIOS
  testimoniosContainer: {
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.XL,
    backgroundColor: COLORES.PRIMARIO,
  },

  testimoniosContainer: {
    paddingVertical: ESPACIADO.XL,
    backgroundColor: COLORES.PRIMARIO,
  },

  testimonioCard: {
    width: width - ESPACIADO.L * 2,
    backgroundColor: COLORES.BLANCO,
    borderRadius: BORDER_RADIUS.LARGE,
    padding: ESPACIADO.L,
    marginHorizontal: ESPACIADO.L,
    ...SOMBRAS.MEDIUM,
  },

  testimonioStars: {
    flexDirection: 'row',
    gap: ESPACIADO.XS,
    marginBottom: ESPACIADO.M,
  },

  testimonioTexto: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.NEGRO,
    fontStyle: 'italic',
    marginBottom: ESPACIADO.M,
    lineHeight: 22,
  },

  testimonioAutor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.M,
  },

  testimonioAvatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
  },

  testimonioNombre: {
    fontSize: TIPOGRAFIA.BODY_M,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.NEGRO,
  },

  testimonioFecha: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    marginTop: ESPACIADO.XS,
  },

  // FAQs
  faqContainer: {
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.XL,
  },

  accordionItem: {
    marginBottom: ESPACIADO.M,
    backgroundColor: COLORES.BLANCO,
    borderRadius: BORDER_RADIUS.MEDIUM,
    overflow: 'hidden',
    ...SOMBRAS.SMALL,
  },

  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.M,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.SECUNDARIO,
  },

  accordionTitulo: {
    fontSize: TIPOGRAFIA.BODY_M,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.NEGRO,
    flex: 1,
  },

  accordionContenido: {
    paddingHorizontal: ESPACIADO.L,
    paddingBottom: ESPACIADO.M,
    borderTopWidth: 1,
    borderTopColor: COLORES.GRIS_CLARO,
  },

  accordionRespuesta: {
    fontSize: TIPOGRAFIA.BODY_S,
    color: COLORES.COMPLEMENTARIO,
    lineHeight: 20,
    marginTop: ESPACIADO.M,
  },

  // CTA
  ctaContainer: {
    marginHorizontal: ESPACIADO.L,
    marginVertical: ESPACIADO.XL,
    paddingHorizontal: ESPACIADO.L,
    paddingVertical: ESPACIADO.XXL,
    backgroundColor: COLORES.PRIMARIO,
    borderRadius: BORDER_RADIUS.LARGE,
    alignItems: 'center',
  },

  ctaTitulo: {
    fontSize: TIPOGRAFIA.H3,
    fontWeight: TIPOGRAFIA.BOLD,
    color: COLORES.BLANCO,
    marginBottom: ESPACIADO.M,
    textAlign: 'center',
  },

  ctaSubtitulo: {
    fontSize: TIPOGRAFIA.BODY_M,
    color: COLORES.SECUNDARIO,
    textAlign: 'center',
    marginBottom: ESPACIADO.XL,
  },

  botonCTA: {
    backgroundColor: COLORES.SECUNDARIO,
    paddingHorizontal: ESPACIADO.XL,
    paddingVertical: ESPACIADO.M,
    borderRadius: BORDER_RADIUS.MEDIUM,
    flexDirection: 'row',
    alignItems: 'center',
    gap: ESPACIADO.S,
  },

  botonCTATexto: {
    fontSize: TIPOGRAFIA.BODY_L,
    fontWeight: TIPOGRAFIA.SEMIBOLD,
    color: COLORES.BLANCO,
  },
});

export default HomeScreen;
