import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { authService } from '../services/authService';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedUser = authService.getStoredUser();
      const storedToken = authService.getStoredToken();
      
      if (storedUser && storedToken) {
        try {
          const user = await authService.getCurrentUser();
          setCurrentUser(user);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const studentLogin = async (studentId: string, username: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await authService.login({ username: studentId, password: username });
      const user = await authService.getCurrentUser();
      if (user && user.role === 'student') {
        setCurrentUser(user);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '学号或姓名错误' };
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
    }
  };

  const adminLogin = async (account: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const token = await authService.login({ username: account, password: password });
      const user = await authService.getCurrentUser();
      if (user && user.role === 'admin') {
        setCurrentUser(user);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '账号或密码错误' };
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
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
