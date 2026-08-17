import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.username}! 👋
        </h2>
        <p className="text-gray-600 mt-1">
          {isAdmin 
            ? 'You have admin access to all tasks in the system.' 
            : 'Here\'s an overview of your tasks.'}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Role: <span className="font-medium">{user?.role}</span>
        </p>
      </div>

      {/* Stats Cards - Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">0</p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-700 mb-3">Quick Actions</h3>
        <div className="flex gap-3 flex-wrap">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
            + Create New Task
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm">
            View All Tasks
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;  // 🔥 MAKE SURE THIS IS HERE