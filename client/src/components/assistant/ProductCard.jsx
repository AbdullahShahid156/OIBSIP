import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addItemLocal } from '../../store/slices/cartSlice';
import { PIZZA_BY_NAME } from '../../data/images';
import PIZZA_CONFIGS from '../../data/pizzaConfigs';
import { BASE_PRICE } from '../../data/pizzaBuilder';

export default function ProductCard({ pizza, onCustomize, onAddToCart }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const photo = PIZZA_BY_NAME[pizza.name];
  const hasConfig = PIZZA_CONFIGS[pizza.name];

  function handleAddToCart() {
    if (!hasConfig) {
      toast.error('This pizza is only available for dine-in');
      return;
    }

    const config = hasConfig;
    const sizeMultiplier = 1;
    const unitPrice = Math.round(pizza.basePrice * sizeMultiplier * 100) / 100;
    const configurationId = `preset-${pizza.name.replace(/\s/g, '-').toLowerCase()}`;

    const cartItem = {
      _id: `chat-${Date.now()}`,
      pizzaId: pizza._id,
      name: pizza.name,
      image: photo?.srcThumb || '',
      size: 'medium',
      base: config.base,
      baseName: config.base,
      sauce: config.sauce,
      sauceName: config.sauce,
      cheese: config.cheese,
      cheeseName: config.cheese,
      veggies: config.veggies || {},
      veggieNames: {},
      qty: 1,
      unitPrice,
      totalPrice: unitPrice,
      prepTime: pizza.preparationTime || 10,
      isCustomized: false,
      configurationId,
    };

    dispatch(addItemLocal(cartItem));
    dispatch({ type: 'cart/openDrawer' });
    toast.success(`${pizza.name} added to cart!`);
  }

  function handleCustomize() {
    if (!hasConfig) {
      toast.error('Customization not available for this pizza');
      return;
    }
    if (onCustomize) {
      onCustomize(pizza);
    } else {
      navigate('/builder');
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="flex-shrink-0 w-52 rounded-xl border border-surface-200 dark:border-white/[0.08] overflow-hidden
        bg-white dark:bg-dark-900/80 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
    >
      {photo && (
        <div className="h-24 overflow-hidden bg-surface-100 dark:bg-dark-800">
          <img
            src={photo.srcThumb}
            alt={photo.alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h4 className="text-xs font-semibold text-surface-900 dark:text-white line-clamp-1">
            {pizza.name}
          </h4>
          {pizza.rating > 0 && (
            <span className="flex items-center gap-0.5 text-2xs font-medium text-amber-600 dark:text-amber-400">
              <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {pizza.rating.toFixed(1)}
            </span>
          )}
        </div>

        <p className="text-2xs text-surface-500 dark:text-white/40 line-clamp-1 mb-2">
          {pizza.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
            ${pizza.basePrice.toFixed(2)}
          </span>

          <div className="flex gap-1">
            {hasConfig && (
              <button
                onClick={handleCustomize}
                className="px-2 py-1 text-2xs font-medium rounded-md
                  bg-surface-100 text-surface-600 hover:bg-surface-200
                  dark:bg-white/[0.06] dark:text-white/60 dark:hover:bg-white/10
                  transition-colors duration-200"
              >
                Customize
              </button>
            )}
            <button
              onClick={handleAddToCart}
              className="px-2 py-1 text-2xs font-medium rounded-md
                bg-brand-500 text-white hover:bg-brand-600
                shadow-sm shadow-brand-500/20 transition-colors duration-200"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
