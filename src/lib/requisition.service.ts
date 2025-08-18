import api from './axios';
import { 
  Requisition, 
  CreateRequisitionData, 
  ApiResponse, 
  RequisitionQuery 
} from '../types';

class RequisitionService {
  
  async getRequisitions(params?: RequisitionQuery): Promise<Requisition[]> {
    const response = await api.get<ApiResponse<{ requisitions: Requisition[] }>>(
      '/api/requisitions',
      { params }
    );
    return response.data.data!.requisitions;
  }

  
  async getRequisition(id: string): Promise<Requisition> {
    try {
      const response = await api.get(`/api/requisitions/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching requisition:', error);
      throw error;
    }
  }

  async createRequisition(data: CreateRequisitionData): Promise<Requisition> {
    const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
      '/api/requisitions',
      data
    );
    return response.data.data!.requisition;
  }


  async updateRequisition(id: string, data: Partial<CreateRequisitionData>): Promise<Requisition> {
    console.log('Updating requisition:', { id, data });
    
    try {
      
      const response = await api.patch<ApiResponse<{ requisition: Requisition }>>(
        `/api/requisitions/${id}`,
        data
      );
      return response.data.data!.requisition;
    } catch (error) {
      console.error('PATCH failed, trying PUT...', error);
      
      
      try {
        const response = await api.put<ApiResponse<{ requisition: Requisition }>>(
          `/api/requisitions/${id}`,
          data
        );
        return response.data.data!.requisition;
      } catch (putError) {
        console.error('Both PATCH and PUT failed:', putError);
        throw putError;
      }
    }
  }

  
  async deleteRequisition(id: string): Promise<void> {
    await api.delete(`/api/requisitions/${id}`);
  }

  
  async addNote(id: string, note: string): Promise<Requisition> {
    const response = await api.post<ApiResponse<{ requisition: Requisition }>>(
      `/api/requisitions/${id}/notes`,
      { text: note }
    );
    return response.data.data!.requisition;
  }
}

export default new RequisitionService(); 