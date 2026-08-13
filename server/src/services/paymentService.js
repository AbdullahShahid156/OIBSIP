import Razorpay from 'razorpay';
import crypto from 'crypto';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

let razorpay = null;
let lastKeyId = null;

function getRazorpayInstance() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new AppError('Razorpay is not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.', 503);
  }
  if (!razorpay || lastKeyId !== env.RAZORPAY_KEY_ID) {
    razorpay = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID,
      key_secret: env.RAZORPAY_KEY_SECRET,
    });
    lastKeyId = env.RAZORPAY_KEY_ID;
  }
  return razorpay;
}

export async function createRazorpayOrder(amountInPaise, receipt, notes = {}) {
  const auth = Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64');

  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt,
      notes,
    }),
  });

  const rawText = await response.text();

  let data;
  try {
    data = rawText ? JSON.parse(rawText) : {};
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new AppError(
      `Razorpay: ${data.error?.description || data.error?.reason || rawText || 'Empty response'}`,
      response.status
    );
  }

  return data;
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

export function generateReceiptId() {
  receiptCounter += 1;
  return `rcpt_${Date.now()}_${receiptCounter}`;
}
