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
  Image,
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

  const renderHabitacionCard = ({ item }) => {
    const imagenUrl = item.imagen_principal || item.imagen || 'https://via.placeholder.com/300x200?text=Habitaci%C3%B3n';
    const numeroHab = item.numero_habitacion || item.numero || 'N/A';
    const tipoHab = item.tipo_nombre || item.tipo || 'Habitación';
    const descripcion = item.descripcion_detallada || item.descripcion || '';
    const precio = item.precio_base || item.precio_por_noche || 0;
    const estado = item.estado || 'disponible';
    const reseñas = item.total_reseñas || item.total_reservas || 45;

    return (
      <TouchableOpacity
        style={estilos.card}
        onPress={() =>
          navigation.navigate('DetalleHabitacion', {
            id: item.id_habitacion || item.id,
            habitacionId: item.id_habitacion || item.id,
            fechaCheckIn,
            fechaCheckOut,
            numHuespedes,
          })
        }
        activeOpacity={0.9}
      >
        {/* Imagen grande */}
        <View style={estilos.imagenContainer}>
          <Image
            source={{ uri: imagenUrl }}
            style={estilos.imagen}
            resizeMode="cover"
          />
          {/* Badge número habitación */}
          <View style={estilos.badgeTipo}>
            <Text style={estilos.textoTipo}>Hab. {numeroHab}</Text>
          </View>
        </View>

        {/* Contenido info */}
        <View style={estilos.infoContainer}>
          {/* Header: tipo y tipo de habitación */}
          <View style={estilos.headerCard}>
            <Text style={estilos.tipoHab}>{tipoHab}</Text>
          </View>

          {/* Descripción */}
          <Text style={estilos.descripcion} numberOfLines={2}>
            {descripcion}
          </Text>

          {/* Footer: precio, disponibilidad, estrellas */}
          <View style={estilos.footerCard}>
            <View>
              <Text style={estilos.precio}>${precio}</Text>
              <Text style={estilos.porNoche}>/noche</Text>
            </View>

            <View style={estilos.disponibilidadBadge}>
              <View
                style={[
                  estilos.dotDisponibilidad,
                  estado === 'disponible' && estilos.dotVerde,
                ]}
              />
              <Text style={estilos.textoDisponibilidad}>
                {estado === 'disponible' ? 'Disponible' : 'Ocupada'}
              </Text>
            </View>
          </View>

          {/* Estrellas y reseñas */}
          <View style={estilos.estrellas}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={estilos.rating}>4.5</Text>
            <Text style={estilos.reseñas}>({reseñas} reseñas)</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Habitaciones"
        showNavigation={true}
        navigation={navigation}
        activeRoute="Habitaciones"
      />

      {/* Barra de búsqueda */}
      <View style={estilos.seccionBusqueda}>
        <Text style={estilos.tituloBusqueda}>Encuentra tu habitación ideal</Text>
        
        <View style={estilos.buscadorContainer}>
          <TouchableOpacity 
            style={estilos.inputFecha} 
          >
            <Ionicons name="calendar-outline" size={20} color="#C9A961" />
            <View style={estilos.textoFecha}>
              <Text style={estilos.labelFecha}>Check-in</Text>
              <Text style={estilos.valorFecha}>
                {fechaCheckIn ? format(new Date(fechaCheckIn), 'dd/MM/yyyy') : 'Seleccionar'}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={estilos.inputFecha} 
          >
            <Ionicons name="calendar-outline" size={20} color="#C9A961" />
            <View style={estilos.textoFecha}>
              <Text style={estilos.labelFecha}>Check-out</Text>
              <Text style={estilos.valorFecha}>
                {fechaCheckOut ? format(new Date(fechaCheckOut), 'dd/MM/yyyy') : 'Seleccionar'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={estilos.inputHuespedes}>
            <Ionicons name="people-outline" size={20} color="#C9A961" />
            <View style={estilos.contadorHuespedes}>
              <TouchableOpacity onPress={() => setNumHuespedes((numHuespedes || 1) - 1 > 0 ? (numHuespedes || 1) - 1 : 1)}>
                <Ionicons name="remove-circle-outline" size={24} color="#C9A961" />
              </TouchableOpacity>
              <Text style={estilos.numeroHuespedes}>{numHuespedes || 2}</Text>
              <TouchableOpacity onPress={() => setNumHuespedes((numHuespedes || 1) + 1)}>
                <Ionicons name="add-circle-outline" size={24} color="#C9A961" />
              </TouchableOpacity>
            </View>
            <Text style={estilos.labelHuespedes}>Huéspedes</Text>
          </View>
        </View>
      </View>

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
  seccionBusqueda: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tituloBusqueda: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  buscadorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  inputFecha: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  textoFecha: {
    flex: 1,
  },
  labelFecha: {
    fontSize: 11,
    color: '#6B6B6B',
    marginBottom: 2,
  },
  valorFecha: {
    fontSize: 14,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  inputHuespedes: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  contadorHuespedes: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  numeroHuespedes: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    minWidth: 30,
    textAlign: 'center',
  },
  labelHuespedes: {
    fontSize: 11,
    color: '#6B6B6B',
  },
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagenContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  imagen: {
    width: '100%',
    height: '100%',
  },
  badgeTipo: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#C9A961',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  textoTipo: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  infoContainer: {
    padding: 15,
  },
  headerCard: {
    marginBottom: 8,
  },
  tipoHab: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  descripcion: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 12,
    lineHeight: 18,
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  precio: {
    flexDirection: 'column',
  },
  porNoche: {
    fontSize: 12,
    color: '#6B6B6B',
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
  disponibilidadBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dotDisponibilidad: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  dotVerde: {
    backgroundColor: '#10B981',
  },
  textoDisponibilidad: {
    fontSize: 12,
    color: '#6B6B6B',
  },
  estrellas: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  reseñas: {
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