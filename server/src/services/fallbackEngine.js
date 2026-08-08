import logger from '../utils/logger.js';

const GREETINGS = [
  "Hey there! Welcome to PizzaCraft! I'm your pizza expert. What kind of pizza are you in the mood for today?",
  "Hi! Great to see you at PizzaCraft! Looking for the perfect pizza? I've got you covered.",
  "Welcome to PizzaCraft! Whether you're craving classic or adventurous, I'll help you find your match.",
];

const UNRELATED_RESPONSES = [
  "I'm all about pizza here at PizzaCraft! Ask me anything about our menu, toppings, or help building your perfect pie.",
  "I'd love to help with your pizza order! Try asking me to recommend a pizza, or tell me about your flavor preferences.",
  "My specialty is pizza perfection! Ask me about our menu, customizations, or dietary options.",
];

const DIETARY_RESPONSES = {
  vegetarian: "For a great vegetarian option, try our Garden Fresh ($14.99) with tomatoes, bell peppers, olives, artichoke, and spinach on thin crust. Or the Mediterranean ($15.99) — pesto base with sun-dried tomatoes and olives. Want me to help you customize one?",
  vegan: "We've got you covered! Our Gluten-Free Cauliflower base is vegan-friendly, and you can add our Vegan Cashew Cheese (+$2.50). The Garden Fresh or Mediterranean work great as vegan options. Want me to build one for you?",
  gluten_free: "Our Gluten-Free Cauliflower base is available for any pizza (+$3.00). It's crispy on the edges and only 180 calories. Pair it with marinara sauce and fresh mozzarella for a classic combo!",
  spicy: "If you like it hot, try the Spicy Diavola ($13.99) with jalapenos and bell peppers, or go bold with the Buffalo Blaze ($14.99) — buffalo sauce, mozzarella, jalapenos, and bell peppers on a classic hand-tossed base!",
  meat: "For meat lovers, the Meat Feast ($16.99) is a powerhouse — BBQ sauce, mozzarella, mushrooms, and red onion on thick crust. Or try the Pepperoni Supreme ($14.99) — a timeless classic!",
};

const SIZE_INFO = "We have 4 sizes: Small (10\", serves 1-2), Medium (12\", serves 2-3, our most popular), Large (14\", serves 3-4), and X-Large (16\", serves 4-6). Prices scale with the multiplier — Medium is the base price!";

const BUILDER_INFO = "You can customize everything in our Pizza Builder! Choose your base (5 options), sauce (5), cheese (5), and up to 8 toppings. The builder shows you the live price as you go. Head to the builder page to start crafting!";

function findBestMatch(message, pizzas) {
  const lower = message.toLowerCase();

  for (const [keyword, response] of Object.entries(DIETARY_RESPONSES)) {
    if (lower.includes(keyword)) {
      return { text: response, recommendations: filterPizzas(pizzas, keyword) };
    }
  }

  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('best') || lower.includes('popular')) {
    const popular = pizzas
      .filter((p) => p.isPopular || p.isFeatured)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);

    if (popular.length > 0) {
      const list = popular.map((p) => `${p.name} ($${p.basePrice.toFixed(2)})`).join(', ');
      return {
        text: `Our top picks right now are: ${list}. Each one is crafted with premium ingredients. Which catches your eye?`,
        recommendations: popular,
      };
    }
  }

  if (lower.includes('price') || lower.includes('cheap') || lower.includes('budget') || lower.includes('affordable')) {
    const sorted = [...pizzas].sort((a, b) => a.basePrice - b.basePrice).slice(0, 3);
    const list = sorted.map((p) => `${p.name} at just $${p.basePrice.toFixed(2)}`).join(', ');
    return {
      text: `Great value picks: ${list}. Our starting price is just $${sorted[0]?.basePrice.toFixed(2) || '8.99'}!`,
      recommendations: sorted,
    };
  }

  if (lower.includes('size') || lower.includes('large') || lower.includes('small') || lower.includes('medium')) {
    return { text: SIZE_INFO, recommendations: [] };
  }

  if (lower.includes('custom') || lower.includes('build') || lower.includes('make') || lower.includes('create')) {
    return { text: BUILDER_INFO, recommendations: [] };
  }

  if (lower.includes('thank')) {
    return { text: "You're welcome! Enjoy your pizza! Feel free to ask if you need anything else. 🍕", recommendations: [] };
  }

  const nameMatch = pizzas.find((p) => {
    const nameLower = p.name.toLowerCase();
    if (lower.includes(nameLower) || nameLower.includes(lower.replace('pizza', '').trim())) {
      return true;
    }
    const nameWords = nameLower.split(/\s+/).filter((w) => w.length > 3);
    return nameWords.some((word) => lower.includes(word));
  });

  if (nameMatch) {
    const tags = nameMatch.tags?.length ? ` (${nameMatch.tags.join(', ')})` : '';
    return {
      text: `Great choice! The ${nameMatch.name} is $${nameMatch.basePrice.toFixed(2)}${tags} — rated ${nameMatch.rating}/5 by ${nameMatch.reviewCount} happy customers. Prepares in about ${nameMatch.preparationTime} minutes. Want to customize it or add it to your cart?`,
      recommendations: [nameMatch],
    };
  }

  return {
    text: UNRELATED_RESPONSES[Math.floor(Math.random() * UNRELATED_RESPONSES.length)],
    recommendations: [],
  };
}

function filterPizzas(pizzas, dietary) {
  const keywords = {
    vegetarian: ['vegetarian'],
    vegan: ['vegetarian'],
    gluten_free: [],
    spicy: ['spicy'],
    meat: ['meat-lovers'],
  };

  const cats = keywords[dietary] || [];
  if (cats.length === 0) return pizzas.slice(0, 3);

  return pizzas
    .filter((p) => cats.includes(p.category))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}

export function generateFallbackResponse(message, pizzas, conversationHistory = []) {
  const startTime = Date.now();

  const lower = message.toLowerCase().trim();

  const isGreeting = /^(hi|hello|hey|yo|sup|howdy|greetings|good\s*(morning|afternoon|evening)|what'?s?\s*up)/i.test(lower);
  if (isGreeting && conversationHistory.length <= 1) {
    return {
      reply: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
      recommendations: pizzas.filter((p) => p.isPopular).slice(0, 3),
      provider: 'fallback',
    };
  }

  const { text, recommendations } = findBestMatch(message, pizzas);
  const elapsed = Date.now() - startTime;

  logger.info(`Fallback response generated in ${elapsed}ms`);

  return {
    reply: text,
    recommendations,
    provider: 'fallback',
  };
}
