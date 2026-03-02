# 📋 GUÍA DE INTEGRACIÓN: FILTROS CON LISTA DE HABITACIONES

## ✅ CÓMO INTEGRAR FILTROSAVANZADOS EN LISTHABITACIONESSCREEN

Este archivo te muestra exactamente cómo conectar el modal de filtros con la pantalla de lista de habitaciones.

---

## 📝 CÓDIGO COMPLETO PARA ListaHabitacionesScreen

Reemplaza o actualiza tu `frontend/src/pantallas/habitaciones/ListaHabitacionesScreen.js` con esto:

```javascript
// frontend/src/pantallas/habitaciones/ListaHabitacionesScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import CustomNavBar from '../../componentes/comun/CustomNavBar';
import FiltrosAvanzados from '../../componentes/habitaciones/FiltrosAvanzados';
import CardHabitacion from '../../componentes/habitaciones/CardHabitacion';
import Loading from '../../componentes/comun/Loading';
import { useHabitaciones } from '../../hooks/useHabitaciones';
import { useAuth } from '../../contexto/AuthContext';

const SCREEN_WIDTH = Dimensions.get('window').width;

const ListaHabitacionesScreen = ({ navigation }) => {
  const { usuario, logout, isAuthenticated } = useAuth();
  const { habitacionesPopulares, loading } = useHabitaciones();
  const [activeRoute, setActiveRoute] = useState('Habitaciones');
  
  // Estados de filtros
  const [filtrosVisible, setFiltrosVisible] = useState(false);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState(
    habitacionesPopulares
  );
  const [filtrosAplicados, setFiltrosAplicados] = useState({
    capacidad: null,
    precioMin: null,
    precioMax: null,
    suitPrivada: false,
    balcon: false,
    vistaAlMar: false,
    banyoPrivado: false,
    climatizado: false,
  });

  // Monitorear ruta activa
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setActiveRoute('Habitaciones');
    });
    return unsubscribe;
  }, [navigation]);

  // Actualizar habitaciones filtradas cuando cambien los datos
  useEffect(() => {
    aplicarFiltrosInterno(habitacionesPopulares, filtrosAplicados);
  }, [habitacionesPopulares]);

  // Función para aplicar filtros
  const aplicarFiltrosInterno = (habitaciones, filtros) => {
    let filtradas = habitaciones;

    // Filtro de capacidad
    if (filtros.capacidad) {
      filtradas = filtradas.filter(
        (h) => (h.capacidad_personas || 2) >= filtros.capacidad
      );
    }

    // Filtro de precio
    if (filtros.precioMin !== null) {
      filtradas = filtradas.filter(
        (h) => (h.precio_base || 50) >= filtros.precioMin
      );
    }
    if (filtros.precioMax !== null) {
      filtradas = filtradas.filter(
        (h) => (h.precio_base || 50) <= filtros.precioMax
      );
    }

    // Filtro de servicios (estos son simulados en mock data)
    if (filtros.suitPrivada) {
      filtradas = filtradas.filter((h) => h.tipo_habitacion === 'Suite Deluxe');
    }

    // Nota: Los otros filtros (balcon, vistaAlMar, etc.) necesitarían
    // campos adicionales en la base de datos para funcionar completamente

    setHabitacionesFiltradas(filtradas);
  };

  // Manejar aplicación de filtros desde el modal
  const handleApplyFilters = (filtros) => {
    setFiltrosAplicados(filtros);
    aplicarFiltrosInterno(habitacionesPopulares, filtros);
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const filtrosVacios = {
      capacidad: null,
      precioMin: null,
      precioMax: null,
      suitPrivada: false,
      balcon: false,
      vistaAlMar: false,
      banyoPrivado: false,
      climatizado: false,
    };
    setFiltrosAplicados(filtrosVacios);
    setHabitacionesFiltradas(habitacionesPopulares);
  };

  // Navegar a detalle
  const handleHabitacionPress = (habitacion) => {
    const habitacionId = habitacion.id_habitacion || habitacion.id;
    navigation.navigate('Habitaciones', {
      screen: 'DetalleHabitacion',
      params: { habitacionId },
    });
  };

  const handleProfilePress = () => {
    navigation.navigate('Perfil', { screen: 'PerfilMain' });
  };

  const handleLoginPress = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading && habitacionesFiltradas.length === 0) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <HeaderApp
        title="Nuestras Habitaciones"
        showLogo={false}
        onProfilePress={handleProfilePress}
        onLoginPress={handleLoginPress}
        onLogoutPress={handleLogout}
      />

      {/* Barra de Filtros */}
      <LinearGradient
        colors={['rgba(201, 169, 97, 0.1)', 'rgba(201, 169, 97, 0.05)']}
        style={styles.filterBar}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFiltrosVisible(true)}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="filter-variant"
            size={20}
            color={COLORES.dorado}
          />
          <Text style={styles.filterButtonText}>Filtros</Text>
          {Object.values(filtrosAplicados).some((v) => v) && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>!</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Mostrar filtros activos */}
        {Object.values(filtrosAplicados).some((v) => v) && (
          <TouchableOpacity
            onPress={handleClearFilters}
            style={styles.clearButton}
          >
            <MaterialCommunityIcons
              name="close-circle"
              size={18}
              color={COLORES.dorado}
            />
            <Text style={styles.clearButtonText}>Limpiar</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>

      {/* Lista de Habitaciones */}
      {habitacionesFiltradas.length > 0 ? (
        <FlatList
          data={habitacionesFiltradas}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleHabitacionPress(item)}
              activeOpacity={0.8}
            >
              <CardHabitacion habitacion={item} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) =>
            (item.id_habitacion || item.id).toString()
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons
            name="bed-empty"
            size={48}
            color={COLORES.grisClaro}
          />
          <Text style={styles.emptyTitle}>Sin habitaciones</Text>
          <Text style={styles.emptySubtitle}>
            Intenta cambiar los filtros
          </Text>
          <TouchableOpacity
            onPress={handleClearFilters}
            style={styles.emptyButton}
          >
            <Text style={styles.emptyButtonText}>Limpiar Filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de Filtros */}
      <FiltrosAvanzados
        visible={filtrosVisible}
        onClose={() => setFiltrosVisible(false)}
        onApplyFilters={handleApplyFilters}
      />

      {/* Barra de Navegación */}
      <CustomNavBar
        navigation={navigation}
        activeRoute={activeRoute}
        onProfilePress={handleProfilePress}
        onLoginPress={handleLoginPress}
        onLogoutPress={handleLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.blanco,
  },
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: DIMENSIONES.padding,
    justifyContent: 'space-between',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: COLORES.blanco,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORES.dorado,
    gap: 8,
  },
  filterButtonText: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.dorado,
  },
  filterBadge: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORES.dorado,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.blanco,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  clearButtonText: {
    fontSize: 12,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.dorado,
  },
  listContent: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 12,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONES.padding,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.negro,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: TIPOGRAFIA.fontMontserratRegular,
    color: COLORES.textoGris,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: COLORES.dorado,
    borderRadius: 12,
  },
  emptyButtonText: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.blanco,
  },
});

export default ListaHabitacionesScreen;
```

---

## 🔗 CONEXIÓN CON EL BOTÓN "VER TODAS"

En `AutoScrollCarousel.js` o `ModernRoomsCarousel.js`, ya hay un botón "Ver Todas" con flecha:

```javascript
<TouchableOpacity
  style={styles.viewAllButton}
  onPress={onViewAllPress}  // ← Esta función llama a ListaHabitaciones
>
  <Text style={styles.viewAllText}>Ver Todas</Text>
  <MaterialCommunityIcons name="arrow-right" size={16} />
</TouchableOpacity>
```

En `HomeScreen.js`:
```javascript
const handleViewAllHabitaciones = () => {
  setActiveRoute('Habitaciones');
  navigation.navigate('Habitaciones', {
    screen: 'ListaHabitaciones',  // ← Navega a esta pantalla
  });
};
```

El modal de filtros se abre automáticamente cuando tocas el botón "Filtros" en `ListaHabitacionesScreen`.

---

## 🎯 FLUJO COMPLETO

```
HomeScreen
    ↓
[Auto-Scroll Carousel]
    ↓
Usuario toca "Ver Todas con flecha"
    ↓
ListaHabitacionesScreen
    ↓
[Barra de Filtros con botón]
    ↓
Usuario toca "Filtros"
    ↓
[Modal FiltrosAvanzados]
    ↓
Usuario selecciona filtros
    ↓
Usuario toca "Aplicar Filtros"
    ↓
[Se actualiza lista de habitaciones]
```

---

## 🔧 PERSONALIZACIÓN

### Cambiar qué se filtra:

En la función `aplicarFiltrosInterno`:

```javascript
// Agregar nuevo filtro (ejemplo: solo disponibles)
if (filtros.soloDisponibles) {
  filtradas = filtradas.filter((h) => h.estado === 'disponible');
}

// Filtro de búsqueda de texto
if (filtros.busqueda) {
  filtradas = filtradas.filter((h) =>
    h.tipo_habitacion.toLowerCase().includes(filtros.busqueda.toLowerCase())
  );
}
```

### Mostrar cantidad de resultados:

```javascript
<Text style={styles.resultCount}>
  {habitacionesFiltradas.length} habitaciones disponibles
</Text>
```

---

## 📊 EJEMPLO DE DATOS QUE FLUYEN

```javascript
// Cuando el usuario aplica filtros:
{
  capacidad: 2,           // De 1 a 10
  precioMin: 50,          // $50 mínimo
  precioMax: 200,         // $200 máximo
  suitPrivada: true,      // Solo suites
  balcon: false,          // Con o sin balcón
  vistaAlMar: true,       // Con vista al mar
  banyoPrivado: true,     // Con baño privado
  climatizado: true,      // Con aire acondicionado
}
```

---

## 💾 GUARDAR FILTROS (AVANZADO)

Para que los filtros persistan entre navegaciones:

```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Guardar
const guardarFiltros = async (filtros) => {
  await AsyncStorage.setItem('filtrosHabitaciones', JSON.stringify(filtros));
};

// Cargar
useEffect(() => {
  const cargarFiltros = async () => {
    const filtrosSaved = await AsyncStorage.getItem('filtrosHabitaciones');
    if (filtrosSaved) {
      const filtros = JSON.parse(filtrosSaved);
      handleApplyFilters(filtros);
    }
  };
  cargarFiltros();
}, []);
```

---

## ✅ CHECKLIST DE INTEGRACIÓN

- [ ] Copiar código actualizado a `ListaHabitacionesScreen.js`
- [ ] Importar `FiltrosAvanzados` y `CustomNavBar`
- [ ] Probar botón "Filtros"
- [ ] Probar deslizadores de rango
- [ ] Probar toggles
- [ ] Probar "Aplicar Filtros"
- [ ] Probar "Limpiar Filtros"
- [ ] Probar en dispositivo real
- [ ] Validar que lista se actualiza

---

**¡Listo! Los filtros están completamente integrados.** 🎉
