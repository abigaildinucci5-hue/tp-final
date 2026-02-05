// src/redux/slices/uiSlice.js - Slice de UI (loading, toasts, modales)
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  toast: {
    visible: false,
    mensaje: '',
    tipo: 'info', // info, success, error, warning
  },
  modal: {
    visible: false,
    tipo: 'default',
    titulo: '',
    mensaje: '',
    onConfirm: null,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    showToast: (state, action) => {
      state.toast = {
        visible: true,
        mensaje: action.payload.mensaje,
        tipo: action.payload.tipo || 'info',
      };
    },

    hideToast: (state) => {
      state.toast.visible = false;
    },

    showModal: (state, action) => {
      state.modal = {
        visible: true,
        tipo: action.payload.tipo || 'default',
        titulo: action.payload.titulo || '',
        mensaje: action.payload.mensaje || '',
        onConfirm: action.payload.onConfirm || null,
      };
    },

    hideModal: (state) => {
      state.modal.visible = false;
    },
  },
});

export const { setLoading, showToast, hideToast, showModal, hideModal } = uiSlice.actions;

export const selectUI = (state) => state.ui;
export const selectLoading = (state) => state.ui.loading;
export const selectToast = (state) => state.ui.toast;
export const selectModal = (state) => state.ui.modal;

export default uiSlice.reducer;