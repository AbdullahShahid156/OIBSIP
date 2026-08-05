import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { forgotPassword } from '../store/slices/authSlice';
import AuthLayout from '../components/auth/AuthLayout';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';

const forgotSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
});

export default function ForgotPassword() {
  const [sent, setSent] = useState(false);
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.auth);
  const { isDark } = useDarkMode();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    const result = await dispatch(forgotPassword(data));
    if (forgotPassword.fulfilled.match(result)) {
      setSent(true);
      toast.success('If an account exists, you will receive a reset link.');
    } else {
      toast.error(result.payload || 'Something went wrong');
    }
  };

  if (sent) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent a password reset link to your email address.">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className={cn(
            "w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center",
            isDark ? "bg-success-500/10" : "bg-success-50"
          )}>
            <svg className="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
          <p className={cn("text-sm mb-6", isDark ? "text-white/50" : "text-surface-500")}>
            If an account exists with that email, you'll receive a password reset link shortly. Please check your inbox and spam folder.
          </p>
          <Link
            to="/login"
            className={cn(
              "inline-flex items-center gap-2 font-semibold text-sm transition-colors",
              isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
            )}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to sign in
          </Link>
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
              Sending link...
            </span>
          ) : (
            'Send Reset Link'
          )}
        </motion.button>

        <p className={cn("text-center text-sm", isDark ? "text-white/40" : "text-surface-500")}>
          Remember your password?{' '}
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
