import api from './api';
import { Book } from '../types/book';
import { mockBooks } from '../data/mockData';

export interface PageResult<T> {
  total: number;
  records: T[];
  current: number;
  size: number;
}

export const bookService = {
  async getBooks(params: {
    page?: number;
    size?: number;
    category?: string;
    keyword?: string;
  }): Promise<PageResult<Book>> {
    try {
      const response = await api.get<PageResult<Book>>('/books', { params });
      return response;
    } catch (error: any) {
      if (error.message?.includes('Network') || !error.response) {
        let books = [...mockBooks];
        
        if (params.keyword) {
          const keyword = params.keyword.toLowerCase();
          books = books.filter(book => 
            book.title.toLowerCase().includes(keyword) ||
            book.author.toLowerCase().includes(keyword) ||
            book.isbn.includes(params.keyword) ||
            book.publisher.toLowerCase().includes(keyword)
          );
        }
        
        if (params.category && params.category !== '全部') {
          books = books.filter(book => book.category === params.category);
        }
        
        const page = params.page || 1;
        const size = params.size || 10;
        const start = (page - 1) * size;
        const end = start + size;
        
        return {
          total: books.length,
          records: books.slice(start, end),
          current: page,
          size
        };
      }
      throw error;
    }
  },

  async getBookById(id: number): Promise<Book> {
    try {
      const response = await api.get<Book>(`/books/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.message?.includes('Network') || !error.response) {
        const book = mockBooks.find(b => b.id === id);
        if (!book) throw new Error('图书不存在');
        return book;
      }
      throw error;
    }
  },

  async createBook(data: Omit<Book, 'id'>): Promise<Book> {
    const response = await api.post<Book>('/books', data);
    return response.data;
  },

  async updateBook(id: number, data: Partial<Book>): Promise<Book> {
    const response = await api.put<Book>(`/books/${id}`, data);
    return response.data;
  },

  async deleteBook(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  }
};
