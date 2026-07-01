import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ListTodo,
  FolderOpen,
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'All Tasks', path: '/tasks', icon: ListTodo },
  ];

  const categories = [
    { name: 'Work', color: 'bg-sky-500' },
    { name: 'Personal', color: 'bg-indigo-500' },
    { name: 'Study', color: 'bg-violet-500' },
    { name: 'Shopping', color: 'bg-pink-500' },
    { name: 'Health', color: 'bg-teal-500' },
  ];

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      isActive
        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40'
    }`;

  const sidebarContent = (
    <nav aria-label="Sidebar navigation" className="flex flex-col h-full py-6 px-4">
      {/* Navigation Menu */}
      <div className="space-y-1.5 flex-1">
        <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          Menu
        </p>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={linkClass}
              onClick={() => {
                if (window.innerWidth < 1024) toggleSidebar();
              }}
            >
              <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-medium text-sm">{item.name}</span>
            </NavLink>
          );
        })}

        {/* Categories Section */}
        <div className="pt-8">
          <p className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">
            Categories
          </p>
          <div className="space-y-1">
            {categories.map((cat) => (
              <NavLink
                key={cat.name}
                to={`/tasks?category=${cat.name}`}
                className="flex items-center justify-between px-4 py-2.5 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors"
                onClick={() => {
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  <span>{cat.name}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
          <FolderOpen className="w-3.5 h-3.5" />
          <span>TaskFlow Pro v1.0.0</span>
        </div>
      </div>
    </nav>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 h-[calc(100vh-73px)] fixed left-0 top-[73px] glass-sidebar z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-slate-950/20 dark:bg-slate-950/40 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      {/* Mobile Drawer Sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-[73px] bottom-0 w-64 glass-sidebar z-45 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
