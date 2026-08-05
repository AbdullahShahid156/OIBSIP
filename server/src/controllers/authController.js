import crypto from 'crypto';
import User from '../models/User.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  hashToken,
  sendTokenResponse,
} from '../services/authService.js';
import emailService from '../services/emailService.js';
import { getVerificationEmailHTML, getVerificationEmailText } from '../templates/email/verification.js';
import { getPasswordResetEmailHTML, getPasswordResetEmailText } from '../templates/email/passwordReset.js';
import env from '../config/env.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('An account with this email already exists', 409);
    }

    const user = await User.create({ name, email, password });

    const verificationToken = user.createEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    await emailService.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - PizzaCraft',
      html: getVerificationEmailHTML(user.name, verifyUrl),
      text: getVerificationEmailText(user.name, verifyUrl),
    });

    sendTokenResponse(user, 201, res, 'Account created successfully. Please verify your email.');
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new AppError('Invalid email or password', 401);
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res) {
  res.cookie('refreshToken', 'loggedout', {
    httpOnly: true,
    expires: new Date(0),
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.status(200).json({
    status: 'success',
    message: 'Logged out successfully',
  });
}

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  try {
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select('+emailVerificationToken +emailVerificationExpires');

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    sendTokenResponse(user, 200, res, 'Email verified successfully');
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({
        status: 'success',
        message: 'If an account exists with this email, you will receive a password reset link.',
      });
      return;
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`;

    await emailService.sendEmail({
      to: user.email,
      subject: 'Reset Your Password - PizzaCraft',
      html: getPasswordResetEmailHTML(user.name, resetUrl),
      text: getPasswordResetEmailText(user.name, resetUrl),
    });

    res.status(200).json({
      status: 'success',
      message: 'If an account exists with this email, you will receive a password reset link.',
    });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select('+passwordResetToken +passwordResetExpires');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    next(error);
  }
}

export async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      throw new AppError('No refresh token provided', 401);
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    sendTokenResponse(user, 200, res, 'Token refreshed');
  } catch (error) {
    next(error);
  }
}
