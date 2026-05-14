import api from './api';
import { StatisticsVO, BookVO } from './types';
import { User } from '../types/user';
import { Book } from '../types/book';

export const adminService = {
  async getStatistics(): Promise<StatisticsVO> {
    const response = await api.get<StatisticsVO>('/admin/statistics');
    return response.data;
  },

  async getAllBooks(): Promise<Book[]> {
    const response = await api.get<BookVO[]>('/admin/books');
    return response.data as unknown as Book[];
  },

  async getAllUsers(): Promise<User[]> {
    const response = await api.get<User[]>('/admin/users');
    return response.data;
  },

  async getAllBorrows(): Promise<any[]> {
    const response = await api.get<any[]>('/admin/borrows');
    return response.data;
  }
};
