import { BookStorage } from './bookStorage';
import { UserStorage } from './userStorage';
import { BorrowStorage } from './borrowStorage';
import { generateBooks, SAMPLE_BOOKS } from './sampleBooks';
import { generateStudents, SAMPLE_STUDENTS } from './sampleStudents';
import { generateBorrowRecords } from './sampleBorrows';

const INITIALIZED_KEY = 'library_initialized';

export function initializeData() {
  if (localStorage.getItem(INITIALIZED_KEY)) {
    return;
  }

  const books = generateBooks(200);
  books.forEach(book => {
    BookStorage.add(book as any);
  });

  const students = generateStudents(50);
  students.forEach((student, index) => {
    UserStorage.add({
      ...student,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  });

  const allStudents = UserStorage.getAll().filter(u => u.role === 'student');
  const allBooks = BookStorage.getAll();
  
  const borrowRecords = generateBorrowRecords(
    allBooks.map(b => ({ id: b.id, title: b.title, isbn: b.isbn })),
    allStudents.map(s => ({ id: s.id, username: s.username })),
    300
  );

  borrowRecords.forEach(record => {
    BorrowStorage.add(record as any, 'admin_1', '管理员');
  });

  localStorage.setItem(INITIALIZED_KEY, 'true');
}

export function resetData() {
  localStorage.removeItem('library_books');
  localStorage.removeItem('library_borrows');
  localStorage.removeItem('library_users');
  localStorage.removeItem(INITIALIZED_KEY);
  
  initializeData();
}
