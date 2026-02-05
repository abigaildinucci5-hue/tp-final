// frontend/src/componentes/habitaciones/DetalleHabitacion.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { formatearPrecio, formatearCapacidad } from '../../utils/formatters';

const DetalleHabitacion = ({ habitacion }) => {
  const servicios = [
    { icono: 'wifi', nombre: 'WiFi gratuito' },
    { icono: 'television', nombre: 'TV HD' },
    { icono: 'snowflake', nombre: 'Aire acondicionado' },
    { icono: 'cube', nombre: 'Minibar' },
    { icono: 'shield-check', nombre: 'Caja fuerte' },
  ];

  return (
    <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
      {/* Descripción */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Descripción</Text>
        <Text style={estilos.descripcion}>{habitacion.descripcion}</Text>
      </View>

      {/* Información básica */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Información</Text>
        
        <View style={estilos.infoRow}>
          <MaterialCommunityIcons name="account-group" size={20} color={COLORES.primario} />
          <Text style={estilos.infoTexto}>
            Capacidad: {formatearCapacidad(habitacion.capacidad)}
          </Text>
        </View>

        <View style={estilos.infoRow}>
          <MaterialCommunityIcons name="bed" size={20} color={COLORES.primario} />
          <Text style={estilos.infoTexto}>
            {habitacion.numero_camas} cama(s)
          </Text>
        </View>

        <View style={estilos.infoRow}>
          <MaterialCommunityIcons name="resize" size={20} color={COLORES.primario} />
          <Text style={estilos.infoTexto}>
            {habitacion.tamaño_m2} m²
          </Text>
        </View>
      </View>

      {/* Servicios */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Servicios</Text>
        <View style={estilos.serviciosContainer}>
          {servicios.map((servicio, index) => (
            <View key={index} style={estilos.servicioItem}>
              <View style={estilos.servicioIcono}>
                <MaterialCommunityIcons
                  name={servicio.icono}
                  size={24}
                  color={COLORES.primario}
                />
              </View>
              <Text style={estilos.servicioTexto}>{servicio.nombre}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Precio */}
      <View style={estilos.precioContainer}>
        <View>
          <Text style={estilos.precioLabel}>Precio por noche</Text>
          <Text style={estilos.precio}>
            {formatearPrecio(habitacion.precio_noche)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  seccion: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: DIMENSIONES.paddingLarge,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.borde,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
  },
  descripcion: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoMedio,
    lineHeight: TIPOGRAFIA.lineHeightMedium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  infoTexto: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoOscuro,
  },
  serviciosContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  servicioItem: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicioIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicioTexto: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoOscuro,
  },
  precioContainer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoGris,
  },
  precioLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  precio: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
    marginTop: 4,
  },
});

export default DetalleHabitacion;