import React, { useState, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { Spinner } from '../components/ui/Loader';

const RootLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col relative transition-colors duration-300">
      {/* Decorative Neon Glow Blobs */}
      <div className="glow-blob bg-brand-500 w-[400px] h-[400px] -top-20 -left-20" />
      <div className="glow-blob bg-violet-600 w-[300px] h-[300px] bottom-10 right-10" />

      {/* Navigation Header */}
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {/* Main Body container */}
      <div className="flex flex-1 relative">
        {/* Sidebar Nav */}
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Content Outlet */}
        <main className="flex-1 lg:pl-64 min-h-[calc(100vh-73px)] flex flex-col relative z-10">
          <div className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[50vh]">
                <Spinner size="lg" />
              </div>
            }>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
};

export default RootLayout;
