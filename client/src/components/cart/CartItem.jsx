import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn, formatCurrency } from '../../utils/helpers';
import { SIZE_OPTIONS } from '../../data/pizzaBuilder';

const CartItem = memo(function CartItem({ item, onUpdateQty, onRemove }) {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();

  const sizeObj = SIZE_OPTIONS.find((s) => s.id === item.size);
  const veggieNames = item.veggieNames ? Object.values(item.veggieNames) : [];
  const veggieQty = item.veggies ? Object.entries(item.veggies) : [];

  const handleIncrement = useCallback(() => {
    if (item.qty < 10) onUpdateQty(item._id, item.qty + 1);
  }, [item._id, item.qty, onUpdateQty]);

  const handleDecrement = useCallback(() => {
    if (item.qty > 1) onUpdateQty(item._id, item.qty - 1);
    else onRemove(item._id);
  }, [item._id, item.qty, onUpdateQty, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.92 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'group relative flex gap-4 p-3 rounded-2xl border transition-all duration-300',
        isDark
          ? 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04]'
          : 'bg-white border-surface-100 hover:border-surface-200 hover:shadow-sm'
      )}
    >
      {/* Image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden flex-shrink-0">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className={cn(
            'w-full h-full flex items-center justify-center',
            isDark
              ? 'bg-gradient-to-br from-brand-500/15 to-brand-600/10'
              : 'bg-gradient-to-br from-brand-100 to-brand-50'
          )}>
            <span className="text-3xl">🍕</span>
          </div>
        )}
        {item.isCustomized && (
          <div className="absolute top-1 left-1">
            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-md bg-brand-500/90 text-white backdrop-blur-sm">
              Custom
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className={cn(
              'text-sm font-display font-semibold truncate',
              isDark ? 'text-white' : 'text-surface-900'
            )}>
              {item.name}
            </h4>
            <p className={cn(
              'text-xs mt-0.5 truncate',
              isDark ? 'text-white/35' : 'text-surface-400'
            )}>
              {sizeObj?.name} ({sizeObj?.inches}) · {item.baseName || item.base}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRemove(item._id)}
            className={cn(
              'p-1.5 rounded-lg transition-all duration-200 flex-shrink-0 opacity-0 group-hover:opacity-100',
              isDark
                ? 'text-white/30 hover:text-danger-400 hover:bg-danger-500/10'
                : 'text-surface-400 hover:text-danger-500 hover:bg-danger-50'
            )}
            aria-label={`Remove ${item.name} from cart`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>

        {/* Customization tags */}
        {item.isCustomized && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {item.sauceName && (
              <span className={cn(
                'px-1.5 py-0.5 text-[10px] font-medium rounded-md',
                isDark ? 'bg-white/[0.06] text-white/50' : 'bg-surface-100 text-surface-500'
              )}>
                {item.sauceName}
              </span>
            )}
            {item.cheeseName && (
              <span className={cn(
                'px-1.5 py-0.5 text-[10px] font-medium rounded-md',
                isDark ? 'bg-white/[0.06] text-white/50' : 'bg-surface-100 text-surface-500'
              )}>
                {item.cheeseName}
              </span>
            )}
            {veggieNames.slice(0, 3).map((name, i) => (
              <span key={i} className={cn(
                'px-1.5 py-0.5 text-[10px] font-medium rounded-md',
                isDark ? 'bg-white/[0.06] text-white/50' : 'bg-surface-100 text-surface-500'
              )}>
                {name}
              </span>
            ))}
            {veggieNames.length > 3 && (
              <span className={cn(
                'px-1.5 py-0.5 text-[10px] font-medium rounded-md',
                isDark ? 'bg-brand-500/15 text-brand-400' : 'bg-brand-50 text-brand-600'
              )}>
                +{veggieNames.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Price & Qty Controls */}
        <div className="flex items-center justify-between mt-2">
          <motion.span
            key={item.totalPrice}
            initial={{ scale: 1.1, color: isDark ? '#F97316' : '#EA580C' }}
            animate={{ scale: 1, color: isDark ? '#ffffff' : '#0B0F14' }}
            transition={{ duration: 0.4 }}
            className={cn(
              'text-sm font-bold tabular-nums',
              isDark ? 'text-white' : 'text-surface-900'
            )}
          >
            {formatCurrency(item.totalPrice)}
          </motion.span>

          <div className={cn(
            'flex items-center gap-0.5 rounded-xl border p-0.5',
            isDark
              ? 'bg-white/[0.04] border-white/[0.08]'
              : 'bg-surface-50 border-surface-200'
          )}>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleDecrement}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                isDark
                  ? 'text-white/50 hover:text-white hover:bg-white/[0.08]'
                  : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
              )}
              aria-label={item.qty <= 1 ? 'Remove item' : 'Decrease quantity'}
            >
              {item.qty <= 1 ? (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                </svg>
              )}
            </motion.button>
            <motion.span
              key={item.qty}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                'w-7 text-center text-xs font-bold tabular-nums',
                isDark ? 'text-white' : 'text-surface-900'
              )}
            >
              {item.qty}
            </motion.span>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={handleIncrement}
              disabled={item.qty >= 10}
              className={cn(
                'w-7 h-7 rounded-lg flex items-center justify-center transition-colors',
                item.qty >= 10 ? 'opacity-30 cursor-not-allowed' : '',
                isDark
                  ? 'text-white/50 hover:text-white hover:bg-white/[0.08]'
                  : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
              )}
              aria-label="Increase quantity"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

export default CartItem;
