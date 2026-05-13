import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, BookFormData, BookStatus } from '../types/book';
import { BookStorage } from '../utils/bookStorage';

interface BookContextType {
  books: Book[];
  addBook: (bookData: BookFormData) => Book | null;
  updateBook: (id: string, bookData: Partial<BookFormData>) => boolean;
  deleteBook: (id: string) => boolean;
  getBookById: (id: string) => Book | null;
  filterBooks: (filters: {
    category?: string;
    status?: BookStatus | 'all';
  }) => Book[];
  getStats: () => {
    total: number;
    reading: number;
    completed: number;
    unread: number;
  };
  refreshBooks: () => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    const allBooks = BookStorage.getAll();
    setBooks(allBooks);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const allBooks = BookStorage.getAll();
      setBooks(allBooks);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addBook = (bookData: BookFormData): Book | null => {
    const newBook = BookStorage.add('admin', bookData);
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id: string, bookData: Partial<BookFormData>): boolean => {
    const updated = BookStorage.update(id, bookData);
    if (updated) {
      setBooks(prev => prev.map(book => book.id === id ? updated : book));
      return true;
    }
    return false;
  };

  const deleteBook = (id: string): boolean => {
    const success = BookStorage.delete(id);
    if (success) {
      setBooks(prev => prev.filter(book => book.id !== id));
    }
    return success;
  };

  const getBookById = (id: string): Book | null => {
    return books.find(book => book.id === id) || null;
  };

  const filterBooks = (filters: {
    category?: string;
    status?: BookStatus | 'all';
  }): Book[] => {
    let filtered = [...books];

    if (filters.category && filters.category !== 'all' && filters.category !== '全部') {
      filtered = filtered.filter(b => b.category === filters.category);
    }

    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(b => b.status === filters.status);
    }

    return filtered;
  };

  const getStats = () => {
    return {
      total: books.length,
      reading: books.filter(b => b.status === 'borrowed').length,
      completed: books.filter(b => b.status === 'available').length,
      unread: books.filter(b => b.status === 'reserved').length
    };
  };

  const refreshBooks = () => {
    const allBooks = BookStorage.getAll();
    setBooks(allBooks);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        addBook,
        updateBook,
        deleteBook,
        getBookById,
        filterBooks,
        getStats,
        refreshBooks
      }}
    >
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = () => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
