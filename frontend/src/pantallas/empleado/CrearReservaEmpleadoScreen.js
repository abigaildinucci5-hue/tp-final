// frontend/src/pantallas/empleado/CrearReservaEmpleadoScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { ESTILOS_GLOBALES, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';
import NavbarEmpleado from '../../componentes/empleado/NavbarEmpleado';
import COLORES from '../../constantes/colores';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../contexto/AuthContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import { formatearFecha } from '../../utils/dateFormatter';

const CrearReservaEmpleadoScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { habitaciones } = useHabitaciones();
  
  const [formData, setFormData] = useState({
    cliente_nombre: '',
    cliente_email: '',
    cliente_telefono: '',
    habitacion_id: '',
    fecha_entrada: new Date(),
    fecha_salida: new Date(Date.now() + 24 * 60 * 60 * 1000),
    cantidad_huespedes: '1',
    notas: '',
  });

  const [showDatePickerEntrada, setShowDatePickerEntrada] = useState(false);
  const [showDatePickerSalida, setShowDatePickerSalida] = useState(false);
  const [selectedHabitacion, setSelectedHabitacion] = useState(null);
  const [habitacionesDisponibles, setHabitacionesDisponibles] = useState([]);

  useEffect(() => {
    // Filtrar habitaciones disponibles
    if (habitaciones) {
      const disponibles = habitaciones.filter(h => h.estado === 'disponible' || h.estado === 'available');
      setHabitacionesDisponibles(disponibles);
    }
  }, [habitaciones]);

  const handleLogout = async () => {
    await logout();
  };

  const handleDateChangeEntrada = (event, date) => {
    setShowDatePickerEntrada(false);
    if (date) {
      setFormData({ ...formData, fecha_entrada: date });
    }
  };

  const handleDateChangeSalida = (event, date) => {
    setShowDatePickerSalida(false);
    if (date) {
      setFormData({ ...formData, fecha_salida: date });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSelectHabitacion = (habitacion) => {
    setSelectedHabitacion(habitacion);
    setFormData({ ...formData, habitacion_id: habitacion.id_habitacion || habitacion.id });
  };

  const calcularNochesYTotal = () => {
    const entrada = new Date(formData.fecha_entrada);
    const salida = new Date(formData.fecha_salida);
    const noches = Math.ceil((salida - entrada) / (1000 * 60 * 60 * 24));
    // Acceder al precio con múltiples fallbacks
    const precioNoche = parseFloat(
      selectedHabitacion?.precio_noche || 
      selectedHabitacion?.precio_base || 
      selectedHabitacion?.precio || 
      0
    );
    const total = noches * Math.max(0, precioNoche);
    return { noches, total: isNaN(total) ? 0 : total };
  };

  const validarFormulario = () => {
    if (!formData.cliente_nombre.trim()) {
      Alert.alert('Error', 'El nombre del cliente es requerido');
      return false;
    }
    if (!formData.cliente_email.trim()) {
      Alert.alert('Error', 'El email del cliente es requerido');
      return false;
    }
    if (!selectedHabitacion) {
      Alert.alert('Error', 'Debe seleccionar una habitación');
      return false;
    }
    if (formData.fecha_entrada >= formData.fecha_salida) {
      Alert.alert('Error', 'La fecha de entrada debe ser anterior a la de salida');
      return false;
    }
    return true;
  };

  const handleCrearReserva = () => {
    if (!validarFormulario()) return;

    const { noches, total } = calcularNochesYTotal();
    
    Alert.alert(
      'Confirmar Reserva',
      `Cliente: ${formData.cliente_nombre}\nHabitación: #${selectedHabitacion.habitacion_numero || selectedHabitacion.numero}\nNoches: ${noches}\nTotal: $${total.toFixed(2)}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Crear',
          onPress: () => {
            Alert.alert('Éxito', 'Reserva creada correctamente');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const { noches, total } = calcularNochesYTotal();

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <NavbarEmpleado usuario={usuario} onLogout={handleLogout} navigation={navigation} />

      <ScrollView style={estilos.container} contentContainerStyle={estilos.scroll}>
        {/* Header */}
        <View style={estilos.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialCommunityIcons name="chevron-left" size={28} color={COLORES.primario} />
          </TouchableOpacity>
          <Text style={estilos.headerTitle}>Crear Reserva</Text>
          <View style={{ width: 28 }} />
        </View>

        {/* Datos del Cliente */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Datos del Cliente</Text>
          <View style={estilos.card}>
            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Nombre Completo *</Text>
              <TextInput
                style={estilos.input}
                placeholder="Juan Pérez"
                placeholderTextColor={COLORES.textoMedio}
                value={formData.cliente_nombre}
                onChangeText={(text) => handleInputChange('cliente_nombre', text)}
              />
            </View>

            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Email *</Text>
              <TextInput
                style={estilos.input}
                placeholder="cliente@email.com"
                placeholderTextColor={COLORES.textoMedio}
                keyboardType="email-address"
                value={formData.cliente_email}
                onChangeText={(text) => handleInputChange('cliente_email', text)}
              />
            </View>

            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Teléfono</Text>
              <TextInput
                style={estilos.input}
                placeholder="+56912345678"
                placeholderTextColor={COLORES.textoMedio}
                keyboardType="phone-pad"
                value={formData.cliente_telefono}
                onChangeText={(text) => handleInputChange('cliente_telefono', text)}
              />
            </View>
          </View>
        </View>

        {/* Seleccionar Habitación */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Seleccionar Habitación *</Text>
          <View style={estilos.card}>
            {habitacionesDisponibles.length > 0 ? (
              habitacionesDisponibles.map((habitacion) => (
                <TouchableOpacity
                  key={habitacion.id}
                  style={[estilos.habitacionItem, selectedHabitacion?.id === habitacion.id && estilos.habitacionItemSelected]}
                  onPress={() => handleSelectHabitacion(habitacion)}
                >
                  <View>
                    <Text style={estilos.habitacionNumero}>
                      #{habitacion.habitacion_numero || habitacion.numero} - {habitacion.tipo_habitacion || habitacion.tipo}
                    </Text>
                    <Text style={estilos.habitacionDetalles}>
                      Capacidad: {habitacion.capacidad_personas || habitacion.capacidad} | ${(habitacion.precio_noche || habitacion.precio_base || habitacion.precio || 0).toFixed(2)}/noche
                    </Text>
                  </View>
                  {selectedHabitacion?.id === habitacion.id && (
                    <MaterialCommunityIcons name="check-circle" size={24} color={COLORES.exito} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={estilos.noHabitaciones}>No hay habitaciones disponibles</Text>
            )}
          </View>
        </View>

        {/* Fechas y Huéspedes */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Fechas y Huéspedes *</Text>
          <View style={estilos.card}>
            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Fecha Entrada</Text>
              <TouchableOpacity
                style={estilos.dateButton}
                onPress={() => setShowDatePickerEntrada(true)}
              >
                <MaterialCommunityIcons name="calendar" size={20} color={COLORES.primario} />
                <Text style={estilos.dateButtonText}>{formatearFecha(formData.fecha_entrada)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePickerEntrada && (
              <DateTimePicker
                value={formData.fecha_entrada}
                mode="date"
                display="default"
                onChange={handleDateChangeEntrada}
              />
            )}

            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Fecha Salida</Text>
              <TouchableOpacity
                style={estilos.dateButton}
                onPress={() => setShowDatePickerSalida(true)}
              >
                <MaterialCommunityIcons name="calendar" size={20} color={COLORES.primario} />
                <Text style={estilos.dateButtonText}>{formatearFecha(formData.fecha_salida)}</Text>
              </TouchableOpacity>
            </View>

            {showDatePickerSalida && (
              <DateTimePicker
                value={formData.fecha_salida}
                mode="date"
                display="default"
                onChange={handleDateChangeSalida}
              />
            )}

            <View style={estilos.inputGroup}>
              <Text style={estilos.label}>Cantidad de Huéspedes</Text>
              <TextInput
                style={estilos.input}
                placeholder="1"
                placeholderTextColor={COLORES.textoMedio}
                keyboardType="number-pad"
                value={formData.cantidad_huespedes}
                onChangeText={(text) => handleInputChange('cantidad_huespedes', text)}
              />
            </View>
          </View>
        </View>

        {/* Notas */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Notas Adicionales</Text>
          <View style={estilos.card}>
            <TextInput
              style={[estilos.input, estilos.textAreaInput]}
              placeholder="Agregar notas especiales..."
              placeholderTextColor={COLORES.textoMedio}
              multiline
              numberOfLines={4}
              value={formData.notas}
              onChangeText={(text) => handleInputChange('notas', text)}
            />
          </View>
        </View>

        {/* Resumen */}
        {selectedHabitacion && (
          <View style={[estilos.section, estilos.resumenSection]}>
            <View style={estilos.card}>
              <Text style={estilos.resumenTitle}>Resumen de Costo</Text>
              
              <View style={estilos.resumenRow}>
                <Text style={estilos.resumenLabel}>${selectedHabitacion.precio_noche} x {noches} noches</Text>
                <Text style={estilos.resumenValue}>${(selectedHabitacion.precio_noche * noches).toFixed(2)}</Text>
              </View>

              <View style={[estilos.resumenRow, { borderTopWidth: 1, borderTopColor: COLORES.borde, paddingTop: 12 }]}>
                <Text style={[estilos.resumenLabel, { fontWeight: TIPOGRAFIA.fontWeightBold }]}>Total</Text>
                <Text style={[estilos.resumenValue, { color: COLORES.primario, fontWeight: TIPOGRAFIA.fontWeightBold }]}>
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Botones */}
        <View style={estilos.buttonContainer}>
          <TouchableOpacity
            style={estilos.buttonCancel}
            onPress={() => navigation.goBack()}
          >
            <Text style={estilos.buttonCancelText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[estilos.buttonCreate, !selectedHabitacion && { opacity: 0.5 }]}
            onPress={handleCrearReserva}
            disabled={!selectedHabitacion}
          >
            <MaterialCommunityIcons name="check" size={20} color={COLORES.fondoBlanco} />
            <Text style={estilos.buttonCreateText}>Crear Reserva</Text>
          </TouchableOpacity>
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
    paddingBottom: DIMENSIONES.padding * 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: DIMENSIONES.padding * 2,
  },
  headerTitle: {
    fontSize: TIPOGRAFIA.fontSizeDisplay,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  section: {
    marginBottom: DIMENSIONES.padding * 2,
  },
  resumenSection: {
    marginTop: DIMENSIONES.padding * 2,
  },
  sectionTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  card: {
    backgroundColor: COLORES.fondoBlanco,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 1,
    borderColor: COLORES.borde,
    padding: DIMENSIONES.padding,
  },
  inputGroup: {
    marginBottom: DIMENSIONES.padding,
  },
  label: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 6,
  },
  input: {
    backgroundColor: COLORES.fondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoOscuro,
  },
  textAreaInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORES.fondo,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORES.borde,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dateButtonText: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoOscuro,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
  },
  habitacionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORES.borde,
    marginBottom: 10,
    backgroundColor: COLORES.fondo,
  },
  habitacionItemSelected: {
    borderColor: COLORES.exito,
    backgroundColor: COLORES.exito + '10',
  },
  habitacionNumero: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  habitacionDetalles: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  noHabitaciones: {
    textAlign: 'center',
    color: COLORES.textoMedio,
    fontSize: TIPOGRAFIA.fontSizeBase,
    paddingVertical: DIMENSIONES.padding,
  },
  resumenTitle: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: DIMENSIONES.padding,
  },
  resumenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  resumenLabel: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    color: COLORES.textoMedio,
  },
  resumenValue: {
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: DIMENSIONES.padding,
  },
  buttonCancel: {
    flex: 1,
    backgroundColor: COLORES.fondo,
    borderRadius: DIMENSIONES.borderRadius,
    borderWidth: 2,
    borderColor: COLORES.textoMedio,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonCancelText: {
    color: COLORES.textoMedio,
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  buttonCreate: {
    flex: 1,
    backgroundColor: COLORES.exito,
    borderRadius: DIMENSIONES.borderRadius,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonCreateText: {
    color: COLORES.fondoBlanco,
    fontSize: TIPOGRAFIA.fontSizeBase,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
});

export default CrearReservaEmpleadoScreen;
