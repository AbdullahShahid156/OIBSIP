import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

let razorpay = null;

function getRazorpayInstance() {
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
    throw new AppError(`Payment gateway error: ${error.message}`, 502);
  }
}

export function verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature) {
  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  return expectedSignature === razorpaySignature;
}

export function generateReceiptPrefix() {
  return `order_${Date.now()}`;
}
