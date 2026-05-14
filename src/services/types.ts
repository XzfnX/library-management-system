export interface Result<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}

export interface PageResult<T> {
  total: number;
  records: T[];
  current: number;
  size: number;
}

export interface BookDTO {
  id?: number;
  title: string;
  author: string;
  isbn?: string;
  publisher?: string;
  publishDate?: string;
  category?: string;
  description?: string;
  coverUrl?: string;
  stock?: number;
  isPublic?: number;
}

export interface BorrowDTO {
  id?: number;
  bookId: number;
  borrowDays?: number;
  dueDate?: string;
}

export interface LoginDTO {
  username: string;
  password: string;
}

export interface RegisterDTO {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

export interface StatisticsVO {
  totalBooks: number;
  totalUsers: number;
  totalBorrows: number;
  currentBorrows: number;
  overdueBorrows: number;
  totalComments: number;
  averageRating: number;
}

export interface BookVO {
  id: number;
  userId: number;
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  category: string;
  description: string;
  coverUrl?: string;
  stock: number;
  rating?: number;
  ratingCount?: number;
  createdAt: string;
  updatedAt: string;
}
