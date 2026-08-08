import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn, formatCurrency } from '../../utils/helpers';
import { PIZZA_BY_CATEGORY, PIZZA_BY_NAME } from '../../data/images';
import { addItemLocal, openDrawer } from '../../store/slices/cartSlice';
import { loadPreset } from '../../store/slices/builderSlice';
import PIZZA_CONFIGS from '../../data/pizzaConfigs';
import { BASE_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS, VEGGIE_OPTIONS } from '../../data/pizzaBuilder';
import PizzaImage from '../ui/PizzaImage';

const categoryColors = {
  classic: 'brand',
  premium: 'accent',
  vegetarian: 'success',
  specialty: 'info',
  'meat-lovers': 'danger',
  signature: 'warning',
};

export default function PizzaDetailModal({ pizza, onClose }) {
  const { isDark } = useDarkMode();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = useCallback(() => {
    if (!pizza?.isAvailable) return;
    const config = PIZZA_CONFIGS[pizza.name];
    if (!config) return;

    const baseObj = BASE_OPTIONS.find((b) => b.id === config.base);
    const sauceObj = SAUCE_OPTIONS.find((s) => s.id === config.sauce);
    const cheeseObj = CHEESE_OPTIONS.find((c) => c.id === config.cheese);

    const veggies = {};
    const veggieNames = {};
    Object.entries(config.veggies).forEach(([vid, qty]) => {
      const opt = VEGGIE_OPTIONS.find((v) => v.id === vid);
      if (opt) {
        veggies[vid] = qty;
        veggieNames[vid] = opt.name;
      }
    });

    const configId = `predefined-${pizza._id}-${Date.now()}`;

    dispatch(addItemLocal({
      _id: configId,
      pizzaId: pizza._id,
      name: pizza.name,
      image: pizza.image || '',
      size: 'medium',
      base: config.base,
      baseName: baseObj?.name || '',
      sauce: config.sauce,
      sauceName: sauceObj?.name || '',
      cheese: config.cheese,
      cheeseName: cheeseObj?.name || '',
      veggies,
      veggieNames,
      qty: 1,
      unitPrice: pizza.basePrice,
      totalPrice: pizza.basePrice,
      prepTime: pizza.preparationTime,
      isCustomized: false,
      configurationId: configId,
    }));

    setAddedToCart(true);
    setTimeout(() => {
      setAddedToCart(false);
      onClose();
      dispatch(openDrawer());
    }, 1200);
  }, [pizza, dispatch, onClose]);

  const handleCustomize = useCallback(() => {
    const config = PIZZA_CONFIGS[pizza.name];
    if (config) {
      dispatch(loadPreset({
        config,
        basePrice: pizza.basePrice,
        name: pizza.name,
      }));
    }
    onClose();
    navigate('/builder');
  }, [pizza, navigate, dispatch, onClose]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!pizza) return null;

  const colorVariant = categoryColors[pizza.category] || 'neutral';
  const fullStars = Math.floor(pizza.rating);
  const hasHalf = pizza.rating % 1 >= 0.3;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={`${pizza.name} details`}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            'relative w-full max-w-lg max-h-[90vh] overflow-hidden overflow-y-auto rounded-2xl shadow-2xl',
            'bg-white dark:bg-dark-900',
            'border border-surface-200 dark:border-white/[0.06]',
            'scrollbar-thin scrollbar-thumb-surface-300 dark:scrollbar-thumb-white/10'
          )}
        >
          {/* Image area */}
          <div className={cn(
            'relative overflow-hidden',
            'aspect-[16/9] sm:aspect-[4/3]',
            isDark ? 'bg-gradient-to-br from-dark-850 to-dark-925' : 'bg-gradient-to-br from-surface-50 to-surface-100'
          )}>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-full h-full"
              >
                {(() => {
                  const photo = PIZZA_BY_NAME[pizza.name] || PIZZA_BY_CATEGORY[pizza.category];
                  return photo ? (
                    <PizzaImage
                      src={photo.srcLarge || photo.src}
                      alt={photo.alt || `${pizza.name} pizza`}
                      containerClassName="w-full h-full"
                      className="object-cover w-full h-full"
                      loading="eager"
                    />
                  ) : (
                    <span className="text-7xl md:text-8xl select-none drop-shadow-lg">🍕</span>
                  );
                })()}
              </motion.div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Close button overlay */}
            <button
              onClick={onClose}
              className={cn(
                'absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200',
                'bg-black/40 backdrop-blur-sm',
                'text-white/80',
                'hover:text-white hover:bg-black/60',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-white'
              )}
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Price overlay */}
            <div className="absolute bottom-4 right-4">
              <span className="px-4 py-2 rounded-xl bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm text-xl font-bold text-surface-900 dark:text-white shadow-lg border border-white/20 dark:border-white/10">
                {formatCurrency(pizza.basePrice)}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h2 className={cn(
                  'text-xl font-display font-bold mb-1',
                  isDark ? 'text-white' : 'text-surface-900'
                )}>
                  {pizza.name}
                </h2>
                <span className={cn(
                  'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border capitalize',
                  colorVariant === 'brand' && 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
                  colorVariant === 'accent' && 'bg-accent-50 text-accent-600 border-accent-200 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500/20',
                  colorVariant === 'success' && 'bg-success-50 text-success-600 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20',
                  colorVariant === 'info' && 'bg-info-50 text-info-600 border-info-200 dark:bg-info-500/10 dark:text-info-400 dark:border-info-500/20',
                  colorVariant === 'danger' && 'bg-danger-50 text-danger-600 border-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20',
                  colorVariant === 'warning' && 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20',
                  colorVariant === 'neutral' && 'bg-surface-100 text-surface-600 border-surface-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10'
                )}>
                  {pizza.category.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={cn(
                      'w-4 h-4',
                      i < fullStars ? 'text-amber-400' :
                      i === fullStars && hasHalf ? 'text-amber-400' :
                      'text-surface-300 dark:text-white/15'
                    )}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className={cn(
                'text-sm font-medium',
                isDark ? 'text-white/60' : 'text-surface-600'
              )}>
                {pizza.rating}
              </span>
              <span className={cn(
                'text-sm',
                isDark ? 'text-white/30' : 'text-surface-400'
              )}>
                ({pizza.reviewCount} reviews)
              </span>
            </div>

            <p className={cn(
              'text-sm leading-relaxed mb-5',
              isDark ? 'text-white/50' : 'text-surface-500'
            )}>
              {pizza.description}
            </p>

            {/* Tags */}
            {pizza.tags && pizza.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {pizza.tags.map((tag) => (
                  <span
                    key={tag}
                    className={cn(
                      'px-2.5 py-1 rounded-lg text-xs font-medium',
                      isDark
                        ? 'bg-white/5 text-white/50 border border-white/[0.06]'
                        : 'bg-surface-100 text-surface-500 border border-surface-200'
                    )}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Info row */}
            <div className={cn(
              'flex items-center gap-6 p-4 rounded-xl mb-5',
              isDark ? 'bg-white/[0.03] border border-white/[0.04]' : 'bg-surface-50 border border-surface-100'
            )}>
              <div className="flex items-center gap-2">
                <svg className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-surface-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-surface-500')}>
                  {pizza.preparationTime} min
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg className={cn('w-4 h-4', isDark ? 'text-white/30' : 'text-surface-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className={cn('text-sm', isDark ? 'text-white/50' : 'text-surface-500')}>
                  {pizza.isAvailable ? 'Available Now' : 'Currently Unavailable'}
                </span>
              </div>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={!pizza.isAvailable}
                className={cn(
                  'flex-1 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 border',
                  addedToCart
                    ? 'bg-success-50 border-success-200 text-success-600 dark:bg-success-500/10 dark:border-success-500/20 dark:text-success-400'
                    : isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white'
                      : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100',
                  !pizza.isAvailable && 'opacity-50 cursor-not-allowed'
                )}
              >
                {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCustomize}
                disabled={!pizza.isAvailable}
                className={cn(
                  'flex-1 py-3.5 rounded-xl text-sm font-semibold',
                  'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
                  'shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40',
                  'hover:from-brand-400 hover:to-brand-500',
                  'transition-all duration-300',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  !pizza.isAvailable && 'opacity-50 cursor-not-allowed'
                )}
              >
                {pizza.isAvailable ? 'Customize' : 'Unavailable'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
