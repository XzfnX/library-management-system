import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Category, CategoryFormData } from '../types/category';
import { CategoryStorage } from '../utils/categoryStorage';
import { useAuth } from './AuthContext';

interface CategoryContextType {
  categories: Category[];
  systemCategories: Category[];
  customCategories: Category[];
  addCategory: (catData: CategoryFormData) => Category | null;
  updateCategory: (id: string, catData: Partial<Category>) => boolean;
  deleteCategory: (id: string) => boolean;
  getCategoryById: (id: string) => Category | null;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (user) {
      const userCategories = CategoryStorage.getAll(user.id);
      setCategories(userCategories);
    } else {
      setCategories([]);
    }
  }, [user]);

  const systemCategories = categories.filter(c => c.isSystem);
  const customCategories = categories.filter(c => !c.isSystem);

  const addCategory = (catData: CategoryFormData): Category | null => {
    if (!user) return null;
    const newCategory = CategoryStorage.add(user.id, {
      ...catData,
      isSystem: false,
      sortOrder: categories.length
    });
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  };

  const updateCategory = (id: string, catData: Partial<Category>): boolean => {
    if (!user) return false;
    const category = categories.find(c => c.id === id);
    if (!category || category.isSystem) return false;

    const updated = CategoryStorage.update(user.id, id, catData);
    if (updated) {
      setCategories(prev => prev.map(c => c.id === id ? updated : c));
      return true;
    }
    return false;
  };

  const deleteCategory = (id: string): boolean => {
    if (!user) return false;
    const category = categories.find(c => c.id === id);
    if (!category || category.isSystem) return false;

    const success = CategoryStorage.delete(user.id, id);
    if (success) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
    return success;
  };

  const getCategoryById = (id: string): Category | null => {
    return categories.find(c => c.id === id) || null;
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        systemCategories,
        customCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryById
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
