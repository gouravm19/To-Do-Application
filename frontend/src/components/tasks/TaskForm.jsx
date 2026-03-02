import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Pin } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Switch } from '../ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { taskSchema } from '../../utils/validationSchemas';
import { useCategories } from '../../hooks/useCategories';
import { useCreateTask, useUpdateTask } from '../../hooks/useTasks';
import { cn } from '../../lib/utils';

const priorityOptions = [
  { value: 'LOW', label: 'Low', color: 'bg-slate-500' },
  { value: 'MEDIUM', label: 'Medium', color: 'bg-blue-500' },
  { value: 'HIGH', label: 'High', color: 'bg-amber-500' },
  { value: 'URGENT', label: 'Urgent', color: 'bg-red-500' },
];

export const TaskForm = ({ isOpen, onClose, task = null }) => {
  const { data: categories } = useCategories();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'MEDIUM',
      due_date: '',
      category_id: '',
      is_pinned: false,
    },
  });

  const titleValue = watch('title');

  useEffect(() => {
    if (task) {
      reset({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'MEDIUM',
        due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
        category_id: task.category_id || '',
        is_pinned: task.is_pinned || false,
      });
    } else {
      reset({
        title: '',
        description: '',
        priority: 'MEDIUM',
        due_date: '',
        category_id: '',
        is_pinned: false,
      });
    }
  }, [task, reset, isOpen]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
      category_id: data.category_id || null,
    };

    try {
      if (isEditing) {
        await updateTask.mutateAsync({ id: task.id, data: payload });
      } else {
        await createTask.mutateAsync(payload);
      }
      onClose();
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-md bg-slate-900 border-slate-800 text-white overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="text-white">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-300">
              Title *
            </Label>
            <Input
              id="title"
              {...register('title')}
              placeholder="Enter task title"
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              data-testid="task-title-input"
              autoFocus
            />
            <div className="flex justify-between text-xs">
              {errors.title && (
                <span className="text-red-400">{errors.title.message}</span>
              )}
              <span className="text-slate-500 ml-auto">{titleValue?.length || 0}/200</span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-300">
              Description
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Add a description..."
              rows={4}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500 resize-none"
              data-testid="task-description-input"
            />
            {errors.description && (
              <span className="text-red-400 text-xs">{errors.description.message}</span>
            )}
          </div>

          {/* Priority */}
          <div className="space-y-3">
            <Label className="text-slate-300">Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <RadioGroup
                  value={field.value}
                  onValueChange={field.onChange}
                  className="flex flex-wrap gap-3"
                  data-testid="task-priority-group"
                >
                  {priorityOptions.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={option.value}
                        className={cn(
                          'flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 cursor-pointer transition-all',
                          'peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-slate-800',
                          'hover:border-slate-600'
                        )}
                      >
                        <div className={cn('w-3 h-3 rounded-full', option.color)} />
                        <span className="text-sm text-slate-300">{option.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-slate-300">Category</Label>
            <Controller
              name="category_id"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger 
                    className="bg-slate-800 border-slate-700 text-white"
                    data-testid="task-category-select"
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="">None</SelectItem>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due_date" className="text-slate-300">
              <Calendar className="inline-block w-4 h-4 mr-2" />
              Due Date
            </Label>
            <Input
              id="due_date"
              type="datetime-local"
              {...register('due_date')}
              className="bg-slate-800 border-slate-700 text-white focus:border-blue-500"
              data-testid="task-duedate-input"
            />
          </div>

          {/* Pin Task */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              <Pin className="w-4 h-4 text-slate-400" />
              <Label htmlFor="is_pinned" className="text-slate-300 cursor-pointer">
                Pin task
              </Label>
            </div>
            <Controller
              name="is_pinned"
              control={control}
              render={({ field }) => (
                <Switch
                  id="is_pinned"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  data-testid="task-pin-switch"
                />
              )}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-slate-800">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
              disabled={isSubmitting}
              data-testid="task-submit-btn"
            >
              {isSubmitting ? 'Saving...' : isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
};

export default TaskForm;
