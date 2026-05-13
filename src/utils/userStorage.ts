import { User, UserRole } from '../types/user';

const USERS_KEY = 'library_users';
const CURRENT_USER_KEY = 'library_current_user';

export const UserStorage = {
  // 初始化默认用户
  initDefaultUsers: (): User[] => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      let users: User[] = data ? JSON.parse(data) : [];
      
      // 如果没有管理员，自动创建一个
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
      
      // 创建一些示例学生用户
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

  // 获取所有用户
  getAll: (): User[] => {
    UserStorage.initDefaultUsers();
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get users:', error);
      return [];
    }
  },

  // 根据ID获取用户
  getById: (id: string): User | null => {
    const users = UserStorage.getAll();
    return users.find(u => u.id === id) || null;
  },

  // 根据学号获取学生
  getByStudentId: (studentId: string): User | null => {
    const users = UserStorage.getAll();
    return users.find(u => u.studentId === studentId && u.role === 'student') || null;
  },

  // 根据邮箱获取用户
  getByEmail: (email: string): User | null => {
    const users = UserStorage.getAll();
    return users.find(u => u.email?.toLowerCase() === email.toLowerCase()) || null;
  },

  // 根据手机号获取用户
  getByPhone: (phone: string): User | null => {
    const users = UserStorage.getAll();
    return users.find(u => u.phone === phone) || null;
  },

  // 获取当前登录用户
  getCurrentUser: (): User | null => {
    try {
      const data = localStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },

  // 设置当前登录用户
  setCurrentUser: (user: User | null): void => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },

  // 学生登录验证（学号+姓名）
  studentLogin: (studentId: string, username: string): User | null => {
    const users = UserStorage.getAll();
    const student = users.find(u => 
      u.role === 'student' && 
      u.studentId === studentId && 
      u.username === username
    );
    if (student && student.status === 'active') {
      return student;
    }
    return null;
  },

  // 管理员登录验证（账户+密码）
  adminLogin: (account: string, password: string): User | null => {
    const users = UserStorage.getAll();
    const admin = users.find(u => 
      u.role === 'admin' && 
      (u.username === account || u.email === account || u.phone === account) && 
      u.password === password
    );
    if (admin && admin.status === 'active') {
      return admin;
    }
    return null;
  },

  // 登出
  logout: (): void => {
    UserStorage.setCurrentUser(null);
  },

  // 检查学号是否已存在
  isStudentIdExists: (studentId: string, excludeId?: string): boolean => {
    const users = UserStorage.getAll();
    return users.some(u => u.studentId === studentId && u.id !== excludeId);
  },

  // 检查邮箱是否已存在
  isEmailExists: (email: string, excludeId?: string): boolean => {
    const users = UserStorage.getAll();
    return users.some(u => u.email?.toLowerCase() === email.toLowerCase() && u.id !== excludeId);
  },

  // 检查手机号是否已存在
  isPhoneExists: (phone: string, excludeId?: string): boolean => {
    const users = UserStorage.getAll();
    return users.some(u => u.phone === phone && u.id !== excludeId);
  },

  // 检查用户名是否已存在
  isUsernameExists: (username: string, excludeId?: string): boolean => {
    const users = UserStorage.getAll();
    return users.some(u => u.username === username && u.id !== excludeId);
  },

  // 多条件查询用户
  query: (params: { keyword?: string; role?: UserRole; status?: string; page?: number; pageSize?: number }) => {
    let users = UserStorage.getAll();

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      users = users.filter(u =>
        u.username.toLowerCase().includes(keyword) ||
        u.studentId?.includes(keyword) ||
        u.email?.toLowerCase().includes(keyword) ||
        u.phone?.includes(keyword)
      );
    }

    // 角色筛选
    if (params.role) {
      users = users.filter(u => u.role === params.role);
    }

    // 状态筛选
    if (params.status) {
      users = users.filter(u => u.status === params.status);
    }

    // 排序
    users.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = users.slice(start, end);

    return { list, total, page, pageSize, totalPages };
  },

  // 添加用户
  add: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = UserStorage.getAll();
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
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return newUser;
  },

  // 更新用户
  update: (id: string, userData: Partial<User>): User | null => {
    const users = UserStorage.getAll();
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;

    users[index] = { 
      ...users[index], 
      ...userData, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return users[index];
  },

  // 删除用户
  delete: (id: string): boolean => {
    const users = UserStorage.getAll();
    const filtered = users.filter(u => u.id !== id);
    if (filtered.length === users.length) return false;

    localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    return true;
  },

  // 更新用户借阅数量
  updateBorrowCount: (id: string, delta: number): boolean => {
    const user = UserStorage.getById(id);
    if (!user) return false;

    const newCurrentCount = user.currentBorrowCount + delta;
    const newTotalCount = user.totalBorrowCount + (delta > 0 ? delta : 0);

    if (newCurrentCount < 0 || newCurrentCount > user.maxBorrowCount) {
      return false;
    }

    return !!UserStorage.update(id, {
      currentBorrowCount: newCurrentCount,
      totalBorrowCount: newTotalCount
    });
  },

  // 获取统计信息
  getStats: () => {
    const users = UserStorage.getAll();
    return {
      total: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      students: users.filter(u => u.role === 'student').length,
      active: users.filter(u => u.status === 'active').length,
      disabled: users.filter(u => u.status === 'disabled').length,
      suspended: users.filter(u => u.status === 'suspended').length
    };
  },

  // 清空所有用户
  clearAll: (): void => {
    localStorage.removeItem(USERS_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};
