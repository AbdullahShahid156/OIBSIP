import env from '../config/env.js';
import logger from '../utils/logger.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const MAX_TOKENS = 1024;
const TEMPERATURE = 0.7;

function buildSystemPrompt(menuContext) {
  return `You are PizzaCraft's AI Pizza Assistant — a friendly, knowledgeable pizza expert who helps customers discover, customize, and order pizzas.

## Your Role
- Help customers find the perfect pizza for their taste, budget, and dietary needs
- Recommend pizzas from our real menu based on their preferences
- Explain ingredients, flavors, and preparation details
- Guide customers through customization options
- Help with order-related questions (delivery, timing, etc.)

## Rules
1. ONLY recommend pizzas that exist on our real menu (provided below). Never invent prices, products, or ingredients.
2. Keep responses concise (2-4 sentences max) unless the customer asks for details.
3. Be warm, enthusiastic, and knowledgeable about pizza.
4. If asked about something unrelated to pizza, politely redirect to how you can help with their pizza order.
5. Use the customer's name if available.
6. When recommending, include the pizza name, price, and a brief flavor note.

## Available Pizzas
${menuContext}

## Dietary Keywords
- Vegetarian: pizzas with only plant-based toppings
- Gluten-free: available with cauliflower base (+$3.00)
- Vegan: available with vegan cashew cheese (+$2.50)

## Size Options
- Small (10"): 0.8x multiplier, 1-2 servings
- Medium (12"): 1.0x multiplier, 2-3 servings (default)
- Large (14"): 1.25x multiplier, 3-4 servings
- X-Large (16"): 1.5x multiplier, 4-6 servings

## Bases
Thin & Crispy, Classic Hand-Tossed (default), Thick & Fluffy (+$1.00), Cheese Stuffed Crust (+$2.50), Gluten-Free Cauliflower (+$3.00)

## Sauces
San Marzano Marinara (default), Basil Pesto (+$1.50), Smoky BBQ (+$1.00), Garlic Cream White (+$1.50), Spicy Buffalo (+$1.00)

## Cheeses
Fresh Mozzarella (default), Parmigiano Reggiano (+$1.50), Smoked Provolone (+$1.00), Aged Gouda (+$2.00), Vegan Cashew Cheese (+$2.50)

Respond in a natural, conversational tone. Do not use markdown formatting.`;
}

function buildMenuContext(pizzas) {
  if (!pizzas || pizzas.length === 0) {
    return 'Menu data unavailable. Please try again later.';
  }

  return pizzas.map((p) => {
    const tags = p.tags?.length ? ` [${p.tags.join(', ')}]` : '';
    const feat = p.isFeatured ? ' ⭐ FEATURED' : '';
    const pop = p.isPopular ? ' 🔥 POPULAR' : '';
    return `- ${p.name}: $${p.basePrice.toFixed(2)} | ${p.category} | Rating: ${p.rating}/5 (${p.reviewCount} reviews) | ${p.preparationTime}min prep${tags}${feat}${pop}`;
  }).join('\n');
}

export async function callGroq(messages, pizzas) {
  if (!env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured');
  }

  const menuContext = buildMenuContext(pizzas);
  const systemMessage = { role: 'system', content: buildSystemPrompt(menuContext) };

  const payload = {
    model: MODEL,
    messages: [systemMessage, ...messages],
    max_tokens: MAX_TOKENS,
    temperature: TEMPERATURE,
    top_p: 0.9,
    stream: false,
  };

  const startTime = Date.now();

  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      logger.error(`Groq API error ${response.status}: ${errorBody}`);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const elapsed = Date.now() - startTime;

    const reply = data.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      throw new Error('Empty response from Groq API');
    }

    const usage = data.usage || {};

    logger.info(`Groq response in ${elapsed}ms — tokens: ${usage.total_tokens || 'unknown'}`);

    return {
      reply,
      provider: 'groq',
      model: MODEL,
      tokens: {
        prompt: usage.prompt_tokens || 0,
        completion: usage.completion_tokens || 0,
        total: usage.total_tokens || 0,
      },
      latencyMs: elapsed,
    };
  } catch (error) {
    logger.error(`Groq call failed: ${error.message}`);
    throw error;
  }
}

export function isGroqAvailable() {
  return !!env.GROQ_API_KEY;
}
