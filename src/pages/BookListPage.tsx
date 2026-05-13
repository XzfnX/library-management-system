import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { useCategories } from '../context/CategoryContext';
import { BookStorage } from '../utils/bookStorage';
import { Book, BookFormData, BookStatus } from '../types/book';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { BookOpen, Plus, Trash2, Search, BarChart2, MapPin, DollarSign, Package, AlertTriangle } from 'lucide-react';

export const BookListPage = () => {
  const { user } = useAuth();
  const { books } = useBooks();
  const { categories } = useCategories();
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [removeAction, setRemoveAction] = useState<'damage' | 'lost' | 'delete'>('delete');
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishDate: '',
    category: '',
    description: '',
    stock: 1,
    totalStock: 1,
    location: '',
    price: 0
  });

  useEffect(() => {
    filterBooks();
  }, [books, searchQuery, categoryFilter, statusFilter]);

  const filterBooks = () => {
    let filtered = [...books];

    if (searchQuery) {
      const keyword = searchQuery.toLowerCase();
      filtered = filtered.filter(b =>
        b.title.toLowerCase().includes(keyword) ||
        b.author.toLowerCase().includes(keyword) ||
        b.isbn.toLowerCase().includes(keyword) ||
        b.publisher.toLowerCase().includes(keyword)
      );
    }

    if (categoryFilter && categoryFilter !== '全部') {
      filtered = filtered.filter(b => b.category === categoryFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    setFilteredBooks(filtered);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.author || !formData.isbn) {
      alert('请填写必填字段（书名、作者、ISBN）');
      return;
    }

    if (BookStorage.isIsbnExists(formData.isbn)) {
      alert('ISBN已存在');
      return;
    }

    BookStorage.add('admin', formData);
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedBook) return;

    if (BookStorage.isIsbnExists(formData.isbn, selectedBook.id)) {
      alert('ISBN已存在');
      return;
    }

    BookStorage.update(selectedBook.id, formData);
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedBook) {
      BookStorage.delete(selectedBook.id);
      setShowConfirmDialog(false);
      setSelectedBook(null);
    }
  };

  const handleRemove = () => {
    if (!selectedBook) return;
    
    if (removeAction === 'delete') {
      BookStorage.delete(selectedBook.id);
    } else if (removeAction === 'damage') {
      BookStorage.update(selectedBook.id, { 
        status: 'damaged' as BookStatus,
        stock: 0 
      });
    } else if (removeAction === 'lost') {
      BookStorage.update(selectedBook.id, { 
        status: 'lost' as BookStatus,
        stock: 0 
      });
    }
    
    setShowRemoveModal(false);
    setSelectedBook(null);
    setRemoveAction('delete');
  };

  const openRemoveModal = (book: Book, action: 'damage' | 'lost' | 'delete') => {
    setSelectedBook(book);
    setRemoveAction(action);
    setShowRemoveModal(true);
  };

  const openEditModal = (book: Book) => {
    setSelectedBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      publisher: book.publisher,
      publishDate: book.publishDate,
      category: book.category,
      description: book.description,
      stock: book.stock,
      totalStock: book.totalStock,
      location: book.location || '',
      price: book.price || 0
    });
    setShowEditModal(true);
  };

  const openDetailModal = (book: Book) => {
    setSelectedBook(book);
    setShowDetailModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      isbn: '',
      publisher: '',
      publishDate: '',
      category: '',
      description: '',
      stock: 1,
      totalStock: 1,
      location: '',
      price: 0
    });
    setSelectedBook(null);
  };

  const getStatusBadge = (status: BookStatus) => {
    const badges = {
      available: { label: '可借阅', class: 'bg-green-100 text-green-700' },
      borrowed: { label: '已借出', class: 'bg-blue-100 text-blue-700' },
      reserved: { label: '已预约', class: 'bg-yellow-100 text-yellow-700' },
      damaged: { label: '已损坏', class: 'bg-orange-100 text-orange-700' },
      lost: { label: '已丢失', class: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BookOpen className="text-[#00693e]" />
            图书管理
          </h1>
          <p className="text-gray-500">管理图书馆馆藏书籍</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00693e] text-white rounded-lg hover:bg-[#004d30] transition shadow-lg"
        >
          <Plus size={20} />
          录入图书
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索书名、作者、ISBN或出版社..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
          >
            <option value="全部">全部分类</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BookStatus | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
          >
            <option value="all">全部状态</option>
            <option value="available">可借阅</option>
            <option value="borrowed">已借出</option>
            <option value="reserved">已预约</option>
            <option value="damaged">已损坏</option>
            <option value="lost">已丢失</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
            <div className="p-4">
              <div className="h-40 bg-gradient-to-br from-[#00693e] to-[#004d30] rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-white" size={48} />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">{book.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{book.author}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <BarChart2 size={16} />
                  <span className="truncate">{book.category}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Package size={16} />
                  <span>{book.stock}/{book.totalStock}</span>
                </div>
                {book.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span className="truncate">{book.location}</span>
                  </div>
                )}
                {book.price && (
                  <div className="flex items-center gap-2 text-[#ff6b35] font-medium">
                    <DollarSign size={16} />
                    <span>{book.price.toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                {getStatusBadge(book.status)}
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openDetailModal(book)}
                  className="flex-1 px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm"
                >
                  详情
                </button>
                <button
                  onClick={() => openEditModal(book)}
                  className="flex-1 px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition text-sm"
                >
                  编辑
                </button>
                {user?.role === 'admin' && book.status !== 'damaged' && book.status !== 'lost' && (
                  <button
                    onClick={() => openRemoveModal(book, 'damage')}
                    className="px-3 py-2 text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 transition"
                    title="标记损坏"
                  >
                    <AlertTriangle size={18} />
                  </button>
                )}
                <button
                  onClick={() => openRemoveModal(book, 'delete')}
                  className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
                  title="删除"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="py-20 text-center">
          <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-500">暂无图书数据</p>
        </div>
      )}

      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="录入图书"
        >
          <form onSubmit={handleAdd} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">书名 *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入书名"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">作者 *</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入作者"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN *</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入ISBN"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">出版社</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入出版社"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">出版日期</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">当前库存</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">总库存</label>
                <input
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">存放位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="如：A区-01-01"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">单价</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">简介</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
                placeholder="请输入图书简介"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#00693e] text-white rounded-lg font-semibold hover:bg-[#004d30]"
              >
                确认录入
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && selectedBook && (
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); resetForm(); }}
          title="编辑图书"
        >
          <form onSubmit={handleEdit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">书名</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">作者</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">出版社</label>
                <input
                  type="text"
                  value={formData.publisher}
                  onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">出版日期</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">分类</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="">请选择分类</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">当前库存</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">总库存</label>
                <input
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) => setFormData({ ...formData, totalStock: parseInt(e.target.value) || 0 })}
                  min={0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">存放位置</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">单价</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  min={0}
                  step="0.01"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">简介</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#00693e] text-white rounded-lg font-semibold hover:bg-[#004d30]"
              >
                保存修改
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showDetailModal && selectedBook && (
        <Modal
          isOpen={showDetailModal}
          onClose={() => { setShowDetailModal(false); setSelectedBook(null); }}
          title={selectedBook.title}
        >
          <div className="p-6">
            <div className="flex gap-6">
              <div className="w-32 h-44 bg-gradient-to-br from-[#00693e] to-[#004d30] rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="text-white" size={48} />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{selectedBook.title}</h3>
                <p className="text-gray-600 mb-4">作者：{selectedBook.author}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">ISBN</p>
                    <p className="font-medium text-gray-800">{selectedBook.isbn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">出版社</p>
                    <p className="font-medium text-gray-800">{selectedBook.publisher}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">出版日期</p>
                    <p className="font-medium text-gray-800">{selectedBook.publishDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">分类</p>
                    <p className="font-medium text-gray-800">{selectedBook.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">库存</p>
                    <p className="font-medium text-gray-800">{selectedBook.stock}/{selectedBook.totalStock}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">位置</p>
                    <p className="font-medium text-gray-800">{selectedBook.location || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">单价</p>
                    <p className="font-medium text-[#ff6b35]">¥{selectedBook.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">借阅次数</p>
                    <p className="font-medium text-gray-800">{selectedBook.borrowCount}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {selectedBook.description && (
              <div className="mt-6">
                <p className="text-sm text-gray-500 mb-2">简介</p>
                <p className="text-gray-700">{selectedBook.description}</p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { setShowDetailModal(false); setSelectedBook(null); }}
                className="px-6 py-3 bg-[#00693e] text-white rounded-lg font-semibold hover:bg-[#004d30]"
              >
                关闭
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showConfirmDialog && selectedBook && (
        <ConfirmDialog
          title="确认删除"
          message={`确认删除图书 "${selectedBook.title}" 吗？此操作不可撤销。`}
          onConfirm={handleDelete}
          onCancel={() => { setShowConfirmDialog(false); setSelectedBook(null); }}
        />
      )}

      {showRemoveModal && selectedBook && (
        <Modal
          isOpen={showRemoveModal}
          onClose={() => { setShowRemoveModal(false); setSelectedBook(null); }}
          title={removeAction === 'damage' ? '标记损坏' : removeAction === 'lost' ? '标记丢失' : '删除图书'}
        >
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                removeAction === 'damage' ? 'bg-orange-100' : 
                removeAction === 'lost' ? 'bg-red-100' : 'bg-gray-100'
              }`}>
                {removeAction === 'damage' ? (
                  <AlertTriangle className="text-orange-600" size={32} />
                ) : (
                  <Trash2 className="text-red-600" size={32} />
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800">{selectedBook.title}</h3>
                <p className="text-gray-500">{selectedBook.author} · {selectedBook.isbn}</p>
              </div>
            </div>

            {removeAction === 'damage' ? (
              <div className="space-y-4">
                <p className="text-gray-600">确认将图书标记为"已损坏"吗？标记后该图书将不再可供借阅。</p>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <p className="text-sm text-orange-700">提示：如果图书可以修复，请修复后重新上架；如果无法修复，可以选择删除。</p>
                </div>
              </div>
            ) : removeAction === 'lost' ? (
              <div className="space-y-4">
                <p className="text-gray-600">确认将图书标记为"已丢失"吗？标记后该图书将不再可供借阅。</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">提示：请先确认图书确实丢失后再进行此操作。</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">确认删除图书 "{selectedBook.title}" 吗？此操作不可撤销。</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-sm text-red-700">警告：删除后将无法恢复该图书的所有数据，包括借阅记录。</p>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => { setShowRemoveModal(false); setSelectedBook(null); }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleRemove}
                className={`flex-1 px-6 py-3 text-white rounded-lg font-semibold ${
                  removeAction === 'damage' ? 'bg-orange-500 hover:bg-orange-600' : 
                  'bg-red-500 hover:bg-red-600'
                }`}
              >
                {removeAction === 'damage' ? '确认标记损坏' : removeAction === 'lost' ? '确认标记丢失' : '确认删除'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
