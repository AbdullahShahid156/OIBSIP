import { memo, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../../hooks';
import { cn, formatCurrency } from '../../utils/helpers';
import { PIZZA_BY_CATEGORY, PIZZA_BY_NAME } from '../../data/images';
import { addItemLocal, toggleDrawer } from '../../store/slices/cartSlice';
import PIZZA_CONFIGS from '../../data/pizzaConfigs';
import { loadPreset } from '../../store/slices/builderSlice';
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

function StarRating({ rating, reviewCount }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.3;

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={cn(
              'w-3.5 h-3.5',
              i < fullStars
                ? 'text-amber-400'
                : i === fullStars && hasHalf
                ? 'text-amber-400'
                : 'text-surface-300 dark:text-white/15'
            )}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className={cn(
        'text-xs font-medium',
        'text-surface-500 dark:text-white/40'
      )}>
        {rating}
      </span>
      {reviewCount > 0 && (
        <span className={cn(
          'text-xs',
          'text-surface-400 dark:text-white/25'
        )}>
          ({reviewCount})
        </span>
      )}
    </div>
  );
}

const PizzaCard = memo(function PizzaCard({ pizza, onQuickView, index = 0 }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark } = useDarkMode();
  const [addedToCart, setAddedToCart] = useState(false);
  const colorVariant = categoryColors[pizza.category] || 'neutral';

  const handleAddToCart = useCallback(() => {
    if (!pizza.isAvailable) return;
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
    setTimeout(() => setAddedToCart(false), 1500);
  }, [pizza, dispatch]);

  const handleCustomize = useCallback(() => {
    const config = PIZZA_CONFIGS[pizza.name];
    if (config) {
      dispatch(loadPreset({
        config,
        basePrice: pizza.basePrice,
        name: pizza.name,
      }));
    }
    navigate('/builder');
  }, [pizza, navigate, dispatch]);

  const badgeStyles = {
    brand: 'bg-brand-50 text-brand-600 border-brand-200 dark:bg-brand-500/10 dark:text-brand-400 dark:border-brand-500/20',
    accent: 'bg-accent-50 text-accent-600 border-accent-200 dark:bg-accent-500/10 dark:text-accent-400 dark:border-accent-500/20',
    success: 'bg-success-50 text-success-600 border-success-200 dark:bg-success-500/10 dark:text-success-400 dark:border-success-500/20',
    info: 'bg-info-50 text-info-600 border-info-200 dark:bg-info-500/10 dark:text-info-400 dark:border-info-500/20',
    danger: 'bg-danger-50 text-danger-600 border-danger-200 dark:bg-danger-500/10 dark:text-danger-400 dark:border-danger-500/20',
    warning: 'bg-warning-50 text-warning-600 border-warning-200 dark:bg-warning-500/10 dark:text-warning-400 dark:border-warning-500/20',
    neutral: 'bg-surface-100 text-surface-600 border-surface-200 dark:bg-white/5 dark:text-white/60 dark:border-white/10',
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      layout
      className="group relative"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-2xl border transition-all duration-500',
          isDark
            ? 'bg-dark-900/80 backdrop-blur-xl border-white/[0.06] hover:border-brand-500/25 hover:shadow-[0_12px_50px_-12px_rgba(230,57,70,0.25)]'
            : 'bg-white border-surface-200 hover:border-brand-200 hover:shadow-[0_12px_50px_-12px_rgba(230,57,70,0.2)]'
        )}
        role="article"
        aria-label={`${pizza.name} pizza`}
      >
        {/* Image Section */}
        <div className={cn(
          'relative aspect-[4/3] overflow-hidden',
          isDark ? 'bg-gradient-to-br from-dark-850 to-dark-925' : 'bg-gradient-to-br from-surface-50 to-surface-100'
        )}>
          {/* Pizza photograph */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative w-full h-full"
            >
              {(() => {
                const photo = PIZZA_BY_NAME[pizza.name] || PIZZA_BY_CATEGORY[pizza.category];
                return photo ? (
                  <PizzaImage
                    src={photo.srcThumb || photo.src}
                    srcLarge={photo.src}
                    alt={photo.alt || `${pizza.name} pizza`}
                    containerClassName="w-full h-full rounded-t-2xl"
                    className="transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className={cn(
                    'w-full h-full flex items-center justify-center',
                    isDark
                      ? 'bg-gradient-to-br from-brand-500/15 to-brand-600/10'
                      : 'bg-gradient-to-br from-brand-100 to-brand-50'
                  )}>
                    <span className="text-4xl md:text-5xl select-none">🍕</span>
                  </div>
                );
              })()}
            </motion.div>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3 z-10">
            <span className={cn(
              'inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-semibold border uppercase tracking-wider',
              badgeStyles[colorVariant]
            )}>
              {pizza.category.replace('-', ' ')}
            </span>
          </div>

          {/* Popular indicator */}
          {pizza.isPopular && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 text-[11px] font-semibold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Popular
              </span>
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Quick View button on hover */}
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className={cn(
              'absolute bottom-3 left-1/2 -translate-x-1/2 z-10',
              'px-5 py-2 rounded-xl text-sm font-semibold',
              'bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm',
              'text-surface-900 dark:text-white',
              'shadow-lg border border-white/20 dark:border-white/10',
              'opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0',
              'transition-all duration-300',
              'hover:bg-white dark:hover:bg-dark-850',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2'
            )}
            onClick={() => onQuickView?.(pizza)}
            aria-label={`Quick view ${pizza.name}`}
          >
            Quick View
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className={cn(
              'text-base font-display font-semibold leading-tight line-clamp-1 transition-colors duration-300',
              isDark
                ? 'text-white group-hover:text-brand-400'
                : 'text-surface-900 group-hover:text-brand-600'
            )}>
              {pizza.name}
            </h3>
            <span className={cn(
              'text-lg font-bold shrink-0 tabular-nums',
              isDark ? 'text-white' : 'text-surface-900'
            )}>
              {formatCurrency(pizza.basePrice)}
            </span>
          </div>

          <p className={cn(
            'text-sm leading-relaxed mb-3 line-clamp-2',
            isDark ? 'text-white/40' : 'text-surface-500'
          )}>
            {pizza.description}
          </p>

          <StarRating rating={pizza.rating} reviewCount={pizza.reviewCount} />

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100 dark:border-white/[0.04]">
            <div className="flex items-center gap-1.5">
              <svg className={cn(
                'w-3.5 h-3.5',
                isDark ? 'text-white/30' : 'text-surface-400'
              )} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={cn(
                'text-xs font-medium',
                isDark ? 'text-white/35' : 'text-surface-400'
              )}>
                {pizza.preparationTime} min
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Add to Cart — predefined */}
              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={!pizza.isAvailable}
                className={cn(
                  'relative inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold',
                  'transition-all duration-300',
                  'border',
                  addedToCart
                    ? 'bg-success-50 border-success-200 text-success-600 dark:bg-success-500/10 dark:border-success-500/20 dark:text-success-400'
                    : isDark
                      ? 'bg-white/[0.04] border-white/[0.08] text-white/70 hover:bg-white/[0.08] hover:text-white hover:border-white/[0.12]'
                      : 'bg-surface-50 border-surface-200 text-surface-600 hover:bg-surface-100 hover:text-surface-900',
                  !pizza.isAvailable && 'opacity-50 cursor-not-allowed'
                )}
                aria-label={`Add ${pizza.name} to cart`}
              >
                <AnimatePresence mode="wait">
                  {addedToCart ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="cart"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      Add
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Customize — open builder */}
              <motion.button
                onClick={handleCustomize}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold',
                  'transition-all duration-300',
                  'bg-gradient-to-r from-brand-500 to-brand-600 text-white',
                  'shadow-md shadow-brand-500/20 hover:shadow-lg hover:shadow-brand-500/30',
                  'hover:from-brand-400 hover:to-brand-500',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2',
                  !pizza.isAvailable && 'opacity-50 cursor-not-allowed'
                )}
                disabled={!pizza.isAvailable}
                aria-label={`Customize ${pizza.name}`}
              >
                Customize
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
});

export default PizzaCard;
