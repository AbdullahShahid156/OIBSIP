import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  MONGODB_URI: z.string().url({ message: 'Invalid MongoDB URI' }),
  JWT_SECRET: z.string().min(16, { message: 'JWT secret must be at least 16 characters' }),
  JWT_EXPIRE: z.string().default('7d'),
  CLIENT_URL: z.string().url({ message: 'Invalid client URL' }),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  FROM_NAME: z.string().optional(),
  SOCKET_CORS_URL: z.string().optional(),
  GROQ_API_KEY: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  JAZZCASH_MERCHANT_ID: z.string().optional(),
  JAZZCASH_PASSWORD: z.string().optional(),
  JAZZCASH_INTEGRITY_SALT: z.string().optional(),
  JAZZCASH_RETURN_URL: z.string().url().optional(),
  JAZZCASH_SANDBOX_URL: z.string().url().optional(),
});

function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.message).join('\n');
      console.error('❌ Environment validation failed:\n', missingVars);
      process.exit(1);
    }
    throw error;
  }
}

const env = validateEnv();

export default env;
