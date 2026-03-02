import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Bell, Search, User, LogOut, Settings, 
  Menu, X, CheckSquare 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import useAuthStore from '../../store/authStore';
import { useUnreadCount, useNotifications, useMarkAsRead, useMarkAllAsRead } from '../../hooks/useNotifications';
import { formatRelativeTime } from '../../utils/dateUtils';

export const Navbar = ({ onMenuClick, onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const { data: unreadData } = useUnreadCount();
  const { data: notificationsData } = useNotifications({ size: 10 });
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.id);
    }
    setShowNotifications(false);
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 z-40">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left side - Logo & Menu */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-slate-400 hover:text-white"
            onClick={onMenuClick}
            data-testid="mobile-menu-btn"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <Link to="/dashboard" className="flex items-center gap-2" data-testid="nav-logo">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">TaskFlow</span>
          </Link>
        </div>

        {/* Center - Search (hidden on mobile) */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
              data-testid="search-input"
            />
          </div>
        </form>

        {/* Right side - Notifications & Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications Dropdown */}
          <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative text-slate-400 hover:text-white"
                data-testid="notifications-btn"
              >
                <Bell className="h-5 w-5" />
                {unreadData?.unread_count > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-xs"
                  >
                    {unreadData.unread_count > 9 ? '9+' : unreadData.unread_count}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-80 bg-slate-800 border-slate-700 text-white max-h-96 overflow-y-auto"
            >
              <div className="flex items-center justify-between p-3 border-b border-slate-700">
                <span className="font-semibold">Notifications</span>
                {unreadData?.unread_count > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300 text-xs"
                    onClick={() => markAllAsRead.mutate()}
                    data-testid="mark-all-read-btn"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
              
              {notificationsData?.items?.length > 0 ? (
                notificationsData.items.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex flex-col items-start p-3 cursor-pointer ${
                      !notification.is_read ? 'bg-slate-700/50 border-l-2 border-blue-500' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <span className="font-medium text-sm">{notification.title}</span>
                    <span className="text-xs text-slate-400 mt-1">{notification.message}</span>
                    <span className="text-xs text-slate-500 mt-2">
                      {formatRelativeTime(notification.sent_at)}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>You're all caught up!</p>
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 text-slate-400 hover:text-white"
                data-testid="profile-dropdown-btn"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatar_url} />
                  <AvatarFallback className="bg-blue-600 text-white text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden lg:block">{user?.first_name || user?.username}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-slate-800 border-slate-700 text-white">
              <div className="p-3 border-b border-slate-700">
                <p className="font-medium">{user?.first_name} {user?.last_name}</p>
                <p className="text-sm text-slate-400">{user?.email}</p>
              </div>
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="cursor-pointer"
                data-testid="profile-menu-item"
              >
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => navigate('/profile')}
                className="cursor-pointer"
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-slate-700" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-400 focus:text-red-400"
                data-testid="logout-menu-item"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
