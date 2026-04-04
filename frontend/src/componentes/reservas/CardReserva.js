// frontend/src/componentes/reservas/CardReserva.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { formatearFecha, formatearNoches } from '../../utils/fechas';
import { formatearPrecio, formatearEstadoReserva } from '../../utils/formatters';
import { obtenerImagenHabitacion } from '../../constantes/imagenes';

const CardReserva = ({ reserva, onPress, userRole = 'cliente' }) => {
  const mostrarEstado = userRole !== 'cliente';

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'pendiente':
        return COLORES.advertencia;
      case 'confirmada':
        return COLORES.exito;
      case 'en_curso':
        return COLORES.info;
      case 'completada':
        return COLORES.textoMedio;
      case 'cancelada':
        return COLORES.error;
      default:
        return COLORES.textoMedio;
    }
  };

  const imagenUrl = reserva.imagen_principal
    ? obtenerImagenHabitacion(reserva.imagen_principal)
    : null;

  const noches = formatearNoches(reserva.fecha_entrada, reserva.fecha_salida);

  return (
    <TouchableOpacity style={estilos.card} onPress={onPress} activeOpacity={0.8} disabled={reserva.estado === 'eliminada'}>
      <View style={estilos.row}>
        {/* Imagen */}
        <Image
          source={imagenUrl ? { uri: imagenUrl } : require('../../assets/images/placeholder-habitacion.png')}
          style={[estilos.imagen, reserva.estado === 'eliminada' && { opacity: 0.5 }]}
        />

        {/* Información */}
        <View style={estilos.infoContainer}>
          <View style={estilos.headerRow}>
            <Text style={estilos.habitacionNombre} numberOfLines={1}>
              {reserva.tipo_habitacion || 'Habitación'} #{reserva.numero_habitacion}
            </Text>
            {mostrarEstado && (
              <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(reserva.estado) }]}>
                <Text style={estilos.estadoTexto}>
                  {formatearEstadoReserva(reserva.estado)}
                </Text>
              </View>
            )}
          </View>

          <View style={estilos.detalle}>
            <MaterialCommunityIcons name="calendar-outline" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>
              {formatearFecha(reserva.fecha_entrada)} - {formatearFecha(reserva.fecha_salida)}
            </Text>
          </View>

          <View style={estilos.detalle}>
            <MaterialCommunityIcons name="weather-night" size={16} color={COLORES.textoMedio} />
            <Text style={estilos.detalleTexto}>{noches}</Text>
          </View>

          {reserva.estado === 'eliminada' && userRole === 'cliente' ? (
            <Text style={estilos.mensajeEliminada}>
              ⚠️ Tu reserva fue dada de baja. Comunícate con nuestro personal.
            </Text>
          ) : (
            <Text style={estilos.precio}>{formatearPrecio(reserva.precio_total)}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const estilos = StyleSheet.create({
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.margin,
    ...SOMBRAS.medium,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: DIMENSIONES.borderRadiusSmall,
  },
  infoContainer: {
    flex: 1,
    gap: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  habitacionNombre: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  estadoBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  estadoTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoBlanco,
  },
  detalle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detalleTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  precio: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginTop: 4,
  },
  mensajeEliminada: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default CardReserva;