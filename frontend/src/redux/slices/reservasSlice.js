// src/redux/slices/reservasSlice.js - Slice de reservas
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reservasService from '../../servicios/reservasService';

const initialState = {
  reservas: [],
  reservaSeleccionada: null,
  historial: {
    activas: [],
    pasadas: [],
    canceladas: [],
  },
  loading: false,
  error: null,
};

// Thunks
export const obtenerReservas = createAsyncThunk(
  'reservas/obtenerReservas',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      const response = await reservasService.obtenerReservas(filtros);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerReserva = createAsyncThunk(
  'reservas/obtenerReserva',
  async (idReserva, { rejectWithValue }) => {
    try {
      const response = await reservasService.obtenerReserva(idReserva);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const crearReserva = createAsyncThunk(
  'reservas/crearReserva',
  async (datosReserva, { rejectWithValue }) => {
    try {
      const response = await reservasService.crearReserva(datosReserva);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const modificarReserva = createAsyncThunk(
  'reservas/modificarReserva',
  async ({ idReserva, datos }, { rejectWithValue }) => {
    try {
      const response = await reservasService.modificarReserva(idReserva, datos);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const cancelarReserva = createAsyncThunk(
  'reservas/cancelarReserva',
  async (idReserva, { rejectWithValue }) => {
    try {
      const response = await reservasService.cancelarReserva(idReserva);
      return { idReserva, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerHistorial = createAsyncThunk(
  'reservas/obtenerHistorial',
  async (_, { rejectWithValue }) => {
    try {
      const response = await reservasService.obtenerHistorial();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const reservasSlice = createSlice({
  name: 'reservas',
  initialState,
  reducers: {
    clearReservaSeleccionada: (state) => {
      state.reservaSeleccionada = null;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    updateReservaLocal: (state, action) => {
      const { idReserva, datos } = action.payload;
      
      // Actualizar en lista de reservas
      const index = state.reservas.findIndex(r => r.id_reserva === idReserva);
      if (index !== -1) {
        state.reservas[index] = { ...state.reservas[index], ...datos };
      }
      
      // Actualizar reserva seleccionada
      if (state.reservaSeleccionada?.id_reserva === idReserva) {
        state.reservaSeleccionada = { ...state.reservaSeleccionada, ...datos };
      }
    },
  },
  extraReducers: (builder) => {
    // Obtener Reservas
    builder
      .addCase(obtenerReservas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerReservas.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(obtenerReservas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Obtener Reserva
    builder
      .addCase(obtenerReserva.pending, (state) => {
        state.loading = true;
      })
      .addCase(obtenerReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.reservaSeleccionada = action.payload;
      })
      .addCase(obtenerReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Crear Reserva
    builder
      .addCase(crearReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas.unshift(action.payload);
      })
      .addCase(crearReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Modificar Reserva
    builder
      .addCase(modificarReserva.pending, (state) => {
        state.loading = true;
      })
      .addCase(modificarReserva.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reservas.findIndex(
          r => r.id_reserva === action.payload.idReserva
        );
        if (index !== -1) {
          state.reservas[index] = { ...state.reservas[index], ...action.payload };
        }
      })
      .addCase(modificarReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Cancelar Reserva
    builder
      .addCase(cancelarReserva.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelarReserva.fulfilled, (state, action) => {
        state.loading = false;
        const { idReserva } = action.payload;
        
        // Actualizar estado en la lista
        const reserva = state.reservas.find(r => r.id_reserva === idReserva);
        if (reserva) {
          reserva.estado = 'cancelada';
        }
        
        // Actualizar reserva seleccionada
        if (state.reservaSeleccionada?.id_reserva === idReserva) {
          state.reservaSeleccionada.estado = 'cancelada';
        }
      })
      .addCase(cancelarReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Obtener Historial
    builder
      .addCase(obtenerHistorial.fulfilled, (state, action) => {
        state.historial = action.payload;
      });
  },
});

export const { clearReservaSeleccionada, clearError, updateReservaLocal } = 
  reservasSlice.actions;

export const selectReservas = (state) => state.reservas.reservas;
export const selectReservaSeleccionada = (state) => state.reservas.reservaSeleccionada;
export const selectHistorial = (state) => state.reservas.historial;
export const selectReservasLoading = (state) => state.reservas.loading;
export const selectReservasError = (state) => state.reservas.error;

export default reservasSlice.reducer;