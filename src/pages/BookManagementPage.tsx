import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { bookService } from '../services/bookService';
import { Search, Plus, Edit, Trash2, BookOpen, Info, CheckCircle, XCircle } from 'lucide-react';
import AdminLayout from '../layouts/AdminLayout';

const BookManagementPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: new Date().toISOString().split('T')[0],
    category: '文学',
    description: '',
    stock: 1,
    isPublic: 1
  });

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const response = await bookService.getBooks({
        page: 1,
        size: 100,
        keyword: searchKeyword || undefined
      });
      setBooks(response.records);
    } catch (error) {
      console.error('加载图书失败:', error);
      showMessage('加载图书失败！', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBooks();
  }, [searchKeyword]);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleAddBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await bookService.addBook(formData);
      showMessage('添加图书成功！', 'success');
      setShowAddModal(false);
      resetForm();
      loadBooks();
    } catch (error) {
      showMessage('添加图书失败！', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;
    
    setIsLoading(true);
    try {
      await bookService.updateBook(Number(editingBook.id), formData);
      showMessage('更新图书成功！', 'success');
      setEditingBook(null);
      resetForm();
      loadBooks();
    } catch (error) {
      showMessage('更新图书失败！', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBook = async (id: string) => {
    setIsLoading(true);
    try {
      await bookService.deleteBook(Number(id));
      showMessage('删除图书成功！', 'success');
      setShowDeleteConfirm(null);
      loadBooks();
    } catch (error) {
      showMessage('删除图书失败！', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishDate: new Date().toISOString().split('T')[0],
      category: '文学',
      description: '',
      stock: 1,
      isPublic: 1
    });
  };

  const openEdit = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishDate: book.publishDate,
      category: book.category,
      description: book.description,
      stock: book.stock,
      isPublic: book.isPublic
    });
  };

  const getStatusLabel = (stock: number) => {
    if (stock > 0) {
      return { text: '可借阅', class: 'bg-green-100 text-green-800' };
    }
    return { text: '已借出', class: 'bg-yellow-100 text-yellow-800' };
  };

  return (
    <AdminLayout title="图书管理" showBack={true}>
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </div>
      )}

      <div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-purple-600" />
                图书管理
              </h1>
              <p className="text-gray-500 mt-1">共 {books.length} 本图书</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索书名、作者、ISBN..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setEditingBook(null);
                  setShowAddModal(true);
                }}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Plus size={20} />
                添加图书
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">图书总数</div>
            <div className="text-2xl font-bold text-gray-900">{books.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">可借阅</div>
            <div className="text-2xl font-bold text-green-600">{books.filter(b => b.stock > 0).length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">已借出</div>
            <div className="text-2xl font-bold text-yellow-600">{books.filter(b => b.stock === 0).length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">总借阅次数</div>
            <div className="text-2xl font-bold text-blue-600">{books.reduce((sum, b) => sum + (b.borrowCount || 0), 0)}</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">书名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ISBN</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">库存</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">加载中...</p>
                  </td>
                </tr>
              ) : books.map((book) => {
                const status = getStatusLabel(book.stock);
                return (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{book.title}</div>
                      <div className="text-sm text-gray-500">{book.publisher}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.isbn}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{book.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedBook(book);
                            setShowDetail(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Info size={16} />
                        </button>
                        <button
                          onClick={() => openEdit(book)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(String(book.id))}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!isLoading && books.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无图书</h3>
              <p className="mt-1 text-sm text-gray-500">点击"添加图书"开始</p>
            </div>
          )}
        </div>
      </div>

      {(showAddModal || editingBook) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingBook ? '编辑图书' : '添加图书'}
              </h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={editingBook ? handleEditBook : handleAddBook} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">书名 *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">作者 *</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ISBN *</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出版社 *</label>
                  <input
                    type="text"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleFormChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">出版日期</label>
                  <input
                    type="date"
                    name="publishDate"
                    value={formData.publishDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="文学">文学</option>
                    <option value="科技">科技</option>
                    <option value="计算机">计算机</option>
                    <option value="经济">经济</option>
                    <option value="管理">管理</option>
                    <option value="艺术">艺术</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">库存</label>
                  <input
                    type="number"
                    name="stock"
                    min="0"
                    value={formData.stock}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">是否公开</label>
                  <select
                    name="isPublic"
                    value={formData.isPublic}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>是</option>
                    <option value={0}>否</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingBook(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? '加载中...' : (editingBook ? '保存修改' : '添加图书')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">图书详情</h2>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">书名</div>
                  <div className="font-medium text-gray-900">{selectedBook.title}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">作者</div>
                  <div className="font-medium text-gray-900">{selectedBook.author}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">ISBN</div>
                  <div className="font-medium text-gray-900">{selectedBook.isbn}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">出版社</div>
                  <div className="font-medium text-gray-900">{selectedBook.publisher}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">分类</div>
                  <div className="font-medium text-gray-900">{selectedBook.category}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">状态</div>
                  <div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusLabel(selectedBook.stock).class}`}>
                      {getStatusLabel(selectedBook.stock).text}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">库存</div>
                  <div className="font-medium text-gray-900">{selectedBook.stock}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">评分</div>
                  <div className="font-medium text-gray-900">{selectedBook.rating || 0}</div>
                </div>
              </div>
              
              {selectedBook.description && (
                <div>
                  <div className="text-sm text-gray-500">描述</div>
                  <div className="text-gray-700 mt-1">{selectedBook.description}</div>
                </div>
              )}
              
              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setShowDetail(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">确认删除</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600">确定要删除这本图书吗？此操作无法撤销。</p>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={() => handleDeleteBook(showDeleteConfirm)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isLoading ? '删除中...' : '确认删除'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default BookManagementPage;
