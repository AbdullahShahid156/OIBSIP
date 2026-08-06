import mongoose from 'mongoose';

const pizzaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pizza name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['classic', 'premium', 'vegetarian', 'specialty', 'meat-lovers', 'signature'],
      lowercase: true,
    },
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      default: null,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    preparationTime: {
      type: Number,
      required: [true, 'Preparation time is required'],
      min: [5, 'Minimum preparation time is 5 minutes'],
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    orderCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

pizzaSchema.index({ name: 'text', description: 'text', tags: 'text' });
pizzaSchema.index({ category: 1 });
pizzaSchema.index({ isAvailable: 1 });
pizzaSchema.index({ isFeatured: 1 });
pizzaSchema.index({ rating: -1 });
pizzaSchema.index({ orderCount: -1 });

const Pizza = mongoose.model('Pizza', pizzaSchema);

export default Pizza;
