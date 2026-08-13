import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../hooks';
import { cn, formatCurrency } from '../utils/helpers';
import { getOrder, clearCurrentOrder } from '../store/slices/orderSlice';
import { ROUTES } from '../utils/constants';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function OrderFailure() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, isLoading } = useSelector((state) => state.orders);
  const [reason, setReason] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const reasonParam = searchParams.get('reason');
    if (reasonParam) {
      const reasons = {
        cancelled: 'Payment was cancelled.',
        payment_failed: 'Payment failed. Please try again.',
        invalid_hash: 'Payment verification failed.',
        server_error: 'A server error occurred.',
        missing_order: 'Order information missing.',
        order_not_found: 'Order not found.',
        unknown: 'An unknown error occurred.',
      };
      setReason(reasons[reasonParam] || 'An error occurred during payment.');
    }
    if (id) {
      dispatch(getOrder(id));
    }
    return () => dispatch(clearCurrentOrder());
  }, [id, dispatch, searchParams]);

  const handleRetryPayment = () => {
    if (currentOrder) {
      navigate(ROUTES.CHECKOUT);
    }
  };

  return (
    <div className={cn('min-h-screen transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
      <div className="max-w-lg mx-auto px-4 py-16">
        <motion.div {...pageTransition} className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className={cn(
              'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
              isDark ? 'bg-danger-500/10' : 'bg-danger-50'
            )}
          >
            <svg className={cn('w-10 h-10', isDark ? 'text-danger-400' : 'text-danger-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}
          >
            Payment Failed
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={cn('text-sm mb-8', isDark ? 'text-white/50' : 'text-surface-500')}
          >
            {reason || 'Something went wrong with your payment.'}
          </motion.p>

          {isLoading ? (
            <div className="flex justify-center">
              <div className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500 rounded-full animate-spin" />
            </div>
          ) : currentOrder ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={cn('rounded-2xl border p-6 mb-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}
            >
              <div className="flex items-center justify-between mb-4">
                <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-400')}>Order ID</p>
                <p className={cn('text-xs font-mono font-medium', isDark ? 'text-white/60' : 'text-surface-600')}>
                  #{currentOrder._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-400')}>Amount</p>
                <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>
                  {formatCurrency(currentOrder.summary?.total || 0)}
                </p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-400')}>Payment Method</p>
                <p className={cn('text-xs font-medium capitalize', isDark ? 'text-white/60' : 'text-surface-600')}>
                  {currentOrder.payment?.method || 'Razorpay'}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-400')}>Status</p>
                <span className={cn('px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider', isDark ? 'bg-danger-500/15 text-danger-400' : 'bg-danger-50 text-danger-600')}>
                  {currentOrder.payment?.status || 'Failed'}
                </span>
              </div>
            </motion.div>
          ) : null}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3"
          >
            {currentOrder && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetryPayment}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all"
              >
                Try Again
              </motion.button>
            )}

            <Link to={ROUTES.CHECKOUT}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full py-3.5 rounded-xl font-bold text-sm transition-all',
                  isDark
                    ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1]'
                    : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                )}
              >
                Back to Checkout
              </motion.button>
            </Link>

            <Link to={ROUTES.HOME}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full py-3.5 rounded-xl font-bold text-sm transition-all',
                  isDark
                    ? 'bg-white/[0.04] text-white/40 hover:bg-white/[0.06]'
                    : 'bg-surface-50 text-surface-400 hover:bg-surface-100'
                )}
              >
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
