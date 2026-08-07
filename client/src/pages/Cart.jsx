import { useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../hooks';
import { cn, formatCurrency } from '../utils/helpers';
import {
  updateItemQtyLocal,
  removeItemLocal,
  clearCartLocal,
} from '../store/slices/cartSlice';
import CartItem from '../components/cart/CartItem';
import CartEmpty from '../components/cart/CartEmpty';
import { SIZE_OPTIONS } from '../data/pizzaBuilder';

const DELIVERY_FEE_FREE_THRESHOLD = 35;

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function Cart() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, summary, isLoading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleUpdateQty = useCallback((itemId, qty) => {
    dispatch(updateItemQtyLocal({ itemId, qty }));
  }, [dispatch]);

  const handleRemove = useCallback((itemId) => {
    dispatch(removeItemLocal(itemId));
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearCartLocal());
  }, [dispatch]);

  const handleCheckout = useCallback(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }, [isAuthenticated, navigate]);

  const deliveryProgress = Math.min((summary.subtotal / DELIVERY_FEE_FREE_THRESHOLD) * 100, 100);
  const amountToFree = Math.max(DELIVERY_FEE_FREE_THRESHOLD - summary.subtotal, 0);

  return (
    <div className={cn('min-h-screen transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div {...pageTransition} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/menu"
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                isDark ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white/60' : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </Link>
            <div>
              <h1 className={cn('text-2xl font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>
                Your Cart
              </h1>
              <p className={cn('text-xs', isDark ? 'text-white/35' : 'text-surface-400')}>
                {items.length > 0 ? `${items.length} item${items.length !== 1 ? 's' : ''} in your cart` : 'Your cart is empty'}
              </p>
            </div>
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div {...pageTransition}>
            <CartEmpty />
          </motion.div>
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
            {/* Left: Cart Items */}
            <motion.div {...pageTransition} className="pb-32 lg:pb-0">
              {/* Free delivery banner */}
              <div className={cn(
                'p-4 rounded-2xl border mb-6',
                isDark
                  ? 'bg-white/[0.02] border-white/[0.06]'
                  : 'bg-white border-surface-200'
              )}>
                {amountToFree > 0 ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>
                        Add <span className="font-bold text-brand-500">{formatCurrency(amountToFree)}</span> more for free delivery
                      </p>
                      <span className={cn('text-xs font-bold', isDark ? 'text-white/50' : 'text-surface-500')}>
                        {Math.round(deliveryProgress)}%
                      </span>
                    </div>
                    <div className={cn(
                      'h-2 rounded-full overflow-hidden',
                      isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
                    )}>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${deliveryProgress}%` }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-success-500/15 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-xs font-medium text-success-500">
                      🎉 You've unlocked free delivery!
                    </p>
                  </div>
                )}
              </div>

              {/* Cart Items */}
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItem
                      key={item._id || item.configurationId}
                      item={item}
                      onUpdateQty={handleUpdateQty}
                      onRemove={handleRemove}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-6">
                <motion.button
                  whileHover={{ x: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClear}
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isDark
                      ? 'text-danger-400 hover:bg-danger-500/10 border border-danger-500/15'
                      : 'text-danger-600 hover:bg-danger-50 border border-danger-100'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear Cart
                </motion.button>
                <Link
                  to="/menu"
                  className={cn(
                    'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all',
                    isDark
                      ? 'text-brand-400 hover:bg-brand-500/10 border border-brand-500/15'
                      : 'text-brand-600 hover:bg-brand-50 border border-brand-100'
                  )}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </motion.div>

            {/* Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="hidden lg:block"
            >
              <div className="sticky top-24">
                <div className={cn(
                  'rounded-2xl border p-6',
                  isDark
                    ? 'bg-white/[0.02] border-white/[0.06]'
                    : 'bg-white border-surface-200 shadow-sm'
                )}>
                  <h3 className={cn(
                    'text-sm font-display font-bold uppercase tracking-wider mb-4',
                    isDark ? 'text-white/50' : 'text-surface-400'
                  )}>
                    Order Summary
                  </h3>

                  <div className="space-y-2.5 mb-4">
                    <div className="flex justify-between">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Subtotal ({items.length} items)</span>
                      <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>
                        {formatCurrency(summary.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Delivery Fee</span>
                      <span className={cn(
                        'text-xs font-bold tabular-nums',
                        summary.deliveryFee === 0 ? 'text-success-500' : isDark ? 'text-white/70' : 'text-surface-700'
                      )}>
                        {summary.deliveryFee === 0 ? 'Free' : formatCurrency(summary.deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Tax (8%)</span>
                      <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>
                        {formatCurrency(summary.tax)}
                      </span>
                    </div>
                    {summary.couponDiscount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-xs font-medium text-success-500">Discount</span>
                        <span className="text-xs font-bold tabular-nums text-success-500">
                          -{formatCurrency(summary.couponDiscount)}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className={cn(
                    'border-t pt-3 mb-6',
                    isDark ? 'border-white/[0.06]' : 'border-surface-100'
                  )}>
                    <div className="flex justify-between items-baseline">
                      <span className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>Grand Total</span>
                      <motion.span
                        key={summary.total}
                        initial={{ scale: 1.08 }}
                        animate={{ scale: 1 }}
                        className={cn('text-lg font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}
                      >
                        {formatCurrency(summary.total)}
                      </motion.span>
                    </div>
                  </div>

                  {/* Estimated Delivery */}
                  <div className={cn(
                    'flex items-center gap-3 p-3 rounded-xl mb-6',
                    isDark ? 'bg-white/[0.04]' : 'bg-surface-50'
                  )}>
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                      isDark ? 'bg-brand-500/15' : 'bg-brand-50'
                    )}>
                      <svg className={cn('w-4 h-4', isDark ? 'text-brand-400' : 'text-brand-600')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Estimated Delivery</p>
                      <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>
                        {summary.maxPrepTime + 15}–{summary.maxPrepTime + 30} min
                      </p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleCheckout}
                    className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Proceed to Checkout — {formatCurrency(summary.total)}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Mobile sticky checkout bar */}
        {items.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className={cn(
              'fixed bottom-0 left-0 right-0 z-40 lg:hidden',
              'border-t p-4 backdrop-blur-xl',
              isDark
                ? 'border-white/[0.06] bg-dark-950/90'
                : 'border-surface-200 bg-white/90'
            )}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Total</p>
                <motion.p
                  key={summary.total}
                  initial={{ scale: 1.05 }}
                  animate={{ scale: 1 }}
                  className={cn('text-lg font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}
                >
                  {formatCurrency(summary.total)}
                </motion.p>
              </div>
              <div className="text-right">
                <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Delivery</p>
                <p className={cn('text-xs font-bold', summary.deliveryFee === 0 ? 'text-success-500' : isDark ? 'text-white/70' : 'text-surface-700')}>
                  {summary.deliveryFee === 0 ? 'Free' : formatCurrency(summary.deliveryFee)}
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25"
            >
              Proceed to Checkout
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
