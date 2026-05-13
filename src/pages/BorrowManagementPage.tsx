import React, { useState, useEffect } from 'react';
import { Book } from '../types/book';
import { BorrowRecord } from '../types/borrow';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { Search, Plus, RefreshCw, BookOpen, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const BorrowManagementPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showReturnConfirm, setShowReturnConfirm] = useState<BorrowRecord | null>(null);
  const [showRenewConfirm, setShowRenewConfirm] = useState<BorrowRecord | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [borrowForm, setBorrowForm] = useState({
    userId: '',
    username: '',
    borrowDays: 30,
    remark: ''
  });
  const [activeTab, setActiveTab] = useState<'active' | 'all'>('active');

  // 加载数据
  const loadData = () => {
    const booksData = BookStorage.getAll();
    const recordsData = BorrowStorage.getAll();
    setBooks(booksData);
    setBorrowRecords(recordsData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // 过滤后的记录
  const filteredRecords = borrowRecords.filter(record => {
    if (activeTab === 'active') {
      if (record.status === 'returned') return false;
    }
    
    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      return (
        record.bookTitle.toLowerCase().includes(keyword) ||
        record.username.toLowerCase().includes(keyword) ||
        record.bookIsbn?.toLowerCase().includes(keyword)
      );
    }
    
    return true;
  });

  // 显示消息
  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  // 借阅图书
  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBook) return;
    
    try {
      const result = BorrowStorage.add({
        bookId: selectedBook.id,
        userId: borrowForm.userId || 'user_' + Date.now(),
        username: borrowForm.username,
        borrowDays: borrowForm.borrowDays,
        remark: borrowForm.remark
      }, 'admin', '管理员');
      
      if (result) {
        showMessage('借阅成功！', 'success');
        setShowBorrowModal(false);
        setSelectedBook(null);
        setBorrowForm({ userId: '', username: '', borrowDays: 30, remark: '' });
        loadData();
      } else {
        showMessage('借阅失败，库存不足！', 'error');
      }
    } catch (error) {
      showMessage('借阅失败！', 'error');
    }
  };

  // 归还图书
  const handleReturn = () => {
    if (!showReturnConfirm) return;
    
    try {
      const success = BorrowStorage.return(showReturnConfirm.id, 'admin', '管理员');
      if (success) {
        showMessage('归还成功！', 'success');
        setShowReturnConfirm(null);
        loadData();
      } else {
        showMessage('归还失败！', 'error');
      }
    } catch (error) {
      showMessage('归还失败！', 'error');
    }
  };

  // 续借
  const handleRenew = () => {
    if (!showRenewConfirm) return;
    
    try {
      const result = BorrowStorage.renew(showRenewConfirm.id, 30);
      if (result) {
        showMessage('续借成功！', 'success');
        setShowRenewConfirm(null);
        loadData();
      } else {
        showMessage('续借失败，已达最大续借次数！', 'error');
      }
    } catch (error) {
      showMessage('续借失败！', 'error');
    }
  };

  // 删除记录
  const handleDelete = (id: string) => {
    try {
      BorrowStorage.delete(id);
      showMessage('删除成功！', 'success');
      loadData();
    } catch (error) {
      showMessage('删除失败！', 'error');
    }
  };

  // 可借阅的图书
  const availableBooks = books.filter(book => book.stock > 0);

  // 获取状态标签
  const getStatusLabel = (status: string) => {
    const labels = {
      borrowed: { text: '借出中', class: 'bg-yellow-100 text-yellow-800' },
      renewed: { text: '已续借', class: 'bg-blue-100 text-blue-800' },
      returned: { text: '已归还', class: 'bg-green-100 text-green-800' },
      overdue: { text: '已逾期', class: 'bg-red-100 text-red-800' }
    };
    return labels[status as keyof typeof labels] || { text: status, class: 'bg-gray-100 text-gray-800' };
  };

  // 检查是否逾期
  const isOverdue = (record: BorrowRecord) => {
    if (record.status === 'returned') return false;
    return new Date(record.dueDate) < new Date();
  };

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 消息提示 */}
      {message && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* 头部 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="text-purple-600" />
                借阅管理
              </h1>
              <p className="text-gray-500 mt-1">共 {borrowRecords.length} 条借阅记录</p>
            </div>
            <div className="flex items-center gap-3">
              {/* 搜索框 */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="搜索图书、借阅人..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
                />
              </div>
              {/* 刷新按钮 */}
              <button
                onClick={loadData}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw size={18} />
                刷新
              </button>
              {/* 借阅按钮 */}
              <button
                onClick={() => {
                  setShowBorrowModal(true);
                }}
                className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <Plus size={20} />
                借阅图书
              </button>
            </div>
          </div>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">总借阅次数</div>
            <div className="text-2xl font-bold text-gray-900">{borrowRecords.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">进行中</div>
            <div className="text-2xl font-bold text-yellow-600">
              {borrowRecords.filter(r => r.status !== 'returned').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">已归还</div>
            <div className="text-2xl font-bold text-green-600">
              {borrowRecords.filter(r => r.status === 'returned').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">已逾期</div>
            <div className="text-2xl font-bold text-red-600">
              {borrowRecords.filter(r => isOverdue(r)).length}
            </div>
          </div>
        </div>

        {/* 标签页 */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex gap-4 px-4">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
                  activeTab === 'active'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                进行中
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`py-3 px-4 border-b-2 font-medium text-sm transition ${
                  activeTab === 'all'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                全部记录
              </button>
            </nav>
          </div>
        </div>

        {/* 借阅记录列表 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图书</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借阅人</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借阅日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">应还日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">归还日期</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => {
                const status = getStatusLabel(isOverdue(record) ? 'overdue' : record.status);
                return (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
                      <div className="text-sm text-gray-500">{record.bookIsbn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.username || '未知用户'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(record.borrowDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${isOverdue(record) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                        {formatDate(record.dueDate)}
                        {isOverdue(record) && <span className="ml-2">(逾期)</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.returnDate ? formatDate(record.returnDate) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.class}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {record.status !== 'returned' && (
                          <>
                            <button
                              onClick={() => setShowReturnConfirm(record)}
                              className="text-green-600 hover:text-green-900"
                            >
                              归还
                            </button>
                            <button
                              onClick={() => setShowRenewConfirm(record)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              续借
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            if (confirm('确定要删除这条记录吗？')) {
                              handleDelete(record.id);
                            }
                          }}
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

          {filteredRecords.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">暂无借阅记录</h3>
              <p className="mt-1 text-sm text-gray-500">点击"借阅图书"开始</p>
            </div>
          )}
        </div>
      </div>

      {/* 借阅模态框 */}
      {showBorrowModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">借阅图书</h2>
              <button
                onClick={() => {
                  setShowBorrowModal(false);
                  setSelectedBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleBorrow} className="p-6 space-y-4">
              {!selectedBook ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">选择图书</label>
                  <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                    {availableBooks.map(book => (
                      <div
                        key={book.id}
                        onClick={() => setSelectedBook(book)}
                        className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                      >
                        <div className="font-medium text-gray-900">{book.title}</div>
                        <div className="text-sm text-gray-500">{book.author} · 库存: {book.stock}</div>
                      </div>
                    ))}
                    {availableBooks.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        暂无可借阅的图书
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-900">{selectedBook.title}</div>
                    <div className="text-sm text-gray-500">{selectedBook.author} · {selectedBook.publisher}</div>
                    <div className="text-sm text-gray-500 mt-1">库存: {selectedBook.stock}</div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">借阅人姓名</label>
                    <input
                      type="text"
                      value={borrowForm.username}
                      onChange={(e) => setBorrowForm({ ...borrowForm, username: e.target.value })}
                      placeholder="请输入借阅人姓名"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">借阅天数</label>
                    <select
                      value={borrowForm.borrowDays}
                      onChange={(e) => setBorrowForm({ ...borrowForm, borrowDays: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value={7}>7天</option>
                      <option value={15}>15天</option>
                      <option value={30}>30天</option>
                      <option value={60}>60天</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                    <textarea
                      value={borrowForm.remark}
                      onChange={(e) => setBorrowForm({ ...borrowForm, remark: e.target.value })}
                      rows={2}
                      placeholder="可选备注"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBook(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      重选图书
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowBorrowModal(false);
                        setSelectedBook(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      确认借阅
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* 归还确认模态框 */}
      {showReturnConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">确认归还</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-2">
                确定要归还《{showReturnConfirm.bookTitle}》吗？
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <div>借阅人: {showReturnConfirm.username || '未知用户'}</div>
                <div>借阅日期: {formatDate(showReturnConfirm.borrowDate)}</div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowReturnConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleReturn}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  确认归还
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 续借确认模态框 */}
      {showRenewConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">确认续借</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-2">
                确定要续借《{showRenewConfirm.bookTitle}》吗？
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <div>当前续借次数: {showRenewConfirm.renewCount}/{showRenewConfirm.maxRenewCount}</div>
                <div>原应还日期: {formatDate(showRenewConfirm.dueDate)}</div>
                <div>续借后应还日期: {(() => {
                  const newDate = new Date(showRenewConfirm.dueDate);
                  newDate.setDate(newDate.getDate() + 30);
                  return formatDate(newDate.toISOString());
                })()}</div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowRenewConfirm(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  onClick={handleRenew}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  确认续借
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowManagementPage;
