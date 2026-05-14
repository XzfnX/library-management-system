import api from './api';
import { Category, User, Book, BorrowRecord, StatisticsVO, PageResult, UserVO, BookVO, BorrowRecordVO } from './types';

export const adminService = {
  async getUsers(): Promise<User[]> {
    const response = await api.get<any>('/admin/users');
    return response.data || [];
  },

  async updateUserStatus(id: number, status: number): Promise<void> {
    await api.put(`/admin/users/${id}/status`, null, { params: { status } });
  },

  async getAllBooks(): Promise<Book[]> {
    const response = await api.get<any>('/admin/books');
    return response.data || [];
  },

  async getAllBorrows(): Promise<BorrowRecord[]> {
    const response = await api.get<any>('/admin/borrows');
    return response.data || [];
  },

  async getStatistics(): Promise<StatisticsVO> {
    const response = await api.get<any>('/admin/statistics');
    return response.data;
  },
};
