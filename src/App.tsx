import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
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
        {/* 公开路由 */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 需要登录的路由 */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="admin">
              <DataDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/books"
          element={
            <ProtectedRoute>
              <BookManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrow"
          element={
            <ProtectedRoute>
              <BorrowManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-management"
          element={
            <ProtectedRoute requiredRole="admin">
              <StudentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/old"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student"
          element={
            <ProtectedRoute requiredRole="student">
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
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
