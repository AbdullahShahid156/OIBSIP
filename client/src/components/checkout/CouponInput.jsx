import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';

export default function CouponInput({ onApply, onRemove, appliedCoupon, discount }) {
  const { isDark } = useDarkMode();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('');

  const handleApply = useCallback(async () => {
    if (!code.trim()) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      await onApply(code.trim());
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err?.message || 'Invalid coupon code');
    }
  }, [code, onApply]);

  const handleRemove = useCallback(() => {
    onRemove();
    setCode('');
    setStatus('idle');
    setErrorMsg('');
  }, [onRemove]);

  if (appliedCoupon) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'flex items-center justify-between p-3 rounded-xl border',
          isDark
            ? 'bg-success-500/10 border-success-500/20'
            : 'bg-success-50 border-success-200'
        )}
      >
        <div className="flex items-center gap-2.5">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isDark ? 'bg-success-500/20' : 'bg-success-100'
          )}>
            <svg className="w-4 h-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className={cn('text-xs font-bold', isDark ? 'text-success-400' : 'text-success-600')}>
              {appliedCoupon}
            </p>
            <p className={cn('text-[10px]', isDark ? 'text-white/30' : 'text-surface-400')}>
              Discount applied
            </p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRemove}
          className={cn(
            'p-1.5 rounded-lg transition-colors',
            isDark
              ? 'text-white/30 hover:text-white/60 hover:bg-white/[0.06]'
              : 'text-surface-400 hover:text-surface-600 hover:bg-surface-100'
          )}
          aria-label="Remove coupon"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            value={code}
            onChange={(e) => { setCode(e.target.value.toUpperCase()); setStatus('idle'); setErrorMsg(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleApply()}
            placeholder="Enter coupon code"
            className={cn(
              'w-full px-4 py-3 rounded-xl text-sm font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-brand-500/50',
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-white placeholder-white/25'
                : 'bg-surface-50 border-surface-200 text-surface-900 placeholder-surface-400',
              status === 'error' && 'border-danger-500/50 focus:ring-danger-500/50'
            )}
          />
          {status === 'loading' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleApply}
          disabled={!code.trim() || status === 'loading'}
          className={cn(
            'px-5 py-3 rounded-xl text-sm font-bold transition-all',
            code.trim()
              ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-md shadow-brand-500/20 hover:shadow-brand-500/30'
              : isDark
                ? 'bg-white/[0.04] text-white/20 cursor-not-allowed'
                : 'bg-surface-100 text-surface-400 cursor-not-allowed'
          )}
        >
          Apply
        </motion.button>
      </div>

      <AnimatePresence>
        {status === 'error' && errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="text-xs text-danger-500 mt-2 font-medium"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <p className={cn('text-[10px] mt-2', isDark ? 'text-white/20' : 'text-surface-400')}>
        Try: WELCOME10, SAVE5, PIZZA20
      </p>
    </div>
  );
}
