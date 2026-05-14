import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import DashboardPage from './pages/DashboardPage';
import BookManagementPage from './pages/BookManagementPage';
import BorrowManagementPage from './pages/BorrowManagementPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import LoginPage from './pages/LoginPage';
import AdminHomePage from './features/admin/AdminHomePage';
import DataDashboard from './features/admin/DataDashboard';
import StudentManagement from './features/admin/StudentManagement';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 路由 */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminHomePage />} />
        <Route path="/admin/dashboard" element={<DataDashboard />} />
        <Route path="/books" element={<BookManagementPage />} />
        <Route path="/borrow" element={<BorrowManagementPage />} />
        <Route path="/student-management" element={<StudentManagement />} />
        <Route path="/admin/old" element={<AdminDashboardPage />} />
        <Route path="/student" element={<StudentDashboardPage />} />
      </Routes>
    </div>
  );
}

export default function RootApp() {
  return (
    <HashRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  );
}
