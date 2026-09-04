import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/common/LoadingSpinner';
import MainLayout from './components/layout/MainLayout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import TaskDetail from './components/tasks/TaskDetail';
import TaskForm from './components/tasks/TaskForm';
import UserProfile from './components/profile/UserProfile';
import Team from './components/team/Team';
import './index.css';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen message="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes - No Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - With MainLayout */}
        <Route path="/" element={
          <ProtectedRoute>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks" element={
          <ProtectedRoute>
            <MainLayout>
              <TaskList />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks/new" element={
          <ProtectedRoute>
            <MainLayout>
              <TaskForm />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks/:id" element={
          <ProtectedRoute>
            <MainLayout>
              <TaskDetail />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/tasks/:id/edit" element={
          <ProtectedRoute>
            <MainLayout>
              <TaskForm />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <MainLayout>
              <UserProfile />
            </MainLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/team" element={
          <ProtectedRoute>
            <MainLayout>
              <Team />
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;