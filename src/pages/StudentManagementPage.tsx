import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Search, BookOpen, Clock, CheckCircle, AlertCircle, UserCheck, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../types/user';
import { BorrowRecord } from '../types/borrow';
import { BorrowStorage } from '../utils/borrowStorage';
import { UserStorage } from '../utils/userStorage';
import { useAuth } from '../context/AuthContext';

export default function StudentManagementPage() {
  const navigate = useNavigate();
  const { currentUser, logout, checkAuth } = useAuth();
  const [students, setStudents] = useState<User[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedStudentBorrows, setSelectedStudentBorrows] = useState<BorrowRecord[]>([]);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  useEffect(() => {
    if (!checkAuth('admin')) {
      navigate('/login?role=admin');
      return;
    }
    loadData();
  }, [checkAuth, navigate]);

  const loadData = () => {
    const studentsData = UserStorage.getAll().filter(u => u.role === 'student');
    const borrowsData = BorrowStorage.getAll();
    setStudents(studentsData);
    setBorrowRecords(borrowsData);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredStudents = students.filter(student => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase();
    return (
      student.username.toLowerCase().includes(keyword) ||
      student.studentId?.toLowerCase().includes(keyword)
    );
  });

  const handleSelectStudent = (student: User) => {
    setSelectedStudent(student);
    const studentBorrows = borrowRecords.filter(borrow => borrow.username === student.username);
    setSelectedStudentBorrows(studentBorrows);
    setShowStudentDetail(true);
  };

  const closeStudentDetail = () => {
    setShowStudentDetail(false);
    setSelectedStudent(null);
    setSelectedStudentBorrows([]);
  };

  const getStudentStats = (username: string) => {
    const studentBorrows = borrowRecords.filter(b => b.username === username);
    const activeBorrows = studentBorrows.filter(b => b.status !== 'returned');
    const overdueBorrows = studentBorrows.filter(b => {
      if (b.status === 'returned') return false;
      return new Date(b.dueDate) < new Date();
    });
    return {
      total: studentBorrows.length,
      active: activeBorrows.length,
      returned: studentBorrows.length - activeBorrows.length,
      overdue: overdueBorrows.length
    };
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
                <GraduationCap className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">学生管理</h1>
              </div>
              <div className="flex gap-2 ml-8">
                <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  首页
                </Link>
                <Link to="/books" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  图书管理
                </Link>
                <Link to="/borrow" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  借阅管理
                </Link>
                <Link to="/admin" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                  数据统计
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-blue-600" />
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
        {/* 搜索栏 */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="输入学号或姓名搜索学生..."
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              共找到 <span className="font-semibold text-blue-600">{filteredStudents.length}</span> 名学生
            </div>
          </div>
        </div>

        {/* 学生列表 */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">学号</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">联系方式</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">借阅统计</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">当前借阅</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const stats = getStudentStats(student.username);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{student.studentId}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                            <GraduationCap className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{student.username}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{student.email || '-'}</div>
                        <div className="text-sm text-gray-400">{student.phone || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">总借阅：{stats.total}次</div>
                        <div className="text-sm text-green-600">已还：{stats.returned}次</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${stats.active > 0 ? 'text-yellow-600' : 'text-gray-500'}`}>
                          {stats.active} 本
                        </div>
                        {stats.overdue > 0 && (
                          <div className="text-sm text-red-600">逾期：{stats.overdue} 本</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition"
                        >
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p>未找到学生</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 学生详情弹窗 */}
      {showStudentDetail && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center">
                <GraduationCap className="w-6 h-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {selectedStudent.username} 的借阅记录
                  </h3>
                  <p className="text-sm text-gray-500">学号：{selectedStudent.studentId}</p>
                </div>
              </div>
              <button
                onClick={closeStudentDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* 学生信息卡片 */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center">
                    <UserCheck className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">姓名</div>
                      <div className="font-medium text-gray-900">{selectedStudent.username}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <GraduationCap className="w-5 h-5 text-blue-600 mr-2" />
                    <div>
                      <div className="text-sm text-gray-500">学号</div>
                      <div className="font-medium text-gray-900">{selectedStudent.studentId}</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-5 h-5 flex items-center justify-center text-blue-600 mr-2">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">联系方式</div>
                      <div className="font-medium text-gray-900">{selectedStudent.phone || selectedStudent.email || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 借阅统计 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">总借阅</p>
                      <p className="text-2xl font-bold text-blue-600 mt-1">{selectedStudentBorrows.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-200" />
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">已归还</p>
                      <p className="text-2xl font-bold text-green-600 mt-1">
                        {selectedStudentBorrows.filter(b => b.status === 'returned').length}
                      </p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-green-200" />
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">借阅中</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-1">
                        {selectedStudentBorrows.filter(b => b.status !== 'returned').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-200" />
                  </div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">已逾期</p>
                      <p className="text-2xl font-bold text-red-600 mt-1">
                        {selectedStudentBorrows.filter(b => b.status !== 'returned' && new Date(b.dueDate) < new Date()).length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-200" />
                  </div>
                </div>
              </div>

              {/* 借阅记录列表 */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h4 className="font-medium text-gray-900">借阅历史</h4>
                </div>
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">图书</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">借阅日期</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">应还日期</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedStudentBorrows.length > 0 ? (
                      selectedStudentBorrows.map((record) => {
                        const isOverdue = record.status !== 'returned' && new Date(record.dueDate) < new Date();
                        const statusClass = isOverdue ? 'bg-red-100 text-red-800' : 
                          record.status === 'returned' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
                        const statusText = isOverdue ? '已逾期' : 
                          record.status === 'returned' ? '已归还' : '借阅中';
                        
                        return (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {record.bookIsbn}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {new Date(record.borrowDate).toLocaleDateString('zh-CN')}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {new Date(record.dueDate).toLocaleDateString('zh-CN')}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClass}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p>暂无借阅记录</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeStudentDetail}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
