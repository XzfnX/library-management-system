export interface Shelf {
  id: string;
  userId: string;
  name: string;
  color: string;
  sortOrder: number;
  isDefault: boolean;
  createdAt: string;
}

export interface ShelfFormData {
  name: string;
  color: string;
}

export const DEFAULT_SHELVES = [
  { name: '全部图书', color: '#3b82f6', isDefault: true, sortOrder: 0 },
  { name: '正在阅读', color: '#f97316', isDefault: true, sortOrder: 1 },
  { name: '已读完', color: '#22c55e', isDefault: true, sortOrder: 2 },
  { name: '想读', color: '#8b5cf6', isDefault: true, sortOrder: 3 }
];
