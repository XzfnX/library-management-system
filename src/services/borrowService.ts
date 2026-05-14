import { BorrowRecord, BorrowFormData, BorrowStats, BorrowQueryParams } from '../types/borrow';
import { Storage } from './storage';
import { BookService } from './bookService';

const BORROW_KEY = 'library_borrows';

export const BorrowService = {
  getAll: (): BorrowRecord[] => {
    return Storage.get<BorrowRecord[]>(BORROW_KEY, []);
  },

  getById: (id: string): BorrowRecord | undefined => {
    const records = BorrowService.getAll();
    return records.find(r => r.id === id);
  },

  getByUser: (userId: string): BorrowRecord[] => {
    const records = BorrowService.getAll();
    return records.filter(r => r.userId === userId);
  },

  getByBook: (bookId: string): BorrowRecord[] => {
    const records = BorrowService.getAll();
    return records.filter(r => r.bookId === bookId);
  },

  add: (data: BorrowFormData, operatorId?: string, operatorName?: string): BorrowRecord | null => {
    const book = BookService.getById(data.bookId);
    if (!book) return null;
    if (book.stock <= 0) return null;

    const borrowSuccess = BookService.borrow(data.bookId);
    if (!borrowSuccess) return null;

    const records = BorrowService.getAll();
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

  return: (id: string, operatorId?: string, operatorName?: string): boolean => {
    const records = BorrowService.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return false;

    const record = records[index];
    if (record.status === 'returned') return false;

    BookService.return(record.bookId);

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

  renew: (id: string, extendDays: number = 30): BorrowRecord | null => {
    const records = BorrowService.getAll();
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;

    const record = records[index];
    if (record.status !== 'borrowed' && record.status !== 'renewed') return null;
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

  delete: (id: string): boolean => {
    const records = BorrowService.getAll();
    const filtered = records.filter(r => r.id !== id);
    
    if (filtered.length === records.length) return false;
    
    Storage.set(BORROW_KEY, filtered);
    return true;
  },

  search: (keyword: string = ''): BorrowRecord[] => {
    const records = BorrowService.getAll();
    if (!keyword) return records;

    const lowerKeyword = keyword.toLowerCase();
    return records.filter(r =>
      r.bookTitle.toLowerCase().includes(lowerKeyword) ||
      r.username.toLowerCase().includes(lowerKeyword) ||
      r.bookIsbn?.includes(keyword)
    );
  },

  query: (params: BorrowQueryParams = {}): BorrowRecord[] => {
    let records = BorrowService.getAll();
    
    if (params.keyword) {
      records = BorrowService.search(params.keyword);
    }
    
    if (params.userId) {
      records = records.filter(r => r.userId === params.userId);
    }
    
    if (params.bookId) {
      records = records.filter(r => r.bookId === params.bookId);
    }
    
    if (params.status) {
      records = records.filter(r => r.status === params.status);
    }
    
    if (params.startDate) {
      records = records.filter(r => new Date(r.borrowDate) >= new Date(params.startDate!));
    }
    
    if (params.endDate) {
      records = records.filter(r => new Date(r.borrowDate) <= new Date(params.endDate!));
    }
    
    return records;
  },

  getStats: (): BorrowStats => {
    const records = BorrowService.getAll();
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
  },

  clearAll: () => {
    Storage.set(BORROW_KEY, []);
  },

  setAll: (records: BorrowRecord[]) => {
    Storage.set(BORROW_KEY, records);
  }
};
