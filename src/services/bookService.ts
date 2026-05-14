import { Book, BookFormData, BookQueryParams, BookPageResult } from '../types/book';
import { Storage } from './storage';

const BOOK_KEY = 'library_books';

export const BookService = {
  getAll: (): Book[] => {
    return Storage.get<Book[]>(BOOK_KEY, []);
  },

  getById: (id: string): Book | undefined => {
    const books = BookService.getAll();
    return books.find(book => book.id === id);
  },

  add: (data: BookFormData, userId: string = 'system'): Book => {
    const books = BookService.getAll();
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

  update: (id: string, data: Partial<BookFormData>): Book | null => {
    const books = BookService.getAll();
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

  delete: (id: string): boolean => {
    const books = BookService.getAll();
    const filtered = books.filter(book => book.id !== id);
    
    if (filtered.length === books.length) return false;
    
    Storage.set(BOOK_KEY, filtered);
    return true;
  },

  borrow: (id: string): boolean => {
    const book = BookService.getById(id);
    if (!book || book.stock <= 0) return false;

    const newStock = book.stock - 1;
    const newStatus = newStock === 0 ? 'borrowed' : 'available';

    return BookService.update(id, {
      stock: newStock,
      status: newStatus,
      borrowCount: book.borrowCount + 1
    }) !== null;
  },

  return: (id: string): boolean => {
    const book = BookService.getById(id);
    if (!book) return false;

    const newStock = Math.min(book.stock + 1, book.totalStock);
    const newStatus = newStock > 0 ? 'available' : 'borrowed';

    return BookService.update(id, {
      stock: newStock,
      status: newStatus
    }) !== null;
  },

  search: (keyword: string = ''): Book[] => {
    const books = BookService.getAll();
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

  query: (params: BookQueryParams = {}): BookPageResult => {
    let books = BookService.getAll();
    
    if (params.keyword) {
      books = BookService.search(params.keyword);
    }
    
    if (params.category && params.category !== '全部') {
      books = books.filter(book => book.category === params.category);
    }
    
    if (params.status) {
      books = books.filter(book => book.status === params.status);
    }
    
    if (params.author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(params.author!.toLowerCase())
      );
    }
    
    if (params.publisher) {
      books = books.filter(book => 
        book.publisher.toLowerCase().includes(params.publisher!.toLowerCase())
      );
    }
    
    if (params.sortBy) {
      books = [...books].sort((a, b) => {
        const aVal = (a as any)[params.sortBy!];
        const bVal = (b as any)[params.sortBy!];
        const order = params.sortOrder === 'desc' ? -1 : 1;
        return aVal > bVal ? order : -order;
      });
    }
    
    const total = books.length;
    const page = params.page || 1;
    const pageSize = params.pageSize || 20;
    const totalPages = Math.ceil(total / pageSize);
    
    const start = (page - 1) * pageSize;
    const list = books.slice(start, start + pageSize);
    
    return { list, total, page, pageSize, totalPages };
  },

  getByCategory: (category: string): Book[] => {
    const books = BookService.getAll();
    if (!category || category === '全部') return books;
    return books.filter(book => book.category === category);
  },

  getCategories: (): string[] => {
    const books = BookService.getAll();
    const categories = new Set(books.map(book => book.category));
    return Array.from(categories).sort();
  },

  getStats: () => {
    const books = BookService.getAll();
    return {
      total: books.length,
      available: books.filter(b => b.status === 'available').length,
      borrowed: books.filter(b => b.status === 'borrowed').length,
      totalStock: books.reduce((sum, b) => sum + b.totalStock, 0),
      availableStock: books.reduce((sum, b) => sum + b.stock, 0),
      totalBorrowCount: books.reduce((sum, b) => sum + b.borrowCount, 0)
    };
  },

  clearAll: () => {
    Storage.set(BOOK_KEY, []);
  },

  setAll: (books: Book[]) => {
    Storage.set(BOOK_KEY, books);
  }
};
