import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckSquare, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '../components/ui/input-otp';
import { forgotPasswordSchema, resetPasswordSchema, getPasswordStrength } from '../utils/validationSchemas';
import authApi from '../api/authApi';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Step 1 form
  const emailForm = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  // Step 3 form
  const passwordForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  });

  const password = passwordForm.watch('newPassword');
  const passwordStrength = password ? getPasswordStrength(password) : null;

  const handleSendOTP = async (data) => {
    try {
      await authApi.forgotPassword(data.email);
      setEmail(data.email);
      setStep(2);
      setCountdown(60);
      toast.success('OTP sent to your email');
      
      // Start countdown
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      passwordForm.setValue('otp', otp);
      setStep(3);
    } else {
      toast.error('Please enter the complete OTP');
    }
  };

  const handleResetPassword = async (data) => {
    try {
      await authApi.resetPassword({
        email,
        otp: data.otp,
        new_password: data.newPassword,
      });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authApi.forgotPassword(email);
      setCountdown(60);
      toast.success('OTP resent');
      
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      toast.error('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-slate-950">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-2xl mb-4">
            <CheckSquare className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 mt-2">
            {step === 1 && "Enter your email to receive an OTP"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 shadow-xl">
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={emailForm.handleSubmit(handleSendOTP)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="email"
                    type="email"
                    {...emailForm.register('email')}
                    placeholder="Enter your email"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                    data-testid="forgot-email-input"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="text-red-400 text-sm">{emailForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
                disabled={emailForm.formState.isSubmitting}
                data-testid="send-otp-btn"
              >
                {emailForm.formState.isSubmitting ? 'Sending...' : 'Send OTP'}
              </Button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-slate-300 text-center block">Enter OTP</Label>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={setOtp}
                    data-testid="otp-input"
                  >
                    <InputOTPGroup className="gap-2">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="w-12 h-14 text-xl bg-slate-800 border-slate-700 text-white"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <p className="text-center text-slate-400 text-sm">
                  OTP sent to <span className="text-white">{email}</span>
                </p>
              </div>

              {/* Timer */}
              <div className="text-center">
                {countdown > 0 ? (
                  <p className="text-amber-400 text-sm">
                    OTP expires in {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </p>
                ) : (
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Resend OTP
                  </Button>
                )}
              </div>

              <Button
                onClick={handleVerifyOTP}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
                disabled={otp.length !== 6}
                data-testid="verify-otp-btn"
              >
                Verify OTP
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep(1)}
                className="w-full text-slate-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Change email
              </Button>
            </div>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={passwordForm.handleSubmit(handleResetPassword)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-slate-300">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    {...passwordForm.register('newPassword')}
                    placeholder="Create new password"
                    className="pl-10 pr-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                    data-testid="new-password-input"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-slate-500 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {/* Password Strength */}
                {password && (
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
                <Label htmlFor="confirmPassword" className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    placeholder="Confirm new password"
                    className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                    data-testid="confirm-password-input"
                  />
                </div>
                {passwordForm.formState.errors.confirmPassword && (
                  <p className="text-red-400 text-sm">{passwordForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white h-11"
                disabled={passwordForm.formState.isSubmitting}
                data-testid="reset-password-btn"
              >
                {passwordForm.formState.isSubmitting ? 'Resetting...' : 'Reset Password'}
              </Button>
            </form>
          )}

          {/* Back to login */}
          <p className="text-center text-slate-400 mt-6">
            Remember your password?{' '}
            <Link
              to="/login"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
