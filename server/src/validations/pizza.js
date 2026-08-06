import { z } from 'zod';

const pizzaCategories = ['classic', 'premium', 'vegetarian', 'specialty', 'meat-lovers', 'signature'];

export const getAllPizzasSchema = z.object({
  query: z.object({
    search: z.string().max(100).optional(),
    category: z.enum(pizzaCategories).optional(),
    isAvailable: z.enum(['true', 'false']).optional(),
    isFeatured: z.enum(['true', 'false']).optional(),
    isPopular: z.enum(['true', 'false']).optional(),
    sort: z.enum(['rating', '-rating', 'price', '-price', 'popular', '-popular', 'newest', '-newest', 'name', '-name']).optional(),
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
  }).optional(),
});

export const getPizzaByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid pizza ID'),
  }),
});
