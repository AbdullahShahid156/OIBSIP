import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState, useCallback } from 'react';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';
import { ROUTES } from '../utils/constants';
import { PIZZA_PHOTOS } from '../data/images';
import PizzaImage from '../components/ui/PizzaImage';
import TestimonialsSection from '../components/sections/TestimonialsSection';

const easing = [0.16, 1, 0.3, 1];

function useCountUp(end, duration = 2, startOnView = true) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!startOnView || !isInView) return;
    let startTime = null;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isInView, startOnView]);

  return { ref, count };
}

const featuredPizzas = [
  {
    name: 'Margherita Classica',
    description: 'San Marzano tomatoes, fresh mozzarella, basil, extra virgin olive oil',
    price: '$18.99',
    rating: '4.9',
    reviews: '324',
    tag: 'Best Seller',
    gradient: 'from-red-500/20 to-orange-500/20',
    border: 'border-red-500/10',
    photo: PIZZA_PHOTOS.margherita,
  },
  {
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, truffle cream, fontina, fresh thyme, arugula',
    price: '$24.99',
    rating: '4.8',
    reviews: '218',
    tag: 'Chef\'s Pick',
    gradient: 'from-amber-500/20 to-yellow-500/20',
    border: 'border-amber-500/10',
    photo: PIZZA_PHOTOS.truffle_mushroom,
  },
  {
    name: 'Diavola Piccante',
    description: 'Spicy salami, calabrian chili, roasted peppers, mozzarella',
    price: '$21.99',
    rating: '4.7',
    reviews: '186',
    tag: 'Spicy',
    gradient: 'from-orange-500/20 to-red-500/20',
    border: 'border-orange-500/10',
    photo: PIZZA_PHOTOS.diavola,
  },
  {
    name: 'Quattro Formaggi',
    description: 'Mozzarella, gorgonzola, fontina, parmigiano, honey drizzle',
    price: '$22.99',
    rating: '4.9',
    reviews: '271',
    tag: 'Popular',
    gradient: 'from-yellow-500/20 to-amber-500/20',
    border: 'border-yellow-500/10',
    photo: PIZZA_PHOTOS.quattro_formaggi,
  },
];

const whyChooseUs = [
  {
    title: 'Artisan Crafted',
    description: 'Every pizza is hand-stretched and crafted by our skilled pizzaiolos using time-honored Italian techniques passed down through generations.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
  {
    title: 'Farm-to-Table Fresh',
    description: 'We source directly from local farms and Italian producers. Our ingredients travel from field to your plate in under 48 hours.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
      </svg>
    ),
  },
  {
    title: '30-Minute Promise',
    description: 'Our optimized delivery network ensures your pizza arrives hot and fresh. If we\'re late, your next pizza is on us.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Real-Time Tracking',
    description: 'Watch your pizza being prepared and track your delivery driver in real-time. Complete transparency from oven to doorstep.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
  {
    title: 'Premium Ingredients',
    description: 'From DOP-certified San Marzano tomatoes to imported Italian mozzarella, we never compromise on quality.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: 'Carbon Neutral',
    description: 'Every delivery is carbon offset. Our electric fleet and sustainable packaging make every pizza a guilt-free pleasure.',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Choose Your Base',
    description: 'Select from our handcrafted dough options — classic, gluten-free, or cauliflower crust.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.87c1.355 0 2.697.055 4.024.165C17.155 8.51 18 9.473 18 10.608v2.513m-3-4.87v-1.5m-6 1.5v-1.5m12 9.75l-1.5.75a3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0 3.354 3.354 0 00-3 0 3.354 3.354 0 01-3 0L3 16.5m15-3.38a48.474 48.474 0 00-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.17c0 .62-.504 1.124-1.125 1.124H4.125A1.125 1.125 0 013 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 016 13.12M12.265 3.11a.375.375 0 11-.53 0L12 2.845l.265.265z" />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Add Toppings',
    description: 'Build your perfect pizza with premium toppings. Our AI suggests perfect combinations.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'We Bake It',
    description: 'Our wood-fired ovens reach 900°F for the perfect Neapolitan-style crust in 90 seconds.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Fast Delivery',
    description: 'Your pizza arrives at your door in under 30 minutes, hot and ready to enjoy.',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
];

const categories = [
  { name: 'Classic', count: '12+', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10', color: 'from-brand-500 to-brand-600' },
  { name: 'Gourmet', count: '8+', icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12', color: 'from-amber-500 to-orange-600' },
  { name: 'Veggie', count: '10+', icon: 'M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25', color: 'from-emerald-500 to-green-600' },
  { name: 'Meat Lovers', count: '9+', icon: 'M15.362 5.214A8.252 8.252 0 0112 21', color: 'from-red-500 to-rose-600' },
  { name: 'Seafood', count: '6+', icon: 'M12 21a9.004 9.004 0 008.716-6.747', color: 'from-cyan-500 to-blue-600' },
  { name: 'Sweet', count: '5+', icon: 'M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166', color: 'from-pink-500 to-fuchsia-600' },
];

const stats = [
  { value: 10000, suffix: '+', label: 'Happy Customers', description: 'Served and counting' },
  { value: 50, suffix: '+', label: 'Pizza Varieties', description: 'Unique flavors' },
  { value: 30, suffix: 'min', label: 'Avg. Delivery', description: 'From oven to door' },
  { value: 49, suffix: '.9', label: 'Customer Rating', description: 'On Google Reviews' },
];

function AnimatedCounterValue({ value, suffix, label, description }) {
  const { ref, count } = useCountUp(value, 2);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-display font-bold text-gradient-brand mb-2">
        {value >= 10000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count}{suffix === '.9' ? '.9' : suffix}
      </div>
      <div className={cn("font-semibold text-sm mb-1", isDarkGlobal ? "text-white/80" : "text-surface-900")}>
        {label}
      </div>
      <div className={cn("text-xs", isDarkGlobal ? "text-white/40" : "text-surface-500")}>
        {description}
      </div>
    </div>
  );
}

let isDarkGlobal = false;

function HeroSection() {
  const { isDark } = useDarkMode();
  isDarkGlobal = isDark;
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '15%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={heroRef} className={cn(
      "relative min-h-screen flex items-center overflow-hidden transition-colors duration-300",
      isDark ? "bg-dark-950" : "bg-white"
    )}>

      {/* Background layers */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className={cn(
          "absolute top-0 right-0 w-[65%] h-full transition-colors duration-500",
          isDark
            ? "bg-gradient-to-l from-brand-500/[0.04] via-accent-500/[0.02] to-transparent"
            : "bg-gradient-to-l from-brand-50 via-accent-50/50 to-transparent"
        )} />
        <div className={cn(
          "absolute top-1/4 right-[20%] w-[500px] h-[500px] rounded-full blur-[160px] transition-colors duration-500",
          isDark ? "bg-brand-500/8" : "bg-brand-500/10"
        )} />
        <div className={cn(
          "absolute bottom-1/4 right-[10%] w-[400px] h-[400px] rounded-full blur-[140px] transition-colors duration-500",
          isDark ? "bg-accent-500/5" : "bg-accent-500/8"
        )} />
        {/* Subtle grid pattern */}
        <div className={cn(
          "absolute inset-0 opacity-[0.015]",
          isDark ? "bg-white" : "bg-surface-900"
        )} style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <motion.div style={{ y, opacity }} className="container relative z-10 py-28 md:py-32 lg:py-36">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left — Text Content */}
          <div className="relative z-10 order-2 lg:order-1">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: easing }}
            >
              <span className={cn(
                "inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold mb-8 border transition-colors duration-300",
                isDark
                  ? "bg-brand-500/10 text-brand-400 border-brand-500/20"
                  : "bg-brand-50 text-brand-600 border-brand-200"
              )}>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
                Premium Pizza Delivery
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7, ease: easing }}
              className={cn(
                "text-[2.25rem] sm:text-[2.75rem] md:text-[3.25rem] lg:text-[3.75rem] font-display font-bold mb-6 tracking-tight leading-[1.08]",
                isDark ? "text-white" : "text-surface-900"
              )}
            >
              Crafted with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-brand">passion</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.5, ease: easing }}
                  className="absolute bottom-1 md:bottom-2 left-0 right-0 h-2.5 md:h-3 bg-brand-500/15 dark:bg-brand-500/20 -skew-x-3 origin-left"
                />
              </span>
              <br />
              delivered{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-gradient-accent">fresh</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.5, ease: easing }}
                  className="absolute bottom-1 md:bottom-2 left-0 right-0 h-2.5 md:h-3 bg-accent-500/15 dark:bg-accent-500/20 -skew-x-3 origin-left"
                />
              </span>
              {' '}&{' '}
              <span className={isDark ? "text-white" : "text-surface-900"}>hot.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={cn(
                "text-base md:text-lg mb-10 max-w-lg leading-relaxed",
                isDark ? "text-white/45" : "text-surface-500"
              )}
            >
              Handcrafted with premium ingredients and baked to perfection in our wood-fired ovens.
              From oven to your door in under 30 minutes.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-12"
            >
              <Link
                to={ROUTES.MENU}
                className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 hover:from-brand-400 hover:to-brand-500 transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
              >
                <span>Explore Menu</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#how-it-works"
                onClick={(e) => { e.preventDefault(); document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                className={cn(
                  "group inline-flex items-center justify-center gap-2.5 px-8 py-4 font-semibold rounded-2xl border-2 transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                  isDark
                    ? "border-white/10 text-white/80 hover:bg-white/5 hover:border-white/20"
                    : "border-surface-200 text-surface-700 hover:bg-surface-50 hover:border-surface-300"
                )}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                </svg>
                <span>How It Works</span>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
              className="flex flex-wrap items-center gap-6"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={cn("text-sm font-semibold", isDark ? "text-white/70" : "text-surface-700")}>4.9</span>
                <span className={cn("text-sm", isDark ? "text-white/35" : "text-surface-400")}>· 2,400+ reviews</span>
              </div>
              <div className={cn("w-px h-4", isDark ? "bg-white/10" : "bg-surface-300")} />
              <div className="flex items-center gap-2">
                <svg className={cn("w-4 h-4", isDark ? "text-success-400" : "text-success-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={cn("text-sm", isDark ? "text-white/50" : "text-surface-500")}><span className={cn("font-semibold", isDark ? "text-white/70" : "text-surface-700")}>30 min</span> delivery</span>
              </div>
              <div className={cn("w-px h-4", isDark ? "bg-white/10" : "bg-surface-300")} />
              <div className="flex items-center gap-2">
                <svg className={cn("w-4 h-4", isDark ? "text-brand-400" : "text-brand-600")} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
                <span className={cn("text-sm", isDark ? "text-white/50" : "text-surface-500")}><span className={cn("font-semibold", isDark ? "text-white/70" : "text-surface-700")}>100%</span> fresh</span>
              </div>
            </motion.div>
          </div>

          {/* Right — Hero Image */}
          <motion.div
            style={{ y: imageY }}
            className="relative order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            {/* Image glow */}
            <div className={cn(
              "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] h-[85%] rounded-full blur-[80px] transition-colors duration-500",
              isDark ? "bg-brand-500/15" : "bg-brand-500/10"
            )} />

            {/* Main image container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: easing }}
              className="relative"
            >
              {/* Floating accent ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                className={cn(
                  "absolute -inset-6 rounded-full border border-dashed transition-colors duration-300",
                  isDark ? "border-brand-500/15" : "border-brand-300/40"
                )}
              />

              {/* Image card */}
              <div className={cn(
                "relative w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[400px] md:h-[400px] lg:w-[440px] lg:h-[440px] rounded-[2rem] overflow-hidden transition-all duration-500",
                isDark
                  ? "shadow-[0_20px_60px_-15px_rgba(230,57,70,0.25),0_0_0_1px_rgba(255,255,255,0.06)]"
                  : "shadow-[0_20px_60px_-15px_rgba(230,57,70,0.2),0_0_0_1px_rgba(0,0,0,0.05)]"
              )}>
                <img
                  src={PIZZA_PHOTOS.margherita.srcLarge}
                  alt={PIZZA_PHOTOS.margherita.alt}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
                {/* Gradient overlay */}
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-t transition-opacity duration-500",
                  isDark
                    ? "from-dark-950/60 via-transparent to-transparent opacity-60"
                    : "from-black/10 via-transparent to-transparent opacity-40"
                )} />
              </div>

              {/* Floating badge — top left */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, duration: 0.5, ease: easing }}
                className={cn(
                  "absolute -left-4 sm:-left-6 top-12 px-4 py-3 rounded-2xl border backdrop-blur-xl transition-colors duration-300",
                  isDark
                    ? "bg-dark-850/90 border-white/[0.08] shadow-lg shadow-black/30"
                    : "bg-white/90 border-surface-200/80 shadow-lg shadow-black/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn("text-xs font-semibold", isDark ? "text-white" : "text-surface-900")}>Wood-Fired</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-surface-400")}>900°F Ovens</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badge — bottom right */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5, ease: easing }}
                className={cn(
                  "absolute -right-3 sm:-right-5 bottom-16 px-4 py-3 rounded-2xl border backdrop-blur-xl transition-colors duration-300",
                  isDark
                    ? "bg-dark-850/90 border-white/[0.08] shadow-lg shadow-black/30"
                    : "bg-white/90 border-surface-200/80 shadow-lg shadow-black/5"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className={cn("text-xs font-semibold", isDark ? "text-white" : "text-surface-900")}>30 Minutes</p>
                    <p className={cn("text-[10px]", isDark ? "text-white/40" : "text-surface-400")}>Fast Delivery</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating ingredient accent — top right */}
              <motion.div
                animate={{ y: [-6, 6, -6] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-2 sm:right-2"
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl border backdrop-blur-sm flex items-center justify-center rotate-12 transition-colors duration-300",
                  isDark ? "bg-white/[0.04] border-white/[0.08]" : "bg-white/80 border-surface-200/60 shadow-md"
                )}>
                  <span className="text-2xl">🌿</span>
                </div>
              </motion.div>

              {/* Floating ingredient accent — bottom left */}
              <motion.div
                animate={{ y: [5, -5, 5] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-8 -left-2 sm:left-0"
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl border backdrop-blur-sm flex items-center justify-center -rotate-12 transition-colors duration-300",
                  isDark ? "bg-white/[0.04] border-white/[0.08]" : "bg-white/80 border-surface-200/60 shadow-md"
                )}>
                  <span className="text-xl">🧀</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
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
            "w-6 h-10 rounded-full border-2 flex items-start justify-center p-1.5 transition-colors duration-300",
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
  );
}

function StatsBar() {
  const { isDark } = useDarkMode();
  return (
    <section className={cn(
      "py-16 relative border-y transition-colors duration-300",
      isDark ? "border-white/[0.04] bg-dark-900/50" : "border-surface-200 bg-surface-50"
    )}>
      <div className="relative container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => {
            const CounterVal = () => {
              const { ref, count } = useCountUp(stat.value, 2);
              return (
                <div ref={ref} className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <div className="text-3xl md:text-4xl font-display font-bold text-gradient-brand mb-2">
                      {stat.value >= 10000 ? `${(count / 1000).toFixed(count >= 10000 ? 0 : 1)}K` : count}{stat.suffix === '.9' ? '.9' : stat.suffix}
                    </div>
                    <div className={cn(
                      "text-sm font-medium",
                      isDark ? "text-white/40" : "text-surface-500"
                    )}>
                      {stat.label}
                    </div>
                  </motion.div>
                </div>
              );
            };
            return <CounterVal key={stat.label} />;
          })}
        </div>
      </div>
    </section>
  );
}

function FeaturedPizzas() {
  const { isDark } = useDarkMode();
  return (
    <section id="featured" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="text-center mb-12 md:mb-16"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border",
            isDark ? "bg-brand-500/10 text-brand-400 border-brand-500/20" : "bg-brand-50 text-brand-600 border-brand-200"
          )}>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
            Featured
          </span>
          <h2 className={cn(
            "text-section font-display font-bold mb-4 tracking-tight",
            isDark ? "text-white" : "text-surface-900"
          )}>
            Our Signature{' '}
            <span className="text-gradient-brand">Creations</span>
          </h2>
          <p className={cn(
            "max-w-xl mx-auto",
            isDark ? "text-white/40" : "text-surface-500"
          )}>
            Each pizza is a masterpiece, crafted with premium ingredients and years of expertise.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredPizzas.map((pizza, index) => (
            <motion.div
              key={pizza.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: easing }}
              whileHover={{ y: -8, transition: { duration: 0.3, ease: easing } }}
              className={cn(
                "group relative rounded-2xl border p-5 transition-all duration-500 cursor-pointer",
                isDark
                  ? `bg-dark-900/60 ${pizza.border} hover:border-brand-500/30 hover:shadow-glow-brand-sm`
                  : `bg-white ${pizza.border} hover:border-brand-200 hover:shadow-lg`
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-b to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500",
                pizza.gradient
              )} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide",
                    isDark ? "bg-white/5 text-white/60" : "bg-surface-100 text-surface-600"
                  )}>
                    {pizza.tag}
                  </span>
                  <div className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className={cn("text-xs font-semibold", isDark ? "text-white/70" : "text-surface-700")}>
                      {pizza.rating}
                    </span>
                    <span className={cn("text-xs", isDark ? "text-white/30" : "text-surface-400")}>
                      ({pizza.reviews})
                    </span>
                  </div>
                </div>

                <div className={cn(
                  "w-full aspect-square rounded-xl mb-4 overflow-hidden transition-all duration-300 group-hover:scale-105",
                  isDark ? "bg-gradient-to-br from-white/5 to-white/[0.02]" : "bg-gradient-to-br from-surface-50 to-surface-100"
                )}>
                  {pizza.photo ? (
                    <PizzaImage
                      src={pizza.photo.srcThumb || pizza.photo.src}
                      srcLarge={pizza.photo.src}
                      alt={pizza.photo.alt || pizza.name}
                      containerClassName="w-full h-full"
                      className="transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl">🍕</span>
                    </div>
                  )}
                </div>

                <h3 className={cn(
                  "font-display font-semibold text-base mb-1.5 transition-colors",
                  isDark ? "text-white group-hover:text-brand-400" : "text-surface-900 group-hover:text-brand-600"
                )}>
                  {pizza.name}
                </h3>
                <p className={cn(
                  "text-xs leading-relaxed mb-4 line-clamp-2",
                  isDark ? "text-white/40" : "text-surface-500"
                )}>
                  {pizza.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-lg font-display font-bold",
                    isDark ? "text-white" : "text-surface-900"
                  )}>
                    {pizza.price}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-200",
                      isDark
                        ? "bg-white/5 text-white/60 hover:bg-brand-500/20 hover:text-brand-400"
                        : "bg-surface-100 text-surface-500 hover:bg-brand-50 hover:text-brand-600"
                    )}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to={ROUTES.MENU}
            className={cn(
              "inline-flex items-center gap-2 font-semibold transition-all duration-300 group",
              isDark ? "text-brand-400 hover:text-brand-300" : "text-brand-600 hover:text-brand-700"
            )}
          >
            View Full Menu
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const { isDark } = useDarkMode();
  return (
    <section id="why-us" className={cn("py-20 md:py-32 transition-colors duration-300", isDark ? "bg-dark-900/50" : "bg-surface-50")}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="text-center mb-12 md:mb-16"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border",
            isDark ? "bg-brand-500/10 text-brand-400 border-brand-500/20" : "bg-brand-50 text-brand-600 border-brand-200"
          )}>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
            Why Us
          </span>
          <h2 className={cn(
            "text-section font-display font-bold mb-4 tracking-tight",
            isDark ? "text-white" : "text-surface-900"
          )}>
            The PizzaCraft{' '}
            <span className="text-gradient-brand">Difference</span>
          </h2>
          <p className={cn(
            "max-w-xl mx-auto",
            isDark ? "text-white/40" : "text-surface-500"
          )}>
            We're not just another pizza delivery. We're a passion project dedicated to bringing you the finest pizza experience.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {whyChooseUs.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.08, duration: 0.5, ease: easing }}
              className={cn(
                "group relative p-6 rounded-2xl border transition-all duration-500",
                isDark
                  ? "bg-dark-900/60 border-white/[0.04] hover:border-brand-500/20 hover:shadow-glow-brand-sm"
                  : "bg-white border-surface-200 hover:border-brand-200 hover:shadow-lg"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-brand-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-500" />
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
                  "text-base font-display font-semibold mb-2 transition-colors",
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const { isDark } = useDarkMode();
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="text-center mb-12 md:mb-16"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border",
            isDark ? "bg-accent-500/10 text-accent-400 border-accent-500/20" : "bg-accent-50 text-accent-600 border-accent-200"
          )}>
            <span className="w-1.5 h-1.5 bg-accent-500 rounded-full" />
            How It Works
          </span>
          <h2 className={cn(
            "text-section font-display font-bold mb-4 tracking-tight",
            isDark ? "text-white" : "text-surface-900"
          )}>
            Four Steps to{' '}
            <span className="text-gradient-accent">Pizza Perfection</span>
          </h2>
          <p className={cn(
            "max-w-xl mx-auto",
            isDark ? "text-white/40" : "text-surface-500"
          )}>
            From your first click to the last bite, we've perfected every step of the journey.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className={cn(
            "absolute top-12 left-0 right-0 h-px hidden lg:block",
            isDark ? "bg-white/[0.06]" : "bg-surface-200"
          )} aria-hidden="true" />

          {howItWorks.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: easing }}
              className="relative text-center"
            >
              <div className={cn(
                "relative w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center z-10 transition-all duration-300",
                isDark
                  ? "bg-gradient-to-br from-accent-500/20 to-accent-600/20 border border-accent-500/20 text-accent-400"
                  : "bg-gradient-to-br from-accent-50 to-accent-100 border border-accent-200 text-accent-600"
              )}>
                {step.icon}
              </div>
              <div className={cn(
                "text-xs font-mono font-semibold mb-2",
                isDark ? "text-accent-400/60" : "text-accent-500/60"
              )}>
                STEP {step.step}
              </div>
              <h3 className={cn(
                "text-base font-display font-semibold mb-2",
                isDark ? "text-white" : "text-surface-900"
              )}>
                {step.title}
              </h3>
              <p className={cn(
                "text-sm leading-relaxed",
                isDark ? "text-white/40" : "text-surface-500"
              )}>
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Categories() {
  const { isDark } = useDarkMode();
  return (
    <section className={cn("py-20 md:py-32 transition-colors duration-300", isDark ? "bg-dark-900/50" : "bg-surface-50")}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="text-center mb-12 md:mb-16"
        >
          <span className={cn(
            "inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border",
            isDark ? "bg-brand-500/10 text-brand-400 border-brand-500/20" : "bg-brand-50 text-brand-600 border-brand-200"
          )}>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
            Categories
          </span>
          <h2 className={cn(
            "text-section font-display font-bold mb-4 tracking-tight",
            isDark ? "text-white" : "text-surface-900"
          )}>
            Explore Our{' '}
            <span className="text-gradient-brand">Collections</span>
          </h2>
          <p className={cn(
            "max-w-xl mx-auto",
            isDark ? "text-white/40" : "text-surface-500"
          )}>
            From classic favorites to bold new creations, find your perfect pizza.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.06, duration: 0.5, ease: easing }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={cn(
                "group relative p-5 rounded-2xl border text-center cursor-pointer transition-all duration-500",
                isDark
                  ? "bg-dark-900/60 border-white/[0.04] hover:border-brand-500/20"
                  : "bg-white border-surface-200 hover:border-brand-200 hover:shadow-lg"
              )}
            >
              <div className={cn(
                "w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br transition-all duration-300 group-hover:scale-110",
                category.color,
                "text-white"
              )}>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={category.icon} />
                </svg>
              </div>
              <h3 className={cn(
                "font-display font-semibold text-sm mb-1 transition-colors",
                isDark ? "text-white group-hover:text-brand-400" : "text-surface-900 group-hover:text-brand-600"
              )}>
                {category.name}
              </h3>
              <span className={cn(
                "text-xs",
                isDark ? "text-white/30" : "text-surface-400"
              )}>
                {category.count} pizzas
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  const { isDark } = useDarkMode();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800" />
      <div className="absolute inset-0 bg-noise opacity-30" />
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-black/10 rounded-full blur-3xl" />
      </div>
      <div className="relative section text-center">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: easing }}
          >
            <h2 className="text-section md:text-hero-sm font-display font-bold text-white mb-4 tracking-tight">
              Ready for the Best Pizza?
            </h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of happy customers and experience the PizzaCraft difference.
              Your first order comes with a special discount.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.MENU}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-white text-brand-600 font-semibold rounded-2xl shadow-elevation-3 hover:shadow-elevation-4 hover:bg-white/95 transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
              >
                Order Now
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="tel:+1234567890"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-2xl hover:bg-white/10 hover:border-white/50 transition-all duration-300 active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand-600"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroSection />
      <StatsBar />
      <FeaturedPizzas />
      <WhyChooseUs />
      <HowItWorks />
      <Categories />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
}
