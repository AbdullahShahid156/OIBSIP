import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../hooks';
import { cn, formatCurrency, formatDate } from '../utils/helpers';
import { getOrder, clearCurrentOrder } from '../store/slices/orderSlice';
import { ROUTES } from '../utils/constants';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

const statusConfig = {
  confirmed: {
    label: 'Order Confirmed',
    color: 'text-success-500',
    bgColor: 'bg-success-500/10',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  pending: {
    label: 'Payment Pending',
    color: 'text-warning-500',
    bgColor: 'bg-warning-500/10',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  failed: {
    label: 'Payment Failed',
    color: 'text-danger-500',
    bgColor: 'bg-danger-500/10',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
};

export default function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useDarkMode();
  const { currentOrder, isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(getOrder(id));
    }
    return () => dispatch(clearCurrentOrder());
  }, [id, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLoading) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !currentOrder) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
        <div className="text-center max-w-md mx-auto px-4">
          <div className={cn('w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4', isDark ? 'bg-danger-500/10' : 'bg-danger-50')}>
            <svg className={cn('w-8 h-8', isDark ? 'text-danger-400' : 'text-danger-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className={cn('text-xl font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}>Order Not Found</h2>
          <p className={cn('text-sm mb-6', isDark ? 'text-white/40' : 'text-surface-500')}>
            {error || 'The order you are looking for does not exist.'}
          </p>
          <Link
            to={ROUTES.ORDERS}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const status = statusConfig[currentOrder.status] || statusConfig.pending;

  return (
    <div className={cn('min-h-screen transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Success header */}
        <motion.div {...pageTransition} className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className={cn('w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-6', status.bgColor)}
          >
            <span className={status.color}>{status.icon}</span>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}
          >
            {status.label}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}
          >
            Order #{currentOrder._id.slice(-8).toUpperCase()}
          </motion.p>
        </motion.div>

        {/* Order details card */}
        <motion.div
          {...pageTransition}
          transition={{ delay: 0.5 }}
          className={cn('rounded-2xl border overflow-hidden mb-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}
        >
          {/* Order items */}
          <div className="p-6">
            <h3 className={cn('text-sm font-display font-bold uppercase tracking-wider mb-4', isDark ? 'text-white/50' : 'text-surface-400')}>
              Order Items
            </h3>
            <div className="space-y-3">
              {currentOrder.items?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={cn('w-12 h-12 rounded-xl overflow-hidden flex-shrink-0', isDark ? 'bg-white/[0.04]' : 'bg-surface-100')}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg">🍕</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn('text-sm font-medium truncate', isDark ? 'text-white' : 'text-surface-900')}>{item.name}</p>
                    <p className={cn('text-xs', isDark ? 'text-white/35' : 'text-surface-400')}>
                      {item.size} • Qty: {item.qty}
                    </p>
                  </div>
                  <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>
                    {formatCurrency(item.totalPrice)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className={cn('border-t p-6 space-y-2', isDark ? 'border-white/[0.06]' : 'border-surface-100')}>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-white/40' : 'text-surface-500'}>Subtotal</span>
              <span className={cn('tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>{formatCurrency(currentOrder.summary?.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-white/40' : 'text-surface-500'}>Delivery</span>
              <span className={cn('tabular-nums', currentOrder.summary?.deliveryFee === 0 ? 'text-success-500' : isDark ? 'text-white/70' : 'text-surface-700')}>
                {currentOrder.summary?.deliveryFee === 0 ? 'Free' : formatCurrency(currentOrder.summary?.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className={isDark ? 'text-white/40' : 'text-surface-500'}>Tax</span>
              <span className={cn('tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>{formatCurrency(currentOrder.summary?.tax)}</span>
            </div>
            {currentOrder.summary?.couponDiscount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-success-500">Coupon Discount</span>
                <span className="text-success-500 tabular-nums">-{formatCurrency(currentOrder.summary.couponDiscount)}</span>
              </div>
            )}
            <div className={cn('flex justify-between text-base font-bold pt-2 border-t', isDark ? 'border-white/[0.06] text-white' : 'border-surface-100 text-surface-900')}>
              <span>Total</span>
              <span className="tabular-nums">{formatCurrency(currentOrder.summary?.total)}</span>
            </div>
          </div>
        </motion.div>

        {/* Delivery address */}
        <motion.div
          {...pageTransition}
          transition={{ delay: 0.6 }}
          className={cn('rounded-2xl border p-6 mb-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}
        >
          <h3 className={cn('text-sm font-display font-bold uppercase tracking-wider mb-3', isDark ? 'text-white/50' : 'text-surface-400')}>
            Delivery Address
          </h3>
          <p className={cn('text-sm font-medium mb-1', isDark ? 'text-white' : 'text-surface-900')}>
            {currentOrder.address?.recipientName}
          </p>
          <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
            {currentOrder.address?.houseFlat && <>{currentOrder.address.houseFlat}, </>}
            {currentOrder.address?.street && <>{currentOrder.address.street}, </>}
            {currentOrder.address?.area && <>{currentOrder.address.area}, </>}
            {currentOrder.address?.city}
            {currentOrder.address?.postalCode && ` ${currentOrder.address.postalCode}`}
          </p>
          {currentOrder.address?.phone && (
            <p className={cn('text-xs mt-1', isDark ? 'text-white/25' : 'text-surface-400')}>{currentOrder.address.phone}</p>
          )}
        </motion.div>

        {/* Estimated delivery */}
        {currentOrder.status === 'confirmed' && (
          <motion.div
            {...pageTransition}
            transition={{ delay: 0.7 }}
            className={cn('rounded-2xl border p-6 mb-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}
          >
            <div className="flex items-center gap-4">
              <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-brand-500/15' : 'bg-brand-50')}>
                <svg className={cn('w-6 h-6', isDark ? 'text-brand-400' : 'text-brand-600')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Estimated Delivery</p>
                <p className={cn('text-lg font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>
                  {currentOrder.estimatedDelivery?.min}–{currentOrder.estimatedDelivery?.max} minutes
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div {...pageTransition} transition={{ delay: 0.8 }} className="flex gap-3">
          <Link
            to={ROUTES.ORDERS}
            className={cn(
              'flex-1 py-3 rounded-xl text-sm font-semibold text-center transition-all',
              isDark
                ? 'bg-white/[0.04] text-white/50 hover:bg-white/[0.08] border border-white/[0.06]'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200 border border-surface-200'
            )}
          >
            View All Orders
          </Link>
          <Link
            to={ROUTES.MENU}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-center bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 transition-all duration-300"
          >
            Order More Pizza
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
