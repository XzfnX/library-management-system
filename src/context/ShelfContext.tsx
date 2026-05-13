import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Shelf, ShelfFormData } from '../types/shelf';
import { ShelfStorage } from '../utils/shelfStorage';
import { useAuth } from './AuthContext';

interface ShelfContextType {
  shelves: Shelf[];
  defaultShelves: Shelf[];
  customShelves: Shelf[];
  addShelf: (shelfData: ShelfFormData) => Shelf | null;
  updateShelf: (id: string, shelfData: Partial<Shelf>) => boolean;
  deleteShelf: (id: string) => boolean;
  getShelfById: (id: string) => Shelf | null;
  getBookCount: (shelfId: string) => number;
}

const ShelfContext = createContext<ShelfContextType | undefined>(undefined);

export const ShelfProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [shelves, setShelves] = useState<Shelf[]>([]);

  useEffect(() => {
    if (user) {
      const userShelves = ShelfStorage.getAll(user.id);
      setShelves(userShelves);
    } else {
      setShelves([]);
    }
  }, [user]);

  const defaultShelves = shelves.filter(s => s.isDefault);
  const customShelves = shelves.filter(s => !s.isDefault);

  const addShelf = (shelfData: ShelfFormData): Shelf | null => {
    if (!user) return null;
    const newShelf = ShelfStorage.add(user.id, {
      ...shelfData,
      isDefault: false,
      sortOrder: shelves.length
    });
    setShelves(prev => [...prev, newShelf]);
    return newShelf;
  };

  const updateShelf = (id: string, shelfData: Partial<Shelf>): boolean => {
    if (!user) return false;
    const shelf = shelves.find(s => s.id === id);
    if (!shelf || shelf.isDefault) return false;

    const updated = ShelfStorage.update(user.id, id, shelfData);
    if (updated) {
      setShelves(prev => prev.map(s => s.id === id ? updated : s));
      return true;
    }
    return false;
  };

  const deleteShelf = (id: string): boolean => {
    if (!user) return false;
    const shelf = shelves.find(s => s.id === id);
    if (!shelf || shelf.isDefault) return false;

    const success = ShelfStorage.delete(user.id, id);
    if (success) {
      setShelves(prev => prev.filter(s => s.id !== id));
    }
    return success;
  };

  const getShelfById = (id: string): Shelf | null => {
    return shelves.find(s => s.id === id) || null;
  };

  const getBookCount = (_shelfId: string): number => {
    return 0;
  };

  return (
    <ShelfContext.Provider
      value={{
        shelves,
        defaultShelves,
        customShelves,
        addShelf,
        updateShelf,
        deleteShelf,
        getShelfById,
        getBookCount
      }}
    >
      {children}
    </ShelfContext.Provider>
  );
};

export const useShelves = () => {
  const context = useContext(ShelfContext);
  if (context === undefined) {
    throw new Error('useShelves must be used within a ShelfProvider');
  }
  return context;
};
