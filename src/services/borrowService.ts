import api from './api';
import { BorrowRecord, BorrowDTO, PageResult } from './types';

export const borrowService = {
  async getMyBorrows(params: {
    page?: number;
    size?: number;
    status?: string;
  }): Promise<PageResult<BorrowRecord>> {
    const response = await api.get<any>('/borrows/my', { params });
    return {
      total: response.data.total,
      records: response.data.records,
      current: response.data.current,
      size: response.data.size,
    };
  },

  async borrowBook(data: BorrowDTO): Promise<void> {
    await api.post('/borrows', data);
  },

  async returnBook(id: number): Promise<void> {
    await api.put(`/borrows/${id}/return`);
  },

  async renewBook(id: number): Promise<void> {
    await api.put(`/borrows/${id}/renew`);
  },
};
