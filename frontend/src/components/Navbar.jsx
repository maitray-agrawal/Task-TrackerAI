import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Sun, Moon, Menu, X, CheckSquare, Bell } from 'lucide-react';
import Button from './ui/Button';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="sticky top-0 z-50 w-full glass-nav px-6 py-4 flex items-center justify-between">
      {/* Branding */}
      <div className="flex items-center gap-3.5">
        {/* Mobile Menu Trigger */}
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
            <CheckSquare className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-brand-600 to-violet-500 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
            TaskFlow<span className="text-brand-500 font-medium">Pro</span>
          </span>
        </div>
      </div>

      {/* Global Actions */}
      <div className="flex items-center gap-3">
        {/* Notifications Mock */}
        <button className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-500 dark:text-slate-400 transition-all duration-200 relative hidden md:block">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-400 transition-all duration-200 active:scale-95"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-amber-400" />
          ) : (
            <Moon className="w-5 h-5 text-slate-600" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800/80 mx-1 hidden sm:block" />

        {/* Recruiter Avatar Mock */}
        <div className="flex items-center gap-2.5 pl-1.5 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
            JD
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">Jane Doe</p>
            <p className="text-[10px] text-brand-500 dark:text-brand-400 font-semibold uppercase tracking-wider">Recruiter View</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
