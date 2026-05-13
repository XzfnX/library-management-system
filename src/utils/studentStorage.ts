import { Student, StudentFormData, StudentQueryParams, StudentPageResult } from '../types/student';

const STUDENTS_KEY = 'library_students';

export const StudentStorage = {
  // 获取所有学生
  getAll: (): Student[] => {
    try {
      const data = localStorage.getItem(STUDENTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get students:', error);
      return [];
    }
  },

  // 根据ID获取学生
  getById: (id: string): Student | null => {
    const students = StudentStorage.getAll();
    return students.find(s => s.id === id) || null;
  },

  // 根据学号获取学生
  getByStudentId: (studentId: string): Student | null => {
    const students = StudentStorage.getAll();
    return students.find(s => s.studentId === studentId) || null;
  },

  // 检查学号是否已存在
  isStudentIdExists: (studentId: string, excludeId?: string): boolean => {
    const students = StudentStorage.getAll();
    return students.some(s => s.studentId === studentId && s.id !== excludeId);
  },

  // 检查邮箱是否已存在
  isEmailExists: (email: string, excludeId?: string): boolean => {
    const students = StudentStorage.getAll();
    return students.some(s => s.email === email && s.id !== excludeId);
  },

  // 检查手机号是否已存在
  isPhoneExists: (phone: string, excludeId?: string): boolean => {
    const students = StudentStorage.getAll();
    return students.some(s => s.phone === phone && s.id !== excludeId);
  },

  // 多条件查询
  query: (params: StudentQueryParams): StudentPageResult => {
    let students = StudentStorage.getAll();

    // 关键词搜索
    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      students = students.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.studentId.toLowerCase().includes(keyword) ||
        s.major.toLowerCase().includes(keyword) ||
        s.class.toLowerCase().includes(keyword)
      );
    }

    // 专业筛选
    if (params.major) {
      students = students.filter(s => s.major === params.major);
    }

    // 年级筛选
    if (params.grade) {
      students = students.filter(s => s.grade === params.grade);
    }

    // 状态筛选
    if (params.status) {
      students = students.filter(s => s.status === params.status);
    }

    // 排序
    students.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // 分页
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const total = students.length;
    const totalPages = Math.ceil(total / pageSize);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = students.slice(start, end);

    return { list, total, page, pageSize, totalPages };
  },

  // 添加学生
  add: (studentData: StudentFormData): Student => {
    const students = StudentStorage.getAll();
    const now = new Date().toISOString();
    
    const newStudent: Student = {
      ...studentData,
      id: `student_${Date.now()}`,
      userId: `user_${Date.now()}`,
      maxBorrowCount: studentData.maxBorrowCount || 5,
      currentBorrowCount: 0,
      totalBorrowCount: 0,
      status: 'active',
      createdAt: now,
      updatedAt: now
    };
    
    students.push(newStudent);
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return newStudent;
  },

  // 更新学生
  update: (id: string, studentData: Partial<StudentFormData>): Student | null => {
    const students = StudentStorage.getAll();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) return null;

    students[index] = { 
      ...students[index], 
      ...studentData, 
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
    return students[index];
  },

  // 删除学生
  delete: (id: string): boolean => {
    const students = StudentStorage.getAll();
    const filtered = students.filter(s => s.id !== id);
    if (filtered.length === students.length) return false;

    localStorage.setItem(STUDENTS_KEY, JSON.stringify(filtered));
    return true;
  },

  // 更新借阅数量
  updateBorrowCount: (id: string, delta: number): boolean => {
    const student = StudentStorage.getById(id);
    if (!student) return false;

    const newCurrentCount = student.currentBorrowCount + delta;
    const newTotalCount = student.totalBorrowCount + (delta > 0 ? delta : 0);

    if (newCurrentCount < 0 || newCurrentCount > student.maxBorrowCount) {
      return false;
    }

    return !!StudentStorage.update(id, {
      currentBorrowCount: newCurrentCount,
      totalBorrowCount: newTotalCount
    } as Partial<StudentFormData>);
  },

  // 获取统计信息
  getStats: () => {
    const students = StudentStorage.getAll();
    return {
      total: students.length,
      active: students.filter(s => s.status === 'active').length,
      graduated: students.filter(s => s.status === 'graduated').length,
      suspended: students.filter(s => s.status === 'suspended').length,
      totalBorrowCount: students.reduce((sum, s) => sum + s.totalBorrowCount, 0)
    };
  },

  // 获取专业列表
  getMajors: (): string[] => {
    const students = StudentStorage.getAll();
    const majors = new Set(students.map(s => s.major));
    return Array.from(majors).sort();
  },

  // 获取年级列表
  getGrades: (): string[] => {
    const students = StudentStorage.getAll();
    const grades = new Set(students.map(s => s.grade));
    return Array.from(grades).sort();
  },

  // 初始化样本数据
  initSampleData: () => {
    const existingStudents = StudentStorage.getAll();
    if (existingStudents.length > 0) return;

    const majors = ['计算机科学与技术', '软件工程', '土木工程', '资源勘查工程', '地质学', '环境工程', '工商管理', '金融学'];
    const grades = ['2020级', '2021级', '2022级', '2023级', '2024级'];

    const sampleStudents: StudentFormData[] = [];
    
    for (let i = 1; i <= 30; i++) {
      const major = majors[i % majors.length];
      const grade = grades[i % grades.length];
      
      sampleStudents.push({
        studentId: `20${grade.substring(0, 2)}${String(i).padStart(4, '0')}`,
        name: ['张三', '李四', '王五', '赵六', '孙七', '周八', '吴九', '郑十', '钱一', '刘二'][i % 10] + `${i}`,
        gender: i % 2 === 0 ? 'male' : 'female',
        major,
        grade,
        class: `本科${(i % 5) + 1}班`,
        phone: `13800138${String(i).padStart(4, '0')}`,
        email: `student${i}@cdut.edu.cn`,
        maxBorrowCount: 5
      });
    }

    sampleStudents.forEach(student => {
      StudentStorage.add(student);
    });
  },

  // 清空所有学生
  clearAll: (): void => {
    localStorage.removeItem(STUDENTS_KEY);
  }
};
