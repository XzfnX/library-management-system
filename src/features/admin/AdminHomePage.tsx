import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, BookOpen, GraduationCap, Clock, BarChart3, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { bookService } from '../../services/bookService';
import AdminLayout from '../../layouts/AdminLayout';
import { mockBooks, mockUsers, mockBorrowRecords, mockStatistics } from '../../data/mockData';

interface Stats {
  totalBooks: number;
  availableBooks: number;
  totalStudents: number;
  totalBorrows: number;
  activeBorrows: number;
  overdueBorrows: number;
}

const AdminHomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({
    totalBooks: 0,
    availableBooks: 0,
    totalStudents: 0,
    totalBorrows: 0,
    activeBorrows: 0,
    overdueBorrows: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [statistics, books] = await Promise.all([
        adminService.getStatistics(),
        bookService.getBooks({ page: 1, size: 100 })
      ]);

      const availableCount = books.records.filter(b => b.stock > 0).length;

      setStats({
        totalBooks: statistics.totalBooks,
        availableBooks: availableCount,
        totalStudents: statistics.totalUsers,
        totalBorrows: statistics.totalBorrows,
        activeBorrows: statistics.currentBorrows,
        overdueBorrows: statistics.overdueBorrows
      });
    } catch (error) {
      console.error('加载统计数据失败，使用本地数据:', error);
      const availableCount = mockBooks.filter(b => b.stock > 0).length;
      const studentCount = mockUsers.filter(u => u.role === 'student').length;
      const activeCount = mockBorrowRecords.filter(r => r.status === 'borrowed').length;
      const overdueCount = mockBorrowRecords.filter(r => r.status === 'overdue').length;
      
      setStats({
        totalBooks: mockStatistics.totalBooks,
        availableBooks: availableCount,
        totalStudents: studentCount,
        totalBorrows: mockStatistics.totalBorrows,
        activeBorrows: activeCount,
        overdueBorrows: overdueCount
      });
    } finally {
      setLoading(false);
    }
  };

  const menuCards = [
    {
      title: '图书管理',
      description: '管理图书信息，添加、编辑、删除图书',
      icon: BookOpen,
      color: 'purple',
      path: '/books'
    },
    {
      title: '学生管理',
      description: '查看学生信息及借阅记录',
      icon: GraduationCap,
      color: 'blue',
      path: '/student-management'
    },
    {
      title: '借阅管理',
      description: '处理图书借阅、归还和续借',
      icon: Clock,
      color: 'green',
      path: '/borrow'
    },
    {
      title: '数据统计',
      description: '查看借阅数据可视化分析',
      icon: BarChart3,
      color: 'orange',
      path: '/admin/dashboard'
    }
  ];

  const colorClasses = {
    blue: { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200', hoverBg: 'hover:bg-blue-100' },
    purple: { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200', hoverBg: 'hover:bg-purple-100' },
    green: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200', hoverBg: 'hover:bg-green-100' },
    orange: { bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200', hoverBg: 'hover:bg-orange-100' }
  };

  const statCards = [
    { label: '图书总数', value: stats.totalBooks, icon: BookOpen, color: 'blue' },
    { label: '可借阅', value: stats.availableBooks, icon: Book, color: 'green' },
    { label: '学生人数', value: stats.totalStudents, icon: Users, color: 'purple' },
    { label: '总借阅', value: stats.totalBorrows, icon: Clock, color: 'orange' },
    { label: '进行中', value: stats.activeBorrows, icon: Clock, color: 'yellow' },
    { label: '逾期未还', value: stats.overdueBorrows, icon: AlertCircle, color: 'red' }
  ];

  return (
    <AdminLayout title="图书管理系统 - 首页">
      {/* 欢迎语 */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">欢迎使用图书管理系统</h2>
        <p className="text-gray-600">请选择您要管理的板块</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-500">加载中...</span>
        </div>
      ) : (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {statCards.map((card, index) => {
              const Icon = card.icon;
              const colorMap: Record<string, string> = {
                blue: 'text-blue-600 bg-blue-100',
                green: 'text-green-600 bg-green-100',
                purple: 'text-purple-600 bg-purple-100',
                orange: 'text-orange-600 bg-orange-100',
                yellow: 'text-yellow-600 bg-yellow-100',
                red: 'text-red-600 bg-red-100'
              };
              
              return (
                <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${colorMap[card.color]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuCards.map((item, index) => {
              const colors = colorClasses[item.color as keyof typeof colorClasses];
              const Icon = item.icon;
              
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`bg-white rounded-xl shadow-sm p-8 border ${colors.border} hover:shadow-lg transition-all transform hover:-translate-y-1 text-left group`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-4 ${colors.bg} rounded-xl group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-10 h-10 ${colors.text}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold ${colors.text}`}>{item.title}</h3>
                      <p className="text-gray-500 mt-2">{item.description}</p>
                    </div>
                    <ArrowRight className="w-6 h-6 text-gray-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminHomePage;
