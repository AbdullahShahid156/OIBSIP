/**
 * Pizza Configurations — Single source of truth
 *
 * Maps each predefined pizza name to its default builder configuration.
 * Used by PizzaCard (Customize button) and PizzaBuilder (loadPreset).
 *
 * Each config defines: base, sauce, cheese, veggies (with quantities).
 * These map directly to builderSlice state fields.
 */

const PIZZA_CONFIGS = {
  'Classic Margherita': {
    base: 'regular',
    sauce: 'marinara',
    cheese: 'mozzarella',
    veggies: {
      tomatoes: 1,
      basil: 1,
    },
  },
  'Pepperoni Supreme': {
    base: 'regular',
    sauce: 'marinara',
    cheese: 'mozzarella',
    veggies: {
      olives: 1,
      red_onion: 1,
    },
  },
  'Truffle Mushroom': {
    base: 'thin',
    sauce: 'garlic_white',
    cheese: 'provolone',
    veggies: {
      mushrooms: 2,
      truffle_oil: 1,
      arugula: 1,
    },
  },
  'Spicy Diavola': {
    base: 'regular',
    sauce: 'marinara',
    cheese: 'mozzarella',
    veggies: {
      jalapenos: 1,
      bell_peppers: 1,
    },
  },
  'Garden Fresh': {
    base: 'thin',
    sauce: 'marinara',
    cheese: 'mozzarella',
    veggies: {
      tomatoes: 1,
      bell_peppers: 1,
      olives: 1,
      artichoke: 1,
      spinach: 1,
    },
  },
  'Prosciutto & Arugula': {
    base: 'thin',
    sauce: 'garlic_white',
    cheese: 'parmesan',
    veggies: {
      arugula: 2,
      sun_dried_tomato: 1,
    },
  },
  'Meat Feast': {
    base: 'thick',
    sauce: 'bbq',
    cheese: 'mozzarella',
    veggies: {
      mushrooms: 1,
      red_onion: 1,
    },
  },
  'BBQ Chicken': {
    base: 'regular',
    sauce: 'bbq',
    cheese: 'gouda',
    veggies: {
      red_onion: 2,
      bell_peppers: 1,
    },
  },
  'Four Cheese': {
    base: 'regular',
    sauce: 'garlic_white',
    cheese: 'mozzarella',
    veggies: {},
  },
  'Mediterranean': {
    base: 'thin',
    sauce: 'pesto',
    cheese: 'mozzarella',
    veggies: {
      sun_dried_tomato: 2,
      olives: 2,
      spinach: 1,
    },
  },
  'Hawaiian Classic': {
    base: 'regular',
    sauce: 'marinara',
    cheese: 'mozzarella',
    veggies: {},
  },
  'The Artisan': {
    base: 'thin',
    sauce: 'pesto',
    cheese: 'parmesan',
    veggies: {
      arugula: 2,
      caramelized_onion: 1,
      sun_dried_tomato: 1,
    },
  },
  'Pesto Chicken': {
    base: 'regular',
    sauce: 'pesto',
    cheese: 'mozzarella',
    veggies: {
      sun_dried_tomato: 2,
      mushrooms: 1,
    },
  },
  'Buffalo Blaze': {
    base: 'regular',
    sauce: 'buffalo',
    cheese: 'mozzarella',
    veggies: {
      jalapenos: 2,
      bell_peppers: 1,
    },
  },
  'Veggie Deluxe': {
    base: 'thin',
    sauce: 'pesto',
    cheese: 'mozzarella',
    veggies: {
      mushrooms: 2,
      tomatoes: 2,
      bell_peppers: 1,
      spinach: 1,
    },
  },
};

export default PIZZA_CONFIGS;
