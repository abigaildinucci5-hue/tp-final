// frontend/src/componentes/habitaciones/FiltrosHabitaciones.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import Boton from '../comun/Boton';

const FiltrosHabitaciones = ({ onAplicar, onLimpiar, filtrosActuales = {} }) => {
  const [categoria, setCategoria] = useState(filtrosActuales.categoria || null);
  const [capacidad, setCapacidad] = useState(filtrosActuales.capacidad || null);

  const categorias = [
    { id: 'estandar', nombre: 'Estándar' },
    { id: 'deluxe', nombre: 'Deluxe' },
    { id: 'suite', nombre: 'Suite' },
    { id: 'presidencial', nombre: 'Presidencial' },
  ];

  const capacidades = [1, 2, 3, 4, 5];

  const handleAplicar = () => {
    const filtros = {};
    if (categoria) filtros.categoria = categoria;
    if (capacidad) filtros.capacidad = capacidad;
    onAplicar(filtros);
  };

  const handleLimpiar = () => {
    setCategoria(null);
    setCapacidad(null);
    onLimpiar();
  };

  return (
    <View style={estilos.container}>
      {/* Categorías */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Categoría</Text>
        <View style={estilos.opcionesContainer}>
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                estilos.opcionButton,
                categoria === cat.id && estilos.opcionButtonActivo,
              ]}
              onPress={() => setCategoria(cat.id)}
            >
              <Text
                style={[
                  estilos.opcionTexto,
                  categoria === cat.id && estilos.opcionTextoActivo,
                ]}
              >
                {cat.nombre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Capacidad */}
      <View style={estilos.seccion}>
        <Text style={estilos.titulo}>Capacidad</Text>
        <View style={estilos.opcionesContainer}>
          {capacidades.map((cap) => (
            <TouchableOpacity
              key={cap}
              style={[
                estilos.capacidadButton,
                capacidad === cap && estilos.capacidadButtonActivo,
              ]}
              onPress={() => setCapacidad(cap)}
            >
              <MaterialCommunityIcons
                name="account"
                size={20}
                color={capacidad === cap ? COLORES.textoBlanco : COLORES.textoMedio}
              />
              <Text
                style={[
                  estilos.capacidadTexto,
                  capacidad === cap && estilos.capacidadTextoActivo,
                ]}
              >
                {cap}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Botones de acción */}
      <View style={estilos.botonesContainer}>
        <Boton variant="outline" onPress={handleLimpiar} style={estilos.boton}>
          Limpiar
        </Boton>
        <Boton onPress={handleAplicar} style={estilos.boton}>
          Aplicar Filtros
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: DIMENSIONES.padding,
  },
  seccion: {
    marginBottom: 24,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 12,
  },
  opcionesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  opcionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.fondoBlanco,
  },
  opcionButtonActivo: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  opcionTexto: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoOscuro,
  },
  opcionTextoActivo: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  capacidadButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: COLORES.borde,
    backgroundColor: COLORES.fondoBlanco,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  capacidadButtonActivo: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  capacidadTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  capacidadTextoActivo: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  botonesContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  boton: {
    flex: 1,
  },
});

export default FiltrosHabitaciones;