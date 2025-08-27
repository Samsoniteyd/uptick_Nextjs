import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Requisition } from '@/types';

interface RequisitionState {
  requisitions: Requisition[];
  loading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
}

const initialState: RequisitionState = {
  requisitions: [],
  loading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
};

const requisitionSlice = createSlice({
  name: 'requisitions',
  initialState,
  reducers: {
    fetchRequisitionsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchRequisitionsSuccess(state, action: PayloadAction<Requisition[]>) {
      state.requisitions = action.payload;
      state.loading = false;
    },
    fetchRequisitionsFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    createRequisitionStart(state) {
      state.isCreating = true;
      state.error = null;
    },
    createRequisitionSuccess(state, action: PayloadAction<Requisition>) {
      state.requisitions.push(action.payload);
      state.isCreating = false;
    },
    createRequisitionFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isCreating = false;
    },
    updateRequisitionStart(state) {
      state.isUpdating = true;
      state.error = null;
    },
    updateRequisitionSuccess(state, action: PayloadAction<Requisition>) {
      const index = state.requisitions.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requisitions[index] = action.payload;
      }
      state.isUpdating = false;
    },
    updateRequisitionFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isUpdating = false;
    },
    deleteRequisitionStart(state) {
      state.isDeleting = true;
      state.error = null;
    },
    deleteRequisitionSuccess(state, action: PayloadAction<string>) {
      state.requisitions = state.requisitions.filter(req => req.id !== action.payload);
      state.isDeleting = false;
    },
    deleteRequisitionFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.isDeleting = false;
    },
  },
});

export const {
  fetchRequisitionsStart,
  fetchRequisitionsSuccess,
  fetchRequisitionsFailure,
  createRequisitionStart,
  createRequisitionSuccess,
  createRequisitionFailure,
  updateRequisitionStart,
  updateRequisitionSuccess,
  updateRequisitionFailure,
  deleteRequisitionStart,
  deleteRequisitionSuccess,
  deleteRequisitionFailure,
} = requisitionSlice.actions;

export default requisitionSlice.reducer;