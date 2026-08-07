import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';
import { PIZZA_PHOTOS } from '../../data/images';

const easing = [0.16, 1, 0.3, 1];

export default function AuthLayout({ children, title, subtitle }) {
  const { isDark } = useDarkMode();

  return (
    <div className={cn(
      "min-h-screen flex transition-colors duration-300",
      isDark ? "bg-dark-950" : "bg-white"
    )}>
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" aria-hidden="true">
        <div className={cn(
          "absolute inset-0",
          isDark
            ? "bg-gradient-to-br from-dark-900 via-dark-925 to-dark-950"
            : "bg-gradient-to-br from-surface-50 via-white to-surface-100"
        )} />

        {/* Hero image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: easing }}
            className="relative w-[85%] max-w-lg"
          >
            <div className={cn(
              "rounded-3xl overflow-hidden shadow-2xl transition-all duration-500",
              isDark
                ? "shadow-brand-500/20 ring-1 ring-white/[0.06]"
                : "shadow-black/15 ring-1 ring-black/5"
            )}>
              <img
                src={PIZZA_PHOTOS.margherita.srcLarge}
                alt="Premium artisan pizza"
                className="w-full h-[400px] object-cover"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>

            {/* Floating glass card */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className={cn(
                "absolute -bottom-6 -left-6 px-5 py-3 rounded-2xl border backdrop-blur-xl shadow-xl",
                isDark
                  ? "bg-dark-900/90 border-white/[0.08] shadow-black/30"
                  : "bg-white/90 border-surface-200/80 shadow-black/10"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
                <div>
                  <p className={cn("text-sm font-semibold", isDark ? "text-white" : "text-surface-900")}>100% Fresh</p>
                  <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-surface-400")}>Premium ingredients</p>
                </div>
              </div>
            </motion.div>

            {/* Floating badge — top right */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className={cn(
                "absolute -top-4 -right-4 px-4 py-2.5 rounded-2xl border backdrop-blur-xl shadow-lg",
                isDark
                  ? "bg-dark-900/90 border-white/[0.08] shadow-black/30"
                  : "bg-white/90 border-surface-200/80 shadow-black/10"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">🔥</span>
                <div>
                  <p className={cn("text-xs font-semibold", isDark ? "text-white" : "text-surface-900")}>Wood-Fired</p>
                  <p className={cn("text-[9px]", isDark ? "text-white/35" : "text-surface-400")}>900°F Ovens</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Background orbs */}
        <div className={cn(
          "absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[120px]",
          isDark ? "bg-brand-500/10" : "bg-brand-500/15"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[100px]",
          isDark ? "bg-accent-500/8" : "bg-accent-500/10"
        )} />
      </div>

      {/* Right form panel */}
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
