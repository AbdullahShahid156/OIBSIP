import { motion } from 'framer-motion';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center flex-shrink-0">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a7 7 0 0 1 7 7c0 2.5-1.3 4.7-3.3 6L12 18l-3.7-3C6.3 13.7 5 11.5 5 9a7 7 0 0 1 7-7z" />
          <circle cx="12" cy="9" r="2" fill="currentColor" />
        </svg>
      </div>
      <div className="bg-surface-100 dark:bg-white/[0.06] rounded-2xl rounded-tl-md px-4 py-3 flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-surface-400 dark:bg-white/30"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
}
