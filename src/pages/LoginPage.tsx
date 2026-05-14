import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen, User, GraduationCap, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type LoginType = 'student' | 'admin';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [loginType, setLoginType] = useState<LoginType>('student');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const navigate = useNavigate();
  const { studentLogin, adminLogin } = useAuth();

  useEffect(() => {
    const role = searchParams.get('role');
    if (role === 'admin' || role === 'student') {
      setLoginType(role);
    }
  }, [searchParams]);

  // 学生登录表单
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  // 管理员登录表单
  const [adminAccount, setAdminAccount] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId.trim() || !studentName.trim()) {
      showMessage('请填写学号和姓名！', 'error');
      return;
    }

    setIsLoading(true);
    const result = await studentLogin(studentId.trim(), studentName.trim());
    setIsLoading(false);

    if (result.success) {
      showMessage(result.message, 'success');
      setTimeout(() => navigate('/student'), 1000);
    } else {
      showMessage(result.message, 'error');
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminAccount.trim() || !adminPassword.trim()) {
      showMessage('请填写账号和密码！', 'error');
      return;
    }

    setIsLoading(true);
    const result = await adminLogin(adminAccount.trim(), adminPassword.trim());
    setIsLoading(false);

    if (result.success) {
      showMessage(result.message, 'success');
      setTimeout(() => navigate('/admin'), 1000);
    } else {
      showMessage(result.message, 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">图书管理系统</h1>
          <p className="text-gray-500 mt-2">欢迎回来，请选择登录方式</p>
        </div>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            {message.text}
          </div>
        )}

        {/* 登录卡片 */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 切换标签 */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setLoginType('student')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                loginType === 'student'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <GraduationCap className="w-5 h-5 inline-block mr-2" />
              学生登录
            </button>
            <button
              onClick={() => setLoginType('admin')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                loginType === 'admin'
                  ? 'bg-purple-50 text-purple-600 border-b-2 border-purple-500'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="w-5 h-5 inline-block mr-2" />
              管理员登录
            </button>
          </div>

          {/* 学生登录表单 */}
          {loginType === 'student' && (
            <form onSubmit={handleStudentLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  学号
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="请输入学号"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="请输入姓名"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? '登录中...' : (
                  <>
                    登录
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 pt-4">
                <p>演示账号：学号 2024001，姓名 testuser</p>
              </div>
            </form>
          )}

          {/* 管理员登录表单 */}
          {loginType === 'admin' && (
            <form onSubmit={handleAdminLogin} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  账号
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={adminAccount}
                    onChange={(e) => setAdminAccount(e.target.value)}
                    placeholder="请输入账号/邮箱/手机号"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  密码
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="请输入密码"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? '登录中...' : (
                  <>
                    登录
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 pt-4">
                <p>演示账号：admin，密码：admin123</p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
