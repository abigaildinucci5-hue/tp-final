// frontend/src/componentes/habitaciones/FiltrosRapidos.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

/**
 * Componente FiltrosRapidos
 * Filtros horizontales para seleccionar tipo de habitación
 * 
 * @param {Array} opciones - Array de opciones { label, icon, value }
 * @param {string} seleccionado - Opción seleccionada
 * @param {Function} onSelect - Callback cuando se selecciona un filtro
 */
const FiltrosRapidos = ({
  opciones = [],
  seleccionado = null,
  onSelect,
}) => {
  const opcionesDefault = [
    { label: 'Todas', icon: 'home-outline', value: 'todas' },
    { label: 'Estándar', icon: 'bed-single-outline', value: 'standar' },
    { label: 'Doble', icon: 'bed-double-outline', value: 'doble' },
    { label: 'Suite', icon: 'crown-outline', value: 'suite' },
    { label: 'Lujo', icon: 'star-outline', value: 'lujo' },
  ];

  const filtros = opciones.length > 0 ? opciones : opcionesDefault;

  return (
    <View style={estilos.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={estilos.scrollContent}
      >
        {filtros.map((filtro, index) => (
          <TouchableOpacity
            key={`filtro-${filtro.value || index}`}
            style={[
              estilos.filterButton,
              seleccionado === filtro.value && estilos.filterButtonActive,
              {
                marginLeft: index === 0 ? DIMENSIONES.padding : 8,
                marginRight:
                  index === filtros.length - 1 ? DIMENSIONES.padding : 8,
              },
            ]}
            onPress={() => onSelect?.(filtro.value)}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name={filtro.icon}
              size={20}
              color={
                seleccionado === filtro.value
                  ? COLORES.fondoBlanco
                  : COLORES.primario
              }
            />
            <Text
              style={[
                estilos.filterLabel,
                seleccionado === filtro.value && estilos.filterLabelActive,
              ]}
            >
              {filtro.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: COLORES.fondoBlanco,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.bordeGris,
  },
  scrollContent: {
    alignItems: 'center',
    paddingVertical: 0,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORES.fondoGris,
    borderWidth: 1,
    borderColor: COLORES.bordeGris,
  },
  filterButtonActive: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  filterLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoMedio,
  },
  filterLabelActive: {
    color: COLORES.fondoBlanco,
  },
});

export default FiltrosRapidos;
