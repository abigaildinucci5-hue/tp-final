// src/redux/slices/notificacionesSlice.js - Slice de notificaciones
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as notificacionesService from '../../servicios/notificacionesService';

const initialState = {
  notificaciones: [],
  noLeidas: [],
  cantidadNoLeidas: 0,
  loading: false,
  error: null,
};

// Thunks
export const obtenerNotificaciones = createAsyncThunk(
  'notificaciones/obtenerNotificaciones',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesService.obtenerNotificaciones();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerNoLeidas = createAsyncThunk(
  'notificaciones/obtenerNoLeidas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesService.obtenerNoLeidas();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerCantidadNoLeidas = createAsyncThunk(
  'notificaciones/obtenerCantidadNoLeidas',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificacionesService.obtenerCantidadNoLeidas();
      return response.data.cantidad;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const marcarLeida = createAsyncThunk(
  'notificaciones/marcarLeida',
  async (idNotificacion, { rejectWithValue }) => {
    try {
      await notificacionesService.marcarLeida(idNotificacion);
      return idNotificacion;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const marcarTodasLeidas = createAsyncThunk(
  'notificaciones/marcarTodasLeidas',
  async (_, { rejectWithValue }) => {
    try {
      await notificacionesService.marcarTodasLeidas();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const eliminarNotificacion = createAsyncThunk(
  'notificaciones/eliminarNotificacion',
  async (idNotificacion, { rejectWithValue }) => {
    try {
      await notificacionesService.eliminarNotificacion(idNotificacion);
      return idNotificacion;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const limpiarTodas = createAsyncThunk(
  'notificaciones/limpiarTodas',
  async (_, { rejectWithValue }) => {
    try {
      await notificacionesService.limpiarTodas();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState,
  reducers: {
    agregarNotificacion: (state, action) => {
      state.notificaciones.unshift(action.payload);
      state.noLeidas.unshift(action.payload);
      state.cantidadNoLeidas += 1;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener Notificaciones
    builder
      .addCase(obtenerNotificaciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(obtenerNotificaciones.fulfilled, (state, action) => {
        state.loading = false;
        state.notificaciones = action.payload;
      })
      .addCase(obtenerNotificaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Obtener No Leídas
    builder
      .addCase(obtenerNoLeidas.fulfilled, (state, action) => {
        state.noLeidas = action.payload;
      });

    // Obtener Cantidad No Leídas
    builder
      .addCase(obtenerCantidadNoLeidas.fulfilled, (state, action) => {
        state.cantidadNoLeidas = action.payload;
      });

    // Marcar Leída
    builder
      .addCase(marcarLeida.fulfilled, (state, action) => {
        const idNotificacion = action.payload;
        
        // Actualizar en lista de notificaciones
        const notificacion = state.notificaciones.find(
          n => n.id_notificacion === idNotificacion
        );
        if (notificacion) {
          notificacion.leida = true;
        }
        
        // Remover de no leídas
        state.noLeidas = state.noLeidas.filter(
          n => n.id_notificacion !== idNotificacion
        );
        
        // Decrementar contador
        if (state.cantidadNoLeidas > 0) {
          state.cantidadNoLeidas -= 1;
        }
      });

    // Marcar Todas Leídas
    builder
      .addCase(marcarTodasLeidas.fulfilled, (state) => {
        state.notificaciones.forEach(n => n.leida = true);
        state.noLeidas = [];
        state.cantidadNoLeidas = 0;
      });

    // Eliminar Notificación
    builder
      .addCase(eliminarNotificacion.fulfilled, (state, action) => {
        const idNotificacion = action.payload;
        
        state.notificaciones = state.notificaciones.filter(
          n => n.id_notificacion !== idNotificacion
        );
        
        state.noLeidas = state.noLeidas.filter(
          n => n.id_notificacion !== idNotificacion
        );
      });

    // Limpiar Todas
    builder
      .addCase(limpiarTodas.fulfilled, (state) => {
        state.notificaciones = [];
        state.noLeidas = [];
        state.cantidadNoLeidas = 0;
      });
  },
});

export const { agregarNotificacion, clearError } = notificacionesSlice.actions;

export const selectNotificaciones = (state) => state.notificaciones.notificaciones;
export const selectNoLeidas = (state) => state.notificaciones.noLeidas;
export const selectCantidadNoLeidas = (state) => state.notificaciones.cantidadNoLeidas;
export const selectNotificacionesLoading = (state) => state.notificaciones.loading;

export default notificacionesSlice.reducer;