import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { authService } from '../services/authService';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  studentLogin: (studentId: string, username: string) => Promise<{ success: boolean; message: string }>;
  adminLogin: (account: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  checkAuth: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const convertRole = (role: number): UserRole => {
  return role === 2 ? 'admin' : 'student';
};

const LOCAL_TOKEN_PREFIX = 'local_token_';

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();
      
      if (storedUser && storedToken) {
        if (storedToken.startsWith(LOCAL_TOKEN_PREFIX)) {
          setCurrentUser(storedUser);
        } else {
          try {
            const user = await authService.getCurrentUser();
            setCurrentUser(user);
          } catch {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const studentLoginWithMockData = (studentId: string, username: string): User | null => {
    return mockUsers.find(u => u.phone === studentId && u.username === username && u.role === 'student') || null;
  };

  const adminLoginWithMockData = (account: string, password: string): User | null => {
    if (account === 'admin' && password === 'admin123') {
      return mockUsers.find(u => u.username === 'admin' && u.role === 'admin') || null;
    }
    return null;
  };

  const saveLocalUser = (user: User) => {
    const token = LOCAL_TOKEN_PREFIX + Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const studentLogin = async (studentId: string, username: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await authService.login({ username, password: '', studentId });
      const user = await authService.getCurrentUser();
      if (user && user.role === 'student') {
        setCurrentUser(user);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '学号或姓名错误' };
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      if (error.message?.includes('Network') || !error.response) {
        const mockUser = studentLoginWithMockData(studentId, username);
        if (mockUser) {
          saveLocalUser(mockUser);
          setCurrentUser(mockUser);
          return { success: true, message: '登录成功' };
        }
        return { success: false, message: '学号或姓名错误' };
      }
      return { success: false, message: error.message || '登录错误' };
    }
  };

  const adminLogin = async (account: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await authService.login({ username: account, password });
      const user = await authService.getCurrentUser();
      if (user && user.role === 'admin') {
        setCurrentUser(user);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '账号或密码错误' };
    } catch (error: any) {
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      }
      if (error.message?.includes('Network') || !error.response) {
        const mockUser = adminLoginWithMockData(account, password);
        if (mockUser) {
          saveLocalUser(mockUser);
          setCurrentUser(mockUser);
          return { success: true, message: '登录成功' };
        }
        return { success: false, message: '账号或密码错误' };
      }
      return { success: false, message: error.message || '登录错误' };
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const checkAuth = (role: UserRole): boolean => {
    if (!currentUser) return false;
    return currentUser.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        studentLogin,
        adminLogin,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
