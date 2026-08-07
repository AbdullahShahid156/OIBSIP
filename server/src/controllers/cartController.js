import Cart from '../models/Cart.js';
import { AppError } from '../middleware/errorHandler.js';
import crypto from 'crypto';

function generateConfigId(item) {
  const str = `${item.pizzaId}-${item.size}-${item.base}-${item.sauce}-${item.cheese}-${JSON.stringify(Object.entries(item.veggies || {}).sort())}`;
  return crypto.createHash('md5').update(str).digest('hex');
}

export async function getCart(req, res, next) {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cart.items,
          couponCode: cart.couponCode,
          couponDiscount: cart.couponDiscount,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function addToCart(req, res, next) {
  try {
    const item = req.body;
    item.configurationId = generateConfigId(item);

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [item] });
    } else {
      const existingIdx = cart.items.findIndex(
        (ci) => ci.configurationId === item.configurationId
      );

      if (existingIdx !== -1) {
        const newQty = cart.items[existingIdx].qty + (item.qty || 1);
        if (newQty > 10) {
          throw new AppError('Maximum quantity per item is 10', 400);
        }
        cart.items[existingIdx].qty = newQty;
        cart.items[existingIdx].totalPrice = cart.items[existingIdx].unitPrice * newQty;
      } else {
        cart.items.push(item);
      }
    }

    await cart.save();

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cart.items,
          couponCode: cart.couponCode,
          couponDiscount: cart.couponDiscount,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { qty } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError('Cart not found', 404);

    const item = cart.items.id(req.params.itemId);
    if (!item) throw new AppError('Item not found in cart', 404);

    if (qty <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.qty = qty;
      item.totalPrice = item.unitPrice * qty;
    }

    await cart.save();

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cart.items,
          couponCode: cart.couponCode,
          couponDiscount: cart.couponDiscount,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError('Cart not found', 404);

    const item = cart.items.id(req.params.itemId);
    if (!item) throw new AppError('Item not found in cart', 404);

    cart.items.pull(req.params.itemId);
    await cart.save();

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cart.items,
          couponCode: cart.couponCode,
          couponDiscount: cart.couponDiscount,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError('Cart not found', 404);

    cart.items = [];
    cart.couponCode = '';
    cart.couponDiscount = 0;
    await cart.save();

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: [],
          couponCode: '',
          couponDiscount: 0,
          subtotal: 0,
          deliveryFee: 0,
          tax: 0,
          total: 0,
          maxPrepTime: 0,
          itemCount: 0,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function applyCoupon(req, res, next) {
  try {
    const { code } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError('Cart not found', 404);

    const coupons = {
      WELCOME10: { discount: 0.1, minOrder: 0, maxDiscount: 10, type: 'percentage' },
      SAVE5: { discount: 5, minOrder: 20, maxDiscount: 5, type: 'fixed' },
      PIZZA20: { discount: 0.2, minOrder: 30, maxDiscount: 15, type: 'percentage' },
      FREEDELIVERY: { discount: 4.99, minOrder: 0, maxDiscount: 4.99, type: 'delivery' },
    };

    const coupon = coupons[code.toUpperCase()];
    if (!coupon) {
      throw new AppError('Invalid coupon code', 400);
    }

    const subtotal = cart.getSubtotal();
    if (subtotal < coupon.minOrder) {
      throw new AppError(`Minimum order of $${coupon.minOrder} required for this coupon`, 400);
    }

    let discount = 0;
    if (coupon.type === 'percentage') {
      discount = Math.min(subtotal * coupon.discount, coupon.maxDiscount);
    } else if (coupon.type === 'fixed') {
      discount = coupon.discount;
    } else if (coupon.type === 'delivery') {
      discount = 4.99;
    }

    cart.couponCode = code.toUpperCase();
    cart.couponDiscount = Math.round(discount * 100) / 100;
    await cart.save();

    const newSubtotal = cart.getSubtotal();
    const deliveryFee = newSubtotal > 0 ? (newSubtotal >= 35 ? 0 : 4.99) : 0;
    const tax = newSubtotal * 0.08;
    const total = newSubtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      message: 'Coupon applied successfully',
      data: {
        cart: {
          items: cart.items,
          couponCode: cart.couponCode,
          couponDiscount: cart.couponDiscount,
          subtotal: newSubtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function removeCoupon(req, res, next) {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) throw new AppError('Cart not found', 404);

    cart.couponCode = '';
    cart.couponDiscount = 0;
    await cart.save();

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal > 0 ? (subtotal >= 35 ? 0 : 4.99) : 0;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    res.status(200).json({
      status: 'success',
      data: {
        cart: {
          items: cart.items,
          couponCode: '',
          couponDiscount: 0,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          total: Math.round(total * 100) / 100,
          maxPrepTime: cart.getMaxPrepTime(),
          itemCount: cart.items.length,
        },
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function validateCheckout(req, res, next) {
  try {
    const { addressId } = req.body;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    const user = await import('../models/User.js').then((m) => m.default.findById(req.user.id));
    if (!user) throw new AppError('User not found', 404);

    const address = user.addresses.id(addressId);
    if (!address) throw new AppError('Invalid delivery address', 400);

    const subtotal = cart.getSubtotal();
    const deliveryFee = subtotal >= 35 ? 0 : 4.99;
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax - cart.couponDiscount;

    res.status(200).json({
      status: 'success',
      data: {
        valid: true,
        summary: {
          itemCount: cart.items.length,
          subtotal,
          deliveryFee,
          tax: Math.round(tax * 100) / 100,
          couponDiscount: cart.couponDiscount,
          total: Math.round(total * 100) / 100,
          address: {
            id: address._id,
            label: address.label,
            street: address.street,
            city: address.city,
          },
          maxPrepTime: cart.getMaxPrepTime(),
        },
      },
    });
  } catch (error) {
    next(error);
  }
}
