// frontend/src/pantallas/reservas/ConfirmarReservaScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useReservas } from '../../hooks/useReservas';
import { METODOS_PAGO } from '../../constantes/config';
import HeaderApp from '../../componentes/comun/HeaderApp';
import ResumenReserva from '../../componentes/reservas/ResumenReserva';
import Boton from '../../componentes/comun/Boton';
import ErrorMensaje from '../../componentes/comun/ErrorMensaje';

const ConfirmarReservaScreen = ({ navigation, route }) => {
  const { habitacion, fechaInicio, fechaFin, cantidadPersonas, precioTotal } = route.params;
  const { crearReserva, loading } = useReservas();
  
  const [metodoPago, setMetodoPago] = useState(null);
  const [error, setError] = useState(null);

 const handleConfirmar = async () => {
    // 1. Validación inicial
    if (!metodoPago) {
      setError('Por favor selecciona un método de pago');
      return;
    }

    // 2. Preparamos los datos EXACTAMENTE como los pide el controlador del backend
    const reservaData = {
      idHabitacion: habitacion.id_habitacion || habitacion.id,
      fechaEntrada: fechaInicio,
      fechaSalida: fechaFin,
      numeroHuespedes: cantidadPersonas,
      notasEspeciales: '' // El backend lo desestructura pero no lo valida como requerido
    };

    console.log("Enviando al backend:", reservaData);

    try {
      const result = await crearReserva(reservaData);
      
      if (result && result.success) {
        // El backend devuelve { exito: true, data: { id_reserva: ... } }
        const reservaFinal = result.data;
        navigation.navigate('ReservaExitosa', { reserva: reservaFinal });
      } else {
        // Si el backend responde 400 o 500
        const msgError = result.error?.mensaje || result.error || 'Error en la reserva';
        setError(msgError);
      }
    } catch (err) {
      console.error("Error crítico:", err);
      setError("Error de conexión con el servidor");
    }

    try {
      // 3. Llamada al servicio
      const result = await crearReserva(reservaData);
      
      console.log("Respuesta recibida del server:", result);

      if (result && result.success) {
        // Extraemos la data según el formato de tu backend
        const reservaFinal = result.data?.data || result.data;
        navigation.navigate('ReservaExitosa', { reserva: reservaFinal });
      } else {
        // Manejo de error cuando el backend responde pero algo salió mal
        const msgError = result.error?.mensaje || result.error || 'Error en la reserva';
        setError(msgError);
      }
    } catch (err) {
      // Manejo de error cuando el servidor no responde o hay crash
      console.error("Error crítico en la comunicación:", err);
      setError("No se pudo conectar con el servidor. Revisa tu conexión.");
    }
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Confirmar Reserva"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
        variant="transparent"
      />

      <ScrollView style={estilos.scrollView}>
        <ResumenReserva
          habitacion={habitacion}
          fechaInicio={fechaInicio}
          fechaFin={fechaFin}
          cantidadPersonas={cantidadPersonas}
          precioTotal={precioTotal}
        />

        <View style={estilos.metodoPagoContainer}>
          <Text style={estilos.titulo}>Método de Pago</Text>
          {METODOS_PAGO.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                estilos.metodoCard,
                metodoPago === metodo.id && estilos.metodoCardSeleccionado,
              ]}
              onPress={() => {
                setMetodoPago(metodo.id);
                setError(null);
              }}
            >
              <MaterialCommunityIcons
                name={metodoPago === metodo.id ? 'radiobox-marked' : 'radiobox-blank'}
                size={24}
                color={metodoPago === metodo.id ? COLORES.primario : COLORES.textoMedio}
              />
              <Text style={estilos.metodoNombre}>{metodo.nombre}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={estilos.errorContainer}>
            <ErrorMensaje mensaje={error} tipo="error" />
          </View>
        )}
      </ScrollView>

      <View style={estilos.footer}>
        <Boton onPress={handleConfirmar} loading={loading} fullWidth>
          Confirmar y Pagar
        </Boton>
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  metodoPagoContainer: {
    padding: DIMENSIONES.padding,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  metodoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    gap: 12,
    borderWidth: 2,
    borderColor: COLORES.borde,
  },
  metodoCardSeleccionado: {
    borderColor: COLORES.primario,
    backgroundColor: COLORES.primario + '10',
  },
  metodoNombre: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoOscuro,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
  },
  errorContainer: {
    padding: DIMENSIONES.padding,
  },
  footer: {
    padding: DIMENSIONES.padding,
    backgroundColor: COLORES.fondoBlanco,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
  },
});

export default ConfirmarReservaScreen;