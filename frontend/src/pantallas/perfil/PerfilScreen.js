// frontend/src/pantallas/perfil/PerfilScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, FlatList } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import { useAuth } from '../../hooks/useAuth';
import { useAuth as useAuthContext } from '../../contexto/AuthContext';
import { useRequireAuth } from '../../hooks/useRequireAuth';
import { useReservas } from '../../hooks/useReservas';
import InfoPerfil from '../../componentes/perfil/InfoPerfil';
import Loading from '../../componentes/comun/Loading';

const PerfilScreen = ({ navigation }) => {
  const { usuario, logout } = useAuth();
  const { isAuthenticated } = useAuthContext();
  const { requireAuth } = useRequireAuth();
  const { reservas, cargarReservas } = useReservas();
  const [loadingReservas, setLoadingReservas] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      cargarMisReservas();
    }
  }, [isAuthenticated]);

  const cargarMisReservas = async () => {
    setLoadingReservas(true);
    try {
      await cargarReservas();
    } catch (error) {
      console.error('Error al cargar reservas:', error);
    } finally {
      setLoadingReservas(false);
    }
  };

  const opcionesMenu = [
    { id: 'editar', titulo: 'Editar Perfil', icono: 'account-outline', pantalla: 'EditarPerfil' },
    { id: 'reservas', titulo: 'Mis Reservas', icono: 'calendar-outline', pantalla: 'Reservas', pantalla_nested: 'MisReservasList' },
    { id: 'favoritos', titulo: 'Favoritos', icono: 'heart-outline', pantalla: 'Favoritos' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const renderReserva = ({ item }) => (
    <TouchableOpacity
      style={estilos.reservaCard}
      onPress={() => navigation.navigate('DetalleReserva', { reserva: item })}
    >
      <View style={estilos.reservaHeader}>
        <Text style={estilos.reservaNumero}>Reserva #{item.id_reserva}</Text>
        <View style={[estilos.estadoBadge, { backgroundColor: getColorEstado(item.estado) }]}>
          <Text style={estilos.estadoTexto}>{item.estado}</Text>
        </View>
      </View>
      <Text style={estilos.habitacionTexto}>
        Habitación {item.numero_habitacion} - {item.tipo_habitacion}
      </Text>
      <Text style={estilos.fechasTexto}>
        {new Date(item.fecha_entrada).toLocaleDateString()} - {new Date(item.fecha_salida).toLocaleDateString()}
      </Text>
      <Text style={estilos.precioTexto}>${item.precio_total.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const getColorEstado = (estado) => {
    const colores = {
      'pendiente': '#FFA500',
      'confirmada': '#4CAF50',
      'cancelada': '#F44336',
      'completada': '#2196F3',
      'no_show': '#FF5722'
    };
    return colores[estado] || '#999';
  };

  // ✅ Mostrar UI de no autenticado sin romper navegación
  if (!isAuthenticated) {
    return (
      <View style={[ESTILOS_GLOBALES.container, { justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }]}>
        <MaterialCommunityIcons 
          name="account-circle-outline" 
          size={60} 
          color={COLORES.SECUNDARIO} 
          style={{ marginBottom: 20 }}
        />
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '600',
          color: COLORES.NEGRO,
          marginBottom: 10,
          textAlign: 'center',
        }}>
          Mi Perfil
        </Text>
        <Text style={{ 
          fontSize: 14, 
          color: COLORES.grisTexto,
          marginBottom: 30,
          textAlign: 'center',
        }}>
          Inicia sesión para acceder a tu perfil
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: COLORES.SECUNDARIO,
            paddingHorizontal: 30,
            paddingVertical: 12,
            borderRadius: 8,
          }}
          onPress={requireAuth}
        >
          <Text style={{ 
            color: COLORES.PRIMARIO, 
            fontWeight: '600',
            fontSize: 14,
          }}>
            Iniciar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <InfoPerfil usuario={usuario} />

        <View style={estilos.seccionTitulo}>
          <Text style={estilos.titulo}>Mis Reservas Recientes</Text>
        </View>

        {loadingReservas ? (
          <Loading />
        ) : reservas && reservas.length > 0 ? (
          <View style={estilos.reservasContainer}>
            <FlatList
              data={reservas.slice(0, 3)}
              renderItem={renderReserva}
              keyExtractor={(item) => item.id_reserva.toString()}
              scrollEnabled={false}
            />
            {reservas.length > 3 && (
              <TouchableOpacity
                style={estilos.verMasButton}
                onPress={() => navigation.navigate('Reservas', { screen: 'MisReservasList' })}
              >
                <Text style={estilos.verMasTexto}>Ver todas las reservas</Text>
                <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.primario} />
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={estilos.sinReservas}>
            <MaterialCommunityIcons name="calendar-blank" size={40} color={COLORES.textoMedio} />
            <Text style={estilos.sinReservasTexto}>No tienes reservas aún</Text>
          </View>
        )}

        <View style={estilos.menuContainer}>
          {opcionesMenu.map((opcion) => (
            <TouchableOpacity
              key={opcion.id}
              style={estilos.menuItem}
              onPress={() => {
                if (opcion.pantalla_nested) {
                  navigation.navigate(opcion.pantalla, { screen: opcion.pantalla_nested });
                } else {
                  navigation.navigate(opcion.pantalla);
                }
              }}
            >
              <View style={estilos.menuIcono}>
                <MaterialCommunityIcons name={opcion.icono} size={24} color={COLORES.primario} />
              </View>
              <Text style={estilos.menuTexto}>{opcion.titulo}</Text>
              <MaterialCommunityIcons name="chevron-right" size={20} color={COLORES.textoMedio} />
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={[estilos.menuItem, estilos.logoutItem]} onPress={handleLogout}>
            <View style={estilos.menuIcono}>
              <MaterialCommunityIcons name="logout" size={24} color={COLORES.error} />
            </View>
            <Text style={[estilos.menuTexto, estilos.logoutTexto]}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  perfilContainer: {
    padding: DIMENSIONES.padding,
  },
  seccionTitulo: {
    paddingHorizontal: DIMENSIONES.padding,
    paddingTop: DIMENSIONES.padding,
    paddingBottom: 8,
  },
  titulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  reservasContainer: {
    paddingHorizontal: DIMENSIONES.padding,
    marginBottom: DIMENSIONES.padding,
  },
  reservaCard: {
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORES.primario,
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reservaNumero: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
  },
  estadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  estadoTexto: {
    color: COLORES.fondoBlanco,
    fontSize: 10,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    textTransform: 'capitalize',
  },
  habitacionTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 4,
  },
  fechasTexto: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
    marginBottom: 4,
  },
  precioTexto: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.primario,
  },
  verMasButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 12,
  },
  verMasTexto: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.primario,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
  },
  sinReservas: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  sinReservasTexto: {
    marginTop: 12,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
  },
  menuContainer: {
    padding: DIMENSIONES.padding,
    gap: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    gap: 12,
  },
  menuIcono: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORES.primario + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTexto: {
    flex: 1,
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightMedium,
    color: '#000000',
  },
  logoutItem: {
    marginTop: 16,
  },
  logoutTexto: {
    color: COLORES.error,
  },
});

export default PerfilScreen;
