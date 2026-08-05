import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';
import { ROUTES } from '../utils/constants';

export default function Orders() {
  const { isDark } = useDarkMode();

  return (
    <div>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-colors duration-300",
          isDark ? "bg-gradient-to-b from-dark-925 to-dark-950" : "bg-gradient-to-b from-surface-50 to-white"
        )} />
        <div className={cn(
          "absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] transition-colors duration-300",
          isDark ? "bg-brand-500/8" : "bg-brand-500/10"
        )} />
        <div className={cn(
          "absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[120px] transition-colors duration-300",
          isDark ? "bg-accent-500/5" : "bg-accent-500/10"
        )} />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="badge-brand mb-4 inline-flex">Order History</span>
            <h1 className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Your{' '}
              <span className="text-gradient-brand">Orders</span>
            </h1>
            <p className={cn(
              "text-lg",
              isDark ? "text-white/40" : "text-surface-500"
            )}>
              Track and manage your pizza orders
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={cn(
              "p-12 md:p-16 text-center rounded-2xl border transition-colors duration-300",
              isDark
                ? "bg-gradient-to-b from-dark-850 to-dark-900 border-white/[0.06]"
                : "bg-surface-50 border-surface-200"
            )}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative inline-block mb-8"
            >
              <div className={cn(
                "absolute inset-0 rounded-full blur-2xl transition-colors duration-300",
                isDark ? "bg-brand-500/10" : "bg-brand-500/20"
              )} />
              <div className={cn(
                "relative w-24 h-24 rounded-2xl border flex items-center justify-center transition-colors duration-300",
                isDark ? "bg-dark-850 border-white/[0.06]" : "bg-white border-surface-200"
              )}>
                <svg className={cn(
                  "w-12 h-12 transition-colors duration-300",
                  isDark ? "text-white/10" : "text-surface-300"
                )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <h2 className={cn(
                "text-xl font-display font-semibold mb-3",
                isDark ? "text-white" : "text-surface-900"
              )}>
                No Orders Yet
              </h2>
              <p className={cn(
                "mb-8 max-w-sm mx-auto leading-relaxed",
                isDark ? "text-white/40" : "text-surface-500"
              )}>
                You haven't placed any orders yet. Start by exploring our delicious menu!
              </p>
              <Link to={ROUTES.MENU} className="btn-primary btn-lg group">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Place Your First Order
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
