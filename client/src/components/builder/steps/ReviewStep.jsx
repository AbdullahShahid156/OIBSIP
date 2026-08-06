import { motion } from 'framer-motion';
import { cn, formatCurrency } from '../../../utils/helpers';
import { useDarkMode } from '../../../hooks';
import { STEP_COLORS, SIZE_OPTIONS } from '../../../data/pizzaBuilder';
import { INGREDIENT_PHOTOS } from '../../../data/images';

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

function IngredientChip({ emoji, name, price, qty, onRemove, iconId }) {
  const { isDark } = useDarkMode();
  const photo = INGREDIENT_PHOTOS[iconId];
  return (
    <motion.div
      layout
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
        isDark
          ? 'border-white/[0.08] bg-white/[0.04]'
          : 'border-surface-200 bg-surface-50'
      )}
    >
          {photo ? (
            <img
              src={photo.srcThumb || photo.src}
              alt={photo.alt || name}
              className="w-4 h-4 rounded-sm object-cover"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span className="text-sm">{emoji}</span>
          )}
      <span className={cn('text-xs font-semibold', isDark ? 'text-white/70' : 'text-surface-700')}>{name}</span>
      {qty > 1 && (
        <span className={cn('text-xs font-bold', isDark ? 'text-white/80' : 'text-surface-800')}>×{qty}</span>
      )}
      {price > 0 && (
        <span className={cn('text-[10px] font-bold', isDark ? 'text-accent-400' : 'text-accent-600')}>
          +{formatCurrency(price)}
        </span>
      )}
    </motion.div>
  );
}

export default function ReviewStep({ builder, allIngredients, basePrice, ingredientCost, total, prepTime, onGoToStep }) {
  const { isDark } = useDarkMode();
  const colors = STEP_COLORS.review;

  const sizeObj = SIZE_OPTIONS.find((s) => s.id === builder.size);
  const baseObj = allIngredients.base.find((b) => b.id === builder.base);
  const sauceObj = allIngredients.sauce.find((s) => s.id === builder.sauce);
  const cheeseObj = allIngredients.cheese.find((c) => c.id === builder.cheese);

  const allChips = [];
  if (baseObj) allChips.push({ emoji: baseObj.emoji, name: baseObj.name, price: baseObj.price, qty: 1, iconId: baseObj.id });
  if (sauceObj) allChips.push({ emoji: sauceObj.emoji, name: sauceObj.name, price: sauceObj.price, qty: 1, iconId: sauceObj.id });
  if (cheeseObj) allChips.push({ emoji: cheeseObj.emoji, name: cheeseObj.name, price: cheeseObj.price, qty: 1, iconId: cheeseObj.id });
  Object.entries(builder.veggies).forEach(([vid, qty]) => {
    const opt = allIngredients.veggies.find((v) => v.id === vid);
    if (opt) allChips.push({ emoji: opt.emoji, name: opt.name, price: opt.price * qty, qty, iconId: opt.id });
  });

  return (
    <div>
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3',
            colors.bg, colors.text
          )}
        >
          Step 5 of 5
        </motion.div>
        <h2 className={cn('text-2xl font-display font-bold mb-2', isDark ? 'text-white' : 'text-surface-900')}>
          Review Your Creation
        </h2>
        <p className={cn('text-sm', isDark ? 'text-white/40' : 'text-surface-500')}>
          Almost ready to bake perfection
        </p>
      </div>

      <motion.div variants={stagger} initial="hidden" animate="visible" className="space-y-4">
        <motion.div variants={fadeUp} className={cn(
          'rounded-2xl border p-5',
          isDark ? 'border-white/[0.06] bg-white/[0.03]' : 'border-surface-200 bg-white'
        )}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={cn('font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>
              Your Pizza
            </h3>
            <button
              type="button"
              onClick={() => onGoToStep(0)}
              className={cn('text-xs font-semibold hover:underline', isDark ? 'text-brand-400' : 'text-brand-600')}
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className={cn('p-3 rounded-xl', isDark ? 'bg-white/[0.04]' : 'bg-surface-50')}>
              <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-surface-400')}>Size</p>
              <p className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>
                {sizeObj?.name} ({sizeObj?.inches})
              </p>
            </div>
            <div className={cn('p-3 rounded-xl', isDark ? 'bg-white/[0.04]' : 'bg-surface-50')}>
              <p className={cn('text-[10px] uppercase tracking-wider mb-1', isDark ? 'text-white/30' : 'text-surface-400')}>Servings</p>
              <p className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>
                {sizeObj?.servings} people
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {allChips.map((chip, i) => (
              <IngredientChip key={i} {...chip} />
            ))}
          </div>

          <button
            type="button"
            onClick={() => onGoToStep(3)}
            className={cn(
              'w-full p-3 rounded-xl border-2 border-dashed text-center transition-colors',
              isDark
                ? 'border-white/[0.08] text-white/40 hover:border-white/[0.15] hover:text-white/60'
                : 'border-surface-200 text-surface-400 hover:border-surface-300 hover:text-surface-600'
            )}
          >
            <span className="text-xs font-semibold">+ Add more toppings</span>
          </button>
        </motion.div>

        <motion.div variants={fadeUp} className={cn(
          'rounded-2xl border p-5',
          isDark ? 'border-white/[0.06] bg-white/[0.03]' : 'border-surface-200 bg-white'
        )}>
          <h3 className={cn('font-display font-bold mb-4', isDark ? 'text-white' : 'text-surface-900')}>
            Price Breakdown
          </h3>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <span className={cn('text-xs', isDark ? 'text-white/50' : 'text-surface-500')}>Base ({sizeObj?.name})</span>
              <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>{formatCurrency(basePrice)}</span>
            </div>
            {allChips.filter((c) => c.price > 0).map((chip, i) => {
              const chipPhoto = INGREDIENT_PHOTOS[chip.iconId];
              return (
                <div key={i} className="flex justify-between">
                  <span className={cn('text-xs flex items-center gap-1', isDark ? 'text-white/50' : 'text-surface-500')}>
                    {chipPhoto ? (
                      <img
                        src={chipPhoto.srcThumb || chipPhoto.src}
                        alt={chipPhoto.alt || chip.name}
                        className="w-3.5 h-3.5 rounded-sm object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{chip.emoji}</span>
                    )}
                    {chip.name}{chip.qty > 1 ? ` ×${chip.qty}` : ''}
                  </span>
                  <span className={cn('text-xs font-bold tabular-nums', isDark ? 'text-white/70' : 'text-surface-700')}>+{formatCurrency(chip.price)}</span>
                </div>
              );
            })}
            <div className={cn('border-t pt-2.5 mt-2.5', isDark ? 'border-white/[0.06]' : 'border-surface-200')} />
            <div className="flex justify-between">
              <span className={cn('text-sm font-bold', isDark ? 'text-white' : 'text-surface-900')}>Total</span>
              <span className={cn('text-sm font-bold text-brand-500 tabular-nums')}>{formatCurrency(total)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className={cn(
          'rounded-2xl border p-5 flex items-center gap-4',
          isDark ? 'border-white/[0.06] bg-white/[0.03]' : 'border-surface-200 bg-white'
        )}>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', isDark ? 'bg-white/[0.06]' : 'bg-surface-100')}>
            <svg className={cn('w-6 h-6', isDark ? 'text-white/50' : 'text-surface-500')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className={cn('text-[10px] uppercase tracking-wider', isDark ? 'text-white/30' : 'text-surface-400')}>Estimated Preparation</p>
            <p className={cn('text-lg font-bold tabular-nums', isDark ? 'text-white' : 'text-surface-900')}>{prepTime} minutes</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
