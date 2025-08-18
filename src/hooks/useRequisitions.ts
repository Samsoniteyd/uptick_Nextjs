import { useState, useEffect, useCallback } from 'react';
import requisitionService from '@/lib/requisition.service';
import { Requisition, CreateRequisitionData, RequisitionQuery } from '@/types';

export const useRequisitions = (params?: RequisitionQuery) => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  const fetchRequisitions = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const data = await requisitionService.getRequisitions(params);
      setRequisitions(data);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  const createRequisition = useCallback(async (data: CreateRequisitionData) => {
    setIsCreating(true);
    setCreateError(null);
    
    try {
      const newRequisition = await requisitionService.createRequisition(data);
      setRequisitions(prev => [...prev, newRequisition]);
      return newRequisition;
    } catch (err) {
      setCreateError(err as Error);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  const updateRequisition = useCallback(async ({ id, data }: { id: string; data: Partial<CreateRequisitionData> }) => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      const updatedRequisition = await requisitionService.updateRequisition(id, data);
      setRequisitions(prev => 
        prev.map(req => req._id === id ? updatedRequisition : req)
      );
      return updatedRequisition;
    } catch (err) {
      setUpdateError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  const deleteRequisition = useCallback(async (id: string) => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await requisitionService.deleteRequisition(id);
      setRequisitions(prev => prev.filter(req => req._id !== id));
    } catch (err) {
      setDeleteError(err as Error);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    requisitions,
    isLoading,
    isError,
    error,
    createRequisition,
    updateRequisition,
    deleteRequisition,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    refetch: fetchRequisitions
  };
};

export const useRequisition = (id: string) => {
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchRequisition = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    setIsError(false);
    setError(null);
    
    try {
      const data = await requisitionService.getRequisition(id);
      setRequisition(data);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequisition();
  }, [fetchRequisition]);

  return {
    requisition,
    isLoading,
    isError,
    error,
    refetch: fetchRequisition
  };
};