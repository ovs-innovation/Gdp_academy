import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Lock, Mail, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { AuthAPI, setToken } from '@/lib/api';
import { useRole } from '@/contexts/RoleContext';
import '@/styles/admin-login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@gdpstudio.com');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [requiresOTP, setRequiresOTP] = useState(false);
  const [remember, setRemember] = useState(true);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const { setCurrentRole, setPermissions } = useRole();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token && !isLoading) {
      const performAutoLogin = async () => {
        setIsLoading(true);
        setToken(token, true);
        try {
          const data = await AuthAPI.me();
          if (data.user) {
            setCurrentRole(data.user.role);
            setPermissions((data.user.permissions || []) as any);
            localStorage.setItem('user-email', data.user.email);
            localStorage.setItem('user-name', data.user.name || data.user.email);
            localStorage.setItem('user-id', data.user.id);
            toast.success('Admin access granted');
            navigate('/');
          }
        } catch {
          toast.error('Auto-login failed. Please login manually.');
        } finally {
          setIsLoading(false);
        }
      };
      performAutoLogin();
    }
  }, []);

  const persistUser = (user: { email: string; name?: string; id: string }, rememberUser: boolean) => {
    const storage = rememberUser ? localStorage : sessionStorage;
    storage.setItem('user-email', user.email);
    storage.setItem('user-name', user.name || user.email);
    storage.setItem('user-id', user.id);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (forgotMode) {
        if (!email) {
          toast.error('Please enter your email');
          return;
        }
        if (!resetStep) {
          await AuthAPI.forgot({ email });
          setResetStep(true);
          toast.success('Reset code sent to your email');
          return;
        }
        if (!resetOtp || !newPassword) {
          toast.error('Enter the code and new password');
          return;
        }
        await AuthAPI.reset({ email, otp: resetOtp, password: newPassword });
        toast.success('Password reset. Please log in.');
        setForgotMode(false);
        setResetStep(false);
        setResetOtp('');
        setNewPassword('');
        return;
      }
      if (!email || !password) {
        toast.error('Please enter email and password');
        return;
      }
      if (requiresOTP && !otp) {
        toast.error('Please enter the OTP sent to your email');
        return;
      }
      const data = await AuthAPI.login({ email, password, otp: requiresOTP ? otp : undefined });
      if (data.requiresOTP) {
        setRequiresOTP(true);
        toast.success(data.message || 'OTP sent to your email');
        return;
      }
      if (data.token && data.user) {
        setToken(data.token, remember);
        setCurrentRole(data.user.role);
        setPermissions((data.user.permissions || []) as any);
        persistUser(data.user, remember);
        toast.success('Login successful');
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setRequiresOTP(false);
    setOtp('');
    setForgotMode(false);
    setResetStep(false);
    setResetOtp('');
    setNewPassword('');
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />
      <div className="admin-login-glow" />

      <div className="admin-login-inner">
        <div className="w-full max-w-md animate-fade-in">
          <div className="admin-login-brand">
            <div className="admin-login-badge">
              <span className="admin-login-badge-dot" />
              GDP Admin Panel
            </div>
            <div className="admin-login-logo-wrap">
              <img src="/logo.png" alt="GDP" className="admin-login-logo" />
              <div className="admin-login-brand-text">
                <span>Garima</span>
                <span>Dance</span>
                <span>Productions</span>
              </div>
            </div>
            <h1 className="admin-login-title">
              {requiresOTP ? (
                <>Verify <span className="accent">Access</span></>
              ) : forgotMode ? (
                <>Reset <span className="accent">Password</span></>
              ) : (
                <>Admin <span className="accent">Login</span></>
              )}
            </h1>
            <p className="admin-login-subtitle">
              {requiresOTP
                ? 'Enter the verification code sent to your email'
                : forgotMode
                  ? 'Recover your admin account securely'
                  : 'Manage programs, workshops, CMS, students & more'}
            </p>
          </div>

          <div className="admin-login-card animate-slide-up">
            <form onSubmit={handleLogin} className="space-y-5">
              {!requiresOTP && !forgotMode ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@gdpstudio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={remember}
                        onCheckedChange={(checked) => setRemember(Boolean(checked))}
                      />
                      <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                        Remember me
                      </Label>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setForgotMode(true);
                        setResetStep(false);
                        setRequiresOTP(false);
                        setOtp('');
                      }}
                      className="admin-login-link"
                    >
                      Forgot password?
                    </button>
                  </div>
                </>
              ) : forgotMode ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="resetEmail">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="resetEmail"
                        type="email"
                        placeholder="admin@gdpstudio.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {resetStep && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="resetOtp">Reset Code</Label>
                        <div className="relative">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="resetOtp"
                            type="text"
                            placeholder="Enter 6-digit code"
                            value={resetOtp}
                            onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            className="pl-10 text-center text-2xl tracking-widest"
                            maxLength={6}
                            disabled={isLoading}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          disabled={isLoading}
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={handleBack} className="w-1/3 admin-login-outline-btn" disabled={isLoading}>
                      Back
                    </Button>
                    <button type="submit" disabled={isLoading} className="w-2/3 admin-login-submit">
                      {isLoading ? 'Please wait...' : resetStep ? 'Reset Password' : 'Send Reset Code'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Verification Code</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="pl-10 text-center text-2xl tracking-widest"
                        maxLength={6}
                        disabled={isLoading}
                        autoFocus
                      />
                    </div>
                  </div>
                  <Button type="button" variant="outline" onClick={handleBack} className="w-full admin-login-outline-btn" disabled={isLoading}>
                    Back to Login
                  </Button>
                </>
              )}

              {!forgotMode && (
                <button type="submit" disabled={isLoading} className="admin-login-submit">
                  {isLoading ? 'Please wait...' : requiresOTP ? 'Verify Code' : 'Sign In to Dashboard'}
                </button>
              )}
            </form>

            {!requiresOTP && !forgotMode && (
              <div className="admin-login-note">
                Default admin: <strong>admin@gdpstudio.com</strong> / <strong>adminpassword</strong>
                <br />
                Backend must be running on port <strong>8096</strong>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
