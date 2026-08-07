import { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode, useMediaQuery } from '../../hooks';
import { cn, formatCurrency } from '../../utils/helpers';
import {
  closeDrawer,
  updateItemQtyLocal,
  removeItemLocal,
  clearCartLocal,
} from '../../store/slices/cartSlice';
import CartItem from './CartItem';
import CartEmpty from './CartEmpty';

const DELIVERY_FEE_FREE_THRESHOLD = 35;

export default function CartDrawer() {
  const { isDark } = useDarkMode();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const drawerRef = useRef(null);
  const { isDrawerOpen, items, summary } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const close = useCallback(() => dispatch(closeDrawer()), [dispatch]);

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') close(); };
    if (isDrawerOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isDrawerOpen, close]);

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
    close();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  }, [close, isAuthenticated, navigate]);

  const handleViewCart = useCallback(() => {
    close();
    navigate('/cart');
  }, [close, navigate]);

  const deliveryProgress = Math.min((summary.subtotal / DELIVERY_FEE_FREE_THRESHOLD) * 100, 100);
  const amountToFree = Math.max(DELIVERY_FEE_FREE_THRESHOLD - summary.subtotal, 0);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
            onClick={close}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 35, mass: 0.8 }}
            className={cn(
              'fixed right-0 top-0 bottom-0 z-50 flex flex-col',
              isMobile ? 'w-full' : 'w-[420px]',
              isDark
                ? 'bg-dark-950/98 backdrop-blur-3xl border-l border-white/[0.06]'
                : 'bg-white/98 backdrop-blur-3xl border-l border-surface-200'
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Shopping cart"
          >
            {/* Header */}
            <div className={cn(
              'flex items-center justify-between px-6 py-5 border-b flex-shrink-0',
              isDark ? 'border-white/[0.06]' : 'border-surface-100'
            )}>
              <div className="flex items-center gap-3">
                <h2 className={cn(
                  'text-lg font-display font-bold',
                  isDark ? 'text-white' : 'text-surface-900'
                )}>
                  Your Cart
                </h2>
                {items.length > 0 && (
                  <motion.span
                    key={items.length}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={cn(
                      'px-2.5 py-0.5 text-xs font-bold rounded-full',
                      isDark
                        ? 'bg-brand-500/15 text-brand-400'
                        : 'bg-brand-50 text-brand-600'
                    )}
                  >
                    {items.length}
                  </motion.span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={close}
                className={cn(
                  'p-2 rounded-xl transition-colors',
                  isDark
                    ? 'text-white/40 hover:text-white hover:bg-white/[0.06]'
                    : 'text-surface-400 hover:text-surface-900 hover:bg-surface-100'
                )}
                aria-label="Close cart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>

            {/* Free delivery progress */}
            {items.length > 0 && (
              <div className={cn(
                'px-6 py-3 border-b flex-shrink-0',
                isDark ? 'border-white/[0.04]' : 'border-surface-50'
              )}>
                {amountToFree > 0 ? (
                  <p className={cn('text-xs text-center', isDark ? 'text-white/40' : 'text-surface-500')}>
                    Add <span className="font-bold text-brand-500">{formatCurrency(amountToFree)}</span> more for{' '}
                    <span className="font-bold text-success-500">free delivery</span>
                  </p>
                ) : (
                  <p className="text-xs text-center font-medium text-success-500">
                    🎉 You've unlocked free delivery!
                  </p>
                )}
                <div className={cn(
                  'mt-2 h-1.5 rounded-full overflow-hidden',
                  isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
                )}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${deliveryProgress}%` }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-brand-500 to-success-500"
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin scrollbar-thumb-surface-200 dark:scrollbar-thumb-white/10">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <CartEmpty isDrawer onClose={close} />
                ) : (
                  <div className="space-y-3">
                    {items.map((item) => (
                      <CartItem
                        key={item._id || item.configurationId}
                        item={item}
                        onUpdateQty={handleUpdateQty}
                        onRemove={handleRemove}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className={cn(
                'flex-shrink-0 border-t px-6 py-5 space-y-4',
                isDark ? 'border-white/[0.06]' : 'border-surface-100'
              )}>
                {/* Price summary */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Subtotal</span>
                    <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>
                      {formatCurrency(summary.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Delivery</span>
                    <span className={cn(
                      'text-xs font-bold tabular-nums',
                      summary.deliveryFee === 0 ? 'text-success-500' : isDark ? 'text-white/70' : 'text-surface-700'
                    )}>
                      {summary.deliveryFee === 0 ? 'Free' : formatCurrency(summary.deliveryFee)}
                    </span>
                  </div>
                  <div className={cn(
                    'border-t pt-2 flex justify-between',
                    isDark ? 'border-white/[0.06]' : 'border-surface-100'
                  )}>
                    <span className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>Total</span>
                    <motion.span
                      key={summary.total}
                      initial={{ scale: 1.05, color: isDark ? '#F97316' : '#EA580C' }}
                      animate={{ scale: 1, color: isDark ? '#ffffff' : '#0B0F14' }}
                      className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}
                    >
                      {formatCurrency(summary.total)}
                    </motion.span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleCheckout}
                    className="w-full py-3.5 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Proceed to Checkout
                  </motion.button>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleViewCart}
                      className={cn(
                        'flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all',
                        isDark
                          ? 'bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                          : 'bg-surface-50 text-surface-600 hover:text-surface-900 hover:bg-surface-100 border border-surface-200'
                      )}
                    >
                      View Full Cart
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={handleClear}
                      className={cn(
                        'px-4 py-2.5 rounded-xl text-xs font-semibold transition-all',
                        isDark
                          ? 'bg-danger-500/10 text-danger-400 hover:bg-danger-500/15 border border-danger-500/15'
                          : 'bg-danger-50 text-danger-600 hover:bg-danger-100 border border-danger-100'
                      )}
                    >
                      Clear
                    </motion.button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
