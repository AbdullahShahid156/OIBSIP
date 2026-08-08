import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { chat, getSuggestions } from '../../controllers/assistantController.js';
import { validate } from '../../middleware/validate.js';
import { chatSchema } from '../../validations/assistant.js';

const router = Router();

const assistantLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: {
    status: 'fail',
    message: 'Too many messages. Please wait a moment before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/chat', assistantLimiter, validate(chatSchema), chat);
router.get('/suggestions', getSuggestions);

export default router;
