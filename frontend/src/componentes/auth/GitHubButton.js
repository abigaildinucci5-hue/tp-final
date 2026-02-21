// ============================================
// ARCHIVO 2: GitHubButton.js
// frontend/src/componentes/auth/GitHubButton.js
// ============================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORES } from '../../constantes/colores';

const GitHubButton = ({ onPress, loading = false, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        (disabled || loading) && styles.buttonDisabled
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={COLORES.blanco} size="small" />
        ) : (
          <MaterialCommunityIcons name="github" size={24} color={COLORES.blanco} />
        )}
        <Text style={styles.text}>
          {loading ? 'Conectando...' : 'Continuar con GitHub'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORES.github,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderWidth: 1.5,
    borderColor: COLORES.github,
    marginVertical: 8,
    shadowColor: COLORES.sombra,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORES.blanco,
  },
});

export default GitHubButton;