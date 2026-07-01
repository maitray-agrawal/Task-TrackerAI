import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Home } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
      {/* 404 Code Banner */}
      <div className="relative">
        <h1 className="text-9xl font-black text-slate-200 dark:text-slate-900 tracking-widest select-none">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold bg-brand-500 text-white px-4 py-1.5 rounded-2xl shadow-lg rotate-12">
            Page Not Found
          </span>
        </div>
      </div>

      <div className="max-w-md space-y-2 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Lost in Space?
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      <Link to="/" className="pt-2">
        <Button icon={Home} className="shadow-lg shadow-brand-500/20">
          Go back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
