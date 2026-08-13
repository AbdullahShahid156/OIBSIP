import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  generateTxnRefNo,
  buildJazzCashPayload,
  validateReturnParams,
  isJazzCashSuccess,
  getJazzCashPaymentStatus,
} from '../services/jazzcashService.js';

export async function initiateJazzCashPayment(req, res, next) {
  try {
    const { addressId, notes } = req.body;

    if (!env.JAZZCASH_MERCHANT_ID) {
      throw new AppError('JazzCash is not configured', 503);
    }

    const existingPending = await Order.findOne({
      user: req.user.id,
      status: 'pending',
      'payment.status': 'pending',
      'payment.method': 'jazzcash',
    }).sort({ createdAt: -1 });

    if (existingPending) {
      existingPending.status = 'cancelled';
      existingPending.payment.status = 'failed';
      await existingPending.save();
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    cart.items = cart.items.filter((item) => item && item.totalPrice);
    if (cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const user = await User.findById(req.user.id);
    if (!user) throw new AppError('User not found', 404);

    const address = user.addresses.id(addressId);
    if (!address) throw new AppError('Invalid delivery address', 400);

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal >= 35 ? 0 : 4.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax - cart.couponDiscount) * 100) / 100;

    if (total <= 0) {
      throw new AppError('Invalid order total', 400);
    }

    const amountInPaise = Math.round(total * 100);
    const txnRefNo = generateTxnRefNo();

    const orderItems = cart.items.map((item) => ({
      pizzaId: item.pizzaId,
      name: item.name,
      image: item.image || '',
      size: item.size,
      base: item.base,
      baseName: item.baseName || '',
      sauce: item.sauce,
      sauceName: item.sauceName || '',
      cheese: item.cheese,
      cheeseName: item.cheeseName || '',
      veggies: item.veggies || {},
      veggieNames: item.veggieNames || {},
      qty: item.qty,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
      prepTime: item.prepTime || 10,
      isCustomized: item.isCustomized || false,
      configurationId: item.configurationId,
    }));

    const maxPrepTime = Math.max(...cart.items.map((i) => i.prepTime || 10));

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      summary: {
        itemCount: cart.items.length,
        subtotal,
        deliveryFee,
        tax,
        couponCode: cart.couponCode || '',
        couponDiscount: cart.couponDiscount || 0,
        total,
        currency: 'PKR',
      },
      address: {
        recipientName: address.recipientName,
        phone: address.phone,
        houseFlat: address.houseFlat,
        street: address.street,
        area: address.area,
        city: address.city,
        postalCode: address.postalCode,
        label: address.label,
      },
      payment: {
        method: 'jazzcash',
        status: 'pending',
        jazzcashTxnRefNo: txnRefNo,
        amount: amountInPaise,
        currency: 'PKR',
      },
      status: 'pending',
      notes: notes || '',
      estimatedDelivery: {
        min: maxPrepTime + 15,
        max: maxPrepTime + 30,
      },
    });

    const payload = buildJazzCashPayload({
      txnRefNo,
      amount: total,
      billReference: order._id.toString(),
      description: `PizzaCraft Order #${order._id.toString().slice(-8).toUpperCase()}`,
      returnUrl: env.JAZZCASH_RETURN_URL,
    });

    res.status(201).json({
      status: 'success',
      data: {
        orderId: order._id,
        gatewayUrl: env.JAZZCASH_SANDBOX_URL,
        payload,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function jazzCashReturn(req, res, next) {
  try {
    const params = req.method === 'POST' ? req.body : req.query;
    const validation = validateReturnParams(params);

    const orderId = params.pp_BillReference;

    if (!orderId) {
      return res.redirect(`${env.CLIENT_URL}/checkout?payment=error&reason=missing_order`);
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.redirect(`${env.CLIENT_URL}/checkout?payment=error&reason=order_not_found`);
    }

    if (order.user.toString() !== req.user?.id && !req.user) {
      // For redirect flow, we can't always verify auth — rely on hash validation
    }

    if (!validation.valid) {
      order.payment.status = 'failed';
      order.payment.jazzcashResponseCode = params.pp_ResponseCode || '';
      order.payment.jazzcashResponseMessage = validation.message;
      order.status = 'cancelled';
      await order.save();
      return res.redirect(`${env.CLIENT_URL}/order/${orderId}/failure?reason=invalid_hash`);
    }

    order.payment.jazzcashResponseCode = validation.responseCode;
    order.payment.jazzcashResponseMessage = validation.responseMessage;
    order.payment.jazzcashRetrievalRefNo = validation.retrievalRefNo;

    if (order.payment.status === 'completed') {
      return res.redirect(`${env.CLIENT_URL}/order/${orderId}/success?provider=jazzcash`);
    }

    if (isJazzCashSuccess(validation.responseCode)) {
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
      order.status = 'confirmed';
      await order.save();

      await Cart.findOneAndUpdate(
        { user: order.user },
        { $set: { items: [], couponCode: '', couponDiscount: 0 } }
      );

      return res.redirect(`${env.CLIENT_URL}/order/${orderId}/success?provider=jazzcash`);
    }

    const paymentStatus = getJazzCashPaymentStatus(validation.responseCode);
    order.payment.status = paymentStatus;
    order.status = paymentStatus === 'cancelled' ? 'cancelled' : 'pending';
    await order.save();

    if (paymentStatus === 'cancelled') {
      return res.redirect(`${env.CLIENT_URL}/order/${orderId}/failure?reason=cancelled`);
    }

    return res.redirect(`${env.CLIENT_URL}/order/${orderId}/failure?reason=payment_failed`);
  } catch (error) {
    const orderId = req.body?.pp_BillReference || req.query?.pp_BillReference;
    if (orderId) {
      return res.redirect(`${env.CLIENT_URL}/checkout?payment=error&reason=server_error`);
    }
    return res.redirect(`${env.CLIENT_URL}/checkout?payment=error&reason=unknown`);
  }
}
