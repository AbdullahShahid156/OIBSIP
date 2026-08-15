import crypto from 'crypto';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';

const JAZZCASH_VERSION = '1.1';
const JAZZCASH_LANGUAGE = 'EN';
const JAZZCASH_CURRENCY = 'PKR';

function computeHash(salt, params) {
  const sortedKeys = Object.keys(params)
    .filter((key) => key.startsWith('pp_') && key !== 'pp_SecureHash' && params[key] !== '' && params[key] !== undefined && params[key] !== null)
    .sort();

  const values = sortedKeys.map((key) => String(params[key]));
  const stringToHash = salt + '&' + values.join('&');

  return crypto
    .createHmac('sha256', salt)
    .update(stringToHash)
    .digest('hex')
    .toUpperCase();
}

export function generateTxnRefNo() {
  const now = new Date();
  const ts = now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
  const rand = Math.floor(Math.random() * 9000 + 1000);
  return `T${ts}${rand}`;
}

export function generateTxnDateTime() {
  const now = new Date();
  return now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0');
}

export function generateTxnExpiry(txnDateTime) {
  const dt = new Date(
    parseInt(txnDateTime.slice(0, 4)),
    parseInt(txnDateTime.slice(4, 6)) - 1,
    parseInt(txnDateTime.slice(6, 8)) + 1,
    parseInt(txnDateTime.slice(8, 10)),
    parseInt(txnDateTime.slice(10, 12)),
    parseInt(txnDateTime.slice(12, 14))
  );
  return dt.getFullYear().toString() +
    String(dt.getMonth() + 1).padStart(2, '0') +
    String(dt.getDate()).padStart(2, '0') +
    String(dt.getHours()).padStart(2, '0') +
    String(dt.getMinutes()).padStart(2, '0') +
    String(dt.getSeconds()).padStart(2, '0');
}

export function formatAmountForJazzCash(amountInPKR) {
  return Math.round(amountInPKR * 100).toString();
}

export function generateSecureHash(params) {
  const salt = env.JAZZCASH_INTEGRITY_SALT;
  if (!salt) throw new AppError('JazzCash integrity salt not configured', 503);
  return computeHash(salt, params);
}

export function generateReturnHash(params) {
  const salt = env.JAZZCASH_INTEGRITY_SALT;
  if (!salt) throw new AppError('JazzCash integrity salt not configured', 503);
  return computeHash(salt, params);
}

export function buildJazzCashPayload({ txnRefNo, amount, billReference, description, returnUrl }) {
  if (!env.JAZZCASH_MERCHANT_ID) throw new AppError('JazzCash merchant ID not configured', 503);
  if (!env.JAZZCASH_PASSWORD) throw new AppError('JazzCash password not configured', 503);

  const txnDateTime = generateTxnDateTime();
  const txnExpiry = generateTxnExpiry(txnDateTime);
  const formattedAmount = formatAmountForJazzCash(amount);

  const params = {
    pp_Version: JAZZCASH_VERSION,
    pp_TxnType: 'OTC',
    pp_Language: JAZZCASH_LANGUAGE,
    pp_MerchantID: env.JAZZCASH_MERCHANT_ID,
    pp_SubMerchantID: '',
    pp_Password: env.JAZZCASH_PASSWORD,
    pp_BankID: '',
    pp_ProductID: '',
    pp_TxnRefNo: txnRefNo,
    pp_Amount: formattedAmount,
    pp_DiscountedAmount: '',
    pp_DiscountBank: '',
    pp_TxnCurrency: JAZZCASH_CURRENCY,
    pp_TxnDateTime: txnDateTime,
    pp_BillReference: billReference,
    pp_Description: description,
    pp_TxnExpiryDateTime: txnExpiry,
    pp_ReturnURL: returnUrl,
  };

  params.pp_SecureHash = generateSecureHash(params);

  return params;
}

export function validateReturnParams(params) {
  const {
    pp_ResponseCode,
    pp_ResponseMessage,
    pp_RetreivalReferenceNo,
    pp_TxnRefNo,
    pp_Amount,
    pp_TxnCurrency,
    pp_SecureHash,
    pp_MerchantID,
  } = params;

  if (!pp_ResponseCode || !pp_TxnRefNo) {
    return { valid: false, message: 'Missing required response parameters' };
  }

  const expectedHash = generateReturnHash(params);

  if (pp_SecureHash !== expectedHash) {
    return { valid: false, message: 'Invalid secure hash' };
  }

  return {
    valid: true,
    responseCode: pp_ResponseCode,
    responseMessage: pp_ResponseMessage,
    retrievalRefNo: pp_RetreivalReferenceNo,
    txnRefNo: pp_TxnRefNo,
    amount: pp_Amount,
    currency: pp_TxnCurrency,
  };
}

export function isJazzCashSuccess(responseCode) {
  return responseCode === '000';
}

export function getJazzCashPaymentStatus(responseCode) {
  if (responseCode === '000') return 'completed';
  if (responseCode === '268' || responseCode === '368') return 'cancelled';
  return 'failed';
}
