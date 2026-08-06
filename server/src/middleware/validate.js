import { AppError } from './errorHandler.js';

export function validate(schema) {
  return (req, res, next) => {
    try {
      const result = schema.safeParse(req.body);
      if (!result.success) {
        const message = result.error.errors[0]?.message || 'Validation failed';
        return next(new AppError(message, 400));
      }
      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
