import { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useDarkMode } from '../hooks';
import { cn, formatCurrency } from '../utils/helpers';
import { applyCouponCode, removeCouponCode, clearCartLocal, syncCartToServer } from '../store/slices/cartSlice';
import { createOrder, verifyPayment, testPayment, initiateJazzCash, clearError, clearCurrentOrder } from '../store/slices/orderSlice';
import AddressSelector from '../components/checkout/AddressSelector';
import OrderSummary from '../components/checkout/OrderSummary';
import CouponInput from '../components/checkout/CouponInput';
import PaymentMethodSelector from '../components/checkout/PaymentMethodSelector';
import { ROUTES } from '../utils/constants';

const isDev = import.meta.env.DEV;

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
};

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, summary, couponCode } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading, isVerifying, error: orderError, razorpayOrderData, jazzcashOrderData } = useSelector((state) => state.orders);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');
  const currency = selectedPaymentMethod === 'jazzcash' ? 'PKR' : 'INR';
  const [notes, setNotes] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return () => {
      dispatch(clearError());
      dispatch(clearCurrentOrder());
    };
  }, [dispatch]);

  useEffect(() => {
    if (items.length === 0 && !isLoading && !isPlacingOrder) {
      navigate('/cart');
    }
  }, [items.length, navigate, isLoading, isPlacingOrder]);

  useEffect(() => {
    if (orderError) {
      setPaymentError(orderError);
      dispatch(clearError());
    }
  }, [orderError, dispatch]);

  const handleApplyCoupon = useCallback(async (code) => {
    const result = await dispatch(applyCouponCode(code));
    if (result.error) throw new Error(result.payload);
  }, [dispatch]);

  const handleRemoveCoupon = useCallback(() => {
    dispatch(removeCouponCode());
  }, [dispatch]);

  const handlePlaceOrder = useCallback(async () => {
    if (!selectedAddressId || !agreedToTerms || isLoading) return;
    setPaymentError(null);
    setIsPlacingOrder(true);

    const syncResult = await dispatch(syncCartToServer());
    if (syncResult.error) {
      setPaymentError('Failed to sync cart. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const result = await dispatch(createOrder({ addressId: selectedAddressId, notes }));
    if (result.error) {
      if (result.payload?.includes?.('not logged in') || result.payload?.includes?.('token')) {
        navigate('/login');
        return;
      }
      setPaymentError(result.payload || 'Failed to create order. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const orderData = result.payload;
    if (!orderData?.order) {
      setPaymentError('Invalid order response. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPaymentError('Failed to load payment gateway. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const options = {
      key: orderData.order.razorpayKeyId,
      amount: orderData.order.amount,
      currency: orderData.order.currency || 'INR',
      name: 'PizzaCraft',
      description: `Order #${orderData.order._id.slice(-8).toUpperCase()}`,
      prefill: {
        name: user?.name || '',
        contact: user?.phone || '',
      },
      theme: {
        color: isDark ? '#6366f1' : '#6366f1',
      },
      modal: {
        ondismiss: () => {
          setPaymentError('Payment was cancelled. Your order has not been placed.');
        },
      },
      handler: async (response) => {
        try {
          if (response.razorpay_order_id) {
            const verifyResult = await dispatch(verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.order._id,
            }));

            if (verifyResult.error) {
              setPaymentError('Payment verification failed. Please contact support.');
              return;
            }
          }

          const testResult = await dispatch(testPayment({ addressId: selectedAddressId, notes }));
          if (testResult.error) {
            setPaymentError('Payment completion failed. Please contact support.');
            return;
          }

          dispatch(clearCartLocal());
          navigate(ROUTES.ORDER_SUCCESS.replace(':id', orderData.order._id));
        } catch {
          setPaymentError('Payment verification failed. Please contact support.');
        }
      },
    };

    if (orderData.order.razorpayOrderId) {
      options.order_id = orderData.order.razorpayOrderId;
    }

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', async () => {
      const testResult = await dispatch(testPayment(orderData.order._id));
      if (testResult.error) {
        setPaymentError('Payment failed. Please try again.');
        setIsPlacingOrder(false);
        return;
      }
      dispatch(clearCartLocal());
      navigate(ROUTES.ORDER_SUCCESS.replace(':id', orderData.order._id));
    });
    rzp.open();
  }, [selectedAddressId, agreedToTerms, isLoading, dispatch, navigate, user, isDark, notes]);

  const handlePlaceJazzCash = useCallback(async () => {
    if (!selectedAddressId || !agreedToTerms || isLoading) return;
    setPaymentError(null);
    setIsPlacingOrder(true);

    const syncResult = await dispatch(syncCartToServer());
    if (syncResult.error) {
      setPaymentError('Failed to sync cart. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const result = await dispatch(initiateJazzCash({ addressId: selectedAddressId, notes }));
    if (result.error) {
      if (result.payload?.includes?.('not logged in') || result.payload?.includes?.('token')) {
        navigate('/login');
        return;
      }
      setPaymentError(result.payload || 'Failed to initiate JazzCash payment. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const responseData = result.payload?.data || result.payload;
    const gatewayUrl = responseData?.gatewayUrl;
    const payload = responseData?.payload;

    if (!gatewayUrl || !payload || Object.keys(payload).length === 0) {
      setPaymentError('Invalid JazzCash response. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const form = document.createElement('form');
    form.id = 'jazzcash-form';
    form.method = 'POST';
    form.action = gatewayUrl;
    form.target = '_self';
    form.acceptCharset = 'UTF-8';
    form.style.display = 'none';

    Object.entries(payload).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(value ?? '');
      form.appendChild(input);
    });

    document.body.appendChild(form);

    setTimeout(() => {
      try {
        form.submit();
      } catch {
        setPaymentError('Failed to redirect to JazzCash. Please try again.');
        setIsPlacingOrder(false);
      }
    }, 100);
  }, [selectedAddressId, agreedToTerms, isLoading, dispatch, notes]);

  const handleTestPayment = useCallback(async () => {
    if (!selectedAddressId || !agreedToTerms || isLoading) return;
    setPaymentError(null);
    setIsPlacingOrder(true);

    const syncResult = await dispatch(syncCartToServer());
    if (syncResult.error) {
      setPaymentError('Failed to sync cart. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const result = await dispatch(testPayment({ addressId: selectedAddressId, notes }));
    if (result.error) {
      setPaymentError(result.payload || 'Test payment failed. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    const orderData = result.payload;
    if (!orderData?.order?._id) {
      setPaymentError('Invalid order response. Please try again.');
      setIsPlacingOrder(false);
      return;
    }

    dispatch(clearCartLocal());
    navigate(ROUTES.ORDER_SUCCESS.replace(':id', orderData.order._id));
  }, [selectedAddressId, agreedToTerms, isLoading, dispatch, navigate, notes]);

  const isProcessing = isLoading || isVerifying;

  if (items.length === 0) {
    return (
      <div className={cn('min-h-screen flex items-center justify-center transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-500/30 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>Redirecting to cart...</p>
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
                Review your order and complete payment
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
                      ? 'bg-brand-500/15 text-brand-500 border border-brand-500/30'
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
                  <div className={cn('w-8 h-px mx-1', isDark ? 'bg-white/[0.1]' : 'bg-surface-200')} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <div className="lg:grid lg:grid-cols-[1fr_380px] lg:gap-8">
          {/* Left: Checkout Sections */}
          <motion.div {...pageTransition} className="space-y-6 pb-32 lg:pb-0">
            {/* Address Section */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
              <AddressSelector selectedAddressId={selectedAddressId} onSelect={setSelectedAddressId} />
            </div>

            {/* Coupon Section */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
              <h3 className={cn('text-sm font-display font-bold uppercase tracking-wider mb-4', isDark ? 'text-white/50' : 'text-surface-400')}>
                Have a Coupon?
              </h3>
              <CouponInput onApply={handleApplyCoupon} onRemove={handleRemoveCoupon} appliedCoupon={couponCode} discount={summary.couponDiscount} />
            </div>

            {/* Delivery Notes */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
              <h3 className={cn('text-sm font-display font-bold uppercase tracking-wider mb-4', isDark ? 'text-white/50' : 'text-surface-400')}>
                Delivery Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special instructions for delivery (e.g., ring the doorbell, leave at door)..."
                rows={3}
                maxLength={500}
                className={cn(
                  'w-full px-4 py-3 rounded-xl text-sm border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-none',
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/25'
                    : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400'
                )}
              />
            </div>

            {/* Estimated Delivery */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
              <div className="flex items-center gap-4">
                <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-brand-500/15' : 'bg-brand-50')}>
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

            {/* Payment Method */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
              <h3 className={cn('text-sm font-display font-bold uppercase tracking-wider mb-4', isDark ? 'text-white/50' : 'text-surface-400')}>
                Payment Method
              </h3>
              <PaymentMethodSelector selectedMethod={selectedPaymentMethod} onSelect={setSelectedPaymentMethod} />
            </div>

            {/* Terms */}
            <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
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

            {/* Payment Error */}
            <AnimatePresence>
              {paymentError && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={cn(
                    'rounded-2xl border p-4 flex items-start gap-3',
                    isDark ? 'border-danger-500/30 bg-danger-500/5' : 'border-danger-200 bg-danger-50'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', isDark ? 'bg-danger-500/15' : 'bg-danger-100')}>
                    <svg className={cn('w-4 h-4', isDark ? 'text-danger-400' : 'text-danger-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-sm font-medium', isDark ? 'text-danger-300' : 'text-danger-700')}>{paymentError}</p>
                  </div>
                  <button
                    onClick={() => setPaymentError(null)}
                    className={cn('p-1 rounded-lg transition-colors', isDark ? 'text-danger-400/50 hover:text-danger-400' : 'text-danger-400 hover:text-danger-600')}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden lg:block"
          >
            <div className="sticky top-24">
              <div className={cn('rounded-2xl border p-6', isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-white border-surface-200 shadow-sm')}>
                <OrderSummary items={items} summary={summary} currency={currency} />

                <div className="mt-6 space-y-3">
                  <motion.button
                    whileHover={!isProcessing ? { scale: 1.01 } : {}}
                    whileTap={!isProcessing ? { scale: 0.99 } : {}}
                    onClick={selectedPaymentMethod === 'jazzcash' ? handlePlaceJazzCash : handlePlaceOrder}
                    disabled={!selectedAddressId || !agreedToTerms || isProcessing}
                    className={cn(
                      'w-full py-4 rounded-xl font-bold text-sm transition-all duration-300',
                      selectedAddressId && agreedToTerms && !isProcessing
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
                        : isDark
                          ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                          : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        {isVerifying ? 'Verifying Payment...' : 'Processing Order...'}
                      </span>
                    ) : (
                      !selectedAddressId
                        ? 'Select a Delivery Address'
                        : !agreedToTerms
                          ? 'Agree to Terms to Continue'
                          : `Pay ${formatCurrency(summary.total, currency)}`
                    )}
                  </motion.button>

                  {isDev && (
                    <motion.button
                      whileHover={!isProcessing ? { scale: 1.01 } : {}}
                      whileTap={!isProcessing ? { scale: 0.99 } : {}}
                      onClick={handleTestPayment}
                      disabled={!selectedAddressId || !agreedToTerms || isProcessing}
                      className={cn(
                        'w-full py-3 rounded-xl font-bold text-xs transition-all duration-300 mt-2',
                        'border-2 border-dashed',
                        selectedAddressId && agreedToTerms && !isProcessing
                          ? isDark
                            ? 'border-warning-500/30 text-warning-400 hover:bg-warning-500/10'
                            : 'border-warning-300 text-warning-600 hover:bg-warning-50'
                          : isDark
                            ? 'border-white/[0.06] text-white/20 cursor-not-allowed'
                            : 'border-surface-200 text-surface-400 cursor-not-allowed'
                      )}
                    >
                      Test Payment (Skip Razorpay)
                    </motion.button>
                  )}

                  {!selectedAddressId && (
                    <p className={cn('text-[10px] text-center', isDark ? 'text-white/25' : 'text-surface-400')}>
                      Please select a delivery address to proceed
                    </p>
                  )}
                </div>

                {/* Test mode notice */}
                <div className={cn('mt-4 p-3 rounded-xl text-center', isDark ? 'bg-warning-500/5 border border-warning-500/10' : 'bg-warning-50 border border-warning-100')}>
                  <p className={cn('text-[10px] font-medium', isDark ? 'text-warning-400' : 'text-warning-600')}>
                    Test Mode — No real money will be charged
                  </p>
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
          isDark ? 'border-white/[0.06] bg-dark-950/90' : 'border-surface-200 bg-white/90'
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
              {formatCurrency(summary.total, currency)}
            </motion.p>
          </div>
          <div className="text-right">
            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Delivery</p>
            <p className={cn('text-xs font-bold', summary.deliveryFee === 0 ? 'text-success-500' : isDark ? 'text-white/70' : 'text-surface-700')}>
              {summary.deliveryFee === 0 ? 'Free' : formatCurrency(summary.deliveryFee, currency)}
            </p>
          </div>
        </div>
        <motion.button
          whileHover={!isProcessing ? { scale: 1.01 } : {}}
          whileTap={!isProcessing ? { scale: 0.99 } : {}}
          onClick={selectedPaymentMethod === 'jazzcash' ? handlePlaceJazzCash : handlePlaceOrder}
          disabled={!selectedAddressId || !agreedToTerms || isProcessing}
          className={cn(
            'w-full py-4 rounded-xl font-bold text-sm transition-all',
            selectedAddressId && agreedToTerms && !isProcessing
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
              : isDark
                ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                : 'bg-surface-200 text-surface-400 cursor-not-allowed'
          )}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {isVerifying ? 'Verifying...' : 'Processing...'}
            </span>
          ) : (
            !selectedAddressId
              ? 'Select Address'
              : !agreedToTerms
                ? 'Agree to Terms'
                : `Pay ${formatCurrency(summary.total, currency)}`
            )}
          </motion.button>
          {isDev && (
          <motion.button
            whileHover={!isProcessing ? { scale: 1.01 } : {}}
            whileTap={!isProcessing ? { scale: 0.99 } : {}}
            onClick={handleTestPayment}
            disabled={!selectedAddressId || !agreedToTerms || isProcessing}
            className={cn(
              'w-full py-3 rounded-xl font-bold text-xs transition-all mt-2 border-2 border-dashed',
              selectedAddressId && agreedToTerms && !isProcessing
                ? isDark
                  ? 'border-warning-500/30 text-warning-400 hover:bg-warning-500/10'
                  : 'border-warning-300 text-warning-600 hover:bg-warning-50'
                : isDark
                  ? 'border-white/[0.06] text-white/20 cursor-not-allowed'
                  : 'border-surface-200 text-surface-400 cursor-not-allowed'
            )}
          >
            Test Payment (Skip Razorpay)
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}
