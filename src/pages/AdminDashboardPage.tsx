import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Book } from '../types/book';
import { BorrowRecord } from '../types/borrow';
import { BookService } from '../services/bookService';
import { BorrowService } from '../services/borrowService';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BookOpen, Users, ShoppingCart, AlertCircle, TrendingUp, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, checkAuth } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    returnedBorrows: 0,
    overdueBorrows: 0,
    totalStock: 0,
    availableStock: 0,
    borrowedStock: 0
  });

  useEffect(() => {
    if (!checkAuth('admin')) {
      navigate('/login');
      return;
    }
    loadData();
  }, [checkAuth, navigate]);

  const loadData = () => {
    const booksData = BookService.getAll();
    const borrowsData = BorrowService.getAll();
    
    setBooks(booksData);
    setBorrowRecords(borrowsData);
    
    // 计算统计数据
    const now = new Date();
    let activeBorrows = 0;
    let overdueBorrows = 0;
    
    borrowsData.forEach(borrow => {
      if (borrow.status !== 'returned') {
        activeBorrows++;
        if (new Date(borrow.dueDate) < now) {
          overdueBorrows++;
        }
      }
    });
    
    const totalStock = booksData.reduce((sum, b) => sum + b.totalStock, 0);
    const availableStock = booksData.reduce((sum, b) => sum + b.stock, 0);
    const borrowedStock = totalStock - availableStock;
    
    setStats({
      totalBooks: booksData.length,
      totalBorrows: borrowsData.length,
      activeBorrows,
      returnedBorrows: borrowsData.length - activeBorrows,
      overdueBorrows,
      totalStock,
      availableStock,
      borrowedStock
    });
  };

  // 借阅状态分布数据
  const borrowStatusData = [
    { name: '已归还', value: stats.returnedBorrows, color: '#10b981' },
    { name: '借出中', value: stats.activeBorrows - stats.overdueBorrows, color: '#f59e0b' },
    { name: '已逾期', value: stats.overdueBorrows, color: '#ef4444' }
  ].filter(item => item.value > 0);

  // 图书分类统计
  const categoryData = books.reduce((acc, book) => {
    const existing = acc.find(item => item.name === book.category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: book.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // 图书库存状态
  const stockStatusData = [
    { name: '可借', value: stats.availableStock, color: '#10b981' },
    { name: '已借出', value: stats.borrowedStock, color: '#f59e0b' }
  ];

  // 每月借阅趋势（最近6个月）
  const getMonthlyTrend = () => {
    const monthlyData: { [key: string]: number } = {};
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = 0;
    }
    
    borrowRecords.forEach(record => {
      const date = new Date(record.borrowDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyData.hasOwnProperty(key)) {
        monthlyData[key]++;
      }
    });
    
    return Object.entries(monthlyData).map(([month, count]) => ({
      month: month.substring(5),
      借阅次数: count
    }));
  };

  const monthlyTrendData = getMonthlyTrend();

  // 借阅次数最多的图书
  const topBorrowedBooks = [...books]
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">📊 管理员后台</h1>
              </div>
              <div className="flex gap-2 ml-8">
                <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  首页
                </Link>
                <Link to="/books" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  图书管理
                </Link>
                <Link to="/borrow" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition">
                  借阅管理
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{currentUser.username}</div>
                  <div className="text-gray-500">管理员</div>
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
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        {/* 头部 */}
        <div className="mb-8">
          <p className="text-gray-500">数据统计与可视化分析</p>
        </div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">图书总数</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBooks}</p>
                <p className="text-xs text-gray-400 mt-1">总库存: {stats.totalStock}册</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总借阅次数</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalBorrows}</p>
                <p className="text-xs text-gray-400 mt-1">当前进行中: {stats.activeBorrows}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">已归还</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.returnedBorrows}</p>
                <p className="text-xs text-gray-400 mt-1">归还率: {stats.totalBorrows > 0 ? ((stats.returnedBorrows / stats.totalBorrows) * 100).toFixed(1) : 0}%</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">逾期未还</p>
                <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueBorrows}</p>
                <p className="text-xs text-gray-400 mt-1">需要催还</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 借阅状态分布饼图 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 借阅状态分布</h3>
            {borrowStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={borrowStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {borrowStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                暂无借阅数据
              </div>
            )}
          </div>

          {/* 图书库存状态 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📚 图书库存状态</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stockStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value}册 (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stockStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value} 册`, '库存']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* 图书分类统计 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📖 图书分类统计</h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${value}本`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-400">
                暂无分类数据
              </div>
            )}
          </div>

          {/* 每月借阅趋势 */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📅 月度借阅趋势</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="借阅次数" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 借阅次数排行榜 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">🏆 图书借阅排行榜</h3>
          <div className="space-y-3">
            {topBorrowedBooks.length > 0 ? (
              topBorrowedBooks.map((book, index) => (
                <div key={book.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-600' :
                      index === 1 ? 'bg-gray-200 text-gray-600' :
                      index === 2 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-500">{book.author} · {book.category}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{book.borrowCount}</p>
                    <p className="text-xs text-gray-400">借阅次数</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-400">
                暂无借阅记录
              </div>
            )}
          </div>
        </div>

        {/* 逾期提醒列表 */}
        {stats.overdueBorrows > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-red-200 mt-6">
            <h3 className="text-lg font-semibold text-red-600 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              逾期提醒 ({stats.overdueBorrows} 条)
            </h3>
            <div className="space-y-2">
              {borrowRecords
                .filter(record => {
                  if (record.status === 'returned') return false;
                  return new Date(record.dueDate) < new Date();
                })
                .slice(0, 5)
                .map(record => (
                  <div key={record.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div>
                      <p className="font-medium text-gray-900">{record.bookTitle}</p>
                      <p className="text-sm text-gray-500">{record.username || '未知用户'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-600 font-medium">
                        逾期 {Math.ceil((new Date().getTime() - new Date(record.dueDate).getTime()) / (1000 * 60 * 60 * 24))} 天
                      </p>
                      <p className="text-xs text-gray-400">
                        应还日期: {new Date(record.dueDate).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
