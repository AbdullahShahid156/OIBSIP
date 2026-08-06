import mongoose from 'mongoose';
import dns from 'dns';
import dotenv from 'dotenv';

dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const pizzas = [
  {
    name: 'Classic Margherita',
    description: 'San Marzano tomatoes, fresh buffalo mozzarella, hand-torn basil, extra virgin olive oil on our signature Neapolitan crust.',
    category: 'classic',
    basePrice: 14.99,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 342,
    preparationTime: 12,
    tags: ['bestseller', 'traditional', 'simple'],
    isFeatured: true,
    isPopular: true,
    orderCount: 1250,
  },
  {
    name: 'Pepperoni Supreme',
    description: 'Double-layered cup-and-char pepperoni, aged mozzarella, smoked provolone, San Marzano tomato sauce.',
    category: 'classic',
    basePrice: 16.99,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 518,
    preparationTime: 14,
    tags: ['bestseller', 'meat', 'classic'],
    isFeatured: true,
    isPopular: true,
    orderCount: 2100,
  },
  {
    name: 'Truffle Mushroom',
    description: 'Wild porcini and shiitake mushrooms, black truffle cream, fontina cheese, fresh thyme, micro arugula.',
    category: 'premium',
    basePrice: 21.99,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 189,
    preparationTime: 18,
    tags: ['gourmet', 'mushroom', 'truffle'],
    isFeatured: true,
    isPopular: false,
    orderCount: 890,
  },
  {
    name: 'Spicy Diavola',
    description: 'Calabrian spicy salami, roasted red peppers, chili flakes, hot honey drizzle, mozzarella.',
    category: 'specialty',
    basePrice: 17.99,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 276,
    preparationTime: 15,
    tags: ['spicy', 'bold', 'honey'],
    isFeatured: true,
    isPopular: true,
    orderCount: 1580,
  },
  {
    name: 'Garden Fresh',
    description: 'Heirloom tomatoes, roasted bell peppers, kalamata olives, artichoke hearts, fresh basil, vegan mozzarella option.',
    category: 'vegetarian',
    basePrice: 15.99,
    isAvailable: true,
    rating: 4.5,
    reviewCount: 203,
    preparationTime: 14,
    tags: ['vegetarian', 'healthy', 'fresh'],
    isFeatured: false,
    isPopular: true,
    orderCount: 920,
  },
  {
    name: 'Prosciutto & Arugula',
    description: 'Prosciutto di Parma, wild arugula, shaved Parmigiano-Reggiano, lemon zest, balsamic reduction.',
    category: 'premium',
    basePrice: 19.99,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 156,
    preparationTime: 16,
    tags: ['elegant', 'fresh', 'italian'],
    isFeatured: false,
    isPopular: false,
    orderCount: 670,
  },
  {
    name: 'Meat Feast',
    description: 'Italian sausage, crispy bacon, grilled chicken, pepperoni, ground beef, mozzarella blend, BBQ base option.',
    category: 'meat-lovers',
    basePrice: 22.99,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 312,
    preparationTime: 20,
    tags: ['protein', 'hearty', 'meat'],
    isFeatured: true,
    isPopular: true,
    orderCount: 1820,
  },
  {
    name: 'BBQ Chicken',
    description: 'Smoky BBQ sauce, grilled chicken, red onions, cilantro, smoked gouda, crispy tortilla strips.',
    category: 'specialty',
    basePrice: 18.99,
    isAvailable: true,
    rating: 4.4,
    reviewCount: 234,
    preparationTime: 16,
    tags: ['bbq', 'chicken', 'smoky'],
    isFeatured: false,
    isPopular: true,
    orderCount: 1340,
  },
  {
    name: 'Four Cheese',
    description: 'Mozzarella, gorgonzola, fontina, Parmigiano-Reggiano, truffle honey, fresh rosemary.',
    category: 'premium',
    basePrice: 20.99,
    isAvailable: true,
    rating: 4.8,
    reviewCount: 167,
    preparationTime: 15,
    tags: ['cheese', 'gourmet', 'indulgent'],
    isFeatured: false,
    isPopular: false,
    orderCount: 780,
  },
  {
    name: 'Mediterranean',
    description: 'Sun-dried tomatoes, feta cheese, kalamata olives, roasted garlic, spinach, lemon-herb olive oil.',
    category: 'vegetarian',
    basePrice: 16.99,
    isAvailable: true,
    rating: 4.5,
    reviewCount: 198,
    preparationTime: 15,
    tags: ['mediterranean', 'vegetarian', 'fresh'],
    isFeatured: false,
    isPopular: false,
    orderCount: 640,
  },
  {
    name: 'Hawaiian Classic',
    description: 'Sweet pineapple chunks, smoked ham, mozzarella, our signature tomato sauce.',
    category: 'classic',
    basePrice: 15.99,
    isAvailable: true,
    rating: 4.2,
    reviewCount: 445,
    preparationTime: 13,
    tags: ['sweet', 'classic', 'controversial'],
    isFeatured: false,
    isPopular: true,
    orderCount: 1650,
  },
  {
    name: 'The Artisan',
    description: 'Fig jam base, gorgonzola, prosciutto, caramelized walnuts, arugula, balsamic glaze. Our chef\'s masterpiece.',
    category: 'signature',
    basePrice: 24.99,
    isAvailable: true,
    rating: 4.9,
    reviewCount: 89,
    preparationTime: 22,
    tags: ['artisan', 'gourmet', 'chef-special'],
    isFeatured: true,
    isPopular: false,
    orderCount: 420,
  },
  {
    name: 'Pesto Chicken',
    description: 'Basil pesto, grilled chicken, sun-dried tomatoes, pine nuts, mozzarella, fresh basil.',
    category: 'specialty',
    basePrice: 18.99,
    isAvailable: true,
    rating: 4.6,
    reviewCount: 210,
    preparationTime: 16,
    tags: ['pesto', 'chicken', 'nutty'],
    isFeatured: false,
    isPopular: false,
    orderCount: 880,
  },
  {
    name: 'Buffalo Blaze',
    description: 'Buffalo chicken, blue cheese crumbles, celery, spicy buffalo sauce, ranch drizzle.',
    category: 'specialty',
    basePrice: 17.99,
    isAvailable: true,
    rating: 4.5,
    reviewCount: 267,
    preparationTime: 15,
    tags: ['spicy', 'chicken', 'bold'],
    isFeatured: false,
    isPopular: true,
    orderCount: 1120,
  },
  {
    name: 'Veggie Deluxe',
    description: 'Grilled zucchini, eggplant, cherry tomatoes, roasted garlic, goat cheese, pesto, micro greens.',
    category: 'vegetarian',
    basePrice: 17.99,
    isAvailable: true,
    rating: 4.7,
    reviewCount: 145,
    preparationTime: 17,
    tags: ['vegetarian', 'grilled', 'gourmet'],
    isFeatured: false,
    isPopular: false,
    orderCount: 520,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas');

    const Pizza = (await import('./models/Pizza.js')).default;

    await Pizza.deleteMany({});
    console.log('Cleared existing pizzas');

    const created = await Pizza.insertMany(pizzas);
    console.log(`Seeded ${created.length} pizzas`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
