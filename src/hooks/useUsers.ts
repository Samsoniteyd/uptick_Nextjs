// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';
// import { User } from '@/types';

// export const useUsers = () => {
//   const queryClient = useQueryClient();

//   const { data: users, isLoading, isError, error } = useQuery<User[]>({
//     queryKey: ['users'],
//     queryFn: fetchUsers,
//   });

//   if (isError) {
//     console.error('Failed to fetch users:', error);
//   }

//   const addUser = useMutation({
//     mutationFn: createUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });

//   const editUser = useMutation({
//     mutationFn: updateUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });

//   const removeUser = useMutation({
//     mutationFn: deleteUser,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['users'] });
//     },
//   });

//   return {
//     users: users || [],
//     isLoading,
//     isError,
//     error,
//     addUser: addUser.mutate,
//     editUser: editUser.mutate,
//     removeUser: removeUser.mutate,
//     isAddingUser: addUser.isPending,
//     isEditingUser: editUser.isPending,
//     isRemovingUser: removeUser.isPending,
//   };
// }; 


import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { User, CreateUserData } from '@/types';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<Error | null>(null);

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<Error | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<Error | null>(null);

  // Fetch all users
  const fetchAllUsers = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);
    setError(null);

    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      setIsError(true);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  // Create new user
  const create = useCallback(async (data: CreateUserData) => {
    setIsCreating(true);
    setCreateError(null);

    try {
      const newUser = await createUser(data);
      setUsers(prev => [...prev, newUser]);
      return newUser;
    } catch (err) {
      setCreateError(err as Error);
      throw err;
    } finally {
      setIsCreating(false);
    }
  }, []);

  // Update user
  const update = useCallback(async ({ id, data }: { id: string; data: Partial<CreateUserData> }) => {
    setIsUpdating(true);
    setUpdateError(null);

    try {
      const updated = await updateUser(id, data);
      setUsers(prev => prev.map(user => (user._id === id ? updated : user)));
      return updated;
    } catch (err) {
      setUpdateError(err as Error);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  // Delete user
  const remove = useCallback(async (id: string) => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      await deleteUser(id);
      setUsers(prev => prev.filter(user => user._id !== id));
    } catch (err) {
      setDeleteError(err as Error);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  }, []);

  return {
    users,
    isLoading,
    isError,
    error,
    create,
    update,
    remove,
    isCreating,
    isUpdating,
    isDeleting,
    createError,
    updateError,
    deleteError,
    refetch: fetchAllUsers,
  };
};
