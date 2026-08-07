import { memo } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn, formatCurrency } from '../../utils/helpers';
import { SIZE_OPTIONS } from '../../data/pizzaBuilder';

const OrderSummary = memo(function OrderSummary({ items, summary }) {
  const { isDark } = useDarkMode();

  return (
    <div>
      <h3 className={cn(
        'text-sm font-display font-bold uppercase tracking-wider mb-4',
        isDark ? 'text-white/50' : 'text-surface-400'
      )}>
        Order Summary
      </h3>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-surface-200 dark:scrollbar-thumb-white/10 pr-1">
        {items.map((item) => {
          const sizeObj = SIZE_OPTIONS.find((s) => s.id === item.size);
          return (
            <div key={item._id || item.configurationId} className="flex gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className={cn(
                    'w-full h-full flex items-center justify-center text-xl',
                    isDark ? 'bg-white/[0.06]' : 'bg-surface-100'
                  )}>
                    🍕
                  </div>
                )}
                <div className={cn(
                  'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold',
                  isDark ? 'bg-brand-500 text-white' : 'bg-brand-500 text-white'
                )}>
                  {item.qty}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-xs font-semibold truncate', isDark ? 'text-white' : 'text-surface-900')}>
                  {item.name}
                </p>
                <p className={cn('text-[10px] truncate', isDark ? 'text-white/30' : 'text-surface-400')}>
                  {sizeObj?.name} · {item.baseName || item.base}
                </p>
                {item.isCustomized && (
                  <div className="flex gap-1 mt-1">
                    {item.sauceName && (
                      <span className={cn('text-[9px] px-1 py-0.5 rounded', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-surface-100 text-surface-500')}>
                        {item.sauceName}
                      </span>
                    )}
                    {item.cheeseName && (
                      <span className={cn('text-[9px] px-1 py-0.5 rounded', isDark ? 'bg-white/[0.06] text-white/40' : 'bg-surface-100 text-surface-500')}>
                        {item.cheeseName}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <span className={cn('text-xs font-bold tabular-nums flex-shrink-0', isDark ? 'text-white/70' : 'text-surface-700')}>
                {formatCurrency(item.totalPrice)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className={cn(
        'border-t pt-3 space-y-2',
        isDark ? 'border-white/[0.06]' : 'border-surface-100'
      )}>
        <div className="flex justify-between">
          <span className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>Item Total</span>
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
            <span className="text-xs font-medium text-success-500">Coupon Discount</span>
            <span className="text-xs font-bold tabular-nums text-success-500">
              -{formatCurrency(summary.couponDiscount)}
            </span>
          </div>
        )}
        <div className={cn(
          'border-t pt-2 flex justify-between',
          isDark ? 'border-white/[0.06]' : 'border-surface-100'
        )}>
          <span className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>Grand Total</span>
          <motion.span
            key={summary.total}
            initial={{ scale: 1.08, color: isDark ? '#F97316' : '#EA580C' }}
            animate={{ scale: 1, color: isDark ? '#ffffff' : '#0B0F14' }}
            transition={{ duration: 0.4 }}
            className={cn('text-sm font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}
          >
            {formatCurrency(summary.total)}
          </motion.span>
        </div>
      </div>
    </div>
  );
});

export default OrderSummary;
