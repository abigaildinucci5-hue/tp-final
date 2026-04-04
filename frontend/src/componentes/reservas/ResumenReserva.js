// frontend/src/componentes/reservas/ResumenReserva.js
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';
import { formatearFecha, formatearNoches } from '../../utils/fechas';
import { formatearPrecio, formatearEstadoReserva } from '../../utils/formatters';
import { obtenerImagenHabitacion } from '../../constantes/imagenes';

const ResumenReserva = ({ 
  reserva,
  habitacion, 
  fechaInicio, 
  fechaFin, 
  cantidadPersonas, 
  precioTotal,
  userRole = 'cliente'
}) => {
  const mostrarEstado = userRole !== 'cliente';
  const noches = formatearNoches(fechaInicio, fechaFin);

  const imagenUrl = habitacion?.imagen_principal
    ? obtenerImagenHabitacion(habitacion.imagen_principal)
    : null;

  // Función para obtener el color del estado
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

      {/* Estado de la Reserva */}
      {mostrarEstado && reserva?.estado && (
        <View style={estilos.estadoContainer}>
          <View style={[estilos.estadoBadge, { backgroundColor: getEstadoColor(reserva.estado) }]}>
            <MaterialCommunityIcons 
              name={reserva.estado === 'cancelada' ? 'close-circle' : 'check-circle'} 
              size={16} 
              color={COLORES.blanco} 
            />
            <Text style={estilos.estadoTexto}>
              {formatearEstadoReserva(reserva.estado)}
            </Text>
          </View>
        </View>
      )}

      {/* Mensaje para reservas eliminadas */}
      {reserva?.estado === 'eliminada' && userRole === 'cliente' && (
        <View style={estilos.mensajeEliminadoContainer}>
          <MaterialCommunityIcons name="alert-circle" size={20} color={COLORES.error} />
          <Text style={estilos.mensajeEliminado}>
            Tu reserva fue dada de baja. Comunícate con nuestro personal para más información.
          </Text>
        </View>
      )}

      {/* Detalles de Fechas y Horarios */}
      <View style={estilos.detallesContainer}>
        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Check-in</Text>
          <Text style={estilos.detalleValor}>{formatearFecha(fechaInicio)}</Text>
        </View>

        {reserva?.hora_entrada && (
          <View style={estilos.detalleRow}>
            <Text style={estilos.detalleLabel}>Hora de entrada</Text>
            <Text style={estilos.detalleValor}>{reserva.hora_entrada}</Text>
          </View>
        )}

        <View style={estilos.dividerRow} />

        <View style={estilos.detalleRow}>
          <Text style={estilos.detalleLabel}>Check-out</Text>
          <Text style={estilos.detalleValor}>{formatearFecha(fechaFin)}</Text>
        </View>

        {reserva?.hora_salida && (
          <View style={estilos.detalleRow}>
            <Text style={estilos.detalleLabel}>Hora de salida</Text>
            <Text style={estilos.detalleValor}>{reserva.hora_salida}</Text>
          </View>
        )}

        <View style={estilos.dividerRow} />

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

      {/* Notas Especiales (Descripción/Requerimientos) */}
      {reserva?.notas_especiales && (
        <View style={estilos.notasContainer}>
          <View style={estilos.notasHeader}>
            <MaterialCommunityIcons 
              name="note-text-outline" 
              size={18} 
              color={COLORES.primario} 
            />
            <Text style={estilos.notasTitulo}>Notas Especiales</Text>
          </View>
          <Text style={estilos.notasTexto}>{reserva.notas_especiales}</Text>
        </View>
      )}

      {/* Precios */}
      <View style={estilos.preciosContainer}>
        <Text style={estilos.preciosTitulo}>Desglose de precios</Text>

        {/* Precio por noche calculado */}
        <View style={estilos.precioRow}>
          <Text style={estilos.precioLabel}>
            Precio por noche ({parseInt(noches)})
          </Text>
          <Text style={estilos.precioValor}>
            {formatearPrecio((precioTotal - (reserva?.descuento_aplicado || 0)) / parseInt(noches))} x {parseInt(noches)}
          </Text>
        </View>

        {/* Subtotal */}
        <View style={estilos.precioRow}>
          <Text style={estilos.precioLabel}>Subtotal</Text>
          <Text style={estilos.precioValor}>
            {formatearPrecio(precioTotal - (reserva?.descuento_aplicado || 0))}
          </Text>
        </View>

        {reserva?.descuento_aplicado > 0 && (
          <>
            <View style={estilos.precioRow}>
              <Text style={[estilos.precioLabel, { color: COLORES.exito }]}>
                Descuento aplicado
              </Text>
              <Text style={[estilos.precioValor, { color: COLORES.exito }]}>
                -{formatearPrecio(reserva.descuento_aplicado)}
              </Text>
            </View>
          </>
        )}

        <View style={estilos.divisor} />

        <View style={estilos.precioRow}>
          <Text style={estilos.totalLabel}>Total</Text>
          <Text style={estilos.totalValor}>{formatearPrecio(precioTotal)}</Text>
        </View>

        {/* Estado de pago */}
        <View style={estilos.estadoPagoContainer}>
          <MaterialCommunityIcons 
            name="check-circle" 
            size={16} 
            color={COLORES.exito} 
          />
          <Text style={[estilos.detalleValor, { color: COLORES.exito, marginLeft: 8 }]}>
            Pago registrado
          </Text>
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
  estadoContainer: {
    padding: DIMENSIONES.padding,
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  estadoTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.blanco,
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
  dividerRow: {
    height: 1,
    backgroundColor: COLORES.borde,
    marginVertical: 8,
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
  notasContainer: {
    padding: DIMENSIONES.padding,
    backgroundColor: 'rgba(255, 193, 7, 0.08)',
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
    marginHorizontal: DIMENSIONES.padding,
    marginTop: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadiusSmall,
  },
  notasHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  notasTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  notasTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoOscuro,
    lineHeight: 20,
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
  estadoPagoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
  mensajeEliminadoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.error + '15',
    borderRadius: DIMENSIONES.borderRadius,
    marginVertical: DIMENSIONES.padding,
    gap: 12,
  },
  mensajeEliminado: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.error,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    flex: 1,
  },
});

export default ResumenReserva;