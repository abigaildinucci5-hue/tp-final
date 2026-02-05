// frontend/src/componentes/comun/TabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, SOMBRAS } from '../../constantes/estilos';

const TabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={estilos.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        // Obtener icono según la ruta
        const getIconName = () => {
          switch (route.name) {
            case 'Home':
              return isFocused ? 'home' : 'home-outline';
            case 'Buscar':
              return isFocused ? 'magnify' : 'magnify';
            case 'Reservas':
              return isFocused ? 'calendar' : 'calendar-outline';
            case 'Perfil':
              return isFocused ? 'account' : 'account-outline';
            default:
              return 'circle';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={estilos.tab}
          >
            <MaterialCommunityIcons
              name={getIconName()}
              size={24}
              color={isFocused ? COLORES.primario : COLORES.textoClaro}
            />
            <Text
              style={[
                estilos.label,
                { color: isFocused ? COLORES.primario : COLORES.textoClaro },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORES.fondoBlanco,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORES.borde,
    ...SOMBRAS.medium,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  label: {
    fontSize: TIPOGRAFIA.fontSizeExtraSmall,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
  },
});

export default TabBar;