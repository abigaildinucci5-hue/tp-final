import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';

const ContactoMainScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titulo}>Contacto</Text>
          <Text style={styles.subtitulo}>¿Cómo podemos ayudarte?</Text>
        </View>

        {/* INFORMACIÓN DE CONTACTO */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Información de Contacto</Text>

          <TouchableOpacity style={styles.itemContacto}>
            <MaterialCommunityIcons name="phone" size={24} color={COLORES.SECUNDARIO} />
            <View style={styles.infoContacto}>
              <Text style={styles.labelContacto}>Teléfono</Text>
              <Text style={styles.textoContacto}>+54 (11) 1234-5678</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContacto}>
            <MaterialCommunityIcons name="email-outline" size={24} color={COLORES.SECUNDARIO} />
            <View style={styles.infoContacto}>
              <Text style={styles.labelContacto}>Email</Text>
              <Text style={styles.textoContacto}>info@lunaserana.com</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContacto}>
            <MaterialCommunityIcons name="map-marker-outline" size={24} color={COLORES.SECUNDARIO} />
            <View style={styles.infoContacto}>
              <Text style={styles.labelContacto}>Dirección</Text>
              <Text style={styles.textoContacto}>Av. Principal 1234, Buenos Aires</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.itemContacto}>
            <MaterialCommunityIcons name="clock-outline" size={24} color={COLORES.SECUNDARIO} />
            <View style={styles.infoContacto}>
              <Text style={styles.labelContacto}>Horario de Atención</Text>
              <Text style={styles.textoContacto}>24/7</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* REDES SOCIALES */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Síguenos en Redes</Text>
          <View style={styles.redesContainer}>
            <TouchableOpacity style={styles.botonRed}>
              <MaterialCommunityIcons name="facebook" size={32} color="#1877F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonRed}>
              <MaterialCommunityIcons name="instagram" size={32} color="#E4405F" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonRed}>
              <MaterialCommunityIcons name="twitter" size={32} color="#1DA1F2" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.botonRed}>
              <MaterialCommunityIcons name="whatsapp" size={32} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>

        {/* FORMULARIO DE CONTACTO */}
        <View style={styles.seccion}>
          <Text style={styles.tituloSeccion}>Envíanos un Mensaje</Text>
          <TouchableOpacity style={styles.botonMensaje}>
            <MaterialCommunityIcons name="email-send-outline" size={20} color="#fff" />
            <Text style={styles.textoBotonMensaje}>Escribir Mensaje</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitulo: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  seccion: {
    backgroundColor: '#fff',
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  tituloSeccion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  itemContacto: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoContacto: {
    marginLeft: 16,
    flex: 1,
  },
  labelContacto: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  textoContacto: {
    fontSize: 14,
    color: '#1a1a1a',
    fontWeight: '500',
    marginTop: 4,
  },
  redesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  botonRed: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  botonMensaje: {
    backgroundColor: COLORES.SECUNDARIO,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  textoBotonMensaje: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ContactoMainScreen;
