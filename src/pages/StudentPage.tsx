import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { StudentStorage } from '../utils/studentStorage';
import { Student, StudentFormData } from '../types/student';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Users, Plus, Edit, Trash2, Search, GraduationCap, Mail, Phone } from 'lucide-react';

export const StudentPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [majorFilter, setMajorFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    studentId: '',
    name: '',
    gender: 'male',
    major: '',
    grade: '',
    class: '',
    phone: '',
    email: '',
    maxBorrowCount: 5
  });
  const [majors, setMajors] = useState<string[]>([]);
  const [grades, setGrades] = useState<string[]>([]);

  useEffect(() => {
    loadStudents();
    loadMajorsAndGrades();
    StudentStorage.initSampleData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchQuery, majorFilter, gradeFilter]);

  const loadStudents = () => {
    const allStudents = StudentStorage.getAll();
    setStudents(allStudents);
  };

  const loadMajorsAndGrades = () => {
    setMajors(['全部', ...StudentStorage.getMajors()]);
    setGrades(['全部', ...StudentStorage.getGrades()]);
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchQuery) {
      const keyword = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(keyword) ||
        s.studentId.toLowerCase().includes(keyword) ||
        s.major.toLowerCase().includes(keyword)
      );
    }

    if (majorFilter && majorFilter !== '全部') {
      filtered = filtered.filter(s => s.major === majorFilter);
    }

    if (gradeFilter && gradeFilter !== '全部') {
      filtered = filtered.filter(s => s.grade === gradeFilter);
    }

    setFilteredStudents(filtered);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.studentId || !formData.name || !formData.major) {
      alert('请填写必填字段');
      return;
    }

    if (StudentStorage.isStudentIdExists(formData.studentId)) {
      alert('学号已存在');
      return;
    }

    StudentStorage.add(formData);
    loadStudents();
    loadMajorsAndGrades();
    setShowAddModal(false);
    resetForm();
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedStudent) return;

    StudentStorage.update(selectedStudent.id, formData);
    loadStudents();
    setShowEditModal(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedStudent) {
      StudentStorage.delete(selectedStudent.id);
      loadStudents();
      loadMajorsAndGrades();
      setShowConfirmDialog(false);
      setSelectedStudent(null);
    }
  };

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      gender: student.gender,
      major: student.major,
      grade: student.grade,
      class: student.class,
      phone: student.phone,
      email: student.email,
      maxBorrowCount: student.maxBorrowCount
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (student: Student) => {
    setSelectedStudent(student);
    setShowConfirmDialog(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: '',
      name: '',
      gender: 'male',
      major: '',
      grade: '',
      class: '',
      phone: '',
      email: '',
      maxBorrowCount: 5
    });
    setSelectedStudent(null);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: { label: '在读', class: 'bg-green-100 text-green-700' },
      graduated: { label: '已毕业', class: 'bg-gray-100 text-gray-700' },
      suspended: { label: '已休学', class: 'bg-red-100 text-red-700' }
    };
    const badge = badges[status as keyof typeof badges] || badges.active;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  if (user?.role !== 'admin') {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <GraduationCap className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-bold text-red-800 mb-2">权限不足</h2>
          <p className="text-red-600">您没有管理员权限，无法访问此页面。</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <Users className="text-[#00693e]" />
            学生管理
          </h1>
          <p className="text-gray-500">管理图书馆读者信息</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00693e] text-white rounded-lg hover:bg-[#004d30] transition shadow-lg"
        >
          <Plus size={20} />
          添加学生
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索学生姓名、学号或专业..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
              />
            </div>
          </div>
          <select
            value={majorFilter}
            onChange={(e) => setMajorFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
          >
            {majors.map(major => (
              <option key={major} value={major}>{major}</option>
            ))}
          </select>
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
          >
            {grades.map(grade => (
              <option key={grade} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f7f4]">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">学号</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">姓名</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">性别</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">专业</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">年级/班级</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">联系方式</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">借阅情况</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">状态</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student) => (
                <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6 font-medium text-[#00693e]">{student.studentId}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00693e] flex items-center justify-center text-white text-sm">
                        {student.name.charAt(0)}
                      </div>
                      {student.name}
                    </div>
                  </td>
                  <td className="py-4 px-6">{student.gender === 'male' ? '男' : '女'}</td>
                  <td className="py-4 px-6">{student.major}</td>
                  <td className="py-4 px-6">{student.grade} / {student.class}</td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone size={14} />
                        {student.phone}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail size={14} />
                        {student.email}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600">{student.currentBorrowCount}</span>
                      <span className="text-sm text-gray-400">/</span>
                      <span className="text-sm text-gray-600">{student.maxBorrowCount}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(student.status)}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(student)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="编辑"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => openDeleteConfirm(student)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="删除"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="py-20 text-center">
              <Users className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">暂无学生数据</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="添加学生"
        >
          <form onSubmit={handleAdd} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">学号 *</label>
                <input
                  type="text"
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入学号"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">姓名 *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">性别</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">最大借阅数</label>
                <input
                  type="number"
                  value={formData.maxBorrowCount}
                  onChange={(e) => setFormData({ ...formData, maxBorrowCount: parseInt(e.target.value) || 5 })}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">专业 *</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入专业"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">年级</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="如：2024级"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">班级</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="如：本科1班"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入手机号"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                  placeholder="请输入邮箱"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowAddModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#00693e] text-white rounded-lg font-semibold hover:bg-[#004d30]"
              >
                添加
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showEditModal && selectedStudent && (
        <Modal
          isOpen={showEditModal}
          onClose={() => { setShowEditModal(false); resetForm(); }}
          title="编辑学生信息"
        >
          <form onSubmit={handleEdit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">学号</label>
                <input
                  type="text"
                  value={formData.studentId}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-100"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">性别</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                >
                  <option value="male">男</option>
                  <option value="female">女</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">最大借阅数</label>
                <input
                  type="number"
                  value={formData.maxBorrowCount}
                  onChange={(e) => setFormData({ ...formData, maxBorrowCount: parseInt(e.target.value) || 5 })}
                  min={1}
                  max={20}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">专业</label>
                <input
                  type="text"
                  value={formData.major}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">年级</label>
                <input
                  type="text"
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">班级</label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-[#00693e] text-white rounded-lg font-semibold hover:bg-[#004d30]"
              >
                保存
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showConfirmDialog && selectedStudent && (
        <ConfirmDialog
          title="确认删除"
          message={`确认删除学生 "${selectedStudent.name}" 吗？此操作不可撤销。`}
          onConfirm={handleDelete}
          onCancel={() => { setShowConfirmDialog(false); setSelectedStudent(null); }}
        />
      )}
    </div>
  );
};
