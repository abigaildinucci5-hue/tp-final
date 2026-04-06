import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ReservaExitosaScreen = ({ route, navigation }) => {
  // Recibimos la reserva que viene desde la pantalla anterior
  const { reserva } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        <View style={styles.iconContainer}>
          <Ionicons name="checkmark-circle" size={100} color="#C9A961" />
        </View>

        <Text style={styles.titulo}>¡Reserva Confirmada!</Text>
        <Text style={styles.subtitulo}>
          Tu estadía ha sido reservada con éxito.
        </Text>

        <View style={styles.cardInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Número de Reserva:</Text>
            <Text style={styles.valor}>#{reserva?.id_reserva || reserva?.idReserva || 'N/A'}</Text>
          </View>
          
          <View style={styles.divider} />

          <Text style={styles.nota}>
            Puedes ver los detalles en "Mis Reservas".
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.botonPrincipal}
          onPress={() => navigation.reset({
            index: 0,
            routes: [{ name: 'HomeMain' }],
          })}
        >
          <Text style={styles.textoBotonPrincipal}>Ir al Inicio</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.botonSecundario}
          onPress={() => navigation.navigate('Reservas', { screen: 'MisReservas' })}
        >
          <Text style={styles.textoBotonSecundario}>Ver Mis Reservas</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 30 },
  iconContainer: { marginBottom: 20 },
  titulo: { fontSize: 24, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 10 },
  subtitulo: { fontSize: 16, color: '#6B6B6B', textAlign: 'center', marginBottom: 30 },
  cardInfo: { width: '100%', backgroundColor: '#F8F8F8', borderRadius: 15, padding: 20, marginBottom: 40, borderWidth: 1, borderColor: '#E0E0E0' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  label: { color: '#6B6B6B', fontSize: 14 },
  valor: { color: '#1A1A1A', fontSize: 14, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: 15 },
  nota: { fontSize: 12, color: '#999', textAlign: 'center' },
  botonPrincipal: { backgroundColor: '#C9A961', width: '100%', padding: 18, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  textoBotonPrincipal: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  botonSecundario: { width: '100%', padding: 10, alignItems: 'center' },
  textoBotonSecundario: { color: '#C9A961', fontSize: 16, fontWeight: '600' },
});

export default ReservaExitosaScreen;