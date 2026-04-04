// frontend/src/componentes/habitaciones/FiltrosAvanzados.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Switch,
  Dimensions,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '@react-native-community/slider';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES } from '../../constantes/estilos';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FiltrosAvanzados = ({ visible, onClose, onApplyFilters }) => {
  const [capacidad, setCapacidad] = useState(2);
  const [precioMin, setPrecioMin] = useState(0);
  const [precioMax, setPrecioMax] = useState(500);
  const [suitPrivada, setSuitPrivada] = useState(false);
  const [balcon, setBalcon] = useState(false);
  const [vistaAlMar, setVistaAlMar] = useState(false);
  const [banyoPrivado, setBanyoPrivado] = useState(false);
  const [climatizado, setClimatizado] = useState(false);

  const handleApplyFilters = () => {
    const filtros = {
      capacidad,
      precioMin,
      precioMax,
      suitPrivada,
      balcon,
      vistaAlMar,
      banyoPrivado,
      climatizado,
    };
    onApplyFilters(filtros);
    onClose();
  };

  const handleReset = () => {
    setCapacidad(2);
    setPrecioMin(0);
    setPrecioMax(500);
    setSuitPrivada(false);
    setBalcon(false);
    setVistaAlMar(false);
    setBanyoPrivado(false);
    setClimatizado(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <LinearGradient
          colors={[COLORES.dorado, COLORES.doradoOscuro]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={COLORES.blanco}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Filtrar Habitaciones</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* CAPACIDAD */}
          <View style={styles.filterSection}>
            <View style={styles.filterTitleRow}>
              <MaterialCommunityIcons
                name="users"
                size={22}
                color={COLORES.dorado}
              />
              <Text style={styles.filterTitle}>Capacidad de Personas</Text>
            </View>
            <View style={styles.sliderContainer}>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={10}
                value={capacidad}
                onValueChange={setCapacidad}
                step={1}
                minimumTrackTintColor={COLORES.dorado}
                maximumTrackTintColor={COLORES.grisClaro}
                thumbTintColor={COLORES.dorado}
              />
              <Text style={styles.sliderValue}>{Math.floor(capacidad)} Personas</Text>
            </View>
          </View>

          {/* RANGO DE PRECIO */}
          <View style={styles.filterSection}>
            <View style={styles.filterTitleRow}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={22}
                color={COLORES.dorado}
              />
              <Text style={styles.filterTitle}>Rango de Precio</Text>
            </View>

            <View style={styles.priceRange}>
              <View>
                <Text style={styles.priceLabel}>Mínimo</Text>
                <Text style={styles.priceValue}>${Math.floor(precioMin)}</Text>
              </View>
              <Text style={styles.priceSeparator}>-</Text>
              <View>
                <Text style={styles.priceLabel}>Máximo</Text>
                <Text style={styles.priceValue}>${Math.floor(precioMax)}</Text>
              </View>
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Precio Mínimo</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={500}
                value={precioMin}
                onValueChange={setPrecioMin}
                step={10}
                minimumTrackTintColor={COLORES.dorado}
                maximumTrackTintColor={COLORES.grisClaro}
                thumbTintColor={COLORES.dorado}
              />
            </View>

            <View style={styles.sliderContainer}>
              <Text style={styles.sliderLabel}>Precio Máximo</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={500}
                value={precioMax}
                onValueChange={setPrecioMax}
                step={10}
                minimumTrackTintColor={COLORES.dorado}
                maximumTrackTintColor={COLORES.grisClaro}
                thumbTintColor={COLORES.dorado}
              />
            </View>
          </View>

          {/* SERVICIOS Y COMODIDADES */}
          <View style={styles.filterSection}>
            <View style={styles.filterTitleRow}>
              <MaterialCommunityIcons
                name="star"
                size={22}
                color={COLORES.dorado}
              />
              <Text style={styles.filterTitle}>Servicios y Comodidades</Text>
            </View>

            <FilterToggle
              icon="door-sliding"
              label="Suite Privada"
              value={suitPrivada}
              onValueChange={setSuitPrivada}
            />

            <FilterToggle
              icon="balcony"
              label="Balcón"
              value={balcon}
              onValueChange={setBalcon}
            />

            <FilterToggle
              icon="water-opacity"
              label="Vista al Mar"
              value={vistaAlMar}
              onValueChange={setVistaAlMar}
            />

            <FilterToggle
              icon="shower"
              label="Baño Privado"
              value={banyoPrivado}
              onValueChange={setBanyoPrivado}
            />

            <FilterToggle
              icon="snowflake"
              label="Aire Acondicionado"
              value={climatizado}
              onValueChange={setClimatizado}
            />
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleReset}
            style={[styles.button, styles.resetButton]}
          >
            <MaterialCommunityIcons
              name="restore"
              size={20}
              color={COLORES.dorado}
            />
            <Text style={styles.resetButtonText}>Limpiar Filtros</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleApplyFilters}
            style={[styles.button, styles.applyButton]}
          >
            <MaterialCommunityIcons
              name="check-circle"
              size={20}
              color={COLORES.blanco}
            />
            <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const FilterToggle = ({ icon, label, value, onValueChange }) => {
  return (
    <View style={styles.toggleItem}>
      <View style={styles.toggleLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={COLORES.dorado}
        />
        <Text style={styles.toggleLabel}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: COLORES.grisClaro,
          true: COLORES.dorado,
        }}
        thumbColor={value ? COLORES.dorado : COLORES.textoGris}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORES.blanco,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: DIMENSIONES.padding,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.blanco,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 16,
  },
  filterSection: {
    paddingHorizontal: DIMENSIONES.padding,
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORES.grisClaro,
  },
  filterTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: TIPOGRAFIA.fontMerriweatherBold,
    color: COLORES.negro,
    marginLeft: 12,
  },
  sliderContainer: {
    marginVertical: 8,
  },
  sliderLabel: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.textoGris,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.dorado,
    marginTop: 8,
    textAlign: 'center',
  },
  priceRange: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORES.fondoClaro,
    borderRadius: 12,
  },
  priceLabel: {
    fontSize: 12,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.textoGris,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 16,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.dorado,
  },
  priceSeparator: {
    fontSize: 14,
    color: COLORES.textoGris,
  },
  toggleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 8,
    backgroundColor: COLORES.fondoClaro,
    borderRadius: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleLabel: {
    fontSize: 14,
    fontFamily: TIPOGRAFIA.fontMontserratMedium,
    color: COLORES.negro,
    marginLeft: 12,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: DIMENSIONES.padding,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: COLORES.grisClaro,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButton: {
    backgroundColor: COLORES.fondoClaro,
    borderWidth: 2,
    borderColor: COLORES.dorado,
  },
  resetButtonText: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.dorado,
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: COLORES.dorado,
  },
  applyButtonText: {
    fontSize: 13,
    fontFamily: TIPOGRAFIA.fontMontserratBold,
    color: COLORES.blanco,
    marginLeft: 8,
  },
});

export default FiltrosAvanzados;
