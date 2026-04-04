import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../servicios/api'; // Importamos la instancia única
import { STORAGE_KEYS, API_ENDPOINTS } from '../../constantes/config';

// Thunk para Login
export const login = createAsyncThunk(
  'auth/login',
  async (credenciales, { rejectWithValue }) => {
    try {
      // Usamos el endpoint que definiste en config.js
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, credenciales);
      
      // IMPORTANTE: Según tu backend, el token puede venir en response.token o response.data.token
      const token = response.token || response.data?.token;
      const usuario = response.usuario || response.data?.user;

      if (token) {
        // Guardamos usando la KEY unificada: 'auth_token'
        await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
        await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(usuario));
      }

      return { token, usuario };
    } catch (error) {
      return rejectWithValue(error.message || 'Error al iniciar sesión');
    }
  }
);

// Thunk para Logout
export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    return null;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    usuario: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    // Para restaurar la sesión al abrir la app
    setSesion: (state, action) => {
      state.usuario = action.payload.usuario;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.usuario = null;
        state.token = null;
      });
  },
});

export const { setSesion } = authSlice.actions;
export default authSlice.reducer;