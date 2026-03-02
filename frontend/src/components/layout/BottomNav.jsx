import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Plus, Bell, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';
import { useUnreadCount } from '../../hooks/useNotifications';

export const BottomNav = ({ onAddTask }) => {
  const location = useLocation();
  const { data: unreadData } = useUnreadCount();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', href: '/dashboard' },
    { icon: ListTodo, label: 'Tasks', href: '/tasks' },
    { icon: Plus, label: 'Add', action: onAddTask, primary: true },
    { 
      icon: Bell, 
      label: 'Alerts', 
      href: '/dashboard',
      badge: unreadData?.unread_count 
    },
    { icon: User, label: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900 border-t border-slate-800 z-40 md:hidden safe-bottom">
      <div className="flex items-center justify-around h-full px-2">
        {navItems.map((item, index) => {
          const isActive = item.href && location.pathname === item.href;
          
          if (item.primary) {
            return (
              <Button
                key={index}
                onClick={item.action}
                className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 -mt-6"
                data-testid="add-task-mobile-btn"
              >
                <item.icon className="h-6 w-6" />
              </Button>
            );
          }

          const content = (
            <Button
              variant="ghost"
              className={cn(
                'flex flex-col items-center gap-1 h-auto py-1 px-3',
                isActive ? 'text-blue-500' : 'text-slate-400'
              )}
              data-testid={`bottom-nav-${item.label.toLowerCase()}`}
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.badge > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 h-4 w-4 p-0 flex items-center justify-center bg-red-500 text-[10px]"
                  >
                    {item.badge > 9 ? '9+' : item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px]">{item.label}</span>
            </Button>
          );

          return item.href ? (
            <Link key={index} to={item.href}>
              {content}
            </Link>
          ) : (
            <div key={index} onClick={item.action}>
              {content}
            </div>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
