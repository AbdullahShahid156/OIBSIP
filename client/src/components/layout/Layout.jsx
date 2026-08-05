import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDarkMode } from '../../hooks';
import { cn } from '../../utils/helpers';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();
  const { isDark } = useDarkMode();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-colors duration-300",
      isDark ? "bg-dark-950" : "bg-white"
    )}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-brand-500 focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>
      <Navbar />
      <main
        id="main-content"
        className="flex-1 pt-18 md:pt-20"
        role="main"
      >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
