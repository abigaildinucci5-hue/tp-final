// frontend/src/componentes/habitaciones/CarruselHabitaciones.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { formatearPrecio } from '../../utils/formatters';

const { width } = Dimensions.get('window');
// Reducir tamaño de la tarjeta a ~50% en pantallas grandes
const CARD_WIDTH = Math.round(width * 0.45);
const CARD_HEIGHT = 220;

/**
 * Componente CarruselHabitaciones
 * Muestra un carrusel horizontal de habitaciones
 * 
 * @param {Array} habitaciones - Lista de habitaciones
 * @param {boolean} loading - Si está cargando
 * @param {Function} onHabitacionPress - Callback al seleccionar una habitación
 * @param {number} maxCards - Número máximo de tarjetas a mostrar
 */
const CarruselHabitaciones = ({
  habitaciones = [],
  loading = false,
  onHabitacionPress,
  maxCards = 6,
}) => {
  const habitacionesValidas = Array.isArray(habitaciones) ? habitaciones : [];
  const habitacionesLimitadas = habitacionesValidas.slice(0, maxCards);

  const renderCard = ({ item, index }) => (
    <TouchableOpacity
      style={[
        estilos.card,
        {
          marginLeft: index === 0 ? DIMENSIONES.padding : 8,
          marginRight:
            index === habitacionesLimitadas.length - 1 ? DIMENSIONES.padding : 8,
        },
      ]}
      onPress={() => onHabitacionPress?.(item)}
      activeOpacity={0.85}
    >
      {/* Carrusel interno de imágenes (soporta item.imagenes o item.imagen) */}
      <View style={estilos.imageContainer}>
        <FlatList
          data={Array.isArray(item.imagenes) && item.imagenes.length ? item.imagenes : item.imagen ? [item.imagen] : []}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(img, i) => `img-${i}`}
          renderItem={({ item: img }) => (
            <Image source={{ uri: img }} style={estilos.image} resizeMode="cover" />
          )}
        />

        {/* Badge de disponibilidad */}
        {item.estado && (
          <View
            style={[
              estilos.badge,
              {
                backgroundColor:
                  item.estado.toLowerCase() === 'disponible'
                    ? COLORES.exito
                    : COLORES.error,
              },
            ]}
          >
            <Text style={estilos.badgeText}>{item.estado}</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View style={estilos.cardContent}>
        {/* Tipo y nombre */}
        <View style={estilos.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={estilos.tipo} numberOfLines={1}>
              {item.tipo}
            </Text>
            <Text style={estilos.nombre} numberOfLines={1}>
              Habitación {item.numero}
            </Text>
          </View>
        </View>

        {/* Descripción breve */}
        {item.descripcion && (
          <Text style={estilos.descripcion} numberOfLines={2}>
            {item.descripcion}
          </Text>
        )}

        {/* Info rápida */}
        <View style={estilos.infoRow}>
          <View style={estilos.infoItem}>
            <MaterialCommunityIcons
              name="account-group"
              size={14}
              color={COLORES.primario}
            />
            <Text style={estilos.infoText}>{item.capacidad || '2'} pers.</Text>
          </View>
          {item.tamaño_m2 && (
            <View style={estilos.infoItem}>
              <MaterialCommunityIcons
                name="resize"
                size={14}
                color={COLORES.primario}
              />
              <Text style={estilos.infoText}>{item.tamaño_m2}m²</Text>
            </View>
          )}
        </View>

        {/* Precio */}
        <View style={estilos.priceRow}>
          <View>
            <Text style={estilos.priceLabel}>Por noche</Text>
            <Text style={estilos.price}>
              {formatearPrecio(item.precio_noche || item.precio)}
            </Text>
          </View>
          <TouchableOpacity
            style={estilos.ctaButton}
            onPress={() => onHabitacionPress?.(item)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color={COLORES.fondoBlanco}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={estilos.loadingContainer}>
        <ActivityIndicator size="large" color={COLORES.primario} />
      </View>
    );
  }

  if (habitacionesLimitadas.length === 0) {
    return (
      <View style={estilos.emptyContainer}>
        <MaterialCommunityIcons
          name="bed-empty"
          size={48}
          color={COLORES.textoGris}
        />
        <Text style={estilos.emptyText}>No hay habitaciones disponibles</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={habitacionesLimitadas}
      renderItem={renderCard}
      keyExtractor={(item) => `carrusel-${item.id || Math.random()}`}
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      snapToAlignment="start"
      decelerationRate="fast"
      snapToInterval={CARD_WIDTH + 16}
      contentContainerStyle={estilos.flatListContent}
    />
  );
};

const estilos = StyleSheet.create({
  flatListContent: {
    paddingVertical: 0,
  },
  loadingContainer: {
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONES.padding,
  },
  emptyContainer: {
    height: CARD_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONES.padding,
  },
  emptyText: {
    marginTop: 12,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoGris,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: '45%',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: COLORES.fondoGris,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.fondoBlanco,
  },
  cardContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipo: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginTop: 2,
  },
  descripcion: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoGris,
    marginBottom: 8,
    lineHeight: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: COLORES.bordeGris,
    paddingTop: 10,
  },
  priceLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoGris,
  },
  price: {
    fontSize: TIPOGRAFIA.fontSizeHeading,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginTop: 4,
  },
  ctaButton: {
    backgroundColor: COLORES.primario,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CarruselHabitaciones;
