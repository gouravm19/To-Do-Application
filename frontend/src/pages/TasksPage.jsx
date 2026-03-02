import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, ListTodo } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { TaskList } from '../components/tasks/TaskList';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { useCategories } from '../hooks/useCategories';
import { debounce } from '../utils/dateUtils';

export default function TasksPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isGridView, setIsGridView] = useState(() => {
    return localStorage.getItem('taskView') === 'grid';
  });

  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category_id: searchParams.get('category') || '',
    due_date: searchParams.get('due_date') || '',
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'createdAt',
    order: searchParams.get('order') || 'desc',
    page: parseInt(searchParams.get('page') || '0'),
    size: 20,
  });

  const { data: tasksData, isLoading } = useTasks(filters);
  const { data: categories } = useCategories();

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && key !== 'size') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 0 }));
  }, []);

  const handleViewChange = (gridView) => {
    setIsGridView(gridView);
    localStorage.setItem('taskView', gridView ? 'grid' : 'list');
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormOpen(true);
  };

  const handleSearch = (query) => {
    handleFilterChange({ search: query });
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)}
        onSearch={handleSearch}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onAddTask={handleAddTask}
      />

      <main className="pt-16 pb-20 md:pb-8 md:pl-64">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <ListTodo className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Tasks</h1>
                <p className="text-slate-400 text-sm">
                  {tasksData?.total || 0} total tasks
                </p>
              </div>
            </div>
            <Button
              onClick={handleAddTask}
              className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="add-task-btn"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Filters */}
          <TaskFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            categories={categories || []}
            isGridView={isGridView}
            onViewChange={handleViewChange}
          />

          {/* Task List */}
          <div className="mt-6">
            <TaskList
              tasks={tasksData?.items || []}
              isLoading={isLoading}
              onEdit={handleEditTask}
              isGridView={isGridView}
            />
          </div>

          {/* Pagination */}
          {tasksData?.pages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-800">
              <p className="text-sm text-slate-400">
                Showing {filters.page * filters.size + 1} - {Math.min((filters.page + 1) * filters.size, tasksData.total)} of {tasksData.total}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={filters.page === 0}
                  className="border-slate-700 text-slate-300"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={filters.page >= tasksData.pages - 1}
                  className="border-slate-700 text-slate-300"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav onAddTask={handleAddTask} />

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => {
          setTaskFormOpen(false);
          setEditingTask(null);
        }}
        task={editingTask}
      />
    </div>
  );
}
