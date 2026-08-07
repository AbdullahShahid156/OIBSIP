import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '../../utils/helpers';
import { useDarkMode } from '../../hooks';

function AnimatedPrice({ value, label, highlight }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  const { isDark } = useDarkMode();

  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) return;

    const duration = 400;
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
    prevRef.current = value;
  }, [value]);

  return (
    <div className="flex items-center justify-between">
      <span className={cn(
        'text-xs',
        highlight
          ? isDark ? 'font-bold text-white' : 'font-bold text-surface-900'
          : isDark ? 'text-white/50' : 'text-surface-500'
      )}>
        {label}
      </span>
      <motion.span
        key={value}
        initial={{ scale: 1.1, color: '#F97316' }}
        animate={{ scale: 1, color: highlight ? (isDark ? '#ffffff' : '#0B0F14') : (isDark ? 'rgba(255,255,255,0.7)' : 'rgba(11,15,20,0.7)') }}
        transition={{ duration: 0.3 }}
        className={cn(
          'text-xs font-bold tabular-nums',
          highlight
            ? isDark ? 'text-white' : 'text-surface-900'
            : isDark ? 'text-white/70' : 'text-surface-600'
        )}
      >
        {formatCurrency(display)}
      </motion.span>
    </div>
  );
}

export default function PricePanel({ basePrice, ingredientCost, total, prepTime, currentStep }) {
  const { isDark } = useDarkMode();

  return (
    <motion.div
      layout
      className={cn(
        'rounded-2xl border p-5',
        isDark
          ? 'border-white/[0.06] bg-white/[0.03]'
          : 'border-surface-200 bg-white'
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className={cn('font-display font-bold text-sm', isDark ? 'text-white' : 'text-surface-900')}>
          Price Breakdown
        </h3>
      </div>

      <div className="space-y-2.5">
        <AnimatedPrice value={basePrice} label="Base Price" />
        <AnimatedPrice value={ingredientCost} label="Ingredients" />

        <div className={cn('border-t my-3', isDark ? 'border-white/[0.06]' : 'border-surface-200')} />

        <AnimatedPrice value={total} label="Total" highlight />
      </div>

      <div className={cn(
        'mt-4 p-3 rounded-xl flex items-center gap-3',
        isDark ? 'bg-white/[0.04]' : 'bg-surface-50'
      )}>
        <div className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
          isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
        )}>
          <svg className={cn('w-4 h-4', isDark ? 'text-white/50' : 'text-surface-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>
            Estimated Prep
          </p>
          <p className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>
            {prepTime} minutes
          </p>
        </div>
      </div>
    </motion.div>
  );
}
