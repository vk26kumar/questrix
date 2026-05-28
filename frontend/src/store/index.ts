import { configureStore } from '@reduxjs/toolkit';
import assignmentReducer from './assignmentSlice';
import resultReducer from './resultSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    assignments: assignmentReducer,
    result: resultReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;