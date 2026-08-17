import React from 'react';
import Sidebar from '../common/Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-[#F5F6FA]">
      <Sidebar />
      <main className="flex-1 min-w-0">
        <div className="p-8 max-w-[1240px]">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;