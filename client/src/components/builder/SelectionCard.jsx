import { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { useDarkMode } from '../../hooks';
import { formatCurrency } from '../../utils/helpers';

function SelectionCard({ option, selected, onClick, disabled, multiSelect, maxReached }) {
  const { isDark } = useDarkMode();
  const isSelected = selected;

  return (
    <motion.button
      type="button"
      onClick={() => !disabled && onClick(option.id)}
      disabled={disabled && !isSelected}
      whileHover={{ scale: disabled && !isSelected ? 1 : 1.02, y: disabled && !isSelected ? 0 : -4 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-300 overflow-hidden group',
        isSelected
          ? isDark
            ? 'border-brand-500 bg-brand-500/10 shadow-lg shadow-brand-500/20'
            : 'border-brand-500 bg-brand-50 shadow-lg shadow-brand-500/15'
          : isDark
            ? 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12] hover:bg-white/[0.06]'
            : 'border-surface-200 bg-white hover:border-surface-300 hover:shadow-md',
        (disabled && !isSelected) && 'opacity-40 cursor-not-allowed',
        maxReached && !isSelected && 'opacity-50 cursor-not-allowed'
      )}
    >
      {isSelected && (
        <motion.div
          layoutId="selection-ring"
          className="absolute inset-0 rounded-2xl border-2 border-brand-500 pointer-events-none"
          initial={false}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}

      <div className="absolute top-3 right-3">
        <motion.div
          initial={false}
          animate={isSelected ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          className={cn(
            'w-7 h-7 rounded-full flex items-center justify-center',
            'bg-gradient-to-br from-brand-500 to-brand-600 shadow-lg shadow-brand-500/30'
          )}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      </div>

      <div className="flex items-start gap-4">
        <motion.div
          animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0',
            isSelected
              ? isDark ? 'bg-brand-500/20' : 'bg-brand-100'
              : isDark ? 'bg-white/[0.06]' : 'bg-surface-100',
            'transition-colors duration-300'
          )}
        >
          {option.emoji}
        </motion.div>

        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              'font-display font-bold text-sm',
              isDark ? 'text-white' : 'text-surface-900'
            )}>
              {option.name}
            </h3>
            {option.tags && option.tags[0] && (
              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full',
                isDark ? 'bg-white/[0.06] text-white/40' : 'bg-surface-100 text-surface-500'
              )}>
                {option.tags[0]}
              </span>
            )}
          </div>
          <p className={cn(
            'text-xs leading-relaxed mb-2',
            isDark ? 'text-white/40' : 'text-surface-500'
          )}>
            {option.description}
          </p>
          <div className="flex items-center gap-3">
            {option.price > 0 && (
              <span className={cn(
                'text-xs font-bold',
                isDark ? 'text-accent-400' : 'text-accent-600'
              )}>
                +{formatCurrency(option.price)}
              </span>
            )}
            {option.price === 0 && (
              <span className={cn(
                'text-xs font-semibold',
                isDark ? 'text-success-400' : 'text-success-600'
              )}>
                Included
              </span>
            )}
            {option.prepTime && (
              <span className={cn(
                'text-[10px]',
                isDark ? 'text-white/30' : 'text-surface-400'
              )}>
                {option.prepTime} min
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={cn(
        'absolute inset-x-0 bottom-0 h-[2px] transition-all duration-500',
        isSelected
          ? 'bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500'
          : 'bg-transparent'
      )} />
    </motion.button>
  );
}

export default memo(SelectionCard);
