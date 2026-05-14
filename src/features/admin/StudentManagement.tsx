import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Search, BookOpen, Clock, AlertCircle, User as UserIcon, Eye } from 'lucide-react';
import { adminService } from '../../services/adminService';
import { User } from '../../types/user';
import { BorrowRecord } from '../../types/borrow';
import AdminLayout from '../../layouts/AdminLayout';
import { mockUsers, mockBorrowRecords } from '../../data/mockData';

const StudentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<User[]>([]);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [selectedStudentBorrows, setSelectedStudentBorrows] = useState<BorrowRecord[]>([]);
  const [showStudentDetail, setShowStudentDetail] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [users, borrows] = await Promise.all([
        adminService.getAllUsers(),
        adminService.getAllBorrows()
      ]);
      const studentsData = users.filter(u => u.role === 'student');
      setStudents(studentsData);
      setBorrowRecords(borrows as unknown as BorrowRecord[]);
    } catch (error) {
      console.error('加载数据失败，使用本地数据:', error);
      const studentsData = mockUsers.filter(u => u.role === 'student');
      setStudents(studentsData);
      setBorrowRecords(mockBorrowRecords);
    }
  };

  const filteredStudents = students.filter(student => {
    if (!searchKeyword) return true;
    const keyword = searchKeyword.toLowerCase().trim();
    return (
      student.username.toLowerCase().includes(keyword) ||
      (student.studentId && student.studentId.toLowerCase().includes(keyword))
    );
  });

  const handleSelectStudent = (student: User) => {
    setSelectedStudent(student);
    const studentBorrows = borrowRecords.filter(borrow => 
      borrow.userId === student.id || borrow.username === student.username
    );
    setSelectedStudentBorrows(studentBorrows);
    setShowStudentDetail(true);
  };

  const closeStudentDetail = () => {
    setShowStudentDetail(false);
    setSelectedStudent(null);
    setSelectedStudentBorrows([]);
  };

  const getStudentStats = (studentId: string, username: string) => {
    const studentBorrows = borrowRecords.filter(b => 
      b.userId === studentId || b.username === username
    );
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const isOverdue = (record: BorrowRecord) => {
    if (record.status === 'returned') return false;
    return new Date(record.dueDate) < new Date();
  };

  return (
    <AdminLayout title="学生管理" showBack={true}>
      {/* 搜索栏 */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex-1 w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="请输入学生姓名或学号搜索..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          <div className="text-sm text-gray-500">
            共 <span className="font-semibold text-purple-600">{filteredStudents.length}</span> 名学生
          </div>
        </div>
      </div>

      {/* 学生列表 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">学号</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">姓名</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">总借阅</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">借阅中</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">逾期</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const stats = getStudentStats(student.id, student.username);
                  return (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {student.studentId || '未设置'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <UserIcon className="w-5 h-5 text-purple-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{student.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {student.email || '未设置'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                          {stats.total}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          stats.active > 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {stats.active}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          stats.overdue > 0 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {stats.overdue}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleSelectStudent(student)}
                          className="text-purple-600 hover:text-purple-900 flex items-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          查看详情
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <GraduationCap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>没有找到匹配的学生</p>
                    <p className="text-sm mt-1">请尝试其他搜索条件</p>
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
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                学生详情
              </h3>
              <button
                onClick={closeStudentDetail}
                className="text-gray-400 hover:text-gray-600"
              >
                <AlertCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 学生基本信息 */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-md font-semibold text-gray-900 mb-4">基本信息</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">姓名</p>
                    <p className="text-lg font-medium text-gray-900">{selectedStudent.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">学号</p>
                    <p className="text-lg font-medium text-gray-900">{selectedStudent.studentId || '未设置'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">邮箱</p>
                    <p className="text-lg font-medium text-gray-900">{selectedStudent.email || '未设置'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">电话</p>
                    <p className="text-lg font-medium text-gray-900">{selectedStudent.phone || '未设置'}</p>
                  </div>
                </div>
              </div>

              {/* 借阅统计 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {(() => {
                  const stats = getStudentStats(selectedStudent.id, selectedStudent.username);
                  return (
                    <>
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-blue-600">总借阅</p>
                        <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                      </div>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-sm text-yellow-600">借阅中</p>
                        <p className="text-2xl font-bold text-yellow-700">{stats.active}</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <p className="text-sm text-green-600">已归还</p>
                        <p className="text-2xl font-bold text-green-700">{stats.returned}</p>
                      </div>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p className="text-sm text-red-600">逾期未还</p>
                        <p className="text-2xl font-bold text-red-700">{stats.overdue}</p>
                      </div>
                    </>
                  );
                })()}
              </div>

              {/* 借阅记录 */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  借阅记录
                </h4>
                {selectedStudentBorrows.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">图书</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">借阅日期</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">应还日期</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">归还日期</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">状态</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedStudentBorrows.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-gray-900">{record.bookTitle}</div>
                              <div className="text-sm text-gray-500">{record.bookIsbn}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(record.borrowDate)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className={`text-sm ${isOverdue(record) ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
                                {formatDate(record.dueDate)}
                                {isOverdue(record) && <span className="ml-2 text-xs">(逾期)</span>}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {record.returnDate ? formatDate(record.returnDate) : '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                record.status === 'returned' 
                                  ? 'bg-green-100 text-green-800' 
                                  : isOverdue(record)
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {record.status === 'returned' ? '已归还' : isOverdue(record) ? '已逾期' : '借阅中'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p>该学生暂无借阅记录</p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={closeStudentDetail}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default StudentManagementPage;
