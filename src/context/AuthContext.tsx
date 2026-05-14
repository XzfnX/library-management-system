import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { UserStorage } from '../utils/userStorage';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = UserStorage.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const studentLogin = async (studentId: string, username: string): Promise<{ success: boolean; message: string }> => {
    try {
      const student = UserStorage.studentLogin(studentId, username);
      if (student) {
        UserStorage.setCurrentUser(student);
        setCurrentUser(student);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '学号或姓名错误' };
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
    }
  };

  const adminLogin = async (account: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const admin = UserStorage.adminLogin(account, password);
      if (admin) {
        UserStorage.setCurrentUser(admin);
        setCurrentUser(admin);
        return { success: true, message: '登录成功' };
      }
      return { success: false, message: '账号或密码错误' };
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
    }
  };

  const logout = () => {
    UserStorage.logout();
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
