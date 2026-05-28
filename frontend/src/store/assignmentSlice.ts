import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Assignment, AssignmentFormData, AssignmentState, QuestionTypeConfig } from '../types';
import api from '../lib/api';

//Initial Form Data
const initialFormData: AssignmentFormData = {
  title: '',
  subject: '',
  className: '',
  schoolName: 'Delhi Public School, Sector-4, Bokaro',
  dueDate: '',
  timeAllowed: '45 minutes',
  questionTypes: [
    {
      id: '1',
      type: 'Multiple Choice Questions',
      numberOfQuestions: 4,
      marksPerQuestion: 1,
    },
    {
      id: '2',
      type: 'Short Questions',
      numberOfQuestions: 3,
      marksPerQuestion: 2,
    },
  ],
  totalQuestions: 7,
  totalMarks: 10,
  additionalInstructions: '',
  file: null,
};

const initialState: AssignmentState & {
  formData: AssignmentFormData;
  formFile: File | null;
} = {
  assignments: [],
  currentAssignment: null,
  isLoading: false,
  error: null,
  formData: initialFormData,
  formFile: null,
};

//Async Thunks
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<{ success: boolean; data: Assignment[] }>(
        '/assignments'
      );
      return response.data.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assignments'
      );
    }
  }
);

export const fetchAssignment = createAsyncThunk(
  'assignments/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<{ success: boolean; data: Assignment }>(
        `/assignments/${id}`
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch assignment'
      );
    }
  }
);

export const createAssignment = createAsyncThunk(
  'assignments/create',
  async (
    formData: Omit<AssignmentFormData, 'file' | 'questionTypes'> & {
      questionTypes: { type: string; numberOfQuestions: number; marksPerQuestion: number }[];
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post<{
        success: boolean;
        data: { assignmentId: string; message: string };
      }>('/assignments', formData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create assignment'
      );
    }
  }
);

export const deleteAssignment = createAsyncThunk(
  'assignments/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/assignments/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete assignment'
      );
    }
  }
);

//Slice
const assignmentSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    setFormData: (
      state,
      action: PayloadAction<Partial<AssignmentFormData>>
    ) => {
      state.formData = { ...state.formData, ...action.payload };
    },

    setFormFile: (state, action: PayloadAction<File | null>) => {
      state.formFile = action.payload;
    },

    resetFormData: (state) => {
      state.formData = initialFormData;
      state.formFile = null;
    },
    addQuestionType: (state) => {
      const newId = Date.now().toString();
      state.formData.questionTypes.push({
        id: newId,
        type: 'Short Questions',
        numberOfQuestions: 1,
        marksPerQuestion: 1,
      });
      recalculateTotals(state.formData);
    },
    removeQuestionType: (state, action: PayloadAction<string>) => {
      state.formData.questionTypes = state.formData.questionTypes.filter(
        (qt) => qt.id !== action.payload
      );
      recalculateTotals(state.formData);
    },

    updateQuestionType: (
      state,
      action: PayloadAction<{ id: string; updates: Partial<QuestionTypeConfig> }>
    ) => {
      const index = state.formData.questionTypes.findIndex(
        (qt) => qt.id === action.payload.id
      );
      if (index !== -1) {
        state.formData.questionTypes[index] = {
          ...state.formData.questionTypes[index],
          ...action.payload.updates,
        };
        recalculateTotals(state.formData);
      }
    },
    clearError: (state) => {
      state.error = null;
    },

    setCurrentAssignment: (
      state,
      action: PayloadAction<Assignment | null>
    ) => {
      state.currentAssignment = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = action.payload as Assignment[];
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(fetchAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAssignment = action.payload as Assignment;
      })
      .addCase(fetchAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createAssignment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAssignment.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteAssignment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignments = state.assignments.filter(
          (a) => a._id !== action.payload
        );
      })
      .addCase(deleteAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

//Helper 
const recalculateTotals = (formData: AssignmentFormData): void => {
  formData.totalQuestions = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions,
    0
  );
  formData.totalMarks = formData.questionTypes.reduce(
    (sum, qt) => sum + qt.numberOfQuestions * qt.marksPerQuestion,
    0
  );
};

//Exports
export const {
  setFormData,
  setFormFile,
  resetFormData,
  addQuestionType,
  removeQuestionType,
  updateQuestionType,
  clearError,
  setCurrentAssignment,
} = assignmentSlice.actions;

export default assignmentSlice.reducer;