import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, BookOpen, GraduationCap, Clock, BarChart3, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  backPath?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title = "图书管理系统", 
  showBack = false, 
  backPath = '/admin' 
}) => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/admin', name: '首页', icon: BarChart3 },
    { path: '/books', name: '图书管理', icon: BookOpen },
    { path: '/borrow', name: '借阅管理', icon: Clock },
    { path: '/student-management', name: '学生管理', icon: GraduationCap }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航栏 */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {showBack && (
                <button
                  onClick={() => navigate(backPath)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
                >
                  <ArrowLeft className="w-5 h-5" />
                  返回
                </button>
              )}
              <div className="flex items-center">
                <BookOpen className="w-8 h-8 text-purple-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
              </div>
              {!showBack && (
                <div className="flex gap-2 ml-8">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    return (
                      <button
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className={`px-4 py-2 text-sm font-medium rounded-lg transition flex items-center gap-2 ${
                          isActive
                            ? 'bg-purple-100 text-purple-600'
                            : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{currentUser?.username}</div>
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

      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
