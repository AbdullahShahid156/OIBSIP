import { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { verifyEmail } from '../store/slices/authSlice';
import AuthLayout from '../components/auth/AuthLayout';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated } = useSelector((state) => state.auth);
  const { isDark } = useDarkMode();
  const [status, setStatus] = useState('verifying');
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }

    let timeoutId;
    const verify = async () => {
      const result = await dispatch(verifyEmail(token));
      if (verifyEmail.fulfilled.match(result)) {
        setStatus('success');
        timeoutId = setTimeout(() => navigate('/'), 2000);
      } else {
        setStatus('failed');
      }
    };

    verify();
    return () => { if (timeoutId) clearTimeout(timeoutId); };
  }, [token, dispatch, navigate]);

  if (!token) {
    return (
      <AuthLayout title="Invalid verification link" subtitle="This email verification link is invalid.">
        <div className="text-center">
          <div className={cn(
            "w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center",
            isDark ? "bg-danger-500/10" : "bg-danger-50"
          )}>
            <svg className="w-8 h-8 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <Link
            to="/"
            className={cn(
              "inline-flex items-center gap-2 font-semibold text-sm transition-colors",
              isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
            )}
          >
            Go to homepage
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Email Verification" subtitle="Verifying your email address...">
      <div className="text-center py-8">
        {status === 'verifying' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center"
          >
            <div className="relative mb-6">
              <div className="w-16 h-16 rounded-full border-4 border-brand-500/20 border-t-brand-500 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
            </div>
            <p className={cn("text-sm", isDark ? "text-white/50" : "text-surface-500")}>
              Verifying your email...
            </p>
          </motion.div>
        )}

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
              isDark ? "bg-success-500/10" : "bg-success-50"
            )}>
              <svg className="w-8 h-8 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={cn(
              "text-lg font-display font-semibold mb-2",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Email Verified!
            </h3>
            <p className={cn("text-sm mb-4", isDark ? "text-white/50" : "text-surface-500")}>
              Your email has been verified. Redirecting you to the homepage...
            </p>
          </motion.div>
        )}

        {status === 'failed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className={cn(
              "w-16 h-16 rounded-2xl mb-6 flex items-center justify-center",
              isDark ? "bg-danger-500/10" : "bg-danger-50"
            )}>
              <svg className="w-8 h-8 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className={cn(
              "text-lg font-display font-semibold mb-2",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Verification Failed
            </h3>
            <p className={cn("text-sm mb-4", isDark ? "text-white/50" : "text-surface-500")}>
              This verification link is invalid or has expired.
            </p>
            <Link
              to="/"
              className={cn(
                "inline-flex items-center gap-2 font-semibold text-sm transition-colors",
                isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
              )}
            >
              Go to homepage
            </Link>
          </motion.div>
        )}
      </div>
    </AuthLayout>
  );
}
