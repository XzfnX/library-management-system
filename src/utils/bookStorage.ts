import { Book, BookFormData } from '../types/book';
import { Storage } from './storage';

const BOOK_KEY = 'library_books';

// 初始化示例数据
const initSampleBooks = (): Book[] => {
  const existing = Storage.get<Book[]>(BOOK_KEY, []);
  if (existing.length > 0) return existing;

  const sampleBooks: Book[] = [
    {
      id: Storage.generateId('book'),
      userId: 'system',
      title: '红楼梦',
      author: '曹雪芹',
      isbn: '9787020002207',
      publisher: '人民文学出版社',
      publishDate: '1996-12-01',
      category: '文学',
      description: '中国古典四大名著之一',
      stock: 5,
      totalStock: 5,
      borrowCount: 0,
      status: 'available',
      location: 'A栋1楼',
      price: 59.8,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: Storage.generateId('book'),
      userId: 'system',
      title: '西游记',
      author: '吴承恩',
      isbn: '9787020002214',
      publisher: '人民文学出版社',
      publishDate: '1980-05-01',
      category: '文学',
      description: '中国古典四大名著之一',
      stock: 3,
      totalStock: 3,
      borrowCount: 0,
      status: 'available',
      location: 'A栋1楼',
      price: 48.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: Storage.generateId('book'),
      userId: 'system',
      title: 'Java编程思想',
      author: 'Bruce Eckel',
      isbn: '9787111213826',
      publisher: '机械工业出版社',
      publishDate: '2007-06-01',
      category: '计算机',
      description: 'Java经典教材',
      stock: 2,
      totalStock: 2,
      borrowCount: 0,
      status: 'available',
      location: 'B栋2楼',
      price: 108.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: Storage.generateId('book'),
      userId: 'system',
      title: '深入理解计算机系统',
      author: 'Bryant',
      isbn: '9787111544937',
      publisher: '机械工业出版社',
      publishDate: '2016-11-01',
      category: '计算机',
      description: 'CSAPP',
      stock: 4,
      totalStock: 4,
      borrowCount: 0,
      status: 'available',
      location: 'B栋2楼',
      price: 139.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: Storage.generateId('book'),
      userId: 'system',
      title: '三国演义',
      author: '罗贯中',
      isbn: '9787020002221',
      publisher: '人民文学出版社',
      publishDate: '1973-12-01',
      category: '文学',
      description: '中国古典四大名著之一',
      stock: 6,
      totalStock: 6,
      borrowCount: 0,
      status: 'available',
      location: 'A栋1楼',
      price: 52.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  Storage.set(BOOK_KEY, sampleBooks);
  return sampleBooks;
};

export const BookStorage = {
  // 获取所有图书
  getAll: (): Book[] => {
    return initSampleBooks();
  },

  // 根据ID获取图书
  getById: (id: string): Book | undefined => {
    const books = BookStorage.getAll();
    return books.find(book => book.id === id);
  },

  // 添加图书
  add: (data: BookFormData, userId: string = 'system'): Book => {
    const books = BookStorage.getAll();
    const now = new Date().toISOString();

    const newBook: Book = {
      ...data,
      id: Storage.generateId('book'),
      userId,
      borrowCount: 0,
      status: data.status || 'available',
      createdAt: now,
      updatedAt: now
    };

    books.push(newBook);
    Storage.set(BOOK_KEY, books);
    return newBook;
  },

  // 更新图书
  update: (id: string, data: Partial<BookFormData>): Book | null => {
    const books = BookStorage.getAll();
    const index = books.findIndex(book => book.id === id);

    if (index === -1) return null;

    books[index] = {
      ...books[index],
      ...data,
      updatedAt: new Date().toISOString()
    };

    Storage.set(BOOK_KEY, books);
    return books[index];
  },

  // 删除图书
  delete: (id: string): boolean => {
    const books = BookStorage.getAll();
    const filtered = books.filter(book => book.id !== id);
    
    if (filtered.length === books.length) return false;
    
    Storage.set(BOOK_KEY, filtered);
    return true;
  },

  // 借出图书（减少库存）
  borrow: (id: string): boolean => {
    const book = BookStorage.getById(id);
    if (!book || book.stock <= 0) return false;

    const newStock = book.stock - 1;
    const newStatus = newStock === 0 ? 'borrowed' : 'available';

    return BookStorage.update(id, {
      stock: newStock,
      status: newStatus,
      borrowCount: book.borrowCount + 1
    }) !== null;
  },

  // 归还图书（增加库存）
  return: (id: string): boolean => {
    const book = BookStorage.getById(id);
    if (!book) return false;

    const newStock = Math.min(book.stock + 1, book.totalStock);
    const newStatus = newStock > 0 ? 'available' : 'borrowed';

    return BookStorage.update(id, {
      stock: newStock,
      status: newStatus
    }) !== null;
  },

  // 搜索图书
  search: (keyword: string = ''): Book[] => {
    const books = BookStorage.getAll();
    if (!keyword) return books;

    const lowerKeyword = keyword.toLowerCase();
    return books.filter(book => 
      book.title.toLowerCase().includes(lowerKeyword) ||
      book.author.toLowerCase().includes(lowerKeyword) ||
      book.isbn.includes(keyword) ||
      book.publisher.toLowerCase().includes(lowerKeyword) ||
      book.category.toLowerCase().includes(lowerKeyword)
    );
  },

  // 按分类筛选
  getByCategory: (category: string): Book[] => {
    const books = BookStorage.getAll();
    if (!category || category === '全部') return books;
    return books.filter(book => book.category === category);
  },

  // 获取统计
  getStats: () => {
    const books = BookStorage.getAll();
    return {
      total: books.length,
      available: books.filter(b => b.status === 'available').length,
      borrowed: books.filter(b => b.status === 'borrowed').length,
      totalStock: books.reduce((sum, b) => sum + b.totalStock, 0),
      totalBorrowCount: books.reduce((sum, b) => sum + b.borrowCount, 0)
    };
  }
};
