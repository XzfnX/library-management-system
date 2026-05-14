import { BookStorage } from '../utils/bookStorage';
import { UserStorage } from '../utils/userStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { Storage } from '../utils/storage';
import { generateBooks } from './samples/sampleBooks';
import { generateStudents } from './samples/sampleStudents';
import { generateBorrowRecords } from './samples/sampleBorrows';
import { Book } from '../types/book';
import { User } from '../types/user';
import { BorrowRecord } from '../types/borrow';

const INITIALIZED_KEY = 'library_initialized';

export function initializeData() {
  if (localStorage.getItem(INITIALIZED_KEY)) {
    return;
  }

  // 减少数据量以避免localStorage过大，便于GitHub存储
  const booksData = generateBooks(50); // 50本图书
  const books: Book[] = booksData.map((data, index) => ({
    ...data,
    id: Storage.generateId('book'),
    userId: 'system',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }));
  books.forEach(book => BookStorage.add(book as any));

  const studentsData = generateStudents(15); // 15个学生
  const users: User[] = [
    {
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
    },
    ...studentsData.map(data => ({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  ];
  users.forEach(user => UserStorage.add(user as any));

  const allStudents = users.filter(u => u.role === 'student');
  const borrowRecordsData = generateBorrowRecords(books, allStudents, 80);
  const borrowRecords: BorrowRecord[] = borrowRecordsData.map(data => ({
    ...data,
    id: Storage.generateId('borrow')
  }));

  borrowRecords.forEach(record => BorrowStorage.add(record as any, 'admin_1', '管理员'));

  localStorage.setItem(INITIALIZED_KEY, 'true');
}

export function resetData() {
  localStorage.removeItem('library_books');
  localStorage.removeItem('library_borrows');
  localStorage.removeItem('library_users');
  localStorage.removeItem('library_current_user');
  localStorage.removeItem(INITIALIZED_KEY);

  initializeData();
}
