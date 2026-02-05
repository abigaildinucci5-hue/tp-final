// frontend/src/componentes/reservas/CalendarioReserva.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { obtenerNombreMes, obtenerRangoMes } from '../../utils/fechas';

const CalendarioReserva = ({ onSeleccionarFecha, fechaInicio, fechaFin }) => {
  const [mesActual, setMesActual] = useState(new Date());
  
  const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const cambiarMes = (direccion) => {
    const nuevaFecha = new Date(mesActual);
    nuevaFecha.setMonth(mesActual.getMonth() + direccion);
    setMesActual(nuevaFecha);
  };

  const renderDias = () => {
    const año = mesActual.getFullYear();
    const mes = mesActual.getMonth();
    const rango = obtenerRangoMes(año, mes);
    const primerDia = rango.inicio.getDay();
    
    const dias = [];
    
    // Espacios vacíos al inicio
    for (let i = 0; i < primerDia; i++) {
      dias.push(<View key={`empty-${i}`} style={estilos.diaVacio} />);
    }
    
    // Días del mes
    for (let dia = 1; dia <= rango.dias; dia++) {
      const fecha = new Date(año, mes, dia);
      const esHoy = fecha.toDateString() === new Date().toDateString();
      const esSeleccionado = 
        (fechaInicio && fecha.toDateString() === new Date(fechaInicio).toDateString()) ||
        (fechaFin && fecha.toDateString() === new Date(fechaFin).toDateString());
      const esPasado = fecha < new Date().setHours(0, 0, 0, 0);
      
      dias.push(
        <TouchableOpacity
          key={dia}
          style={[
            estilos.dia,
            esHoy && estilos.diaHoy,
            esSeleccionado && estilos.diaSeleccionado,
            esPasado && estilos.diaPasado,
          ]}
          onPress={() => !esPasado && onSeleccionarFecha(fecha)}
          disabled={esPasado}
        >
          <Text
            style={[
              estilos.diaTexto,
              esSeleccionado && estilos.diaTextoSeleccionado,
              esPasado && estilos.diaTextoPasado,
            ]}
          >
            {dia}
          </Text>
        </TouchableOpacity>
      );
    }
    
    return dias;
  };

  return (
    <View style={estilos.container}>
      {/* Header del mes */}
      <View style={estilos.header}>
        <TouchableOpacity onPress={() => cambiarMes(-1)}>
          <MaterialCommunityIcons name="chevron-left" size={24} color={COLORES.primario} />
        </TouchableOpacity>
        
        <Text style={estilos.mesTexto}>
          {obtenerNombreMes(mesActual)} {mesActual.getFullYear()}
        </Text>
        
        <TouchableOpacity onPress={() => cambiarMes(1)}>
          <MaterialCommunityIcons name="chevron-right" size={24} color={COLORES.primario} />
        </TouchableOpacity>
      </View>

      {/* Días de la semana */}
      <View style={estilos.diasSemanaContainer}>
        {diasSemana.map((dia, index) => (
          <Text key={index} style={estilos.diaSemanaTexto}>
            {dia}
          </Text>
        ))}
      </View>

      {/* Días del mes */}
      <View style={estilos.diasContainer}>{renderDias()}</View>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  mesTexto: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  diasSemanaContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  diaSemanaTexto: {
    flex: 1,
    textAlign: 'center',
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoMedio,
  },
  diasContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dia: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  diaVacio: {
    width: '14.28%',
    aspectRatio: 1,
  },
  diaHoy: {
    borderWidth: 1,
    borderColor: COLORES.primario,
    borderRadius: 20,
  },
  diaSeleccionado: {
    backgroundColor: COLORES.primario,
    borderRadius: 20,
  },
  diaPasado: {
    opacity: 0.3,
  },
  diaTexto: {
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoOscuro,
  },
  diaTextoSeleccionado: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  diaTextoPasado: {
    color: COLORES.textoClaro,
  },
});

export default CalendarioReserva;