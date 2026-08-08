import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { cn, formatCurrency } from '../utils/helpers';
import { useDarkMode, useMediaQuery } from '../hooks';
import StepIndicator from '../components/builder/StepIndicator';
import PricePanel from '../components/builder/PricePanel';
import PizzaPreview from '../components/builder/PizzaPreview';
import BaseStep from '../components/builder/steps/BaseStep';
import SauceStep from '../components/builder/steps/SauceStep';
import CheeseStep from '../components/builder/steps/CheeseStep';
import VeggieStep from '../components/builder/steps/VeggieStep';
import ReviewStep from '../components/builder/steps/ReviewStep';
import {
  setStep, nextStep, prevStep, setSize, setBase, setSauce, setCheese, toggleVeggie, setVeggieQty,
  selectBasePrice, selectIngredientCost, selectTotal, selectPrepTime, selectIsStepValid,
  resetBuilder,
} from '../store/slices/builderSlice';
import { addItemLocal, openDrawer } from '../store/slices/cartSlice';
import {
  BASE_OPTIONS, SAUCE_OPTIONS, CHEESE_OPTIONS, VEGGIE_OPTIONS, BUILDER_STEPS,
} from '../data/pizzaBuilder';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

const allIngredients = { base: BASE_OPTIONS, sauce: SAUCE_OPTIONS, cheese: CHEESE_OPTIONS, veggies: VEGGIE_OPTIONS };

export default function PizzaBuilder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDark } = useDarkMode();
  const isMobile = useMediaQuery('(max-width: 1023px)');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [completedSteps, setCompletedSteps] = useState([]);

  const builder = useSelector((state) => state.builder);
  const basePrice = useSelector((state) => selectBasePrice(state));
  const ingredientCost = useSelector((state) => selectIngredientCost(state, allIngredients));
  const total = useSelector((state) => selectTotal(state, allIngredients));
  const prepTime = useSelector((state) => selectPrepTime(state, allIngredients));
  const isStepValid = useSelector((state) => selectIsStepValid(state));

  const handleNext = useCallback(() => {
    setCompletedSteps((prev) => [...new Set([...prev, builder.currentStep])]);
    dispatch(nextStep());
  }, [builder.currentStep, dispatch]);

  const handlePrev = useCallback(() => {
    dispatch(prevStep());
  }, [dispatch]);

  const handleStepClick = useCallback((idx) => {
    dispatch(setStep(idx));
  }, [dispatch]);

  const handleGoToStep = useCallback((idx) => {
    dispatch(setStep(idx));
  }, [dispatch]);

  const handleAddToCart = useCallback(() => {
    const baseObj = BASE_OPTIONS.find((b) => b.id === builder.base);
    const sauceObj = SAUCE_OPTIONS.find((s) => s.id === builder.sauce);
    const cheeseObj = CHEESE_OPTIONS.find((c) => c.id === builder.cheese);

    const veggieNames = {};
    const veggies = {};
    Object.entries(builder.veggies).forEach(([vid, qty]) => {
      const opt = VEGGIE_OPTIONS.find((v) => v.id === vid);
      if (opt) {
        veggies[vid] = qty;
        veggieNames[vid] = opt.name;
      }
    });

    const configId = generateId();
    const isPreset = !!builder.presetName;

    const cartItem = {
      _id: configId,
      pizzaId: isPreset ? `predefined-${builder.presetName}` : 'custom',
      name: isPreset ? builder.presetName : 'Custom Pizza',
      image: '',
      size: builder.size,
      base: builder.base,
      baseName: baseObj?.name || '',
      sauce: builder.sauce,
      sauceName: sauceObj?.name || '',
      cheese: builder.cheese,
      cheeseName: cheeseObj?.name || '',
      veggies,
      veggieNames,
      qty: 1,
      unitPrice: total,
      totalPrice: total,
      prepTime,
      isCustomized: true,
      configurationId: configId,
    };

    dispatch(addItemLocal(cartItem));
    dispatch(openDrawer());
    dispatch(resetBuilder());
  }, [builder, total, prepTime, dispatch]);

  const stepContent = useMemo(() => {
    switch (builder.currentStep) {
      case 0:
        return <BaseStep selected={builder.base} size={builder.size} onSelect={(id) => dispatch(setBase(id))} onSizeChange={(id) => dispatch(setSize(id))} />;
      case 1:
        return <SauceStep selected={builder.sauce} onSelect={(id) => dispatch(setSauce(id))} />;
      case 2:
        return <CheeseStep selected={builder.cheese} onSelect={(id) => dispatch(setCheese(id))} />;
      case 3:
        return <VeggieStep veggies={builder.veggies} onSetQty={(id, qty) => dispatch(setVeggieQty({ id, qty }))} onToggle={(id) => dispatch(toggleVeggie(id))} />;
      case 4:
        return <ReviewStep builder={builder} allIngredients={allIngredients} basePrice={basePrice} ingredientCost={ingredientCost} total={total} prepTime={prepTime} onGoToStep={handleGoToStep} />;
      default:
        return null;
    }
  }, [builder, dispatch, basePrice, ingredientCost, total, prepTime, handleGoToStep]);

  return (
    <div className={cn('min-h-screen transition-colors', isDark ? 'bg-dark-950' : 'bg-surface-50')}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => navigate('/menu')}
              className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                isDark ? 'bg-white/[0.06] hover:bg-white/[0.1] text-white/60' : 'bg-surface-100 hover:bg-surface-200 text-surface-600'
              )}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <div>
              <h1 className={cn('text-xl font-display font-bold', isDark ? 'text-white' : 'text-surface-900')}>
                {builder.presetName ? `Customize ${builder.presetName}` : 'Pizza Builder'}
              </h1>
              <p className={cn('text-xs', isDark ? 'text-white/40' : 'text-surface-500')}>
                {builder.presetName ? 'Tweak the recipe to your taste' : 'Craft your perfect pizza'}
              </p>
            </div>
          </div>
          <StepIndicator currentStep={builder.currentStep} onStepClick={handleStepClick} completedSteps={completedSteps} />
        </motion.div>

        <div className="lg:grid lg:grid-cols-[1fr_340px] lg:gap-6">
          <div className="pb-32 lg:pb-0">
            <motion.div
              key={builder.currentStep}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {stepContent}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn(
                'fixed bottom-0 left-0 right-0 z-30 lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:mt-6',
                'border-t lg:border-t-0 p-4 lg:p-0 backdrop-blur-xl lg:backdrop-blur-none',
                isDark
                  ? 'border-white/[0.06] bg-dark-950/90 lg:bg-transparent'
                  : 'border-surface-200 bg-white/90 lg:bg-transparent'
              )}
            >
              <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
                {builder.currentStep > 0 && builder.currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={handlePrev}
                    whileHover={{ x: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={cn(
                      'px-5 py-3 rounded-xl font-semibold text-sm transition-colors',
                      isDark
                        ? 'bg-white/[0.06] text-white/60 hover:bg-white/[0.1] hover:text-white'
                        : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
                    )}
                  >
                    ← Back
                  </motion.button>
                ) : (
                  <div />
                )}

                {builder.currentStep < 4 ? (
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    disabled={!isStepValid}
                    whileHover={isStepValid ? { scale: 1.02, x: 2 } : {}}
                    whileTap={isStepValid ? { scale: 0.97 } : {}}
                    className={cn(
                      'px-8 py-3 rounded-xl font-bold text-sm transition-all',
                      isStepValid
                        ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40'
                        : isDark
                          ? 'bg-white/[0.06] text-white/20 cursor-not-allowed'
                          : 'bg-surface-200 text-surface-400 cursor-not-allowed'
                    )}
                  >
                    Continue →
                  </motion.button>
                ) : (
                  <motion.button
                    type="button"
                    onClick={handleAddToCart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-8 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40"
                  >
                    🍕 Add to Cart — {formatCurrency(total)}
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6 space-y-4">
              <PizzaPreview
                builder={builder}
                allIngredients={allIngredients}
                isOpen={drawerOpen}
                onToggle={() => setDrawerOpen(!drawerOpen)}
              />
              <PricePanel
                basePrice={basePrice}
                ingredientCost={ingredientCost}
                total={total}
                prepTime={prepTime}
                currentStep={builder.currentStep}
              />
            </div>
          </div>
        </div>
      </div>

      {isMobile && (
        <PizzaPreview
          builder={builder}
          allIngredients={allIngredients}
          isOpen={drawerOpen}
          onToggle={() => setDrawerOpen(!drawerOpen)}
        />
      )}
    </div>
  );
}
