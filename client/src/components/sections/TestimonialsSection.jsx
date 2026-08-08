import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDarkMode, useMediaQuery } from '../../hooks';
import { cn } from '../../utils/helpers';
import { testimonials } from '../../data/testimonials';

const easing = [0.16, 1, 0.3, 1];

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={cn('w-3.5 h-3.5', i < rating ? 'text-amber-400' : 'text-surface-300 dark:text-white/10')}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, isDark }) {
  return (
    <div
      className={cn(
        'group relative flex-shrink-0 w-[340px] sm:w-[380px] p-6 rounded-2xl border transition-all duration-500',
        'hover:scale-[1.02] hover:shadow-xl',
        isDark
          ? 'bg-white/[0.03] border-white/[0.06] hover:border-brand-500/20 hover:bg-white/[0.05] hover:shadow-brand-500/5'
          : 'bg-white border-surface-200/80 hover:border-brand-200 hover:shadow-surface-900/5'
      )}
    >
      {/* Verified badge */}
      {testimonial.verified && (
        <div className="absolute top-5 right-5">
          <div className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
            isDark ? 'bg-success-500/10 text-success-400' : 'bg-success-50 text-success-600'
          )}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.403 12.652a3 3 0 000-5.304 3 3 0 00-3.75-3.751 3 3 0 00-5.305 0 3 3 0 00-3.751 3.75 3 3 0 000 5.305 3 3 0 003.75 3.751 3 3 0 005.305 0 3 3 0 003.751-3.75zm-2.546-4.46a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
            </svg>
            Verified
          </div>
        </div>
      )}

      {/* Rating */}
      <div className="mb-4">
        <StarRating rating={testimonial.rating} />
      </div>

      {/* Quote */}
      <p className={cn(
        'text-sm leading-relaxed mb-6 line-clamp-4',
        isDark ? 'text-white/55' : 'text-surface-600'
      )}>
        &ldquo;{testimonial.text}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-dashed" style={{ borderColor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)' }}>
        {/* Avatar */}
        <div className={cn(
          'w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm flex-shrink-0',
          isDark ? 'bg-brand-500/15 text-brand-400' : 'bg-brand-50 text-brand-600'
        )}>
          {testimonial.avatar}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              'font-semibold text-sm truncate',
              isDark ? 'text-white' : 'text-surface-900'
            )}>
              {testimonial.name}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className={cn(
              'text-xs truncate',
              isDark ? 'text-white/35' : 'text-surface-400'
            )}>
              {testimonial.role}
            </span>
            {testimonial.location && (
              <>
                <span className={isDark ? 'text-white/15' : 'text-surface-300'}>&middot;</span>
                <span className={cn(
                  'text-xs truncate',
                  isDark ? 'text-white/25' : 'text-surface-400'
                )}>
                  {testimonial.location}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tag */}
      {testimonial.tag && (
        <div className="mt-3">
          <span className={cn(
            'inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider',
            isDark ? 'bg-white/[0.04] text-white/30' : 'bg-surface-100 text-surface-400'
          )}>
            {testimonial.tag}
          </span>
        </div>
      )}
    </div>
  );
}

export default function TestimonialsSection() {
  const { isDark } = useDarkMode();
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const trackRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate testimonials for seamless loop
  const loopedTestimonials = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section id="testimonials" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background treatment */}
      <div className={cn(
        'absolute inset-0 transition-colors duration-300',
        isDark ? 'bg-dark-925/50' : 'bg-surface-50/50'
      )} />
      <div className={cn(
        'absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] transition-colors duration-300',
        isDark ? 'bg-brand-500/5' : 'bg-brand-500/8'
      )} />

      <div className="relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: easing }}
          className="text-center mb-12 md:mb-16 px-4"
        >
          <span className={cn(
            'inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-4 border',
            isDark ? 'bg-brand-500/10 text-brand-400 border-brand-500/20' : 'bg-brand-50 text-brand-600 border-brand-200'
          )}>
            <span className="w-1.5 h-1.5 bg-brand-500 rounded-full" />
            Testimonials
          </span>
          <h2 className={cn(
            'text-section font-display font-bold mb-4 tracking-tight',
            isDark ? 'text-white' : 'text-surface-900'
          )}>
            Loved by{' '}
            <span className="text-gradient-brand">Thousands</span>
          </h2>
          <p className={cn(
            'max-w-xl mx-auto',
            isDark ? 'text-white/40' : 'text-surface-500'
          )}>
            Don&apos;t just take our word for it. Here&apos;s what our customers say.
          </p>
        </motion.div>

        {/* Marquee */}
        <div
          className="relative"
          onMouseEnter={() => !prefersReducedMotion && setIsPaused(true)}
          onMouseLeave={() => !prefersReducedMotion && setIsPaused(false)}
        >
          {/* Fade edges */}
          <div className={cn(
            'absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none',
            'bg-gradient-to-r from-white dark:from-dark-925 to-transparent'
          )} />
          <div className={cn(
            'absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none',
            'bg-gradient-to-l from-white dark:from-dark-925 to-transparent'
          )} />

          {/* Track */}
          <div className="overflow-hidden">
            <div
              ref={trackRef}
              className={cn(
                'flex gap-5 w-max',
                !prefersReducedMotion && 'animate-marquee',
                isPaused && !prefersReducedMotion && 'animate-paused'
              )}
            >
              {loopedTestimonials.map((testimonial, index) => (
                <TestimonialCard
                  key={`${testimonial.id}-${index}`}
                  testimonial={testimonial}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Static fallback for reduced motion */}
        {prefersReducedMotion && (
          <div className="max-w-6xl mx-auto px-4 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  testimonial={testimonial}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
