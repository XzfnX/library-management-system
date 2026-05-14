import React, { useEffect, useState } from 'react';
import { BookOpen, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { adminService } from '../../services/adminService';
import { StatisticsVO } from '../../services/types';
import AdminLayout from '../../layouts/AdminLayout';

const DataDashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<StatisticsVO | null>(null);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const stats = await adminService.getStatistics();
      setStatistics(stats);
      
      const books = await adminService.getAllBooks();
      const borrows = await adminService.getAllBorrows();

      // 图书分类统计
      const categories: Record<string, number> = {};
      books.forEach(book => {
        const category = book.category || '其他';
        categories[category] = (categories[category] || 0) + 1;
      });
      const categoryDataArray = Object.entries(categories).map(([name, value]) => ({ name, value }));
      setCategoryData(categoryDataArray);

      // 月度借阅统计
      const monthly: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getMonth() + 1}月`;
        monthly[key] = 0;
      }
      
      borrows.forEach((record: any) => {
        const date = new Date(record.borrowDate);
        const key = `${date.getMonth() + 1}月`;
        if (monthly[key] !== undefined) {
          monthly[key]++;
        }
      });
      const monthlyDataArray = Object.entries(monthly).map(([month, count]) => ({ month, count }));
      setMonthlyData(monthlyDataArray);

    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#7C3AED', '#EC4899'];

  const stats = {
    totalBooks: statistics?.totalBooks || 0,
    totalBorrows: statistics?.totalBorrows || 0,
    currentBorrows: statistics?.currentBorrows || 0,
    overdueBorrows: statistics?.overdueBorrows || 0,
    totalStock: 0,
    availableStock: 0
  };

  const borrowStatusData = [
    { name: '已归还', value: (statistics?.totalBorrows || 0) - (statistics?.currentBorrows || 0) - (statistics?.overdueBorrows || 0), color: '#10b981' },
    { name: '借出中', value: statistics?.currentBorrows || 0, color: '#f59e0b' },
    { name: '已逾期', value: statistics?.overdueBorrows || 0, color: '#ef4444' }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            {payload[0].name}: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout title="数据统计" showBack={true}>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">图书总数</p>
              <p className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBooks}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">当前借阅</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.currentBorrows}</p>
              <p className="text-xs text-gray-400 mt-1">逾期: {stats.overdueBorrows} 本</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">总借阅次数</p>
              <p className="text-3xl font-bold text-purple-600 mt-2">{stats.totalBorrows}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">已逾期</p>
              <p className="text-3xl font-bold text-red-600 mt-2">{stats.overdueBorrows}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* 图书分类统计 - 优化版扇形图 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📚 图书分类统计</h3>
          {categoryData.length > 0 ? (
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    innerRadius={40}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right"
                    wrapperStyle={{ paddingLeft: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-80 flex items-center justify-center text-gray-400">
              暂无分类数据
            </div>
          )}
        </div>

        {/* 借阅状态分布 - 优化版 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📈 借阅状态分布</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={borrowStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  innerRadius={50}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                  labelLine={true}
                >
                  {borrowStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 月度借阅趋势 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">📅 月度借阅趋势</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 雷达图 - 多维度分析 */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">🎯 运营健康度分析</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart 
                data={[
                  { subject: '图书数量', A: stats.totalBooks / 10, fullMark: 30 },
                  { subject: '借阅频次', A: stats.totalBorrows / 50, fullMark: 20 },
                  { subject: '当前借阅', A: stats.currentBorrows / 10, fullMark: 20 },
                  { subject: '逾期控制', A: Math.max(0, 100 - (stats.overdueBorrows / stats.totalBorrows * 100 || 0)), fullMark: 100 },
                  { subject: '分类丰富度', A: categoryData.length * 10, fullMark: 100 }
                ]}
              >
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" stroke="#6b7280" />
                <PolarRadiusAxis stroke="#6b7280" />
                <Radar name="当前状态" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 数据详情 */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 数据详情</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <p className="text-sm text-gray-500">图书分类数</p>
            <p className="text-xl font-bold text-blue-600">{categoryData.length}</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <p className="text-sm text-gray-500">最高单月借阅</p>
            <p className="text-xl font-bold text-green-600">
              {monthlyData.length > 0 ? Math.max(...monthlyData.map(d => d.count)) : 0}
            </p>
          </div>
          <div className="border-l-4 border-orange-500 pl-4">
            <p className="text-sm text-gray-500">最丰富分类</p>
            <p className="text-xl font-bold text-orange-600">
              {categoryData.length > 0 ? categoryData.reduce((a: any, b: any) => a.value > b.value ? a : b).name : '暂无'}
            </p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <p className="text-sm text-gray-500">平均单本借阅</p>
            <p className="text-xl font-bold text-purple-600">
              {stats.totalBooks > 0 ? (stats.totalBorrows / stats.totalBooks).toFixed(1) : '0'}
            </p>
          </div>
        </div>
      </div>
        </>
      )}
    </AdminLayout>
  );
};

export default DataDashboard;
