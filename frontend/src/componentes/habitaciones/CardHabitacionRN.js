// frontend/src/componentes/habitaciones/CardHabitacionRN.js
import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const CardHabitacionRN = ({
  habitacion,
  onPress,
  onFavorito,
  esFavorito = false,
}) => {
  const [isFav, setIsFav] = useState(esFavorito);

  const {
    id_habitacion,
    numero_habitacion,
    tipo_habitacion,
    precio_base,
    capacidad_personas,
    estado,
    imagen_principal,
    descripcion,
  } = habitacion;

  const handleFavorito = () => {
    setIsFav(!isFav);
    onFavorito?.(habitacion);
  };

  return (
    <TouchableOpacity
      style={estilos.card}
      onPress={() => onPress?.()}
      activeOpacity={0.85}
    >
      {/* Imagen */}
      <View style={estilos.imageContainer}>
        <Image
          source={{
            uri: imagen_principal || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
          }}
          style={estilos.image}
          resizeMode="cover"
        />

        {/* Badge de estado */}
        <View
          style={[
            estilos.stateBadge,
            estado === 'disponible' && { backgroundColor: '#2ECC71' },
            estado === 'ocupada' && { backgroundColor: '#E74C3C' },
            estado === 'reservada' && { backgroundColor: '#F39C12' },
          ]}
        >
          <Text style={estilos.stateBadgeText}>
            {estado?.charAt(0).toUpperCase() + estado?.slice(1).toLowerCase()}
          </Text>
        </View>

        {/* Botón Favorito */}
        <TouchableOpacity
          style={estilos.favoriteButton}
          onPress={handleFavorito}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? '#EF4444' : COLORES.blanco}
          />
        </TouchableOpacity>
      </View>

      {/* Contenido */}
      <View style={estilos.content}>
        {/* Tipo y número */}
        <View style={estilos.header}>
          <View style={estilos.titleSection}>
            <Text style={estilos.roomType}>{tipo_habitacion}</Text>
            <Text style={estilos.roomNumber}>Habitación {numero_habitacion}</Text>
          </View>
          <View style={estilos.priceSection}>
            <Text style={estilos.priceLabel}>Desde</Text>
            <Text style={estilos.price}>${precio_base}</Text>
            <Text style={estilos.priceUnit}>/noche</Text>
          </View>
        </View>

        {/* Descripción */}
        <Text
          style={estilos.description}
          numberOfLines={2}
        >
          {descripcion || 'Habitación confortable con todas las comodidades'}
        </Text>

        {/* Capacidad */}
        <View style={estilos.footer}>
          <View style={estilos.capacityBadge}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={16}
              color={COLORES.dorado}
            />
            <Text style={estilos.capacityText}>
              {capacidad_personas} {capacidad_personas === 1 ? 'persona' : 'personas'}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: COLORES.blanco,
    borderRadius: 12,
    marginBottom: 16,
    marginHorizontal: 0,
    overflow: 'hidden',
    elevation: 4,
    width: '100%',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  stateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORES.dorado,
  },
  stateBadgeText: {
    color: COLORES.blanco,
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: '600',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleSection: {
    flex: 1,
  },
  roomType: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.dorado,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  roomNumber: {
    fontSize: 16,
    color: COLORES.textoOscuro,
    fontWeight: '700',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 2,
  },
  price: {
    fontSize: 18,
    color: COLORES.textoOscuro,
    fontWeight: '700',
  },
  priceUnit: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  description: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  capacityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORES.dorado + '15',
    borderRadius: 8,
  },
  capacityText: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.dorado,
    fontWeight: '600',
  },
});

export default CardHabitacionRN;
