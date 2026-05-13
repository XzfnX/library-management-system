export type StudentStatus = 'active' | 'graduated' | 'suspended';

export interface Student {
  id: string;
  userId: string;
  
  // 基本信息
  studentId: string;        // 学号
  name: string;            // 姓名
  gender: 'male' | 'female'; // 性别
  major: string;           // 专业
  grade: string;           // 年级
  class: string;           // 班级
  
  // 联系方式
  phone: string;           // 手机号
  email: string;           // 邮箱
  
  // 借阅信息
  maxBorrowCount: number;  // 最大借阅数量
  currentBorrowCount: number; // 当前借阅数量
  totalBorrowCount: number;   // 历史借阅总数
  
  // 账户状态
  status: StudentStatus;
  
  // 时间戳
  createdAt: string;
  updatedAt: string;
}

export interface StudentFormData {
  studentId: string;
  name: string;
  gender: 'male' | 'female';
  major: string;
  grade: string;
  class: string;
  phone: string;
  email: string;
  maxBorrowCount?: number;
}

export interface StudentQueryParams {
  keyword?: string;
  major?: string;
  grade?: string;
  status?: StudentStatus;
  page?: number;
  pageSize?: number;
}

export interface StudentPageResult {
  list: Student[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
