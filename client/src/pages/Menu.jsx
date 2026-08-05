import { motion } from 'framer-motion';
import { useDarkMode } from '../hooks';
import { cn } from '../utils/helpers';
import { StaggerContainer, StaggerItem } from '../components/ui/AnimationWrapper';

const categories = [
  { id: 'all', label: 'All Pizzas' },
  { id: 'classic', label: 'Classic' },
  { id: 'premium', label: 'Premium' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'specialty', label: 'Specialty' },
];

const placeholderPizzas = [
  {
    id: 1,
    name: 'Margherita',
    description: 'San Marzano tomatoes, fresh mozzarella, basil',
    price: 14.99,
    category: 'classic',
    badge: 'Classic',
  },
  {
    id: 2,
    name: 'Pepperoni',
    description: 'Cup & char pepperoni, mozzarella, tomato sauce',
    price: 16.99,
    category: 'classic',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Truffle Mushroom',
    description: 'Wild mushrooms, truffle cream, fontina',
    price: 19.99,
    category: 'premium',
    badge: "Chef's Pick",
  },
  {
    id: 4,
    name: 'Diavola',
    description: 'Spicy salami, chili flakes, hot honey',
    price: 17.99,
    category: 'specialty',
    badge: 'Spicy',
  },
  {
    id: 5,
    name: 'Garden Fresh',
    description: 'Bell peppers, olives, artichokes, onions',
    price: 15.99,
    category: 'vegetarian',
    badge: 'Veggie',
  },
  {
    id: 6,
    name: 'Prosciutto & Arugula',
    description: 'Prosciutto di Parma, fresh arugula, parmesan',
    price: 18.99,
    category: 'premium',
    badge: 'Premium',
  },
];

export default function Menu() {
  const { isDark } = useDarkMode();

  return (
    <div>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className={cn(
          "absolute inset-0 transition-colors duration-300",
          isDark ? "bg-gradient-to-b from-dark-925 to-dark-950" : "bg-gradient-to-b from-surface-50 to-white"
        )} />
        <div className={cn(
          "absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[150px] transition-colors duration-300",
          isDark ? "bg-brand-500/8" : "bg-brand-500/10"
        )} />
        <div className={cn(
          "absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full blur-[120px] transition-colors duration-300",
          isDark ? "bg-accent-500/5" : "bg-accent-500/10"
        )} />

        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-2xl mx-auto"
          >
            <span className="badge-brand mb-4 inline-flex">Our Menu</span>
            <h1 className={cn(
              "text-4xl md:text-5xl font-display font-bold mb-4 tracking-tight",
              isDark ? "text-white" : "text-surface-900"
            )}>
              Discover Our{' '}
              <span className="text-gradient-brand">Pizzas</span>
            </h1>
            <p className={cn(
              "text-lg",
              isDark ? "text-white/40" : "text-surface-500"
            )}>
              Handcrafted with premium ingredients and baked to perfection
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={cn(
              "flex flex-wrap justify-center gap-2 mb-12 p-1.5 rounded-2xl border max-w-fit mx-auto",
              isDark ? "bg-dark-900/60 border-white/[0.04]" : "bg-surface-100 border-surface-200"
            )}
          >
            {categories.map((category) => (
              <button
                key={category.id}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                  category.id === 'all'
                    ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/25'
                    : isDark
                      ? 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                      : 'text-surface-500 hover:text-surface-900 hover:bg-white'
                )}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {placeholderPizzas.map((pizza) => (
              <StaggerItem key={pizza.id}>
                <div className={cn(
                  "group overflow-hidden transition-all duration-500",
                  isDark
                    ? "bg-dark-900/80 backdrop-blur-xl rounded-2xl border border-white/[0.06] hover:border-brand-500/20 hover:shadow-glow-brand-sm"
                    : "bg-white rounded-2xl border border-surface-200 hover:border-brand-200 hover:shadow-lg"
                )}>
                  <div className={cn(
                    "relative aspect-[4/3] overflow-hidden",
                    isDark ? "bg-gradient-to-br from-dark-850 to-dark-900" : "bg-gradient-to-br from-surface-100 to-surface-50"
                  )}>
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className={cn(
                        "w-20 h-20 group-hover:scale-110 transition-all duration-500",
                        isDark ? "text-white/[0.06] group-hover:text-brand-500/20" : "text-surface-200 group-hover:text-brand-500/30"
                      )} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={cn(
                        "badge text-xs",
                        pizza.badge === 'Popular' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30' :
                        pizza.badge === "Chef's Pick" ? 'bg-accent-500/20 text-accent-400 border border-accent-500/30' :
                        pizza.badge === 'Spicy' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        pizza.badge === 'Veggie' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        isDark ? 'bg-white/10 text-white/70 border border-white/20' : 'bg-surface-100 text-surface-600 border border-surface-200'
                      )}>
                        {pizza.badge}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className={cn(
                        "text-card-title font-display font-semibold transition-colors",
                        isDark ? "text-white group-hover:text-brand-400" : "text-surface-900 group-hover:text-brand-600"
                      )}>
                        {pizza.name}
                      </h3>
                      <span className={cn(
                        "text-lg font-bold shrink-0",
                        isDark ? "text-white" : "text-surface-900"
                      )}>
                        ${pizza.price}
                      </span>
                    </div>
                    <p className={cn(
                      "text-sm mb-4 line-clamp-2",
                      isDark ? "text-white/40" : "text-surface-500"
                    )}>
                      {pizza.description}
                    </p>
                    <button className={cn(
                      "w-full py-3 font-medium rounded-xl border transition-all duration-300",
                      isDark
                        ? "bg-white/[0.04] hover:bg-brand-500/20 text-white/70 hover:text-brand-400 border-white/[0.06] hover:border-brand-500/30"
                        : "bg-surface-50 hover:bg-brand-50 text-surface-600 hover:text-brand-600 border-surface-200 hover:border-brand-200"
                    )}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <p className={cn(
              "text-sm",
              isDark ? "text-white/30" : "text-surface-400"
            )}>
              More pizzas launching soon. Stay tuned for updates.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
