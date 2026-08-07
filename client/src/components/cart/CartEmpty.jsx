import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';

export default function CartEmpty({ isDrawer = false, onClose }) {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        isDrawer ? 'py-16 px-6' : 'py-24 px-8'
      )}
    >
      {/* Animated pizza illustration */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
        className="relative mb-8"
      >
        <div className={cn(
          'w-24 h-24 rounded-3xl flex items-center justify-center',
          isDark
            ? 'bg-gradient-to-br from-brand-500/10 to-brand-600/5 border border-brand-500/15'
            : 'bg-gradient-to-br from-brand-50 to-brand-100/50 border border-brand-100'
        )}>
          <motion.span
            animate={{
              y: [0, -6, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="text-5xl select-none"
          >
            🛒
          </motion.span>
        </div>
        {/* Decorative dots */}
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={cn(
            'absolute -top-2 -right-2 w-3 h-3 rounded-full',
            isDark ? 'bg-brand-500/30' : 'bg-brand-200'
          )}
        />
        <motion.div
          animate={{ opacity: [0.5, 0.2, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          className={cn(
            'absolute -bottom-1 -left-2 w-2 h-2 rounded-full',
            isDark ? 'bg-accent-500/25' : 'bg-accent-200'
          )}
        />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={cn(
          'text-lg font-display font-bold mb-2',
          isDark ? 'text-white' : 'text-surface-900'
        )}
      >
        Your cart is empty
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={cn(
          'text-sm mb-6 max-w-xs',
          isDark ? 'text-white/35' : 'text-surface-400'
        )}
      >
        Looks like you haven't added any delicious pizzas yet. Start crafting your perfect order!
      </motion.p>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => {
          navigate('/menu');
          onClose?.();
        }}
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        Browse Menu
      </motion.button>
    </motion.div>
  );
}
