import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  pizzaId: {
    type: mongoose.Schema.Types.Mixed,
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
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  items: [orderItemSchema],
  summary: {
    itemCount: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    tax: { type: Number, required: true },
    couponCode: { type: String, default: '' },
    couponDiscount: { type: Number, default: 0 },
    total: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
  },
  address: {
    recipientName: String,
    phone: String,
    houseFlat: String,
    street: String,
    area: String,
    city: String,
    postalCode: String,
    label: String,
  },
  payment: {
    method: { type: String, default: 'razorpay' },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number },
    currency: { type: String, default: 'INR' },
    paidAt: { type: Date },
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
  },
  notes: { type: String, default: '', maxlength: 500 },
  estimatedDelivery: {
    min: { type: Number },
    max: { type: Number },
  },
  deliveredAt: { type: Date },
  cancelledAt: { type: Date },
  cancelReason: { type: String },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'payment.razorpayOrderId': 1 });
orderSchema.index({ 'payment.razorpayPaymentId': 1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
