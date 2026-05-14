import api from './api';
import { Book, BookDTO, PageResult } from './types';

export const bookService = {
  async getBooks(params: {
    page?: number;
    size?: number;
    category?: string;
    keyword?: string;
  }): Promise<PageResult<Book>> {
    const response = await api.get<any>('/books', { params });
    return {
      total: response.data.total,
      records: response.data.records,
      current: response.data.current,
      size: response.data.size,
    };
  },

  async getBookById(id: number): Promise<Book> {
    const response = await api.get<any>(`/books/${id}`);
    return response.data;
  },

  async addBook(data: BookDTO): Promise<void> {
    await api.post('/books', data);
  },

  async updateBook(id: number, data: BookDTO): Promise<void> {
    await api.put(`/books/${id}`, data);
  },

  async deleteBook(id: number): Promise<void> {
    await api.delete(`/books/${id}`);
  },
};
