import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { Link } from 'react-router-dom';
import { BookOpen, User, LogOut, Plus, GraduationCap, Library, Award, BookMarked } from 'lucide-react';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { StudentStorage } from '../utils/studentStorage';
import { CDUTLogo, SchoolMotto } from '../components/common/CDUTLogo';

export const HomePage = () => {
  const { user, logout } = useAuth();
  const { books } = useBooks();
  
  const bookStats = BookStorage.getStats();
  const borrowStats = BorrowStorage.getStats();
  const studentStats = StudentStorage.getStats();

  const recentBooks = books.slice(0, 5);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-[#00693e] to-[#004d30] rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <CDUTLogo size={64} showText={false} />
            <div>
              <h1 className="text-2xl font-bold">成都理工大学图书馆</h1>
              <p className="text-green-200">Chengdu University of Technology Library</p>
            </div>
          </div>
          
          <SchoolMotto />
          
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                ) : (
                  <User size={40} className="text-white" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold">欢迎回来，{user?.username}！</h2>
                <p className="text-green-100">{user?.role === 'admin' ? '管理员' : '读者'} · {user?.email || user?.phone}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition"
            >
              <LogOut size={20} />
              退出登录
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#00693e] rounded-lg">
              <Library className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">馆藏图书</p>
              <p className="text-3xl font-bold text-gray-800">{bookStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500 rounded-lg">
              <BookMarked className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">借阅次数</p>
              <p className="text-3xl font-bold text-gray-800">{borrowStats.totalBorrows}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-lg">
              <GraduationCap className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">注册读者</p>
              <p className="text-3xl font-bold text-gray-800">{studentStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-lg">
              <Award className="text-white" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500">在借图书</p>
              <p className="text-3xl font-bold text-gray-800">{borrowStats.activeBorrows}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">新书上架</h2>
              <Link
                to="/books"
                className="text-[#00693e] hover:text-[#004d30] text-sm font-medium"
              >
                查看全部
              </Link>
            </div>

            {recentBooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentBooks.map((book) => (
                  <div key={book.id} className="flex gap-4 p-4 bg-[#f0f7f4] rounded-lg hover:bg-green-50 transition">
                    <div className="w-16 h-20 bg-gradient-to-br from-[#00693e] to-[#004d30] rounded-lg flex items-center justify-center flex-shrink-0">
                      {book.cover ? (
                        <img src={book.cover} alt={book.title} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <span className="text-white text-2xl font-bold">{book.title.charAt(0)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 truncate">{book.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{book.author}</p>
                      <div className="flex items-center gap-2">
                        {book.category && (
                          <span className="px-2 py-1 bg-[#00693e]/10 text-[#00693e] text-xs rounded-full">
                            {book.category}
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          book.status === 'available' ? 'bg-green-100 text-green-700' :
                          book.status === 'borrowed' ? 'bg-blue-100 text-blue-700' :
                          book.status === 'damaged' ? 'bg-orange-100 text-orange-700' :
                          book.status === 'lost' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {book.status === 'available' ? '可借阅' :
                           book.status === 'borrowed' ? '已借出' :
                           book.status === 'damaged' ? '已损坏' :
                           book.status === 'lost' ? '已丢失' : '已预约'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="mx-auto text-gray-300 mb-4" size={48} />
                <p className="text-gray-500 mb-4">暂无图书数据</p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#00693e] text-white rounded-lg hover:bg-[#004d30] transition"
                >
                  <Plus size={20} />
                  录入图书
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">快捷操作</h2>
            <div className="space-y-3">
              <Link
                to="/books"
                className="flex items-center gap-3 p-3 bg-[#f0f7f4] hover:bg-green-100 rounded-lg transition"
              >
                <Plus className="text-[#00693e]" size={20} />
                <span className="text-gray-700">录入图书</span>
              </Link>
              <Link
                to="/students"
                className="flex items-center gap-3 p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
              >
                <GraduationCap className="text-blue-600" size={20} />
                <span className="text-gray-700">学生管理</span>
              </Link>
              <Link
                to="/borrow"
                className="flex items-center gap-3 p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition"
              >
                <BookMarked className="text-purple-600" size={20} />
                <span className="text-gray-700">借阅管理</span>
              </Link>
            </div>
          </div>

          {user?.role === 'admin' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">管理员专区</h2>
              <div className="space-y-3">
                <Link
                  to="/admin"
                  className="flex items-center gap-3 p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition"
                >
                  <BookOpen className="text-orange-600" size={20} />
                  <span className="text-gray-700">管理后台</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
