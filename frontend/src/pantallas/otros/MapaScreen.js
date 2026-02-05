// frontend/src/pantallas/otros/MapaScreen.js
import React from 'react';
import { View, Text, StyleSheet, Linking, Platform, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORES from '../../constantes/colores';
import { DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { HOTEL_INFO, MAPA_CONFIG } from '../../constantes/config';
import HeaderApp from '../../componentes/comun/HeaderApp';
import Boton from '../../componentes/comun/Boton';

const MapaScreen = ({ navigation }) => {
  // Coordenadas del hotel (ajustables según tu ubicación real)
  const latitud = HOTEL_INFO?.coordenadas?.latitud || -34.6037;
  const longitud = HOTEL_INFO?.coordenadas?.longitud || -58.3816;
  const nombreHotel = HOTEL_INFO?.nombre || 'Hotel Luna Serena';
  const direccion = HOTEL_INFO?.direccion || 'Av. Principal 123';

  const handleAbrirMapa = () => {
    const scheme = Platform.select({
      ios: 'maps:0,0?q=',
      android: 'geo:0,0?q=',
    });
    const latLng = `${latitud},${longitud}`;
    const label = nombreHotel;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });

    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'No se pudo abrir la aplicación de mapas');
    });
  };

  const handleAbrirGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/${nombreHotel}/@${latitud},${longitud},15z`;
    Linking.openURL(url);
  };

  const handleLlamar = () => {
    const phone = HOTEL_INFO?.telefono || '+5491234567890';
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = () => {
    const email = HOTEL_INFO?.email || 'info@hotellunaserena.com';
    Linking.openURL(`mailto:${email}`);
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Ubicación"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={estilos.container} showsVerticalScrollIndicator={false}>
        {/* Vista previa estática del mapa */}
        <View style={estilos.mapContainer}>
          <Ionicons name="map" size={80} color="#C9A961" />
          <Text style={estilos.mapPlaceholder}>Hotel Luna Serena</Text>
          <Text style={estilos.coordenadas}>{latitud.toFixed(4)}, {longitud.toFixed(4)}</Text>
        </View>

        {/* Información de ubicación */}
        <View style={estilos.infoSection}>
          <Text style={estilos.sectionTitle}>📍 Ubicación</Text>
          
          <View style={estilos.infoCard}>
            <Ionicons name="location" size={24} color="#C9A961" />
            <View style={estilos.infoText}>
              <Text style={estilos.infoLabel}>Dirección</Text>
              <Text style={estilos.infoValue}>{direccion}</Text>
            </View>
          </View>

          <View style={estilos.infoCard}>
            <Ionicons name="call" size={24} color="#C9A961" />
            <View style={estilos.infoText}>
              <Text style={estilos.infoLabel}>Teléfono</Text>
              <Text style={estilos.infoValue}>{HOTEL_INFO?.telefono || '+54 9 1234 567890'}</Text>
            </View>
          </View>

          <View style={estilos.infoCard}>
            <Ionicons name="mail" size={24} color="#C9A961" />
            <View style={estilos.infoText}>
              <Text style={estilos.infoLabel}>Email</Text>
              <Text style={estilos.infoValue}>{HOTEL_INFO?.email || 'info@hotellunaserena.com'}</Text>
            </View>
          </View>
        </View>

        {/* Opciones de navegación */}
        <View style={estilos.actionSection}>
          <Text style={estilos.sectionTitle}>🧭 Cómo Llegar</Text>

          <TouchableOpacity style={estilos.actionButton} onPress={handleAbrirMapa}>
            <Ionicons name="navigate-circle" size={24} color="#FFFFFF" />
            <Text style={estilos.actionButtonText}>Abrir en Mapas</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[estilos.actionButton, { backgroundColor: '#4285F4' }]} onPress={handleAbrirGoogleMaps}>
            <Ionicons name="globe" size={24} color="#FFFFFF" />
            <Text style={estilos.actionButtonText}>Google Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Contacto rápido */}
        <View style={estilos.contactSection}>
          <Text style={estilos.sectionTitle}>📞 Contacto Rápido</Text>

          <TouchableOpacity style={[estilos.contactButton, { backgroundColor: '#34C759' }]} onPress={handleLlamar}>
            <Ionicons name="call" size={20} color="#FFFFFF" />
            <Text style={estilos.contactButtonText}>Llamar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[estilos.contactButton, { backgroundColor: '#FF9500' }]} onPress={handleEmail}>
            <Ionicons name="mail" size={20} color="#FFFFFF" />
            <Text style={estilos.contactButtonText}>Enviar Email</Text>
          </TouchableOpacity>
        </View>

        {/* Información adicional */}
        <View style={estilos.infoSection}>
          <Text style={estilos.sectionTitle}>ℹ️ Información Útil</Text>

          <View style={estilos.helpCard}>
            <Ionicons name="information-circle" size={24} color="#C9A961" />
            <View>
              <Text style={estilos.helpTitle}>Horario de Recepción</Text>
              <Text style={estilos.helpText}>24 horas, 7 días a la semana</Text>
            </View>
          </View>

          <View style={estilos.helpCard}>
            <Ionicons name="car" size={24} color="#C9A961" />
            <View>
              <Text style={estilos.helpTitle}>Estacionamiento</Text>
              <Text style={estilos.helpText}>Gratuito - Capacidad 150 vehículos</Text>
            </View>
          </View>

          <View style={estilos.helpCard}>
            <Ionicons name="bus" size={24} color="#C9A961" />
            <View>
              <Text style={estilos.helpTitle}>Transporte</Text>
              <Text style={estilos.helpText}>Shuttle al aeropuerto disponible</Text>
            </View>
          </View>
        </View>

        {/* Botón principal */}
        <View style={estilos.buttonContainer}>
          <Boton onPress={handleAbrirMapa} fullWidth icon="navigate">
            Ir Ahora
          </Boton>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  mapContainer: {
    height: 250,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  mapPlaceholder: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 15,
  },
  coordenadas: {
    fontSize: 12,
    color: '#6B6B6B',
    marginTop: 5,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    marginTop: 15,
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 15,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  infoText: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B6B6B',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  actionSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#C9A961',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  contactSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 15,
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    gap: 10,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  helpTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
    marginLeft: 12,
  },
  helpText: {
    fontSize: 13,
    color: '#6B6B6B',
    marginLeft: 12,
    marginTop: 4,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});

export default MapaScreen;