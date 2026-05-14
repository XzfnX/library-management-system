import api from './api';

export interface BorrowRecordVO {
  id: number;
  userId: number;
  bookId: number;
  username?: string;
  bookTitle?: string;
  bookCover?: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: string;
  renewCount: number;
  maxRenewCount: number;
}

export const borrowService = {
  async getAllBorrows(): Promise<BorrowRecordVO[]> {
    const response = await api.get<BorrowRecordVO[]>('/admin/borrows');
    return response;
  },

  async borrowBook(bookId: number, userId: string, username: string, borrowDays: number, remark?: string): Promise<void> {
    await api.post('/borrows', {
      bookId,
      userId: parseInt(userId),
      username,
      borrowDays,
      remark
    });
  },

  async returnBook(id: number): Promise<void> {
    await api.put(`/borrows/${id}/return`);
  },

  async renewBook(id: number): Promise<void> {
    await api.put(`/borrows/${id}/renew`);
  }
};
