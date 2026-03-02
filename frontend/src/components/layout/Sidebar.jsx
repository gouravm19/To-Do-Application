import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, ListTodo, Plus, Tag, 
  Briefcase, User, ShoppingCart, Heart, X 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import useAuthStore from '../../store/authStore';
import { useCategories } from '../../hooks/useCategories';

const iconMap = {
  briefcase: Briefcase,
  user: User,
  'shopping-cart': ShoppingCart,
  heart: Heart,
};

export const Sidebar = ({ isOpen, onClose, onAddTask }) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const { data: categories } = useCategories();

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
    { icon: ListTodo, label: 'All Tasks', href: '/tasks' },
  ];

  const getIcon = (iconName) => {
    const IconComponent = iconMap[iconName] || Tag;
    return IconComponent;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-slate-900 border-r border-slate-800 z-50 transition-transform duration-300',
          'md:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 md:hidden text-slate-400 hover:text-white"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <ScrollArea className="h-full py-4">
          {/* User Info */}
          <div className="px-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-blue-600 text-white">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">
                  {user?.first_name || user?.username}
                </p>
                <p className="text-sm text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Add Task Button */}
          <div className="px-4 py-4">
            <Button
              onClick={onAddTask}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
              data-testid="add-task-sidebar-btn"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </div>

          {/* Navigation */}
          <div className="px-2 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} onClick={onClose}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive 
                        ? 'bg-slate-800 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    )}
                    data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Categories */}
          <div className="px-4 mt-6">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Categories
            </h3>
            <div className="space-y-1">
              {categories?.map((category) => {
                const IconComponent = getIcon(category.icon);
                return (
                  <Link 
                    key={category.id} 
                    to={`/tasks?category=${category.id}`}
                    onClick={onClose}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-between text-slate-400 hover:text-white hover:bg-slate-800"
                    >
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-3"
                          style={{ backgroundColor: category.color }}
                        />
                        <IconComponent className="mr-2 h-4 w-4" />
                        <span>{category.name}</span>
                      </div>
                      <span className="text-xs text-slate-500">{category.task_count}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </aside>
    </>
  );
};

export default Sidebar;
