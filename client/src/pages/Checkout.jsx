import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../hooks';
import { cn, formatCurrency } from '../utils/helpers';
import { applyCouponCode, removeCouponCode } from '../store/slices/cartSlice';
import AddressSelector from '../components/checkout/AddressSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import CouponInput from '../components/checkout/CouponInput';
import { Spinner } from '../components/ui';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

export default function Checkout() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, summary, couponCode } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPaymentToast, setShowPaymentToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleApplyCoupon = useCallback(async (code) => {
    const result = await dispatch(applyCouponCode(code));
    if (result.error) throw new Error(result.payload);
  }, [dispatch]);

  const handleRemoveCoupon = useCallback(() => {
    dispatch(removeCouponCode());
  }, [dispatch]);

  const handlePlaceOrder = useCallback(() => {
    setShowPaymentToast(true);
    setTimeout(() => setShowPaymentToast(false), 4000);
  }, []);

  if (items.length === 0) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
        <div className="text-center">
          <Spinner size="lg" />
          <p className={cn('text-sm mt-4', isDark ? 'text-white/40' : 'text-surface-500')}>Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('min-h-screen transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <motion.div {...pageTransition} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Link
              to="/cart"
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
                Checkout
              </h1>
              <p className={cn('text-xs', isDark ? 'text-white/35' : 'text-surface-400')}>
                Review your order and complete checkout
              </p>
            </div>
          </div>

          {/* Progress steps */}
          <div className="flex items-center gap-2 mt-6">
            {['Cart', 'Checkout', 'Payment'].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold',
                  i < 2
                    ? 'bg-brand-500 text-white'
                    : i === 2
                      ? isDark
                        ? 'bg-white/[0.06] text-white/30 border border-white/[0.1]'
                        : 'bg-surface-100 text-surface-400 border border-surface-200'
                      : isDark
                        ? 'bg-white/[0.04] text-white/20'
                        : 'bg-surface-50 text-surface-300'
                )}>
                  {i < 2 ? (
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={cn(
                  'text-xs font-medium hidden sm:inline',
                  i <= 2 ? isDark ? 'text-white/50' : 'text-surface-500' : isDark ? 'text-white/20' : 'text-surface-300'
                )}>
                  {step}
                </span>
                {i < 2 && (
                  <div className={cn(
                    'w-8 h-px mx-1',
                    isDark ? 'bg-white/[0.1]' : 'bg-surface-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left: Checkout Sections */}
          <motion.div {...pageTransition} className="space-y-6 pb-32 lg:pb-0">
            {/* Address Section */}
            <div className={cn(
              'rounded-2xl border p-6',
              isDark
                ? 'bg-white/[0.02] border-white/[0.06]'
                : 'bg-white border-surface-200 shadow-sm'
            )}>
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelect={setSelectedAddressId}
              />
            </div>

            {/* Coupon Section */}
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
                Have a Coupon?
              </h3>
              <CouponInput
                onApply={handleApplyCoupon}
                onRemove={handleRemoveCoupon}
                appliedCoupon={couponCode}
                discount={summary.couponDiscount}
              />
            </div>

            {/* Delivery Notes */}
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
                Delivery Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions for delivery (e.g., ring the doorbell, leave at door)..."
                rows={3}
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/25'
                    : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
                )}
              />
            </div>

            {/* Estimated Delivery */}
            <div className={cn(
              'rounded-2xl border p-6',
              isDark
                ? 'bg-white/[0.02] border-white/[0.06]'
                : 'bg-white border-surface-200 shadow-sm'
            )}>
              <div className="flex items-center gap-4">
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                  isDark ? 'bg-brand-500/15' : 'bg-brand-50'
                )}>
                  <svg className={cn('w-6 h-6', isDark ? 'text-brand-400' : 'text-brand-600')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Estimated Delivery</p>
                  <p className={cn('text-lg font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>
                    {summary.maxPrepTime + 15}–{summary.maxPrepTime + 30} minutes
                  </p>
                  <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-surface-400')}>
                    Preparation: ~{summary.maxPrepTime} min + Delivery: ~15–30 min
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Placeholder */}
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
                Payment Method
              </h3>
              <div className={cn(
                'flex items-center gap-4 p-4 rounded-xl border-2 border-dashed',
                isDark
                  ? 'border-white/[0.08] bg-white/[0.02]'
                  : 'border-surface-200 bg-surface-50'
              )}>
                <div className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center',
                  isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
                )}>
                  <svg className={cn('w-5 h-5', isDark ? 'text-white/30' : 'text-surface-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                  </svg>
                </div>
                <div>
                  <p className={cn('text-sm font-medium', isDark ? 'text-white/50' : 'text-surface-500')}>
                    Payment integration coming soon
                  </p>
                  <p className={cn('text-[10px]', isDark ? 'text-white/25' : 'text-surface-400')}>
                    Razorpay will be integrated in the next phase
                  </p>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className={cn(
              'rounded-2xl border p-6',
              isDark
                ? 'bg-white/[0.02] border-white/[0.06]'
                : 'bg-white border-surface-200 shadow-sm'
            )}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className={cn(
                    'w-5 h-5 mt-0.5 rounded border-2 text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 cursor-pointer transition-all',
                    isDark ? 'border-white/20 bg-dark-850' : 'border-surface-300 bg-white'
                  )}
                />
                <div>
                  <p className={cn('text-sm font-medium', isDark ? 'text-white/60' : 'text-surface-600')}>
                    I agree to the terms and conditions
                  </p>
                  <p className={cn('text-[10px] mt-1', isDark ? 'text-white/25' : 'text-surface-400')}>
                    By placing this order, you agree to our{' '}
                    <span className={cn('font-medium', isDark ? 'text-brand-400' : 'text-brand-600')}>Terms of Service</span> and{' '}
                    <span className={cn('font-medium', isDark ? 'text-brand-400' : 'text-brand-600')}>Privacy Policy</span>.
                  </p>
                </div>
              </label>
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
                <OrderSummary items={items} summary={summary} />

                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handlePlaceOrder}
                    disabled={!selectedAddressId || !agreedToTerms}
                    className={cn(
                      'w-full py-4 rounded-xl font-bold text-sm transition-all duration-300',
                      selectedAddressId && agreedToTerms
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
                        : isDark
                          ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                          : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                    )}
                  >
                    {!selectedAddressId
                      ? 'Select a Delivery Address'
                      : !agreedToTerms
                        ? 'Agree to Terms to Continue'
                        : `Place Order — ${formatCurrency(summary.total)}`
                    }
                  </motion.button>

                  {!selectedAddressId && (
                    <p className={cn('text-[10px] text-center', isDark ? 'text-white/25' : 'text-surface-400')}>
                      Please select a delivery address to proceed
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile sticky checkout bar */}
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
            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Grand Total</p>
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
          onClick={handlePlaceOrder}
          disabled={!selectedAddressId || !agreedToTerms}
          className={cn(
            'w-full py-4 rounded-xl font-bold text-sm transition-all',
            selectedAddressId && agreedToTerms
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
              : isDark
                ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                : 'bg-surface-200 text-surface-400 cursor-not-allowed'
          )}
        >
          {!selectedAddressId
            ? 'Select Address'
            : !agreedToTerms
              ? 'Agree to Terms'
              : `Place Order — ${formatCurrency(summary.total)}`
          }
        </motion.button>
      </motion.div>

      {/* Payment info toast */}
      <AnimatePresence>
        {showPaymentToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={cn(
              'fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-2rem)]',
              'px-5 py-4 rounded-2xl border shadow-2xl backdrop-blur-xl',
              isDark
                ? 'bg-dark-900/95 border-white/[0.08] shadow-black/40'
                : 'bg-white/95 border-surface-200 shadow-black/10'
            )}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                isDark ? 'bg-brand-500/15' : 'bg-brand-50'
              )}>
                <svg className={cn('w-5 h-5', isDark ? 'text-brand-400' : 'text-brand-600')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', isDark ? 'text-white' : 'text-surface-900')}>Payment Coming Soon</p>
                <p className={cn('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-surface-500')}>
                  Payment integration will be available in the next phase. Your order summary is ready!
                </p>
              </div>
              <button
                onClick={() => setShowPaymentToast(false)}
                className={cn(
                  'p-1 rounded-lg transition-colors flex-shrink-0',
                  isDark ? 'text-white/30 hover:text-white/60' : 'text-surface-400 hover:text-surface-600'
                )}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
