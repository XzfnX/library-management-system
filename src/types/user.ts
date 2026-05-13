export type UserRole = 'student' | 'admin';

export type User = {
  id: string;
  username: string;
  studentId?: string;
  email?: string;
  phone?: string;
  password: string;
  avatar?: string;
  role: UserRole;
  
  maxBorrowCount: number;
  currentBorrowCount: number;
  totalBorrowCount: number;
  
  status: 'active' | 'disabled' | 'suspended';
  
  createdAt: string;
  updatedAt: string;
}

export type RegisterData = {
  username: string;
  studentId?: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export type LoginData = {
  account: string;
  password: string;
  role: UserRole;
  remember?: boolean;
}

export type UserQueryParams = {
  keyword?: string;
  role?: UserRole;
  status?: string;
  page?: number;
  pageSize?: number;
}
