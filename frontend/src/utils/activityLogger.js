export const logActivity = (type, taskTitle) => {
  try {
    const logs = JSON.parse(localStorage.getItem('recent_activity') || '[]');
    const newLog = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      type,
      taskTitle,
      timestamp: new Date().toISOString(),
    };
    // Keep the last 15 actions
    localStorage.setItem('recent_activity', JSON.stringify([newLog, ...logs].slice(0, 15)));
    // Emit custom event to refresh UI components reactively
    window.dispatchEvent(new Event('activity_logged'));
  } catch (err) {
    console.error('Failed to write activity logs:', err);
  }
};
