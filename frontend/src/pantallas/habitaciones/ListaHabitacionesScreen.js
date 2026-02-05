// frontend/src/pantallas/habitaciones/ListaHabitacionesScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';
import { format } from 'date-fns';
import COLORES from '../../constantes/colores';
import { ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';

const ListaHabitacionesScreen = ({ navigation, route }) => {
  // Parámetros del Home
  const [fechaCheckIn, setFechaCheckIn] = useState(route.params?.fechaCheckIn || null);
  const [fechaCheckOut, setFechaCheckOut] = useState(route.params?.fechaCheckOut || null);
  const [numHuespedes, setNumHuespedes] = useState(route.params?.numHuespedes || null);

  // Habitaciones
  const [habitaciones, setHabitaciones] = useState([]);
  const [habitacionesFiltradas, setHabitacionesFiltradas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Filtros
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(500);
  const [tipoHabitacion, setTipoHabitacion] = useState('todas');
  const [ordenarPor, setOrdenarPor] = useState('precio_asc');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  // Cargar habitaciones
  useEffect(() => {
    cargarHabitaciones();
  }, []);

  // Aplicar filtros cuando cambian
  useEffect(() => {
    aplicarFiltros();
  }, [precioMin, precioMax, numHuespedes, tipoHabitacion, ordenarPor, habitaciones]);

  const cargarHabitaciones = async () => {
    try {
      setCargando(true);
      // Simulación de API - reemplazar con endpoint real
      const response = await fetch('http://192.168.0.100:3000/api/habitaciones');
      const data = await response.json();
      setHabitaciones(data);
      setHabitacionesFiltradas(data);
    } catch (error) {
      console.error('Error:', error);
      // Datos de prueba
      const dataPrueba = [
        {
          id: 1,
          numero: '101',
          tipo: 'Estándar',
          capacidad: 2,
          precio_por_noche: 80,
          descripcion: 'Habitación acogedora con vistas al jardín',
          total_reservas: 45,
        },
        {
          id: 2,
          numero: '102',
          tipo: 'Premium',
          capacidad: 2,
          precio_por_noche: 150,
          descripcion: 'Habitación elegante con balcón privado',
          total_reservas: 68,
        },
        {
          id: 3,
          numero: '201',
          tipo: 'Suite',
          capacidad: 4,
          precio_por_noche: 300,
          descripcion: 'Suite de lujo con sala de estar',
          total_reservas: 92,
        },
        {
          id: 4,
          numero: '202',
          tipo: 'Deluxe',
          capacidad: 3,
          precio_por_noche: 200,
          descripcion: 'Habitación deluxe con jacuzzi',
          total_reservas: 78,
        },
        {
          id: 5,
          numero: '103',
          tipo: 'Estándar',
          capacidad: 2,
          precio_por_noche: 90,
          descripcion: 'Habitación moderna con wifi gratis',
          total_reservas: 52,
        },
      ];
      setHabitaciones(dataPrueba);
      setHabitacionesFiltradas(dataPrueba);
    } finally {
      setCargando(false);
    }
  };

  const aplicarFiltros = useCallback(() => {
    let resultado = [...habitaciones];

    // Filtro por precio
    resultado = resultado.filter(
      (hab) => hab.precio_por_noche >= precioMin && hab.precio_por_noche <= precioMax
    );

    // Filtro por tipo de habitación
    if (tipoHabitacion !== 'todas') {
      resultado = resultado.filter(
        (hab) => hab.tipo.toLowerCase() === tipoHabitacion.toLowerCase()
      );
    }

    // Filtro por capacidad de personas
    if (numHuespedes) {
      resultado = resultado.filter((hab) => hab.capacidad >= numHuespedes);
    }

    // Ordenar
    switch (ordenarPor) {
      case 'precio_asc':
        resultado.sort((a, b) => a.precio_por_noche - b.precio_por_noche);
        break;
      case 'precio_desc':
        resultado.sort((a, b) => b.precio_por_noche - a.precio_por_noche);
        break;
      case 'capacidad_asc':
        resultado.sort((a, b) => a.capacidad - b.capacidad);
        break;
      case 'capacidad_desc':
        resultado.sort((a, b) => b.capacidad - a.capacidad);
        break;
      case 'popularidad':
        resultado.sort((a, b) => (b.total_reservas || 0) - (a.total_reservas || 0));
        break;
    }

    setHabitacionesFiltradas(resultado);
  }, [habitaciones, precioMin, precioMax, numHuespedes, tipoHabitacion, ordenarPor]);

  const limpiarFiltros = () => {
    setPrecioMin(0);
    setPrecioMax(500);
    setNumHuespedes(route.params?.numHuespedes || null);
    setTipoHabitacion('todas');
    setOrdenarPor('precio_asc');
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return null;
    try {
      return format(new Date(fecha), 'dd MMM', { locale: require('date-fns/locale/es') });
    } catch {
      return fecha;
    }
  };

  const renderFiltros = () => (
    <View style={estilos.contenedorFiltros}>
      {/* Header de filtros */}
      <View style={estilos.headerFiltros}>
        <Text style={estilos.tituloFiltros}>Filtros</Text>
        <TouchableOpacity onPress={limpiarFiltros}>
          <Text style={estilos.linkLimpiar}>Limpiar todo</Text>
        </TouchableOpacity>
      </View>

      {/* Rango de precio */}
      <View style={estilos.filtroSeccion}>
        <Text style={estilos.labelFiltro}>Precio por noche</Text>
        <View style={estilos.rangoPrecio}>
          <Text style={estilos.valorPrecio}>${precioMin}</Text>
          <Text style={estilos.separadorPrecio}>-</Text>
          <Text style={estilos.valorPrecio}>${precioMax}</Text>
        </View>
        <View style={estilos.slidersContainer}>
          <View style={estilos.sliderWrapper}>
            <Text style={estilos.labelSlider}>Mínimo</Text>
            <Slider
              style={estilos.slider}
              minimumValue={0}
              maximumValue={500}
              step={10}
              value={precioMin}
              onValueChange={setPrecioMin}
              minimumTrackTintColor="#C9A961"
              maximumTrackTintColor="#E0E0E0"
            />
          </View>
          <View style={estilos.sliderWrapper}>
            <Text style={estilos.labelSlider}>Máximo</Text>
            <Slider
              style={estilos.slider}
              minimumValue={precioMin}
              maximumValue={500}
              step={10}
              value={precioMax}
              onValueChange={setPrecioMax}
              minimumTrackTintColor="#C9A961"
              maximumTrackTintColor="#E0E0E0"
            />
          </View>
        </View>
      </View>

      {/* Tipo de habitación */}
      <View style={estilos.filtroSeccion}>
        <Text style={estilos.labelFiltro}>Tipo de habitación</Text>
        <View style={estilos.pickerContainer}>
          <Picker
            selectedValue={tipoHabitacion}
            onValueChange={setTipoHabitacion}
            style={estilos.picker}
          >
            <Picker.Item label="Todas" value="todas" />
            <Picker.Item label="Estándar" value="estandar" />
            <Picker.Item label="Premium" value="premium" />
            <Picker.Item label="Suite" value="suite" />
            <Picker.Item label="Deluxe" value="deluxe" />
          </Picker>
        </View>
      </View>

      {/* Ordenar por */}
      <View style={estilos.filtroSeccion}>
        <Text style={estilos.labelFiltro}>Ordenar por</Text>
        <View style={estilos.pickerContainer}>
          <Picker
            selectedValue={ordenarPor}
            onValueChange={setOrdenarPor}
            style={estilos.picker}
          >
            <Picker.Item label="Precio: Menor a Mayor" value="precio_asc" />
            <Picker.Item label="Precio: Mayor a Menor" value="precio_desc" />
            <Picker.Item label="Capacidad: Menor a Mayor" value="capacidad_asc" />
            <Picker.Item label="Capacidad: Mayor a Menor" value="capacidad_desc" />
            <Picker.Item label="Más Populares" value="popularidad" />
          </Picker>
        </View>
      </View>

      {/* Botón aplicar filtros */}
      <TouchableOpacity
        style={estilos.botonAplicarFiltros}
        onPress={() => setMostrarFiltros(false)}
      >
        <Text style={estilos.textoBotonAplicar}>
          Mostrar {habitacionesFiltradas.length} habitaciones
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderHabitacionCard = ({ item }) => (
    <TouchableOpacity
      style={estilos.habitacionCard}
      onPress={() =>
        navigation.navigate('DetalleHabitacion', {
          id: item.id,
          habitacionId: item.id,
          fechaCheckIn,
          fechaCheckOut,
          numHuespedes,
        })
      }
    >
      <View style={estilos.badgeCapacidad}>
        <Ionicons name="people" size={16} color="#FFFFFF" />
        <Text style={estilos.textoBadge}>{item.capacidad}</Text>
      </View>

      <View style={estilos.contenidoCard}>
        <View style={estilos.headerCard}>
          <Text style={estilos.numeroHabitacion}>Hab. {item.numero}</Text>
          <Text style={estilos.tipoHabitacion}>{item.tipo}</Text>
        </View>

        <Text style={estilos.descripcion}>{item.descripcion}</Text>

        <View style={estilos.footerCard}>
          <View style={estilos.precio}>
            <Text style={estilos.precioValor}>${item.precio_por_noche}</Text>
            <Text style={estilos.precioLabel}>/noche</Text>
          </View>

          {item.total_reservas > 0 && (
            <View style={estilos.reservas}>
              <Ionicons name="star" size={16} color="#FFD700" />
              <Text style={estilos.textoReservas}>{item.total_reservas} reservas</Text>
            </View>
          )}
        </View>
      </View>

      <Ionicons name="chevron-forward" size={24} color="#C9A961" style={estilos.icono} />
    </TouchableOpacity>
  );

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Habitaciones"
        showNavigation={true}
        navigation={navigation}
        activeRoute="Habitaciones"
      />

      {/* Chips de filtros activos */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={estilos.chipsContainer}
      >
        {fechaCheckIn && fechaCheckOut && (
          <View style={estilos.chip}>
            <Ionicons name="calendar" size={16} color="#C9A961" />
            <Text style={estilos.textoChip}>
              {formatearFecha(fechaCheckIn)} - {formatearFecha(fechaCheckOut)}
            </Text>
            <TouchableOpacity onPress={() => setFechaCheckIn(null)}>
              <Ionicons name="close-circle" size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>
        )}

        {numHuespedes && (
          <View style={estilos.chip}>
            <Ionicons name="people" size={16} color="#C9A961" />
            <Text style={estilos.textoChip}>{numHuespedes} pers.</Text>
            <TouchableOpacity onPress={() => setNumHuespedes(null)}>
              <Ionicons name="close-circle" size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>
        )}

        {tipoHabitacion !== 'todas' && (
          <View style={estilos.chip}>
            <Text style={estilos.textoChip}>{tipoHabitacion}</Text>
            <TouchableOpacity onPress={() => setTipoHabitacion('todas')}>
              <Ionicons name="close-circle" size={18} color="#6B6B6B" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Header con búsqueda y filtros */}
      <View style={estilos.header}>
        <View style={estilos.headerContent}>
          <Text style={estilos.resultadoBusqueda}>
            {habitacionesFiltradas.length} habitaciones encontradas
          </Text>
          <TouchableOpacity
            style={estilos.botonFiltros}
            onPress={() => setMostrarFiltros(true)}
          >
            <Ionicons name="filter" size={20} color="#C9A961" />
            <Text style={estilos.textoBotonFiltros}>Filtros</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lista de habitaciones */}
      {cargando ? (
        <View style={estilos.loadingContainer}>
          <ActivityIndicator size="large" color="#C9A961" />
          <Text style={estilos.loadingText}>Cargando habitaciones...</Text>
        </View>
      ) : habitacionesFiltradas.length > 0 ? (
        <FlatList
          data={habitacionesFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderHabitacionCard}
          contentContainerStyle={estilos.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={estilos.emptyContainer}>
          <Ionicons name="search-outline" size={64} color="#6B6B6B" />
          <Text style={estilos.emptyText}>No se encontraron habitaciones</Text>
          <TouchableOpacity onPress={limpiarFiltros}>
            <Text style={estilos.linkLimpiarFiltros}>Limpiar filtros</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de filtros */}
      <Modal
        visible={mostrarFiltros}
        animationType="slide"
        onRequestClose={() => setMostrarFiltros(false)}
      >
        <View style={estilos.modalFiltros}>
          <View style={estilos.headerModalFiltros}>
            <TouchableOpacity onPress={() => setMostrarFiltros(false)}>
              <Ionicons name="close" size={28} color="#1A1A1A" />
            </TouchableOpacity>
          </View>
          <ScrollView>
            {renderFiltros()}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const estilos = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultadoBusqueda: {
    fontSize: 14,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  botonFiltros: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  textoBotonFiltros: {
    color: '#1A1A1A',
    fontSize: 13,
    fontWeight: '600',
  },
  chipsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    gap: 6,
  },
  textoChip: {
    color: '#1A1A1A',
    fontSize: 12,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  habitacionCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: 'relative',
  },
  badgeCapacidad: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#C9A961',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoBadge: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  contenidoCard: {
    flex: 1,
    marginRight: 10,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  numeroHabitacion: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  tipoHabitacion: {
    fontSize: 12,
    color: '#C9A961',
    fontWeight: '600',
  },
  descripcion: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 10,
    lineHeight: 18,
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  precio: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  precioValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C9A961',
  },
  precioLabel: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  reservas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  textoReservas: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  icono: {
    position: 'absolute',
    right: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B6B6B',
    marginTop: 15,
    marginBottom: 10,
    textAlign: 'center',
  },
  linkLimpiarFiltros: {
    color: '#C9A961',
    fontSize: 14,
    fontWeight: '600',
  },
  modalFiltros: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerModalFiltros: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  contenedorFiltros: {
    padding: 20,
  },
  headerFiltros: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  tituloFiltros: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  linkLimpiar: {
    color: '#C9A961',
    fontSize: 14,
    fontWeight: '600',
  },
  filtroSeccion: {
    marginBottom: 25,
  },
  labelFiltro: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  rangoPrecio: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  valorPrecio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C9A961',
  },
  separadorPrecio: {
    fontSize: 18,
    color: '#6B6B6B',
  },
  slidersContainer: {
    gap: 15,
  },
  sliderWrapper: {
    gap: 5,
  },
  labelSlider: {
    fontSize: 12,
    color: '#6B6B6B',
    fontWeight: '500',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  pickerContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  picker: {
    height: 50,
  },
  botonAplicarFiltros: {
    backgroundColor: '#C9A961',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  textoBotonAplicar: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ListaHabitacionesScreen;