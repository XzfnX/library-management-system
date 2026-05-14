export interface Book {
  id: number;
  userId: number;
  
  title: string;
  author: string;
  isbn: string;
  publisher: string;
  publishDate: string;
  
  category: string;
  
  description: string;
  
  stock: number;
  isPublic: number;
  
  coverUrl?: string;
  
  rating?: number;
  ratingCount?: number;
  borrowCount?: number;
  
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
  description: string;
  stock: number;
  isPublic: number;
}

export interface BookQueryParams {
  keyword?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}
