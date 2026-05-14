import api from './api';
import { User, LoginDTO, RegisterDTO } from './types';

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
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
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
