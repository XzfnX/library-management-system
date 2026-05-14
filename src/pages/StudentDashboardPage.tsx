import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../types/book';
import { BorrowRecord } from '../types/borrow';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { Search, BookOpen, Clock, CheckCircle, AlertCircle, Calendar, LogOut, User, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, checkAuth } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [activeTab, setActiveTab] = useState<'browse' | 'myBorrows'>('browse');
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!checkAuth('student')) {
      navigate('/login');
      return;
    }
    loadData();
  }, [checkAuth, navigate]);

  const loadData = () => {
    const booksData = BookStorage.getAll();
    setBooks(booksData);
    const borrowsData = BorrowStorage.getAll();
    setBorrowRecords(borrowsData);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredStudentBorrows = borrowRecords.filter(record => 
    currentUser && record.username === currentUser.username
  );

  const filteredBooks = books.filter(book => {
    if (!searchKeyword) return book.status === 'available' || book.stock > 0;
    const keyword = searchKeyword.toLowerCase();
    return (
      (book.title.toLowerCase().includes(keyword) ||
      book.author.toLowerCase().includes(keyword) ||
      book.isbn.includes(keyword) ||
      book.category.toLowerCase().includes(keyword)) &&
      (book.status === 'available' || book.stock > 0)
    );
  });

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleBorrow = (book: Book) => {
    setSelectedBook(book);
    setShowBorrowModal(true);
  };

  const confirmBorrow = () => {
    if (!selectedBook || !currentUser) return;

    try {
      const result = BorrowService.add({
        bookId: selectedBook.id,
        userId: currentUser.id,
        username: currentUser.username,
        borrowDays: 30,
        remark: '学生借阅'
      }, 'system', '学生自助借阅');

      if (result) {
        showMessage(`《${selectedBook.title}》借阅成功！`, 'success');
        setShowBorrowModal(false);
        setSelectedBook(null);
        loadData();
      } else {
        showMessage('借阅失败，库存不足', 'error');
      }
    } catch (error) {
      showMessage('借阅失败，请重试', 'error');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { text: string; class: string }> = {
      available: { text: '可借阅', class: 'bg-green-100 text-green-800' },
      borrowed: { text: '已借出', class: 'bg-yellow-100 text-yellow-800' },
      reserved: { text: '已预约', class: 'bg-blue-100 text-blue-800' },
      damaged: { text: '已损坏', class: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <BookOpen className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-bold text-gray-900">📚 学生端 - 图书管理系统</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setActiveTab('browse')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'browse'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                浏览图书
              </button>
              <button
                onClick={() => setActiveTab('myBorrows')}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === 'myBorrows'
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Clock className="w-4 h-4 mr-2" />
                我的借阅
              </button>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{currentUser.username}</div>
                    <div className="text-gray-500">{currentUser.studentId}</div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 消息提示 */}
      {message && (
        <div className={`fixed top-20 right-6 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
          message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 浏览图书 */}
        {activeTab === 'browse' && (
          <div>
            {/* 搜索栏 */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div className="flex-1 w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="搜索书名、作者、ISBN..."
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  可借阅图书: <span className="font-semibold text-green-600">{filteredBooks.length}</span> 本
                </div>
              </div>
            </div>

            {/* 图书网格 */}
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map((book) => {
                  const status = getStatusBadge(book.status);
                  return (
                    <div key={book.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition overflow-hidden">
                      <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-blue-400" />
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{book.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.class}`}>
                            {status.text}
                          </span>
                        </div>
                        <p className="text-gray-500 text-sm mb-1">作者：{book.author}</p>
                        <p className="text-gray-400 text-xs mb-1">ISBN：{book.isbn}</p>
                        <p className="text-gray-400 text-xs mb-3">分类：{book.category}</p>
                        
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <div className="bg-gray-100 px-2 py-1 rounded">
                              库存: {book.stock}/{book.totalStock}
                            </div>
                          </div>
                          <div className="text-sm text-gray-400">
                            借阅: {book.borrowCount} 次
                          </div>
                        </div>

                        {book.description && (
                          <p className="text-sm text-gray-500 line-clamp-2 mb-4">{book.description}</p>
                        )}

                        <button
                          onClick={() => handleBorrow(book)}
                          disabled={book.stock <= 0}
                          className={`w-full py-2 rounded-lg font-medium transition ${
                            book.stock > 0
                              ? 'bg-blue-600 text-white hover:bg-blue-700'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {book.stock > 0 ? '立即借阅' : '暂时无库存'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">暂无可借阅的图书</h3>
                <p className="text-gray-500">请稍后再来查看</p>
              </div>
            )}
          </div>
        )}

        {/* 我的借阅 */}
        {activeTab === 'myBorrows' && (
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">📖 我的借阅记录</h2>
              <p className="text-gray-500">查看您当前借阅的图书和历史借阅记录</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
              <div className="text-sm text-gray-500">
                共 <span className="font-semibold text-blue-600">{filteredStudentBorrows.length}</span> 条借阅记录
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">图书</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">借阅日期</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">应还日期</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">归还日期</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudentBorrows.length > 0 ? (
                    filteredStudentBorrows.map((record) => {
                      const isOverdue = record.status !== 'returned' && new Date(record.dueDate) < new Date();
                      const statusClass = isOverdue ? 'bg-red-100 text-red-800' : 
                        record.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                      const statusText = isOverdue ? '已逾期' : 
                        record.status === 'returned' ? '已归还' : '借阅中';
                      
                      return (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.bookIsbn}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(record.borrowDate).toLocaleDateString('zh-CN')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                              {new Date(record.dueDate).toLocaleDateString('zh-CN')}
                              {isOverdue && <span className="ml-2 text-xs">(逾期)</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {record.returnDate ? new Date(record.returnDate).toLocaleDateString('zh-CN') : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>暂无借阅记录</p>
                        <p className="text-sm mt-1">去"浏览图书"页面借书吧！</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 借阅确认弹窗 */}
      {showBorrowModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">确认借阅</h3>
              <button
                onClick={() => {
                  setShowBorrowModal(false);
                  setSelectedBook(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{selectedBook.title}</h4>
                <p className="text-sm text-gray-500 mt-1">{selectedBook.author}</p>
                <p className="text-sm text-gray-400 mt-2">{selectedBook.publisher}</p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <GraduationCap className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-gray-900">借阅人：{currentUser?.username}</div>
                    <div className="text-sm text-gray-500">学号：{currentUser?.studentId}</div>
                  </div>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>• 借阅期限：30天</p>
                <p>• 请按时归还图书</p>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowBorrowModal(false);
                  setSelectedBook(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={confirmBorrow}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                确认借阅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
