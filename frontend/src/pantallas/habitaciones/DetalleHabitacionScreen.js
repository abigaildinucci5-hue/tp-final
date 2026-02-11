// frontend/src/pantallas/habitaciones/DetalleHabitacionScreen.js
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DetalleHabitacionScreen = ({ route, navigation }) => {
  const { habitacionId } = route.params;
  const [habitacion, setHabitacion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef(null);

  React.useEffect(() => {
    cargarHabitacion();
  }, []);

  const cargarHabitacion = async () => {
    try {
      setLoading(true);
      // Simulando data para demostración
      // En producción, traerías del API
      const mockData = {
        id_habitacion: habitacionId,
        numero_habitacion: '101',
        tipo_habitacion: 'Estándar',
        precio_base: 50,
        estado: 'disponible',
        capacidad_personas: 2,
        imagen_principal: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
        galeria_imagenes: JSON.stringify([
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578654881228-4b676f7f579e?w=800&h=600&fit=crop',
        ]),
        descripcion: 'Habitación estándar acogedora con cama doble, baño privado y escritorio. Perfecta para parejas. Incluye WiFi, TV por cable y aire acondicionado.',
      };
      setHabitacion(mockData);
    } catch (error) {
      console.error('Error al cargar habitación:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORES.dorado} />
      </View>
    );
  }

  if (!habitacion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No se encontró la habitación</Text>
      </View>
    );
  }

  // Array de imágenes
  let imagenes = [];
  try {
    const galeriaData = JSON.parse(habitacion.galeria_imagenes);
    imagenes = Array.isArray(galeriaData) ? galeriaData : [habitacion.imagen_principal];
  } catch {
    imagenes = [habitacion.imagen_principal];
  }

  if (imagenes.length === 0) {
    imagenes = [habitacion.imagen_principal];
  }

  // Asegurar mínimo 5 imágenes
  while (imagenes.length < 5) {
    imagenes.push(habitacion.imagen_principal);
  }

  const handleScrollToImage = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * SCREEN_WIDTH,
      animated: true,
    });
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* BARRA DE NAVEGACIÓN SUPERIOR PERSONALIZADA */}
      <View style={styles.topNavBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color={COLORES.textoOscuro} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.favoriteButton}
          onPress={() => setIsFavorite(!isFavorite)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? '#EF4444' : COLORES.dorado}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. GALERÍA DE IMÁGENES COMO EN EL HTML */}
        <View style={styles.imageGallerySection}>
          {/* Carousel Principal de Imágenes Grandes */}
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(event) => {
              const slideIndex = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentImageIndex(slideIndex);
            }}
            scrollEventThrottle={16}
          >
            {imagenes.map((imagen, index) => (
              <Image
                key={index}
                source={{ uri: imagen }}
                style={styles.mainImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>

          {/* Indicadores de Página (Dots) */}
          <View style={styles.paginationDots}>
            {imagenes.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index && styles.dotActive,
                ]}
              />
            ))}
          </View>

          {/* Miniaturas de Imágenes */}
          <View style={styles.thumbnailSection}>
            <FlatList
              horizontal
              data={imagenes}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleScrollToImage(index)}
                  style={[
                    styles.thumbnailWrapper,
                    currentImageIndex === index && styles.thumbnailActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: item }}
                    style={styles.thumbnailImage}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              )}
              keyExtractor={(_, index) => index.toString()}
              contentContainerStyle={styles.thumbnailList}
            />
          </View>
        </View>

        {/* 2. TÍTULO Y PRECIO */}
        <View style={styles.titlePriceSection}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.roomCategory}>{habitacion.tipo_habitacion}</Text>
              <Text style={styles.roomTitle}>
                Habitación {habitacion.numero_habitacion}
              </Text>
            </View>

            <View style={styles.priceBox}>
              <Text style={styles.priceLabel}>Desde</Text>
              <Text style={styles.priceAmount}>${habitacion.precio_base}</Text>
              <Text style={styles.priceUnit}>/ noche</Text>
            </View>
          </View>

          {/* Badge de Disponibilidad */}
          {habitacion.estado === 'disponible' && (
            <View style={styles.availableBadge}>
              <MaterialCommunityIcons
                name="check-circle"
                size={16}
                color="#2ECC71"
              />
              <Text style={styles.availableBadgeText}>Disponible</Text>
            </View>
          )}
        </View>

        {/* 3. SERVICIOS */}
        <View style={styles.servicesRow}>
          <View style={styles.serviceItem}>
            <View style={styles.serviceIconCircle}>
              <MaterialCommunityIcons
                name="wifi"
                size={24}
                color={COLORES.dorado}
              />
            </View>
            <Text style={styles.serviceLabel}>WiFi gratuito</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconCircle}>
              <MaterialCommunityIcons
                name="television"
                size={24}
                color={COLORES.dorado}
              />
            </View>
            <Text style={styles.serviceLabel}>TV HD</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconCircle}>
              <MaterialCommunityIcons
                name="snowflake"
                size={24}
                color={COLORES.dorado}
              />
            </View>
            <Text style={styles.serviceLabel}>Aire acond.</Text>
          </View>

          <View style={styles.serviceItem}>
            <View style={styles.serviceIconCircle}>
              <MaterialCommunityIcons
                name="bed-outline"
                size={24}
                color={COLORES.dorado}
              />
            </View>
            <Text style={styles.serviceLabel}>{habitacion.capacidad_personas} pers.</Text>
          </View>
        </View>

        {/* 4. DESCRIPCIÓN */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.descriptionText}>
            {habitacion.descripcion}
          </Text>
        </View>

        {/* 5. AMENIDADES */}
        <View style={styles.amenitiesSection}>
          <Text style={styles.sectionTitle}>Servicios Incluidos</Text>

          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>WiFi gratis</Text>
            </View>

            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>TV por cable</Text>
            </View>

            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>Aire acondicionado</Text>
            </View>

            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>Baño privado</Text>
            </View>

            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>Caja fuerte</Text>
            </View>

            <View style={styles.amenityItem}>
              <MaterialCommunityIcons
                name="check-circle-outline"
                size={20}
                color={COLORES.dorado}
              />
              <Text style={styles.amenityText}>Minibar</Text>
            </View>
          </View>
        </View>

        {/* 6. INFORMACIÓN ADICIONAL */}
        <View style={styles.additionalInfoSection}>
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>Check-in</Text>
            <Text style={styles.infoBlockValue}>14:00</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>Check-out</Text>
            <Text style={styles.infoBlockValue}>11:00</Text>
          </View>

          <View style={styles.infoDivider} />

          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>Tamaño</Text>
            <Text style={styles.infoBlockValue}>25 m²</Text>
          </View>
        </View>

        {/* 7. SECCIÓN DE COMENTARIOS */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comentarios de Huéspedes</Text>
          
          {/* Comentarios de ejemplo */}
          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={24} color={COLORES.dorado} />
              </View>
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>María García</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MaterialCommunityIcons
                      key={star}
                      name="star"
                      size={16}
                      color={COLORES.dorado}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.commentText}>
              "Excelente habitación, muy limpia y cómoda. El personal fue muy amable. Definitivamente volvería a reservar."
            </Text>
            <Text style={styles.commentDate}>Hace 2 semanas</Text>
          </View>

          <View style={styles.commentCard}>
            <View style={styles.commentHeader}>
              <View style={styles.avatarPlaceholder}>
                <MaterialCommunityIcons name="account" size={24} color={COLORES.dorado} />
              </View>
              <View style={styles.commentInfo}>
                <Text style={styles.commentAuthor}>Juan López</Text>
                <View style={styles.ratingStars}>
                  {[1, 2, 3, 4].map((star) => (
                    <MaterialCommunityIcons
                      key={star}
                      name="star"
                      size={16}
                      color={COLORES.dorado}
                    />
                  ))}
                  <MaterialCommunityIcons
                    name="star-outline"
                    size={16}
                    color={COLORES.gris}
                  />
                </View>
              </View>
            </View>
            <Text style={styles.commentText}>
              "Buena ubicación y cómoda. La única observación es que el WiFi fue un poco lento en las noches."
            </Text>
            <Text style={styles.commentDate}>Hace 1 mes</Text>
          </View>

          {/* Aviso para comentar */}
          <View style={styles.commentPrompt}>
            <MaterialCommunityIcons name="information" size={20} color={COLORES.dorado} />
            <Text style={styles.commentPromptText}>
              Para comentar debes tener un perfil y haber reservado esta habitación
            </Text>
          </View>
        </View>

        {/* Espacio para el botón flotante y nav bar */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BOTÓN FLOTANTE DE RESERVAR */}
      <View style={styles.reserveButtonContainer}>
        <TouchableOpacity
          style={styles.reserveButton}
          onPress={() => {
            navigation.navigate('Home', {
              screen: 'NuevaReserva',
              params: { habitacion },
            });
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.reserveButtonText}>Reservar Ahora</Text>
          <MaterialCommunityIcons
            name="arrow-right"
            size={20}
            color={COLORES.blanco}
          />
        </TouchableOpacity>
      </View>

      {/* BARRA DE NAVEGACIÓN PERSONALIZADA */}
      <View style={styles.customBottomNav}>
        <View style={styles.navButtonsContainer}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="home-outline"
              size={22}
              color={COLORES.textoMedio}
            />
            <Text style={styles.navButtonText}>Inicio</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('ListaHabitaciones')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="bed-outline"
              size={22}
              color={COLORES.textoMedio}
            />
            <Text style={styles.navButtonText}>Habitaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => navigation.navigate('MisReservas')}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="calendar-outline"
              size={22}
              color={COLORES.textoMedio}
            />
            <Text style={styles.navButtonText}>Reservas</Text>
          </TouchableOpacity>
        </View>

        {/* ÍCONO DE USUARIO A LA DERECHA */}
        <TouchableOpacity
          style={styles.userIcon}
          onPress={() => navigation.navigate('Perfil')}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="account-outline"
            size={24}
            color={COLORES.dorado}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: COLORES.blanco,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.blanco,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORES.blanco,
  },
  errorText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 16,
    color: COLORES.textoMedio,
    fontWeight: '400',
  },

  // BARRA SUPERIOR PERSONALIZADA
  topNavBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  scrollView: {
    flex: 1,
  },

  // GALERÍA DE IMÁGENES
  imageGallerySection: {
    marginTop: 90,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  paginationDots: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  dotActive: {
    width: 24,
    height: 8,
    backgroundColor: COLORES.dorado,
  },

  // MINIATURAS
  thumbnailSection: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  thumbnailList: {
    paddingHorizontal: 10,
  },
  thumbnailWrapper: {
    marginHorizontal: 5,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: COLORES.dorado,
  },
  thumbnailImage: {
    width: 80,
    height: 80,
  },

  // TÍTULO Y PRECIO
  titlePriceSection: {
    paddingHorizontal: 20,
    paddingTop: 25,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleLeft: {
    flex: 1,
  },
  roomCategory: {
    fontFamily: 'montserrat_500medium',
    fontSize: 11,
    color: COLORES.dorado,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: '500',
  },
  roomTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 24,
    color: COLORES.textoOscuro,
    letterSpacing: 0.5,
    lineHeight: 32,
    fontWeight: '700',
  },
  priceBox: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoMedio,
    marginBottom: 4,
    fontWeight: '300',
  },
  priceAmount: {
    fontFamily: 'montserrat_700bold',
    fontSize: 28,
    color: COLORES.textoOscuro,
    lineHeight: 32,
    fontWeight: '700',
  },
  priceUnit: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoMedio,
    fontWeight: '300',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#E8F8F0',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  availableBadgeText: {
    fontFamily: 'montserrat_600semibold',
    fontSize: 12,
    color: '#2ECC71',
    fontWeight: '600',
  },

  // SERVICIOS
  servicesRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  serviceItem: {
    flex: 1,
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceLabel: {
    fontFamily: 'montserrat_400regular',
    fontSize: 11,
    color: '#666666',
    textAlign: 'center',
    fontWeight: '400',
  },

  // DESCRIPCIÓN
  descriptionSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionTitle: {
    fontFamily: 'merriweather_700bold',
    fontSize: 18,
    color: COLORES.textoOscuro,
    marginBottom: 15,
    letterSpacing: 0.5,
    fontWeight: '700',
  },
  descriptionText: {
    fontFamily: 'montserrat_300light',
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    fontWeight: '300',
  },

  // AMENIDADES
  amenitiesSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '47%',
    gap: 8,
  },
  amenityText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 13,
    color: '#666666',
    fontWeight: '400',
  },

  // INFORMACIÓN ADICIONAL
  additionalInfoSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 25,
    gap: 20,
  },
  infoBlock: {
    flex: 1,
    alignItems: 'center',
  },
  infoBlockTitle: {
    fontFamily: 'montserrat_600semibold',
    fontSize: 11,
    color: COLORES.textoMedio,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: '600',
  },
  infoBlockValue: {
    fontFamily: 'merriweather_700bold',
    fontSize: 16,
    color: COLORES.textoOscuro,
    fontWeight: '700',
  },
  infoDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },

  // SECCIÓN DE COMENTARIOS
  commentsSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  commentCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.dorado,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORES.dorado + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInfo: {
    flex: 1,
  },
  commentAuthor: {
    fontFamily: 'montserrat_600semibold',
    fontSize: 14,
    color: COLORES.textoOscuro,
    marginBottom: 4,
    fontWeight: '600',
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 4,
  },
  commentText: {
    fontFamily: 'montserrat_400regular',
    fontSize: 13,
    color: COLORES.textoMedio,
    lineHeight: 18,
    marginBottom: 8,
    fontWeight: '400',
  },
  commentDate: {
    fontFamily: 'montserrat_300light',
    fontSize: 11,
    color: COLORES.textoGris,
    fontWeight: '300',
  },
  commentPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.dorado + '10',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 12,
    marginTop: 8,
  },
  commentPromptText: {
    fontFamily: 'montserrat_500medium',
    fontSize: 13,
    color: COLORES.textoOscuro,
    flex: 1,
    fontWeight: '500',
  },

  // BOTÓN FLOTANTE DE RESERVAR
  reserveButtonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  reserveButton: {
    flexDirection: 'row',
    backgroundColor: COLORES.dorado,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  reserveButtonText: {
    fontFamily: 'montserrat_600semibold',
    fontSize: 16,
    color: COLORES.blanco,
    letterSpacing: 0.5,
    fontWeight: '600',
  },

  // BARRA DE NAVEGACIÓN INFERIOR PERSONALIZADA
  customBottomNav: {
    flexDirection: 'row',
    backgroundColor: COLORES.blanco,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingBottom: 10,
    paddingTop: 10,
    paddingHorizontal: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButtonsContainer: {
    flexDirection: 'row',
    gap: 25,
  },
  navButton: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  navButtonText: {
    fontFamily: 'montserrat_500medium',
    fontSize: 10,
    color: COLORES.textoMedio,
    marginTop: 4,
    letterSpacing: 0.3,
    fontWeight: '500',
  },
  userIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
};

export default DetalleHabitacionScreen;
