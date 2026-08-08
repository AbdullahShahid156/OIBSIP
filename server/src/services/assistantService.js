import Pizza from '../models/Pizza.js';
import { callGroq, isGroqAvailable } from './groqProvider.js';
import { generateFallbackResponse } from './fallbackEngine.js';
import logger from '../utils/logger.js';

let cachedPizzas = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getAvailablePizzas() {
  const now = Date.now();
  if (cachedPizzas && now - cacheTimestamp < CACHE_TTL) {
    return cachedPizzas;
  }

  try {
    const pizzas = await Pizza.find({ isAvailable: true })
      .sort({ rating: -1 })
      .select('name description category basePrice rating reviewCount preparationTime tags isFeatured isPopular orderCount');

    cachedPizzas = pizzas;
    cacheTimestamp = now;
    return pizzas;
  } catch (error) {
    logger.error('Failed to fetch pizzas for assistant:', error.message);
    return cachedPizzas || [];
  }
}

export async function processMessage(message, conversationHistory = []) {
  const startTime = Date.now();
  const pizzas = await getAvailablePizzas();

  if (isGroqAvailable()) {
    try {
      const groqMessages = conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));
      groqMessages.push({ role: 'user', content: message });

      const groqResult = await callGroq(groqMessages, pizzas);

      const recommendations = extractRecommendations(groqResult.reply, pizzas);

      return {
        reply: groqResult.reply,
        recommendations,
        provider: 'groq',
        model: groqResult.model,
        tokens: groqResult.tokens,
        latencyMs: Date.now() - startTime,
      };
    } catch (error) {
      logger.warn(`Groq failed, falling back: ${error.message}`);
    }
  }

  const fallbackResult = generateFallbackResponse(message, pizzas, conversationHistory);

  return {
    reply: fallbackResult.reply,
    recommendations: fallbackResult.recommendations.map((p) => ({
      _id: p._id,
      name: p.name,
      description: p.description,
      category: p.category,
      basePrice: p.basePrice,
      rating: p.rating,
      reviewCount: p.reviewCount,
      preparationTime: p.preparationTime,
      tags: p.tags,
      isFeatured: p.isFeatured,
      isPopular: p.isPopular,
    })),
    provider: 'fallback',
    tokens: { prompt: 0, completion: 0, total: 0 },
    latencyMs: Date.now() - startTime,
  };
}

function extractRecommendations(reply, pizzas) {
  if (!pizzas || pizzas.length === 0) return [];

  const matched = [];
  const lowerReply = reply.toLowerCase();

  for (const pizza of pizzas) {
    if (lowerReply.includes(pizza.name.toLowerCase())) {
      matched.push({
        _id: pizza._id,
        name: pizza.name,
        description: pizza.description,
        category: pizza.category,
        basePrice: pizza.basePrice,
        rating: pizza.rating,
        reviewCount: pizza.reviewCount,
        preparationTime: pizza.preparationTime,
        tags: pizza.tags,
        isFeatured: pizza.isFeatured,
        isPopular: pizza.isPopular,
      });
    }
  }

  return matched.slice(0, 4);
}

export function clearPizzaCache() {
  cachedPizzas = null;
  cacheTimestamp = 0;
}
