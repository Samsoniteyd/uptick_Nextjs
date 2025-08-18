import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/features/auth/authSlice';
import requisitionReducer from '@/features/requisitions/requisitionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    requisitions: requisitionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;