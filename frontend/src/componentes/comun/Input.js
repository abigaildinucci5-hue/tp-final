// src/componentes/comun/Input.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';
import { RADIOS, DIMENSIONES, TIPOGRAFIA } from '../../constantes/estilos';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  error = '',
  icono = null,
  multiline = false,
  numberOfLines = 1,
  editable = true,
  maxLength = null,
  onBlur = null,
  onFocus = null,
  estiloContenedor = {},
  estiloInput = {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [animacion] = useState(new Animated.Value(value ? 1 : 0));

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animacion, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
    onFocus && onFocus();
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!value) {
      Animated.timing(animacion, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
    onBlur && onBlur();
  };

  const labelStyle = {
    position: 'absolute',
    left: icono ? 40 : DIMENSIONES.margin,
    top: animacion.interpolate({
      inputRange: [0, 1],
      outputRange: [18, -8],
    }),
    fontSize: animacion.interpolate({
      inputRange: [0, 1],
      outputRange: [TIPOGRAFIA.fontSizeMedium, TIPOGRAFIA.fontSizeExtraSmall],
    }),
    color: animacion.interpolate({
      inputRange: [0, 1],
      outputRange: [
        COLORES.textoGris,
        isFocused ? COLORES.primario : COLORES.textoGris,
      ],
    }),
    backgroundColor: COLORES.fondoClaro,
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const borderColor = error
    ? COLORES.error
    : isFocused
    ? COLORES.primario
    : COLORES.borde;

  return (
    <View style={[estilos.contenedor, estiloContenedor]}>
      {label && <Animated.Text style={labelStyle}>{label}</Animated.Text>}

      <View
        style={[
          estilos.inputContenedor,
          {
            borderColor,
            borderWidth: isFocused ? 2 : 1,
          },
          !editable && estilos.inputDeshabilitado,
        ]}
      >
        {icono && (
          <View style={estilos.iconoContenedor}>
            <MaterialCommunityIcons
              name={icono}
              size={20}
              color={isFocused ? COLORES.primario : COLORES.textoGris}
            />
          </View>
        )}

        <TextInput
          style={[
            estilos.input,
            icono && estilos.inputConIcono,
            multiline && estilos.inputMultiline,
            estiloInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={!label || isFocused || value ? placeholder : ''}
          placeholderTextColor={COLORES.textoGrisClaro}
          secureTextEntry={secureTextEntry && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          maxLength={maxLength}
        />

        {secureTextEntry && (
          <TouchableOpacity
            style={estilos.botonPassword}
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color={COLORES.textoGris}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <View style={estilos.errorContenedor}>
          <MaterialCommunityIcons
            name="alert-circle"
            size={14}
            color={COLORES.error}
          />
          <Text style={estilos.errorTexto}>{error}</Text>
        </View>
      ) : null}

      {maxLength && value && (
        <Text style={estilos.contador}>
          {value.length}/{maxLength}
        </Text>
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  contenedor: {
    marginBottom: DIMENSIONES.margin,
  },

  inputContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoTarjeta,
    borderRadius: RADIOS.md,
    paddingHorizontal: DIMENSIONES.padding,
    minHeight: 56,
  },

  iconoContenedor: {
    marginRight: DIMENSIONES.marginSmall,
  },

  input: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoOscuro,
    paddingVertical: DIMENSIONES.padding,
  },

  inputConIcono: {
    paddingLeft: 0,
  },

  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: DIMENSIONES.margin,
  },

  inputDeshabilitado: {
    backgroundColor: COLORES.fondoGris,
    opacity: 0.6,
  },

  botonPassword: {
    padding: DIMENSIONES.paddingSmall,
  },

  errorContenedor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: DIMENSIONES.marginSmall,
    paddingHorizontal: DIMENSIONES.marginSmall,
  },

  errorTexto: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    color: COLORES.error,
    marginLeft: 4,
    flex: 1,
  },

  contador: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    color: COLORES.textoGris,
    textAlign: 'right',
    marginTop: DIMENSIONES.marginSmall,
  },
});

export default Input;
