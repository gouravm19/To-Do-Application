import { useState } from 'react';
import { 
  Check, Pin, Trash2, Edit, Calendar, 
  AlertCircle, MoreVertical 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { getDueDateLabel } from '../../utils/dateUtils';
import { useUpdateTaskStatus, useTogglePin, useDeleteTask } from '../../hooks/useTasks';

const priorityStyles = {
  LOW: { bg: 'bg-slate-600', text: 'text-slate-300', label: 'Low' },
  MEDIUM: { bg: 'bg-blue-600', text: 'text-blue-300', label: 'Medium' },
  HIGH: { bg: 'bg-amber-600', text: 'text-amber-300', label: 'High' },
  URGENT: { bg: 'bg-red-600', text: 'text-red-300', label: 'Urgent' },
};

const statusStyles = {
  PENDING: { color: 'text-slate-400' },
  IN_PROGRESS: { color: 'text-blue-400' },
  COMPLETED: { color: 'text-green-400' },
  CANCELLED: { color: 'text-slate-500' },
};

export const TaskCard = ({ task, onEdit, isGridView = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const updateStatus = useUpdateTaskStatus();
  const togglePin = useTogglePin();
  const deleteTask = useDeleteTask();

  const isCompleted = task.status === 'COMPLETED';
  const priority = priorityStyles[task.priority] || priorityStyles.MEDIUM;
  const dueDateInfo = getDueDateLabel(task.due_date);

  const handleToggleComplete = () => {
    updateStatus.mutate({
      id: task.id,
      status: isCompleted ? 'PENDING' : 'COMPLETED',
    });
  };

  const handleTogglePin = (e) => {
    e.stopPropagation();
    togglePin.mutate(task.id);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id);
    }
  };

  return (
    <div
      className={cn(
        'group relative bg-slate-800 rounded-xl border border-slate-700/50 p-4 transition-all duration-200',
        'hover:border-slate-600 hover:shadow-lg hover:shadow-blue-500/5 card-hover',
        isCompleted && 'opacity-60',
        task.is_overdue && !isCompleted && 'border-l-4 border-l-red-500',
        isGridView ? 'flex flex-col' : 'flex items-start gap-4'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-testid={`task-card-${task.id}`}
    >
      {/* Checkbox */}
      <div className="flex items-start pt-0.5">
        <Checkbox
          checked={isCompleted}
          onCheckedChange={handleToggleComplete}
          className={cn(
            'h-5 w-5 rounded-full border-2 transition-all',
            isCompleted 
              ? 'bg-green-500 border-green-500' 
              : 'border-slate-500 hover:border-blue-500'
          )}
          data-testid={`task-checkbox-${task.id}`}
        />
      </div>

      {/* Content */}
      <div className={cn('flex-1 min-w-0', isGridView && 'mt-3')}>
        {/* Title & Priority */}
        <div className="flex items-start justify-between gap-2">
          <h3
            className={cn(
              'font-medium text-white transition-all',
              isCompleted && 'line-through text-slate-400'
            )}
          >
            {task.title}
          </h3>
          
          {/* Pin indicator */}
          {task.is_pinned && (
            <Pin className="h-4 w-4 text-amber-500 fill-amber-500 flex-shrink-0" />
          )}
        </div>

        {/* Description */}
        {task.description && (
          <p className={cn(
            'text-sm text-slate-400 mt-1 line-clamp-2',
            isCompleted && 'line-through'
          )}>
            {task.description}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {/* Priority badge */}
          <Badge 
            variant="secondary" 
            className={cn('text-xs', priority.bg, priority.text)}
          >
            {priority.label}
          </Badge>

          {/* Category */}
          {task.category_name && (
            <Badge 
              variant="outline" 
              className="text-xs border-slate-600"
              style={{ 
                borderColor: task.category_color,
                color: task.category_color 
              }}
            >
              {task.category_name}
            </Badge>
          )}

          {/* Due date */}
          {dueDateInfo && (
            <div className={cn('flex items-center text-xs gap-1', dueDateInfo.color)}>
              {task.is_overdue && !isCompleted ? (
                <AlertCircle className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span>{dueDateInfo.label}</span>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className={cn(
        'flex items-center gap-1 transition-opacity',
        !isHovered && 'opacity-0 group-hover:opacity-100',
        isGridView && 'absolute top-3 right-3'
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-400 hover:text-white"
              data-testid={`task-actions-${task.id}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            className="bg-slate-800 border-slate-700 text-white"
          >
            <DropdownMenuItem
              onClick={() => onEdit(task)}
              className="cursor-pointer"
              data-testid={`edit-task-${task.id}`}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleTogglePin}
              className="cursor-pointer"
            >
              <Pin className={cn(
                'mr-2 h-4 w-4',
                task.is_pinned && 'fill-current'
              )} />
              {task.is_pinned ? 'Unpin' : 'Pin'}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDelete}
              className="cursor-pointer text-red-400 focus:text-red-400"
              data-testid={`delete-task-${task.id}`}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TaskCard;
