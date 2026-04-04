import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, SOMBRAS } from '../../constantes/estilos';

const HeaderApp = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  rightComponent,
  variant = 'primary', // 'primary', 'transparent'
  showShadow = true,
}) => {
  const getHeaderStyle = () => {
    const styles = [estilos.header];

    if (variant === 'primary') {
      styles.push(estilos.headerPrimary);
    } else {
      styles.push(estilos.headerTransparent);
    }

    if (showShadow) {
      styles.push(SOMBRAS.small);
    }

    return styles;
  };

  const getTitleColor = () => {
    return variant === 'primary' ? COLORES.textoBlanco : COLORES.textoOscuro;
  };

  return (
    <View style={getHeaderStyle()}>
      {/* Botón izquierdo */}
      <View style={estilos.leftContainer}>
        {leftIcon && (
          <TouchableOpacity onPress={onLeftPress} style={estilos.iconButton}>
            <MaterialCommunityIcons name={leftIcon} size={24} color={getTitleColor()} />
          </TouchableOpacity>
        )}
      </View>

      {/* Título y subtítulo */}
      <View style={estilos.centerContainer}>
        <Text style={[estilos.title, { color: getTitleColor() }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[estilos.subtitle, { color: getTitleColor() }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>

      {/* Botón derecho o componente personalizado */}
      <View style={estilos.rightContainer}>
        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableOpacity onPress={onRightPress} style={estilos.iconButton}>
            <MaterialCommunityIcons name={rightIcon} size={24} color={getTitleColor()} />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const estilos = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 16,
    paddingHorizontal: DIMENSIONES.padding,
  },
  headerPrimary: {
    backgroundColor: COLORES.primario,
  },
  headerTransparent: {
    backgroundColor: 'transparent',
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    padding: 8,
  },
  title: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
  },
  subtitle: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    fontWeight: TIPOGRAFIA.fontWeightRegular,
    marginTop: 2,
  },
});

export default HeaderApp;