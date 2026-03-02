import { 
  CheckCircle, Clock, AlertTriangle, 
  CalendarCheck, ListTodo, TrendingUp 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';

export const TaskStats = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <Skeleton className="h-10 w-10 rounded-lg bg-slate-700 mb-3" />
              <Skeleton className="h-8 w-16 bg-slate-700 mb-2" />
              <Skeleton className="h-4 w-20 bg-slate-700" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats?.total || 0,
      icon: ListTodo,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Completed',
      value: stats?.completed || 0,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      subtext: stats?.total > 0 
        ? `${stats.completion_rate?.toFixed(0)}% done` 
        : null,
    },
    {
      title: 'Overdue',
      value: stats?.overdue || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'Due This Week',
      value: stats?.due_this_week || 0,
      icon: CalendarCheck,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statCards.map((stat, index) => (
        <Card 
          key={index} 
          className="bg-slate-800 border-slate-700/50 hover:border-slate-600 transition-colors card-hover"
        >
          <CardContent className="p-4">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center mb-3', stat.bgColor)}>
              <stat.icon className={cn('h-5 w-5', stat.color)} />
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.title}</p>
            {stat.subtext && (
              <p className={cn('text-xs mt-1', stat.color)}>{stat.subtext}</p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TaskStats;
