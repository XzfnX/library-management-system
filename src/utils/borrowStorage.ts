import { BorrowRecord, BorrowFormData } from '../types/borrow';
import { Storage } from './storage';
import { BookStorage } from './bookStorage';

const BORROW_KEY = 'library_borrows';

export const BorrowStorage = {
  // 获取所有借阅记录
  getAll: (): BorrowRecord[] => {
    return Storage.get<BorrowRecord[]>(BORROW_KEY, []);
  },

  // 根据ID获取记录
  getById: (id: string): BorrowRecord | undefined => {
    const records = BorrowStorage.getAll();
    return records.find(r => r.id === id);
  },

  // 获取用户的借阅记录
  getByUser: (userId: string): BorrowRecord[] => {
    const records = BorrowStorage.getAll();
    return records.filter(r => r.userId === userId);
  },

  // 添加借阅记录
  add: (data: BorrowFormData, operatorId?: string, operatorName?: string): BorrowRecord | null => {
    const book = BookStorage.getById(data.bookId);
    if (!book) return null;
    if (book.stock <= 0) return null;

    // 先更新图书库存
    const borrowSuccess = BookStorage.borrow(data.bookId);
    if (!borrowSuccess) return null;

    const records = BorrowStorage.getAll();
    const borrowDays = data.borrowDays || 30;
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate);
    dueDate.setDate(dueDate.getDate() + borrowDays);

    const newRecord: BorrowRecord = {
      id: Storage.generateId('borrow'),
      bookId: data.bookId,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      userId: data.userId,
      username: data.username || '',
      borrowDate: borrowDate.toISOString(),
      dueDate: dueDate.toISOString(),
      renewCount: 0,
      maxRenewCount: 2,
      status: 'borrowed',
      remark: data.remark,
      operatorId,
      operatorName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    records.push(newRecord);
    Storage.set(BORROW_KEY, records);
    return newRecord;
  },

  // 归还图书
  return: (id: string, operatorId?: string, operatorName?: string): boolean => {
    const records = BorrowStorage.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return false;

    const record = records[index];
    if (record.status === 'returned') return false;

    // 更新图书库存
    BookStorage.return(record.bookId);

    // 更新借阅记录
    records[index] = {
      ...record,
      status: 'returned',
      returnDate: new Date().toISOString(),
      operatorId,
      operatorName,
      updatedAt: new Date().toISOString()
    };

    Storage.set(BORROW_KEY, records);
    return true;
  },

  // 续借
  renew: (id: string, extendDays: number = 30): BorrowRecord | null => {
    const records = BorrowStorage.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const record = records[index];
    if (record.status !== 'borrowed') return null;
    if (record.renewCount >= record.maxRenewCount) return null;

    const currentDueDate = new Date(record.dueDate);
    const newDueDate = new Date(currentDueDate);
    newDueDate.setDate(newDueDate.getDate() + extendDays);

    records[index] = {
      ...record,
      dueDate: newDueDate.toISOString(),
      renewCount: record.renewCount + 1,
      status: 'renewed',
      updatedAt: new Date().toISOString()
    };

    Storage.set(BORROW_KEY, records);
    return records[index];
  },

  // 删除记录
  delete: (id: string): boolean => {
    const records = BorrowStorage.getAll();
    const filtered = records.filter(r => r.id !== id);
    
    if (filtered.length === records.length) return false;
    
    Storage.set(BORROW_KEY, filtered);
    return true;
  },

  // 搜索记录
  search: (keyword: string = ''): BorrowRecord[] => {
    const records = BorrowStorage.getAll();
    if (!keyword) return records;

    const lowerKeyword = keyword.toLowerCase();
    return records.filter(r =>
      r.bookTitle.toLowerCase().includes(lowerKeyword) ||
      r.username.toLowerCase().includes(lowerKeyword) ||
      r.bookIsbn?.includes(keyword)
    );
  },

  // 获取统计
  getStats: () => {
    const records = BorrowStorage.getAll();
    const today = new Date().toDateString();
    
    return {
      totalBorrows: records.length,
      activeBorrows: records.filter(r => r.status === 'borrowed' || r.status === 'renewed').length,
      returnedBorrows: records.filter(r => r.status === 'returned').length,
      overdueBorrows: records.filter(r => {
        if (r.status === 'returned') return false;
        return new Date(r.dueDate) < new Date();
      }).length,
      todayBorrows: records.filter(r => 
        new Date(r.borrowDate).toDateString() === today
      ).length,
      todayReturns: records.filter(r => 
        r.returnDate && new Date(r.returnDate).toDateString() === today
      ).length
    };
  }
};
