import { motion } from 'framer-motion';
import { cn } from '../../../utils/helpers';
import { useDarkMode } from '../../../hooks';
import SelectionCard from '../SelectionCard';
import { SAUCE_OPTIONS, STEP_COLORS } from '../../../data/pizzaBuilder';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function SauceStep({ selected, onSelect }) {
  const { isDark } = useDarkMode();
  const colors = STEP_COLORS.sauce;

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
          Step 2 of 5
        </motion.div>
        <h2 className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}>
          Pick Your Sauce
        </h2>
        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
          The flavor that ties it all together
        </p>
      </div>

      <div className="mb-4 p-4 rounded-xl border border-dashed border-brand-500/30 bg-brand-500/5">
        <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>
          💡 <span className="font-semibold">Tip:</span> Pesto pairs beautifully with fresh mozzarella
        </p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-3">
        {SAUCE_OPTIONS.map((option) => (
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
