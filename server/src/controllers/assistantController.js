import { processMessage } from '../services/assistantService.js';

export async function chat(req, res, next) {
  try {
    const { message, conversationHistory = [] } = req.body;

    const result = await processMessage(message, conversationHistory);

    res.status(200).json({
      status: 'success',
      data: {
        reply: result.reply,
        recommendations: result.recommendations,
        provider: result.provider,
        model: result.model || null,
        tokens: result.tokens,
        latencyMs: result.latencyMs,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getSuggestions(req, res, next) {
  try {
    const suggestions = [
      { id: 1, text: 'Recommend a pizza for me', icon: 'sparkles' },
      { id: 2, text: 'What are your most popular pizzas?', icon: 'trending' },
      { id: 3, text: 'I want something vegetarian', icon: 'leaf' },
      { id: 4, text: 'What sizes do you offer?', icon: 'ruler' },
      { id: 5, text: 'I want something spicy', icon: 'fire' },
      { id: 6, text: 'Help me build a custom pizza', icon: 'wrench' },
    ];

    res.status(200).json({
      status: 'success',
      data: { suggestions },
    });
  } catch (error) {
    next(error);
  }
}
