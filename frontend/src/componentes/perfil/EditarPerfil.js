// frontend/src/componentes/perfil/EditarPerfil.js
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import COLORES from '../../constantes/colores';
import { DIMENSIONES } from '../../constantes/estilos';
import Input from '../comun/Input';
import Boton from '../comun/Boton';
import ErrorMensaje from '../comun/ErrorMensaje';
import { useForm } from '../../hooks/useForm';
import { validarNombre, validarEmail, validarTelefono } from '../../utils/validaciones';

const EditarPerfil = ({ usuario, onGuardar, loading = false, error = null }) => {
  const { values, errors, handleChange, handleBlur, validateForm, getInputProps } = useForm(
    {
      nombre: usuario?.nombre || '',
      email: usuario?.email || '',
      telefono: usuario?.telefono || '',
      direccion: usuario?.direccion || '',
    },
    {
      nombre: validarNombre,
      email: validarEmail,
      telefono: validarTelefono,
    }
  );

  const handleSubmit = () => {
    if (validateForm()) {
      onGuardar(values);
    }
  };

  return (
    <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
      <View style={estilos.form}>
        <Input
          label="Nombre completo"
          placeholder="Ingresa tu nombre"
          {...getInputProps('nombre')}
        />

        <Input
          label="Email"
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          {...getInputProps('email')}
        />

        <Input
          label="Teléfono"
          placeholder="+54 9 11 1234-5678"
          keyboardType="phone-pad"
          {...getInputProps('telefono')}
        />

        <Input
          label="Dirección"
          placeholder="Calle, número, ciudad"
          {...getInputProps('direccion')}
        />

        {error && <ErrorMensaje mensaje={error} tipo="error" />}

        <Boton onPress={handleSubmit} loading={loading} fullWidth>
          Guardar Cambios
        </Boton>
      </View>
    </ScrollView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.fondo,
  },
  form: {
    padding: DIMENSIONES.padding,
    gap: 16,
  },
});

export default EditarPerfil;