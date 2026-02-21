// src/redux/store.js - Configuración del Redux Store
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';

// Importar slices
import authReducer from './slices/authSlice';
import habitacionesReducer from './slices/habitacionesSlice';
import reservasReducer from './slices/reservasSlice';
import uiReducer from './slices/uiSlice';

// Configuración de persistencia
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Solo persistir auth
  blacklist: ['ui'], // No persistir UI
};

// Combinar reducers
const rootReducer = combineReducers({
  auth: authReducer,
  habitaciones: habitacionesReducer,
  reservas: reservasReducer,
  ui: uiReducer,
});

// Crear reducer persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configurar store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignorar tanto las acciones de persistencia como los thunks que pueden tener Promises
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          // Ignorar todos los thunks pending/rejected (que contienen Promises)
          /.*\/pending$/,
          /.*\/rejected$/,
        ],
        // Ignorar path 'auth' que contiene Promises temporales
        ignoredPaths: ['auth'],
      },
    }),
});

// Crear persistor
export const persistor = persistStore(store);

export default store;