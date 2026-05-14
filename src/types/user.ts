export type UserRole = 'student' | 'admin';

export interface User {
  id: number;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: number;
  createdAt: string;
  updatedAt?: string;
}

export type RegisterData = {
  username: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}
