import { useState, useEffect, useMemo } from 'react';
import { Book, BookFormData } from '../types/book';

const STORAGE_KEY = 'library_books';

export const useBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setBooks(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored books:', e);
      }
    } else {
      const now = new Date().toISOString();
      const sampleBooks: Book[] = [
        {
          id: 'bk_1',
          userId: 'user_1',
          title: 'JavaScript高级程序设计',
          author: 'Nicholas C. Zakas',
          isbn: '978-7-115-42833-8',
          publisher: '人民邮电出版社',
          publishDate: '2020-03',
          category: '技术',
          description: 'JavaScript经典著作，涵盖ES6+新特性，深入讲解语言核心。',
          cover: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=300&h=400&fit=crop',
          rating: 5,
          status: 'available',
          stock: 3,
          totalStock: 5,
          borrowCount: 120,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'bk_2',
          userId: 'user_1',
          title: '算法导论',
          author: 'Thomas H. Cormen',
          isbn: '978-7-111-40701-0',
          publisher: '机械工业出版社',
          publishDate: '2012-12',
          category: '技术',
          description: '算法领域的经典教材，系统介绍各种基本算法。',
          cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=400&fit=crop',
          rating: 4,
          status: 'available',
          stock: 2,
          totalStock: 4,
          borrowCount: 85,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'bk_3',
          userId: 'user_1',
          title: '设计心理学',
          author: '唐纳德·A·诺曼',
          isbn: '978-7-115-29307-8',
          publisher: '中信出版社',
          publishDate: '2010-09',
          category: '设计',
          description: '理解用户行为，提升产品设计质量。',
          cover: 'https://images.unsplash.com/photo-1586717799252-bd134ad00e26?w=300&h=400&fit=crop',
          rating: 5,
          status: 'borrowed',
          stock: 0,
          totalStock: 3,
          borrowCount: 67,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'bk_4',
          userId: 'user_1',
          title: '人类简史',
          author: '尤瓦尔·赫拉利',
          isbn: '978-7-5443-4747-4',
          publisher: '中信出版社',
          publishDate: '2014-11',
          category: '历史',
          description: '从动物到上帝，讲述人类历史的宏大叙事。',
          cover: 'https://images.unsplash.com/photo-1461360370896-922624d12a74?w=300&h=400&fit=crop',
          rating: 5,
          status: 'available',
          stock: 4,
          totalStock: 4,
          borrowCount: 156,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'bk_5',
          userId: 'user_1',
          title: '百年孤独',
          author: '加西亚·马尔克斯',
          isbn: '978-7-5322-4232-0',
          publisher: '上海译文出版社',
          publishDate: '2011-06',
          category: '文学',
          description: '魔幻现实主义文学的代表作，布恩迪亚家族七代人的传奇故事。',
          cover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
          rating: 4,
          status: 'reserved',
          stock: 1,
          totalStock: 2,
          borrowCount: 98,
          createdAt: now,
          updatedAt: now
        },
        {
          id: 'bk_6',
          userId: 'user_1',
          title: '经济学原理',
          author: '曼昆',
          isbn: '978-7-111-40764-5',
          publisher: '北京大学出版社',
          publishDate: '2015-05',
          category: '经济',
          description: '通俗易懂的经济学入门教材，涵盖微观和宏观经济学。',
          cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop',
          rating: 4,
          status: 'available',
          stock: 5,
          totalStock: 5,
          borrowCount: 112,
          createdAt: now,
          updatedAt: now
        }
      ];
      setBooks(sampleBooks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleBooks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }, [books]);

  const addBook = (bookData: BookFormData): Book => {
    const now = new Date().toISOString();
    const newBook: Book = {
      ...bookData,
      id: `bk_${Date.now()}`,
      userId: 'user_1',
      borrowCount: 0,
      status: bookData.status || 'available',
      createdAt: now,
      updatedAt: now
    };
    setBooks(prev => [newBook, ...prev]);
    return newBook;
  };

  const updateBook = (id: string, bookData: Partial<BookFormData>): Book | null => {
    let updatedBook: Book | null = null;
    setBooks(prev => prev.map(book => {
      if (book.id === id) {
        updatedBook = { ...book, ...bookData };
        return updatedBook;
      }
      return book;
    }));
    return updatedBook;
  };

  const deleteBook = (id: string): boolean => {
    const existed = books.find(b => b.id === id);
    if (existed) {
      setBooks(prev => prev.filter(book => book.id !== id));
      return true;
    }
    return false;
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(book => book.id === id);
  };

  const categories = useMemo(() => {
    const cats = new Set(books.map(book => book.category).filter(Boolean));
    return Array.from(cats) as string[];
  }, [books]);

  const filteredBooks = useMemo(() => {
    let result = books;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(book =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.isbn?.toLowerCase().includes(query) ||
        book.publisher?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter(book => book.category === selectedCategory);
    }

    return result;
  }, [books, searchQuery, selectedCategory]);

  return {
    books,
    filteredBooks,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    addBook,
    updateBook,
    deleteBook,
    getBookById
  };
};
