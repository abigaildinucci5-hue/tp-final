// frontend/src/componentes/reservas/ResumenReserva.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { formatearFecha, calcularNoches } from '../../utils/fechas';
import { formatearPrecio } from '../../utils/formatters';
import { obtenerImagenHabitacion } from '../../constantes/imagenes';

const ResumenReserva = ({ habitacion, fechaInicio, fechaFin, cantidadPersonas, precioTotal }) => {
  const noches = calcularNoches(fechaInicio, fechaFin);

  const imagenUrl = habitacion?.imagen_principal
    ? obtenerImagenHabitacion(habitacion.imagen_principal)
    : null;

  return (
    <View style={estilos.container}>
      
      {/* Información de la habitación */}
      <View style={estilos.habitacionContainer}>
        <Image
          source={
            imagenUrl
              ? { uri: imagenUrl }
              : require('../../assets/images/placeholder-habitacion.png')
          }
          style={estilos.imagen}
        />

        <View style={estilos.habitacionInfo}>
          <Text style={estilos.habitacionNombre}>{habitacion?.nombre}</Text>
          <Text style={estilos.habitacionCategoria}>{habitacion?.categoria}</Text>
        </View>
      </View>

      {/* Detalles */}
      <View style={estilos.detallesContainer}>
        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Check-in</Text>
          <Text style={estilos.detalleValor}>{formatearFecha(fechaInicio)}</Text>
        </View>

        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Check-out</Text>
          <Text style={estilos.detalleValor}>{formatearFecha(fechaFin)}</Text>
        </View>

        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Duración</Text>
          <Text style={estilos.detalleValor}>{noches}</Text>
        </View>

        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Huéspedes</Text>
          <Text style={estilos.detalleValor}>
            {cantidadPersonas} {cantidadPersonas === 1 ? 'persona' : 'personas'}
          </Text>
        </View>
      </View>

      {/* Precios */}
      <View style={estilos.preciosContainer}>
        <Text style={estilos.preciosTitulo}>Desglose de precios</Text>

        <View style={estilos.precioRow}>
          <Text style={estilos.precioLabel}>
            {formatearPrecio(habitacion?.precio_noche)} x {parseInt(noches)}{' '}
            {parseInt(noches) === 1 ? 'noche' : 'noches'}
          </Text>
          <Text style={estilos.precioValor}>
            {formatearPrecio(habitacion?.precio_noche * parseInt(noches))}
          </Text>
        </View>

        <View style={estilos.divisor} />

        <View style={estilos.precioRow}>
          <Text style={estilos.totalLabel}>Total</Text>
          <Text style={estilos.totalValor}>{formatearPrecio(precioTotal)}</Text>
        </View>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    ...SOMBRAS.medium,
  },
  habitacionContainer: {
    flexDirection: 'row',
    padding: DIMENSIONES.padding,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  imagen: {
    width: 80,
    height: 80,
    borderRadius: DIMENSIONES.borderRadiusSmall,
  },
  habitacionInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  habitacionNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  habitacionCategoria: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  detallesContainer: {
    padding: DIMENSIONES.padding,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  detalleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detalleLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  detalleValor: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
  preciosContainer: {
    padding: DIMENSIONES.padding,
  },
  preciosTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
  },
  precioRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  precioLabel: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
  },
  precioValor: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoOscuro,
  },
  divisor: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  totalValor: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
});

export default ResumenReserva;