import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';
import { StaggerContainer, StaggerItem } from '../components/ui/AnimationWrapper';
import { ROUTES } from '../utils/constants';

const features = [
  {
    title: 'Fresh Ingredients',
    description: 'Locally sourced, premium quality ingredients for the perfect pizza.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Fast Delivery',
    description: 'Get your pizza delivered hot and fresh in under 30 minutes.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: 'Real-time Tracking',
    description: 'Track your order from oven to your doorstep in real-time.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

const stats = [
  { value: '10K+', label: 'Happy Customers' },
  { value: '50+', label: 'Pizza Varieties' },
  { value: '30min', label: 'Avg. Delivery' },
  { value: '4.9', label: 'Customer Rating' },
];

function FloatingPizza({ className, delay = 0, isDark }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      <motion.div
        animate={{ y: [-10, 10, -10], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl transition-colors duration-300",
          isDark ? "bg-brand-500/20" : "bg-brand-500/30"
        )} />
        <div className={cn(
          "relative w-16 h-16 md:w-24 md:h-24 rounded-full border flex items-center justify-center backdrop-blur-sm transition-colors duration-300",
          isDark
            ? "bg-gradient-to-br from-brand-500/30 to-brand-600/30 border-brand-500/20"
            : "bg-gradient-to-br from-brand-500/20 to-brand-600/20 border-brand-200"
        )}>
          <svg className={cn(
            "w-8 h-8 md:w-12 md:h-12 transition-colors duration-300",
            isDark ? "text-brand-400/60" : "text-brand-500/60"
          )} viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
          </svg>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const { isDark } = useDarkMode();
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div>
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <div className={cn(
            "absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] animate-pulse-glow transition-colors duration-300",
            isDark ? "bg-brand-500/10" : "bg-brand-500/15"
          )} />
          <div className={cn(
            "absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] animate-pulse-glow transition-colors duration-300",
            isDark ? "bg-accent-500/8" : "bg-accent-500/10"
          )} style={{ animationDelay: '1.5s' }} />
          <div className={cn(
            "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[200px] transition-colors duration-300",
            isDark ? "bg-brand-500/5" : "bg-brand-500/8"
          )} />
        </div>

        <FloatingPizza className="absolute top-32 left-[10%] hidden lg:block" delay={0.5} isDark={isDark} />
        <FloatingPizza className="absolute top-48 right-[15%] hidden lg:block" delay={0.7} isDark={isDark} />
        <FloatingPizza className="absolute bottom-32 left-[20%] hidden lg:block" delay={0.9} isDark={isDark} />

        <motion.div style={{ y, opacity }} className="container relative z-10 py-32">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="badge-brand mb-6 inline-flex">
                <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                Premium Pizza Delivery
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                "text-hero-sm md:text-hero font-display font-bold mb-6 tracking-tight leading-[1.1]",
                isDark ? "text-white" : "text-surface-900"
              )}
            >
              Crafted with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-brand">passion</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-2 bg-brand-500/20 -skew-x-3 origin-left"
                />
              </span>
              , delivered{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-accent">fresh</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-2 bg-accent-500/20 -skew-x-3 origin-left"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={cn(
                "text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed",
                isDark ? "text-white/50" : "text-surface-500"
              )}
            >
              Experience the perfect blend of authentic Italian flavors and modern convenience.
              Every pizza is handcrafted with the finest ingredients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to={ROUTES.MENU} className="btn-primary btn-lg group">
                <span>Explore Menu</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="btn-outline btn-lg group">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Watch Story</span>
              </button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={cn(
              "w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5",
              isDark ? "border-white/20" : "border-surface-300"
            )}
          >
            <motion.div className={cn(
              "w-1.5 h-1.5 rounded-full",
              isDark ? "bg-white/60" : "bg-surface-400"
            )} />
          </motion.div>
        </motion.div>
      </section>

      <section className={cn(
        "py-16 relative border-y transition-colors duration-300",
        isDark ? "border-white/[0.04] bg-dark-900/50" : "border-surface-200 bg-surface-50"
      )}>
        <div className="relative container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-gradient-brand mb-2">
                  {stat.value}
                </div>
                <div className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/40" : "text-surface-500"
                )}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-brand mb-4 inline-flex">Why Choose Us</span>
            <h2 className={cn(
              "text-section font-display font-bold mb-4 tracking-tight",
              isDark ? "text-white" : "text-surface-900"
            )}>
              The PizzaCraft Difference
            </h2>
            <p className={cn(
              "max-w-xl mx-auto",
              isDark ? "text-white/40" : "text-surface-500"
            )}>
              We're not just another pizza delivery. We're a passion project dedicated to bringing you the finest pizza experience.
            </p>
          </motion.div>

          <StaggerContainer className="grid md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <div className={cn(
                  "group relative p-8 rounded-2xl border transition-all duration-500",
                  isDark
                    ? "bg-dark-900/60 border-white/[0.04] hover:border-brand-500/20 hover:shadow-glow-brand-sm"
                    : "bg-white border-surface-200 hover:border-brand-200 hover:shadow-lg"
                )}>
                  <div className={cn(
                    "absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500"
                  )} />
                  <div className="relative">
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300",
                      isDark
                        ? "bg-brand-500/10 border border-brand-500/20 text-brand-400 group-hover:bg-brand-500/20"
                        : "bg-brand-50 border border-brand-200 text-brand-600 group-hover:bg-brand-100"
                    )}>
                      {feature.icon}
                    </div>
                    <h3 className={cn(
                      "text-card-title font-display font-semibold mb-2",
                      isDark ? "text-white group-hover:text-brand-400" : "text-surface-900 group-hover:text-brand-600"
                    )}>
                      {feature.title}
                    </h3>
                    <p className={cn(
                      "text-sm leading-relaxed",
                      isDark ? "text-white/40" : "text-surface-500"
                    )}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <section className="section relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 to-brand-700" />
        <div className="absolute inset-0 bg-noise opacity-30" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
        </div>
        <div className="relative container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-section font-display font-bold text-white mb-4 tracking-tight">
              Ready to Order?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto text-lg">
              Discover our menu and experience the best pizza delivery in town.
            </p>
            <Link
              to={ROUTES.MENU}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-600 font-semibold rounded-2xl shadow-elevation-3 hover:shadow-elevation-4 hover:bg-white/95 transition-all duration-300 active:scale-[0.97]"
            >
              View Full Menu
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
