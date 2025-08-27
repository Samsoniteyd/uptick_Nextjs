import api from './axios';
import { 
  Requisition, 
  CreateRequisitionData, 
  ApiResponse, 
  RequisitionQuery 
} from '../types';

class RequisitionService {

  async getRequisitions(params?: RequisitionQuery): Promise<Requisition[]> {
    try {
      const response = await api.get<ApiResponse<{ requisitions: Requisition[] }>>(
        '/api/requisitions',
        { params }
      );
      return response.data.data?.requisitions || [];
    } catch (error: any) {
      console.error('❌ Error fetching requisitions:', error);
      throw new Error('Failed to fetch requisitions. Please check your backend.');
    }
  }

  async getRequisition(id: string): Promise<Requisition> {
    try {
      const response = await api.get<ApiResponse<{ requisition: Requisition }>>(
        `/api/requisitions/${id}`
      );
      return response.data.data!.requisition;
    } catch (error: any) {
      console.error(`❌ Error fetching requisition ${id}:`, error);
      throw new Error(`Failed to fetch requisition with id ${id}.`);
    }
  }

  async createRequisition(data: CreateRequisitionData): Promise<Requisition> {
    try {
      const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
        '/api/requisitions',
        data
      );
      return response.data.data!.requisition;
    } catch (error: any) {
      console.error('❌ Error creating requisition:', error);
      throw new Error('Failed to create requisition. Please check your input.');
    }
  }

  async updateRequisition(id: string, data: Partial<CreateRequisitionData>): Promise<Requisition> {
    try {
      const response = await api.put<ApiResponse<{ requisition: Requisition }>>(
        `/api/requisitions/${id}`,
        data
      );
      return response.data.data!.requisition;
    } catch (error: any) {
      console.error(`❌ Error updating requisition ${id}:`, error);
      throw new Error(`Failed to update requisition with id ${id}.`);
    }
  }

  async deleteRequisition(id: string): Promise<void> {
    try {
      await api.delete(`/api/requisitions/${id}`);
    } catch (error: any) {
      console.error(`❌ Error deleting requisition ${id}:`, error);
      throw new Error(`Failed to delete requisition with id ${id}.`);
    }
  }

  async addNote(id: string, note: string): Promise<Requisition> {
    try {
      const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
        `/api/requisitions/${id}/notes`,
        { text: note }
      );
      return response.data.data!.requisition;
    } catch (error: any) {
      console.error(`❌ Error adding note to requisition ${id}:`, error);
      throw new Error(`Failed to add note to requisition with id ${id}.`);
    }
  }
}

export default new RequisitionService();
