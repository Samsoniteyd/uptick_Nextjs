import { useState, useEffect, useCallback, useMemo  } from 'react';
import requisitionService from '@/lib/requisition.service';
import { Requisition, CreateRequisitionData, RequisitionQuery } from '@/types';
import { toast } from 'sonner';

export const useRequisitions = (params?: RequisitionQuery) => {
  const [requisitions, setRequisitions] = useState<Requisition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [operationLoading, setOperationLoading] = useState({
    create: false,
    update: false,
    delete: false,
  });

  const [operationError, setOperationError] = useState({
    create: null as Error | null,
    update: null as Error | null,
    delete: null as Error | null,
  });
  const memoizedParams = useMemo(() => params, [JSON.stringify(params)]);
  const handleError = (err: unknown, message: string) => {
    const errMsg = err instanceof Error ? err.message : message;
    toast.error('Error', { description: errMsg });
    return errMsg;
  };
  const fetchRequisitions = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);
    try {
      const data = await requisitionService.getRequisitions(memoizedParams);
      setRequisitions(data);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
      handleError(err, 'Failed to fetch requisitions');
    } finally {
      setIsLoading(false);
    }
  }, [memoizedParams]);

  useEffect(() => {
    fetchRequisitions();
  }, [fetchRequisitions]);

  const createRequisition = useCallback(async (data: CreateRequisitionData) => {
    setOperationLoading(prev => ({ ...prev, create: true }));
    setOperationError(prev => ({ ...prev, create: null }));

    try {
      const newReq = await requisitionService.createRequisition(data);
      setRequisitions(prev => [...prev, newReq]);
      toast.success('Requisition created successfully');
      return newReq;
    } catch (err) {
      setOperationError(prev => ({ ...prev, create: err as Error }));
      handleError(err, 'Failed to create requisition');
      throw err;
    } finally {
      setOperationLoading(prev => ({ ...prev, create: false }));
    }
  }, []);

  const updateRequisition = useCallback(
    async ({ id, data }: { id: string; data: Partial<CreateRequisitionData> }) => {
      setOperationLoading(prev => ({ ...prev, update: true }));
      setOperationError(prev => ({ ...prev, update: null }));

      try {
        const updatedReq = await requisitionService.updateRequisition(id, data);
       setRequisitions(prev =>
  prev.map(req => req.id === id ? updatedReq : req) // Changed from _id to id
);
        toast.success('Requisition updated successfully');
        return updatedReq;
      } catch (err) {
        setOperationError(prev => ({ ...prev, update: err as Error }));
        handleError(err, 'Failed to update requisition');
        throw err;
      } finally {
        setOperationLoading(prev => ({ ...prev, update: false }));
      }
    },
    []
  );

  const deleteRequisition = useCallback(async (id: string) => {
    setOperationLoading(prev => ({ ...prev, delete: true }));
    setOperationError(prev => ({ ...prev, delete: null }));

    try {
      await requisitionService.deleteRequisition(id);
      setRequisitions(prev => prev.filter(req => req.id !== id));
      toast.success('Requisition deleted successfully');
    } catch (err) {
      setOperationError(prev => ({ ...prev, delete: err as Error }));
      handleError(err, 'Failed to delete requisition');
      throw err;
    } finally {
      setOperationLoading(prev => ({ ...prev, delete: false }));
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
    operationLoading,
    operationError,
    refetch: fetchRequisitions,
  };
};

export const useRequisition = (id: string) => {
  const [requisition, setRequisition] = useState<Requisition | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleError = (err: unknown, message: string) => {
    const errMsg = err instanceof Error ? err.message : message;
    toast.error('Error', { description: errMsg });
    return errMsg;
  };

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
      handleError(err, 'Failed to fetch requisition');
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
    refetch: fetchRequisition,
  };
};
