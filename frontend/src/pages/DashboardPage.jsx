import { useState } from 'react';
import { Plus, Pin, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskStats } from '../components/tasks/TaskStats';
import { TaskForm } from '../components/tasks/TaskForm';
import { useTasks, useTaskStats } from '../hooks/useTasks';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const COLORS = ['#94a3b8', '#3b82f6', '#10b981', '#6b7280'];

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: statsData, isLoading: statsLoading } = useTaskStats();
  const { data: pinnedTasks, isLoading: pinnedLoading } = useTasks({ pinned: true, size: 5 });
  const { data: todayTasks, isLoading: todayLoading } = useTasks({ due_date: 'today', size: 5 });
  const { data: overdueTasks, isLoading: overdueLoading } = useTasks({ due_date: 'overdue', size: 5 });

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskFormOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setTaskFormOpen(true);
  };

  const chartData = statsData ? [
    { name: 'Pending', value: statsData.pending, color: '#94a3b8' },
    { name: 'In Progress', value: statsData.in_progress, color: '#3b82f6' },
    { name: 'Completed', value: statsData.completed, color: '#10b981' },
    { name: 'Cancelled', value: statsData.cancelled, color: '#6b7280' },
  ].filter(d => d.value > 0) : [];

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar 
        onMenuClick={() => setSidebarOpen(true)}
        onSearch={(query) => console.log('Search:', query)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onAddTask={handleAddTask}
      />

      <main className="pt-16 pb-20 md:pb-8 md:pl-64">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-slate-400 mt-1">Welcome back! Here's your task overview</p>
            </div>
            <Button
              onClick={handleAddTask}
              className="hidden md:flex bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="add-task-header-btn"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Stats Grid */}
          <TaskStats stats={statsData} isLoading={statsLoading} />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Completion Chart */}
            <Card className="bg-slate-800 border-slate-700/50 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Task Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="h-48 flex items-center justify-center">
                    <Skeleton className="h-32 w-32 rounded-full bg-slate-700" />
                  </div>
                ) : chartData.length > 0 ? (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#f1f5f9'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-wrap justify-center gap-4 mt-2">
                      {chartData.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="text-xs text-slate-400">
                            {entry.name} ({entry.value})
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="h-48 flex items-center justify-center text-slate-400">
                    No tasks yet
                  </div>
                )}
                
                {/* Completion Rate */}
                <div className="text-center mt-4 pt-4 border-t border-slate-700">
                  <p className="text-3xl font-bold text-white">
                    {statsData?.completion_rate?.toFixed(0) || 0}%
                  </p>
                  <p className="text-sm text-slate-400">Completion Rate</p>
                </div>
              </CardContent>
            </Card>

            {/* Pinned Tasks */}
            <Card className="bg-slate-800 border-slate-700/50 lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Pin className="h-5 w-5 text-amber-500" />
                  Pinned Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pinnedLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 bg-slate-700 rounded-xl" />
                    ))}
                  </div>
                ) : pinnedTasks?.items?.length > 0 ? (
                  <div className="space-y-3">
                    {pinnedTasks.items.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Pin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No pinned tasks</p>
                    <p className="text-sm mt-1">Pin important tasks to see them here</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Today's Tasks */}
            <Card className="bg-slate-800 border-slate-700/50 lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Today's Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todayLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 bg-slate-700 rounded-xl" />
                    ))}
                  </div>
                ) : todayTasks?.items?.length > 0 ? (
                  <div className="space-y-3">
                    {todayTasks.items.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nothing due today</p>
                    <p className="text-sm mt-1">Enjoy your free day!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Overdue Tasks */}
            <Card className="bg-slate-800 border-slate-700/50 border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Overdue
                </CardTitle>
              </CardHeader>
              <CardContent>
                {overdueLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-20 bg-slate-700 rounded-xl" />
                    ))}
                  </div>
                ) : overdueTasks?.items?.length > 0 ? (
                  <div className="space-y-3">
                    {overdueTasks.items.map((task) => (
                      <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-green-400">
                    <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
                      ✓
                    </div>
                    <p>No overdue tasks!</p>
                    <p className="text-sm mt-1 text-slate-400">Keep up the great work</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
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
