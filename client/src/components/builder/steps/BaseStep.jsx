import { motion } from 'framer-motion';
import { cn } from '../../../utils/helpers';
import { useDarkMode } from '../../../hooks';
import SelectionCard from '../SelectionCard';
import { BASE_OPTIONS, SIZE_OPTIONS, STEP_COLORS } from '../../../data/pizzaBuilder';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function BaseStep({ selected, size, onSelect, onSizeChange }) {
  const { isDark } = useDarkMode();
  const colors = STEP_COLORS.base;

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
          Step 1 of 5
        </motion.div>
        <h2 className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}>
          Choose Your Base
        </h2>
        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
          The foundation of your masterpiece
        </p>
      </div>

      <div className="mb-8">
        <label className={cn('text-xs font-semibold uppercase tracking-wider mb-3 block', isDark ? 'text-white/50' : 'text-surface-600')}>
          Size
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SIZE_OPTIONS.map((s) => (
            <motion.button
              key={s.id}
              type="button"
              onClick={() => onSizeChange(s.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                'relative p-3 rounded-xl border-2 text-center transition-all duration-300',
                size === s.id
                  ? isDark
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-brand-500 bg-brand-50'
                  : isDark
                    ? 'border-white/[0.06] bg-white/[0.03] hover:border-white/[0.12]'
                    : 'border-surface-200 bg-white hover:border-surface-300'
              )}
            >
              {size === s.id && (
                <motion.div
                  layoutId="size-indicator"
                  className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full flex items-center justify-center"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                >
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              <p className={cn('text-lg font-bold', isDark ? 'text-white' : 'text-surface-900')}>{s.inches}</p>
              <p className={cn('text-[10px] font-semibold', isDark ? 'text-white/50' : 'text-surface-500')}>{s.name}</p>
              <p className={cn('text-[9px] mt-0.5', isDark ? 'text-white/30' : 'text-surface-400')}>{s.servings} servings</p>
            </motion.button>
          ))}
        </div>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
        {BASE_OPTIONS.map((option) => (
          <motion.div key={option.id} variants={fadeUp}>
            <SelectionCard
              option={option}
              selected={selected === option.id}
              onClick={onSelect}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
