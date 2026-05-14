import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types/user';
import { UserService } from '../services/userService';

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
    const user = UserService.getCurrentUser();
    setCurrentUser(user);
    setIsLoading(false);
  }, []);

  const studentLogin = async (studentId: string, username: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = UserService.studentLogin(studentId, username);
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
    }
  };

  const adminLogin = async (account: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const result = UserService.adminLogin(account, password);
      if (result.success && result.user) {
        setCurrentUser(result.user);
      }
      return result;
    } catch (error) {
      return { success: false, message: '登录失败，请重试！' };
    }
  };

  const logout = () => {
    UserService.logout();
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
