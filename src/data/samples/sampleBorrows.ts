import { BorrowRecord, BorrowStatus } from '../../types/borrow';
import { Book } from '../../types/book';
import { User } from '../../types/user';

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateRandomDate(startDate: Date, endDate: Date): Date {
  const start = startDate.getTime();
  const end = endDate.getTime();
  return new Date(start + Math.random() * (end - start));
}

function generateBorrowRecord(
  book: Book,
  student: User
): Omit<BorrowRecord, 'id'> {
  const now = new Date();
  const sixMonthsAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
  
  const borrowDate = generateRandomDate(sixMonthsAgo, now);
  const borrowDays = randomInt(15, 60);
  const dueDate = new Date(borrowDate.getTime() + borrowDays * 24 * 60 * 60 * 1000);
  
  const isReturned = Math.random() > 0.4;
  const isOverdue = !isReturned && dueDate < now;
  
  const returnDate = isReturned 
    ? new Date(borrowDate.getTime() + randomInt(1, borrowDays) * 24 * 60 * 60 * 1000)
    : undefined;
  
  const renewCount = Math.random() > 0.7 ? randomInt(1, 3) : 0;
  
  let status: BorrowStatus;
  if (isReturned) {
    status = 'returned';
  } else if (isOverdue) {
    status = 'overdue';
  } else {
    status = 'borrowed';
  }
  
  return {
    bookId: book.id,
    bookTitle: book.title,
    bookIsbn: book.isbn,
    userId: student.id,
    username: student.username,
    borrowDate: borrowDate.toISOString(),
    dueDate: dueDate.toISOString(),
    returnDate: returnDate?.toISOString(),
    renewCount,
    maxRenewCount: 3,
    status,
    remark: randomChoice(['正常借阅', '续借', '逾期未还', '提前归还', '假期借阅', '']),
    operatorId: 'admin_1',
    operatorName: '管理员',
    createdAt: borrowDate.toISOString(),
    updatedAt: (returnDate || dueDate).toISOString()
  };
}

export function generateBorrowRecords(
  books: Book[],
  students: User[],
  count: number = 300
): Omit<BorrowRecord, 'id'>[] {
  const records: Omit<BorrowRecord, 'id'>[] = [];
  const usedPairs = new Set<string>();
  
  for (let i = 0; i < count; i++) {
    const book = randomChoice(books);
    const student = randomChoice(students);
    const pairKey = `${book.id}-${student.id}`;
    
    if (!usedPairs.has(pairKey) || Math.random() > 0.5) {
      usedPairs.add(pairKey);
      records.push(generateBorrowRecord(book, student));
    }
  }
  
  return records.sort((a, b) => 
    new Date(b.borrowDate).getTime() - new Date(a.borrowDate).getTime()
  );
}

export const SAMPLE_BORROW_RECORDS = [];
