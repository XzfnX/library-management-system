import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { StudentStorage } from '../utils/studentStorage';
import { generateBooks } from '../utils/sampleBooks';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BookOpen, Users, ShoppingCart, TrendingUp, Calendar, Clock, AlertTriangle, GraduationCap, Users2 } from 'lucide-react';

export const AdminPage = () => {
  const { user } = useAuth();
  const { books } = useBooks();
  const initializedRef = useRef(false);

  const [borrowStats, setBorrowStats] = useState({
    totalBorrows: 0,
    activeBorrows: 0,
    returnedBorrows: 0,
    overdueBorrows: 0
  });

  const [studentStats, setStudentStats] = useState({
    total: 0,
    active: 0,
    graduated: 0,
    suspended: 0
  });

  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentBorrows, setRecentBorrows] = useState<any[]>([]);
  const [bookStats, setBookStats] = useState({
    total: 0,
    available: 0,
    borrowed: 0,
    totalStock: 0,
    currentStock: 0
  });

  const COLORS = ['#00693e', '#004d30', '#ff6b35', '#d4af37', '#14b8a6', '#8b5cf6', '#ec4899', '#f97316'];

  useEffect(() => {
    if (user?.role === 'admin' && !initializedRef.current) {
      initializedRef.current = true;
      initSampleDataIfNeeded();
    }
  }, [user]);

  useEffect(() => {
    if (user?.role === 'admin') {
      loadStats();
    }
  }, [user, books]);

  const initSampleDataIfNeeded = () => {
    if (books.length === 0 && user) {
      const generatedBooks = generateBooks(user.id, 50);
      generatedBooks.forEach(book => {
        BookStorage.add(user.id, book);
      });
    }
    
    StudentStorage.initSampleData();
    BorrowStorage.initSampleData();
  };

  const loadStats = () => {
    const stats = BorrowStorage.getStats();
    setBorrowStats(stats);

    const bookStatsData = BookStorage.getStats();
    setBookStats(bookStatsData);

    const studentStatsData = StudentStorage.getStats();
    setStudentStats(studentStatsData);

    const categoryStats = BorrowStorage.getCategoryStats(books);
    setCategoryData(categoryStats);

    const statusStats = [
      { name: '可借阅', value: bookStatsData.available },
      { name: '已借出', value: bookStatsData.borrowed },
      { name: '已预约', value: bookStatsData.reserved },
      { name: '已损坏', value: bookStatsData.damaged },
      { name: '已丢失', value: bookStatsData.lost }
    ].filter(item => item.value > 0);
    setStatusData(statusStats);

    const allBorrows = BorrowStorage.getAll();
    setRecentBorrows(allBorrows.slice(-5).reverse());
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertTriangle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-red-800 mb-2">权限不足</h2>
          <p className="text-red-600">您没有管理员权限，无法访问此页面。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-12 bg-[#00693e] rounded-xl flex items-center justify-center">
            <GraduationCap className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">成都理工大学图书馆</h1>
            <p className="text-gray-500">Chengdu University of Technology Library</p>
          </div>
        </div>
        <p className="text-gray-600">管理后台 - 数据统计与可视化分析</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
        <div className="bg-gradient-to-br from-[#00693e] to-[#004d30] rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 mb-1">图书总数</p>
              <p className="text-4xl font-bold">{bookStats.total}</p>
            </div>
            <BookOpen size={48} className="text-green-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 mb-1">借阅总数</p>
              <p className="text-4xl font-bold">{borrowStats.totalBorrows}</p>
            </div>
            <TrendingUp size={48} className="text-green-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 mb-1">当前借出</p>
              <p className="text-4xl font-bold">{borrowStats.activeBorrows}</p>
            </div>
            <Clock size={48} className="text-orange-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 mb-1">注册学生</p>
              <p className="text-4xl font-bold">{studentStats.total}</p>
            </div>
            <Users2 size={48} className="text-purple-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">在读学生</p>
              <p className="text-4xl font-bold">{studentStats.active}</p>
            </div>
            <Users size={48} className="text-blue-200 opacity-50" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 mb-1">逾期图书</p>
              <p className="text-4xl font-bold">{borrowStats.overdueBorrows}</p>
            </div>
            <AlertTriangle size={48} className="text-red-200 opacity-50" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-[#00693e]" />
            各类别图书借阅统计
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              暂无借阅数据
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <TrendingUp className="text-green-600" />
            图书状态分布
          </h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#00693e" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              暂无数据
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Users className="text-purple-600" />
            学生统计
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">在读学生</span>
              <span className="font-semibold text-green-600">{studentStats.active}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已毕业</span>
              <span className="font-semibold text-gray-600">{studentStats.graduated}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已休学</span>
              <span className="font-semibold text-red-600">{studentStats.suspended}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <ShoppingCart className="text-orange-600" />
            库存统计
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总库存</span>
              <span className="font-semibold text-blue-600">{bookStats.totalStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">当前库存</span>
              <span className="font-semibold text-green-600">{bookStats.currentStock}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">借出率</span>
              <span className="font-semibold text-orange-600">
                {bookStats.totalStock > 0 
                  ? ((bookStats.totalStock - bookStats.currentStock) / bookStats.totalStock * 100).toFixed(1) 
                  : '0'
                }%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calendar className="text-purple-600" />
          近期借阅记录
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">图书名称</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">借阅人</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">借阅日期</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">应还日期</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
              </tr>
            </thead>
            <tbody>
              {recentBorrows.map(record => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-800">{record.bookTitle}</td>
                  <td className="py-3 px-4">{record.username}</td>
                  <td className="py-3 px-4">{new Date(record.borrowDate).toLocaleDateString('zh-CN')}</td>
                  <td className="py-3 px-4">{new Date(record.dueDate).toLocaleDateString('zh-CN')}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      record.status === 'returned' ? 'bg-green-100 text-green-700' :
                      record.status === 'borrowed' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status === 'returned' ? '已归还' :
                       record.status === 'borrowed' ? '借出中' : '已逾期'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentBorrows.length === 0 && (
            <div className="py-12 text-center">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">暂无借阅记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
