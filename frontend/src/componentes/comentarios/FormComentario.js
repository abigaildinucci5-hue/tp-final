// frontend/src/componentes/comentarios/FormComentario.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import EstrellaCalificacion from './EstrellaCalificacion';
import Boton from '../comun/Boton';
import ErrorMensaje from '../comun/ErrorMensaje';

const FormComentario = ({ onSubmit, loading = false, error = null }) => {
  const [calificacion, setCalificacion] = useState(0);
  const [comentario, setComentario] = useState('');
  const [errorLocal, setErrorLocal] = useState('');

  const handleSubmit = () => {
    // Validar
    if (calificacion === 0) {
      setErrorLocal('Por favor selecciona una calificación');
      return;
    }

    if (!comentario.trim()) {
      setErrorLocal('Por favor escribe un comentario');
      return;
    }

    if (comentario.trim().length < 10) {
      setErrorLocal('El comentario debe tener al menos 10 caracteres');
      return;
    }

    setErrorLocal('');
    onSubmit({ calificacion, comentario: comentario.trim() });
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Deja tu opinión</Text>

      {/* Calificación */}
      <View style={estilos.campo}>
        <Text style={estilos.label}>Calificación</Text>
        <EstrellaCalificacion
          calificacion={calificacion}
          onChange={setCalificacion}
          size={40}
        />
      </View>

      {/* Comentario */}
      <View style={estilos.campo}>
        <Text style={estilos.label}>
          Comentario <Text style={estilos.labelAsterisco}>*</Text>
        </Text>
        <TextInput
          style={estilos.textArea}
          placeholder="Cuéntanos sobre tu experiencia..."
          placeholderTextColor={COLORES.textoClaro}
          value={comentario}
          onChangeText={(text) => {
            setComentario(text);
            setErrorLocal('');
          }}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
        <Text style={estilos.contador}>
          {comentario.length}/500 caracteres
        </Text>
      </View>

      {/* Error */}
      {(errorLocal || error) && (
        <ErrorMensaje mensaje={errorLocal || error} tipo="error" />
      )}

      {/* Botón */}
      <Boton onPress={handleSubmit} loading={loading} fullWidth>
        Enviar Reseña
      </Boton>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    padding: DIMENSIONES.padding,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 20,
  },
  campo: {
    marginBottom: 20,
  },
  label: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 8,
  },
  labelAsterisco: {
    color: COLORES.error,
  },
  textArea: {
    backgroundColor: COLORES.fondoBlanco,
    borderWidth: 1,
    borderColor: COLORES.borde,
    borderRadius: DIMENSIONES.borderRadius,
    padding: 12,
    fontSize: TIPOGRAFIA.fontSizeRegular,
    color: COLORES.textoOscuro,
    minHeight: 100,
  },
  contador: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoClaro,
    textAlign: 'right',
    marginTop: 4,
  },
});

export default FormComentario;