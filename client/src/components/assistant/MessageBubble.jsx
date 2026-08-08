import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

export default function MessageBubble({ message, onCustomize, onAddToCart }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`flex items-start gap-3 px-4 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand-500/20">
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L12 18l-3.7-3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
            <circle cx="12" cy="9" r="2" fill="currentColor" />
          </svg>
        </div>
      )}

      <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-2`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-tr-md shadow-lg shadow-brand-500/20'
              : 'bg-surface-100 text-surface-800 rounded-tl-md dark:bg-white/[0.06] dark:text-white/90'
          }`}
        >
          {message.text}
        </div>

        {message.recommendations && message.recommendations.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hidden w-full">
            {message.recommendations.map((rec) => (
              <ProductCard
                key={rec._id}
                pizza={rec}
                onCustomize={onCustomize}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-surface-200 dark:bg-white/10 flex items-center justify-center flex-shrink-0">
          <svg className="w-4 h-4 text-surface-500 dark:text-white/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}
