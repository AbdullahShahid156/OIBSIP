import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';
import { ROUTES } from '../utils/constants';

export default function NotFound() {
  const { isDark } = useDarkMode();

  return (
    <div className="min-h-[85vh] flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <div className={cn(
          "absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[150px] animate-pulse-glow transition-colors duration-300",
          isDark ? "bg-brand-500/10" : "bg-brand-500/15"
        )} />
        <div className={cn(
          "absolute bottom-1/3 right-1/4 w-[300px] h-[300px] rounded-full blur-[120px] animate-pulse-glow transition-colors duration-300",
          isDark ? "bg-accent-500/8" : "bg-accent-500/10"
        )} style={{ animationDelay: '1s' }} />
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="relative inline-block mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-[140px] md:text-[200px] font-display font-bold leading-none tracking-tighter"
            >
              <span className="text-gradient-brand">4</span>
              <span className={isDark ? "text-white/10" : "text-surface-200"}>0</span>
              <span className="text-gradient-accent">4</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-brand-500/30 rounded-full blur-xl" />
                <div className="relative w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full flex items-center justify-center shadow-lg shadow-brand-500/30">
                  <svg className="w-12 h-12 md:w-16 md:h-16 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-8 md:-right-12"
            >
              <div className={cn(
                "w-12 h-12 md:w-16 md:h-16 rounded-full border flex items-center justify-center backdrop-blur-sm transition-colors duration-300",
                isDark ? "bg-accent-500/20 border-accent-500/30" : "bg-accent-100 border-accent-200"
              )}>
                <svg className={cn(
                  "w-6 h-6 md:w-8 md:h-8 transition-colors duration-300",
                  isDark ? "text-accent-400/70" : "text-accent-500"
                )} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [5, -5, 5], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -bottom-2 -left-6 md:-left-10"
            >
              <div className={cn(
                "w-10 h-10 md:w-14 md:h-14 rounded-full border flex items-center justify-center backdrop-blur-sm transition-colors duration-300",
                isDark ? "bg-brand-500/20 border-brand-500/30" : "bg-brand-100 border-brand-200"
              )}>
                <svg className={cn(
                  "w-5 h-5 md:w-7 md:h-7 transition-colors duration-300",
                  isDark ? "text-brand-400/70" : "text-brand-500"
                )} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                </svg>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h1 className={cn(
              "text-3xl md:text-4xl font-display font-bold mb-4 tracking-tight",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Page Not Found
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <p className={cn(
              "mb-10 max-w-md mx-auto text-lg leading-relaxed",
              isDark ? "text-white/40" : "text-surface-500"
            )}>
              Oops! The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to={ROUTES.HOME} className="btn-primary btn-lg group">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Back to Home
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link to={ROUTES.MENU} className="btn-outline btn-lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              View Menu
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16"
          >
            <p className={cn(
              "text-sm",
              isDark ? "text-white/30" : "text-surface-400"
            )}>
              Need help?{' '}
              <a href="mailto:support@pizzacraft.com" className={cn(
                "underline underline-offset-4 transition-all",
                isDark
                  ? "text-brand-400 hover:text-brand-300 decoration-brand-400/30 hover:decoration-brand-400/60"
                  : "text-brand-600 hover:text-brand-500 decoration-brand-600/30 hover:decoration-brand-600/60"
              )}>
                Contact Support
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
