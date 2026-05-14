import { User, UserRole, UserQueryParams } from '../types/user';
import { Storage } from './storage';

const USERS_KEY = 'library_users';
const CURRENT_USER_KEY = 'library_current_user';

export const UserService = {
  initDefaultUsers: (): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      let users: User[] = data ? JSON.parse(data) : [];
      
      const hasAdmin = users.some(u => u.role === 'admin');
      if (!hasAdmin) {
        const adminUser: User = {
          id: 'admin_1',
          username: '管理员',
          email: 'admin@library.com',
          phone: '13800138000',
          password: 'admin123',
          role: 'admin',
          maxBorrowCount: 10,
          currentBorrowCount: 0,
          totalBorrowCount: 0,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        users.push(adminUser);
      }
      
      const hasStudents = users.some(u => u.role === 'student');
      if (!hasStudents) {
        const sampleStudents: User[] = [
          {
            id: 'student_1',
            username: '张三',
            studentId: '2024001',
            email: 'zhangsan@school.com',
            phone: '13900139001',
            password: '123456',
            role: 'student',
            maxBorrowCount: 5,
            currentBorrowCount: 0,
            totalBorrowCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'student_2',
            username: '李四',
            studentId: '2024002',
            email: 'lisi@school.com',
            phone: '13900139002',
            password: '123456',
            role: 'student',
            maxBorrowCount: 5,
            currentBorrowCount: 0,
            totalBorrowCount: 0,
            status: 'active',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        users.push(...sampleStudents);
      }
      
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return users;
    } catch (error) {
      console.error('Failed to init default users:', error);
      return [];
    }
  },

  getAll: (): User[] => {
    UserService.initDefaultUsers();
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  },

  getById: (id: string): User | null => {
    const users = UserService.getAll();
    return users.find(u => u.id === id) || null;
  },

  getByStudentId: (studentId: string): User | null => {
    const users = UserService.getAll();
    return users.find(u => u.studentId === studentId && u.role === 'student') || null;
  },

  getByEmail: (email: string): User | null => {
    const users = UserService.getAll();
    return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  },

  getByPhone: (phone: string): User | null => {
    const users = UserService.getAll();
    return users.find(u => u.phone === phone) || null;
  },

  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  studentLogin: (studentId: string, username: string): { success: boolean; user?: User; message: string } => {
    const users = UserService.getAll();
    const student = users.find(u => 
      u.role === 'student' && 
      u.studentId === studentId && 
      u.username === username
    );
    if (student && student.status === 'active') {
      UserService.setCurrentUser(student);
      return { success: true, user: student, message: '登录成功' };
    }
    return { success: false, message: '学号或姓名错误' };
  },

  adminLogin: (account: string, password: string): { success: boolean; user?: User; message: string } => {
    const users = UserService.getAll();
    const admin = users.find(u => 
      u.role === 'admin' && 
      (u.username === account || u.email === account || u.phone === account) && 
      u.password === password
    );
    if (admin && admin.status === 'active') {
      UserService.setCurrentUser(admin);
      return { success: true, user: admin, message: '登录成功' };
    }
    return { success: false, message: '账号或密码错误' };
  },

  logout: (): void => {
    UserService.setCurrentUser(null);
  },

  isStudentIdExists: (studentId: string, excludeId?: string): boolean => {
    const users = UserService.getAll();
    return users.some(u => u.studentId === studentId && u.id !== excludeId);
  },

  isEmailExists: (email: string, excludeId?: string): boolean => {
    const users = UserService.getAll();
    return users.some(u => u.email?.toLowerCase() === email.toLowerCase() && u.id !== excludeId);
  },

  isPhoneExists: (phone: string, excludeId?: string): boolean => {
    const users = UserService.getAll();
    return users.some(u => u.phone === phone && u.id !== excludeId);
  },

  isUsernameExists: (username: string, excludeId?: string): boolean => {
    const users = UserService.getAll();
    return users.some(u => u.username === username && u.id !== excludeId);
  },

  query: (params: UserQueryParams = {}) => {
    let users = UserService.getAll();

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      users = users.filter(u =>
        u.username.toLowerCase().includes(keyword) ||
        u.studentId?.includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.phone?.includes(keyword)
      );
    }

    if (params.role) {
      users = users.filter(u => u.role === params.role);
    }

    if (params.status) {
      users = users.filter(u => u.status === params.status);
    }

    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = users.slice(start, end);

    return { list, total, page, pageSize, totalPages };
  },

  add: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = UserService.getAll();
    const now = new Date().toISOString();
    
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      maxBorrowCount: userData.maxBorrowCount || (userData.role === 'admin' ? 10 : 5),
      currentBorrowCount: 0,
      totalBorrowCount: 0,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
    
    users.push(newUser);
    Storage.set(USERS_KEY, users);
    return newUser;
  },

  update: (id: string, userData: Partial<User>): User | null => {
    const users = UserService.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { 
      ...users[index], 
      ...userData, 
      updatedAt: new Date().toISOString() 
    };
    Storage.set(USERS_KEY, users);
    
    const currentUser = UserService.getCurrentUser();
    if (currentUser?.id === id) {
      UserService.setCurrentUser(users[index]);
    }
    
    return users[index];
  },

  delete: (id: string): boolean => {
    const users = UserService.getAll();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;

    Storage.set(USERS_KEY, filtered);
    return true;
  },

  updateBorrowCount: (id: string, delta: number): boolean => {
    const user = UserService.getById(id);
    if (!user) return false;

    const newCurrentCount = user.currentBorrowCount + delta;
    const newTotalCount = user.totalBorrowCount + (delta > 0 ? delta : 0);

    if (newCurrentCount < 0 || newCurrentCount > user.maxBorrowCount) {
      return false;
    }

    return !!UserService.update(id, {
      currentBorrowCount: newCurrentCount,
      totalBorrowCount: newTotalCount
    });
  },

  getStats: () => {
    const users = UserService.getAll();
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      students: users.filter(u => u.role === 'student').length,
      active: users.filter(u => u.status === 'active').length,
      disabled: users.filter(u => u.status === 'disabled').length,
      suspended: users.filter(u => u.status === 'suspended').length
    };
  },

  clearAll: (): void => {
    Storage.remove(USERS_KEY);
    Storage.remove(CURRENT_USER_KEY);
  },

  setAll: (users: User[]) => {
    Storage.set(USERS_KEY, users);
  }
};
