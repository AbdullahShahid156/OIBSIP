import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import env from '../config/env.js';

function generateToken(payload, expiresIn) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

function generateAccessToken(user) {
  return generateToken(
    { id: user._id, email: user.email },
    env.JWT_EXPIRE
  );
}

function generateRefreshToken(user) {
  return generateToken(
    { id: user._id },
    '30d'
  );
}

function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function sendTokenResponse(user, statusCode, res, message) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const cookieOptions = {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  };

  res
    .status(statusCode)
    .cookie('refreshToken', refreshToken, cookieOptions)
    .json({
      status: 'success',
      message,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          avatar: user.avatar || '',
          isEmailVerified: user.isEmailVerified,
          createdAt: user.createdAt,
        },
        accessToken,
      },
    });
}

export {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  hashToken,
  sendTokenResponse,
};
