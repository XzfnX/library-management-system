import { Shelf, DEFAULT_SHELVES } from '../types/shelf';

const getShelvesKey = (userId: string) => `library_shelves_${userId}`;

export const ShelfStorage = {
  getAll: (userId: string): Shelf[] => {
    try {
      const data = localStorage.getItem(getShelvesKey(userId));
      if (data) {
        return JSON.parse(data);
      }
      return ShelfStorage.initDefaults(userId);
    } catch (error) {
      console.error('Failed to get shelves:', error);
      return [];
    }
  },

  initDefaults: (userId: string): Shelf[] => {
    const shelves: Shelf[] = DEFAULT_SHELVES.map((s, index) => ({
      ...s,
      id: `shelf_default_${index}`,
      userId,
      createdAt: new Date().toISOString()
    }));
    localStorage.setItem(getShelvesKey(userId), JSON.stringify(shelves));
    return shelves;
  },

  getById: (userId: string, shelfId: string): Shelf | null => {
    const shelves = ShelfStorage.getAll(userId);
    return shelves.find(s => s.id === shelfId) || null;
  },

  add: (userId: string, shelfData: Omit<Shelf, 'id' | 'userId' | 'createdAt'>): Shelf => {
    const shelves = ShelfStorage.getAll(userId);
    const newShelf: Shelf = {
      ...shelfData,
      id: `shelf_${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    shelves.push(newShelf);
    localStorage.setItem(getShelvesKey(userId), JSON.stringify(shelves));
    return newShelf;
  },

  update: (userId: string, shelfId: string, shelfData: Partial<Shelf>): Shelf | null => {
    const shelves = ShelfStorage.getAll(userId);
    const index = shelves.findIndex(s => s.id === shelfId);
    if (index === -1) return null;

    shelves[index] = { ...shelves[index], ...shelfData };
    localStorage.setItem(getShelvesKey(userId), JSON.stringify(shelves));
    return shelves[index];
  },

  delete: (userId: string, shelfId: string): boolean => {
    const shelves = ShelfStorage.getAll(userId);
    const shelf = shelves.find(s => s.id === shelfId);
    if (!shelf || shelf.isDefault) return false;

    const filtered = shelves.filter(s => s.id !== shelfId);
    localStorage.setItem(getShelvesKey(userId), JSON.stringify(filtered));
    return true;
  },

  clearAll: (userId: string): void => {
    localStorage.removeItem(getShelvesKey(userId));
  }
};
