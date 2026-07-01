import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getEventStyles } from '../utils/activityStyles';

const formatTimeAgo = (isoString) => {
  const date = new Date(isoString);
  const seconds = Math.floor((new Date() - date) / 1000);
  
  if (seconds < 5) return 'Just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);

  const loadActivities = () => {
    try {
      const logs = JSON.parse(localStorage.getItem('recent_activity') || '[]');
      setActivities(logs);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadActivities();
    
    // Listen to custom logger event
    window.addEventListener('activity_logged', loadActivities);
    
    // Polling interval to refresh "time ago" tags
    const interval = setInterval(loadActivities, 30000);
    
    return () => {
      window.removeEventListener('activity_logged', loadActivities);
      clearInterval(interval);
    };
  }, []);

  const clearActivities = () => {
    localStorage.removeItem('recent_activity');
    setActivities([]);
  };

  return (
    <div className="glass-card p-6 rounded-2xl flex flex-col h-full text-left">
      <div className="flex justify-between items-center mb-5">
        <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-5 h-5 text-brand-500" />
          Recent Activity
        </h3>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors uppercase tracking-wider"
          >
            Clear Log
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 scrollbar-thin">
        {activities.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <p className="text-sm">No activity recorded yet</p>
            <p className="text-[11px] mt-1 text-slate-400">Perform actions on your tasks to see updates here.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-100 dark:border-slate-800/60 ml-3.5 space-y-5 py-1">
            <AnimatePresence initial={false}>
              {activities.map((activity) => {
                const style = getEventStyles(activity.type);
                const IconComponent = style.icon;

                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="relative pl-7 group"
                  >
                    {/* Circle Bullet Icon */}
                    <div className={`absolute left-0 top-0.5 -translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center border-2 border-slate-50 dark:border-slate-900 ${style.bg} transition-transform duration-250 group-hover:scale-110 shadow-sm`}>
                      <IconComponent className="w-3.5 h-3.5" />
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-2">
                        <span className="text-xs font-bold text-slate-850 dark:text-slate-200">
                          {style.label}
                        </span>
                        <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {formatTimeAgo(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold truncate max-w-full">
                        "{activity.taskTitle}"
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
