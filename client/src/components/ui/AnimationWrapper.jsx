import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { cn } from '../../utils/helpers';

/* ============================================
   ANIMATION PRESETS
   ============================================ */

const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  fadeUp: {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
  },
  fadeDown: {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 30 },
  },
  fadeLeft: {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
  },
  fadeRight: {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 30 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  scaleUp: {
    initial: { opacity: 0, scale: 0.95, y: 20 },
    animate: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 20 },
  },
  slideInRight: {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  },
  slideInLeft: {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  },
  flipX: {
    initial: { opacity: 0, rotateX: -15 },
    animate: { opacity: 1, rotateX: 0 },
    exit: { opacity: 0, rotateX: -15 },
  },
  flipY: {
    initial: { opacity: 0, rotateY: -15 },
    animate: { opacity: 1, rotateY: 0 },
    exit: { opacity: 0, rotateY: -15 },
  },
};

const easing = [0.16, 1, 0.3, 1];

/* ============================================
   ANIMATION WRAPPER
   ============================================ */

export default function AnimationWrapper({
  children,
  animation = 'fadeIn',
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  ...props
}) {
  const selectedAnimation = animations[animation] || animations.fadeIn;

  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.animate}
      viewport={{ once, margin: '-50px' }}
      transition={{ duration, delay, ease: easing }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   PAGE TRANSITION
   ============================================ */

export function PageTransition({ children, className }) {
  return (
    <AnimationWrapper animation="fadeIn" className={className}>
      <AnimationWrapper animation="fadeUp" delay={0.05}>
        {children}
      </AnimationWrapper>
    </AnimationWrapper>
  );
}

/* ============================================
   STAGGER CONTAINER
   ============================================ */

export function StaggerContainer({ children, className, delay = 0.1 }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.08,
            delayChildren: delay,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   STAGGER ITEM
   ============================================ */

export function StaggerItem({ children, className }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            ease: easing,
          },
        },
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   HOVER SCALE
   ============================================ */

export function HoverScale({ children, className, scale = 1.05 }) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   FLOATING ELEMENT
   ============================================ */

export function FloatingElement({
  children,
  className,
  y = [-10, 10, -10],
  rotate = [0, 5, -5, 0],
  duration = 8,
}) {
  return (
    <motion.div
      animate={{ y, rotate }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut' }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   SCROLL PROGRESS
   ============================================ */

export function ScrollProgress({ className }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className={cn('fixed top-0 left-0 right-0 h-0.5 bg-brand-500 origin-left z-50', className)}
      style={{ scaleX }}
    />
  );
}

/* ============================================
   ANIMATE ON VIEW
   ============================================ */

export function AnimateOnView({
  children,
  animation = 'fadeUp',
  className,
  delay = 0,
  duration = 0.6,
  once = true,
  margin = '-50px',
}) {
  const selectedAnimation = animations[animation] || animations.fadeUp;

  return (
    <motion.div
      initial={selectedAnimation.initial}
      whileInView={selectedAnimation.animate}
      viewport={{ once, margin }}
      transition={{ duration, delay, ease: easing }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   TRANSITION GROUP
   ============================================ */

export function TransitionGroup({
  show,
  children,
  animation = 'fadeUp',
  className,
  unmountOnExit = true,
}) {
  const selectedAnimation = animations[animation] || animations.fadeUp;

  return (
    <AnimatePresence mode="wait">
      {show && (
        <motion.div
          initial={selectedAnimation.initial}
          animate={selectedAnimation.animate}
          exit={selectedAnimation.exit}
          transition={{ duration: 0.3, ease: easing }}
          className={cn(className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================
   LAYOUT ANIMATION
   ============================================ */

export function LayoutGroup({ children, className }) {
  return (
    <motion.div
      layout
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

/* ============================================
   ANIMATED COUNTER
   ============================================ */

export function AnimatedCounter({
  from = 0,
  to,
  duration = 2,
  className,
}) {
  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(className)}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration }}
      >
        {to}
      </motion.span>
    </motion.span>
  );
}

/* ============================================
   PRESS EFFECT
   ============================================ */

export function PressEffect({ children, className }) {
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
