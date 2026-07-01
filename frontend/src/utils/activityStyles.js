import { 
  PlusCircle, 
  Edit3, 
  CheckCircle2, 
  Trash2, 
  Activity 
} from 'lucide-react';

export const getEventStyles = (type) => {
  switch (type) {
    case 'create':
      return {
        icon: PlusCircle,
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
        label: 'Created task',
      };
    case 'update':
      return {
        icon: Edit3,
        bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
        label: 'Updated task',
      };
    case 'status':
      return {
        icon: CheckCircle2,
        bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400',
        label: 'Changed status',
      };
    case 'delete':
      return {
        icon: Trash2,
        bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400',
        label: 'Deleted task',
      };
    default:
      return {
        icon: Activity,
        bg: 'bg-slate-500/10 dark:bg-slate-500/20 text-slate-650 dark:text-slate-400',
        label: 'Activity',
      };
  }
};
