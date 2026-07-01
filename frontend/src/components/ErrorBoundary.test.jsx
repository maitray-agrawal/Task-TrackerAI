import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorBoundary from './ErrorBoundary';

// Helper component that throws an error
const CrashingComponent = ({ shouldCrash }) => {
  if (shouldCrash) {
    throw new Error('Test component crashed');
  }
  return <div>Component is fine</div>;
};

describe('ErrorBoundary Component', () => {
  it('should render children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Test Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render fallback UI when a child crashes', () => {
    // Suppress console.error logging from React for the expected test crash
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <CrashingComponent shouldCrash={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test component crashed')).toBeInTheDocument();

    spy.mockRestore();
  });
});
