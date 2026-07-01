import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import RecentActivity from './RecentActivity';

describe('RecentActivity Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render empty state message when no activities exist', () => {
    render(<RecentActivity />);
    expect(screen.getByText('No activity recorded yet')).toBeInTheDocument();
  });

  it('should load and render activities from localStorage', () => {
    const mockActivities = [
      {
        id: '1',
        type: 'create',
        taskTitle: 'First Task',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'delete',
        taskTitle: 'Deleted Task',
        timestamp: new Date().toISOString(),
      },
    ];

    localStorage.setItem('recent_activity', JSON.stringify(mockActivities));

    render(<RecentActivity />);

    expect(screen.getByText('Created task')).toBeInTheDocument();
    expect(screen.getByText('"First Task"')).toBeInTheDocument();
    expect(screen.getByText('Deleted task')).toBeInTheDocument();
    expect(screen.getByText('"Deleted Task"')).toBeInTheDocument();
  });

  it('should clear log and update UI when clear button is clicked', () => {
    const mockActivities = [
      {
        id: '1',
        type: 'create',
        taskTitle: 'First Task',
        timestamp: new Date().toISOString(),
      },
    ];

    localStorage.setItem('recent_activity', JSON.stringify(mockActivities));

    render(<RecentActivity />);

    expect(screen.getByText('"First Task"')).toBeInTheDocument();

    const clearButton = screen.getByText('Clear Log');
    fireEvent.click(clearButton);

    expect(screen.getByText('No activity recorded yet')).toBeInTheDocument();
    expect(localStorage.getItem('recent_activity')).toBeNull();
  });
});
