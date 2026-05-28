import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AssignmentResult, ResultState } from '../types';
import api from '../lib/api';

const initialState: ResultState = {
  currentResult: null,
  isLoading: false,
  error: null,
};

export const fetchResult = createAsyncThunk(
  'result/fetchResult',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{
        success: boolean;
        data: AssignmentResult;
      }>(`/assignments/${assignmentId}/result`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch result'
      );
    }
  }
);

export const regenerateResult = createAsyncThunk(
  'result/regenerate',
  async (assignmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<{
        success: boolean;
        data: { assignmentId: string; message: string };
      }>(`/assignments/${assignmentId}/regenerate`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to regenerate'
      );
    }
  }
);

const resultSlice = createSlice({
  name: 'result',
  initialState,
  reducers: {
    setCurrentResult: (
      state,
      action: PayloadAction<AssignmentResult | null>
    ) => {
      state.currentResult = action.payload;
    },

    clearResult: (state) => {
      state.currentResult = null;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch result
    builder
      .addCase(fetchResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentResult = action.payload as AssignmentResult;
      })
      .addCase(fetchResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Regenerate result
    builder
      .addCase(regenerateResult.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentResult = null;
      })
      .addCase(regenerateResult.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(regenerateResult.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentResult, clearResult, clearError } = resultSlice.actions;
export default resultSlice.reducer;