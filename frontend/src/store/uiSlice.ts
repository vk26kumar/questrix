import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '../types';

const initialState: UIState = {
  isGenerating: false,
  generationProgress: 0,
  generationMessage: '',
  currentStep: 1,
  sidebarOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
      if (!action.payload) {
        state.generationProgress = 0;
        state.generationMessage = '';
      }
    },

    setGenerationProgress: (
      state,
      action: PayloadAction<{ progress: number; message: string }>
    ) => {
      state.generationProgress = action.payload.progress;
      state.generationMessage = action.payload.message;
    },

    resetGeneration: (state) => {
      state.isGenerating = false;
      state.generationProgress = 0;
      state.generationMessage = '';
    },

    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    nextStep: (state) => {
      state.currentStep += 1;
    },

    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },

    resetStep: (state) => {
      state.currentStep = 1;
    },

    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const {
  setGenerating,
  setGenerationProgress,
  resetGeneration,
  setCurrentStep,
  nextStep,
  prevStep,
  resetStep,
  toggleSidebar,
  setSidebarOpen,
} = uiSlice.actions;

export default uiSlice.reducer;