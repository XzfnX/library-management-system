import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Home, Book, User, LogOut, BarChart3, BookMarked, Users, Settings } from 'lucide-react';
import { CDUTLogo } from '../common/CDUTLogo';

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/books', label: '图书管理', icon: Book },
    { path: '/students', label: '学生管理', icon: Users },
    { path: '/borrow', label: '借阅管理', icon: BookMarked },
  ];

  const adminItems = user?.role === 'admin' ? [
    { path: '/admin', label: '管理后台', icon: BarChart3 },
    { path: '/settings', label: '系统设置', icon: Settings },
  ] : [];

  return (
    <header className="bg-white shadow-md border-b-4 border-[#00693e] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3">
              <CDUTLogo size={50} showText={true} />
            </Link>

            <nav className="hidden lg:flex gap-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-[#00693e] text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
              
              {adminItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                      isActive
                        ? 'bg-[#ff6b35] text-white shadow-md'
                        : 'text-[#ff6b35] hover:bg-orange-50'
                    }`}
                  >
                    <Icon size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-[#f0f7f4] px-4 py-2 rounded-lg">
              <BookOpen className="text-[#00693e]" size={18} />
              <span className="text-sm text-gray-600">图书馆管理系统</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#00693e] flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-white" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role === 'admin' ? '管理员' : '读者'}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut size={18} />
                <span className="hidden md:inline">退出</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
