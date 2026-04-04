// frontend/src/componentes/habitaciones/CardHabitacionRN.js
import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA } from '../../constantes/estilos';

const CardHabitacionRN = ({
  habitacion,
  onPress,
  onFavorito,
  esFavorito = false,
}) => {
  const [isFav, setIsFav] = useState(esFavorito);

  const {
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

  const imagenUrl =
    imagen_principal ||
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop';

  return (
    <TouchableOpacity
      style={estilos.card}
      onPress={() => onPress?.()}
      activeOpacity={0.85}
    >
      <View style={estilos.imageContainer}>
        <Image
          source={{ uri: imagenUrl }}
          style={estilos.image}
          resizeMode="cover"
        />

        <View
          style={[
            estilos.stateBadge,
            estado === 'disponible' && { backgroundColor: '#2ECC71' },
            estado === 'ocupada' && { backgroundColor: '#E74C3C' },
            estado === 'reservada' && { backgroundColor: '#F39C12' },
          ]}
        >
          <Text style={estilos.stateBadgeText}>{estado?.toUpperCase()}</Text>
        </View>

        <TouchableOpacity style={estilos.favoriteButton} onPress={handleFavorito}>
          <MaterialCommunityIcons
            name={isFav ? 'heart' : 'heart-outline'}
            size={24}
            color={isFav ? '#EF4444' : COLORES.blanco}
          />
        </TouchableOpacity>
      </View>

      <View style={estilos.content}>
        <View style={estilos.header}>
          {/* ✅ flex:1 con minWidth:0 para que el texto no desborde */}
          <View style={estilos.infoLeft}>
            <Text style={estilos.roomType} numberOfLines={1}>
              {tipo_habitacion}
            </Text>
            <Text style={estilos.roomNumber} numberOfLines={1}>
              Habitación {numero_habitacion}
            </Text>
          </View>

          <View style={estilos.priceSection}>
            <Text style={estilos.priceLabel}>Desde</Text>
            <Text style={estilos.price}>
              ${Number(precio_base ?? 0).toFixed(2)}
            </Text>
            <Text style={estilos.priceUnit}>/noche</Text>
          </View>
        </View>

        <Text style={estilos.description} numberOfLines={2}>
          {descripcion || 'Habitación confortable con todas las comodidades'}
        </Text>

        <View style={estilos.footer}>
          <View style={estilos.capacityBadge}>
            <MaterialCommunityIcons
              name="account-multiple"
              size={16}
              color={COLORES.dorado}
            />
            <Text style={estilos.capacityText}>
              {capacidad_personas}{' '}
              {capacidad_personas === 1 ? 'persona' : 'personas'}
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
    marginBottom: 20,
    // ✅ width: '100%' en lugar de SCREEN_WIDTH - 32
    // El contenedor padre (ListaHabitaciones) ya maneja el ancho
    width: '100%',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  imageContainer: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  stateBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  stateBadgeText: {
    color: COLORES.blanco,
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  // ✅ minWidth: 0 es clave para evitar que el texto empuje al precio fuera de pantalla
  infoLeft: {
    flex: 1,
    minWidth: 0,
    marginRight: 12,
  },
  roomType: {
    fontSize: 12,
    color: COLORES.textoMedio,
    textTransform: 'uppercase',
  },
  roomNumber: {
    fontSize: 18,
    color: COLORES.textoOscuro,
    fontWeight: '700',
    marginTop: 2,
  },
  priceSection: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORES.textoMedio,
  },
  price: {
    fontSize: 22,
    color: COLORES.textoOscuro,
    fontWeight: '700',
    lineHeight: 30,
  },
  priceUnit: {
    fontSize: 12,
    color: COLORES.textoMedio,
  },
  description: {
    fontSize: 14,
    color: COLORES.textoMedio,
    lineHeight: 20,
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
    fontSize: 12,
    color: COLORES.dorado,
    fontWeight: '600',
  },
});

export default CardHabitacionRN;