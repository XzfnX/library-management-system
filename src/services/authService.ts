import api from './api';
import { User } from '../types/user';
import { LoginDTO, RegisterDTO } from './types';

export const authService = {
  async login(data: LoginDTO): Promise<string> {
    const response = await api.post<any>('/auth/login', data);
    if (response.data) {
      localStorage.setItem('token', response.data);
      await this.getCurrentUser();
    }
    return response.data;
  },

  async register(data: RegisterDTO): Promise<void> {
    await api.post('/auth/register', data);
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<any>('/auth/current');
    if (response.data) {
      const user: User = {
        ...response.data,
        id: response.data.id,
        role: response.data.role === 2 ? 'admin' : 'student',
        status: response.data.status || 1
      };
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    }
    throw new Error('获取用户信息失败');
  },

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } catch {
      // 忽略登出失败
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getStoredToken(): string | null {
    return localStorage.getItem('token');
  },
};
