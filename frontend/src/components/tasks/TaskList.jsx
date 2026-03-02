import { TaskCard } from './TaskCard';
import { Skeleton } from '../ui/skeleton';
import { cn } from '../../lib/utils';
import { ListTodo } from 'lucide-react';

export const TaskList = ({ tasks, isLoading, onEdit, isGridView = false }) => {
  if (isLoading) {
    return (
      <div className={cn(
        isGridView 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
          : 'space-y-3'
      )}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-slate-800 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start gap-4">
              <Skeleton className="h-5 w-5 rounded-full bg-slate-700" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-slate-700" />
                <Skeleton className="h-4 w-full bg-slate-700" />
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-5 w-16 bg-slate-700 rounded-full" />
                  <Skeleton className="h-5 w-20 bg-slate-700 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-4">
          <ListTodo className="h-10 w-10 text-slate-500" />
        </div>
        <h3 className="text-lg font-medium text-white mb-2">No tasks found</h3>
        <p className="text-slate-400">Create a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className={cn(
      isGridView 
        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' 
        : 'space-y-3'
    )}>
      {tasks.map((task) => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onEdit={onEdit}
          isGridView={isGridView}
        />
      ))}
    </div>
  );
};

export default TaskList;
