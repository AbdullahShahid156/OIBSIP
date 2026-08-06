import { createSlice } from '@reduxjs/toolkit';
import { BASE_PRICE, SIZE_OPTIONS, MAX_VEGGIES, MAX_QTY } from '../../data/pizzaBuilder';

const initialState = {
  currentStep: 0,
  size: 'medium',
  base: null,
  sauce: null,
  cheese: null,
  veggies: {},
  isComplete: false,
};

const builderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setStep(state, action) {
      state.currentStep = action.payload;
    },
    nextStep(state) {
      if (state.currentStep < 4) {
        state.currentStep += 1;
      }
    },
    prevStep(state) {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    setSize(state, action) {
      state.size = action.payload;
    },
    setBase(state, action) {
      state.base = action.payload;
    },
    setSauce(state, action) {
      state.sauce = action.payload;
    },
    setCheese(state, action) {
      state.cheese = action.payload;
    },
    toggleVeggie(state, action) {
      const id = action.payload;
      if (state.veggies[id]) {
        delete state.veggies[id];
      } else {
        const distinctCount = Object.keys(state.veggies).length;
        if (distinctCount < MAX_VEGGIES) {
          state.veggies[id] = 1;
        }
      }
    },
    setVeggieQty(state, action) {
      const { id, qty } = action.payload;
      if (qty <= 0) {
        delete state.veggies[id];
      } else {
        const clamped = Math.min(qty, MAX_QTY);
        state.veggies[id] = clamped;
      }
    },
    setComplete(state, action) {
      state.isComplete = action.payload;
    },
    resetBuilder() {
      return initialState;
    },
  },
});

export const {
  setStep, nextStep, prevStep, setSize,
  setBase, setSauce, setCheese, toggleVeggie, setVeggieQty,
  setComplete, resetBuilder,
} = builderSlice.actions;

function getMultiplier(state) {
  return SIZE_OPTIONS.find((s) => s.id === state.size)?.multiplier || 1;
}

export const selectBasePrice = (state) => {
  return BASE_PRICE * getMultiplier(state.builder);
};

export const selectIngredientCost = (state, allIngredients) => {
  const { base: baseOpts, sauce: sauceOpts, cheese: cheeseOpts, veggies: veggieOpts } = allIngredients;
  const b = state.builder;
  let cost = 0;

  if (b.base) {
    const opt = baseOpts.find((o) => o.id === b.base);
    if (opt) cost += opt.price;
  }
  if (b.sauce) {
    const opt = sauceOpts.find((o) => o.id === b.sauce);
    if (opt) cost += opt.price;
  }
  if (b.cheese) {
    const opt = cheeseOpts.find((o) => o.id === b.cheese);
    if (opt) cost += opt.price;
  }
  Object.entries(b.veggies).forEach(([vid, qty]) => {
    const opt = veggieOpts.find((o) => o.id === vid);
    if (opt) cost += opt.price * qty;
  });

  return cost * getMultiplier(state.builder);
};

export const selectTotal = (state, allIngredients) => {
  return selectBasePrice(state) + selectIngredientCost(state, allIngredients);
};

export const selectPrepTime = (state, allIngredients) => {
  const { base: baseOpts } = allIngredients;
  const b = state.builder;
  if (b.base) {
    const opt = baseOpts.find((o) => o.id === b.base);
    if (opt) return opt.prepTime;
  }
  return 10;
};

export const selectIsStepValid = (state) => {
  const b = state.builder;
  switch (b.currentStep) {
    case 0: return !!b.base;
    case 1: return !!b.sauce;
    case 2: return !!b.cheese;
    case 3: return true;
    case 4: return true;
    default: return false;
  }
};

export default builderSlice.reducer;
