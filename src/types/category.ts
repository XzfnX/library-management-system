export interface Category {
  id: string;
  userId: string;
  name: string;
  isSystem: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface CategoryFormData {
  name: string;
}

export const DEFAULT_CATEGORIES = [
  { name: '技术', isSystem: true, sortOrder: 0 },
  { name: '文学', isSystem: true, sortOrder: 1 },
  { name: '历史', isSystem: true, sortOrder: 2 },
  { name: '经济', isSystem: true, sortOrder: 3 },
  { name: '设计', isSystem: true, sortOrder: 4 },
  { name: '哲学', isSystem: true, sortOrder: 5 },
  { name: '科学', isSystem: true, sortOrder: 6 },
  { name: '其他', isSystem: true, sortOrder: 7 }
];
