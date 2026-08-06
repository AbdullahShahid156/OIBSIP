import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';
import { useDarkMode } from '../../hooks';
import { BUILDER_STEPS, STEP_COLORS } from '../../data/pizzaBuilder';

const stepIcons = {
  circle: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  droplet: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7.5-8-12a8 8 0 1116 0c0 4.5-4 8-8 12z" />
    </svg>
  ),
  sparkles: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
    </svg>
  ),
  leaf: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21c-4-4-8-7.5-8-12a8 8 0 0116 0c0 4.5-4 8-8 12z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V10M12 10C9 10 6 7 6 4" />
    </svg>
  ),
  check: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

export default function StepIndicator({ currentStep, onStepClick, completedSteps }) {
  const { isDark } = useDarkMode();

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto">
      {BUILDER_STEPS.map((step, idx) => {
        const isActive = idx === currentStep;
        const isCompleted = completedSteps.includes(idx);
        const colors = STEP_COLORS[step.id];
        const isClickable = isCompleted || idx <= currentStep;

        return (
          <div key={step.id} className="flex items-center flex-1 last:flex-none">
            <button
              type="button"
              onClick={() => isClickable && onStepClick(idx)}
              disabled={!isClickable}
              className={cn(
                'flex flex-col items-center gap-2 group relative',
                isClickable ? 'cursor-pointer' : 'cursor-default'
              )}
            >
              <motion.div
                layout
                className={cn(
                  'relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300',
                  isActive
                    ? `bg-gradient-to-br ${colors.from} ${colors.to} text-white shadow-lg`
                    : isCompleted
                      ? isDark ? 'bg-success-500/20 text-success-400' : 'bg-success-50 text-success-600'
                      : isDark ? 'bg-white/[0.06] text-white/30' : 'bg-surface-100 text-surface-400'
                )}
                whileHover={isClickable ? { scale: 1.1 } : {}}
                whileTap={isClickable ? { scale: 0.95 } : {}}
              >
                {isCompleted && !isActive ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  stepIcons[step.icon]
                )}
                {isActive && (
                  <motion.div
                    layoutId="step-glow"
                    className={cn('absolute inset-0 rounded-xl', `bg-gradient-to-br ${colors.from} ${colors.to}`, 'opacity-30 blur-md')}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.div>

              <span className={cn(
                'text-[10px] font-semibold uppercase tracking-wider transition-colors hidden sm:block',
                isActive
                  ? colors.text
                  : isCompleted
                    ? isDark ? 'text-success-400' : 'text-success-600'
                    : isDark ? 'text-white/30' : 'text-surface-400'
              )}>
                {step.title.split(' ').slice(-1)[0]}
              </span>
            </button>

            {idx < BUILDER_STEPS.length - 1 && (
              <div className={cn(
                'flex-1 h-[2px] mx-3 rounded-full transition-colors duration-500 relative overflow-hidden',
                isDark ? 'bg-white/[0.06]' : 'bg-surface-200'
              )}>
                {isCompleted && (
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="absolute inset-0 bg-gradient-to-r from-success-500 to-success-400 origin-left"
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
