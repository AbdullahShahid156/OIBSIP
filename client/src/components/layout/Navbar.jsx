import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode, useMediaQuery, useScrollPosition } from '../../hooks';
import { cn } from '../../utils/helpers';
import { ROUTES } from '../../utils/constants';

const landingLinks = [
  { label: 'Menu', href: '#featured' },
  { label: 'Why Us', href: '#why-us' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

const navLinks = [
  { label: 'Home', path: ROUTES.HOME },
  { label: 'Menu', path: ROUTES.MENU },
  { label: 'Orders', path: ROUTES.ORDERS },
];

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggle } = useDarkMode();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const scrollPosition = useScrollPosition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isHome = location.pathname === ROUTES.HOME;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' && isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobileMenuOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleSectionClick = useCallback((e, href) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  }, []);

  const isScrolled = scrollPosition > 50;

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? isDark
              ? 'bg-dark-950/70 backdrop-blur-2xl border-b border-white/[0.04] shadow-elevation-2'
              : 'bg-white/80 backdrop-blur-2xl border-b border-surface-200 shadow-elevation-2'
            : 'bg-transparent'
        )}
        role="banner"
      >
        <nav className="container" aria-label="Main navigation">
          <div className="flex items-center justify-between h-18 md:h-20">
            <Link
              to={ROUTES.HOME}
              className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 rounded-xl"
              aria-label="PizzaCraft - Go to homepage"
            >
              <motion.div
                whileHover={{ scale: 1.05, rotate: -5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className="relative"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/25">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                  </svg>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-dark-950" aria-hidden="true" />
              </motion.div>
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

            {isHome ? (
              <div
                className={cn(
                  "hidden md:flex items-center gap-1 p-1 rounded-2xl border",
                  isDark ? "bg-white/[0.03] border-white/[0.04]" : "bg-surface-100 border-surface-200"
                )}
                role="menubar"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    role="menuitem"
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                    className={cn(
                      'relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      location.pathname === link.path
                        ? isDark ? 'text-white' : 'text-surface-900'
                        : isDark ? 'text-white/50 hover:text-white/80' : 'text-surface-500 hover:text-surface-700'
                    )}
                  >
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeNav"
                        className={cn(
                          "absolute inset-0 rounded-xl border",
                          isDark ? "bg-white/[0.08] border-white/[0.08]" : "bg-white border-surface-200 shadow-sm"
                        )}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                ))}
                <div className={cn("w-px h-5", isDark ? "bg-white/10" : "bg-surface-200")} aria-hidden="true" />
                {landingLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleSectionClick(e, link.href)}
                    role="menuitem"
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      isDark ? 'text-white/50 hover:text-white/80' : 'text-surface-500 hover:text-surface-700'
                    )}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "hidden md:flex items-center gap-1 p-1 rounded-2xl border",
                  isDark ? "bg-white/[0.03] border-white/[0.04]" : "bg-surface-100 border-surface-200"
                )}
                role="menubar"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    role="menuitem"
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                    className={cn(
                      'relative px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                      location.pathname === link.path
                        ? isDark ? 'text-white' : 'text-surface-900'
                        : isDark ? 'text-white/50 hover:text-white/80' : 'text-surface-500 hover:text-surface-700'
                    )}
                  >
                    {location.pathname === link.path && (
                      <motion.div
                        layoutId="activeNav"
                        className={cn(
                          "absolute inset-0 rounded-xl border",
                          isDark ? "bg-white/[0.08] border-white/[0.08]" : "bg-white border-surface-200 shadow-sm"
                        )}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggle}
                className={cn(
                  "p-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  isDark
                    ? "bg-white/[0.04] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08]"
                    : "bg-surface-100 border-surface-200 text-surface-500 hover:text-surface-700 hover:bg-surface-200"
                )}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.svg
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="w-4.5 h-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </motion.button>

              <Link
                to={ROUTES.MENU}
                className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-500 to-brand-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                Order Now
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={cn(
                  "md:hidden p-2.5 rounded-xl border transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  isDark
                    ? "bg-white/[0.04] border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.08]"
                    : "bg-surface-100 border-surface-200 text-surface-500 hover:text-surface-700 hover:bg-surface-200"
                )}
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.svg
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </motion.svg>
                  ) : (
                    <motion.svg
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </motion.svg>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && isMobile && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-18 z-40 md:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className={cn(
              "mx-4 mt-2 p-2 rounded-2xl border shadow-elevation-4",
              isDark
                ? "bg-dark-900/95 backdrop-blur-2xl border-white/[0.06]"
                : "bg-white/95 backdrop-blur-2xl border-surface-200"
            )}>
              <div role="menu">
                {isHome && (
                  <>
                    {navLinks.map((link, index) => (
                      <motion.div
                        key={link.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        role="none"
                      >
                        <Link
                          to={link.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                          role="menuitem"
                          aria-current={location.pathname === link.path ? 'page' : undefined}
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                            location.pathname === link.path
                              ? isDark ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-brand-50 text-brand-600 border border-brand-200'
                              : isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                          )}
                        >
                          <span className={cn(
                            'w-1.5 h-1.5 rounded-full transition-colors',
                            location.pathname === link.path ? 'bg-brand-500' : isDark ? 'bg-white/20' : 'bg-surface-300'
                          )} aria-hidden="true" />
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                    <div className={cn("my-1 h-px", isDark ? "bg-white/[0.06]" : "bg-surface-200")} aria-hidden="true" />
                    {landingLinks.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (navLinks.length + index) * 0.05 }}
                        role="none"
                      >
                        <a
                          href={link.href}
                          onClick={(e) => handleSectionClick(e, link.href)}
                          role="menuitem"
                          className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                            isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                          )}
                        >
                          <span className={cn('w-1.5 h-1.5 rounded-full', isDark ? 'bg-white/20' : 'bg-surface-300')} aria-hidden="true" />
                          {link.label}
                        </a>
                      </motion.div>
                    ))}
                  </>
                )}
                {!isHome && navLinks.map((link, index) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    role="none"
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      role="menuitem"
                      aria-current={location.pathname === link.path ? 'page' : undefined}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500',
                        location.pathname === link.path
                          ? isDark ? 'bg-brand-500/10 text-brand-400 border border-brand-500/20' : 'bg-brand-50 text-brand-600 border border-brand-200'
                          : isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.04]' : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100'
                      )}
                    >
                      <span className={cn(
                        'w-1.5 h-1.5 rounded-full transition-colors',
                        location.pathname === link.path ? 'bg-brand-500' : isDark ? 'bg-white/20' : 'bg-surface-300'
                      )} aria-hidden="true" />
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-2 pt-2 border-t border-surface-200 dark:border-white/[0.06]"
                  role="none"
                >
                  <Link
                    to={ROUTES.MENU}
                    onClick={() => setIsMobileMenuOpen(false)}
                    role="menuitem"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-xl shadow-lg shadow-brand-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
                  >
                    Order Now
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
