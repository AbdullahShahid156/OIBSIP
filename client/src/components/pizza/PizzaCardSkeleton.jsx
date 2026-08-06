import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';

export default function PizzaCardSkeleton({ index = 0 }) {
  const { isDark } = useDarkMode();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        'overflow-hidden rounded-2xl border',
        isDark
          ? 'bg-dark-900/80 border-white/[0.06]'
          : 'bg-white border-surface-200'
      )}
    >
      {/* Image skeleton */}
      <div className={cn(
        'aspect-[4/3] relative',
        isDark ? 'bg-dark-850' : 'bg-surface-100'
      )}>
        <div className="absolute inset-0 animate-pulse">
          <div className={cn(
            'absolute inset-0',
            isDark
              ? 'bg-gradient-to-r from-dark-850 via-dark-800 to-dark-850'
              : 'bg-gradient-to-r from-surface-100 via-surface-200 to-surface-100'
          )} style={{ animation: 'shimmer 1.5s infinite' }} />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className={cn(
            'h-5 rounded-lg flex-1',
            isDark ? 'bg-white/10' : 'bg-surface-200'
          )} />
          <div className={cn(
            'h-5 w-14 rounded-lg',
            isDark ? 'bg-white/10' : 'bg-surface-200'
          )} />
        </div>
        <div className="space-y-2 mb-3">
          <div className={cn(
            'h-3 rounded-full w-full',
            isDark ? 'bg-white/5' : 'bg-surface-100'
          )} />
          <div className={cn(
            'h-3 rounded-full w-3/4',
            isDark ? 'bg-white/5' : 'bg-surface-100'
          )} />
        </div>
        <div className="flex items-center gap-1.5 mb-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-3.5 h-3.5 rounded-full',
                isDark ? 'bg-white/10' : 'bg-surface-200'
              )}
            />
          ))}
          <div className={cn(
            'h-3 w-8 rounded-full ml-1',
            isDark ? 'bg-white/5' : 'bg-surface-100'
          )} />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-surface-100 dark:border-white/[0.04]">
          <div className={cn(
            'h-3 w-16 rounded-full',
            isDark ? 'bg-white/5' : 'bg-surface-100'
          )} />
          <div className={cn(
            'h-9 w-24 rounded-xl',
            isDark ? 'bg-white/10' : 'bg-surface-200'
          )} />
        </div>
      </div>
    </motion.div>
  );
}
