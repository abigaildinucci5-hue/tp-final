// src/redux/slices/habitacionesSlice.js - Slice de habitaciones
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as habitacionesService from '../../servicios/habitacionesService';

const initialState = {
  habitaciones: [],
  habitacionSeleccionada: null,
  habitacionesDisponibles: [],
  habitacionesPopulares: [],
  categorias: [],
  favoritos: [],
  tiposHabitacion: [],
  filtros: {
    tipo: null,
    precioMin: null,
    precioMax: null,
    capacidad: null,
    vista: null,
  },
  paginacion: {
    pagina: 1,
    limite: 10,
    total: 0,
  },
  loading: false,
  error: null,
};

// Thunks
export const obtenerHabitaciones = createAsyncThunk(
  'habitaciones/obtenerHabitaciones',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerHabitaciones(filtros);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerHabitacion = createAsyncThunk(
  'habitaciones/obtenerHabitacion',
  async (idHabitacion, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerHabitacion(idHabitacion);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const verificarDisponibilidad = createAsyncThunk(
  'habitaciones/verificarDisponibilidad',
  async ({ idHabitacion, fechaEntrada, fechaSalida }, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.verificarDisponibilidad(
        idHabitacion,
        fechaEntrada,
        fechaSalida
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerTiposHabitacion = createAsyncThunk(
  'habitaciones/obtenerTiposHabitacion',
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerTiposHabitacion();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const toggleFavorito = createAsyncThunk(
  'habitaciones/toggleFavorito',
  async (idHabitacion, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.toggleFavorito(idHabitacion);
      return { idHabitacion, esFavorito: response.data.esFavorito };
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const obtenerFavoritos = createAsyncThunk(
  'habitaciones/obtenerFavoritos',
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerFavoritos();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchHabitaciones = createAsyncThunk(
  'habitaciones/fetchHabitaciones',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerHabitaciones(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchHabitacionById = createAsyncThunk(
  'habitaciones/fetchHabitacionById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerHabitacion(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const buscarHabitacionesDisponibles = createAsyncThunk(
  'habitaciones/buscarHabitacionesDisponibles',
  async ({ fechaInicio, fechaFin, cantidadPersonas }, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.buscarHabitacionesDisponibles(fechaInicio, fechaFin, cantidadPersonas);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const buscarHabitaciones = createAsyncThunk(
  'habitaciones/buscarHabitaciones',
  async (filtros, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.buscarHabitaciones(filtros);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchCategorias = createAsyncThunk(
  'habitaciones/fetchCategorias',
  async (_, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerCategorias();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchHabitacionesPopulares = createAsyncThunk(
  'habitaciones/fetchHabitacionesPopulares',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await habitacionesService.obtenerHabitacionesPopulares(limit);
      // El backend retorna { exito: true, data: [...], total: ... }
      // Extraemos solo el array de datos
      return response.data?.data || [];
    } catch (error) {
      // Fallback: datos de demostración cuando falla la conexión
      console.warn('No se pudo conectar al servidor. Mostrando datos de demostración.');
      
      const datosDemo = [
        {
          id_habitacion: 1,
          numero_habitacion: 101,
          tipo_habitacion: 'Suite Deluxe',
          descripcion: 'Habitación de lujo con vista al mar',
          precio_por_noche: 299.99,
          capacidad_personas: 2,
          imagen_principal: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.8,
          reviews: 125,
        },
        {
          id_habitacion: 2,
          numero_habitacion: 102,
          tipo_habitacion: 'Habitación Premium',
          descripcion: 'Habitación premium con balcón privado',
          precio_por_noche: 199.99,
          capacidad_personas: 2,
          imagen_principal: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.6,
          reviews: 89,
        },
        {
          id_habitacion: 3,
          numero_habitacion: 103,
          tipo_habitacion: 'Habitación Estándar',
          descripcion: 'Habitación cómoda para viajeros',
          precio_por_noche: 129.99,
          capacidad_personas: 2,
          imagen_principal: 'https://images.unsplash.com/photo-1618773421522-1924a8ff320e?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.5,
          reviews: 156,
        },
        {
          id_habitacion: 4,
          numero_habitacion: 201,
          tipo_habitacion: 'Suite Presidencial',
          descripcion: 'Suite presidencial con amenidades de lujo',
          precio_por_noche: 499.99,
          capacidad_personas: 4,
          imagen_principal: 'https://images.unsplash.com/photo-1582719560660-8f8b7e2e0f8f?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.9,
          reviews: 203,
        },
        {
          id_habitacion: 5,
          numero_habitacion: 202,
          tipo_habitacion: 'Habitación Familiar',
          descripcion: 'Espaciosa para familias completas',
          precio_por_noche: 249.99,
          capacidad_personas: 4,
          imagen_principal: 'https://images.unsplash.com/photo-1596178065887-3198b3c17ff5?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.7,
          reviews: 134,
        },
        {
          id_habitacion: 6,
          numero_habitacion: 203,
          tipo_habitacion: 'Habitación Económica',
          descripcion: 'Presupuesto amigable sin comprometer confort',
          precio_por_noche: 89.99,
          capacidad_personas: 1,
          imagen_principal: 'https://images.unsplash.com/photo-1583422409516-2895a77f5ea5?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.4,
          reviews: 97,
        },
        {
          id_habitacion: 7,
          numero_habitacion: 204,
          tipo_habitacion: 'Suite Junior',
          descripcion: 'Suite accesible con excelente relación precio',
          precio_por_noche: 179.99,
          capacidad_personas: 2,
          imagen_principal: 'https://images.unsplash.com/photo-1566665556112-652021bbb5e6?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.6,
          reviews: 78,
        },
        {
          id_habitacion: 8,
          numero_habitacion: 205,
          tipo_habitacion: 'Habitación Conectada',
          descripcion: 'Habitaciones conectadas para grupos',
          precio_por_noche: 229.99,
          capacidad_personas: 3,
          imagen_principal: 'https://images.unsplash.com/photo-1611892473144-211b5e2e4dea?w=800&h=600&fit=crop',
          estado: 'disponible',
          puntuacion: 4.5,
          reviews: 112,
        },
      ].slice(0, limit || 5);
      
      return datosDemo;
    }
  }
);

const habitacionesSlice = createSlice({
  name: 'habitaciones',
  initialState,
  reducers: {
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    
    clearFiltros: (state) => {
      state.filtros = initialState.filtros;
    },
    
    clearHabitacionSeleccionada: (state) => {
      state.habitacionSeleccionada = null;
    },
    
    setHabitacionSeleccionada: (state, action) => {
      state.habitacionSeleccionada = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener Habitaciones
    builder
      .addCase(obtenerHabitaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(obtenerHabitaciones.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.habitaciones = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(obtenerHabitaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Obtener Habitación
    builder
      .addCase(obtenerHabitacion.pending, (state) => {
        state.loading = true;
      })
      .addCase(obtenerHabitacion.fulfilled, (state, action) => {
        state.loading = false;
        state.habitacionSeleccionada = action.payload;
      })
      .addCase(obtenerHabitacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Tipos de Habitación
    builder
      .addCase(obtenerTiposHabitacion.fulfilled, (state, action) => {
        state.tiposHabitacion = action.payload;
      });

    // Toggle Favorito
    builder
      .addCase(toggleFavorito.fulfilled, (state, action) => {
        const { idHabitacion, esFavorito } = action.payload;
        
        // Actualizar en lista de habitaciones
        const habitacion = state.habitaciones.find(h => h.id_habitacion === idHabitacion);
        if (habitacion) {
          habitacion.es_favorito = esFavorito;
        }
        
        // Actualizar habitación seleccionada
        if (state.habitacionSeleccionada?.id_habitacion === idHabitacion) {
          state.habitacionSeleccionada.es_favorito = esFavorito;
        }
        
        // Actualizar lista de favoritos
        if (esFavorito) {
          if (!state.favoritos.find(f => f.id_habitacion === idHabitacion)) {
            state.favoritos.push(habitacion || state.habitacionSeleccionada);
          }
        } else {
          state.favoritos = state.favoritos.filter(f => f.id_habitacion !== idHabitacion);
        }
      });

    // Obtener Favoritos
    builder
      .addCase(obtenerFavoritos.fulfilled, (state, action) => {
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.favoritos = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      });

    // Fetch Habitaciones
    builder
      .addCase(fetchHabitaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabitaciones.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.habitaciones = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(fetchHabitaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Fetch Habitacion By Id
    builder
      .addCase(fetchHabitacionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabitacionById.fulfilled, (state, action) => {
        state.loading = false;
        state.habitacionSeleccionada = action.payload;
      })
      .addCase(fetchHabitacionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Buscar Habitaciones Disponibles
    builder
      .addCase(buscarHabitacionesDisponibles.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscarHabitacionesDisponibles.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.habitacionesDisponibles = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(buscarHabitacionesDisponibles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Buscar Habitaciones
    builder
      .addCase(buscarHabitaciones.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscarHabitaciones.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.habitaciones = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(buscarHabitaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });

    // Fetch Categorias
    builder
      .addCase(fetchCategorias.fulfilled, (state, action) => {
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.categorias = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      });

    // Fetch Habitaciones Populares
    builder
      .addCase(fetchHabitacionesPopulares.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabitacionesPopulares.fulfilled, (state, action) => {
        state.loading = false;
        // ✅ Extraer el array de la propiedad 'data' si viene en ese formato
        state.habitacionesPopulares = Array.isArray(action.payload) ? action.payload : action.payload.data || [];
      })
      .addCase(fetchHabitacionesPopulares.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.mensaje;
      });
  },
});

export const { setFiltros, clearFiltros, clearHabitacionSeleccionada, setHabitacionSeleccionada, clearError } = 
  habitacionesSlice.actions;

export const selectHabitaciones = (state) => state.habitaciones.habitaciones;
export const selectHabitacionSeleccionada = (state) => state.habitaciones.habitacionSeleccionada;
export const selectFavoritos = (state) => state.habitaciones.favoritos;
export const selectTiposHabitacion = (state) => state.habitaciones.tiposHabitacion;
export const selectFiltros = (state) => state.habitaciones.filtros;
export const selectHabitacionesLoading = (state) => state.habitaciones.loading;

export default habitacionesSlice.reducer;