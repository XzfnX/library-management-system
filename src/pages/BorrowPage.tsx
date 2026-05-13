import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useBooks } from '../context/BookContext';
import { BookStorage } from '../utils/bookStorage';
import { BorrowStorage } from '../utils/borrowStorage';
import { StudentStorage } from '../utils/studentStorage';
import { BorrowRecord, BorrowStatus } from '../types/borrow';
import { Student } from '../types/student';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { BookMarked, Plus, RotateCcw, Search, Calendar, BookOpen, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export const BorrowPage = () => {
  const { user } = useAuth();
  const { books, refreshBooks } = useBooks();
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<BorrowRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BorrowStatus | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'return' | 'renew' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<BorrowRecord | null>(null);
  const [borrowForm, setBorrowForm] = useState({
    bookId: '',
    studentId: '',
    borrowDays: 30,
    remark: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [borrowRecords, searchQuery, statusFilter]);

  const loadData = () => {
    const records = BorrowStorage.getAll();
    setBorrowRecords(records);
    const studentData = StudentStorage.getAll();
    setStudents(studentData);
  };

  const filterRecords = () => {
    let filtered = [...borrowRecords];

    if (searchQuery) {
      const keyword = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.bookTitle.toLowerCase().includes(keyword) ||
        r.username.toLowerCase().includes(keyword) ||
        r.bookIsbn?.toLowerCase().includes(keyword)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(r => r.status === statusFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!borrowForm.bookId || !borrowForm.studentId) {
      alert('请选择图书和学生');
      return;
    }

    const book = books.find(b => b.id === borrowForm.bookId);
    const student = students.find(s => s.id === borrowForm.studentId);

    if (!book || !student) {
      alert('图书或学生不存在');
      return;
    }

    if (book.stock <= 0) {
      alert('该图书库存不足');
      return;
    }

    if (student.currentBorrowCount >= student.maxBorrowCount) {
      alert('该学生已达到最大借阅数量');
      return;
    }

    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + borrowForm.borrowDays);

    // 添加借阅记录
    BorrowStorage.add({
      bookId: book.id,
      bookTitle: book.title,
      bookIsbn: book.isbn,
      userId: student.id,
      username: student.name,
      borrowDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'borrowed',
      renewCount: 0,
      maxRenewCount: 2,
      remark: borrowForm.remark
    });

    // 更新图书库存
    BookStorage.borrowBook(book.id);
    // 刷新Context中的图书数据
    refreshBooks();
    
    // 更新学生借阅数量
    StudentStorage.updateBorrowCount(student.id, 1);

    // 刷新借阅记录
    loadData();
    setShowAddModal(false);
    resetForm();
    
    // 显示成功提示
    alert(`图书 "${book.title}" 借出成功！\n借阅人：${student.name}\n应还日期：${dueDate.toISOString().split('T')[0]}`);
  };

  const handleReturn = () => {
    if (!selectedRecord) return;

    console.log('=== 开始归还流程 ===');
    console.log('1. 选中的记录:', selectedRecord);
    console.log('2. 当前借阅记录状态:', selectedRecord.status);

    // 更新借阅记录状态
    const result = BorrowStorage.returnBook(selectedRecord.id, user?.id, user?.username);
    console.log('3. 归还记录更新结果:', result);
    
    // 验证localStorage中的数据
    const updatedRecord = BorrowStorage.getById(selectedRecord.id);
    console.log('4. localStorage中的更新后记录:', updatedRecord);
    console.log('5. 记录状态是否变为returned:', updatedRecord?.status === 'returned');
    
    if (!result) {
      alert('归还失败，请重试');
      return;
    }
    
    // 更新图书库存
    const book = books.find(b => b.id === selectedRecord.bookId);
    console.log('6. 当前books中的图书:', book);
    
    if (book) {
      const bookResult = BookStorage.returnBook(book.id);
      console.log('7. 图书库存更新结果:', bookResult);
      
      // 验证图书数据
      const updatedBook = BookStorage.getById(book.id);
      console.log('8. 更新后的图书状态:', updatedBook?.status);
      
      // 刷新Context中的图书数据
      refreshBooks();
      console.log('9. 图书数据已刷新');
    }
    
    // 刷新借阅记录
    console.log('10. 调用loadData()前，borrowRecords:', borrowRecords.length);
    loadData();
    console.log('11. 调用loadData()后，borrowRecords:', borrowRecords.length);
    
    // 手动触发filterRecords确保filteredRecords更新
    setTimeout(() => {
      filterRecords();
      console.log('12. 手动调用filterRecords()后');
    }, 50);
    
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setSelectedRecord(null);
  };

  const handleRenew = () => {
    if (!selectedRecord) return;

    const result = BorrowStorage.renewBook(selectedRecord.id, 30);
    if (!result) {
      alert('已达到最大续借次数');
      return;
    }

    loadData();
    setShowConfirmDialog(false);
    setConfirmAction(null);
    setSelectedRecord(null);
  };

  const resetForm = () => {
    setBorrowForm({
      bookId: '',
      studentId: '',
      borrowDays: 30,
      remark: ''
    });
    setSelectedRecord(null);
  };

  const getStatusBadge = (status: BorrowStatus) => {
    const badges = {
      borrowed: { label: '借出中', class: 'bg-blue-100 text-blue-700' },
      returned: { label: '已归还', class: 'bg-green-100 text-green-700' },
      overdue: { label: '已逾期', class: 'bg-red-100 text-red-700' },
      renewed: { label: '已续借', class: 'bg-yellow-100 text-yellow-700' }
    };
    const badge = badges[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.class}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
            <BookMarked className="text-[#00693e]" />
            借阅管理
          </h1>
          <p className="text-gray-500">管理图书借阅和归还</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00693e] text-white rounded-lg hover:bg-[#004d30] transition shadow-lg"
        >
          <Plus size={20} />
          借出图书
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
                placeholder="搜索书名或借阅人..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as BorrowStatus | 'all')}
            className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#00693e]"
          >
            <option value="all">全部状态</option>
            <option value="borrowed">借出中</option>
            <option value="returned">已归还</option>
            <option value="overdue">已逾期</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f0f7f4]">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">图书信息</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">借阅人</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">借阅日期</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">应还日期</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">归还日期</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">状态</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">续借次数</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-12 bg-[#00693e] rounded flex items-center justify-center">
                        <BookOpen className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{record.bookTitle}</p>
                        <p className="text-sm text-gray-500">{record.bookIsbn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#00693e] flex items-center justify-center text-white text-sm">
                        {record.username.charAt(0)}
                      </div>
                      <span>{record.username}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="flex items-center gap-1 text-gray-600">
                      <Calendar size={16} />
                      {formatDate(record.borrowDate)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`flex items-center gap-1 ${isOverdue(record.dueDate) && record.status !== 'returned' ? 'text-red-600' : 'text-gray-600'}`}>
                      <Clock size={16} />
                      {formatDate(record.dueDate)}
                      {isOverdue(record.dueDate) && record.status !== 'returned' && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    {record.returnDate ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircle size={16} />
                        {formatDate(record.returnDate)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6">{getStatusBadge(record.status)}</td>
                  <td className="py-4 px-6">
                    <span className="text-gray-600">{record.renewCount}/{record.maxRenewCount}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2">
                      {record.status === 'borrowed' && (
                        <>
                          <button
                            onClick={() => { setSelectedRecord(record); setConfirmAction('return'); setShowConfirmDialog(true); }}
                            className="px-3 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition text-sm"
                          >
                            归还
                          </button>
                          {record.renewCount < record.maxRenewCount && (
                            <button
                              onClick={() => { setSelectedRecord(record); setConfirmAction('renew'); setShowConfirmDialog(true); }}
                              className="px-3 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition text-sm flex items-center gap-1"
                            >
                              <RotateCcw size={14} />
                              续借
                            </button>
                          )}
                        </>
                      )}
                      {record.status === 'overdue' && (
                        <button
                          onClick={() => { setSelectedRecord(record); setConfirmAction('return'); setShowConfirmDialog(true); }}
                          className="px-3 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition text-sm"
                        >
                          归还
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredRecords.length === 0 && (
            <div className="py-20 text-center">
              <BookMarked className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-500">暂无借阅记录</p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => { setShowAddModal(false); resetForm(); }}
          title="借出图书"
        >
          <form onSubmit={handleBorrow} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">选择图书 *</label>
              <select
                value={borrowForm.bookId}
                onChange={(e) => setBorrowForm({ ...borrowForm, bookId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="">请选择图书</option>
                {books.filter(b => b.stock > 0).map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} - {book.author} (库存: {book.stock})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">选择学生 *</label>
              <select
                value={borrowForm.studentId}
                onChange={(e) => setBorrowForm({ ...borrowForm, studentId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              >
                <option value="">请选择学生</option>
                {students.filter(s => s.status === 'active' && s.currentBorrowCount < s.maxBorrowCount).map(student => (
                  <option key={student.id} value={student.id}>
                    {student.name} - {student.studentId} ({student.major})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">借阅天数</label>
              <input
                type="number"
                value={borrowForm.borrowDays}
                onChange={(e) => setBorrowForm({ ...borrowForm, borrowDays: parseInt(e.target.value) || 30 })}
                min={1}
                max={90}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">备注</label>
              <textarea
                value={borrowForm.remark}
                onChange={(e) => setBorrowForm({ ...borrowForm, remark: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg resize-none"
                placeholder="请输入备注信息（可选）"
              />
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
                确认借出
              </button>
            </div>
          </form>
        </Modal>
      )}

      {showConfirmDialog && selectedRecord && confirmAction && (
        <ConfirmDialog
          title={confirmAction === 'return' ? '确认归还' : '确认续借'}
          message={confirmAction === 'return'
            ? `确认归还图书 "${selectedRecord.bookTitle}" 吗？`
            : `确认续借图书 "${selectedRecord.bookTitle}" 吗？续借后借阅期限将延长30天。`
          }
          onConfirm={confirmAction === 'return' ? handleReturn : handleRenew}
          onCancel={() => { setShowConfirmDialog(false); setConfirmAction(null); setSelectedRecord(null); }}
          confirmText={confirmAction === 'return' ? '确认归还' : '确认续借'}
          type={confirmAction === 'return' ? 'success' : 'info'}
        />
      )}
    </div>
  );
};
