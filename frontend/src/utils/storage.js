// src/utils/storage.js
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const isWeb = Platform.OS === 'web';

const storage = {
  async get(key) {
    try {
      if (isWeb) {
        return localStorage.getItem(key);
      }
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },

  async set(key, value) {
    try {
      if (isWeb) {
        localStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch {}
  },

  async remove(key) {
    try {
      if (isWeb) {
        localStorage.removeItem(key);
      } else {
        await AsyncStorage.removeItem(key);
      }
    } catch {}
  },

  async multiRemove(keys) {
    try {
      if (isWeb) {
        keys.forEach(k => localStorage.removeItem(k));
      } else {
        await AsyncStorage.multiRemove(keys);
      }
    } catch {}
  },
};

export default storage;
