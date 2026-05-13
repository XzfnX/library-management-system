export type BorrowStatus = 'borrowed' | 'returned' | 'overdue' | 'renewed';

export interface BorrowRecord {
  id: string;
  
  // 图书信息
  bookId: string;
  bookTitle: string;
  bookIsbn?: string;
  
  // 用户信息
  userId: string;
  username: string;
  
  // 借阅信息
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  
  // 延期信息
  renewCount: number;        // 续借次数
  maxRenewCount: number;     // 最大续借次数
  
  // 状态
  status: BorrowStatus;
  
  // 备注
  remark?: string;
  
  // 操作员信息
  operatorId?: string;
  operatorName?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface BorrowFormData {
  bookId: string;
  userId: string;
  username?: string;
  borrowDays?: number;
  remark?: string;
}

export interface ReturnFormData {
  borrowId: string;
  remark?: string;
}

export interface RenewFormData {
  borrowId: string;
  extendDays?: number;
}

export interface BorrowQueryParams {
  keyword?: string;
  userId?: string;
  bookId?: string;
  status?: BorrowStatus;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

export interface BorrowStats {
  totalBorrows: number;
  activeBorrows: number;
  returnedBorrows: number;
  overdueBorrows: number;
  todayBorrows: number;
  todayReturns: number;
}
