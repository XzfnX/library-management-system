import { Category, DEFAULT_CATEGORIES } from '../types/category';

const getCategoriesKey = (userId: string) => `library_categories_${userId}`;

export const CategoryStorage = {
  getAll: (userId: string): Category[] => {
    try {
      const data = localStorage.getItem(getCategoriesKey(userId));
      if (data) {
        return JSON.parse(data);
      }
      return CategoryStorage.initDefaults(userId);
    } catch (error) {
      console.error('Failed to get categories:', error);
      return [];
    }
  },

  initDefaults: (userId: string): Category[] => {
    const categories: Category[] = DEFAULT_CATEGORIES.map((c, index) => ({
      ...c,
      id: `cat_default_${index}`,
      userId,
      createdAt: new Date().toISOString()
    }));
    localStorage.setItem(getCategoriesKey(userId), JSON.stringify(categories));
    return categories;
  },

  getById: (userId: string, catId: string): Category | null => {
    const categories = CategoryStorage.getAll(userId);
    return categories.find(c => c.id === catId) || null;
  },

  add: (userId: string, catData: Omit<Category, 'id' | 'userId' | 'createdAt'>): Category => {
    const categories = CategoryStorage.getAll(userId);
    const newCategory: Category = {
      ...catData,
      id: `cat_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    categories.push(newCategory);
    localStorage.setItem(getCategoriesKey(userId), JSON.stringify(categories));
    return newCategory;
  },

  update: (userId: string, catId: string, catData: Partial<Category>): Category | null => {
    const categories = CategoryStorage.getAll(userId);
    const index = categories.findIndex(c => c.id === catId);
    if (index === -1) return null;

    categories[index] = { ...categories[index], ...catData };
    localStorage.setItem(getCategoriesKey(userId), JSON.stringify(categories));
    return categories[index];
  },

  delete: (userId: string, catId: string): boolean => {
    const categories = CategoryStorage.getAll(userId);
    const category = categories.find(c => c.id === catId);
    if (!category || category.isSystem) return false;

    const filtered = categories.filter(c => c.id !== catId);
    localStorage.setItem(getCategoriesKey(userId), JSON.stringify(filtered));
    return true;
  },

  clearAll: (userId: string): void => {
    localStorage.removeItem(getCategoriesKey(userId));
  }
};
