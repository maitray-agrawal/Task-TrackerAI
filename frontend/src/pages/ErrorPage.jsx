import React from 'react';
import { AlertOctagon, RotateCw } from 'lucide-react';
import Button from '../components/ui/Button';

const ErrorPage = ({ error, resetErrorBoundary }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4 space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-red-500/10 text-red-500 flex items-center justify-center shadow-lg shadow-red-500/5">
        <AlertOctagon className="w-8 h-8" />
      </div>

      <div className="max-w-md space-y-2 text-center">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Something went wrong
        </h2>
        <p className="text-slate-500 dark:text-slate-400">
          An unexpected error has occurred. Please try reloading the page or contact support if the issue persists.
        </p>
        {error && (
          <pre className="mt-4 p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-mono text-red-500 border border-slate-200 dark:border-slate-800 text-left overflow-x-auto max-w-full">
            {error.message || JSON.stringify(error)}
          </pre>
        )}
      </div>

      <div className="pt-2 flex gap-3">
        <Button
          variant="secondary"
          onClick={() => window.location.href = '/'}
        >
          Go to Dashboard
        </Button>
        <Button
          icon={RotateCw}
          onClick={resetErrorBoundary || (() => window.location.reload())}
          className="shadow-lg shadow-brand-500/20"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorPage;
