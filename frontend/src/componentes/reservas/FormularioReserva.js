// frontend/src/componentes/reservas/FormularioReserva.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import { formatearFecha } from '../../utils/fechas';
import Boton from '../comun/Boton';

const FormularioReserva = ({
  fechaInicio,
  fechaFin,
  cantidadPersonas,
  onCambiarFechaInicio,
  onCambiarFechaFin,
  onCambiarCantidadPersonas,
  onBuscar,
  loading = false,
}) => {
  return (
    <View style={estilos.container}>
      
      {/* Fecha de entrada */}
      <TouchableOpacity style={estilos.campo} onPress={onCambiarFechaInicio}>
        <View style={estilos.campoInfo}>
          <Text style={estilos.campoLabel}>Fecha de entrada</Text>
          <Text style={estilos.campoValor}>
            {fechaInicio ? formatearFecha(fechaInicio) : 'Seleccionar fecha'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Fecha de salida */}
      <TouchableOpacity style={estilos.campo} onPress={onCambiarFechaFin}>
        <View style={estilos.campoInfo}>
          <Text style={estilos.campoLabel}>Fecha de salida</Text>
          <Text style={estilos.campoValor}>
            {fechaFin ? formatearFecha(fechaFin) : 'Seleccionar fecha'}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Cantidad de personas */}
      <View style={estilos.campo}>
        <View style={estilos.campoInfo}>
          <Text style={estilos.campoLabel}>Cantidad de personas</Text>

          <View style={estilos.contadorContainer}>
            <TouchableOpacity
              style={estilos.contadorBoton}
              onPress={() =>
                cantidadPersonas > 1 &&
                onCambiarCantidadPersonas(cantidadPersonas - 1)
              }
            >
              <Text style={estilos.contadorTexto}>-</Text>
            </TouchableOpacity>

            <Text style={estilos.contadorValor}>{cantidadPersonas}</Text>

            <TouchableOpacity
              style={estilos.contadorBoton}
              onPress={() =>
                onCambiarCantidadPersonas(cantidadPersonas + 1)
              }
            >
              <Text style={estilos.contadorTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botón de búsqueda */}
      <Boton
        onPress={onBuscar}
        loading={loading}
        disabled={!fechaInicio || !fechaFin}
        fullWidth
      >
        Buscar Habitaciones Disponibles
      </Boton>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: DIMENSIONES.padding,
    gap: 12,
  },
  campo: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  campoInfo: {
    flex: 1,
  },
  campoLabel: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 2,
  },
  campoValor: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoOscuro,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
  },
  contadorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  contadorBoton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contadorTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORES.primario,
  },
  contadorValor: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    minWidth: 30,
    textAlign: 'center',
  },
});

export default FormularioReserva;