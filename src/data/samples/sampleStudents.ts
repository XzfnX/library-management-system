import { User } from '../../types/user';

const LAST_NAMES = [
  '王', '李', '张', '刘', '陈', '杨', '黄', '赵', '周', '吴',
  '徐', '孙', '马', '朱', '胡', '郭', '何', '高', '林', '罗',
  '郑', '梁', '谢', '宋', '唐', '许', '韩', '冯', '邓', '曹',
  '彭', '曾', '萧', '蔡', '潘', '田', '董', '袁', '于', '余',
  '叶', '蒋', '杜', '苏', '魏', '程', '吕', '丁', '沈', '任'
];

const FIRST_NAMES = [
  '伟', '芳', '娜', '秀英', '敏', '静', '丽', '强', '磊', '军',
  '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '海',
  '霞', '平', '刚', '桂英', '文', '华', '玲', '红', '波', '建华',
  '志强', '永红', '颖', '艳', '浩', '鑫', '宇', '欣', '浩然', '子轩',
  '梓涵', '子涵', '一诺', '浩然', '宇轩', '子萱', '欣怡', '晨曦', '梦琪', '诗涵'
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateStudentId(index: number): string {
  return `2024${String(1000 + index).padStart(4, '0')}`;
}

function generateStudent(index: number): Omit<User, 'createdAt' | 'updatedAt'> {
  const lastName = randomChoice(LAST_NAMES);
  const firstName = randomChoice(FIRST_NAMES);
  const username = lastName + firstName;
  const studentId = generateStudentId(index);
  
  return {
    id: `student_${studentId}`,
    username: username,
    studentId: studentId,
    email: `${studentId}@student.cdut.edu.cn`,
    phone: `138${String(Math.floor(Math.random() * 100000000)).padStart(8, '0')}`,
    password: '123456',
    role: 'student',
    maxBorrowCount: 5,
    currentBorrowCount: 0,
    totalBorrowCount: Math.floor(Math.random() * 20),
    status: 'active'
  };
}

export function generateStudents(count: number = 50): Omit<User, 'createdAt' | 'updatedAt'>[] {
  const students: Omit<User, 'createdAt' | 'updatedAt'>[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    let student;
    let attempts = 0;
    
    do {
      student = generateStudent(i);
      attempts++;
    } while (usedNames.has(student.username) && attempts < 10);
    
    if (!usedNames.has(student.username)) {
      usedNames.add(student.username);
      students.push(student);
    }
  }
  
  return students;
}

export const SAMPLE_STUDENTS = generateStudents(50);
