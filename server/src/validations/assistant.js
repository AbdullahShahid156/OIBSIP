import { z } from 'zod';

export const chatSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(500, 'Message must be 500 characters or less')
    .trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(1000),
      })
    )
    .max(20, 'Conversation history cannot exceed 20 messages')
    .optional()
    .default([]),
});
