import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

let razorpay = null;

function getRazorpayInstance() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.', 503);
  }
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

export async function createRazorpayOrder(amountInPaise, receipt, notes = {}) {
  try {
    const instance = getRazorpayInstance();
    const order = await instance.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes,
    });
    return order;
  } catch (error) {
    if (error.statusCode) {
      throw new AppError(`Razorpay: ${error.error?.description || error.message}`, error.statusCode);
    }
    throw new AppError(`Payment gateway error: ${error.message}`, 502);
  }
}

export function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature.length !== razorpaySignature.length) {
    return false;
  }

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'utf8'),
    Buffer.from(razorpaySignature, 'utf8')
  );
}

let receiptCounter = 0;

export function generateReceiptPrefix() {
  receiptCounter += 1;
  return `order_${Date.now()}_${receiptCounter}`;
}
