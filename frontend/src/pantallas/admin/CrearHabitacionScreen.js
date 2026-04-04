import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Boton from '../../componentes/comun/Boton';
import ModalConfirmacion from '../../componentes/comun/ModalConfirmacion';
import habitacionesService from '../../servicios/habitacionesService';

// Modal de feedback simple (éxito o error) — reemplaza Alert
const ModalFeedback = ({ visible, tipo, titulo, mensaje, onClose }) => (
  <ModalConfirmacion
    visible={visible}
    titulo={titulo}
    mensaje={mensaje}
    iconName={tipo === 'exito' ? 'check-circle' : 'alert-circle'}
    iconColor={tipo === 'exito' ? COLORES.exito : COLORES.error}
    labelConfirmar="OK"
    labelCancelar=""
    onConfirmar={onClose}
    onCancelar={onClose}
  />
);

const CrearHabitacionScreen = ({ navigation }) => {
  const [datos, setDatos] = useState({
    numero_habitacion: '',
    descripcion_detallada: '',
    precio_base: '',
    precio_empleado: '',
    estado: 'disponible',
    piso: '',
    capacidad_personas: '2',
    vista: 'ciudad',
    id_tipo: '1',
  });

  const [loading, setLoading] = useState(false);
  const [modalFeedback, setModalFeedback] = useState(null);
  const [modalValidacion, setModalValidacion] = useState(false);

  const mostrarFeedback = (tipo, titulo, mensaje, onClose) => {
    setModalFeedback({ tipo, titulo, mensaje, onClose: onClose || (() => setModalFeedback(null)) });
  };

  // ✅ handleCrear completo y corregido
  const handleCrear = async () => {
    if (!datos.numero_habitacion || !datos.descripcion_detallada || !datos.precio_base) {
      setModalValidacion(true);
      return;
    }

    try {
      setLoading(true);

      const datosCrear = {
        numero_habitacion: datos.numero_habitacion,
        descripcion_detallada: datos.descripcion_detallada,
        piso: parseInt(datos.piso) || 1,
        estado: datos.estado || 'disponible',
        id_tipo: parseInt(datos.id_tipo) || 1,
        capacidad_personas: parseInt(datos.capacidad_personas) || 2,
        vista: datos.vista,
        precio_base: parseFloat(datos.precio_base),
        precio_empleado: datos.precio_empleado
          ? parseFloat(datos.precio_empleado)
          : parseFloat(datos.precio_base),
      };

      await habitacionesService.create(datosCrear);

      mostrarFeedback(
        'exito',
        'Habitación creada',
        `La habitación ${datos.numero_habitacion} fue creada correctamente.`,
        () => {
          setModalFeedback(null);
          navigation.goBack();
        }
      );
    } catch (error) {
      const mensaje =
        error.response?.data?.mensaje ||
        error.response?.data?.message ||
        'Ocurrió un error al crear la habitación. Intentá de nuevo.';

      mostrarFeedback('error', 'Error al crear', mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Crear Habitación"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        scrollEnabled
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: DIMENSIONES.padding, paddingVertical: DIMENSIONES.padding }}
      >
        {/* Información Básica */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Información Básica</Text>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Número de Habitación *</Text>
            <TextInput
              style={estilos.input}
              value={datos.numero_habitacion}
              onChangeText={(text) => setDatos({ ...datos, numero_habitacion: text })}
              placeholder="Ej: 301"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Piso *</Text>
            <TextInput
              style={estilos.input}
              value={datos.piso}
              onChangeText={(text) => setDatos({ ...datos, piso: text })}
              placeholder="Ej: 3"
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Capacidad (Personas) *</Text>
            <TextInput
              style={estilos.input}
              value={datos.capacidad_personas}
              onChangeText={(text) => setDatos({ ...datos, capacidad_personas: text })}
              keyboardType="numeric"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Vista</Text>
            <View style={estilos.optionButtons}>
              {['ciudad', 'jardín', 'piscina', 'mar'].map((vista) => (
                <TouchableOpacity
                  key={vista}
                  style={[estilos.optionBtn, datos.vista === vista && estilos.optionBtnActivo]}
                  onPress={() => setDatos({ ...datos, vista })}
                >
                  <Text style={[estilos.optionBtnTexto, datos.vista === vista && estilos.optionBtnTextoActivo]}>
                    {vista.charAt(0).toUpperCase() + vista.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Precios */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Precios</Text>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Precio Base ($) *</Text>
            <TextInput
              style={estilos.input}
              value={datos.precio_base}
              onChangeText={(text) => setDatos({ ...datos, precio_base: text })}
              placeholder="Ej: 100.00"
              keyboardType="decimal-pad"
            />
          </View>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Precio Empleado ($)</Text>
            <TextInput
              style={estilos.input}
              value={datos.precio_empleado}
              onChangeText={(text) => setDatos({ ...datos, precio_empleado: text })}
              placeholder="Vacío = igual al precio base"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        {/* Descripción */}
        <View style={estilos.section}>
          <Text style={estilos.sectionTitle}>Descripción</Text>

          <View style={estilos.inputGroup}>
            <Text style={estilos.inputLabel}>Descripción Detallada *</Text>
            <TextInput
              style={[estilos.input, estilos.textArea]}
              value={datos.descripcion_detallada}
              onChangeText={(text) => setDatos({ ...datos, descripcion_detallada: text })}
              placeholder="Describe las características de la habitación"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Nota informativa */}
        <View style={estilos.section}>
          <View style={estilos.notaInfo}>
            <MaterialCommunityIcons name="information" size={20} color={COLORES.primario} style={{ marginRight: 8 }} />
            <Text style={estilos.notaTexto}>
              Podrás agregar imágenes y amenidades después de crear la habitación
            </Text>
          </View>
        </View>

        {/* Botón crear */}
        <View style={estilos.botonesContainer}>
          <Boton onPress={handleCrear} loading={loading} fullWidth style={estilos.btnCrear}>
            <MaterialCommunityIcons name="plus" size={20} color={COLORES.textoBlanco} />
            <Text style={estilos.btnTexto}>Crear Habitación</Text>
          </Boton>
        </View>
      </ScrollView>

      {/* Modal: campos requeridos */}
      <ModalConfirmacion
        visible={modalValidacion}
        titulo="Campos requeridos"
        mensaje="Por favor completá el número de habitación, la descripción y el precio base antes de continuar."
        iconName="alert-circle"
        iconColor={COLORES.advertencia}
        labelConfirmar="Entendido"
        labelCancelar=""
        onConfirmar={() => setModalValidacion(false)}
        onCancelar={() => setModalValidacion(false)}
      />

      {/* Modal: feedback éxito/error */}
      {modalFeedback && (
        <ModalFeedback
          visible={!!modalFeedback}
          tipo={modalFeedback.tipo}
          titulo={modalFeedback.titulo}
          mensaje={modalFeedback.mensaje}
          onClose={modalFeedback.onClose}
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  section: { marginBottom: DIMENSIONES.padding * 1.5 },
  sectionTitle: { fontSize: TIPOGRAFIA.fontSizeMedium, fontWeight: TIPOGRAFIA.fontWeightBold, color: COLORES.textoOscuro, marginBottom: DIMENSIONES.padding },
  inputGroup: { marginBottom: DIMENSIONES.padding },
  inputLabel: { fontSize: TIPOGRAFIA.fontSizeSmall, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoOscuro, marginBottom: 6 },
  input: { borderWidth: 1, borderColor: COLORES.borde, borderRadius: DIMENSIONES.borderRadius, paddingHorizontal: DIMENSIONES.padding, paddingVertical: 10, fontSize: TIPOGRAFIA.fontSizeBase, color: COLORES.textoOscuro },
  textArea: { height: 120, paddingTop: 10 },
  optionButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  optionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: COLORES.borde, borderRadius: DIMENSIONES.borderRadius, backgroundColor: COLORES.fondoBlanco },
  optionBtnActivo: { backgroundColor: COLORES.primario, borderColor: COLORES.primario },
  optionBtnTexto: { fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoOscuro, fontWeight: TIPOGRAFIA.fontWeightSemiBold },
  optionBtnTextoActivo: { color: COLORES.textoBlanco },
  notaInfo: { flexDirection: 'row', backgroundColor: COLORES.primario + '10', padding: DIMENSIONES.padding, borderRadius: DIMENSIONES.borderRadius, alignItems: 'center' },
  notaTexto: { flex: 1, fontSize: TIPOGRAFIA.fontSizeSmall, color: COLORES.textoOscuro },
  botonesContainer: { paddingBottom: DIMENSIONES.padding },
  btnCrear: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  btnTexto: { fontSize: TIPOGRAFIA.fontSizeBase, fontWeight: TIPOGRAFIA.fontWeightSemiBold, color: COLORES.textoBlanco },
});

export default CrearHabitacionScreen;