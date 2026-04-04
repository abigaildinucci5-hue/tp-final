// frontend/src/pantallas/reservas/NuevaReservaScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';
import { useAuth } from '../../contexto/AuthContext';
import { useReservas } from '../../hooks/useReservas';

const NuevaReservaScreen = ({ route, navigation }) => {
  const { habitacion } = route.params || {};
  const habitacionId = habitacion?.id_habitacion;
console.log("DEBUG - ID de habitación recibido:", habitacionId);
console.log("DEBUG - Objeto habitación completo:", habitacion);

  const { usuario, isAuthenticated } = useAuth();
  const { crearReserva } = useReservas();
  
  // Estados
  const [fechaCheckIn, setFechaCheckIn] = useState(null);
  const [fechaCheckOut, setFechaCheckOut] = useState(null);
  const [numHuespedes, setNumHuespedes] = useState(2);
  const [numNiños, setNumNiños] = useState(0);
  const [horaLlegada, setHoraLlegada] = useState('14:00');
  const [turno, setTurno] = useState('completo');
  const [solicitudes, setSolicitudes] = useState('');
  const [metodoPago, setMetodoPago] = useState(null);
  const [usarPuntos, setUsarPuntos] = useState(false);

  // Proteger acceso
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth', params: { screen: 'Login' } }],
      });
    }
  }, [isAuthenticated, navigation]);

  const handleConfirmarReserva = async () => {
    console.log("1. Intento de Confirmación");
    
    // Validación de datos
    if (!fechaCheckIn || !fechaCheckOut) {
      Alert.alert('Fechas faltantes', 'Por favor selecciona el rango de fechas en el calendario.');
      return;
    }

    if (!metodoPago) {
      Alert.alert('Método de pago', 'Por favor selecciona cómo deseas pagar.');
      return;
    }

    if (!habitacionId) {
      console.error("ERROR: No se encontró ID de habitación");
      Alert.alert('Error', 'No se pudo identificar la habitación. Regresa e intenta de nuevo.');
      return;
    }

    try {
      console.log("2. Enviando datos al hook...");
      // DATOS CORRECTOS ESPERADOS POR EL BACKEND
      const reservaData = {
        idHabitacion: habitacionId,           // ✅ Correcto
        fechaEntrada: fechaCheckIn,           // ✅ Correcto
        fechaSalida: fechaCheckOut,           // ✅ Correcto
        numeroHuespedes: numHuespedes,        // ✅ CORREGIDO: era "huespedes"
        notasEspeciales: solicitudes          // ✅ CORREGIDO: era "solicitudesEspeciales"
      };

      const result = await crearReserva(reservaData);
      
      console.log("3. Respuesta del servidor:", result);

      if (result && result.success) {
        navigation.navigate('ReservaExitosa', { reserva: result.data });
      } else {
        const msgError = result?.error?.mensaje || 'Error desconocido al reservar';
        Alert.alert('Atención', msgError);
      }
    } catch (err) {
      console.error("4. Error catastrófico:", err);
      Alert.alert('Error de Red', 'No pudimos conectar con el servidor.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.titulo}>Nueva Reserva</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Selector de fechas */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Selecciona tus fechas</Text>
        <Calendar
          minDate={new Date().toISOString().split('T')[0]}
          onDayPress={(day) => {
            if (!fechaCheckIn || (fechaCheckIn && fechaCheckOut)) {
              setFechaCheckIn(day.dateString);
              setFechaCheckOut(null);
            } else {
              if (day.dateString > fechaCheckIn) {
                setFechaCheckOut(day.dateString);
              }
            }
          }}
          markedDates={{
            [fechaCheckIn]: { selected: true, selectedColor: '#C9A961' },
            [fechaCheckOut]: { selected: true, selectedColor: '#C9A961' },
          }}
          theme={{
            calendarBackground: '#ffffff',
            textSectionTitleColor: '#1A1A1A',
            selectedDayBackgroundColor: '#C9A961',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#C9A961',
            dayTextColor: '#1A1A1A',
            textDisabledColor: '#E0E0E0',
          }}
        />
      </View>

      {/* Número de huéspedes */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Huéspedes</Text>
        
        <View style={styles.filaContador}>
          <Text style={styles.labelContador}>Adultos</Text>
          <View style={styles.contador}>
            <TouchableOpacity onPress={() => setNumHuespedes(Math.max(1, numHuespedes - 1))}>
              <Ionicons name="remove-circle-outline" size={32} color="#C9A961" />
            </TouchableOpacity>
            <Text style={styles.numeroContador}>{numHuespedes}</Text>
            <TouchableOpacity onPress={() => setNumHuespedes(numHuespedes + 1)}>
              <Ionicons name="add-circle-outline" size={32} color="#C9A961" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.filaContador}>
          <Text style={styles.labelContador}>Niños</Text>
          <View style={styles.contador}>
            <TouchableOpacity onPress={() => setNumNiños(Math.max(0, numNiños - 1))}>
              <Ionicons name="remove-circle-outline" size={32} color="#C9A961" />
            </TouchableOpacity>
            <Text style={styles.numeroContador}>{numNiños}</Text>
            <TouchableOpacity onPress={() => setNumNiños(numNiños + 1)}>
              <Ionicons name="add-circle-outline" size={32} color="#C9A961" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Tipo de estadía */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Tipo de estadía</Text>
        
        <TouchableOpacity
          style={[styles.opcionTurno, turno === 'completo' && styles.opcionActiva]}
          onPress={() => setTurno('completo')}
        >
          <Ionicons
            name={turno === 'completo' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
          <View style={styles.infoOpcion}>
            <Text style={styles.textoOpcion}>Completo (Día + Noche)</Text>
            <Text style={styles.precioOpcion}>Precio estándar</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.opcionTurno, turno === 'dia' && styles.opcionActiva]}
          onPress={() => setTurno('dia')}
        >
          <Ionicons
            name={turno === 'dia' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
          <View style={styles.infoOpcion}>
            <Text style={styles.textoOpcion}>Solo Día (8am - 8pm)</Text>
            <Text style={styles.precioOpcion}>30% descuento</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.opcionTurno, turno === 'noche' && styles.opcionActiva]}
          onPress={() => setTurno('noche')}
        >
          <Ionicons
            name={turno === 'noche' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
          <View style={styles.infoOpcion}>
            <Text style={styles.textoOpcion}>Solo Noche (8pm - 8am)</Text>
            <Text style={styles.precioOpcion}>30% descuento</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Hora de llegada */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Hora de llegada estimada</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={horaLlegada}
            onValueChange={setHoraLlegada}
            style={{ color: '#1A1A1A' }}
          >
            <Picker.Item label="14:00 - 15:00" value="14:00" />
            <Picker.Item label="15:00 - 16:00" value="15:00" />
            <Picker.Item label="16:00 - 17:00" value="16:00" />
            <Picker.Item label="17:00 - 18:00" value="17:00" />
            <Picker.Item label="Después de las 18:00" value="18:00+" />
          </Picker>
        </View>
      </View>

      {/* Solicitudes especiales */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Solicitudes especiales (opcional)</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Ej: Habitación en piso alto, almohadas extra..."
          multiline
          numberOfLines={4}
          value={solicitudes}
          onChangeText={setSolicitudes}
          maxLength={500}
          placeholderTextColor="#9CA3AF"
        />
        <Text style={styles.contadorCaracteres}>{solicitudes.length}/500</Text>
      </View>

      {/* Política de cancelación */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Política de Cancelación</Text>
        <View style={styles.politica}>
          <Ionicons name="checkmark-circle" size={20} color="#10B981" />
          <Text style={styles.textoPolitica}>
            Cancelación gratuita hasta 48h antes del check-in
          </Text>
        </View>
        <View style={styles.politica}>
          <Ionicons name="alert-circle" size={20} color="#F59E0B" />
          <Text style={styles.textoPolitica}>
            Entre 24-48h: 50% de reembolso
          </Text>
        </View>
        <View style={styles.politica}>
          <Ionicons name="close-circle" size={20} color="#EF4444" />
          <Text style={styles.textoPolitica}>
            Menos de 24h: sin reembolso
          </Text>
        </View>
      </View>

      {/* Método de Pago */}
      <View style={styles.seccion}>
        <Text style={styles.tituloSeccion}>Método de Pago</Text>
        
        <TouchableOpacity
          style={[styles.metodoPago, metodoPago === 'visa' && styles.metodoActivo]}
          onPress={() => setMetodoPago('visa')}
        >
          <Ionicons name="card-outline" size={24} color="#C9A961" />
          <Text style={styles.textoMetodo}>Visa / Mastercard</Text>
          <Ionicons
            name={metodoPago === 'visa' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metodoPago, metodoPago === 'mercadopago' && styles.metodoActivo]}
          onPress={() => setMetodoPago('mercadopago')}
        >
          <Ionicons name="wallet-outline" size={24} color="#00B0FF" />
          <Text style={styles.textoMetodo}>Mercado Pago</Text>
          <Ionicons
            name={metodoPago === 'mercadopago' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metodoPago, metodoPago === 'paypal' && styles.metodoActivo]}
          onPress={() => setMetodoPago('paypal')}
        >
          <Ionicons name="logo-paypal" size={24} color="#0070BA" />
          <Text style={styles.textoMetodo}>PayPal</Text>
          <Ionicons
            name={metodoPago === 'paypal' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.metodoPago, metodoPago === 'transferencia' && styles.metodoActivo]}
          onPress={() => setMetodoPago('transferencia')}
        >
          <Ionicons name="business-outline" size={24} color="#C9A961" />
          <Text style={styles.textoMetodo}>Transferencia Bancaria</Text>
          <Ionicons
            name={metodoPago === 'transferencia' ? 'radio-button-on' : 'radio-button-off'}
            size={24}
            color="#C9A961"
          />
        </TouchableOpacity>
      </View>

      {/* Botón confirmar */}
      <TouchableOpacity
        style={styles.botonConfirmar}
        onPress={handleConfirmarReserva}
        activeOpacity={0.7} // Esto hará que el botón brille al tocarlo
      >
        <Text style={styles.textoBoton}>Confirmar Reserva</Text>
      </TouchableOpacity>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  seccion: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 10,
  },
  tituloSeccion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  filaContador: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  labelContador: {
    fontSize: 15,
    color: '#1A1A1A',
  },
  contador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  numeroContador: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    minWidth: 30,
    textAlign: 'center',
  },
  opcionTurno: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 10,
    gap: 12,
  },
  opcionActiva: {
    backgroundColor: 'rgba(201, 169, 97, 0.1)',
    borderWidth: 2,
    borderColor: '#C9A961',
  },
  infoOpcion: {
    flex: 1,
  },
  textoOpcion: {
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  precioOpcion: {
    fontSize: 13,
    color: '#6B6B6B',
    marginTop: 2,
  },
  pickerContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    overflow: 'hidden',
  },
  textArea: {
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: 'top',
    color: '#1A1A1A',
    fontFamily: 'Arial',
  },
  contadorCaracteres: {
    fontSize: 12,
    color: '#6B6B6B',
    textAlign: 'right',
    marginTop: 5,
  },
  politica: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  textoPolitica: {
    fontSize: 14,
    color: '#6B6B6B',
    flex: 1,
  },
  metodoPago: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    marginBottom: 10,
    gap: 12,
  },
  metodoActivo: {
    backgroundColor: 'rgba(201, 169, 97, 0.1)',
    borderWidth: 2,
    borderColor: '#C9A961',
  },
  textoMetodo: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  botonConfirmar: {
    backgroundColor: '#C9A961',
    margin: 20,
    padding: 18,
    borderRadius: 8,
    alignItems: 'center',
  },
  textoBoton: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NuevaReservaScreen;