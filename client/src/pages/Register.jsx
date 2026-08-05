import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import AuthLayout from '../components/auth/AuthLayout';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

const easing = [0.16, 1, 0.3, 1];

function PasswordStrength({ password }) {
  const { isDark } = useDarkMode();
  const checks = [
    { label: '8+ characters', met: password.length >= 8 },
    { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
  ];
  const metCount = checks.filter((c) => c.met).length;
  const strength = metCount === 0 ? 0 : metCount <= 1 ? 1 : metCount <= 2 ? 2 : metCount <= 3 ? 3 : 4;
  const colors = ['bg-surface-200', 'bg-danger-500', 'bg-warning-500', 'bg-accent-500', 'bg-success-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const labelColors = ['', 'text-danger-500', 'text-warning-500', 'text-accent-500', 'text-success-500'];

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all duration-300",
              i <= strength ? colors[strength] : isDark ? "bg-white/10" : "bg-surface-200"
            )}
          />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className={cn("text-xs font-medium", labelColors[strength])}>
          {labels[strength]}
        </span>
        <div className="flex gap-2">
          {checks.map((check) => (
            <span
              key={check.label}
              className={cn(
                "text-2xs transition-colors",
                check.met ? "text-success-500" : isDark ? "text-white/30" : "text-surface-400"
              )}
            >
              {check.met ? "✓" : "○"} {check.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);
  const { isDark } = useDarkMode();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    const { confirmPassword, ...submitData } = data;
    const result = await dispatch(registerUser(submitData));
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created! Please check your email to verify.');
      navigate('/');
    } else {
      toast.error(result.payload || 'Registration failed');
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join thousands of pizza lovers and start ordering."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "p-3 rounded-xl text-sm border",
              isDark
                ? "bg-danger-500/10 text-danger-400 border-danger-500/20"
                : "bg-danger-50 text-danger-600 border-danger-200"
            )}
          >
            {error}
          </motion.div>
        )}

        <div>
          <label className={cn("block text-sm font-medium mb-2", isDark ? "text-white/60" : "text-surface-600")}>
            Full Name
          </label>
          <input
            {...register('name')}
            type="text"
            autoComplete="name"
            placeholder="John Doe"
            className={cn(
              "w-full px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50",
              isDark
                ? "bg-dark-850 border-white/[0.08] text-white placeholder-white/30"
                : "bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400",
              errors.name && "border-danger-500/50 focus:ring-danger-500/50"
            )}
          />
          {errors.name && (
            <p className="text-xs text-danger-500 mt-1.5">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", isDark ? "text-white/60" : "text-surface-600")}>
            Email Address
          </label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(
              "w-full px-4 py-3.5 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50",
              isDark
                ? "bg-dark-850 border-white/[0.08] text-white placeholder-white/30"
                : "bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400",
              errors.email && "border-danger-500/50 focus:ring-danger-500/50"
            )}
          />
          {errors.email && (
            <p className="text-xs text-danger-500 mt-1.5">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", isDark ? "text-white/60" : "text-surface-600")}>
            Password
          </label>
          <div className="relative">
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Create a strong password"
              className={cn(
                "w-full px-4 py-3.5 pr-12 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50",
                isDark
                  ? "bg-dark-850 border-white/[0.08] text-white placeholder-white/30"
                  : "bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400",
                errors.password && "border-danger-500/50 focus:ring-danger-500/50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                isDark ? "text-white/40 hover:text-white/70" : "text-surface-400 hover:text-surface-600"
              )}
              tabIndex={-1}
            >
              {showPassword ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-danger-500 mt-1.5">{errors.password.message}</p>
          )}
          <PasswordStrength password={password || ''} />
        </div>

        <div>
          <label className={cn("block text-sm font-medium mb-2", isDark ? "text-white/60" : "text-surface-600")}>
            Confirm Password
          </label>
          <div className="relative">
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Confirm your password"
              className={cn(
                "w-full px-4 py-3.5 pr-12 rounded-xl border text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50",
                isDark
                  ? "bg-dark-850 border-white/[0.08] text-white placeholder-white/30"
                  : "bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400",
                errors.confirmPassword && "border-danger-500/50 focus:ring-danger-500/50"
              )}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors",
                isDark ? "text-white/40 hover:text-white/70" : "text-surface-400 hover:text-surface-600"
              )}
              tabIndex={-1}
            >
              {showConfirm ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-danger-500 mt-1.5">{errors.confirmPassword.message}</p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.97 }}
          className={cn(
            "w-full py-3.5 px-6 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Creating account...
            </span>
          ) : (
            'Create Account'
          )}
        </motion.button>

        <p className={cn("text-center text-sm", isDark ? "text-white/40" : "text-surface-500")}>
          Already have an account?{' '}
          <Link
            to="/login"
            className={cn(
              "font-semibold hover:underline",
              isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
            )}
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
