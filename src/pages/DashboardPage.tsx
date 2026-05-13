import React, { useEffect, useState } from 'react';
import { Book } from '../types/book';
import { BorrowRecord } from '../types/borrow';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { BookOpen, Users, ArrowRight, Clock, CheckCircle, BarChart3, GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    totalBorrows: 0,
    activeBorrows: 0
  });
  const [recentBooks, setRecentBooks] = useState<Book[]>([]);
  const [recentBorrows, setRecentBorrows] = useState<BorrowRecord[]>([]);

  useEffect(() => {
    const books = BookStorage.getAll();
    const borrows = BorrowStorage.getAll();
    
    setStats({
      totalBooks: books.length,
      availableBooks: books.filter(b => b.status === 'available').length,
      totalBorrows: borrows.length,
      activeBorrows: borrows.filter(b => b.status !== 'returned').length
    });

    setRecentBooks(books.slice(0, 5));
    setRecentBorrows(borrows.slice(0, 5));
  }, []);

  const menuItems = [
    {
      title: '图书管理',
      description: '管理图书信息，添加、编辑、删除图书',
      icon: BookOpen,
      color: 'purple',
      path: '/books'
    },
    {
      title: '借阅管理',
      description: '处理图书借阅、归还和续借',
      icon: Clock,
      color: 'green',
      path: '/borrow'
    },
    {
      title: '学生管理',
      description: '查看学生信息及借阅记录',
      icon: GraduationCap,
      color: 'blue',
      path: '/student-management'
    },
    {
      title: '数据统计',
      description: '查看借阅数据可视化分析',
      icon: BarChart3,
      color: 'orange',
      path: '/login',
      role: 'admin'
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">📚 图书管理系统</h1>
          <p className="text-xl text-gray-600">欢迎使用，选择您的角色</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">图书总数</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">可借阅</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{stats.availableBooks}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">总借阅</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalBorrows}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">进行中</p>
                <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.activeBorrows}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menuItems.map((item, index) => {
            const colors = colorClasses[item.color as keyof typeof colorClasses];
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  if (item.role) {
                    navigate(`${item.path}?role=${item.role}`);
                  } else {
                    navigate(item.path);
                  }
                }}
                className={`bg-white rounded-xl shadow-sm p-8 border ${colors.border} hover:shadow-lg transition-all transform hover:-translate-y-1 text-left`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-4 ${colors.bg} rounded-xl`}>
                    <Icon className={`w-8 h-8 ${colors.text}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold ${colors.text}`}>{item.title}</h3>
                    <p className="text-gray-500 mt-2">{item.description}</p>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400" />
                </div>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近添加的图书</h3>
            <div className="space-y-3">
              {recentBooks.length > 0 ? recentBooks.map((book) => (
                <div key={book.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-sm text-gray-500">{book.author}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    book.status === 'available' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {book.status === 'available' ? '可借阅' : '已借出'}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">暂无图书</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">最近借阅记录</h3>
            <div className="space-y-3">
              {recentBorrows.length > 0 ? recentBorrows.map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{record.bookTitle}</p>
                    <p className="text-sm text-gray-500">
                      {record.username || '未知用户'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    record.status === 'returned' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {record.status === 'returned' ? '已归还' : '借出中'}
                  </span>
                </div>
              )) : (
                <p className="text-gray-500 text-center py-8">暂无借阅记录</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
