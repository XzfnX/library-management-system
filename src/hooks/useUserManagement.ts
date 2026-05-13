import { useState, useEffect } from 'react';
import { User } from '../types/user';
import { UserStorage } from '../utils/userStorage';

export const useUserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const allUsers = UserStorage.getAll();
    setUsers(allUsers);
    setLoading(false);
  };

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>): User => {
    const newUser = UserStorage.add(userData);
    loadUsers();
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>): boolean => {
    const updated = UserStorage.update(id, userData);
    if (updated) {
      loadUsers();
      return true;
    }
    return false;
  };

  const deleteUser = (id: string): boolean => {
    const success = UserStorage.delete(id);
    if (success) {
      loadUsers();
    }
    return success;
  };

  const getUserById = (id: string): User | null => {
    return users.find(u => u.id === id) || null;
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    getUserById,
    refreshUsers: loadUsers
  };
};
