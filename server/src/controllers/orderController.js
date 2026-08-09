import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import env from '../config/env.js';
import { AppError } from '../middleware/errorHandler.js';
import {
  createRazorpayOrder,
  verifyPaymentSignature,
  generateReceiptPrefix,
} from '../services/paymentService.js';

export async function createOrder(req, res, next) {
  try {
    const { addressId, notes } = req.body;

    const existingPending = await Order.findOne({
      user: req.user.id,
      status: 'pending',
      'payment.status': 'pending',
    }).sort({ createdAt: -1 });

    if (existingPending) {
      const age = Date.now() - existingPending.createdAt.getTime();
      if (age < 10 * 60 * 1000) {
        throw new AppError('You already have a pending order. Please complete or wait for it to expire.', 409);
      }
    }

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
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
    const receipt = `${generateReceiptPrefix()}_${req.user.id.slice(-6)}`;

    const razorpayOrder = await createRazorpayOrder(amountInPaise, receipt, {
      userId: req.user.id,
      itemCount: String(cart.items.length),
    });

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
        currency: 'INR',
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
        method: 'razorpay',
        status: 'pending',
        razorpayOrderId: razorpayOrder.id,
        amount: amountInPaise,
        currency: 'INR',
      },
      status: 'pending',
      notes: notes || '',
      estimatedDelivery: {
        min: maxPrepTime + 15,
        max: maxPrepTime + 30,
      },
    });

    res.status(201).json({
      status: 'success',
      data: {
        order: {
          _id: order._id,
          razorpayOrderId: razorpayOrder.id,
          razorpayKeyId: env.RAZORPAY_KEY_ID,
          amount: amountInPaise,
          currency: 'INR',
          summary: order.summary,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function verifyPayment(req, res, next) {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (order.user.toString() !== req.user.id) {
      throw new AppError('Unauthorized', 403);
    }

    if (order.payment.status === 'completed') {
      return res.status(200).json({
        status: 'success',
        data: { order: { _id: order._id, status: order.status } },
      });
    }

    if (order.payment.razorpayOrderId !== razorpayOrderId) {
      throw new AppError('Order ID mismatch', 400);
    }

    const isValid = verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature);
    if (!isValid) {
      order.payment.status = 'failed';
      order.status = 'cancelled';
      await order.save();
      throw new AppError('Payment verification failed', 400);
    }

    order.payment.status = 'completed';
    order.payment.razorpayPaymentId = razorpayPaymentId;
    order.payment.razorpaySignature = razorpaySignature;
    order.payment.paidAt = new Date();
    order.status = 'confirmed';
    await order.save();

    await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { items: [], couponCode: '', couponDiscount: 0 } }
    );

    res.status(200).json({
      status: 'success',
      data: {
        order: {
          _id: order._id,
          status: order.status,
          payment: order.payment,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw new AppError('Order not found', 404);
    if (order.user.toString() !== req.user.id) {
      throw new AppError('Unauthorized', 403);
    }

    res.status(200).json({
      status: 'success',
      data: { order },
    });
  } catch (error) {
    next(error);
  }
}

export async function getOrders(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find({ user: req.user.id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-payment.razorpaySignature'),
      Order.countDocuments({ user: req.user.id }),
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        orders,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
