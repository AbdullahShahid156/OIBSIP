import { verifyToken } from '../services/authService.js';
import User from '../models/User.js';
import { AppError } from './errorHandler.js';

export async function protect(req, res, next) {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('You are not logged in. Please log in to access this resource.', 401);
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      throw new AppError('User recently changed password. Please log in again.', 401);
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      next(new AppError('Invalid token. Please log in again.', 401));
    } else if (error.name === 'TokenExpiredError') {
      next(new AppError('Token expired. Please log in again.', 401));
    } else {
      next(error);
    }
  }
}
