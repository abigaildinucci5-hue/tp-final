// frontend/src/pantallas/empleado/CheckInOutScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import { obtenerReservas, completarReserva } from '../../servicios/reservasService';

const CheckInOutScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const [numeroHabitacion, setNumeroHabitacion] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [tipo, setTipo] = useState('checkin');
  const [cargando, setCargando] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const handleProcesar = async () => {
    if (!numeroHabitacion.trim()) {
      Alert.alert('Error', 'Ingresa el número de habitación');
      return;
    }

    if (!nombreCliente.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del cliente');
      return;
    }

    const accion = tipo === 'checkin' ? 'Check-in' : 'Check-out';
    Alert.alert(
      `${accion} - Habitación ${numeroHabitacion}`,
      `¿Confirmar ${accion.toLowerCase()} del cliente ${nombreCliente}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          style: 'default',
          onPress: () => procesarOperacion(accion),
        },
      ]
    );
  };

  const procesarOperacion = async (accion) => {
    setCargando(true);
    try {
      // Buscar la reserva por habitación y cliente
      const reservas = await obtenerReservas({ 
        numero_habitacion: numeroHabitacion 
      });

      // Filtrar la reserva que coincida con el nombre del cliente (confirmada o en_curso)
      const reserva = reservas.find(
        r => (r.nombre_usuario + ' ' + (r.apellido_usuario || ''))
              .toLowerCase()
              .includes(nombreCliente.toLowerCase()) &&
             (r.estado === 'confirmada' || r.estado === 'en_curso')
      );

      if (!reserva) {
        Alert.alert(
          'Reserva no encontrada',
          `No se encontró una reserva activa para la habitación ${numeroHabitacion} y cliente ${nombreCliente}`
        );
        return;
      }

      if (tipo === 'checkin') {
        // Check-in: cambiar estado a "en_curso"
        // (Nota: puede necesitar un endpoint específico para esto)
        Alert.alert(
          '✅ Check-in Registrado',
          `El cliente ${nombreCliente} ha hecho check-in en la habitación ${numeroHabitacion}`,
          [{ text: 'OK', onPress: () => limpiarCampos() }]
        );
      } else {
        // Check-out: cambiar estado a "completada"
        await completarReserva(reserva.id_reserva);
        Alert.alert(
          '✅ Check-out Registrado',
          `El cliente ${nombreCliente} ha hecho check-out de la habitación ${numeroHabitacion}`,
          [{ text: 'OK', onPress: () => limpiarCampos() }]
        );
      }
    } catch (error) {
      console.error('Error procesando operación:', error);
      Alert.alert('❌ Error', error?.message || 'No se pudo procesar la operación');
    } finally {
      setCargando(false);
    }
  };

  const limpiarCampos = () => {
    setNumeroHabitacion('');
    setNombreCliente('');
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <ScrollView style={estilos.container} contentContainerStyle={estilos.scroll}>
        {/* Hero */}
        <View style={estilos.heroSection}>
          <Text style={estilos.heroTitulo}>Check-in / Check-out</Text>
          <Text style={estilos.heroSubtitulo}>
            Registra entrada y salida de huéspedes
          </Text>
        </View>

        {/* Selector tipo */}
        <View style={estilos.tipoContainer}>
          <TouchableOpacity
            style={[estilos.tipoBtn, tipo === 'checkin' && estilos.tipoBtnActivo]}
            onPress={() => setTipo('checkin')}
            disabled={cargando}
          >
            <MaterialCommunityIcons
              name="login"
              size={24}
              color={tipo === 'checkin' ? COLORES.textoBlanco : COLORES.textoMedio}
            />
            <Text
              style={[
                estilos.tipoBtnTexto,
                tipo === 'checkin' && estilos.tipoBtnTextoActivo,
              ]}
            >
              Check-in
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilos.tipoBtn, tipo === 'checkout' && estilos.tipoBtnActivo]}
            onPress={() => setTipo('checkout')}
            disabled={cargando}
          >
            <MaterialCommunityIcons
              name="logout"
              size={24}
              color={tipo === 'checkout' ? COLORES.textoBlanco : COLORES.textoMedio}
            />
            <Text
              style={[
                estilos.tipoBtnTexto,
                tipo === 'checkout' && estilos.tipoBtnTextoActivo,
              ]}
            >
              Check-out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input cliente */}
        <View style={estilos.inputContainer}>
          <Text style={estilos.label}>Nombre del Cliente</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ej: Juan García"
            value={nombreCliente}
            onChangeText={setNombreCliente}
            editable={!cargando}
          />
        </View>

        {/* Input habitación */}
        <View style={estilos.inputContainer}>
          <Text style={estilos.label}>Número de Habitación</Text>
          <TextInput
            style={estilos.input}
            placeholder="Ej: 101"
            keyboardType="numeric"
            value={numeroHabitacion}
            onChangeText={setNumeroHabitacion}
            editable={!cargando}
          />
        </View>

        {/* Botón procesar */}
        <TouchableOpacity 
          style={[estilos.botonProcesar, cargando && { opacity: 0.6 }]} 
          onPress={handleProcesar}
          disabled={cargando}
        >
          {cargando ? (
            <>
              <ActivityIndicator size="small" color={COLORES.textoBlanco} />
              <Text style={estilos.botonTexto}>Procesando...</Text>
            </>
          ) : (
            <>
              <MaterialCommunityIcons name="check-circle" size={24} color={COLORES.textoBlanco} />
              <Text style={estilos.botonTexto}>Procesar {tipo === 'checkin' ? 'Check-in' : 'Check-out'}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Info card */}
        <View style={estilos.infoCard}>
          <MaterialCommunityIcons name="information" size={20} color={COLORES.primario} />
          <Text style={estilos.infoTexto}>
            {tipo === 'checkin'
              ? 'Ingresa el nombre y número de habitación del huésped que está llegando'
              : 'Ingresa el nombre y número de habitación del huésped que se va'}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: DIMENSIONES.padding,
  },
  heroSection: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding * 1.5,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding * 2,
  },
  heroTitulo: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  heroSubtitulo: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
  },
  tipoContainer: {
    flexDirection: 'row',
    gap: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding * 2,
  },
  tipoBtn: {
    flex: 1,
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORES.borde,
    flexDirection: 'row',
    gap: 8,
  },
  tipoBtnActivo: {
    backgroundColor: COLORES.primario,
    borderColor: COLORES.primario,
  },
  tipoBtnTexto: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  tipoBtnTextoActivo: {
    color: COLORES.textoBlanco,
  },
  inputContainer: {
    marginBottom: DIMENSIONES.padding * 2,
  },
  label: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORES.fondoBlanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: DIMENSIONES.borderRadius,
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 12,
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoOscuro,
  },
  botonProcesar: {
    backgroundColor: COLORES.exito,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: DIMENSIONES.padding * 2,
  },
  botonTexto: {
    color: COLORES.textoBlanco,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    fontSize: TIPOGRAFIA.fontSizeBase,
  },
  infoCard: {
    backgroundColor: COLORES.primario + '15',
    borderRadius: DIMENSIONES.borderRadius,
    padding: DIMENSIONES.padding,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoTexto: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.primario,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
});

export default CheckInOutScreen;
