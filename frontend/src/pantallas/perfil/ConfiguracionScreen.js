// frontend/src/pantallas/perfil/ConfiguracionScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import COLORES from '../../constantes/colores';
import { TIPOGRAFIA, DIMENSIONES, ESTILOS_GLOBALES } from '../../constantes/estilos';
import HeaderApp from '../../componentes/comun/HeaderApp';
import { guardarConfigNotificaciones, obtenerConfigNotificaciones } from '../../utils/storage';

const ConfiguracionScreen = ({ navigation }) => {
  const [notifReservas, setNotifReservas] = useState(true);
  const [notifPromociones, setNotifPromociones] = useState(true);
  const [notifRecordatorios, setNotifRecordatorios] = useState(true);

  const handleToggleNotif = async (tipo, valor) => {
    const config = await obtenerConfigNotificaciones();
    config[tipo] = valor;
    await guardarConfigNotificaciones(config);

    switch (tipo) {
      case 'reservas':
        setNotifReservas(valor);
        break;
      case 'promociones':
        setNotifPromociones(valor);
        break;
      case 'recordatorios':
        setNotifRecordatorios(valor);
        break;
    }
  };

  return (
    <View style={ESTILOS_GLOBALES.container}>
      <HeaderApp
        title="Configuración"
        leftIcon="chevron-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView style={estilos.container}>
        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Notificaciones</Text>

          <View style={estilos.opcion}>
            <View style={estilos.opcionInfo}>
              <Text style={estilos.opcionTitulo}>Reservas</Text>
              <Text style={estilos.opcionDescripcion}>
                Recibe notificaciones sobre tus reservas
              </Text>
            </View>
            <Switch
              value={notifReservas}
              onValueChange={(val) => handleToggleNotif('reservas', val)}
              trackColor={{ false: COLORES.textoClaro, true: COLORES.primario }}
            />
          </View>

          <View style={estilos.opcion}>
            <View style={estilos.opcionInfo}>
              <Text style={estilos.opcionTitulo}>Promociones</Text>
              <Text style={estilos.opcionDescripcion}>
                Recibe ofertas y promociones especiales
              </Text>
            </View>
            <Switch
              value={notifPromociones}
              onValueChange={(val) => handleToggleNotif('promociones', val)}
              trackColor={{ false: COLORES.textoClaro, true: COLORES.primario }}
            />
          </View>

          <View style={estilos.opcion}>
            <View style={estilos.opcionInfo}>
              <Text style={estilos.opcionTitulo}>Recordatorios</Text>
              <Text style={estilos.opcionDescripcion}>
                Recordatorios de check-in y check-out
              </Text>
            </View>
            <Switch
              value={notifRecordatorios}
              onValueChange={(val) => handleToggleNotif('recordatorios', val)}
              trackColor={{ false: COLORES.textoClaro, true: COLORES.primario }}
            />
          </View>
        </View>

        <View style={estilos.seccion}>
          <Text style={estilos.seccionTitulo}>Información</Text>
          <View style={estilos.infoItem}>
            <Text style={estilos.infoLabel}>Versión de la App</Text>
            <Text style={estilos.infoValor}>1.0.0</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: DIMENSIONES.padding,
  },
  seccion: {
    marginBottom: 24,
  },
  seccionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeLarge,
    fontWeight: TIPOGRAFIA.fontWeightBold,
    color: COLORES.textoOscuro,
    marginBottom: 16,
  },
  opcion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
    marginBottom: 12,
  },
  opcionInfo: {
    flex: 1,
    marginRight: 12,
  },
  opcionTitulo: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
    marginBottom: 4,
  },
  opcionDescripcion: {
    fontSize: TIPOGRAFIA.fontSizeSmall,
    color: COLORES.textoMedio,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORES.fondoBlanco,
    padding: DIMENSIONES.padding,
    borderRadius: DIMENSIONES.borderRadius,
  },
  infoLabel: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    color: COLORES.textoMedio,
  },
  infoValor: {
    fontSize: TIPOGRAFIA.fontSizeMedium,
    fontWeight: TIPOGRAFIA.fontWeightSemiBold,
    color: COLORES.textoOscuro,
  },
});

export default ConfiguracionScreen;