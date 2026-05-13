export type BookStatus = 'available' | 'borrowed' | 'reserved' | 'damaged' | 'lost';

export interface Book {
  id: string;
  userId: string;
  
  // 基本信息
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  
  // 分类信息
  category: string;
  categoryId?: string;
  
  // 描述信息
  description: string;
  
  // 库存信息（参考黑马Java设计）
  stock: number;           // 当前库存数量
  totalStock: number;      // 总库存数量
  borrowCount: number;     // 借阅次数
  
  // 状态
  status: BookStatus;
  
  // 位置信息
  location?: string;       // 存放位置
  
  // 价格信息
  price?: number;          // 单价
  
  // 封面信息
  cover?: string;          // 封面图片URL
  
  // 评分信息
  rating?: number;         // 评分
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  category: string;
  categoryId?: string;
  description: string;
  stock: number;
  totalStock: number;
  location?: string;
  price?: number;
  cover?: string;
  rating?: number;
  status?: BookStatus;
  borrowCount?: number;
}

export interface BookQueryParams {
  keyword?: string;
  category?: string;
  status?: BookStatus;
  author?: string;
  publisher?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BookPageResult {
  list: Book[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
