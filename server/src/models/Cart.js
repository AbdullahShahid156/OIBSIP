import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    pizzaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pizza',
      required: true,
    },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    size: { type: String, required: true },
    base: { type: String, required: true },
    baseName: { type: String, default: '' },
    sauce: { type: String, required: true },
    sauceName: { type: String, default: '' },
    cheese: { type: String, required: true },
    cheeseName: { type: String, default: '' },
    veggies: { type: Map, of: Number, default: {} },
    veggieNames: { type: Map, of: String, default: {} },
    qty: { type: Number, required: true, min: 1, max: 10 },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    prepTime: { type: Number, default: 10 },
    isCustomized: { type: Boolean, default: false },
    configurationId: { type: String, required: true },
  },
  { _id: true, timestamps: true }
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
    couponCode: { type: String, default: '' },
    couponDiscount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 });

cartSchema.methods.getSubtotal = function () {
  return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
};

cartSchema.methods.getMaxPrepTime = function () {
  if (this.items.length === 0) return 0;
  return Math.max(...this.items.map((item) => item.prepTime));
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
