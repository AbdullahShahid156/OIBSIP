import { motion, AnimatePresence } from 'framer-motion';
import { cn, formatCurrency } from '../../../utils/helpers';
import { useDarkMode } from '../../../hooks';
import { VEGGIE_OPTIONS, MAX_VEGGIES, MAX_QTY, QTY_LEVELS, STEP_COLORS } from '../../../data/pizzaBuilder';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

function ToppingStepper({ option, qty, onSetQty, maxReached }) {
  const { isDark } = useDarkMode();
  const isSelected = qty > 0;
  const level = QTY_LEVELS.find((l) => l.qty === qty);

  const canInc = qty < MAX_QTY;
  const canDec = qty > 0;

  return (
    <motion.div
      layout
      className={cn(
        'relative w-full rounded-2xl border-2 p-4 transition-all duration-300 overflow-hidden',
        isSelected
          ? isDark
            ? 'border-brand-500/60 bg-brand-500/[0.08]'
            : 'border-brand-400 bg-brand-50'
          : isDark
            ? 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]'
            : 'border-surface-200 bg-white hover:border-surface-300',
        maxReached && !isSelected && 'opacity-40 cursor-not-allowed'
      )}
    >
      <div className="flex items-center gap-4">
        {/* Emoji icon */}
        <div className={cn(
          'w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors',
          isSelected
            ? isDark ? 'bg-brand-500/20' : 'bg-brand-100'
            : isDark ? 'bg-white/[0.06]' : 'bg-surface-100',
        )}>
          {option.emoji}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
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
            'text-xs leading-relaxed mb-1.5',
            isDark ? 'text-white/40' : 'text-surface-500'
          )}>
            {option.description}
          </p>
          <div className="flex items-center gap-2">
            {option.price > 0 && (
              <span className={cn(
                'text-xs font-bold',
                isDark ? 'text-accent-400' : 'text-accent-600'
              )}>
                {formatCurrency(option.price)} / pc
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
          </div>
        </div>

        {/* Stepper control */}
        <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
          <div className={cn(
            'flex items-center gap-0 rounded-xl border overflow-hidden',
            isDark ? 'border-white/[0.1]' : 'border-surface-200',
            isSelected && 'border-brand-500/40'
          )}>
            {/* Minus button */}
            <motion.button
              type="button"
              disabled={!canDec}
              onClick={() => onSetQty(option.id, qty - 1)}
              whileHover={canDec ? { backgroundColor: 'rgba(230,57,70,0.15)' } : {}}
              whileTap={canDec ? { scale: 0.9 } : {}}
              className={cn(
                'w-9 h-9 flex items-center justify-center text-sm font-bold transition-colors',
                canDec
                  ? isDark ? 'text-white/70 hover:text-white' : 'text-surface-600 hover:text-surface-900'
                  : isDark ? 'text-white/15' : 'text-surface-300'
              )}
            >
              −
            </motion.button>

            {/* Quantity display */}
            <div className={cn(
              'w-10 h-9 flex items-center justify-center text-sm font-bold tabular-nums border-x',
              isDark ? 'border-white/[0.08] text-white' : 'border-surface-200 text-surface-900',
            )}>
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={qty}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  {qty}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Plus button */}
            <motion.button
              type="button"
              disabled={!canInc}
              onClick={() => onSetQty(option.id, qty + 1)}
              whileHover={canInc ? { backgroundColor: 'rgba(230,57,70,0.15)' } : {}}
              whileTap={canInc ? { scale: 0.9 } : {}}
              className={cn(
                'w-9 h-9 flex items-center justify-center text-sm font-bold transition-colors',
                canInc
                  ? isDark ? 'text-white/70 hover:text-white' : 'text-surface-600 hover:text-surface-900'
                  : isDark ? 'text-white/15' : 'text-surface-300'
              )}
            >
              +
            </motion.button>
          </div>

          {/* Level label */}
          <AnimatePresence mode="wait">
            {level && (
              <motion.span
                key={level.label}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.15 }}
                className={cn('text-[10px] font-bold uppercase tracking-wider', level.color)}
              >
                {level.label}
              </motion.span>
            )}
          </AnimatePresence>

          {/* Total price for this topping */}
          {option.price > 0 && qty > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn('text-[10px] font-bold tabular-nums', isDark ? 'text-white/50' : 'text-surface-500')}
            >
              {formatCurrency(option.price * qty)}
            </motion.span>
          )}
        </div>
      </div>

      {/* Active indicator bar */}
      {isSelected && (
        <motion.div
          layoutId="stepper-active-bar"
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-500 via-accent-500 to-brand-500"
        />
      )}
    </motion.div>
  );
}

export default function VeggieStep({ veggies, onSetQty, onToggle }) {
  const { isDark } = useDarkMode();
  const colors = STEP_COLORS.veggies;
  const distinctCount = Object.keys(veggies).length;
  const totalQty = Object.values(veggies).reduce((sum, q) => sum + q, 0);

  return (
    <div>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3',
            colors.bg, colors.text
          )}
        >
          Step 4 of 5
        </motion.div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}>
              Load Your Toppings
            </h2>
            <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
              Fresh ingredients, bold flavors — adjust quantity per topping
            </p>
          </div>
          <div className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-xl',
            isDark ? 'bg-white/[0.04]' : 'bg-surface-50'
          )}>
            <div className="flex gap-0.5">
              {Array.from({ length: MAX_VEGGIES }).map((_, i) => (
                <motion.div
                  key={i}
                  animate={i < distinctCount ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={cn(
                    'w-2 h-2 rounded-full transition-colors',
                    i < distinctCount ? 'bg-success-500' : isDark ? 'bg-white/[0.08]' : 'bg-surface-200'
                  )}
                />
              ))}
            </div>
            <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/60' : 'text-surface-600')}>
              {distinctCount}/{MAX_VEGGIES}
            </span>
          </div>
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
        {VEGGIE_OPTIONS.map((option) => (
          <motion.div key={option.id} variants={fadeUp}>
            <ToppingStepper
              option={option}
              qty={veggies[option.id] || 0}
              onSetQty={onSetQty}
              maxReached={distinctCount >= MAX_VEGGIES && !(option.id in veggies)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
