/*
 * Premium Food Photography Asset Registry
 * All images sourced from Unsplash (free to use under Unsplash License)
 * https://unsplash.com/license
 *
 * Image optimization parameters:
 * ?fm=jpg&q=80&w=WIDTH&auto=format&fit=crop
 * - fm: format (jpg for photos)
 * - q: quality (80 = good balance)
 * - w: width (responsive)
 * - auto=format: auto WebP conversion
 * - fit=crop: crop to fill
 */

const UNSPLASH_BASE = 'https://images.unsplash.com';

function img(id, { w = 800, h = 600, q = 80 } = {}) {
  return `${UNSPLASH_BASE}/${id}?fm=jpg&q=${q}&w=${w}&h=${h}&auto=format&fit=crop`;
}

/* ══════════════════════════════════════════════════════════════
   PIZZA PHOTOGRAPHY — Top-down, studio-lit, premium quality
   ══════════════════════════════════════════════════════════════ */

export const PIZZA_PHOTOS = {
  margherita: {
    src: img('photo-1574071318508-1cdbab80d002', { w: 800, h: 800 }),
    srcLarge: img('photo-1574071318508-1cdbab80d002', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1574071318508-1cdbab80d002', { w: 400, h: 400 }),
    alt: 'Classic Margherita pizza with fresh basil, San Marzano tomatoes, and mozzarella',
    credit: 'Photo by Kampus Production on Unsplash',
  },
  pepperoni: {
    src: img('photo-1506354666786-959d6d497f1a', { w: 800, h: 800 }),
    srcLarge: img('photo-1506354666786-959d6d497f1a', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1506354666786-959d6d497f1a', { w: 400, h: 400 }),
    alt: 'Pepperoni pizza with perfectly curled cup-and-char pepperoni slices',
    credit: 'Photo by Sidral Mundet on Unsplash',
  },
  veggie: {
    src: img('photo-1743615357602-f0711d1bc06f', { w: 800, h: 800 }),
    srcLarge: img('photo-1743615357602-f0711d1bc06f', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1743615357602-f0711d1bc06f', { w: 400, h: 400 }),
    alt: 'Colorful vegetable pizza with bell peppers, zucchini, red onions, and melted cheese',
    credit: 'Photo by Brelyn Bashrum on Unsplash',
  },
  meat_lovers: {
    src: img('photo-1513104890138-7c749659a591', { w: 800, h: 800 }),
    srcLarge: img('photo-1513104890138-7c749659a591', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1513104890138-7c749659a591', { w: 400, h: 400 }),
    alt: 'Loaded meat lovers pizza with pepperoni, sausage, ham, and bacon',
    credit: 'Photo by Ivan Torres on Unsplash',
  },
  truffle_mushroom: {
    src: img('photo-1682117651369-3d68b963f3a9', { w: 800, h: 800 }),
    srcLarge: img('photo-1682117651369-3d68b963f3a9', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1682117651369-3d68b963f3a9', { w: 400, h: 400 }),
    alt: 'Gourmet truffle mushroom pizza with wild mushrooms, fontina cheese, and fresh thyme',
    credit: 'Photo by Jason Leung on Unsplash',
  },
  prosciutto_arugula: {
    src: img('photo-1748932123935-87690a44332c', { w: 800, h: 800 }),
    srcLarge: img('photo-1748932123935-87690a44332c', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1748932123935-87690a44332c', { w: 400, h: 400 }),
    alt: 'Prosciutto and arugula pizza with shaved Parmigiano-Reggiano and balsamic reduction',
    credit: 'Photo by Alexey Demidov on Unsplash',
  },
  diavola: {
    src: img('photo-1534308983496-4fabb1a015ee', { w: 800, h: 800 }),
    srcLarge: img('photo-1534308983496-4fabb1a015ee', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1534308983496-4fabb1a015ee', { w: 400, h: 400 }),
    alt: 'Spicy Diavola pizza with spicy salami, calabrian chili, and roasted peppers',
    credit: 'Photo by amirali mirhashemian on Unsplash',
  },
  quattro_formaggi: {
    src: img('photo-1513104890138-7c749659a591', { w: 800, h: 800 }),
    srcLarge: img('photo-1513104890138-7c749659a591', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1513104890138-7c749659a591', { w: 400, h: 400 }),
    alt: 'Quattro Formaggi pizza with mozzarella, gorgonzola, fontina, and parmigiano',
    credit: 'Photo by Ivan Torres on Unsplash',
  },
  bbq_chicken: {
    src: img('photo-1565299624946-b28f40a0ae38', { w: 800, h: 800 }),
    srcLarge: img('photo-1565299624946-b28f40a0ae38', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1565299624946-b28f40a0ae38', { w: 400, h: 400 }),
    alt: 'BBQ chicken pizza with grilled chicken, red onion, cilantro, and smoky BBQ sauce',
    credit: 'Photo by Sarah Pflug on Unsplash',
  },
  hawaiian: {
    src: img('photo-1562835155-a7c2a225e97d', { w: 800, h: 800 }),
    srcLarge: img('photo-1562835155-a7c2a225e97d', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1562835155-a7c2a225e97d', { w: 400, h: 400 }),
    alt: 'Hawaiian pizza with ham, pineapple chunks, and melted mozzarella',
    credit: 'Photo by bckfwd on Unsplash',
  },
  cheese: {
    src: img('photo-1574071318508-1cdbab80d002', { w: 800, h: 800 }),
    srcLarge: img('photo-1574071318508-1cdbab80d002', { w: 1200, h: 1200 }),
    srcThumb: img('photo-1574071318508-1cdbab80d002', { w: 400, h: 400 }),
    alt: 'Classic cheese pizza with golden mozzarella and San Marzano tomato sauce',
    credit: 'Photo by Kampus Production on Unsplash',
  },
  hero: {
    src: img('photo-1574071318508-1cdbab80d002', { w: 1400, h: 800 }),
    srcLarge: img('photo-1574071318508-1cdbab80d002', { w: 1920, h: 1080 }),
    srcThumb: img('photo-1574071318508-1cdbab80d002', { w: 600, h: 400 }),
    alt: 'Artisan crafted pizza with premium ingredients on a rustic wooden board',
    credit: 'Photo by Kampus Production on Unsplash',
  },
};

/* ══════════════════════════════════════════════════════════════
   INGREDIENT PHOTOGRAPHY — Real food photos for pizza builder
   ══════════════════════════════════════════════════════════════ */

export const INGREDIENT_PHOTOS = {
  mushrooms: {
    src: img('photo-1504674900247-0877df9cc836', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh sliced mushrooms',
  },
  bell_peppers: {
    src: img('photo-1563565375-f3fdfdbefa83', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh bell peppers',
  },
  red_onion: {
    src: img('photo-1587049352846-4a222e784d38', { w: 200, h: 200, q: 75 }),
    alt: 'Sliced red onions',
  },
  olives: {
    src: img('photo-1474979266404-7eaacbcd87c5', { w: 200, h: 200, q: 75 }),
    alt: 'Kalamata olives',
  },
  tomatoes: {
    src: img('photo-1546470427-0d4db154ceb8', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh cherry tomatoes',
  },
  spinach: {
    src: img('photo-1576045057995-568f588f82fb', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh baby spinach leaves',
  },
  jalapenos: {
    src: img('photo-1583119022894-919a384403d5', { w: 200, h: 200, q: 75 }),
    alt: 'Sliced jalapenos',
  },
  artichoke: {
    src: img('photo-1580291459949-34d2b4f48e9c', { w: 200, h: 200, q: 75 }),
    alt: 'Artichoke hearts',
  },
  arugula: {
    src: img('photo-1576045057995-568f588f82fb', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh arugula leaves',
  },
  caramelized_onion: {
    src: img('photo-1587049352846-4a222e784d38', { w: 200, h: 200, q: 75 }),
    alt: 'Caramelized onions',
  },
  sun_dried_tomato: {
    src: img('photo-1546470427-0d4db154ceb8', { w: 200, h: 200, q: 75 }),
    alt: 'Sun-dried tomatoes',
  },
  truffle_oil: {
    src: img('photo-1474979266404-7eaacbcd87c5', { w: 200, h: 200, q: 75 }),
    alt: 'Truffle oil',
  },
  pepperoni: {
    src: img('photo-1506354666786-959d6d497f1a', { w: 200, h: 200, q: 75 }),
    alt: 'Pepperoni slices',
  },
  chicken: {
    src: img('photo-1598103442097-8b74394b95c6', { w: 200, h: 200, q: 75 }),
    alt: 'Grilled chicken',
  },
  mozzarella: {
    src: img('photo-1486297678162-eb2c1ad55c1f', { w: 200, h: 200, q: 75 }),
    alt: 'Fresh mozzarella cheese',
  },
};

/* ══════════════════════════════════════════════════════════════
   CATEGORY MAPPING — Maps pizza category to photo
   ══════════════════════════════════════════════════════════════ */

export const PIZZA_BY_CATEGORY = {
  classic: PIZZA_PHOTOS.margherita,
  premium: PIZZA_PHOTOS.truffle_mushroom,
  vegetarian: PIZZA_PHOTOS.veggie,
  'meat-lovers': PIZZA_PHOTOS.meat_lovers,
  specialty: PIZZA_PHOTOS.diavola,
  signature: PIZZA_PHOTOS.quattro_formaggi,
};

/* ══════════════════════════════════════════════════════════════
   NAME MAPPING — Maps specific pizza name to photo
   ══════════════════════════════════════════════════════════════ */

export const PIZZA_BY_NAME = {
  'Margherita Classica': PIZZA_PHOTOS.margherita,
  'Margherita': PIZZA_PHOTOS.margherita,
  'Pepperoni Supreme': PIZZA_PHOTOS.pepperoni,
  'Truffle Mushroom': PIZZA_PHOTOS.truffle_mushroom,
  'Prosciutto & Arugula': PIZZA_PHOTOS.prosciutto_arugula,
  'Diavola Piccante': PIZZA_PHOTOS.diavola,
  'Quattro Formaggi': PIZZA_PHOTOS.quattro_formaggi,
  'BBQ Chicken': PIZZA_PHOTOS.bbq_chicken,
  'Hawaiian Classic': PIZZA_PHOTOS.hawaiian,
  'Four Cheese': PIZZA_PHOTOS.quattro_formaggi,
  'Garden Fresh': PIZZA_PHOTOS.veggie,
  'Meat Feast': PIZZA_PHOTOS.meat_lovers,
  'The Artisan': PIZZA_PHOTOS.cheese,
  'Mediterranean': PIZZA_PHOTOS.veggie,
  'Veggie Deluxe': PIZZA_PHOTOS.veggie,
  'Spicy Diavola': PIZZA_PHOTOS.diavola,
  'Pesto Chicken': PIZZA_PHOTOS.bbq_chicken,
  'Buffalo Blaze': PIZZA_PHOTOS.diavola,
};

export default PIZZA_PHOTOS;
