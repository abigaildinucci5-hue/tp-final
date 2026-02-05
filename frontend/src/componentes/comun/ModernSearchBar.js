// frontend/src/componentes/comun/ModernSearchBar.js
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const ModernSearchBar = ({
  placeholder = 'Buscar habitaciones disponibles...',
  onChangeText = () => {},
  onSearch = () => {},
  value = '',
  onClear = () => {},
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChangeText('');
    onClear();
  };

  return (
    <View style={styles.searchSection}>
      <View
        style={[
          styles.modernSearchBar,
          isFocused && styles.modernSearchBarFocused,
        ]}
      >
        <MaterialCommunityIcons
          name="magnify"
          size={20}
          color={isFocused ? COLORES.dorado : COLORES.textoMedio}
        />
        <TextInput
          style={styles.modernSearchInput}
          placeholder={placeholder}
          placeholderTextColor={COLORES.textoClaro}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        {value.length > 0 && (
          <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
            <MaterialCommunityIcons
              name="close-circle"
              size={20}
              color={COLORES.textoMedio}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchSection: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: DIMENSIONES.padding,
    backgroundColor: COLORES.blanco,
  },
  modernSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.grisClaro,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORES.grisBorde,
    gap: 10,
    borderRadius: DIMENSIONES.borderRadius,
    transition: 'all 0.2s ease',
  },
  modernSearchBarFocused: {
    borderColor: COLORES.dorado,
    backgroundColor: COLORES.blanco,
    elevation: 3,
    shadowColor: COLORES.dorado,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modernSearchInput: {
    flex: 1,
    fontFamily: 'montserrat_400regular',
    fontSize: 14,
    color: COLORES.textoOscuro,
    padding: 0,
    fontWeight: '400',
  },
});

export default ModernSearchBar;
