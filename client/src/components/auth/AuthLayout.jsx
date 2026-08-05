import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';

const easing = [0.16, 1, 0.3, 1];

export default function AuthLayout({ children, title, subtitle }) {
  const { isDark } = useDarkMode();

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      isDark ? "bg-dark-950" : "bg-white"
    )}>
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" aria-hidden="true">
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-br from-dark-900 via-dark-925 to-dark-950"
            : "bg-gradient-to-br from-surface-50 via-white to-surface-100"
        )} />
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className={cn(
          "absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]",
          isDark ? "bg-brand-500/10" : "bg-brand-500/15"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px]",
          isDark ? "bg-accent-500/8" : "bg-accent-500/10"
        )} />
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: easing }}
            className="text-center max-w-md"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-brand-500 to-brand-600 rounded-2xl flex items-center justify-center shadow-xl shadow-brand-500/25 mx-auto mb-8">
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              </svg>
            </div>
            <h1 className={cn(
              "text-3xl font-display font-bold mb-4 tracking-tight",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Welcome to PizzaCraft
            </h1>
            <p className={cn(
              "text-base leading-relaxed",
              isDark ? "text-white/50" : "text-surface-500"
            )}>
              Premium artisan pizza delivery. Fresh ingredients, authentic recipes, crafted with passion.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <Link
              to="/"
              className="flex items-center gap-3 mb-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={cn(
                  "font-display font-bold text-lg leading-none tracking-tight",
                  isDark ? "text-white" : "text-surface-900"
                )}>
                  PizzaCraft
                </span>
                <span className="text-[9px] font-semibold text-brand-500 uppercase tracking-[0.2em] mt-0.5">
                  Premium Delivery
                </span>
              </div>
            </Link>

            {title && (
              <div className="mb-8">
                <h2 className={cn(
                  "text-2xl font-display font-bold tracking-tight",
                  isDark ? "text-white" : "text-surface-900"
                )}>
                  {title}
                </h2>
                {subtitle && (
                  <p className={cn(
                    "text-sm mt-2",
                    isDark ? "text-white/40" : "text-surface-500"
                  )}>
                    {subtitle}
                  </p>
                )}
              </div>
            )}

            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
