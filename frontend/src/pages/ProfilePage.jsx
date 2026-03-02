import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  User, Mail, Lock, Save, Camera, 
  AlertTriangle, Trash2, Eye, EyeOff 
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Separator } from '../components/ui/separator';
import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';
import { BottomNav } from '../components/layout/BottomNav';
import { TaskForm } from '../components/tasks/TaskForm';
import { profileSchema, changePasswordSchema, getPasswordStrength } from '../utils/validationSchemas';
import { useProfile, useUpdateProfile, useChangePassword } from '../hooks/useAuth';
import { useTaskStats } from '../hooks/useTasks';
import useAuthStore from '../store/authStore';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  
  const { data: profile } = useProfile();
  const { data: stats } = useTaskStats();
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
      avatarUrl: user?.avatar_url || '',
    },
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const newPassword = passwordForm.watch('newPassword');
  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user?.username?.[0]?.toUpperCase() || 'U';
  };

  const handleProfileSubmit = async (data) => {
    try {
      await updateProfile.mutateAsync({
        first_name: data.firstName,
        last_name: data.lastName,
        avatar_url: data.avatarUrl || null,
      });
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handlePasswordSubmit = async (data) => {
    try {
      await changePassword.mutateAsync({
        current_password: data.currentPassword,
        new_password: data.newPassword,
      });
      passwordForm.reset();
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Would call delete API here
      toast.error('Account deletion is disabled in demo mode');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        onAddTask={() => setTaskFormOpen(true)}
      />

      <main className="pt-16 pb-20 md:pb-8 md:pl-64">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.avatar_url} />
                <AvatarFallback className="bg-blue-600 text-white text-2xl">
                  {getInitials()}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-950 hover:bg-blue-600 transition-colors">
                <Camera className="h-4 w-4 text-white" />
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {user?.first_name || user?.username} {user?.last_name}
              </h1>
              <p className="text-slate-400">{user?.email}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-slate-800 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-white">{stats?.total || 0}</p>
                <p className="text-sm text-slate-400">Total Tasks</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-green-400">{stats?.completed || 0}</p>
                <p className="text-sm text-slate-400">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700/50">
              <CardContent className="p-4 text-center">
                <p className="text-3xl font-bold text-blue-400">
                  {stats?.completion_rate?.toFixed(0) || 0}%
                </p>
                <p className="text-sm text-slate-400">Success Rate</p>
              </CardContent>
            </Card>
          </div>

          {/* Profile Settings */}
          <Card className="bg-slate-800 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" />
                Profile Information
              </CardTitle>
              <CardDescription className="text-slate-400">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register('firstName')}
                      className="bg-slate-900 border-slate-700 text-white"
                      data-testid="profile-firstname-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register('lastName')}
                      className="bg-slate-900 border-slate-700 text-white"
                      data-testid="profile-lastname-input"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="pl-10 bg-slate-900 border-slate-700 text-slate-400"
                    />
                  </div>
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatarUrl" className="text-slate-300">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    {...profileForm.register('avatarUrl')}
                    placeholder="https://example.com/avatar.jpg"
                    className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={updateProfile.isPending}
                  data-testid="save-profile-btn"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Change Password */}
          <Card className="bg-slate-800 border-slate-700/50 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-500" />
                Change Password
              </CardTitle>
              <CardDescription className="text-slate-400">
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-slate-300">Current Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="currentPassword"
                      type={showCurrentPassword ? 'text' : 'password'}
                      {...passwordForm.register('currentPassword')}
                      className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white"
                      data-testid="current-password-input"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-white"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-red-400 text-sm">{passwordForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? 'text' : 'password'}
                      {...passwordForm.register('newPassword')}
                      className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white"
                      data-testid="new-password-input"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-white"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {/* Password Strength */}
                  {newPassword && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">Password strength</span>
                        <span className={cn(
                          'text-xs font-medium',
                          passwordStrength?.color === 'bg-red-500' && 'text-red-400',
                          passwordStrength?.color === 'bg-amber-500' && 'text-amber-400',
                          passwordStrength?.color === 'bg-blue-500' && 'text-blue-400',
                          passwordStrength?.color === 'bg-green-500' && 'text-green-400',
                        )}>
                          {passwordStrength?.label}
                        </span>
                      </div>
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={cn('h-full transition-all duration-300', passwordStrength?.color)}
                          style={{ width: passwordStrength?.width }}
                        />
                      </div>
                    </div>
                  )}
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-red-400 text-sm">{passwordForm.formState.errors.newPassword.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-slate-300">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...passwordForm.register('confirmPassword')}
                      className="pl-10 bg-slate-900 border-slate-700 text-white"
                      data-testid="confirm-new-password-input"
                    />
                  </div>
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-red-400 text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={changePassword.isPending}
                  data-testid="change-password-btn"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  {changePassword.isPending ? 'Changing...' : 'Change Password'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="bg-slate-800 border-red-500/50">
            <CardHeader>
              <CardTitle className="text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription className="text-slate-400">
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                <div>
                  <p className="font-medium text-white">Delete Account</p>
                  <p className="text-sm text-slate-400">
                    Permanently delete your account and all data
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700"
                  data-testid="delete-account-btn"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav onAddTask={() => setTaskFormOpen(true)} />

      <TaskForm
        isOpen={taskFormOpen}
        onClose={() => setTaskFormOpen(false)}
      />
    </div>
  );
}
