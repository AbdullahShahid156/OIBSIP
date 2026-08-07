import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

/* ============================================
   BUTTON COMPONENT
   ============================================ */

const buttonVariants = {
  primary: 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-400 hover:to-brand-500 focus:ring-brand-500 shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
  accent: 'bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-400 hover:to-accent-500 focus:ring-accent-500 shadow-lg shadow-accent-500/25 hover:shadow-accent-500/40',
  outline: 'border-2 border-surface-200 text-surface-700 hover:bg-surface-50 focus:ring-surface-500 dark:border-white/10 dark:text-white dark:hover:bg-white/5 dark:focus:ring-white/20',
  ghost: 'text-surface-600 hover:text-surface-900 hover:bg-surface-100 focus:ring-surface-500 dark:text-white/70 dark:hover:text-white dark:hover:bg-white/5 dark:focus:ring-white/20',
  danger: 'bg-gradient-to-r from-danger-500 to-danger-600 text-white hover:from-danger-400 hover:to-danger-500 focus:ring-danger-500 shadow-lg shadow-danger-500/25',
  success: 'bg-gradient-to-r from-success-500 to-success-600 text-white hover:from-success-400 hover:to-success-500 focus:ring-success-500 shadow-lg shadow-success-500/25',
  link: 'text-brand-500 hover:text-brand-600 underline-offset-4 hover:underline focus:ring-brand-500 p-0 h-auto',
};

const buttonSizes = {
  xs: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
  sm: 'px-4 py-2.5 text-sm rounded-lg gap-2',
  md: 'px-6 py-3.5 text-base rounded-xl gap-2.5',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-3',
  xl: 'px-10 py-5 text-xl rounded-2xl gap-3',
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  loading,
  icon,
  iconRight,
  fullWidth,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={cn(
        'inline-flex items-center justify-center font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        buttonVariants[variant],
        buttonSizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
      {iconRight && <span className="shrink-0">{iconRight}</span>}
    </motion.button>
  );
});

Button.displayName = 'Button';

/* ============================================
   INPUT COMPONENT
   ============================================ */

export const Input = forwardRef(({
  label,
  error,
  helperText,
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-600 mb-2 dark:text-white/60">
          {label}
          {props.required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200',
          'dark:bg-dark-850 dark:border-white/[0.08] dark:text-white dark:placeholder-white/30',
          error && 'border-danger-500/50 focus:ring-danger-500/50 focus:border-danger-500/50',
          props.disabled && 'opacity-60 cursor-not-allowed bg-surface-100 dark:bg-dark-900',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          'text-sm mt-1.5',
          error ? 'text-danger-500' : 'text-surface-500 dark:text-white/40'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/* ============================================
   TEXTAREA COMPONENT
   ============================================ */

export const Textarea = forwardRef(({
  label,
  error,
  helperText,
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-600 mb-2 dark:text-white/60">
          {label}
          {props.required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={cn(
          'w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 min-h-[120px] resize-y',
          'dark:bg-dark-850 dark:border-white/[0.08] dark:text-white dark:placeholder-white/30',
          error && 'border-danger-500/50 focus:ring-danger-500/50 focus:border-danger-500/50',
          props.disabled && 'opacity-60 cursor-not-allowed bg-surface-100 dark:bg-dark-900',
          className
        )}
        {...props}
      />
      {(error || helperText) && (
        <p className={cn(
          'text-sm mt-1.5',
          error ? 'text-danger-500' : 'text-surface-500 dark:text-white/40'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

/* ============================================
   SELECT COMPONENT
   ============================================ */

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  placeholder = 'Select an option',
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('w-full', containerClassName)}>
      {label && (
        <label className="block text-sm font-medium text-surface-600 mb-2 dark:text-white/60">
          {label}
          {props.required && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={cn(
          'w-full px-4 py-3.5 bg-surface-50 border border-surface-200 rounded-xl text-surface-900 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500/50 transition-all duration-200 appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%236b7280%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M5.23%207.21a.75.75%200%20011.06.02L10%2011.168l3.71-3.938a.75.75%200%20111.08%201.04l-4.25%204.5a.75.75%200%2001-1.08%200l-4.25-4.5a.75.75%200%2001.02-1.06z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          'dark:bg-dark-850 dark:border-white/[0.08] dark:text-white dark:placeholder-white/30',
          error && 'border-danger-500/50 focus:ring-danger-500/50 focus:border-danger-500/50',
          props.disabled && 'opacity-60 cursor-not-allowed bg-surface-100 dark:bg-dark-900',
          className
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {(error || helperText) && (
        <p className={cn(
          'text-sm mt-1.5',
          error ? 'text-danger-500' : 'text-surface-500 dark:text-white/40'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

/* ============================================
   CHECKBOX COMPONENT
   ============================================ */

export const Checkbox = forwardRef(({
  label,
  error,
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('flex items-start gap-3', containerClassName)}>
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'w-5 h-5 mt-0.5 rounded border-2 border-surface-300 bg-white text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 cursor-pointer transition-all duration-200',
          'dark:border-white/20 dark:bg-dark-850',
          error && 'border-danger-500/50',
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm text-surface-600 dark:text-white/60 cursor-pointer select-none">
          {label}
        </label>
      )}
      {error && (
        <p className="text-sm text-danger-500 mt-0.5">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

/* ============================================
   RADIO COMPONENT
   ============================================ */

export const Radio = forwardRef(({
  label,
  error,
  className,
  containerClassName,
  ...props
}, ref) => {
  return (
    <div className={cn('flex items-start gap-3', containerClassName)}>
      <input
        ref={ref}
        type="radio"
        className={cn(
          'w-5 h-5 mt-0.5 rounded-full border-2 border-surface-300 bg-white text-brand-500 focus:ring-brand-500/50 focus:ring-offset-0 cursor-pointer transition-all duration-200',
          'dark:border-white/20 dark:bg-dark-850',
          error && 'border-danger-500/50',
          className
        )}
        {...props}
      />
      {label && (
        <label className="text-sm text-surface-600 dark:text-white/60 cursor-pointer select-none">
          {label}
        </label>
      )}
      {error && (
        <p className="text-sm text-danger-500 mt-0.5">{error}</p>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

/* ============================================
   CARD COMPONENT
   ============================================ */

export const Card = forwardRef(({
  children,
  variant = 'default',
  hover = false,
  className,
  ...props
}, ref) => {
  const variants = {
    default: 'bg-white rounded-2xl border border-surface-200 shadow-sm dark:bg-dark-900/80 dark:backdrop-blur-xl dark:border-white/[0.06]',
    elevated: 'bg-surface-50 rounded-2xl border border-surface-200 shadow-sm dark:bg-gradient-to-b dark:from-dark-850 dark:to-dark-900 dark:border-white/[0.06]',
    flat: 'bg-white rounded-2xl border border-surface-200 dark:bg-dark-900 dark:border-white/[0.06]',
    glass: 'bg-surface-50 backdrop-blur-xl border border-surface-200 rounded-2xl dark:bg-white/[0.03] dark:border-white/[0.06]',
  };

  return (
    <div
      ref={ref}
      className={cn(
        variants[variant],
        hover && 'cursor-pointer hover:shadow-md hover:border-brand-200 dark:hover:border-brand-500/20 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

/* ============================================
   BADGE COMPONENT
   ============================================ */

const badgeVariants = {
  brand: 'bg-brand-50 text-brand-600 border border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
  accent: 'bg-accent-50 text-accent-600 border border-accent-200 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500/20',
  success: 'bg-success-50 text-success-600 border border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20',
  warning: 'bg-warning-50 text-warning-600 border border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20',
  danger: 'bg-danger-50 text-danger-600 border border-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20',
  info: 'bg-info-50 text-info-600 border border-info-200 dark:bg-info-500/10 dark:text-info-400 dark:border-info-500/20',
  neutral: 'bg-surface-100 text-surface-600 border border-surface-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-2xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export const Badge = forwardRef(({
  children,
  variant = 'brand',
  size = 'md',
  dot,
  icon,
  className,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        badgeVariants[variant],
        badgeSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          variant === 'brand' && 'bg-brand-500',
          variant === 'accent' && 'bg-accent-500',
          variant === 'success' && 'bg-success-500',
          variant === 'warning' && 'bg-warning-500',
          variant === 'danger' && 'bg-danger-500',
          variant === 'info' && 'bg-info-500',
          variant === 'neutral' && 'bg-surface-400 dark:bg-white/40'
        )} />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

/* ============================================
   CHIP COMPONENT
   ============================================ */

export const Chip = forwardRef(({
  children,
  selected = false,
  onClick,
  className,
  ...props
}, ref) => {
  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
        selected
          ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/25'
          : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-white/5 dark:text-white/60 dark:hover:bg-white/10',
        className
      )}
      {...props}
    >
      {children}
    </motion.button>
  );
});

Chip.displayName = 'Chip';

/* ============================================
   DIVIDER COMPONENT
   ============================================ */

export const Divider = forwardRef(({
  vertical = false,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        vertical
          ? 'w-px h-full bg-surface-200 dark:bg-white/[0.06]'
          : 'h-px w-full bg-surface-200 dark:bg-white/[0.06]',
        className
      )}
      {...props}
    />
  );
});

Divider.displayName = 'Divider';

/* ============================================
   SKELETON COMPONENT
   ============================================ */

export const Skeleton = forwardRef(({
  variant = 'text',
  className,
  ...props
}, ref) => {
  const variants = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'rounded-full',
    card: 'rounded-2xl',
    image: 'aspect-[4/3] rounded-2xl',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'bg-surface-200 dark:bg-white/10 animate-pulse',
        variants[variant],
        className
      )}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

/* ============================================
   AVATAR COMPONENT
   ============================================ */

export const Avatar = forwardRef(({
  src,
  alt,
  size = 'md',
  fallback,
  className,
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
    '2xl': 'w-20 h-20 text-xl',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'relative inline-flex items-center justify-center rounded-full overflow-hidden bg-surface-200 dark:bg-white/10',
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt || ''} className="w-full h-full object-cover" />
      ) : (
        <span className="font-medium text-surface-600 dark:text-white/60">
          {fallback || '?'}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

/* ============================================
   MODAL COMPONENT
   ============================================ */

export const Modal = forwardRef(({
  open,
  onClose,
  children,
  title,
  description,
  size = 'md',
  className,
  ...props
}, ref) => {
  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]',
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-2xl border border-surface-200 overflow-hidden',
          'dark:bg-dark-900 dark:border-white/[0.06]',
          sizes[size],
          className
        )}
        {...props}
      >
        {(title || description) && (
          <div className="px-6 pt-6 pb-0">
            {title && (
              <h2 className="text-lg font-display font-semibold text-surface-900 dark:text-white">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-surface-500 dark:text-white/40 mt-1">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="p-6">{children}</div>
      </motion.div>
    </div>
  );
});

Modal.displayName = 'Modal';

/* ============================================
   EMPTY STATE COMPONENT
   ============================================ */

export const EmptyState = forwardRef(({
  icon,
  title,
  description,
  action,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center py-16 px-8 text-center',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-surface-100 dark:bg-white/5">
          {icon}
        </div>
      )}
      {title && (
        <h3 className="text-lg font-display font-semibold text-surface-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-surface-500 dark:text-white/40 max-w-sm mb-6">
          {description}
        </p>
      )}
      {action}
    </div>
  );
});

EmptyState.displayName = 'EmptyState';

/* ============================================
   LOADING SPINNER COMPONENT
   ============================================ */

export const Spinner = forwardRef(({
  size = 'md',
  className,
  ...props
}, ref) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <svg
      ref={ref}
      className={cn('animate-spin text-brand-500', sizes[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
});

Spinner.displayName = 'Spinner';

/* ============================================
   PAGE HEADER COMPONENT
   ============================================ */

export const PageHeader = forwardRef(({
  badge,
  title,
  titleGradient,
  description,
  actions,
  className,
  ...props
}, ref) => {
  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-50 to-white dark:from-dark-925 dark:to-dark-950" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] bg-brand-500/10 dark:bg-brand-500/8" />
      <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[120px] bg-accent-500/10 dark:bg-accent-500/5" />

      <div ref={ref} className="container relative z-10">
        <div className={cn('text-center max-w-2xl mx-auto', className)} {...props}>
          {badge && <span className="badge-brand mb-4 inline-flex">{badge}</span>}
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight text-surface-900 dark:text-white">
            {title}
            {titleGradient && (
              <> <span className="text-gradient-brand">{titleGradient}</span></>
            )}
          </h1>
          {description && (
            <p className="text-lg text-surface-500 dark:text-white/40">{description}</p>
          )}
          {actions && <div className="mt-6">{actions}</div>}
        </div>
      </div>
    </section>
  );
});

PageHeader.displayName = 'PageHeader';

/* ============================================
   SECTION CONTAINER COMPONENT
   ============================================ */

export const Section = forwardRef(({
  children,
  variant = 'default',
  className,
  ...props
}, ref) => {
  const variants = {
    default: '',
    alternate: 'bg-surface-50 dark:bg-dark-900/50',
    brand: 'bg-gradient-to-br from-brand-600 to-brand-700',
  };

  return (
    <section
      ref={ref}
      className={cn(
        'py-20 md:py-32',
        variants[variant],
        className
      )}
      {...props}
    >
      <div className="container">{children}</div>
    </section>
  );
});

Section.displayName = 'Section';

/* ============================================
   SECTION HEADER COMPONENT
   ============================================ */

export const SectionHeader = forwardRef(({
  badge,
  title,
  titleGradient,
  description,
  className,
  ...props
}, ref) => {
  return (
    <div ref={ref} className={cn('text-center mb-12 md:mb-16', className)} {...props}>
      {badge && <span className="badge-brand mb-4 inline-flex">{badge}</span>}
      <h2 className="text-section font-display font-bold mb-4 tracking-tight text-surface-900 dark:text-white">
        {title}
        {titleGradient && (
          <> <span className="text-gradient-brand">{titleGradient}</span></>
        )}
      </h2>
      {description && (
        <p className="max-w-xl mx-auto text-surface-500 dark:text-white/40">{description}</p>
      )}
    </div>
  );
});

SectionHeader.displayName = 'SectionHeader';
