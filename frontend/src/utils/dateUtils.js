import { format, formatDistanceToNow, isToday, isTomorrow, isYesterday, isPast, differenceInDays } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'MMM d, yyyy');
};

export const formatDateTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return format(d, 'MMM d, yyyy h:mm a');
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return formatDistanceToNow(d, { addSuffix: true });
};

export const getDueDateLabel = (date) => {
  if (!date) return null;
  const d = new Date(date);
  
  if (isToday(d)) {
    return { label: 'Due Today', color: 'text-amber-500' };
  }
  if (isTomorrow(d)) {
    return { label: 'Due Tomorrow', color: 'text-blue-400' };
  }
  if (isYesterday(d)) {
    return { label: 'Due Yesterday', color: 'text-red-500' };
  }
  if (isPast(d)) {
    const days = Math.abs(differenceInDays(d, new Date()));
    return { label: `${days} day${days > 1 ? 's' : ''} overdue`, color: 'text-red-500' };
  }
  
  const days = differenceInDays(d, new Date());
  if (days <= 7) {
    return { label: `Due in ${days} day${days > 1 ? 's' : ''}`, color: 'text-slate-400' };
  }
  
  return { label: formatDate(date), color: 'text-slate-500' };
};

export const isOverdue = (date, status) => {
  if (!date) return false;
  if (status === 'COMPLETED' || status === 'CANCELLED') return false;
  return isPast(new Date(date));
};
